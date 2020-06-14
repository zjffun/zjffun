import Lexer from '../dist/lexer';

const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, './lexer.TwilightSparkle');
const input = String(fs.readFileSync(filepath));

const lexer = new Lexer(input);

const tokens = lexer.getTokens();

debugger;
