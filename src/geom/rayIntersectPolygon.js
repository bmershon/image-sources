import inDelta from "../math/inDelta";

// vertices in world coordinates
export default function rayIntersectPolygon(P0, V, vertices) {
  var t,
      normal,
      area,
      sum = 0,
      w = vec3.create(),
      offset = vec3.create(),
      intersection = vec3.create(),
      vn = vec3.create();

  normal = getFaceNormal(vertices);
  vec3.sub(offset, P0, vertices[0]);
  
  t = -vec.dot(offset, normal)/vec3.dot(V, normal); 
  vec3.scale(offset, V, t);
  vec3.add(intersection, P0, offset);

  area = getPolygonArea(vertices);

  // calculate area of "partitions"
  for (let i = 0; i < vertices.length - 1; i++) {
    sum += Math.abs(getPolygonArea([vertices[i], vertices[i+1], intersection]));
  }

  return (inDelta(sum, area, 1e-4)) ? {t: t, P: intersection} : null;  
}