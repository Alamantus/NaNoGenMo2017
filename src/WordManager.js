import yaml from 'js-yaml';
import fs from 'fs';

class WordManager {
  constructor () {
    try {
      this.adjectives = yaml.safeLoad(fs.readFileSync('./data/adjectives.yaml', 'utf8'));
    } catch (e) {
      console.error(e);
    }
  }
}

export default (new WordManager);