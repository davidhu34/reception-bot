const { MP3toWAV, WAVtoMP3 } = require('./ffmpeg')
const { ttMP3 } = require('./googleTranslate')
const dialog = require('./dialog')

//dialog.sleep()
dialog.wake()

/*
const fileName = 'test'
const content = '九四八七九四狂'

return ttMP3(content, fileName)		// tts promise
.catch( err => {
	console.log('tts err:',err)
}).then( name => {
	return MP3toWAV(name)	// conversion promise
}).catch( err => {
	console.log('Audio convert err:',err)
})*/
