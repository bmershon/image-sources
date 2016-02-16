/**
 *
 * Original implementation for image-sources assignment by Chris Tralie
 *
 */

import rayIntersectPolygon from "./rayIntersectPolygon";

export default function rayIntersectFaces(P0, V, node, mvMatrix, excludeFace) {
  var scene = this;
  var tmin = Infinity;//The parameter along the ray of the nearest intersection
  var PMin = null;//The point of intersection corresponding to the nearest interesection
  var faceMin = null;//The face object corresponding to the nearest intersection
  if (node === null) {
    return null;
  }
  if ('mesh' in node) { //Make sure it's not just a dummy transformation node
    var mesh = node.mesh;
    for (var f = 0; f < mesh.faces.length; f++) {
      if (mesh.faces[f] == excludeFace) {
        continue;//Don't re-intersect with the face this point lies on
      }
      //Intersect the ray with this polygon
      var res = rayIntersectPolygon(P0, V, mesh.faces[f].getVerticesPos(), mvMatrix);
      if (!(res === null) && (res.t < tmin)) {
        tmin = res.t;
        PMin = res.P;
        faceMin = mesh.faces[f];
      }
    }
  }
  
  if ('children' in node) {
    //Recursively check the meshes of the children to make sure the ray
    //doesn't intersect any of them first
    for (var i = 0; i < node.children.length; i++) {
      var nextmvMatrix = mat4.create();
      //Multiply on the right by the next transformation of the child
      //node
      mat4.mul(nextmvMatrix, mvMatrix, node.children[i].transform);
      //Recursively intersect with the child node
      var cres = scene.rayIntersectFaces(P0, V, node.children[i], nextmvMatrix, excludeFace);
      if (!(cres === null) && (cres.tmin < tmin)) {
        tmin = cres.tmin;
        PMin = cres.PMin;
        faceMin = cres.faceMin;
      }
    }
  }
  if (PMin === null) {
    return null;
  }
  return {tmin:tmin, PMin:PMin, faceMin:faceMin};
}