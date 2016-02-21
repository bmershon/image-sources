import rayIntersectFaces from "./rayIntersectFaces";
import obscured from "./obscured";

export default function extractPaths() {
  var scene = this,
      n = scene.imsources.length,
      tx = scene.source.pos,
      rx = scene.receiver.pos;

  if (!scene.obscured(tx, rx)) scene.paths.push([s(tx), s(rx)]);

  for (let i = 0; i < n; i++) {
    let source = scene.imsources[i];
  }
}

// function build(path) {
//   let n = path.length,
//       source = path[n - 1];

//   for (let i = 0; i < imsources.length; i++) {
//     let im = imsources[i];
//     let v = vec3.create();
//     vec3.sub(v, im, rx)
//     let soln = rayIntersectFaces(source, v, scene, exclusion);
//     if (soln && soln.face == source.getFace) {
//       path.push[s(soln.p, im.rcoeff)];
//     }
//   }

// }

// returns true if direct line-of-site is obscured between a and b


function s(pos, rcoeff) {
  pos = pos || vec3.create();
  rcoeff = rcoeff || 0.0;
  
  return {
      pos: vec3.clone(pos),
      rcoeff: rcoeff
  };
}