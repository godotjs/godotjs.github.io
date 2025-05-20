# Cyclic imports

Cyclic imports are allowed in `GodotJS` with some limits.

```ts
// file: cyclic_import_1.ts

import { CyclicClass2 } from "./cyclic_import_2";

// NOT OK: The behaviour is undefined if anything from cyclic imported modules is referenced in the script compile-run scope
// let a_name = CyclicClass2.something;

// NOT OK: extends a class from cyclic imported modules
// class BehaviorUndefined extends CyclicClass2 {}

// OK: references at runtime
export class CyclicClass1 {
    static call1() {
        console.log("call1");
        CyclicClass2.call2();
    }

    static call3() {
        console.log("call3");
    }
}
```

```ts
// file: cyclic_import_2.ts

import { CyclicClass1 } from "./cyclic_import_1";

export class CyclicClass2 {
    static call2() {
        console.log("call2");
        CyclicClass1.call3();
    }
}
```