# NPM Dependencies

Currently, `GodotJS` doesn't provide sufficient support for using code from npm packages. Because many factors are involved in it, such as:

- Scripts depend on functionalities of node.js which is not supported
- How the typescript/javascript project is packaged (archive into a single script file or not)
- Javascript modular standard variants may be involved

If a npm package just works, there is no guarantee that it does also work after packaging, `GodotJS` tries to export all dependant javascript sources into the targeting package.

> **NOTE:** See [read_xlsx.ts](https://github.com/ialex32x/GodotJSExample/blob/main/tests/read_xlsx.ts) about using a npm package.
