function Logger(logString: string) {
  console.log("Logger factory");
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log("Template factory");
  return function (constructor: any) {
    console.log("rendering template");

    const p = new constructor();
    const hookEl = document.getElementById(hookId);
    if (hookEl) {
      hookEl.innerHTML = template;
      hookEl.querySelector("h1")!.textContent = p.name;
    }
  };
}

@Logger("LOGGING-PERSON")
@WithTemplate("<h1>mam</h1>", "app")
class Person {
  name = "Max";

  constructor() {
    console.log("Creating person");
  }
}

// const pers = new Person()
// console.log(pers);

function Log(target: any, propertyName: string | Symbol) {
  console.log("Property decorator");
  console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("");

  console.log("Method decorator");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("Invalid price - should be positive");
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(tax: number) {
    return this._price * (1 + tax);
  }
}
