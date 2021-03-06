import visitChildren from "../scene/visitChildren";
import rayIntersectPolygon from "./rayIntersectPolygon";
import rayIntersectAABB from "./rayIntersectAABB";

export default function rayIntersectFaces(r, v, subtree, excludeFace) {
  var t = Infinity;
  var p = null;
  var first = null;

  visitChildren(subtree, function(parent, child) {
    if ('mesh' in child) {

      // perform axis aligned bounding box test
      // child.aabb is an object with a cube mesh and accumulated transform
      if('aabb' in child && !rayIntersectAABB(r, v, child.aabb)) return;

      var mesh = child.mesh;
      for (let f = 0; f < mesh.faces.length; f++) {
        let face = mesh.faces[f];
        if (face == excludeFace) continue;

        let polygon = face.getVerticesPos().map(function (d) {
          let transformed = vec3.create();
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