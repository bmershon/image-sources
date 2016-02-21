import accumulateTransforms from "./scene/accumulateTransforms"; 
import extractPaths from "./geom/extractPaths";
import computeImageSources from "./geom/computeImageSources";
import computeImpulseResponse from "./acoustic/computeImpulseResponse";
import obscured from "./geom/obscured";

export default function(scene) {
  // scene actions have this context bound to scene graph object
  scene.computeImageSources = computeImageSources.bind(scene);
  scene.extractPaths = extractPaths.bind(scene);
  scene.obscured = obscured.bind(scene);

  scene.computeImpulseResponse = computeImpulseResponse;
  scene.accumulateTransforms = accumulateTransforms;
}