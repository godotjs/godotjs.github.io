# Build from Source

You can build different runtimes from source.
The following runtimes are available:

- [`v8`](v8.md) is proven to be one of the most powerful and high-performance JavaScript runtimes.
- [`QuickJS`](quick-js.md) is a remarkable and lightweight option.
- [`JavaScriptCore`](javascript-core.md) is the built-in JavaScript engine for WebKit and bundled with macOS/iOS.
- [`Web`](web.md) is only suitable when building for Web. All scripts run on the host browser JS VM rather than an additional interpreter.

## Setup GodotJS in Godot Engine

### 1. Clone the source code of godot:
````shell
git clone git@github.com:godotengine/godot.git
````

or

````shell
git clone https://github.com/godotengine/godot.git
````

### 2. Checkout the correct version branch

Look at this [list](https://github.com/godotjs/GodotJS/blob/main/.github/workflows/runner.yml#L36) to see supported Godot versions.

### 3. Clone GodotJS module

Clone this module and put it into ``godot/modules/GodotJS``:

````shell
git clone git@github.com:godotjs/GodotJS.git godot/modules/GodotJS
````

or

````shell
git clone https://github.com/godotjs/GodotJS.git godot/modules/GodotJS
````

## Supported Platforms

|                | v8               | quickjs         | quickjs-ng      | Web Builtin JS      | JavaScriptCore  |
| -------------- | ---------------- | --------------- | --------------- | ------------------- | --------------- |
| Windows:x86_64 | ✅               | ✅              | ✅              | ❌                  | ❌              |
| Windows:arm64  | ✅               | ✅              | ✅              | ❌                  | ❌              |
| MacOS:x86_64   | ✅ (not tested)  | ✅ (not tested) | ✅ (not tested) | ❌                  | ✅ (not tested) |
| MacOS:arm64    | ✅               | ✅              | ✅              | ❌                  | ✅ (debugging)  |
| Linux:x86_64   | ✅ (not tested)  | ✅ (not tested) | ✅              | ❌                  | ❌              |
| Linux:arm64    | ✅               | ✅              | ✅              | ❌                  | ❌              |
| Android:x86_64 | ✅ (not tested)  | ✅ (not tested) | ✅ (not tested) | ❌                  | ❌              |
| Android:arm64  | ✅               | ✅ (not tested) | ✅ (not tested) | ❌                  | ❌              |
| iOS:x86_64     | ✅ (not tested)  | ✅ (not tested) | ✅ (not tested) | ❌                  | ✅ (not tested) |
| iOS:arm64      | ✅ (not tested)  | ✅ (not tested) | ✅ (not tested) | ❌                  | ✅ (not tested) |
| Web:wasm32     | ❌               | ✅ (not tested) | ✅ (not tested) | ✅ (debugging)      | ❌              |
| Debugger       | ✅ Chrome/VSCode | ❌              | ❌              | ✅ browser devtools | ✅ Safari       |

> Android: only tested on ndk_platform=android-24  
> Web: only tested on emsdk-3.1.64  
> JavaScriptCore: macOS 15, iOS 18 (support for lower versions may be implemented in future versions)
