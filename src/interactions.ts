import * as prompts from 'prompts';

export const confirm = async (msg: string): Promise<void> => {
  const ask: prompts.PromptObject = {
    type: 'confirm',
    name: 'confirmed',
    message: `${msg} <-- Can you confirm? (y/N)`,
    initial: false
  };

  const res = await prompts(ask);
  if (res.confirmed === false) throw new Error('Aborted by user');
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
