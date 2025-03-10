({
  plugins: ['jsdom-quokka-plugin'],
  jsdom: { file: '../decorators.html' }
});

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
  return function <T extends { new (...args: any[]): { name: string } }>(originalConstructor: T) {
    console.log('Rendering Template');
    return class extends originalConstructor {
      constructor(...args: any[]) {
        super();
        const hookElement = document.getElementById(hookId);
        if (hookElement) {
          hookElement.innerHTML = template + `<h2>${this.name}</h2`;
        }
      }
    };
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

function Log(target: any, propertyName: string) {
  console.log(target, propertyName);
}

/**
 *
 * @param target Prototype of the instance or the constructor
 * @param name Name of the setter
 * @param descriptor
 */
function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log('Accessor Decorator', { target, name, descriptor });
}

/**
 *
 * @param target Prototype of object if static else constructor
 * @param name Name of the method
 * @param descriptor PropertyDescriptor
 */
function Log3(target: any, name: string | Symbol, descriptor: PropertyDescriptor) {
  console.log('Method Decorator', { target, name, descriptor });
}
/**
 *
 * @param target  Prototype of object if static else constructor
 * @param name Name of method where the parameter is used
 * @param descriptor
 */
function Log4(target: any, name: string, position: number) {
  console.log('Parameter Decorator', { target, name, position });
}

class Product {
  private _price: number;

  // Executes when property is defined when class definition is created by Javascript
  @Log
  title: string;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error('Price must be above 0');
    }
  }

  get price() {
    return this._price;
  }

  constructor(title: string, price: number) {
    this.title = title;
    this._price = price;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this.price * (1 + tax);
  }
}

const book = new Product('Book', 20);
console.log(book);

const test = new Product('case', 20);

/**
 * This will ensure that a method always has access to this by adding a getter that
 * binds this to the inner method. To avoid having to do that manually.
 * Creating an "Autobind" Decorator
 * https://www.udemy.com/course/understanding-typescript/learn/lecture/16935736
 * @param _ target
 * @param __ name
 * @param descriptor
 */
function AutoBind(_: any, __: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjustedDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const boundFunction = originalMethod.bind(this);
      return boundFunction;
    }
  };
  return adjustedDescriptor;
}

class Printer {
  message = 'this works!';
  @AutoBind
  showMessage() {
    console.log(this.message);
  }
}
const printer = new Printer();

const button = document.querySelector('button');
button?.addEventListener('click', printer.showMessage);

// Validating with decorators
// https://www.udemy.com/course/understanding-typescript/learn/lecture/16935748

interface ValidatorConfig {
  [property: string]: {
    [validatableProperty: string]: string[]; // ['required', 'positive']
  };
}

const registeredValidators: ValidatorConfig = {};

function RequiredProp(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: [...registeredValidators[target.constructor.name][propertyName], 'required']
  };
}

function PositiveNumber(target: any, propertyName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propertyName]: [...registeredValidators[target.constructor.name][propertyName], 'positive']
  };
}

function validate(obj: any) {
  const objectValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objectValidatorConfig) {
    return true;
  }
  let isValid = true;
  for (const prop in objectValidatorConfig) {
    console.log(prop);
    for (const validator of objectValidatorConfig[prop]) {
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break;
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }
  return isValid;
}

class Course {
  @RequiredProp
  title: string;
  @PositiveNumber
  price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }
}

const courseForm = document.querySelector('form')!;

courseForm.addEventListener('submit', event => {
  event.preventDefault();
  const titleElement = document.getElementById('title') as HTMLInputElement;
  const priceElement = document.getElementById('price') as HTMLInputElement;
  const title = titleElement.value;
  const price = +priceElement.value;
  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    alert('Invalid input!');
  }

  console.log(createdCourse);
});

export {};
