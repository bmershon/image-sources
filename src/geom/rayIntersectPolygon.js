import inDelta from "../math/inDelta";

// vertices in world coordinates
export default function rayIntersectPolygon(r, u, polygon) {
  var n = polygon.length,
      i = -1,
      a,
      b = polygon[n - 1],
      t,
      norm,
      area,
      sum = 0,
      p = b,
      d = vec3.create(),
      v = vec3.create(),
      r2p = vec3.create(),
      q = vec3.create();

  // normalize direction vector so solution
  // gives distance to intersection
  v = vec3.clone(u);
  vec3.normalize(v, v);
  norm = getFaceNormal(polygon.slice(0, 3));
  vec3.normalize(norm, norm);
  vec3.sub(r2p, p, r);
  
  t = vec3.dot(r2p, norm) / vec3.dot(v, norm); 
  vec3.scale(d, v, t);
  vec3.add(q, r, d);

  if (t < 0) return null;

  area = getPolygonArea(polygon);

  // sum partitions
  while (++i < n) {
    a = b;
    b = polygon[i];
    sum += getPolygonArea([a, b, q]);
  }

  // verify point is inside convex polygon
  return (inDelta(sum, area, 1e-4)) ? {t: t, p: q} : null;  
}