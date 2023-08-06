import ChildProcess from 'child_process'

import type { Writable } from 'node:stream'

export default (input: string, outStream: Writable, format = 'mp4') => {
	const cmd = 'ffmpeg'
	const cmdArgs = [
		'-i',
		`${input}`,
		'-v',
		'error',
		'-f',
		format,
		'-movflags',
		'frag_keyframe+empty_moov',
		'-vf',
		`crop=w='min(iw\\,ih)':h='min(iw\\,ih)'`,
		'-'
	]

	const promise = new Promise<void>((resolve, reject) => {
		try {
			const videoProcess = ChildProcess.spawn(cmd, cmdArgs, {
				cwd: process.cwd()
			})

			videoProcess.stdout.pipe(outStream)

			videoProcess.stdout.on('error', (err) => {
				outStream.end()
				outStream.destroy()

				reject(err)
			})

			videoProcess.stderr.on('data', (buffer) => reject(buffer.toString()))

			videoProcess.on('error', (err) => reject(err))

			videoProcess.on('exit', (code, signal) => {
				outStream.end()
				outStream.destroy()

				if (code || signal) {
					reject(`ffmpeg failed with ${code ? 'code' : 'signal'}: ${code || signal}`)
				} else {
					resolve()
				}
			})
		} catch (e) {
			reject(e)
		}
	})

	return promise
}
