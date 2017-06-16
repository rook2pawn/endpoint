const fs = require('fs');
const path = require('path')
const through = require('through2');
const csv = require('csv-stream');
const JSONStream = require('jsonstream');

const input = process.env['input'];
const output = process.env['output'];

if (input === undefined) {
  console.log("no input file specified")
  return process.exit(1)
}
if (output === undefined) {
  console.log("no output file specified")
  return process.exit(1)
}

var filename = path.join(__dirname,'../data', input);
var data = fs.createReadStream(filename);
var out = JSONStream.stringify(false);
out.pipe(fs.createWriteStream(path.join(__dirname,'../data',output)));
data.pipe(csv.createStream()).pipe(out)
data.on('close', () => {

  process.exit(0);
})
