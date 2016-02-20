import inDelta from "../math/inDelta";

// vertices in world coordinates
export default function rayIntersectPolygon(r, v, polygon) {
  var N = polygon.length,
      i = -1,
      a,
      b = polygon[N - 1],
      t,
      n,
      area,
      sum = 0,
      p = b,
      d = vec3.create(),
      p_r = vec3.create(),
      q = vec3.create();

  n = getFaceNormal(polygon);
  vec3.normalize(n, n);
  vec3.sub(p_r, p, r);
  
  t = vec3.dot(p_r, n)/vec3.dot(v, n); 
  vec3.scale(d, v, t);
  vec3.add(q, r, d);

  if (t < 0) return null;d

  area = getPolygonArea(polygon);

  // sum partitions
  while (++i < N) {
    a = b;
    b = polygon[i];
    sum += getPolygonArea([a, b, q]);
  }

  // verify point is inside convex polygon
  return (inDelta(sum, area, 1e-4)) ? {t: t, p: q} : null;  
}