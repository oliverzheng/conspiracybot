
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

	var sentences = text.split('. ');
	var ret = [];
	for (var i = 0; i < sentences.length; i++) {
		if (/\d/.test(sentences[i])){
			if(wordLimit === null || wordCount(sentences[i]) <= wordLimit){
				ret.push(sentences[i] + '.');
			}
		}
	}
	return ret;
};

/*
Given a word(s) look up the wikipedia article for that word.
Find any sentences from the wikipedia extract that contain numbers.
*/
var crawl = function(word, wordLimit, callback){
	var url = encodeURI('http://en.wikipedia.org/w/api.php?action=query&prop=extracts&exsentences=10&explaintext&titles=' + word + '&format=json');
	client.api.fetchUrl(url,
	function(error,body){
		if(error === null){
			var jsonBody = JSON.parse(body);
			var pageid = Object.keys(jsonBody.query.pages)[0];
			var extract = jsonBody.query.pages[pageid].extract;
			var sentences = findSentences(extract, wordLimit);
			callback(sentences);
		}
		else{
			callback(error);
		}
	});
};


module.exports = {crawl:crawl, findSentences:findSentences};