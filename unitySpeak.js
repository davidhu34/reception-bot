const wfi = require('wav-file-info')
const fs = require('fs')
const events = require('events')
class eventEmitter extends events {}

const speaker = new eventEmitter()
speaker.on('speak', name => {
	wfi.infoByFilename('wavs/'+name+'.wav', (err, info) => {
		if (err) console.log(err)
		fs.writeFile("wav/wavname.txt", name, (err) => {
			if(err) return console.log(err)
			console.log('wrote for Unity: ', name)
			setTimeout( () => {
				speaker.emit('finish')
			}, (info.duration+1)*1000)
		})
	})
})

module.exports = speaker