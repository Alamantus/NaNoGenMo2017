import seedrandom from 'seedrandom';
const random = seedrandom('testseed');

console.log('Generating!');

const language = require('./LanguageGenerator')(random);

console.log(language.test());
