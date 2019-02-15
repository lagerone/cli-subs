import crypto from 'crypto';
import fs from 'fs';
import { promisify } from 'util';

const statAsync = promisify(fs.stat);
const openAsync = promisify(fs.open);

const bytesToRead = 64 * 1024;

export const getFileHash = async (filePath: string) => {
  const { size } = await statAsync(filePath);
  const fileDescriptor = await openAsync(filePath, 'r');
  const buffer = new Buffer(bytesToRead * 2);

  [0, size - bytesToRead].reduce((bytesRead, currentOffset) => {
    return fs.readSync(
      fileDescriptor,
      buffer,
      bytesRead,
      bytesToRead,
      currentOffset
    );
  }, 0);

  return crypto
    .createHash('md5')
    .update(buffer)
    .digest('hex');
};
