(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('./geom')) :
  typeof define === 'function' && define.amd ? define('image-sources', ['exports', './geom'], factory) :
  factory((global.image_sources = {}),global.computeBoundingBoxes);
}(this, function (exports,computeBoundingBoxes) { 'use strict';

  computeBoundingBoxes = 'default' in computeBoundingBoxes ? computeBoundingBoxes['default'] : computeBoundingBoxes;

  // recursively traverse all children in scenograph,
  // passing current child and its parent to callback
  function visitChildren(node, callback) {
    if (node === null || node === undefined || !node.children) return;

    for (let i = 0; i < node.children.length; i++) {
      let child = node.children[i];
      callback(node, child);
      visitChildren(child, callback);
    }
    
    return;
  }

  // adding accumulated transforms to all children in scenograph
  function accumulateTransforms(root) {
    visitChildren(root, function accumulate(parent, child) {
      var accumulated = mat4.create();

      var I = mat4.create();
      mat4.identity(I, I);

      parent.transform = parent.transform || I;

      if (child.transform) {
        mat4.mul(accumulated, parent.transform, child.transform);
        child.accumulated = accumulated;
      }
    });
  }

  function inDelta(actual, expected, epsilon) {
    return actual < expected + epsilon && actual > expected - epsilon;
  }

  // vertices in world coordinates
  function rayIntersectPolygon(r, u, polygon) {
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
    norm = getFaceNormal(polygon);
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

  function rayIntersectFaces(r, v, subtree, excludeFace) {
    var t = Infinity;
    var p = null;
    var first = null;

    visitChildren(subtree, function(parent, child) {
      if ('mesh' in child) {

        //if(!intersectAABB(r, v, child.extent)) return;

        var mesh = child.mesh;
        for (let f = 0; f < mesh.faces.length; f++) {
          let face = mesh.faces[f];
          if (face == excludeFace) continue;

          let polygon = face.getVerticesPos().map(function (d) {
            let transformed = mat4.create();
            vec3.transformMat4(transformed, d, child.accumulated);
            return transformed;
          });

          //Intersect the ray with this polygon (in world coordinates)
          var soln = rayIntersectPolygon(r, v, polygon);
          if (!(soln === null) && (soln.t < t)) {
            t = soln.t;
            p = soln.p;
            first = face;
          }
        }
      }
    });

    return (p === null) ? null : {t: t, p: p, face: first};
  }

  // returns false if line-of-site exists between a, b
  // optional exclusion face
  function obscured(a, b, exclusion) {
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

  function extractPaths() {
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

  // order (int) : The maximum number of bounces to take
  function computeImageSources(order) {
    var scene = this,
        l = 1;

    order = (isNaN(order)) ? 0 : order;

    scene.source.order = 0;
    scene.source.rcoeff = 1.0;
    scene.source.parent = null;
    scene.source.genFace = null;

    scene.imsources = [scene.source];

    while (l <= order) {

      let n = scene.imsources.length;

      for (var k = 0; k < n; k++) {
        let source = scene.imsources[k];

        if (source.order < l - 1) continue;

        visitChildren(scene, function(parent, child) {
          if('mesh' in child) {
            for (let f = 0; f < child.mesh.faces.length; f++) {
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
                parent: source,
                genFace: face,
                rcoeff: child.rcoeff,
                order: l
              });
            }
          }
        });
      }
      l++;
    }
    return this;
  }

  // rate - sampling rate (samples per second)
  function computeImpulseResponse(rate) {
    var scene = this,
        n = scene.paths.length,
        p = scene.p || 1e-6,
        N,
        index = [],
        response = [],
        time = [];
    
    const s = 340.0; //Sound travels at 340 meters/second

    for (let i = 0; i < n; i++)  {
      let path = scene.paths[i],
          m = path.length,
          magnitude = 1.0,
          total = 0.0,
          a, b = path[m - 1];

      // traverse path from source to receiver
      for (let k = m - 2; k >= 0; k--) {
        let d;

        a = path[k];
        d = vec3.distance(a.pos, b.pos);
        magnitude *= a.rcoeff * 1.0 / Math.pow(1.0 + d, p);
        total += d;
        b = a;
      }
      response.push(magnitude);
      time.push(total/s);
    }

    index = time.map(function(t) {
      return Math.floor(t * rate);
    });

    N = index.length;

    scene.impulseResp = new Float32Array(index[N - 1] + 1);

    for (let i = 0; i < N; i++) {
      scene.impulseResp[index[i]] += response[i];
    }

    return this;
  }

  function extend(scene) {
    // scene actions have this context bound to scene graph object
    scene.computeImageSources = computeImageSources.bind(scene);
    scene.extractPaths = extractPaths.bind(scene);
    scene.obscured = obscured.bind(scene);
    scene.computeImpulseResponse = computeImpulseResponse.bind(scene);
    
    scene.accumulateTransforms = accumulateTransforms;
    scene.computeBoundingBoxes = computeBoundingBoxes;
  }

  var version = "0.0.1";

  exports.version = version;
  exports.extend = extend;

}));