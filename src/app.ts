// function Logger(logString: string) {
//   console.log("Logger factory");
//   return function (constructor: Function) {
//     console.log(logString);
//     console.log(constructor);
//   };
// }

// function WithTemplate(template: string, hookId: string) {
//   console.log("Template factory");
//   return function <T extends { new (...args: any[]): { name: string } }>(
//     originalConstructor: T
//   ) {
//     // console.log("rendering template");

//     // const p = new originalConstructor();
//     // const hookEl = document.getElementById(hookId);
//     // if (hookEl) {
//     //   hookEl.innerHTML = template;
//     //   hookEl.querySelector("h1")!.textContent = p.name;
//     // }

//     return class extends originalConstructor {
//       constructor(..._: any[]) {
//         super();
//         console.log("Rendering template");
//         const hookEl = document.getElementById(hookId);
//         if (hookEl) {
//           hookEl.innerHTML = template;
//           hookEl.querySelector("h1")!.textContent = this.name;
//         }
//       }
//     };
//   };
// }

// @Logger("LOGGING-PERSON")
// @WithTemplate("<h1>mam</h1>", "app")
// class Person {
//   name = "Max";

//   constructor() {
//     console.log("Creating person");
//   }
// }

// const pers = new Person();
// console.log(pers);

// function Log(target: any, propertyName: string | Symbol) {
//   console.log("Property decorator");
//   console.log(target, propertyName);
// }

// function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
//   console.log("Accessor decorator");
//   console.log(target);
//   console.log(name);
//   console.log(descriptor);
// }

// function Log3(
//   target: any,
//   name: string | Symbol,
//   descriptor: PropertyDescriptor
// ) {
//   console.log("");

//   console.log("Method decorator");
//   console.log(target);
//   console.log(name);
//   console.log(descriptor);
// }

// // position => index of parameter 0,1,2,3,...
// function Log4(target: any, name: string | Symbol, position: number) {
//   console.log("Parameter decorator");
//   console.log(target);
//   console.log(name);
//   console.log(position);
// }

// // Log2(setter) ,Log3(method) decorator สามารถ return somethingได้
// // Log1(property) ,Log4(argument) decorator สามารถ return somethingได้
// class Product {
//   @Log
//   title: string;
//   private _price: number;

//   @Log2
//   set price(val: number) {
//     if (val > 0) {
//       this._price = val;
//     } else {
//       throw new Error("Invalid price - should be positive");
//     }
//   }

//   constructor(t: string, p: number) {
//     this.title = t;
//     this._price = p;
//   }

//   @Log3
//   getPriceWithTax(@Log4 tax: number) {
//     return this._price * (1 + tax);
//   }
// }

// const p1 = new Product("Book", 19);
// const p2 = new Product("Book2", 19);

// // function Autobind(
// //   target: any,
// //   methodName: string,
// //   descriptor: PropertyDescriptor
// // ) {
// function Autobind(_: any, _2: string, descriptor: PropertyDescriptor) {
//   const originalMethod = descriptor.value;
//   const adjDescriptor: PropertyDescriptor = {
//     configurable: true,
//     enumerable: false,
//     // สร้าง getter ขึ้นมา เพราะมันจะrun getter before execute the function
//     get() {
//       // this คือ อะไรก็ตามที่มาtrigger getter() ซึ่งก็คือ original method
//       const boundFn = originalMethod.bind(this);
//       return boundFn;
//     },
//   };
//   return adjDescriptor;
// }
// class Printer {
//   message = "This works!";

//   //   @Autobind
//   showMessage() {
//     console.log(this.message);
//   }
// }

// const p = new Printer();
// const button = document.querySelector("button")!;
// // first solution by vanila js
// // button.addEventListener("click", p.showMessage.bind(p));

// // second solution by using decorator
// // ถ้าไม่มี decorator เพื่อ bind it will always return undefined
// // because this ใน  showMessage() {  console.log(this.message);}
// // มัน refer ถึง button ซึ่งไม่มี messageยุ
// // หลังจากนี้ไม่ว่าจะเรียก p.showMessageยังไง thisในนั้นจะอ้างอิงถึงmethodได้เสมอ
// button.addEventListener("click", p.showMessage);

interface ValidatorConfig {
  [property: string]: {
    [validatableProp: string]: string[]; //["required","positive"]
  };
}

const registeredValidators: ValidatorConfig = {};

// validate input by decorator
function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "required",
    ],
  };
}

function PositiveNumber(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: [
      ...(registeredValidators[target.constructor.name]?.[propName] ?? []),
      "positive",
    ],
  };
}

function validate(obj: any) {
  const objValidatorConfig = registeredValidators[obj.constructor.name];
  if (!objValidatorConfig) {
    return true;
  }

  let isValid = true;

  for (const prop in objValidatorConfig) {
    console.log(prop);

    for (const validator of objValidatorConfig[prop]) {
      switch (validator) {
        case "required":
          // !! ใช้เพื่อ แปลง ค่าเป็น true or false (check not empty)
          isValid = isValid && !!obj[prop];
          break;
        case "positive":
          isValid = isValid && obj[prop] > 0;
          break;
      }
    }
  }

  return isValid;
}
class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t: string, p: number) {
    this.title = t;
    this.price = p;
  }
}

const courseForm = document.querySelector("form")!;
courseForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const titleEl = document.getElementById("title") as HTMLInputElement;
  const priceEl = document.getElementById("price") as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price);

  if (!validate(createdCourse)) {
    console.log("!validate(createdCourse)");

    alert("invalid input,please try again!!");
    return;
  }
  console.log(createdCourse);
});
