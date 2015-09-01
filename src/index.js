var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/conspire', function (req, res) {
  var query = req.query;

  var previousFacts = query.previousFacts;
  var input = query.input;
  var output = query.output;

  res.send(
    JSON.stringify({
      newFact: 'herp derp',
      didConspire: previousFacts.length >= 10,
    })
  );
});

var server = app.listen(8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
