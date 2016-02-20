import visitChildren from "../scene/visitChildren";

// order (int) : The maximum number of bounces to take
export default function computeImageSources(order) {
  
  var scene = this,
      l = 1;

  order = (isNaN(order)) ? 0 : order;

  scene.source.order = 0;
  scene.source.rcoeff = 1.0;
  scene.source.parent = null;
  scene.source.genFace = null;

  scene.imsources = [scene.source];

  while (l <= order) {

    let N = scene.imsources.length;

    for (var k = 0; k < N; k++) {
      let source = scene.imsources[k];

      if (source.order < l - 1) continue;

      visitChildren(scene, function(parent, child) {
        if('mesh' in child) {
          for (var f = 0; f < child.mesh.faces.length; f++) {
            let face = child.mesh.faces[f];
            if (face == source.genFace) continue;

            let vertex = face.getVerticesPos()[0];
            let p = vec3.fromValues(source.pos[0], source.pos[1], source.pos[2]);
            let v = vec3.create();
            let w = vec3.create();
            let r = vec3.create();
            let normal = vec3.create();
            let projected;
            let offset = vec3.create();
            let M = mat3.create();

            // Transform plane normal with normalMatrix
            mat3.normalFromMat4(M, child.accumulated);
            vec3.transformMat3(normal, face.getNormal(), M);
            vec3.normalize(normal, normal);
            vec3.transformMat4(v, face.getCentroid(), child.accumulated);
            
            // project (v - p) onto plane normal; scale vector by 2 to get image
            vec3.sub(w, v, p);
            projected = vec3.project(w, normal);
            vec3.scale(offset, projected, 2);
            vec3.add(r, p, offset);

            scene.imsources.push({
              pos: r,
              parent: source.parent,
              genFace: face,
              rcoff: source.rcoeff,
              order: l
            });
          }
        }
      });
    }
    l++;
  }
}