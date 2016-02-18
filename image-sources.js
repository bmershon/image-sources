(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('image-sources', ['exports'], factory) :
  factory((global.image_sources = {}));
}(this, function (exports) { 'use strict';

  // recursively traverse all children in scenograph,
  // passing current child and its parent to callback
  function visitChildren(node, callback) {
    if (node === null || !node.children) return;

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

  //Purpose: Based on the extracted image sources, trace back paths from the
    //receiver to the source, checking to make sure there are no occlusions
    //along the way.  Remember, you're always starting by tracing a path from
    //the receiver to the image, and then from the intersection point with
    //that image's corresponding face to the image's parent, and so on
    //all the way until you get back to the original source.
    
    //Fill in the array scene.paths, where each element of the array is itself
    //an array of objects describing vertices along the path, starting
    //with the receiver and ending with the source.  Each object in each path
    //array should contain a field "pos" which describes the position, as well
    //as an element "rcoeff" which stores the reflection coefficient at that
    //part of the path, which will be used to compute decays in "computeInpulseResponse()"
    //Don't forget the direct path from source to receiver!
  function extractPaths() {
    var scene = this;
    scene.paths = [];
    
    //TODO: Finish this. Extract the rest of the paths by backtracing from
    //the image sources you calculated.  Return an array of arrays in
    //scene.paths.  Recursion is highly recommended
    //Each path should start at the receiver and end at the source
    //(or vice versa), so scene.receiver should be the first element 
    //and scene.source should be the last element of every array in 
    //scene.paths
  }

  // order (int) : The maximum number of bounces to take
  function computeImageSources(order) {
    
    var scene = this,
        l = 0;

    order = (isNaN(order)) ? 0 : order;

    scene.source.order = 0;
    scene.source.rcoeff = 1.0;
    scene.source.parent = null;
    scene.source.genFace = null;

    scene.imsources = [scene.source];

    while (l < order) {

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

  //Inputs: Fs: Sampling rate (samples per second)
  function computeImpulseResponse(Fs) {
    var SVel = 340;//Sound travels at 340 meters/second
    //TODO: Finish this.  Be sure to scale each bounce by 1/(1+r^p), 
    //where r is the length of the line segment of that bounce in meters
    //and p is some integer less than 1 (make it smaller if you want the 
    //paths to attenuate less and to be more echo-y as they propagate)
    //Also be sure to scale by the reflection coefficient of each material
    //bounce (you should have stored this in extractPaths() if you followed
    //those directions).  Use some form of interpolation to spread an impulse
    //which doesn't fall directly in a bin to nearby bins
    //Save the result into the array scene.impulseResp[]
  }

  function rayIntersectPolygon(P0, V, vertices) {
    var t,
        normal,
        area,
        sum = 0,
        w = vec3.create(),
        offset = vec3.create(),
        intersection = vec3.create(),
        vn = vec3.create();

    normal = getFaceNormal(vertices);
    vec3.sub(offset, P0, vertices[0]);
    
    t = -vec.dot(offset, normal)/vec3.dot(V, normal); 
    vec3.scale(offset, V, t);
    vec3.add(intersection, P0, offset);

    area = getPolygonArea(vertices);

    // calculate area of n-choose-2 triangles
    for (let i = 0; i < vertices.length - 1; i++) {
      sum += getPolygonArea([vertices[i], vertices[i+1], intersection]);
    }

    return (visitChildren(sum, area, 1e-4)) ? {t: t, P: intersection} : null;  
  }

  function rayIntersectFaces(P0, V, node, excludeFace) {
    var scene = this;
    var tmin = Infinity;//The parameter along the ray of the nearest intersection
    var PMin = null;//The point of intersection corresponding to the nearest interesection
    var faceMin = null;//The face object corresponding to the nearest intersection

    visitChildren(scene, function(parent, child) {
      if ('mesh' in child.mesh) {
        var mesh = child.mesh;
        for (let f = 0; f < mesh.faces.length; f++) {
          let face = mesh.faces[i];
          if (face == excludeFace) continue;

          let worldVertices = face.getVerticesPos().map(function (d) {
            let transformed = mat4.create();
            vec3.transformMat4(transformed, d, child.accumulated);
            return transformed;
          });

          //Intersect the ray with this polygon
          var res = rayIntersectPolygon(P0, V, worldVertices);
          if (!(res === null) && (res.t < tmin)) {
            tmin = res.t;
            PMin = res.P;
            faceMin = mesh.faces[f];
          }
        }
      }
    });

    return (PMin === null) ? null : {tmin:tmin, PMin:PMin, faceMin:faceMin};
  }

  function extend(scene) {
    // this context is bound to the scene actions which operate on the sceneograph
    scene.computeImageSources = computeImageSources.bind(scene);
    scene.extractPaths = extractPaths.bind(scene);
    scene.rayIntersectFaces = rayIntersectFaces.bind(scene);
    scene.computeImpulseResponse = computeImpulseResponse;
    scene.accumulateTransforms = accumulateTransforms;
  }

  var version = "0.0.1";

  exports.version = version;
  exports.extend = extend;

}));