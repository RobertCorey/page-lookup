var request = require('request');
var cheerio = require('cheerio');
var _ = require('lodash');
var google = require('google');
var fs = require('fs');


function getNumPage (query) {
  query = 'amazon paperback' + query;
  google.resultsPerPage = 1;
  google(query, function (err, resp, links) {
    if (err) console.log(err);
    return scrapePage(links[0].link, query);
  });
}

function scrapePage(amazonLink, query) {
  request(amazonLink, function (err, resp, body) {
    if (err) {console.log(err); }
    $ = cheerio.load(body);
    var infoBullets = $('#productDetailsTable li');
    _.forEach(infoBullets, function (item, index) {
      var content = $(item).text() || '';
      if (content.indexOf('Paperback:') >= 0) {
        _.forEach(content.split(' '), function (item) {
          if (!isNaN(item)) {
            var str = query + ': ' + item + '\n';
            fs.appendFile('output.txt', str);
          }
        });
      }
    });
  });
  return false;
}

var books = [
  'the hobbit'
];
if(fs.existsSync('output.txt')) {
  fs.unlinkSync('output.txt');
}
_.forEach(books, function (item, index) {
  getNumPage(item);
});
