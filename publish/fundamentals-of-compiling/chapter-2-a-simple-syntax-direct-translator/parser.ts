/**
 * %token ID, INT, IF, ELSE, WHILE, DO, FOR, REL
 *
 * optexpr: expr | eps
 * expr: assign
 * assign: ID '=' rel | rel
 * rel: rel REL op2 | rel '>' op2 | rel '<' op2 | op2
 * op2: op2 '+' op1 | op2 '-' op1 | op1
 * op1: op1 '*' factor | op1 '/' factor | factor
 * factor: ID | NUM | '(' expr ')'
 * (start)stmt: IF '(' expr ')' stmt
 *  | IF '(' expr ')' stmt ELSE stmt --- 比较麻烦，先不考虑
 *  | WHILE '(' expr ')' stmt
 *  | DO stmt WHILE '(' expr ')' ';'
 *  | FOR '(' optexpr ';' optexpr ';' optexpr ')' stmt
 *  | INT ID ';'
 *  | expr ';'
 *  | '{' stmts '}'
 * stmts: stmts stmt
 *  | eps
 */
import Lexer, { Token, Num, Word, Tag } from './lexer';

const charMap = {
  leftBrace: 123,
  rightBrace: 125,
  leftBracket: 40,
  rightBracker: 41,
  semiColon: 59,
  equal: 61,
  greatThan: 62,
  lessThan: 60,
  plus: 43,
  minus: 45,
  multiply: 42,
  divide: 47,
};

export default class Parser {
  private lexer = null;
  private token = null;

  constructor(lexer) {
    this.lexer = lexer;
    this.token = lexer.getNextToken();
  }

  private nextToken() {
    this.token = this.lexer.getNextToken();
  }

  private mustToBe(tag: number) {
    if (this.token.tag === tag) {
      this.nextToken();
    } else {
      this.logError('语法错误');
    }
  }

  private checkTag(tag: number, nextToken?: boolean) {
    if (this.token.tag === tag) {
      if (nextToken) {
        this.nextToken();
      }
      return true;
    } else {
      return false;
    }
  }

  stmt() {
    if (this.checkTag(Tag.IF, true)) {
      this.mustToBe(charMap.leftBracket);
      this.expr();
      this.mustToBe(charMap.rightBracker);
      this.stmt();
    }

    if (this.checkTag(Tag.WHILE, true)) {
      this.mustToBe(charMap.leftBracket);
      this.expr();
      this.mustToBe(charMap.rightBracker);
      this.stmt();
    }

    if (this.checkTag(Tag.DO, true)) {
      this.stmt();
      this.mustToBe(Tag.WHILE);
      this.mustToBe(charMap.leftBracket);
      this.expr();
      this.mustToBe(charMap.rightBracker);
      this.mustToBe(charMap.semiColon);
    }

    if (this.checkTag(Tag.FOR, true)) {
      this.mustToBe(charMap.leftBracket);
      this.optexpr();
      this.mustToBe(charMap.semiColon);
      this.optexpr();
      this.mustToBe(charMap.semiColon);
      this.optexpr();
      this.mustToBe(charMap.rightBracker);
      this.stmt();
    }

    if (this.checkTag(Tag.INT, true)) {
      this.mustToBe(Tag.ID);
      this.mustToBe(charMap.semiColon);
    }

    if (this.checkTag(charMap.leftBrace, true)) {
      this.stmts();
      this.mustToBe(charMap.rightBrace);
    }

    // expr
    if (
      this.checkTag(Tag.ID) ||
      this.checkTag(Tag.NUM) ||
      this.checkTag(charMap.leftBracket)
    ) {
      this.expr();
    }

    this.logError('语法错误');
  }

  private optexpr() {
    // eps 涉及前缀: expr(ID), rel, op2, op1, factor(ID, NUM, leftBracket)
    if (
      this.checkTag(Tag.ID) ||
      this.checkTag(Tag.NUM) ||
      this.checkTag(charMap.leftBracket)
    ) {
      this.expr();
    }
  }

  private expr() {
    if (this.checkTag(Tag.ID, true)) {
      this.mustToBe(charMap.equal);
      this.rel();
    } else {
      this.rel();
    }
  }

  private rel() {
    this.op2();
    this.relR();
  }

  private relR() {
    if (
      this.checkTag(Tag.REL) ||
      this.checkTag(charMap.lessThan) ||
      this.checkTag(charMap.greatThan)
    ) {
      this.nextToken();
      this.op2();
      this.relR();
    }
  }

  private op2() {
    this.op1();
    this.op2R();
  }

  private op2R() {
    if (this.checkTag(charMap.plus) || this.checkTag(charMap.minus)) {
      this.nextToken();
      this.op1();
      this.op2R();
    }
  }

  private op1() {
    this.factor();
    this.op1R();
  }

  private op1R() {
    if (this.checkTag(charMap.multiply) || this.checkTag(charMap.divide)) {
      this.nextToken();
      this.factor();
      this.op1R();
    }
  }

  private factor() {
    if (this.checkTag(Tag.ID)) {
    }
    if (this.checkTag(Tag.NUM)) {
    }
    if (this.checkTag(charMap.leftBracket)) {
      this.expr();
      if (!this.checkTag(charMap.rightBracker)) {
        this.logError('语法错误');
      }
    }
    this.logError('语法错误');
  }

  private stmts() {
    // 左递归但不用添加非终结符号, eps 涉及前缀 stmt
    if (
      this.checkTag(Tag.IF) ||
      this.checkTag(Tag.WHILE) ||
      this.checkTag(Tag.DO) ||
      this.checkTag(Tag.FOR) ||
      this.checkTag(charMap.leftBrace)
    ) {
      this.stmt();
      this.stmts();
    }
  }

  private logError(msg: string) {
    const err = new SyntaxError(msg);
    throw err;
  }
}
