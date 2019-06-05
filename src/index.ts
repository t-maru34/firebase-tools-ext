#!/usr/bin/env node

import * as yargs from 'yargs';
import { firebaseInitializer } from './firebase';
import * as firestore from './firestore';
import * as auth from './auth';

yargs
  .command<firestore.SetDocumentType>(
    'firestore:set <doc-path> [infile]',
    'Set Document to specified path',
    firestore.setDocBuilder,
    firestore.setDocHandler
  )
  .command<firestore.AddDocumentType>(
    'firestore:add <collection-path> [infile]',
    'Add Document to collection',
    firestore.addDocBuilder,
    firestore.addDocHandler
  )
  .command<auth.UpdatePwArgType>(
    'auth:update-pw <uid>',
    'Update Firebase User Password',
    auth.updatePasswordBuilder,
    auth.updatePasswordHandler
  )
  .demandCommand(1)
  .help()
  .middleware([firebaseInitializer]).argv;
