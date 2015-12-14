var express = require('express');
var conspire = require('./conspire');

var app = express();

app.use(express.static('public'));

app.get('/conspire', function (req, res) {
  var query = req.query;

  console.log('======');

  conspire(
    query.output,
    query.previousFacts,
    query.seedWords,
    function(isFinished, newFact, newSeedWord) {
      res.send(
        JSON.stringify({
          newFact: newFact,
          newSeedWord: newSeedWord,
          didConspire: isFinished,
        })
      );
    }
  );
});

var server = app.listen(8000, function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('App listening at http://%s:%s', host, port);
});
