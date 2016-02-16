var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var csvWriter = require('csv-write-stream');

var writer = csvWriter({headers: ["File Permissions","Absolute URL","File Type"]});

var url = 'http://substack.net/images/';

request(url, function(error, response, html){
  console.log("Connecting to URL...");

  if(error){
    console.log(error);
  }

  var $ = cheerio.load(html);

  var full_data = [];

  $('tr').each(function(i, elem){
    var data = [];
    data[0] = $(this).children('td').children('code').first().text();
    data[1] = $(this).children('td').children('a').attr('href');
    data[2] = $(this).children('td').children('a').text().split('.')[1];
    full_data[i] = data;
  });

  writer.pipe(fs.createWriteStream('output.csv'));
  for(var group in full_data){
    writer.write(full_data[group]);
  }
  writer.end();
  console.log('File successfully written! - Check your project directory for the output.json file');

});
