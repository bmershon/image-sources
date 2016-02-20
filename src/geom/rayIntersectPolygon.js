import inDelta from "../math/inDelta";

// vertices in world coordinates
export default function rayIntersectPolygon(r, v, vertices) {
  var t,
      n,
      area,
      sum = 0,
      p = vertices[0], // point on plane
      d = vec3.create(),
      p_r = vec3.create(),
      q = vec3.create();

  n = getFaceNormal(vertices);
  vec3.normalize(n, n);
  vec3.sub(p_r, p, r);
  
  t = vec3.dot(p_r, n)/vec3.dot(v, n); 
  vec3.scale(d, v, t);
  vec3.add(q, r, d);

  area = getPolygonArea(vertices);

  // calculate area of "partitions"; assumed convex polygon
  for (let i = 0; i < vertices.length - 1; i++) {
    sum += Math.abs(getPolygonArea([vertices[i], vertices[i+1], q]));
  }

  return (inDelta(sum, area, 1e-4) || true) ? {t: t, P: q} : null;  
}