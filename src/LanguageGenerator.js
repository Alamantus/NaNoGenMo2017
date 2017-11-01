import {randomArrayValue} from './helpers';

const MAX_RETRIES = 10;
const MAX_SYLLABLES = 6;

class LanguageGenerator {
  constructor (random) {
    this.random = random;
    this.randomArrayValue = (array) => randomArrayValue(array, this.random);
    this.phonology = this.generatePhonology();
    this.phonotactics = this.generatePhonotactics();
  }

  generatePhonology () {
    const possibleConsonants = ['b', 'c', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'm', 'n', 'p', 'q', 'r', 's', 't', 'v', 'w', 'x', 'y', 'z'],
      possibleVowels = ['a', 'e', 'i', 'o', 'u'],
      consonants = [],
      vowels = [];

    possibleConsonants.forEach(letter => {
      if (this.random() > 0.5) consonants.push(letter);
    });
    possibleVowels.forEach(letter => {
      if (this.random() > 0.5) vowels.push(letter);
    });

    return {
      consonants,
      vowels,
    };
  }

  generatePhonotactics () {
    const onset = [],
      nucleus = [],
      coda = [],
      overlapRestrictions = [];
    const maxSyllables = Math.ceil(this.random() * MAX_SYLLABLES);
    const blendConsonants = this.random() > 0.75;
    const blendVowels = this.random() > 0.5;

    if (this.random() > 0.5) onset.push(null);
    if (this.random() > 0.5) coda.push(null);

    this.phonology.consonants.forEach(letter => {
      if (this.random() > 0.5) onset.push(letter);
      if (this.random() > 0.5) nucleus.push(letter);
      if (this.random() > 0.5) coda.push(letter);

      this.phonology.consonants.forEach(pairedLetter => {
        if (this.random() < 0.2) overlapRestrictions.push(letter + pairedLetter);
      });
      this.phonology.vowels.forEach(pairedLetter => {
        if (this.random() < 0.1) overlapRestrictions.push(letter + pairedLetter);
      });
    });

    this.phonology.vowels.forEach(letter => {
      if (this.random() > 0.5) onset.push(letter);
      if (this.random() > 0.5) nucleus.push(letter);
      if (this.random() > 0.5) coda.push(letter);

      this.phonology.consonants.forEach(pairedLetter => {
        if (this.random() < 0.1) overlapRestrictions.push(letter + pairedLetter);
      });
      this.phonology.vowels.forEach(pairedLetter => {
        if (this.random() < 0.2) overlapRestrictions.push(letter + pairedLetter);
      });
    });

    return {
      onset,
      nucleus,
      coda,
      overlapRestrictions,
      maxSyllables,
      blendConsonants,
      blendVowels,
    }
  }

  generateSyllable () {
    let onset = this.randomArrayValue(this.phonotactics.onset),
      nucleus = this.randomArrayValue(this.phonotactics.nucleus),
      coda = this.randomArrayValue(this.phonotactics.coda);

    if (onset && nucleus) {
      let tries = 0;
      while (this.phonotactics.overlapRestrictions.includes(onset + nucleus) && tries < MAX_RETRIES) {
        nucleus = this.randomArrayValue(this.phonotactics.nucleus);
        tries++;
      }
    }
    if (nucleus && coda) {
      let tries = 0;
      while (this.phonotactics.overlapRestrictions.includes(nucleus + coda) && tries < MAX_RETRIES) {
        coda = this.randomArrayValue(this.phonotactics.coda);
        tries++;
      }
    }
    
    let syllable = (onset ? onset : '') + (nucleus ? nucleus : '') + (coda ? coda : '');
    return (syllable !== '') ? syllable : this.generateSyllable();
  }

  test () {
    return this.generateSyllable();
  }
}

module.exports = (random) => new LanguageGenerator(random);