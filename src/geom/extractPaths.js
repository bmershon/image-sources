import rayIntersectFaces from "./rayIntersectFaces";
import obscured from "./obscured";

export default function extractPaths() {
  var scene = this,
      n = scene.imsources.length,
      tx = scene.source.pos,
      rx = scene.receiver.pos;

  scene.receiver.rcoeff = 0.0;

  // add line-of-site path
  if (!scene.obscured(tx, rx)) scene.paths.push([s(tx), s(rx)]);

  for (let i = 0; i < n; i++) {
    let path = [scene.receiver],
        target = scene.imsources[i],
        p = scene.receiver,
        exclusion = null,
        v = vec3.create(),
        end,
        soln;

    if (!target.parent) continue;

    while (target) {
      vec3.sub(v, target.pos, p.pos);
      soln = rayIntersectFaces(p.pos, v, scene, exclusion);
      
      if (soln && soln.face == target.genFace) {
        p = s(soln.p, target.rcoeff);
        exclusion = target.genFace;
        target = target.parent;
        path.push(p);
      } else if (soln) {
        // there is an obstruction
        break;
      } else { // no obstruction, back at source
        path.push(scene.source);
        scene.paths.push(path); 
      }
    }
  }
}

function s(pos, rcoeff) {
  pos = pos || vec3.create();
  rcoeff = rcoeff || 0.0;
  
  return {
      pos: vec3.clone(pos),
      rcoeff: rcoeff
  };
}