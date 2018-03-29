import { ipcRenderer } from 'electron';

export function sendAsyncMessage() { // eslint-disable-line
  return new Promise((resolve) => {
    console.log('ipc send asynchronous-message');
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      resolve(arg);
    });
    ipcRenderer.send('asynchronous-message', 'ping');
  });
}
