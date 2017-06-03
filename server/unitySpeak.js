const wfi = require('wav-file-info')
const fs = require('fs')
const events = require('events')
class eventEmitter extends events {}
const { wavPath, unityPath } = require('./configs')
const player = require('play-sound')()

const play = dir => 
	player.play(dir, err => {
		if (err) console.log('notify sound err:', err)
		else speaker.emit('finish')
	})

const speaker = new eventEmitter()

speaker.on('speak', name => {
	const w = name+'.wav'
	play(wavPath(name))/*
	wfi.infoByFilename(wavPath(name), (err, info) => {
		if (err) console.log(err)
		fs.writeFile(unityPath, w, (err) => {
			if(err) return console.log(err)
			console.log('wrote for Unity: ', w)
			setTimeout( () => {
				speaker.emit('finish')
			}, (info.duration+0.5)*1000)
		})
	})*/
})

module.exports = speaker