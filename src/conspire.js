var domath = require('./domath');
var wiki = require('./wiki');
var inputParser = require('./inputParser');
var rand = require('./rand');

function conspire(output, previousFacts, seedWords, callback) {

  var previousFact = previousFacts[previousFacts.length - 1];
  console.log('= Using previous fact: ' + previousFact);

  inputParser(previousFact, function(properNouns, numbers, nouns) {
    var words = [];
    words.push.apply(words, properNouns);
    words.push.apply(words, numbers);
    words.push.apply(words, nouns);

    // Copy it.
    // Ignore previously used words that were seeds for finding facts
    var ignoreWords = (seedWords || []).slice(0);

    var tryNextWord = function() {
      var chosenWord = chooseNewWord(words, ignoreWords);
      ignoreWords.push(chosenWord);

      if (!chosenWord) {
        console.log('= No words to go on');
        return callback(true, ':(');
      }

      console.log('= Choosing next word: ' + chosenWord);

      findNewFact(chosenWord, previousFacts, function(newFact) {
        if (!newFact) {
          console.log('= No sentences to go on');

          // Loop through words looking for new facts we can use
          return tryNextWord();
        }

        console.log('= Found new fact: ' + newFact);

        return callback(
          previousFacts.length >= 10,
          newFact,
          chosenWord
        );
      });
    }

    tryNextWord();
  });
}

function chooseNewWord(words, ignoreWords) {
  words = words.filter(function(word) { return ignoreWords.indexOf(word) === -1; });
  if (words.length === 0) {
    return null;
  }
  return words[rand(0, words.length - 1)];
}

function findNewFact(wordToCrawl, previousFacts, callback) {
  wiki.crawl(wordToCrawl, null, previousFacts, function(sentences) {
    if (sentences.length === 0) {
      return callback(null);
    }

    var newFact = sentences[rand(0, sentences.length - 1)];
    return callback(newFact);
  });
}

module.exports = conspire;
