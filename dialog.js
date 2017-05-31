const request = require('request')
const events = require('events')
class eventEmitter extends events {}
const md5 = require('md5')
const player = require('play-sound')()
const notify = cb => {
	player.play('./notify.mp3', {timeout: 1000}, err => {
		if(err) console.log('notify sound err:', err)
		else cb()
	})
}
const { watch, unwatch } = require('melanke-watchjs')

// event emitters
const stt = require('./stt').javaStt()
const speaker = require('./unitySpeak')
const waker = new eventEmitter() // dummy waker
const talker = new eventEmitter() 

// promises
const ttWav = require('./ttWav')


const conversation = require('./conversation')
const ifly = require('./iflyQA')()		
const fbTextReply = require('./fbTextReply')

let state = {
	asleep: false,//true,
	speaking: false,
	asking: null
}
let lines = {}
let qs = {}

const scripts = ['預設問句']
const hardcode = q => {
	for (let i = 0; i < scripts.length; i++) {
		if ( q.indexOf(scripts[i]) > -1 )
			return scripts[i]
	}
	return null
}

waker.on('wake', () => {
	if(state.asleep) {
		notify(() => {
			//light.emit('lit', 'on')
			stt.emit('start')
			state.asleep = false
		})
	}
})

stt.on('result', result => {
	const res = result.replace(/\s/g, '')
	console.log('~'+res+'~')
	if (!state.speaking) {
		if (res && res !== '。') {
			qs = {
				ifly: null,
				watson: null
			}
			state.speaking = true
			state.asking = mid
		
			const scripted = hardcode(res)
			if (scripted) {
				let scriptLine = ''
				switch(scripted) {
					default:
						scriptLine = '預設對談'
						break
				}
				const mid = md5(res+String(new Date()))
				//notify(()=>{})
				talker.emit('talk', scriptLine)
			} else {
				const mid = md5(res+String(new Date()))
				//notify(()=>{})
				console.log('to publish:', res)
				conversation.publish('iot-2/evt/text/fmt/json', JSON.stringify({data:res, mid:mid}) )
				setTimeout(() => {
					if(!qs.watson) {
						console.log('6s time up watson')
						qs.watson = 'noreply'
						talker.emit('talk','')
					}
				},6000)
				ifly.emit('q',res)
			}
		} else {
			stt.emit('start')
		}
	}	// end of listener
})

conversation.on('message', (topic, payloadBuffer) =>　{
	const payload = JSON.parse(payloadBuffer)
	console.log(payload)
	const {hasAnswer, help} = payload.data
	const mid = payload.prev.mid
	let speech = fbTextReply(payload)
  	qs.watson = speech

	if (speech && mid === state.asking && state.speaking) {
		request.post({
		  headers: {'content-type' : 'application/x-www-form-urlencoded'},
		  url:     'http://119.81.236.205:3998/chzw',
		  body:    "text="+speech
		}, function(error, response, body){
			console.log('chzw:',body)
			speech = body
			console.log('watson A:',speech,'| hasA:',hasAnswer)
			if (hasAnswer !== undefined && hasAnswer === false) {
				watch(qs, 'ifly', (prop,action, val) => {
					if (val === 'noanswer' && speech) {
						console.log('noanswer watson play')
						talker.emit('talk', speech)
					}
					unwatch(qs, 'ifly')
				})
			} else talker.emit('talk', speech)
		})
	} else if ( payload.type !== 'review' && state.speaking && mid === state.asking) {
		qs.watson = 'nullreply'
		talker.emit('talk', '')
	}
})

ifly.on('iot', res => {
	console.log('ifly iot:', res)
	let p = JSON.parse(res.payload)
	p.mid = state.asking
	//qs.watson = null
	conversation.publish(res.topic, JSON.stringify(p))
})
ifly.on('a', answer => {
	console.log('ifly A:', answer)
	if(answer) {
		qs.ifly = answer
		talker.emit('talk', answer)
	} else qs.ifly = 'noanswer'
})


talker.on('talk', line => {
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
				speaker.emit('speak', name)
				unwatch(lines, id)
			}
		}
		console.log('ttWav success:', line)
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
	console.log('on finish:',qs.watson, qs.ifly, hasNext )
	if (!hasNext && qs.watson && qs.ifly) {
		state.speaking = hasNext
		state.asking = null
		notify( () => {
			stt.emit('start')
		})
	}
	//if (!state.asleep)
	//	stt.emit('start')
})
