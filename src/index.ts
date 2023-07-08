#! /usr/bin/env node
import 'dotenv/config';
import {Configuration, OpenAIApi} from 'openai';
import clipboard from 'clipboardy';

async function start() {
  console.clear();
  let userMessage = '';
  if (process.argv.length > 2) {
    userMessage = process.argv[2];
  }

  if (userMessage === '') {
    clipboard.writeSync(
      "You haven't entered a message yet. Please write a message."
    );
    return;
  }

  // eslint-disable-next-line eqeqeq
  if (process.env.OPENAI_API_KEY == null) {
    clipboard.writeSync(
      'Make sure to set the OPENAI_API_KEY environment variable.'
    );
    return;
  }

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const chatCompletion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    temperature: 0.2,
    messages: [
      {
        role: 'system',
        content:
          'You are a Student in an Operating System exam using Linux, your responses should be detailed and self explanatory, no longer than 2 sentences, your responses should be humanized and sound like a first year student. The reader is dumb, explain in simple concepts, explain knowledge terms in simple terms. Your answers should be Linux related and regarding Linux.',
      },
      {
        role: 'user',
        content:
          'Give 3 ways of creating an empty file on the linux command line',
      },
      {
        role: 'assistant',
        content: 'touch filename\necho > filename\n> filename',
      },
      {role: 'user', content: userMessage},
    ],
  });
  clipboard.writeSync(
    chatCompletion.data.choices[0].message?.content ??
      'there was no message or an error'
  );
}

start();
