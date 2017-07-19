const { exec } = require('child_process')

const cp = exec('r1.exe')
cp.on('close', (code, signal) => {
  console.log(
    `child process terminated due to receipt of signal ${signal}`)
})
cp.on('exit', (code, signal) => {
  console.log(
    `child process exit due to receipt of signal ${signal}`)
})
