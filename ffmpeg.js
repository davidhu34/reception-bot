const ffmpeg = require('fluent-ffmpeg')
//const sourceMP3 = './mp3s/speech.mp3'
const mp3Path = name => './mp3s/'+name+'.mp3'
const wavPath = name => './wavs/'+name+'.wav'

const ffmpegPath = './ffmpeg/bin/ffmpeg.exe'
const ffprobePath ='./ffmpeg/bin/ffprobe.exe'

const convert = (file, toWav, callback) => {
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
	    console.log('Audio convert err:', err.message)
	})
	.on('progress', (progress) => {
	    console.log('Audio converting:', progress.targetSize+' KB converted')
	})
	.on('end', (stdout, stderr) => {
		console.log('stdout',stdout)
		//console.log('stderr',stderr)
	    console.log('Audio converted!')
	    callback()
	})
}


module.exports = {
	MP3toWAV: (file, cb) => convert(file, true, cb),
	WAVtoMP3: (file, cb) => convert(file, false, cb)
}