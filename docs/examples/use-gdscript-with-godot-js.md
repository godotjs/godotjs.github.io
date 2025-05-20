# Use GDScript with GodotJS

This example shows how to use a class written in GDScript in a GodotJS class.

## 1. Create the GDScript file

First we create a simple class with GDScript inside a new file `scripts/gd/GDTest.gd`:

```gdscript title="GDTest.gd"
extends Node

func _ready():
	pass

func print_in_gd_test():
	print("gd_test")

```

## 2. Create a declaration (\*.d.ts) for GDScript

For proper TypeScript support we need to add a `gdscript.d.ts` file:

```ts title="gdscript.d.ts"
declare module "gdscript" {
  import { Node } from "godot";

  declare class GDTest extends Node {
    call(fn: "_ready"): void;
    call(fn: "print_in_gd_test"): void;
  }
}
```

## 3. Use the class inside your TS file

In the end we need to call the `GDTest.gd` from a GodotJS class like `main.ts`:

```ts title="main.ts"
import { ResourceLoader, Node } from "godot";
import { GDTest } from "gdscript";

export default class Main extends Node {
  _ready(): void {
    const gdTest = ResourceLoader.load("res://examples/run-gd/runner.gd").call(
      "new",
    ) as GDTest;

    gdTest.call("print_in_gd_test");
  }
}
```

> **Note:** The important thing here is that you use `call("new")` to instantiate
> and `call("print_in_gd_test")` to execute the function

## Use [godot-ts](https://github.com/godotjs/godot-ts) to generate the declaration files

You can use [`godot-ts generate`](<(https://github.com/godotjs/godot-ts/blob/main/docs/API.md#generate)>)
to generate the declaration files for you. It will create a `gdscript.d.ts` 
file with all custom GDScript classes inside your project.

Furthermore, it will generate a ``generated/gdscript.ts`` file which contains a 
function `instantiate_gdscript` which provides `ResourceLoader.load` with all available paths to GDScript files.
