const request = require('supertest');
const test = require('tape');
const router = require('router-middleware');
const lib = require('../lib');
const fs = require('fs');
const path = require('path');

test('test convert', function(t) {
  t.plan(1)
  var app = router()
  app.post('/jobs/:jobId/tasks',lib.createJob)
  var jobId = ~~(Math.random()*100000);
  var x = request(app);
  x
  .post('/jobs/'+ jobId+'/tasks')
  .send({ name:'my task', tags:['tag1', 'tag2']})
  .end(function(err,res) {
    console.log("Got end"); 
    console.log(res.statusCode)
    console.log(res.text)
    t.pass("ok");
  })
});

