# Signals

You can define signals based on the amount of arguments you want to pass:

```ts
import { Node, Signal } from "godot";
import { ExportSignal } from "godot.annotations";

export default class MyNode extends Node {
  @ExportSignal()
  declare no_arg!: Signal<() => void>;

  @ExportSignal()
  declare one_arg!: Signal<(param1: string) => void>;

  @ExportSignal()
  declare two_args!: Signal<(param1: number, param2: string) => void>;
}
```

## Passing Arguments via Signals

When emitting signals, only Godot-native objects (GArray, GDictionary, and primitives) can be passed as valid arguments. 
Raw TypeScript/JavaScript objects cannot be used directly.

Incorrect Example:

```ts
this.some_signal.emit({ key: "value" }); // ❌ Raw JS object
```

You can use `GDictionary.create`/`GArray.create` to convert JS objects to their Godot equivalent data structure.

```ts
import { GDictionary } from "godot";

this.some_signal.emit(GDictionary.create({ key: "value" })); // ✅ Godot dictionary
```

## Connect and disconnect to a signal programmatically

```ts
import { Node, Callable } from "godot";

export default class MyClass extends Node {
  _ready() {
    // subscribe
    this.get_node("Button").pressed.connect(
      Callable.create(this, this.handle_onclick),
      0,
    );
  }

  handle_onclick() {
    // handle the click event
  }

  _exit_tree() {
    // unsubscribe
    this.get_node("Button").pressed.disconnect(
      Callable.create(this, this.handle_onclick),
    );
  }
}
```

> **NOTE:** Please be cautious that `Callable.create(this, this.xxx) === Callable.create(this, this.xxx)` returns `false`.  
> But it's compared internally in C++ to check equality when using them for `connect` and `disconnect`.

> **NOTE:** `Callable` does not hold a strong reference on `this` which given as the first parameter. It becomes invalid after the corresponding javascript object is garbage collected.  
> **HOWEVER**, it may cause object leaks if `this` is captured in a lambda function. So avoid coding in this way `Callable.create(this, () => this.xxx())`.

## Await a Signal

A `Signal` can be awaitable in javascript by calling `as_promise()`:

```ts
import { Node, Signal1 } from "godot";
import { signal } from "godot.annotations";

class ExampleClass extends Node {
  @signal()
  declare test_signal!: Signal1<number>;

  _ready() {
    test();
  }

  async test() {
    console.log("before signal emit");
    // result is 123
    const result = await this.test_signal.as_promise();
    console.log("after signal emit", result);
  }

  emit_somehow() {
    this.test_signal.emit(123);
  }
}
```
