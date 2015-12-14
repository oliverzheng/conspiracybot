module.exports = function (input, callback) {
  // The API only supports making queries <= 250 chars
  input = input.substr(0, 250);

  var http = require('http');
  var querystring = require('querystring');
  var query = querystring.stringify({ format: 'json', jsoncallback: 'a', input: input, version: '0.1', options: 'sentence' });
  var url = 'http://nlp.naturalparsing.com/api/parse?input=?' + query;
  http.get(url, function (response) {
    response.setEncoding('utf8');
    var body = '';
    response.on("data", function(data) {
      body += data;
    });

    response.on('end', function() {
      var stripped = body.substring(20, body.length - 2);
      var result = JSON.parse(stripped);
      var words = result.words;
      var properNouns = [];
      var numbers =[];
      var nouns = [];
      for (var i=0, length = words.length; i < length; i++) {
        if (words[i].tag == 'NNP' || words[i].tag == 'NNPS' || words[i].tag === 'WHNP')
          properNouns.push(words[i].value);
        else if (words[i].tag == 'CD')
          numbers.push(parseInt(words[i].value));
        else if (words[i].tag === 'NN' || words[i].tag === 'NNS')
          nouns.push(words[i].value);
      }
      callback(properNouns, numbers, nouns);
    });
  }).on('error', function (error) {
    console.log("Request failed..." + error.message);
  });
};
