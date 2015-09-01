var random = require('random-js');

var CHANCE_OF_USING_PREV_NUMBER = 3; // 1 in 3

function rand(a, b) {
  return random.integer(a, b)(random.engines.nativeMath);
}

var operations = [
  function multiply(a, b) {
    var result = a * b;
    return {
      num: result,
      sentence: a.toString() + ' * ' + b.toString() + ' = ' + result,
    };
  },
  function divide1(a, b) {
    if (a <= b || a % b !== 0) {
      return null;
    }
    var result = a / b;
    return {
      num: result,
      sentence: a.toString() + ' / ' + b.toString() + ' = ' + result,
    };
  },
  function divide2(a, b) {
    if (b <= a || b % a !== 0) {
      return null;
    }
    var result = b / a;
    return {
      num: result,
      sentence: b.toString() + ' / ' + a.toString() + ' = ' + result,
    };
  },
  function add(a, b) {
    var result = a + b;
    return {
      num: result,
      sentence: a.toString() + ' + ' + b.toString() + ' = ' + result,
    };
  },
  function subtract1(a, b) {
    if (a <= b) {
      return null;
    }
    var result = a - b;
    return {
      num: result,
      sentence: a.toString() + ' - ' + b.toString() + ' = ' + result,
    };
  },
  function subtract2(a, b) {
    if (b <= a) {
      return null;
    }
    var result = b - a;
    return {
      num: result,
      sentence: b.toString() + ' - ' + a.toString() + ' = ' + result,
    };
  },
  function pow1(a, b) {
    if (b > 3) {
      return null;
    }
    var result = Math.pow(a, b);
    return {
      num: result,
      sentence: a.toString() + ' ^ ' + b.toString() + ' = ' + result,
    };
  },
  function pow2(a, b) {
    if (a > 3) {
      return null;
    }
    var result = Math.pow(b, a);
    return {
      num: result,
      sentence: b.toString() + ' ^ ' + a.toString() + ' = ' + result,
    };
  },
];

function randomOperation(a, b) {
  var opCount = operations.length;
  var result = null;
  do {
    var op = operations[rand(0, opCount - 1)];
    result = op(a, b);
  } while (result == null);
  return result;
}

function findResult(a, b, goal) {
  for (var i = 0; i < operations.length - 1; ++i) {
    var op = operations[i];
    var result = op(a, b);
    if (result != null && result.num === goal) {
      return result;
    }
  }
  return null;
}

var domath = {

  // Return a fact which is contains one more number to operate on.
  produceRandomNumberFromTwoNumbers: function(a, b, goal) {
    if (goal) {
      var result = findOperation(a, b);
      if (result) {
        return result.sentence;
      }
    }
    return randomOperation(a, b).sentence;
  },

  // Return a fact which is contains more numbers to operate on
  produceRandomNumberFromSingleNumber: function(previousNumber, goal) {
    var numberStr = previousNumber.toString();

    if (numberStr.length >= 3 && rand(1, 5) > 1) {
      // Split the number up
      var randomIndex = rand(1, numberStr.length - 1);
      var a = numberStr.substring(0, randomIndex);
      var b = numberStr.substring(randomIndex);
      return numberStr + ' = "' + a + '" + "' + b + '"';
    }

    var a = rand(1, previousNumber);
    var b = previousNumber - a;
    return numberStr + ' = ' + a + ' + ' + b;
  },

  produceRandomNumberFromPrevious: function(previousNumbers, goal) {
    var numCount = previousNumbers.length;

    // Definitely use the last number
    var a = previousNumbers[numCount - 1];
    
    if (previousNumbers.length > 1 &&
        rand(1, CHANCE_OF_USING_PREV_NUMBER) === 1) {
      var b = previousNumbers[numCount - 2];
      return domath.produceRandomNumberFromTwoNumbers(a, b, goal);
    } else {
      return domath.produceRandomNumberFromSingleNumber(a, goal);
    }
  },

};

module.exports = domath;
