# JavaScriptCore

To enable `JavaScriptCore`, please run *scons* with the parameter `use_jsc=yes`.

> **NOTE:**  `JavaScriptCore` is only available on macOS/iOS since the system bundled `JavaScriptCore.framework` is used. 

```sh
# An example on macOS:
scons compiledb=yes dev_build=yes use_jsc=yes 
```

