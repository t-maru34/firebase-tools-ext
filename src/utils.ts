import { existsSync, mkdirSync, writeFileSync as fsWriteFileSync } from 'fs';
import { resolve } from 'path';

export const createDirectoryIfNeeded = (directoryPath: string): string => {
  const absolutePath = resolve(process.cwd(), directoryPath);
  if (!existsSync(absolutePath)) {
    mkdirSync(absolutePath, { recursive: true });
  }
  return absolutePath;
};

export const writeFileSync = (
  directoryPath: string,
  fileName: string,
  data: Record<string, any> | Array<Record<string, any>>
): string => {
  const absoluteDirPath = createDirectoryIfNeeded(directoryPath);
  const filePath = `${absoluteDirPath}/${fileName}`;
  const jsonString =  JSON.stringify(data);
  fsWriteFileSync(filePath, jsonString, { encoding: 'utf8' });
  return filePath;
};
