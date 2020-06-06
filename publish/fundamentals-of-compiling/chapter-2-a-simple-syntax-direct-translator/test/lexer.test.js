// import Lexer from '../dist/lexer';
// import Parser from '../parser';
const Lexer = require('../dist/lexer').default;
const Parser = require('../dist/parser').default;

const fs = require('fs');
const path = require('path');

const filepath = path.join(__dirname, './lexer.TwilightSparkle');
const input = String(fs.readFileSync(filepath));

const lexer = new Lexer(input);

// const tokens = lexer.getTokens();
// debugger;

const parser = new Parser(lexer);

debugger;

parser.stmt();

debugger;
