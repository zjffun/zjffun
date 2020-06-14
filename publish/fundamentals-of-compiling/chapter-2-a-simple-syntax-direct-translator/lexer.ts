export default class Lexer {
  private words = new Map();
  private code = '';
  private line = 1;
  private column = 1;
  private index = 0;

  private get peek() {
    return this.code[this.index];
  }

  private get forward() {
    return this.code[this.index + 1];
  }

  constructor(code: string) {
    this.code = code;
    this.reserve(new Word(Tag.TRUE, 'true'));
    this.reserve(new Word(Tag.FALSE, 'false'));
    this.reserve(new Word(Tag.IF, 'if'));
    this.reserve(new Word(Tag.ELSE, 'else'));
    this.reserve(new Word(Tag.FOR, 'for'));
    this.reserve(new Word(Tag.WHILE, 'while'));
    this.reserve(new Word(Tag.DO, 'do'));
    this.reserve(new Word(Tag.SWITCH, 'switch'));
    this.reserve(new Word(Tag.BREAK, 'break'));
    this.reserve(new Word(Tag.CONTINUE, 'continue'));
  }

  getTokens() {
    let tokens = [];
    while (this.index < this.code.length) {
      tokens.push(this.scan());
    }
    return tokens;
  }

  private reserve(w: Word) {
    this.words.set(w.lexeme, w);
  }

  private nextChar() {
    const peek = this.peek;
    this.index++;

    if (peek === '\n') {
      this.line++;
      this.column = 1;
      return;
    }

    this.column++;
  }

  private test(reg: RegExp, str: string) {
    if (str === undefined) {
      return false;
    }
    return reg.test(str);
  }

  private scan(): Token {
    // 空白符
    while (this.test(/[ \t]/, this.peek)) {
      this.nextChar();
    }

    while (this.peek === '\r') {
      this.nextChar();
    }

    while (this.test(/\n/, this.peek)) {
      this.nextChar();
    }

    // 注释
    if (this.peek === '/') {
      if (this.forward === '/') {
        let comment = '//';
        this.nextChar();
        this.nextChar();

        while (this.peek !== undefined && this.peek !== '\n') {
          comment += this.peek;
          this.nextChar();
        }
        return new Word(Tag.COMMENT, comment);
      }

      if (this.forward === '*') {
        let comment = '/*';
        this.nextChar();
        this.nextChar();

        while (!(this.peek === '*' && this.forward === '/')) {
          if (this.peek === undefined) {
            return new Word(Tag.COMMENT, comment);
          }
          comment += this.peek;
          this.nextChar();
        }
        comment += '*/';
        this.nextChar();
        this.nextChar();

        return new Word(Tag.COMMENT, comment);
      }
    }

    // 数字
    if (this.test(/\d/, this.peek)) {
      let integer = parseInt(this.peek);
      let decimal = 0;
      this.nextChar();
      while (this.test(/\d/, this.peek)) {
        integer = integer * 10 + parseInt(this.peek);
        this.nextChar();
      }
      if (this.peek === '.') {
        this.nextChar();
        let i = 10;
        while (this.test(/\d/, this.peek)) {
          decimal += parseInt(this.peek) / i;
          i *= 10;
          this.nextChar();
        }
      }
      return new Num(integer + decimal);
    }

    // 变量和关键字
    if (this.test(/\w/, this.peek)) {
      let str = this.peek;
      this.nextChar();
      while (this.test(/\w/, this.peek)) {
        str += this.peek;
        this.nextChar();
      }
      let word = this.words.get(str);

      if (!word) {
        word = new Word(Tag.ID, str);
      }

      this.words.set(str, word);
      return word;
    }

    // 运算符
    if (this.test(/[><=!]/, this.peek)) {
      if (this.forward === '=') {
        let word = new Word(Tag.REL, this.peek + this.forward);
        this.nextChar();
        this.nextChar();
        return word;
      }
    }

    let token = new Token(this.peek.charCodeAt(0));
    this.nextChar();
    return token;
  }
}

export class Tag {
  static NUM = 256;
  static ID = 257;
  static TRUE = 258;
  static FALSE = 259;
  static IF = 260;
  static ELSE = 261;
  static FOR = 262;
  static WHILE = 263;
  static DO = 264;
  static SWITCH = 265;
  static BREAK = 266;
  static CONTINUE = 267;
  static COMMENT = 268;
  static REL = 269;
}

export class Token {
  public tag;
  constructor(t: Number) {
    this.tag = t;
  }
}

export class Num extends Token {
  public value;
  constructor(v: Number) {
    super(Tag.NUM);
    this.value = v;
  }
}

export class Word extends Token {
  public lexeme;
  constructor(t: Number, s: String) {
    super(t);
    this.lexeme = s;
  }
  while(condition) {}
}
