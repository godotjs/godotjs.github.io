# QuickJS

To enable `QuickJS`, please run *scons* with the parameter `use_quickjs=yes`, 
or `use_quickjs_ng=yes` if [quickjs-ng](https://github.com/quickjs-ng/quickjs) is preferred.

> **NOTE:**  `QuickJS` is also available for WebBuild. 

If you choose *quickjs-ng*, please clone the source with submodules:
```sh
# If it's a fresh clone
git clone --recurse-submodules https://github.com/godotjs/GodotJS.git

# If you've already cloned it prior
git submodule update --init --recursive
```

Then, build *Godot* from source:
```sh
# An example on Windows:
scons vsproj=yes dev_build=yes p=windows use_quickjs_ng=yes 
```

