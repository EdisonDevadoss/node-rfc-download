'use strict';

const rfcClient = require('node-rfc').Client;
const fs = require('file-system');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
// ABAP system RFC connection parameters
const abapSystem = {
  user: process.env.USR,
  passwd: process.env.PASSWD,
  ashost: process.env.ASHOST,
  sysnr: process.env.SYSNR,
  client: process.env.CLIENT,
  lang: process.env.LANG,
  sid: process.env.SID
  // trace: '2'
};

// create new client
const client = new rfcClient(abapSystem);

// open connection
client.connect(function (err, res) {
  console.log('connected successfully', res);

  if (err) {
    // check for login/connection errors
    return console.error('could not connect to server', err);
  }

  //ZFM_MAKT_SINGLE_READ_01
  client.invoke('ZFM_MAKT_SINGLE_READ_01', {}, function (err, res) {
    if (err) {
      return console.error('Error invoking ZFM_MAKT_SINGLE_READ_01:', err);
    }
    console.log('ZFM_MAKT_SINGLE_READ_01 call result:', res);
  });

  //ZSF_TO_BASE64
  client.invoke('ZSF_TO_BASE64', {}, function (err, res) {
    if (err) {
      return console.error('Error invoking ZSF_TO_BASE64:', err);
    }
    // console.log('ZSF_TO_BASE64 call result:', res);

    fs.writeFile('assets/result.pdf', res.BIN_FILE, (error) => {
      if (error) {
        return console.error('error is', error);
      }
      console.log('Doc saved');
    });
  });
});
