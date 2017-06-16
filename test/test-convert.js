const request = require('supertest');
const test = require('tape');
const router = require('router-middleware');
const lib = require('../lib');
const fs = require('fs');
const path = require('path');

test('test convert', function(t) {
  t.plan(3)
  var app = router()
  app.post('/convert',lib.convert)
  var x = request(app);
  x
  .post('/convert')
  .send({ input:'my_input_file.csv', output: 'my_output_file.json' })
  .end(function(err,res) {
    t.equal(res.text, 'Success')
    var outputpath = path.join(__dirname,'../data','my_output_file.json');
    fs.access(outputpath,(err) => {
      t.error(err,'error should not exist');
      fs.unlink(outputpath,() => {
        t.pass('cleaned up');
      })
    })
  })
});

