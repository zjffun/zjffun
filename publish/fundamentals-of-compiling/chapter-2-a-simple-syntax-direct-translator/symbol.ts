class Env {
  private table = new Map();
  protected prev: Env = null;
  constructor(p: Env) {
    this.prev = p;
  }
  put(s, symbol) {
    this.table.set(s, symbol);
  }
  get(s) {
    for (let e = <Env>this; e !== null; e = e.prev) {
      const found = e.table.get(s);
      if (found) {
        return found;
      }
    }
    return null;
  }
}
