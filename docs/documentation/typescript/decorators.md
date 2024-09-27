One feature of GodotTS is that your can use decorators for adding `register` functions to your class like [signals](../getting-started.md#how-to-export-signals).

Most of the `register` functions are available as various decorators as seen below. Check the decorators in `src/decorators.bundle` generated in [intro](intro.md).

```ts
import { signal, property, tool, onready, node } from "./decorators.bundle";

@tool // make the script runnable in godot editor
export default class InputLine extends godot.HBoxContainer {
  // define a signal
  @signal
  static readonly OnTextChanged: string;

  // expose a node property
  @node
  icon: godot.Sprite;

  // register offset property with the godot inspector with default value of Vector2(0, 0)
  @property({ default: godot.Vector2.ZERO })
  offset: godot.Vector2;

  // register properties for godot editor inspector
  @property({ type: godot.VariantType.TYPE_STRING })
  get title() {
    return this._title;
  }
  set title(v: string) {
    this._title = v;
    if (this._label) {
      this._label.text = v;
    }
  }
  private _title: string;

  @property({ default: "Input text here" })
  get hint() {
    return this._hint;
  }
  set hint(v: string) {
    this._hint = v;
    if (this.edit) {
      this.edit.hint_tooltip = v;
      this.edit.placeholder_text = v;
    }
  }
  private _hint: string;

  get label(): godot.Label {
    return this._label;
  }
  protected _label: godot.Label;

  // call get_node('LineEdit') and assign the returned value to 'this.edit' automatically when the node is ready
  @onready("LineEdit")
  edit: godot.LineEdit;

  get text(): string {
    return this.edit?.text;
  }

  _ready() {
    // get first child with the type of godot.Label
    this._label = this.get_node(godot.Label);

    // Apply the inspector filled values with property setters
    this.title = this.title;
    this.hint = this.hint;

    this.edit.connect(godot.LineEdit.text_changed, (text: string) => {
      this.emit_signal(InputLine.OnTextChanged, text);
    });
  }
}
```
