You can import ES5/ES6 modules installed from e.g. `npm`. But you need to bundle them first.

We recommend that you create a `npm.bundle.ts` file where you locate all of your dependencies.

## Example

Install dependency:

```shell title="terminal"
npm i dayjs
```

Export the dependency from your `npm.bundle.ts` file.

```ts title="npm.bundle.ts"
export { default as dayjs } from "dayjs";
```

Import the dependency in another class

```ts title="my-class.ts"
import { dayjs } from "./npm-modules.bundle";

export default class MyClass extends Node {
  _ready(): void {
    console.log(dayjs().toString());
  }
}
```

> **Note:** If you use `godot-ts build/watch` the `npm.bundle.ts` file will be bundled with every dependency from `node_modules`, while regular `*.ts` files will preserve their imports. This is required for GodotJS to work.
