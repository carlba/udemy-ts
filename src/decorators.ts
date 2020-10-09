// function Logger(constructor: Function) {
//   console.log('Logging...');
//   console.log(constructor);
// }

function Logger(logString: string) {
  console.log('LOGGER FACTORY');
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log('TEMPLATE FACTORY');
  return function (constructor: any) {
    console.log('Rendering Template');
    const hookElement = document.getElementById(hookId);
    const p = new constructor();
    if (hookElement) {
      hookElement.innerHTML = template + `<h2>${p.name}</h2`;
    }
  };
}

@Logger('LOGGING - PERSON')
@WithTemplate('<h1>My Person Object</h1>', 'app')
class Person {
  name = 'Carl';

  constructor() {
    console.log('Creating person object...');
  }
}

const person = new Person();
console.log(person);
