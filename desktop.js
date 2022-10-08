/*import { app, BrowserWindow, ipcMain, dialog } from 'electron';
import * as url from 'url';
import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';*/

const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const url = require('url');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

let win = null;

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    title: 'mathe:buddy IDE',
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  win.maximize();
  win.show();
  win.loadURL(
    url.format({
      pathname: path.join(__dirname, 'index.html'),
      protocol: 'file:',
      slashes: true,
    }),
  );
}

/*
ipcMain.on('save_file', (event, arg) => {
    / *const dirPath = dialog.showOpenDialogSync({ properties: ['openDirectory'] });
    console.log('path = ' + dirPath);* /
    fs.writeFileSync('blubxx.txt', arg, 'utf-8');
    event.sender.send('save_file_reply', {a:'bla',b:'xyz'});
});

ipcMain.on('get_files', (event, arg) => {
    const p = "/Users/andi/Downloads/*";
    const files = glob.sync(p);
    event.returnValue = files;
});*/

app.on('ready', createWindow);
