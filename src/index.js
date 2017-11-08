import seedrandom from 'seedrandom';
const random = seedrandom();

console.log('Generating!');

const language = require('./LanguageGenerator')(random);
// console.log(language.test());

const toneManager = require('./ToneManager')(random);
// console.log(toneManager.currentTone);
// let output = '';
// for (let i = 0; i < 50; i++) {
//   output += toneManager.chooseTonallyAppropriateWord('adjectives');
//   output += '(' + toneManager.toneLevel.toString() + ': ' + toneManager.currentTone + ')';
//   output += ' ';
// }

const describe = require('./Describer')({
  random,
  toneManager,
  language
});

console.log(describe.location({placeName: 'the quarry'}));
