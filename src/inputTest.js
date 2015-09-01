var parseInput = require('./inputParser.js');
parseInput('Facebook launched in 2004.', function (properNouns, numbers)
{
  console.log('Proper Nouns: ');
  console.log(properNouns);
  console.log('\nNumbers: ');
  console.log(numbers);
});