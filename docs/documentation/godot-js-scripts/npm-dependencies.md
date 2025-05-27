# NPM Dependencies

Currently, `GodotJS` doesn't provide sufficient support for using code from npm packages. Because many factors are involved in it, such as:

- Scripts depend on functionalities of node.js which is not supported
- How the typescript/javascript project is packaged (archive into a single script file or not)
- Javascript modular standard variants may be involved

## Workaround as bundle

Try to bundle npm dependencies to an own file to avoid potential conflicts.

If you use [godot-ts](https://github.com/godotjs/godot-ts) you can create a `*.bundle.ts` file like this:

```ts npm.bundle.ts
export { default as dayjs } from "dayjs";
```

```ts example.ts
import { Label, Node } from "godot";
import { dayjs } from "./npm.bundle";

export default class Example extends Node {
  _ready(): void {
    const label: Label = this.get_node("Label") as Label;

    label.text = dayjs().toString();
  }
}
```
