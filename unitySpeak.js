const wfi = require('wav-file-info')
const fs = require('fs')
const events = require('events')
class eventEmitter extends events {}

const speaker = new eventEmitter()
speaker.on('speak', name => {
	const w = name+'.wav'
	wfi.infoByFilename('wavs/'+w, (err, info) => {
		if (err) console.log(err)
		fs.writeFile("wavs/playing.txt", w, (err) => {
			if(err) return console.log(err)
			console.log('wrote for Unity: ', w)
			setTimeout( () => {
				speaker.emit('finish')
			}, (info.duration+1)*1000)
		})
	})
})

module.exports = speaker