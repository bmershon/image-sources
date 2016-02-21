import rayIntersectFaces from "./rayIntersectFaces";
import obscured from "./obscured";

export default function extractPaths() {
  var scene = this,
      n = scene.imsources.length,
      tx = scene.source.pos,
      rx = scene.receiver.pos;

  scene.paths = [];

  // add line-of-site path
  if (!scene.obscured(tx, rx)){
    scene.paths.push([scene.source, scene.receiver]);
  }

  for (let i = 0; i < n; i++) {
    let path = [scene.receiver],
        target = scene.imsources[i], // next image source
        p = scene.receiver, // intersection point on face
        exclusion = null, // last intersected face
        v = vec3.create(),
        soln;

    if (!target.parent) continue; // ignore source as a start

    while (target !== null) {
      vec3.sub(v, target.pos, p.pos); // aim at target
      soln = rayIntersectFaces(p.pos, v, scene, exclusion); // find intersection
        
      if (target.order === 0 && !scene.obscured(p.pos, target.pos)) {
        path.push(scene.source);
        scene.paths.push(path); // complete path
      } else if (soln && soln.face == target.genFace) {
        p = {pos: soln.p, rcoeff: target.rcoeff}; // face intersection
        exclusion = target.genFace;
        path.push(p);
      }

      target = target.parent; // image source that generated this target
    }
  }
}
