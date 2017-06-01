const fs = require('fs')
const request = require('request')
const qstr = require('querystring')

const { mp3Path, wavPath } = require('./configs')

const ttMP3 = (text, fileName) => new Promise( (resolve, reject) => {
	const params = {
		q: text,
		ie: 'UTF-8',
		tl: 'zh',
		total: 1,
		idx: 0,
		textlen: 32,
		client: 'tw-ob',
	}

	const writeStream = fs.createWriteStream(mp3Path(fileName))
	writeStream.on('finish', () => {
		console.log('Google translate tts get.')
		resolve(fileName)
	})

	request.get({
		url: 'http://translate.google.com/translate_tts?' + qstr.stringify(params)
	}).on('err', err => {
		reject('Google translate API err: ' + err)
	}).pipe(writeStream)
	
})

module.exports = {
	ttMP3: ttMP3
}