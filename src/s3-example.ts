import stream from 'stream'
import { S3 } from 'aws-sdk'

import crop from './crop'

const start = async () => {
	try {
		const s3 = new S3(/* YOUR CREDENTIALS (if needed) GO HERE */)

		const inputFileURL = await s3.getSignedUrl('getObject', {
			Bucket: '%inputBucketName%',
			Key: '%inputFileName%',
			Expires: 1500
		})

		const bucketStream = new stream.PassThrough()
		await s3.upload({ Bucket: '%outputBucketName%', Key: 'somekey', Body: bucketStream }).promise()
		await crop(inputFileURL, bucketStream)
	} catch (e) {
		console.error(e)
	}
}

start()
