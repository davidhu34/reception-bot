const { MP3toWAV, WAVtoMP3 } = require('./ffmpeg')
const { tts } = require('./googleTranslate') 

const fileName = 'test'
const content = '九四八七九四狂'

tts(content, fileName)		// tts promise
.catch( err => {
	console.log('tts err:',err)
}).then( name => {
	return MP3toWAV(name)	// conversion promise
}).catch( err => {
	console.log('Audio convert err:',err)
}).then( name => {
	console.log('converted to '+name+'.wav')
})