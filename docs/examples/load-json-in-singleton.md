# Load json in singleton

This example shows how to load a file like a `config` inside a singleton to access it everywhere.

> **Note:** You need to set `"resolveJsonModule": true` inside your `tsconfig.json`.

## 1. Create file

We create a new folder named `config` and a new file `test.json`.

Next we write this to the `test.json`:

```json title="test.json"
{
  "test": true
}
```

## 2. Create the singleton

We create a new file inside our `scripts` folder like `read-config.ts` and add this code to it:

```ts title="read-config.ts"
// @ts-ignore
import { Node } from "godot";
// @ts-ignore
import TestJson from "res://config/test.json";

type TestType = {
  test: boolean;
};
export default class ReadTest extends Node {
  testType: TestType = TestJson as TestType;
  logTestType() {
    console.log(this.testType.test);
    console.log(JSON.stringify(this.testType));
  }
}
```

## 3. Autoload singleton in project

We need to update the `[autoload]` inside `project.godot`:

```text title="project.godot"
...
[autoload]

ReadTest="*res://examples/read-test/read-test.ts"
...
```

## 4. Use the singleton in other class

In another class e.g. `main.ts` you need to import the `ReadConfig` then you
can access every public property and method from `ReadConfig` via
`this.get_node("/root/ReadTest")`:

```ts title="main.ts"
import { Node } from "godot";
import ReadTest from "./read-test";

export default class Main extends Node {
  onButtonPressed() {
    const readTest: ReadTest = this.get_node("/root/ReadTest") as ReadTest;
    readTest.logTestType();
  }
}
```
