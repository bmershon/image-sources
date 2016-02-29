import rayIntersectPolygon from "./rayIntersectPolygon";

// perform naive ray intersection with AABB 
// using intersections with each of the 6 polygons in the mesh
export default function rayInserectAABB(r, v, bbox) {
  var mesh = bbox.mesh; // unit cube
  for (let f = 0; f < 6; f++) {
    let face = mesh.faces[f];

    let polygon = face.getVerticesPos().map(function (d) {
      let transformed = vec3.create();
      vec3.transformMat4(transformed, d, bbox.accumulated);
      return transformed;
    });

    var soln = rayIntersectPolygon(r, v, polygon);
    if (soln !== null) return true;
  }

  return false;
}