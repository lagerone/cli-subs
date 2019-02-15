#! /usr/bin/env node

import fs from 'mz/fs';
import path from 'path';
import prompts from 'prompts';
import { getFileHash } from './file-hash-service';
import { logger } from './logger';
import { createSubTitleFile } from './subtitle-file-create-service';
import { downloadSubtitles, getLanguagesForFile } from './subtitle-service';

const validMovieFileExtensions = ['.mkv', '.mp4', '.avi'];
const validSubtitleFileExtensions = ['.srt', '.sub'];

const run = async () => {
  const cwd = process.cwd();
  const filesAndDirs = await fs.readdir(cwd);
  const filePaths = await filesAndDirs.reduce(
    async (files, currentFileOrDir) => {
      const resolvedFiles = await files;
      const currentPath = path.join(cwd, currentFileOrDir);
      const stats = await fs.stat(currentPath);
      if (
        (stats.isFile() &&
          validMovieFileExtensions.includes(path.extname(currentPath))) ||
        validSubtitleFileExtensions.includes(path.extname(currentPath))
      ) {
        return [...resolvedFiles, currentPath];
      }
      return resolvedFiles;
    },
    Promise.resolve([])
  );

  const fileOptions: prompts.Choice[] = filePaths.map(filePath => {
    return {
      title: path.basename(filePath),
      value: filePath,
      disabled: validSubtitleFileExtensions.includes(path.extname(filePath)),
    };
  });

  const { movieFilePath } = await prompts([
    {
      type: 'select',
      name: 'movieFilePath',
      message: 'Select movie file',
      choices: fileOptions,
      initial: 0,
    },
  ]);

  if (!movieFilePath) {
    logger.warn('No file selected. Program will exit.');
    process.exit(0);
  }

  const fileHash = await getFileHash(movieFilePath);
  const movieFileName = path.basename(movieFilePath);

  logger.info(`Searching avaliable languages for "${movieFileName}".`);

  const languages = await getLanguagesForFile(fileHash);
  if (!languages.length) {
    logger.info(`No subtitle languages found for "${movieFileName}".`);
    process.exit(0);
  }

  const { subtitleLanguage } = await prompts([
    {
      type: 'select',
      name: 'subtitleLanguage',
      message: 'Select subtitle language',
      choices: languages.map(lang => {
        return { title: lang, value: lang };
      }),
      initial: 0,
    },
  ]);

  logger.info(
    `Searching for subtitles for "${movieFileName}" and language "${subtitleLanguage}".`
  );

  const subTitles = await downloadSubtitles(fileHash, subtitleLanguage);

  if (!subTitles) {
    logger.info(
      `No subtitles found for "${movieFileName}" and language "${subtitleLanguage}".`
    );
    process.exit(0);
  }

  const subtitlefilePath = await createSubTitleFile(movieFilePath, subTitles);

  logger.info(`Successfully created subtitle file at "${subtitlefilePath}".`);
};

run();
