import accumulateTransforms from "./scene/accumulateTransforms"; 
import extractPaths from "./geom/extractPaths";
import computeImageSources from "./geom/computeImageSources";
import computeImpulseResponse from "./acoustic/computeImpulseResponse";
import rayIntersectFaces from "./geom/rayIntersectFaces";

export default function(scene) {
  // this context is bound to the scene actions which operate on the sceneograph
  scene.computeImageSources = computeImageSources.bind(scene);
  scene.extractPaths = extractPaths.bind(scene);
  scene.rayIntersectFaces = rayIntersectFaces.bind(scene);
  scene.computeImpulseResponse = computeImpulseResponse;
  scene.accumulateTransforms = accumulateTransforms;
}