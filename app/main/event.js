import { ipcMain } from 'electron';
import { spawn } from 'child_process';
import { create as ForgeCreate } from 'forge-struct';
// import { promisify } from 'util';
// import * as fs from 'fs';
import templatePackageBuilder from './templates/package.json';

// const readFile = promisify(fs.readFile);

export function register() { // eslint-disable-line
  ipcMain.on('asynchronous-message', (event, arg) => {
    console.log('asynchronous-message', arg);
    const child = spawn('ls');

    child.stdout.on('data', (data) => {
      event.sender.send('asynchronous-message-reply', {
        messageId: arg.messageId,
        status: 'data',
        data: {
          text: data.toString()
        }
      });
    });

    child.stderr.on('data', (data) => {
      event.sender.send('asynchronous-message-reply', {
        messageId: arg.messageId,
        status: 'data',
        data: {
          text: data.toString()
        }
      });
    });

    child.on('close', () => {
      event.sender.send('asynchronous-message-reply', {
        messageId: arg.messageId,
        status: 'close'
      });
    });
  });

  ipcMain.on('project-creation', async (event, arg) => {
    console.log('project-creation', arg);
    const { data: { path } } = arg;
    console.log('path', path);
    console.log('templatePackageBuilder', templatePackageBuilder);
    // let templatePackageBuilder;
    //
    // try {
    //   templatePackageBuilder = await readFile(`${__dirname}/templates/package.json`, 'utf-8');
    // } catch (e) {
    //   console.log('read package', e);
    // }

    try {
      const project = [
        path,
        {
          path: `${path}/package.json`,
          content: templatePackageBuilder
        },
        {
          path: `${path}/index.js`,
          content: "console.log('Hello !');"
        }
      ];

      await ForgeCreate(project);
    } catch (e) {
      console.log('forge create', e);
      return;
    }


    const child = spawn('npm', ['install', '-dd'], { cwd: path });

    child.stdout.on('data', (data) => {
      event.sender.send('project-creation-reply', {
        messageId: arg.messageId,
        status: 'data',
        data: {
          text: data.toString()
        }
      });
    });

    child.stderr.on('data', (data) => {
      event.sender.send('project-creation-reply', {
        messageId: arg.messageId,
        status: 'data',
        data: {
          text: data.toString()
        }
      });
    });

    child.on('close', () => {
      event.sender.send('project-creation-reply', {
        messageId: arg.messageId,
        status: 'close'
      });
    });
  });
}
