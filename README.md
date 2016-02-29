# Image Sources (Math 290)

This assignment was completed as part of Chris Tralie's *excellent* 3D geometry class (CS/Math 290) taught at Duke University during Spring 2016.

The assignment is concerned with introducing undergraduates to acoustic simulations. 3D transformations are used to simulate "echos" in simple scene graphs using webGL. The assignment builds on top of Tralie's *in progress* 3D geometry framework, which is primarily designed for teaching students about geometry operations on meshes. The API for that framework will be changed substantially in the future. As such, this assignment makes use of an early protoype of Chris Tralie's mesh library.

The full assignment webpage can be found [here](http://www.ctralie.com/Teaching/COMPSCI290/Assignments/Group1_ImageSources/spec.html).

# Quickstart

View the full running demo [here](http(s)://bmershon.github.io/image-sources).

The student's task is primarily concerned with adding functionality to the scenegraph, including the ability to:

- Generage image sources through reflections of a specified order
- Gernate paths from source to receiver
- Generate an impulse response based on the order-n reflection paths that have been generated
- Process a given audio file and perform convolution with the constructed impulse response

All this extra functionality is exposed as an extension that adds functions to `scene` object. The scene object holds all material objects in the scene, the cameras, the source, the receiver, and the reflected image sources and traced paths, and has functions which mutate its state. The files in the *src* folder are compiled (concatenated appropriately) to form a single global `image_sources` object with one method called `extend(scene)` that takes in the scene graph object and adds new methods to it. Given a scene, one adds the funtionality by calling:

```js
image_sources.extend(scene);
```

To build *main/image_sources.js* (the functionality this assignment tasks students with creating), we follow the next few steps.

In the root directory, install all required dependencies as specified in *package.json* by running:

```bash
npm install
```

To run all tests and build the *main/image_sources.js* file from source*:

```
npm run submit
```

This command runs a script that looks at *index.js* and follows all the `import` and `export` statements found in the *src* directory to build a script with one exported global variable: `image_sources`. Checkout *package.json* to see the scripts that have been defined.

*Using [Rollup](https://github.com/rollup/rollup) to build the image-sources functionality into a single global variable is an attempt to make the student's work in this assignment modular. One significant advantage of doing so is that dependencies and coupling within the student's implementation are made more explicit and easier to follow.*

# Assignment Tasks

## Generating Image Sources

![Order-1 reflections from a sphere](images/sphere-images-order-1.png)

## Path Extraction

![Extract Paths](images/boxes-reflections-order-4.png)


## Impulse Response

A campus quad scene with a small box to represent a human for scale (height 1.764 meters). Third order reflections are drawn for a scene with hierarchical rotations (all children rotated by 45 degrees under a "dummy node").

![Scene](images/campus-quad-order-3.png)

*The .scn file*

```
{
  "name":"Campus Quad",
  "receiver":[0, 1.764, 0],
  "source":[-30, 1.764, 20],
  "p": 0.4,
  "children":[
    {
      "name": "campus",
      "transform":[0.70710678118, 0, 0.70710678118, 0,
                   0, 1, 0, 0,
                   -0.70710678118, 0, 0.70710678118, 0,
                   0, 0, 0, 1],
      "children": [
        {
          "mesh":"meshes/square.off",
          "color":[0.8, 0.8, 0.8],
          "rcoeff":0.5,
          "transform":[120, 0, 0, 0,
                       0, 75, 0, 0,
                       0, 0, 75, 0,
                       0, 0, 0, 1]     
        },

        .
        .
        .


        {
          "mesh":"meshes/box.off",
          "name": "human",
          "color":[0, 0.5, 0.5],
          "rcoeff":0.5,
          "transform":[0.5, 0, 0, 0,
                       0, 1.764, 0, 0.882,
                       0, 0, 0.2, -10,
                       0, 0, 0, 1]     
        }
      ]
    }
  ]
}
```

A portion of the graph of the inpulse reponse. We note the direct line-of-sight reponse occurs around at 106 milliseconds and the next impulse occurs at around 132 milliseconds.

![Impulse Response](images/campus-quad-impulse-response.png)


## Bounding Boxes

TODO

# Notes

- The impulse responses are currently placed in a single nearest bin without any type of interpolation.
- Added "p" field to *.scn* files; the value is used in simulating radial energy spreading. Lower values result in less attenuation.
- "Playing" the impulse response by clicking the button in the GUI results in an error.