/**
 *
 * Original implementation for image-sources assignment by Chris Tralie
 *
 */

import visitChildren from "../scene/visitChildren";
import rayIntersectPolygon from "./rayIntersectPolygon";

export default function rayIntersectFaces(r, v, node, excludeFace) {
  var scene = this;
  var tmin = Infinity;//The parameter along the ray of the nearest intersection
  var qMin = null;//The point of intersection corresponding to the nearest interesection
  var faceMin = null;//The face object corresponding to the nearest intersection

  visitChildren(scene, function(parent, child) {
    if ('mesh' in child.mesh) {
      var mesh = child.mesh;
      for (let f = 0; f < mesh.faces.length; f++) {
        let face = mesh.faces[i];
        if (face == excludeFace) continue;

        let worldVertices = face.getVerticesPos().map(function (d) {
          let transformed = vec3.create();
          vec3.transformMat4(transformed, d, child.accumulated);
          return transformed;
        });

        //Intersect the ray with this polygon
        var res = rayIntersectPolygon(r, v, worldVertices);
        if (!(res === null) && (res.t < tmin)) {
          tmin = res.t;
          PMin = res.P;
          faceMin = mesh.faces[f];
        }
      }
    }
  });

  return (qMin === null) ? null : {tmin:tmin, PMin:qMin, faceMin:faceMin};
}