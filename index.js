var ffmpeg = require('fluent-ffmpeg');
var track = './lib/wavs/speech.mp3';//your path to source file

ffmpeg(track)
.setFfmpegPath('./ffmpeg/bin/ffmpeg.exe')
.setFfprobePath('./ffmpeg/bin/ffprobe.exe')
.toFormat('wav')
.on('error', function (err) {
    console.log('An error occurred: ' + err.message);
})
.on('progress', function (progress) {
    // console.log(JSON.stringify(progress));
    console.log('Processing: ' + progress.targetSize + ' KB converted');
})
.on('end', function () {
    console.log('Processing finished !');
})
.save('./hello.wav');//path where you want to save your file