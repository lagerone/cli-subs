import request, { RequestPromise } from 'request-promise-native';
import { logger } from './logger';

const hostname = 'api.thesubdb.com';
const headers = {
  'Content-Type': 'text/plain;charset=UTF-8',
  'User-Agent':
    'SubDB/1.0 (cli-subs/0.1; https://github.com/lagerone/cli-subs)',
};

export const getLanguagesForFile = async (
  filehash: string
): Promise<string[]> => {
  try {
    const csLangs = await request.get({
      url: `http://${hostname}/?action=search&hash=${filehash}`,
      headers,
    });
    return csLangs.split(',');
  } catch (error) {
    logger.debug(error.message);
    return [];
  }
};

export const downloadSubtitles = (
  filehash: string,
  language: string
): RequestPromise<string> => {
  return request.get({
    url: `http://${hostname}/?action=download&hash=${filehash}&language=${language}`,
    headers,
  });
};
