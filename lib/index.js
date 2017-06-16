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

const request = require('request');
const createJob = function(req,res) {
  const name = req.body.name;
  const tags = req.body.tags;
  const jobId = req.params.jobId;
  var p1 = new Promise((resolve,reject) => {
    var url = 'https://cfassignment.herokuapp.com/tasks';
    request.post({url:url},(err,res,body) => {
      if (res.statusCode !== 200) {
        return reject("failure on url:" + url + " " + body);
      }
      return resolve(body);
    })
  });
  p1.then((value) => {
    var taskId = JSON.parse(value).taskId;   
    var p2 = new Promise((resolve,reject) => {
      var url = 'https://cfassignment.herokuapp.com/tasks/'+taskId+'/tags';
      request.post({url:url,form:tags}, (err,res,body) => {
        if (res.statusCode !== 200) {
          return reject("failure on url:" + url + " " + body);
        }
        return resolve("p2" + body);
      })
    });
    var p3 = new Promise((resolve,reject) => {
      var url = 'https://cfassignment.herokuapp.com/jobs/'+jobId+'/tasks';
      request.post({url:url,form:{taskId:taskId}}, (err,res,body) => {
        if (res.statusCode !== 200) {
          return reject("failure on url:" + url + " " + body);
        }
        return resolve("p3" + body);
      })
    });
    return Promise.all([p2,p3])
  })
  .then((value) => {
    res.writeHead(200);
    res.end("Success");
  })
  .catch((reason) => {
    res.writeHead(500)
    res.end(reason);
  })
};

exports.convert = convert;
exports.createJob = createJob;
