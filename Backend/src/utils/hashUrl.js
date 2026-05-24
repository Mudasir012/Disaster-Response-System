import { createHash } from 'crypto'

export default (str) => createHash('md5').update(str).digest('hex')
