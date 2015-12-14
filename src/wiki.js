
/*
Set up the nodemw package.
*/
var bot = require('nodemw'),
  client = new bot({
        server: 'en.wikipedia.org',
        path: '/w'
    }),
    params = {
        action: 'query',
        query: ''
    };


/*
Given a sentence, return the number of words in the sentence.
*/
var wordCount = function(text){
	if(text === null){
		return 0;
	}
	var words = text.split(' ');
	return words.length;
}

/*
Given a blurb of text return any sentences that have numbers in them.
Limit sentences by # of words if desired, null means no restriction.
*/
var findSentences = function(text, wordLimit){

	var sentences = text.split(/\.\s+/);
	var ret = [];
	for (var i = 0; i < sentences.length; i++) {
    // Let's not worry if there must be numbers in the sentence for now
		//if (/\d/.test(sentences[i]))
			if(wordLimit == null || wordCount(sentences[i]) <= wordLimit){
				ret.push(sentences[i] + '.');
			}
	}
  // make sure sentences start with a capital letter. Sometimes, abbreviations
  // screw us over. Also make sure it's a letter.
  ret = ret.filter(function(sentence) {
    var firstLetter = sentence[0];
    return (
      firstLetter === firstLetter.toUpperCase() &&
      firstLetter.match(/[a-z]/i)
    );
  });
	return ret;
};

/*
Given a word(s) look up the wikipedia article for that word.
Find any sentences from the wikipedia extract that contain numbers.
*/
var crawl = function(word, wordLimit, ignoreSentences, callback) {
	var url = encodeURI('http://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&explaintext&titles=' + word + '&format=json&redirects');
	client.api.fetchUrl(url,
	function(error,body){
		if(error === null){
			var jsonBody = JSON.parse(body);
			var pageid = Object.keys(jsonBody.query.pages)[0];
			var extract = jsonBody.query.pages[pageid].extract;

      if (!extract) {
        return callback([]);
      }

      var redirects = jsonBody.query.redirects;
      if (redirects) {
        word = redirects[0].to;
      }
      word = word.toLowerCase();

			var sentences = findSentences(extract, wordLimit);
      // make sure the sentences have the original word in it
      sentences = sentences.filter(function(sentence) {
        var lowercaseSentence = sentence.toLowerCase();
        return (
          lowercaseSentence.indexOf(' ' + word + ' ') !== -1 ||
          lowercaseSentence.indexOf(' ' + word + ',') !== -1 ||
          lowercaseSentence.indexOf(' ' + word + '\'') !== -1 ||
          lowercaseSentence.indexOf(' ' + word + '-') !== -1 ||
          lowercaseSentence.indexOf(' ' + word + '.') !== -1
        );
      }).filter(function(sentence) {
        return ignoreSentences.indexOf(sentence) === -1;
      });
			return callback(sentences);
		}
		else{
			return callback(error);
		}
	});
};


module.exports = {crawl:crawl, findSentences:findSentences};
