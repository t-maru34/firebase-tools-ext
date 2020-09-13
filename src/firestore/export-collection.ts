import * as yargs from 'yargs';

import { getFirestore, cleanFirebase } from '../firebase';
import { confirm } from '../interactions';
import { writeFileSync } from '../utils';

export type ExportCollectionType = {
  'collection-path': string | undefined;
  'output-directory': string | undefined;
  'file-name': string | undefined;
};

const findDocs = async (collectionPath: string): Promise<Array<Record<string, any>>> => {
  const db = getFirestore();
  const ref = db.collection(collectionPath);

  const snapshot = await ref.get();

  if (snapshot.empty) throw new Error(`Data not found on ${collectionPath}`);

  const data = snapshot.docs.map(doc => doc.data() as Record<string, any>);
  return data;
};

export const exportCollectionBuilder = (argv: yargs.Argv): yargs.Argv<ExportCollectionType> => {
  return argv
    .positional('collection-path', {
      type: 'string',
      desc: 'Firestore document path'
    })
    .positional('output-directory', {
      type: 'string',
      desc: 'JSON data export directory path'
    })
    .options('file-name', {
      type: 'string',
      desc: 'File name of exported json file'
    });
};

export const exportCollectionHandler = async (args: yargs.Arguments<ExportCollectionType>): Promise<void> => {
  try {
    const collectionPath = args['collection-path'];
    const outputDir = args['output-directory'];
    const specifiedFileName = args['file-name'];

    if (!collectionPath) throw new Error('invalid input params: collection-path');
    if (!outputDir) throw new Error('invalid input params: output-directory');

    await confirm(`Export collection to following directory: ${outputDir}`);

    const docs = await findDocs(collectionPath);

    await confirm(`${docs.length} documents will be exported.`);

    const fileName = specifiedFileName || `${collectionPath.replace('/', '-')}.json`;
    const exportedPath = writeFileSync(outputDir, fileName, docs);

    console.log(`Collection export succeeded!!! file path: ${exportedPath}`);

    cleanFirebase();
    return Promise.resolve();
  } catch (e) {
    throw e;
  }
};
