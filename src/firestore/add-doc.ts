import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';

import { getFirestore, cleanFirebase } from '../firebase';
import { confirm } from '../interactions';

export type AddDocumentType = {
  'collection-path': string | undefined;
  infile: string | undefined;
  data: string | undefined;
  'append-id': boolean;
};

const addDocument = async (collPath: string, data: any, appendIdToData: boolean): Promise<string> => {
  const db = getFirestore();
  const docRef = db.collection(collPath).doc();
  if (appendIdToData) data.id = docRef.id;

  await docRef.set(data);

  return docRef.id;
};

export const addDocBuilder = (argv: yargs.Argv): yargs.Argv<AddDocumentType> => {
  return argv
    .positional('collection-path', {
      type: 'string',
      desc: 'Collection path'
    })
    .positional('infile', {
      type: 'string',
      desc: 'stored JSON data at the specified path via STDIN, arg, or file'
    })
    .options('data', {
      alias: 'd',
      type: 'string',
      desc: 'specify escaped JSON directly'
    })
    .options('append-id', {
      type: 'boolean',
      desc: 'append auto generated id to JSON data',
      default: false
    });
};

export const addDocHandler = async (args: yargs.Arguments<AddDocumentType>): Promise<void> => {
  try {
    const collectionPath = args['collection-path'];
    const filePath = args.infile;
    const jsonString = args.data;
    const needToAppendId = args['append-id'];

    if (!collectionPath) throw new Error('invalid input params: collection-path');
    if (!filePath && !jsonString) throw new Error('need to provide one of JSON file path or JSON string');
    if (filePath && jsonString) throw new Error('need to specify either JSON file path or JSON string');

    const json = filePath
      ? JSON.parse(Buffer.from(fs.readFileSync(path.resolve(process.cwd(), filePath), 'utf-8')).toString())
      : JSON.parse(jsonString!);

    const msg = `add Data to ${collectionPath}: ${JSON.stringify(json)}, append-auto-generated-id: ${needToAppendId}`;
    await confirm(msg);

    const docId = await addDocument(collectionPath, json, needToAppendId);
    console.log(`add document completed! doc.id: ${docId}`);

    cleanFirebase();
    return Promise.resolve();
  } catch (e) {
    throw e;
  }
};
