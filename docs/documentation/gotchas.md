# Gotchas and limitations

Some common mistakes and limitations.

## Position.x is immutable

You cannot change `this.position.x` try to change `this.position`:

```javascript title="player.mjs"
export default class Player extends godot.KinematicBody2D {
  constructor() {
    super();
    this.direction = new godot.Vector2(1, 0);
  }
  _ready() {}
  _process(delta) {
    this.position.x += this.direction.x; // <- breaks
    this.position += this.direction; // <- works
  }
}
godot.register_property(Player, "direction", new godot.Vector2(1, 0));
```

## `register_property` has to be a target

You cannot change `this.position.x` try to change `this.position`:

```javascript title="player.mjs"
export default class Player extends godot.KinematicBody2D {}
// This works
godot.register_property(Player, "directionWorks", new godot.Vector2(1, 0));
// This breaks because `player` isn't a correct target
godot.register_property(player, "directionBreaks", new godot.Vector2(1, 0));
```
