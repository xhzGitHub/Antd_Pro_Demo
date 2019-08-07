interface Foo {
  name: string;
  age: number;
  address: string;
}

type T = keyof Foo;

type obj = {
  [p in T]: any
};
/** Partial */
type Partia<T> = { [p in keyof T]?: T[p] };

type someProp1 = Partia<Foo> 

type Recor<K extends keyof any, T> = { [p in K]: T };

type someProps = Record<keyof Foo, string>;

type Pic<T, K extends keyof T> = {
  [p in K]: T[p]
};

type someProp = Pick<Foo, 'name'|'age'>;

type someProp2 = someProp extends Foo ? string : number;

type someProp3 = Exclude<1|2, 1|3>;

type someProp4 = Extract<1|2, 1|3>;

function foo(x: number): number[] {
  return [x];
}

type prop5 = ReturnType<typeof foo>;

type prop6 = Partia<Foo>

const obj = {
  we: 1
} as prop6;