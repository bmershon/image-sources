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
      vec3.sub(v, target.pos, p.pos);
      soln = rayIntersectFaces(p.pos, v, scene, exclusion);
      
      if (soln && soln.face == target.genFace) {
        p = {pos: soln.p, rcoeff: target.rcoeff};
        exclusion = target.genFace;
        path.push(p);
        target.hit = true;

      } else if (soln) {
        break; // there is an obstruction
      } else if (target.order === 0){ // no obstruction, back at source
        path.push(scene.source);
        scene.paths.push(path); 
      }

      target = target.parent; // image source that generated this target
    }
  }
}
