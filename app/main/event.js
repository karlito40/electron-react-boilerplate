import { ipcMain } from 'electron';

export function register() {
  ipcMain.on('asynchronous-message', (event) => {
    event.sender.send('asynchronous-reply', 'pong');
  });
}
