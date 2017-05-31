const { MP3toWAV, WAVtoMP3 } = require('./ffmpeg')
const { ttMP3 } = require('./googleTranslate') 

//const fileName = 'test'
//const content = '九四八七九四狂'

module.exports = (content, fileName) =>
	ttMP3(content, fileName)		// ttMP3 promise
	.catch( err => {
		console.log('tts err:',err)
	}).then( name => {
		return MP3toWAV(name)		// conversion promise
	})