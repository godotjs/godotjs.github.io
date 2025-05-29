# Scripting

A GodotJS class can extend a Godot Object class:

```ts
export default class MyNode extends Node {
  _ready() {
    console.log("MyNode _ready");
  }
}
```

> **Note:** A class must be exported as `default`,
> otherwise the script will not be recognized as a valid script class.

## Constructor

> **WARNING:** Explicitly defined `constructor` in script classes inherited from Godot Object are not recommended, because GodotJS constructs the script classes for special uses (such as CDO and cross-binding).  
> If it can't be avoided, always define it with an explicit argument `identifier? any`, and don't forget to call `super(identifier)`.

For instance:

```ts
export default class MyExampleNode extends Node {
  constructor(identifier?: any) {
    super(identifier);

    // do other things you want
    //...
  }
}
```

You can instantiate a script class directly with `new` in scripts:

```ts
// do not pass any arguments to the constructor
let node = new MyExampleNode();
```

## Async/Await

You can use `async/await` in your scripts to handle asynchronous operations.

```ts
import { Node } from "godot";

function seconds(secs: number) {
  return new Promise(function (resolve) {
    setTimeout(function () {
      resolve(undefined);
    }, secs * 1000);
  });
}

export default class MyJSNode extends Node {
  // it's also possible to use async functions in scripts (even the `_ready` call)
  async call_me() {
    await seconds(1);
  }
}
```

## Annotations

Annotations are used to define properties, signals, and other metadata for Godot objects.
They are similar to decorators in TypeScript and can be used to enhance the functionality of your scripts.
Check out [decorators](decorators.md) for more information.

## Auto-Completion and Codegen

By default, GodotJS wil auto generate some TypeScript files based on you project.
Check out [auto-completion](auto-completion.md) for more information.
