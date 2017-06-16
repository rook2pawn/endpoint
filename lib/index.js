const ChildProcess = require('child_process');
const path = require('path');

const convert = function(req,res) {
  const input = req.body.input;
  const output = req.body.output;
  const env = { input : input, output : output };
  var node = ChildProcess.spawn(process.execPath,['./lib/worker.js'],{env:env});

  node.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  node.stderr.on('data', (data) => {
    console.log(`stderr: ${data}`);
  });

  node.on('close', (code) => {
    if (code !== 0) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('internal error, payload should be input and output');
    } else {
      res.writeHead(200);
      res.end('Success');
    }
  });
};

const createJob = function(req,res) {
  console.log("Create Job:");
  console.log(req.body); 
};

exports.convert = convert;
exports.createJob = createJob;
