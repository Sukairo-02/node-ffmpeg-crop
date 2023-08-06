import fs from 'fs'

import crop from './crop'

const start = async () => {
	try {
		const input = './something.mp4' // Path\URL to any suitable file
		const outStream = fs.createWriteStream('./output.mp4')

		await crop(input, outStream)
	} catch (e) {
		console.error(e)
	}
}

start()
