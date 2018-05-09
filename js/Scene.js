"use strict";
const Scene = function(gl) {
  gl.enable(gl.DEPTH_TEST);

  this.skyCubeTexture = new TextureCube(gl, [
    "textures/cl_posx.jpg",
    "textures/cl_negx.jpg",
    "textures/cl_posy.jpg",
    "textures/cl_negy.jpg",
    "textures/cl_posz.jpg",
    "textures/cl_negz.jpg"
  ]);

  this.bgvs = new Shader(gl, gl.VERTEX_SHADER, "bg_vs.essl");
  this.bgfs = new Shader(gl, gl.FRAGMENT_SHADER, "bg_fs.essl");
  this.bgProgram = new TexturedQuadProgram(gl, this.bgvs, this.bgfs);
  this.backgroundGeometry = new TexturedQuadGeometry(gl);
  this.backgroundMaterial = new Material(gl, this.bgProgram);
  this.backgroundMaterial.envmapTexture.set(this.skyCubeTexture);
  this.backgroundMesh = new Mesh(this.backgroundGeometry, this.backgroundMaterial);
  this.background = new GameObject(this.backgroundMesh);

  this.timeAtLastFrame = new Date().getTime();
  this.frameCount = 0;

  this.camera = new PerspectiveCamera();
  this.camera.position.set(0, 0, 15);

  var cylinder = new ClippedQuadric(Material.quadrics.at(0), Material.quadrics.at(1), Material.brdfs.at(0));
  var sphere = new ClippedQuadric(Material.quadrics.at(2), Material.quadrics.at(3), Material.brdfs.at(1));
  var dune = new ClippedQuadric(Material.quadrics.at(4), Material.quadrics.at(5), Material.brdfs.at(2));
  var lightviz = new ClippedQuadric(Material.quadrics.at(6), Material.quadrics.at(7), Material.brdfs.at(3));
  var ocean = new ClippedQuadric(Material.quadrics.at(8), Material.quadrics.at(9), Material.brdfs.at(4));

  var castle1 = new ClippedQuadric(Material.quadrics.at(10), Material.quadrics.at(11), Material.brdfs.at(5));
  var castle2 = new ClippedQuadric(Material.quadrics.at(12), Material.quadrics.at(13), Material.brdfs.at(6));
  var castle3 = new ClippedQuadric(Material.quadrics.at(14), Material.quadrics.at(15), Material.brdfs.at(7));
  var castle4 = new ClippedQuadric(Material.quadrics.at(16), Material.quadrics.at(17), Material.brdfs.at(8));

  this.beachball = new ClippedQuadric(Material.quadrics.at(18), Material.quadrics.at(19), Material.brdfs.at(9));

  cylinder.setUnitCylinder().transform(new Mat4().set().scale(0.1, 3, 0.1).rotate(0.5, 0, 0, 1));

  sphere
    .setUnitSphere()
    .transformClipper(new Mat4().set().translate(0, 1.3, 0))
    .transform(new Mat4().set().scale(3, 1, 3).translate(0, 1, 0).rotate(0.5, 0, 0, 1));

  dune.surfaceCoeffMatrix.set(
    -0.05, 0, 0, 0,
    0, 0.25, 0, 0,
    0, 0, -0.05, 0,
    0, 0, 0, -1);
  dune.clipperCoeffMatrix.set(
    0, 0, 0, 0,
    0, 0, 0, 1,
    0, 0, 0, 0,
    0, 0, 0, -1);

  ocean.surfaceCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -15
  );
  ocean.clipperCoeffMatrix.set(
    0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, -1
  );

  castle1.setUnitCylinder()
    .transform(new Mat4().set().scale(0.7, 1.2, 0.7).translate(1, -2, 3));
  
  castle2.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0
  );

  castle2.clipperCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  
  castle2
    .transformClipper(new Mat4().set().scale(1, 0.5, 1).translate(0, -0.5, 0))
    .transform(new Mat4().set().scale(0.7, 0.7, 0.7).translate(1, -0.1, 3));
  
  castle3.setUnitCylinder()
    .transform(new Mat4().set().scale(0.7, 1.2, 0.7).translate(-1, -2, 3));

  castle4.surfaceCoeffMatrix.set(
    1, 0, 0, 0,
    0, -1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, 0
  );

  castle4.clipperCoeffMatrix.set(
    0, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -1);
  
  castle4
    .transformClipper(new Mat4().set().scale(1, 0.5, 1).translate(0, -0.5, 0))
    .transform(new Mat4().set().scale(0.7, 0.7, 0.7).translate(-1, -0.1, 3));
  
  this.beachball.setUnitSphere().transform(new Mat4().set().translate(4, 5*Math.sin(2*Math.PI * this.frameCount)-2.1, 4));

  lightviz.setUnitSphere().transform(new Mat4().set().scale(0.1, 0.1, 0.1).translate(-0.2, 3, -10));

  dune.brdf.set(0.8, 0.8, 0.3, 0);
  sphere.brdf.set(0.5, 0.5, 0.5, 250);
  cylinder.brdf.set(0.5, 0.5, 0.5, 0);
  lightviz.brdf.set(1, 1, 1, 0);
  ocean.brdf.set(0.3, 0.3, 1, 0);
  
  castle1.brdf.set(0.8, 0.8, 0.3, 0);
  castle2.brdf.set(0.8, 0.8, 0.3, 0);
  castle3.brdf.set(0.8, 0.8, 0.3, 0);
  castle4.brdf.set(0.8, 0.8, 0.3, 0);

  this.beachball.brdf.set(0.99, 0.99, 0.99, 0);

  Material.lightPositions.at(0).set(-3, 5, 10, 1);
  Material.lightPositions.at(1).set(5, 2, 5, 1);
  Material.lightPositions.at(2).set(8, 3, -10, 1);

  Material.lightPowerDensities.at(0).set(0.4, 0.6, 0.4, 1);
  Material.lightPowerDensities.at(1).set(0.6, 0.4, 0.4, 1);
  Material.lightPowerDensities.at(2).set(0.4, 0.4, 0.6, 1);
  Material.lightPowerDensities.at(7).set(0.3, 0.3, 0.3, 1); // camera light
};

Scene.prototype.update = function(gl, keysPressed) {
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.frameCount++;

  document.getElementById("overlay").innerHTML =
    "" +
    this.camera.position.x.toFixed(2) +
    ", " +
    this.camera.position.y.toFixed(2) +
    ", " +
    this.camera.position.z.toFixed(2);

  // Clear screen
  gl.clearColor(190 / 255, 227 / 255, 180 / 255, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  Material.eyePos.set(this.camera.position);
  Material.rayDirMatrix.set(this.camera.rayDirMatrix);

  let bbycoord = Math.abs(5*Math.sin((2*Math.PI * this.frameCount)/90))-2.1;
  console.log(bbycoord)

  this.beachball.setUnitSphere().transform(new Mat4().set().translate(4, bbycoord, 4));

  this.camera.move(dt, keysPressed);
  Material.lightPositions.at(7).set(this.camera.position);
  this.background.draw(this.camera);
};