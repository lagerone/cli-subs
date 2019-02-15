import path from 'path';
import { getFileHash } from './file-hash-service';

async function runTest(filePath: string, expectedHash: string) {
  // Act
  const result = await getFileHash(filePath);

  // Assert
  expect(result).toEqual(expectedHash);
}

describe('getFileHash', () => {
  it('should calculate file hash for dexter.mp4', async () => {
    await runTest(
      path.join(__dirname, '../samples/dexter.mp4'),
      'ffd8d4aa68033dc03d1c8ef373b9028c'
    );
  });

  it('should calculate file hash for justified.mp4', async () => {
    await runTest(
      path.join(__dirname, '../samples/justified.mp4'),
      'edc1981d6459c6111fe36205b4aff6c2'
    );
  });
});
