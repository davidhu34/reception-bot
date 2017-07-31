const cp = require('child_process')
const exec = cp.exec
const events = require('events')
class eventEmitter extends events {}

const { sttPath } = require('../configs')

module.exports = {
	javaStt: () => {
		const command = sttPath
		const stt = new eventEmitter()
		stt.on('start', () => {
			console.log('stt start')
			const sttout = exec( command,
				(err, stdout, stderr) => {
					if (err) {
						console.log(err)
						return;
					} else {
						//console.log('stdout', stdout)
						//console.log('stderr', stderr)
						console.log('stt done')
					}
				}
			)
			sttout.stdout.on('data', data => {
				const resHead = data.indexOf('===')
				if(resHead > -1) {
					const resEnd = data.substr(resHead).indexOf('<')
					const res = (resEnd > -1)?
						data.slice(resHead+3, resHead+resEnd)
						:data.slice(resHead+3)
					stt.emit('result', res)
				}
			})
			sttout.stderr.on('data', data => {
				console.log('stderr:',data)
			})
		})
		return stt
	}
}
