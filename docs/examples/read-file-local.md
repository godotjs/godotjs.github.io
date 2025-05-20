# Read file local

This example shows how to load any file as string from a local folder.

## 1. Create the file you want to read

In this example we try to read a `.csv` file, but it should work with any other file as well.

We create a folder `resources` and add a new file `test.csv`:

```csv title="test.csv"
keys,en,de
HELLO,hello,hallo
```

## 2. Read the file in class

We use [FileAccess](https://docs.godotengine.org/en/stable/classes/class_fileaccess.html) to read the file.

We create a new file `read-local-file.ts`:

```ts title="read-local-file.ts"
import { FileAccess, Node } from "godot";

export default class ReadLocalFile extends Node {
  _ready(): void {
    const file = FileAccess.open(
      "res://resources/test.csv",
      FileAccess.ModeFlags.READ,
    );
    let fileContent: string = "";
    while (!file.eof_reached()) {
      fileContent += `${file.get_line()}\n`;
    }
    console.log(fileContent);
  }
}
```
