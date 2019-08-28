/**
 * Util class for typescript enum
 * @param {enum} e A typescript enum
 */
export default class Enum {
  /*
    enum Foo {
        bar,
        baz
    }

    is essentially

    const Foo = {
        bar: 0,
        baz: 1,
        0: "bar",
        1: "baz"
    }
  */

  constructor(private readonly _enum: object) {}

  get keys() {
    return Object.keys(this._enum).filter(key => typeof this._enum[key] === "number");
  }

  get values() {
    return Object.keys(this._enum).filter(key => typeof this._enum[key] === "string");
  }

  get entries(): Array<[string, number]> {
    return this.keys.map(key => [key, this._enum[key] as number]);
  }

  findKey(value: number) {
    let result: string;
    this.entries.forEach(([k, v]) => {
      if (v === value) {
        result = k;
      }
    });
    return result;
  }

  findValue(key: string) {
    let result: number;
    this.entries.forEach(([k, v]) => {
      if (k === key) {
        result = v;
      }
    });
    return result;
  }

  map<T = any>(fn: (key: string, value: number) => T) {
    return this.keys.map(key => fn(key, this._enum[key]));
  }

  forEach(fn: (key: string, value: number) => any): void {
    this.keys.forEach(key => fn(key, this._enum[key]));
  }
}
