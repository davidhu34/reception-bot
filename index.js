const { MP3toWAV, WAVtoMP3 } = require('./ffmpeg')

MP3toWAV('speech', () => {
	console.log('converted "speech"')
})