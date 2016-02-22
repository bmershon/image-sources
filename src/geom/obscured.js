import rayIntersectFaces from "./rayIntersectFaces";
  
// returns false if line-of-site exists between a, b
// optional exclusion face
export default function obscured(a, b, exclusion) {
  var scene = this,
      d = vec3.create(),
      λ,
      soln;

  exclusion = (typeof exclusion === "undefined") ? null : exclusion;

  vec3.sub(d, a, b);
  λ = vec3.distance(a, b);
  soln = rayIntersectFaces(b, d, scene, exclusion);

  return (soln && λ > soln.t);
}
