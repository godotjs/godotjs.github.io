# Worker

_Worker_ is currently supported as an experimental feature with limitations:

- Can not use script classes (GodotJSScript) in workers
- `transferable objects` are not supported
- `onerror` and `onready` events are not implemented yet

> **NOTE:** The class name _Worker_ may be changed in future versions for compatibility in different JS engines.  
> And, _Worker_ scripts may need to have a specific file name suffix or reside in a designated directory.

# A Simple Example

```ts
// tests/master.ts
// ...
import { Object, Node } from "godot";
import { JSWorker } from "godot.worker";

let worker = new JSWorker("tests/worker");
worker.onmessage = function (m: any) {
  console.log("master: get message", m);
};
worker.ontransfer = function (obj: Object) {
  console.assert(obj instanceof Node);
  this.add_child(obj);
  worker.terminate();
};
worker.postMessage("hello");
```

```ts
// tests/worker.ts
import { PackedScene, ResourceLoader } from "godot";
import { JSWorkerParent } from "godot.worker";

if (typeof JSWorkerParent !== "undefined") {
  JSWorkerParent.onmessage = function (m: any) {
    console.log("worker: get message", m);
    JSWorkerParent.postMessage("worker result");

    // [EXPERIMENTAL] instantiate a PackedScene in worker thread and transfer it back to master thread
    let asset = <PackedScene>ResourceLoader.load("res://background.tscn");
    let obj = asset.instantiate();
    console.log("[worker] transfering object:", obj);
    JSWorkerParent.transfer(obj);

    // worker can terminate itself by calling `close()`
    // close();
  };
}
```
