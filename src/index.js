import seedrandom from 'seedrandom';
const random = seedrandom('testseed');

console.log('Generating!');

const language = require('./LanguageGenerator')(random);
console.log(language.test());

const toneManager = require('./ToneManager')(random);
console.log(toneManager.currentTone);
let output = '';
for (let i = 0; i < 50; i++) {
  output += toneManager.chooseTonallyAppropriateWord('adjectives');
  output += '(' + toneManager.toneLevel.toString() + ': ' + toneManager.currentTone + ')';
  output += ' ';
}
console.log(output);
