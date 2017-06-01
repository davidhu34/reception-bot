const md5 = require('md5')
const fs = require('fs')
const { MP3toWAV, WAVtoMP3 } = require('./ffmpeg')
const { ttMP3 } = require('./googleTranslate')

//const fileName = 'test'
//const content = '九四八七九四狂'

module.exports = (content, fileName) => {
	const answer = md5(content)
	return (fs.existsSync('wavs/'+answer+'.wav'))?
		new Promise( (resolve, reject) => {
			if (true) resolve(answer)
			else reject(answer)
		})
	: ttMP3(content, answer)		// ttMP3 promise
		.catch( err => {
			console.log('ttMP3 err:',err)
		}).then( name => {
			return MP3toWAV(name)	// conversion promise
		})
}