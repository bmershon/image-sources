import rayIntersectFaces from "./rayIntersectFaces";

export default function obscured(a, b) {
  var scene = this,
      d = vec3.create();

  vec3.sub(d, a, b);

  return !(rayIntersectFaces(b, d, scene, null) === null); 
}