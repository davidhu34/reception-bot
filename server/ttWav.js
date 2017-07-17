const md5 = require('md5')
const fs = require('fs')
const { MP3toWAV, WAVtoMP3 } = require('./ffmpeg')
const { ttMP3 } = require('./googleTranslate')
const { wavPath } = require('./configs')

//const fileName = 'test'
//const content = '九四八七九四狂'

module.exports = (content, fileName) => {
	const speech = content.replace(/~/ig,'')
	const answer = md5(speech)
	return (fs.existsSync( wavPath(answer) ))?
		new Promise( resolve => resolve(answer) )
	: ttMP3(speech, answer)		// ttMP3 promise
		.catch( err => {
			return new Promise(
				(resolve, reject) => reject('ttMP3 err:',err)
			)
		}).then( name => {
			return MP3toWAV(name)	// conversion promise
		})
}