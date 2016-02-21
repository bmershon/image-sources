import visitChildren from "../scene/visitChildren";
import rayIntersectPolygon from "./rayIntersectPolygon";

export default function rayIntersectFaces(r, v, subtree, excludeFace) {
  var t = Infinity;
  var p = null;
  var first = null;

  visitChildren(subtree, function(parent, child) {
    if ('mesh' in child) {
      var mesh = child.mesh;
      for (let f = 0; f < mesh.faces.length; f++) {
        let face = mesh.faces[f];
        if (face == excludeFace) continue;

        let polygon = face.getVerticesPos().map(function (d) {
          let transformed = mat4.create();
          vec3.transformMat4(transformed, d, child.accumulated);
          return transformed;
        });

        //Intersect the ray with this polygon (in world coordinates)
        var soln = rayIntersectPolygon(r, v, polygon);
        if (!(soln === null) && (soln.t < t)) {
          t = soln.t;
          p = soln.p;
          first = face;
        }
      }
    }
  });

  return (p === null) ? null : {t: t, p: p, face: first};
}