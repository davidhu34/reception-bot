const wfi = require('wav-file-info')
const fs = require('fs')
const events = require('events')
class eventEmitter extends events {}
const { wavPath, speakPath, subtitlePath, displayPath, statusPath } = require('../configs')
const player = require('play-sound')()

module.exports = state => {
	const play = dir =>
		player.play(dir, err => {
			if (err) console.log('notify sound err:', err)
			else speaker.emit('finish')
		})

	const speaker = new eventEmitter()
	speaker.on('question', q => {
		const line = 'Q:\"'+q+'\"'
		fs.writeFile(subtitlePath, line/*'thinking'*/, 'ucs2', err => {
			if (err) throw err
		})
	})
	speaker.on('speak', (name, line) => {
		const w = name+'.wav'
		//play(wavPath(name))/*
		wfi.infoByFilename(wavPath(name), (err, info) => {
			if (err) console.log(err)
			fs.writeFile(speakPath, w, (err) => {
				if(err) return console.log(err)
				console.log('wrote for Unity: ', w)
				setTimeout( () => {
					speaker.emit('finish')
				}, (info.duration+1)*1000)
			})
			fs.writeFile(subtitlePath, line, 'ucs2', err => {
				if (err) throw err
			})
			/*fs.writeFile(statusPath, 'speaking', 'ucs2', err => {
				if (err) throw err
			})*/
		})
	})

	speaker.on('display', media => {
		fs.writeFile(displayPath, media, 'ucs2', err => {
			if(err) return console.log(err)
			console.log('wrote media for Unity: ', media)
		})
	})
	speaker.on('status', status => {
		fs.writeFile(statusPath, status, 'ucs2', err => {
			if(err) throw err
		})
	})

	speaker.on('reset', next => {
		fs.writeFile(
			subtitlePath,
			state.scripted? '-----listening-----'
				:state.asleep?'sleeping':'-----listening-----',
			'ucs2', err => {
				if (err) throw err
				else next()
			}
		)
		setTimeout(() => {
			/*fs.writeFile(statusPath, state.scripted? 'listening':state.asleep?'sleeping':'listening', 'ucs2', err => {
				if (err) throw err
			})*/
			fs.writeFile(displayPath, 'null', 'ucs2', err => {
				if (err) throw err
			})
		}, 300)
	})
	return speaker
}
