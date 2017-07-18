const request = require('request')
const events = require('events')
class eventEmitter extends events {}
const md5 = require('md5')
const player = require('play-sound')()
const { watch, unwatch } = require('melanke-watchjs')

let state = {
	scripted: false,//true,
	asleep: true,
	speaking: false,
	asking: null
}
let lines = {}
let qs = {}

const notify = cb => {
	player.play('./notify.mp3', {timeout: 1000}, err => {
		if(err) console.log('notify sound err:', err)
		else if (cb) cb()
	})
}
const validIfly = a => {
	return a.indexOf('提倡文明語言') === -1
}
const greet = () => {
	return [
		'你好阿!需要幫忙嗎',
		'哈囉，需要幫忙嗎',
		'嗨，需要幫忙嗎'
	][Math.floor(Math.random()*3)]
}
const unknown = () => {
	return [
		'不好意思這個我還沒學會呢，能再試試看嗎?',
		'抱歉這個我還不會這個呢，也可能是我沒有聽清楚問題',
		'抱歉，我還不會回答這個問題，也有可能是沒聽清楚喔'
	][Math.floor(Math.random()*3)]
}

// event emitters
const stt = require('./stt').javaStt()
const speaker = require('./unitySpeak')(state)
const waker = new eventEmitter() // dummy waker
const talker = new eventEmitter() 

// promises
const ttWav = require('./ttWav')


const iot = require('./iot')
const ifly = require('./iflyQA')()		
const fbTextReply = require('./fbTextReply')


const scripts = ['預設問句']
const hardcode = q => {
	for (let i = 0; i < scripts.length; i++) {
		if ( q.indexOf(scripts[i]) > -1 )
			return scripts[i]
	}
	return null
}

waker.on('wake', (payload) => {
	if(state.asleep) {
		state.asleep = false
		if(!payload) stt.emit('start')
		else if(Object.keys(lines).length === 0) {
			console.log('greeting:',payload.greeting)
			state.asking = 'greet'
			qs = {
				watson: 'greeting',
				ifly: 'greeting'
			}
			talker.emit('talk', greet())
		}
	}

})
waker.on('sleep', () => {
	if(!state.asleep) {
		state.asleep = true
		speaker.emit('status', 'sleeping')
	}
})

stt.on('result', result => {
	const res = result.replace(/\s/g, '')
	console.log('~'+res+'~')
	if (!state.speaking && !state.asleep) {
		if (res && res.length > 1 && res !== '。') {
			const mid = md5(res+String(new Date()))
			qs = {
				ifly: null,
				watson: null
			}
			state.speaking = true
			state.asking = mid
			const q = res.replace(/吃面/ig,'吃麵')
			speaker.emit('status', 'thinking')
			speaker.emit('question', q)


			const scripted = hardcode(q)
			if (scripted) {
				let scriptLine = ''
				switch(scripted) {
					default:
						scriptLine = '預設對談'
						break
				}
				//notify(()=>{})
				talker.emit('talk', scriptLine)
			} else {
				notify()
				console.log('to publish:', q)
				iot.publish('iot-2/evt/text/fmt/json', JSON.stringify({data:q, mid:mid}) )
				ifly.emit('q',q)
				setTimeout(() => {
					console.log('timeout check', qs.watson? 1:0, qs.ifly? 1:0)
					const w = qs.watson? true: false
					const i = qs.ifly && qs.ifly !== 'noanswer'? true: false

					if( state.asking && (!w || !i ) ) {
						console.log('5s time up watson')
						qs.watson = 'noreply'
						qs.ifly = 'noansewr'
						/*if (!w && !i) talker.emit('talk', unknown())
						else */if (Object.keys(lines).length === 0) speaker.emit('finish')
					}
				}, 4000)
			}
		} else {
			stt.emit('start')
		}
	}	// end of listener
})

iot.on('message', (topic, payloadBuffer) =>　{
	const payload = JSON.parse(payloadBuffer)
	console.log(payload)

	if (payload.data) {
		const {hasAnswer, help} = payload.data
		const mid = payload.prev.mid
		let { speech, media } = fbTextReply(payload)


		if (speech && speech !== 'nulltext' && mid === state.asking && state.speaking && speech.length < 70) {
		  	if(payload.type === 'restaurant' || payload.type === 'location') qs.ifly = 'iot'
		  	qs.watson = speech
			request.post({
			  headers: {'content-type' : 'application/x-www-form-urlencoded'},
			  url:     'http://119.81.236.205:3998/chzw',
			  body:    "text="+speech
			}, function(error, response, body){
				console.log('chzw:',body)
				speech = body
				console.log('watson A:',speech,'| hasA:',hasAnswer, qs)
				if (hasAnswer !== undefined && hasAnswer === false) {
					if(qs.ifly && qs.ifly === 'noanswer' && speech) {
						console.log('noanswer watson play')
						talker.emit('talk', speech)
					} else watch(qs, 'ifly', (prop,action, val) => {
						if (val === 'noanswer' && speech) {
							console.log('noanswer watson play')
							talker.emit('talk', speech)
						}
						unwatch(qs, 'ifly')
					})
				} else talker.emit('talk', speech, media)
			})
		} else if ( payload.type !== 'review' && state.speaking && mid === state.asking) {
			qs.watson = 'nullreply'
			talker.emit('talk', '')
		}	
	} else if ( payload.wake !== undefined ) {
		if (payload.wake) waker.emit('wake', payload)
		else waker.emit('sleep')
	} else if ( payload.line ) {
		state.asking = 'script'
		talker.emit('talk', payload.line)
	}
	
})

ifly.on('iot', res => {
	console.log('ifly iot:', res)
	let p = JSON.parse(res.payload)
	p.mid = state.asking
	//qs.ifly = 'iot'
	iot.publish(res.topic, JSON.stringify(p))
})
ifly.on('a', answer => {
	console.log('ifly A:', answer)
	if(answer && validIfly(answer) && answer.length < 40) {
		if (answer.indexOf('為你找尋') > -1) return
		qs.ifly = answer
		talker.emit('talk', answer)
	} else qs.ifly = 'noanswer'
})


talker.on('talk', (line, media) => {
	console.log('talker get', line)
	const id = md5(String(new Date()))
	if(line) ttWav(line, 'toplay')
	.catch( err => {
		console.log('ttWav err:',err)
	}).then( name => {
		const cue = (prop, action, newQ) => {
			console.log('watch change', line, newQ, id)
			if( newQ === 0 ) {
				console.log('to speak:', line)
				speaker.emit('speak', name, line)
				if (media) speaker.emit('display', media)
				unwatch(lines, id)
			}
		}
		console.log('ttWav success:', line, name)
		watch(lines, id, cue)
		lines[id] = Object.keys(lines).length-1	
	})
})

speaker.on('finish', () => {
	let hasNext = false
	Object.keys(lines).map( l => {
		if(lines[l] === 0 ) {
			delete lines[l]
		} else {
			lines[l] -= 1
			hasNext = true
		}
	})
	const scripted = state.asking === 'script'
	console.log('scripted:',scripted)
	console.log('on finish:',qs.watson, qs.ifly, hasNext )
	if (!hasNext && qs.watson && qs.ifly && state.asking || scripted) {
		state.speaking = hasNext
		state.asking = null
		//notify( () => {
		speaker.emit('reset', () => {
			if(!state.asleep) {
				stt.emit('start')
				if (!scripted) notify()
			}
		})
		//})
	}
	//if (!state.asleep)
	//	stt.emit('start')
})

module.exports = {
	wake: () => waker.emit('wake'),
	sleep: () => waker.emit('sleep')
}