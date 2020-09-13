import * as yargs from 'yargs';

import { getFirestore, cleanFirebase } from '../firebase';
import { confirm } from '../interactions';
import { writeFileSync } from '../utils';

export type ExportDocumentType = {
  'document-path': string | undefined;
  'output-directory': string | undefined;
};

interface FindResult {
  id: string;
  data: Record<string, any>;
}

const findDocument = async (docPath: string): Promise<FindResult> => {
  const db = getFirestore();
  const docRef = db.doc(docPath);

  const snapshot = await docRef.get();

  if (!snapshot.exists) throw new Error(`Data not found at ${docPath}`);

  const data = snapshot.data() as Record<string, any>;
  return { id: snapshot.id, data };
};

export const exportDocBuilder = (argv: yargs.Argv): yargs.Argv<ExportDocumentType> => {
  return argv
    .positional('document-path', {
      type: 'string',
      desc: 'Firestore document path'
    })
    .positional('output-directory', {
      type: 'string',
      desc: 'JSON data export directory path'
    });
};

export const exportDocHandler = async (args: yargs.Arguments<ExportDocumentType>): Promise<void> => {
  try {
    const docPath = args['document-path'];
    const outputDir = args['output-directory'];

    if (!docPath) throw new Error('invalid input params: document-path');
    if (!outputDir) throw new Error('invalid input params: output-path');

    await confirm(`Export document data to following directory: ${outputDir}`);

    const doc = await findDocument(docPath);

    const fileName = `${docPath}-${doc.id}.json`;
    const exportedPath = writeFileSync(outputDir, fileName, doc.data);

    console.log(`Document export succeeded!!! file path: ${exportedPath}`);

    cleanFirebase();
    return Promise.resolve();
  } catch (e) {
    throw e;
  }
};
