import * as yargs from 'yargs';
import { getAuth, cleanFirebase } from './firebase';
import { askPassword, confirm } from './interactions';

export type UpdatePwArgType = { uid: string | undefined };

export const updatePasswordBuilder = (yg: yargs.Argv): yargs.Argv<UpdatePwArgType> => {
  return yg.positional('uid', {
    type: 'string',
    describe: ' Firebase User ID'
  });
};

export const updatePasswordHandler = async (args: yargs.Arguments<UpdatePwArgType>): Promise<void> => {
  try {
    const uid = args.uid;
    if (!uid) throw new Error('invalid input params: uid');

    const auth = getAuth();
    const password = await askPassword();
    await confirm(`update user's password of uid: ${uid}`);
    await auth.updateUser(uid, { password });

    console.log(`update user's password completed!`);
    cleanFirebase();
    return Promise.resolve();
  } catch (e) {
    throw e;
  }
};
