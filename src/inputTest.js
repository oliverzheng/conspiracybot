var parseInput = require('./inputParser.js');
parseInput('Facebook launched in 2004.', function (properNouns, numbers, nouns)
{
  console.log('Proper Nouns: ');
  console.log(properNouns);
  console.log('\nNumbers: ');
  console.log(numbers);
  console.log('\nNouns: ');
  console.log(nouns);
});
