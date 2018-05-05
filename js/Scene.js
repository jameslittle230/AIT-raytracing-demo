"use strict";
const Scene = function(gl) {
  gl.enable(gl.DEPTH_TEST);

  this.skyCubeTexture = new TextureCube(gl, [
    "textures/posx.jpg",
    "textures/negx.jpg",
    "textures/posy.jpg",
    "textures/negy.jpg",
    "textures/posz.jpg",
    "textures/negz.jpg"
  ]);

  this.bgvs = new Shader(gl, gl.VERTEX_SHADER, "bg_vs.essl");
  this.bgfs = new Shader(gl, gl.FRAGMENT_SHADER, "bg_fs.essl");
  this.bgProgram = new TexturedQuadProgram(gl, this.bgvs, this.bgfs);
  this.backgroundGeometry = new TexturedQuadGeometry(gl);
  this.backgroundMaterial = new Material(gl, this.bgProgram);
  this.backgroundMaterial.envmapTexture.set(this.skyCubeTexture);
  this.backgroundMesh = new Mesh(
    this.backgroundGeometry,
    this.backgroundMaterial
  );
  this.background = new GameObject(this.backgroundMesh);

  this.timeAtLastFrame = new Date().getTime();
  this.frameCount = 0;

  this.camera = new PerspectiveCamera();
  this.camera.position.set(0, 0, 10);

  var cylinder = new ClippedQuadric(
    Material.quadrics.at(0),
    Material.quadrics.at(1)
  );

  var sphere = new ClippedQuadric(
    Material.quadrics.at(2),
    Material.quadrics.at(3)
  );

  sphere
    .setUnitSphere()
    .transformClipper(new Mat4().set().translate(0, 0.8, 0))
    // .transform(new Mat4().set().translate(5, 0, 0));

    console.log(sphere);

  cylinder
    .setUnitCylinder()
    .transformClipper(
      new Mat4(1, 0.5, 0, 0, 0.3, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)
    );
  //material
  Material.brdfs.at(0).set(0.9, 0.9, 0.2, 0);
  Material.brdfs.at(1).set(0.7, 0.7, 0.7, 0);

  Material.lightPositions.at(0).set(1, 1, 1, 0);
  Material.lightPowerDensities.at(0).set(1, 0.8, 1, 1);
  Material.lightPositions.at(1).set(0, -1, -1, 0);
  Material.lightPowerDensities.at(1).set(0.8, 0.8, 1, 1);
  Material.lightPositions.at(2).set(0, -1, -1, 0);
  Material.lightPowerDensities.at(2).set(1, 1, 0.8, 1);
};

Scene.prototype.update = function(gl, keysPressed) {
  const timeAtThisFrame = new Date().getTime();
  const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
  this.timeAtLastFrame = timeAtThisFrame;
  this.frameCount++;

  document.getElementById("overlay").innerHTML =
    "" +
    this.camera.position.x +
    ", " +
    this.camera.position.y +
    ", " +
    this.camera.position.z;

  // Clear screen
  gl.clearColor(190 / 255, 227 / 255, 180 / 255, 1.0);
  gl.clearDepth(1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  Material.eyePos.set(this.camera.position);
  Material.rayDirMatrix.set(this.camera.rayDirMatrix);

  this.camera.move(dt, keysPressed);
  this.background.draw(this.camera);
};
