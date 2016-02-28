import visitChildren from "./visitChildren";

// adding accumulated transforms to all children in scenograph

export default function accumulateTransforms() {
  var scene = this;
  accumulate(scene);
}

function accumulate(root) {
  visitChildren(root, function(parent, child) {
    var accumulated = mat4.create();

    var I = mat4.create();
    mat4.identity(I, I);

    parent.transform = parent.transform || I;

    if (child.transform) {
      mat4.mul(accumulated, parent.transform, child.transform);
      child.accumulated = accumulated;
    }
  });
}