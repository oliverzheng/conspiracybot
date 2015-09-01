module.exports = function (input, callback) {
  var http = require('http');
  var querystring = require('querystring');
  var query = querystring.stringify({ format: 'json', jsoncallback: 'a', input: input, version: '0.1', options: 'sentence' });
  var url = 'http://nlp.naturalparsing.com/api/parse?input=?' + query;
  http.get(url, function (response) {
    response.setEncoding('utf8');
    response.on("data", function(data) {
      var stripped = data.substring(20, data.length - 2);
      var result = JSON.parse(stripped);
      var words = result.words;
      var properNouns = [];
      var numbers =[];
      for (var i=0, length = words.length; i < length; i++) {
        if (words[i].tag == 'NNP' || words[i].tag == 'NNPS')
          properNouns.push(words[i].value);
        else if (words[i].tag == 'CD')
          numbers.push(parseInt(words[i].value));
      }
      callback(properNouns, numbers);
    });
  }).on('error', function (error) {
    console.log("Request failed..." + error.message);
  });
};