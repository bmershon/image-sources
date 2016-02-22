import rayIntersectFaces from "./rayIntersectFaces";
import inDelta from "./math/inDelta";
  
// returns false line-of-site exists between a, b
export default function obscured(a, b) {
  var scene = this,
      d = vec3.create(),
      λ,
      soln;

  vec3.sub(d, a, b);
  λ = vec3.distance(a, b);
  soln = rayIntersectFaces(b, d, scene, null);

  return (soln && λ > soln.t);
}
