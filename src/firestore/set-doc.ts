import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';

import { getFirestore, cleanFirebase } from '../firebase';
import { confirm } from '../interactions';

export type SetDocumentType = {
  'document-path': string | undefined;
  infile: string | undefined;
  data: string | undefined;
};

const setDocument = async (docPath: string, data: any): Promise<void> => {
  const db = getFirestore();

  await db.doc(docPath).set(data);

  return Promise.resolve();
};

export const setDocBuilder = (argv: yargs.Argv): yargs.Argv<SetDocumentType> => {
  return argv
    .positional('document-path', {
      type: 'string',
      describe: 'Document path that contains Collection name'
    })
    .positional('infile', {
      type: 'string',
      describe: 'stored JSON data at the specified path via STDIN, arg, or file'
    })
    .options('data', {
      alias: 'd',
      type: 'string',
      describe: 'specify escaped JSON directly'
    });
};

export const setDocHandler = async (args: yargs.Arguments<SetDocumentType>): Promise<void> => {
  try {
    const docPath = args['document-path'];
    const filePath = args.infile;
    const jsonString = args.data;

    if (!docPath) throw new Error('invalid input params: doc-path');
    if (!filePath && !jsonString) throw new Error('need to provide one of JSON file path or JSON string');
    if (filePath && jsonString) throw new Error('need to specify either JSON file path or JSON string');

    const json = filePath
      ? JSON.parse(Buffer.from(fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')).toString())
      : JSON.parse(jsonString!);

    const msg = `set data to ${docPath}: ${JSON.stringify(json)}`;
    await confirm(msg);

    await setDocument(docPath, json);
    console.log(`set document completed!`);

    cleanFirebase();
    return Promise.resolve();
  } catch (e) {
    throw e;
  }
};
