import extent from "../aabb/extent";
import union from "../aabb/union";
import {default as makeNode} from "../aabb/makeNode";

// adding accumulated transforms to all children in scenograph

export default function computeBoundingBoxes() {
  var scene = this;
  if ('extent' in scene) return; // compute once
  bbox(scene);
}

function bbox(node) {
  let vertices,
      extents,
      totalExtent = [
            [Infinity, -Infinity],
            [Infinity, -Infinity],
            [Infinity, -Infinity]
      ];
  
  if ('mesh' in node) {
    vertices = node.mesh.vertices.map(function (d) {
      let transformed = vec3.create();
      vec3.transformMat4(transformed, d.pos, node.accumulated);
      return transformed;
    });
    totalExtent = extent(vertices);
  }

  if (node.children) {
    extents = node.children.map(function(d) { return bbox(d); });
    extents.push(totalExtent);
    totalExtent = union(extents);
  }

  node.extent = totalExtent; // array of extents
  node.aabb = makeNode(totalExtent); // (boudning box): node.mesh and node.accumulated
  return totalExtent;
}