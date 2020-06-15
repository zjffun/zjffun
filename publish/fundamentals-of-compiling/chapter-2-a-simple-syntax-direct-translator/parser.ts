/**
 * %token ID, IF, ELSE, WHILE, DO, FOR, REL
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

  constructor(l) {
    this.lexer = l;
    this.token = l.getNextToken();
  }
  private nextToken() {
    this.token = this.lexer.getNextToken();
  }
  private checkTag(tag: number, reportErr?: boolean) {
    if (this.token.tag === tag) {
      this.nextToken();
      return true;
    } else {
      if (reportErr) {
        this.logError('语法错误');
      }
      return false;
    }
  }
  stmt() {
    if (this.checkTag(Tag.IF)) {
      this.checkTag(charMap.leftBracket, true);
      this.expr();
      this.checkTag(charMap.rightBracker, true);
      this.stmt();
    }

    if (this.checkTag(Tag.WHILE)) {
      this.checkTag(charMap.leftBracket, true);
      this.expr();
      this.checkTag(charMap.rightBracker, true);
      this.stmt();
    }

    if (this.checkTag(Tag.DO)) {
      this.stmt();
      this.checkTag(Tag.WHILE, true);
      this.checkTag(charMap.leftBracket, true);
      this.expr();
      this.checkTag(charMap.rightBracker, true);
      this.checkTag(charMap.semiColon, true);
    }

    if (this.checkTag(Tag.FOR)) {
      this.checkTag(charMap.leftBracket, true);
      this.optexpr();
      this.checkTag(charMap.semiColon, true);
      this.optexpr();
      this.checkTag(charMap.semiColon, true);
      this.optexpr();
      this.checkTag(charMap.rightBracker, true);
      this.stmt();
    }

    if (this.checkTag(charMap.leftBrace)) {
      this.stmts();
      this.checkTag(charMap.rightBrace, true);
    }
    this.logError('语法错误');
  }

  private optexpr() {
    // eps 处理
    this.expr();
  }

  private expr() {
    if (this.checkTag(Tag.ID)) {
      this.checkTag(charMap.equal, true);
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
    // if
    if (
      this.checkTag(Tag.REL) ||
      this.checkTag(charMap.lessThan) ||
      this.checkTag(charMap.greatThan)
    ) {
      this.relR();
    }
    // eps
  }

  private op2() {
    this.op1();
    this.op2R();
  }

  private op2R() {
    if (this.checkTag(charMap.plus) || this.checkTag(charMap.minus)) {
      this.op2R();
    }
    // eps
  }

  private op1() {
    this.factor();
    this.op1R();
  }

  private op1R() {
    if (this.checkTag(charMap.multiply) || this.checkTag(charMap.divide)) {
      this.op1R();
    }
    // eps
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
    // eps 处理
    this.stmt();
    this.stmts();
  }

  private logError(msg: string) {
    const err = new SyntaxError(msg);
    throw err;
  }
}
