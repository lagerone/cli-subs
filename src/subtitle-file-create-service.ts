import fs from 'mz/fs';
import path from 'path';

const createSubtitleFilePath = (movieFilePath: string) => {
  const fileExtension = path.extname(movieFilePath);
  return movieFilePath.replace(fileExtension, '.srt');
};

export const createSubTitleFile = async (
  movieFilePath: string,
  subTitleFileContent: string
) => {
  const subTitleFilePath = createSubtitleFilePath(movieFilePath);

  await fs.writeFile(subTitleFilePath, subTitleFileContent, {
    encoding: 'utf8',
  });

  return subTitleFilePath;
};
