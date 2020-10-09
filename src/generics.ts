const names: Array<string> = ['Carl', 'Johanna'];
const names2: string[] = ['Carl', 'Johanna'];

names[0].split(' ');

// Using promises with generic types
const promise: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => resolve('This is done!!'), 50);
});

promise.then(result => console.log(result));

function merge<T extends object, U extends object>(objA: T, objB: U) {
  return Object.assign(objA, objB);
}

console.log(merge({ name: 'Carl ' }, { age: 22 }));

// Not allowed with the type constraint
//console.log(merge({ name: 'Carl ' }, 30));
