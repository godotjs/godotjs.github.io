[`godot-ts`](https://github.com/godotjs/godot-ts) is a cli tool for using GodotJS with Typescript.

See the [Intro](intro.md) how you initialize a new GodotTS project.

Afterward, you can run ``godot-ts --help`` to see additional helping.

## Further information

The cli tool handles the compilation of `.ts` files into `.mjs` files.

There are two commands `godot-ts build` & `godot-ts watch` which compile those files. Use `build` to compile your files once for production (with minification) and `watch` for developing.

Both commands will compile every `*.ts` file as it is (without bundling), to remain the required class structures for GodotJS.

Sometimes you require to bundle a `*.ts` file e.g. if you need something from `node_modules` ([example](npm-modules.md)). 
In this case name your file `*.bundle.ts`, this won't generate a `.mjs` file, instead it generates a `.js` file as bundled code.
