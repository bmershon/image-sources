import rayIntersectFaces from "./rayIntersectFaces";
import obscured from "./obscured";

export default function extractPaths() {
  var scene = this,
      n = scene.imsources.length,
      tx = scene.source.pos,
      rx = scene.receiver.pos;

  scene.paths = [];

  // attempt path starting with receiver and an image source 
  for (let i = 0; i < n; i++) {
    let path = [scene.receiver],
        target = scene.imsources[i], // next image source
        p = scene.receiver, // intersection point on face
        exclusion = null, // last intersected face
        v = vec3.create(),
        soln;

    // backtrack reflected image sources while adding face intersections 
    while (target !== null) {
      vec3.sub(v, target.pos, p.pos); // aim at target
      soln = rayIntersectFaces(p.pos, v, scene, exclusion); // find intersection
      
      if (target.order == 0 && !scene.obscured(p.pos, target.pos, exclusion)) {
        path.push(scene.source);
        scene.paths.push(path); // complete path
      } else if (soln && soln.face == target.genFace) {
        p = {pos: soln.p, rcoeff: target.rcoeff}; // face intersection
        exclusion = target.genFace;
        path.push(p);
      } else {
        break; // abort path
      }
      target = target.parent; // image source that generated this target
    }
  }
  return this;
}