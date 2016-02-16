# Image Sources (Math 290)

This assignment was completed as part of Chris Tralie's *excellent* 3D geometry class (CS/Math 290) taught at Duke University in Spring 2016.

The assignment is concerned with introducing undergraduates to acoustic simulations. 3D transformations are used to simulate "echos" in simple scenographs using webGL. The assignment builds on top of Tralie's 3D geometry framework designed for teaching by adding several algorithms for computing image sources and for a sound source and generating the paths from the source to the receiver.

The full assignment webpage can be found [here](http://www.ctralie.com/Teaching/COMPSCI290/Assignments/Group1_ImageSources/spec.html).

# Quickstart

This assignment is primarily concerned with adding functionality to the sceneograph, including the ability to:

- generage image sources through reflecitons of a specified order
- gernate paths from source to receiver
- do some fancy audio processing
- and much more!

All this extra functionality is exposed as an extension that adds functions to the `scene`. The files in the *src* folder are compiled (concatenated appropriately) to form a single global `image_sources` with one method called `extend(scene)` which takes in the sceneograph object and adds new methods to it. Given a scene, one adds the funtionality by calling:

```js
image_sources.extend(scene);
```

To build *image_sources.js* (the extension this assignment tasks students with creating), we follow the next few steps.

In the root directory, install all required dependencies as specified in *package.json* by running:

```bash
npm install
```

To run all tests and build the *image_sources.js* from source*:

```
npm run submit
```

This runs a script that looks at *index.js* and follows all the import and export statements found in the src folder to build a script with one exported global variable: `image_sources.js*.

*This assignment requires not only a substantial amount of boilerplate code, but also at least one substantial library created by Chris Tralie that has not been converted to any module format. Thus, we run into the problem of multiple module formats and the need to use global variables to get by. Using Rollup to build the image-sources functionality into a single global variable is but one step towards simplifying this assignment.*
