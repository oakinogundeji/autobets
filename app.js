'use strict';
//=============================================================================
const {spawn} = require('child_process');

const B1 = spawn('node', ['./b2.js'], {
  stdio: ['pipe', 'ipc', 'pipe']
});

B1.on('message', data => {
  console.log('data from B1...');  
  //console.log(data.toString());
  if(!!data.status) {
    console.log('msg from main tab');
    console.log(`status: ${data.status}`);
  }
  else {
    console.log(data);    
  }  
});

B1.stderr.on('data', err => {
  console.log('err from B1...');
  console.error(err.toString());
  return process.kill(B1.pid);
});

B1.on('close', code => {
  if(code < 1) {
    return console.log('B1 BOT closed normally...');
  } else {
    return console.error('B1 BOT closed abnormally...');
  }
});

B1.on('error', err => {
  console.error(`B1 CP err`);
  console.error(err);
  return process.kill(B1.pid);
});

setTimeout(() => {
  B1.send('new tab');
}, 185000);