import * as prompts from 'prompts';

export const confirm = async (msg: string): Promise<void> => {
  const ask: prompts.PromptObject = {
    type: 'text',
    name: 'confirm',
    message: `${msg}\nIs this OK? (Y/n)`
  };

  const res = await prompts(ask);
  if (res.confirm !== 'Y') throw new Error('Confirmation cancelled.');
  return Promise.resolve();
};

export const askPassword = async (): Promise<string> => {
  const ask: prompts.PromptObject = {
    type: 'password',
    name: 'pw',
    message: 'new Password'
  };

  const res = await prompts(ask);
  return res.pw;
};
