const ffmpeg = require('fluent-ffmpeg')
//const sourceMP3 = './mp3s/speech.mp3'
const mp3Path = name => './mp3s/'+name+'.mp3'
const wavPath = name => './wavs/'+name+'.wav'

const ffmpegPath = './ffmpeg/bin/ffmpeg.exe'
const ffprobePath ='./ffmpeg/bin/ffprobe.exe'

const convert = (file, toWav) => new Promise( (resolve, reject) => {
	let source = ''
	let format = ''
	let dest = ''

	if (toWav) {
		source = mp3Path(file)
		format = 'wav'
		dest = wavPath(file)
	} else {
		source = wavPath(file)
		format = 'mp3'
		dest = mp3Path(file)
	}

	ffmpeg(source)
	.setFfmpegPath(ffmpegPath)
	.setFfprobePath(ffprobePath)
	.toFormat('wav')
	.save(dest)
	.on('error', (err) => {
	    reject('ffmpeg err: ' + err.message)
	})
	.on('progress', (progress) => {
	    console.log('Audio converting:', progress.targetSize+' KB converted')
	})
	.on('end', (stdout, stderr) => {
		//console.log('stdout',stdout)
		//console.log('stderr',stderr)
	    console.log('Audio converted!')
	    resolve(file)
	})
})


module.exports = {
	MP3toWAV: (file) => convert(file, true),
	WAVtoMP3: (file) => convert(file, false)
}