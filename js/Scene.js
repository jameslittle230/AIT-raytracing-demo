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
        this.backgroundMesh = new Mesh(this.backgroundGeometry, this.backgroundMaterial);
        this.background = new GameObject(this.backgroundMesh);

        this.timeAtLastFrame = new Date().getTime();
        this.frameCount = 0;

        this.camera = new PerspectiveCamera();
        this.camera.position.set(0, 0, 10);

        var cylinder = new ClippedQuadric(Material.quadrics.at(0), Material.quadrics.at(1), Material.brdfs.at(0));
        var sphere = new ClippedQuadric(Material.quadrics.at(2), Material.quadrics.at(3), Material.brdfs.at(1));
        var dune = new ClippedQuadric(Material.quadrics.at(4), Material.quadrics.at(5), Material.brdfs.at(2));
        var lightviz = new ClippedQuadric(Material.quadrics.at(6), Material.quadrics.at(7), Material.brdfs.at(3));

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
        // dune.transform(new Mat4().set().translate(0, -5, 0));

        sphere
          .setUnitSphere()
          .transformClipper(new Mat4().set().translate(0, 1.3, 0))
          .transform(new Mat4().set().scale(3, 1, 3).translate(0, 1, 0));

        cylinder.setUnitCylinder().transform(new Mat4().set().scale(0.1, 2, 0.1));


        dune.brdf.set(0.9, 0.9, 0.2, 0);
        sphere.brdf.set(1, 0.5, 0.5, 0);
        cylinder.brdf.set(0.3, 0.3, 0.3, 0);
        lightviz.brdf.set(1, 1, 1, 0);

        Material.lightPositions.at(0).set(-1, 0.5, 3, 0);
        lightviz.setUnitSphere().transform(new Mat4().set().translate(-1, 0.5, 3));
        Material.lightPositions.at(1).set( 1, 0.5, 3, 0);
        Material.lightPositions.at(2).set(-0.2, 0.5, -10, 0);

        Material.lightPowerDensities.at(0).set(1, 1, 1, 1);
        // Material.lightPowerDensities.at(1).set(1, 1, 1, 1);
        // Material.lightPowerDensities.at(2).set(1, 1, 1, 1);
      };;

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
