import path from 'path';
import { getFileHash } from './file-hash-service';
import { downloadSubtitles, getLanguagesForFile } from './subtitle-service';

describe('cli-subs integration test', () => {
  it('should calculate hash for justified.mp4', async () => {
    // Arrange
    const movieFilePath = path.join(__dirname, '../samples/justified.mp4');

    // Act
    const hash = await getFileHash(movieFilePath);

    // Assert
    expect(hash).toEqual('edc1981d6459c6111fe36205b4aff6c2');
  });

  it('should download subtitles, pt first', async () => {
    // Arrange
    const movieFilePath = path.join(__dirname, '../samples/justified.mp4');
    const hash = await getFileHash(movieFilePath);

    // Act
    const result = await downloadSubtitles(hash, 'pt,en');

    // Assert
    expect(result).not.toBeFalsy();
  });

  it('should download subtitles, en first', async () => {
    // Arrange
    const movieFilePath = path.join(__dirname, '../samples/justified.mp4');
    const hash = await getFileHash(movieFilePath);

    // Act
    const result = await downloadSubtitles(hash, 'en,pt');

    // Assert
    expect(result).not.toBeFalsy();
  });

  it('should get languages', async () => {
    // Arrange
    const movieFilePath = path.join(__dirname, '../samples/justified.mp4');
    const hash = await getFileHash(movieFilePath);

    // Act
    const result = await getLanguagesForFile(hash);

    // Assert
    expect(result.length).not.toBeFalsy();
  });
});
