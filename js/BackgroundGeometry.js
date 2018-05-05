"use strict";
const BackgroundGeometry = function(gl) {
  this.gl = gl;

  // vertex buffer
  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 1, -1, 1, 1, 1, -1, 1, 1, 1, 1]),
    gl.STATIC_DRAW
  );

  // vertex color buffer
  this.vertexColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([0.01, 0.26, 0.55, 1.0, 0.6, 0.0, 0.44, 0.85, 0.61]),
    gl.STATIC_DRAW
  );

  // index buffer
  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 0, 2, 3]),
    gl.STATIC_DRAW
  );
};

BackgroundGeometry.prototype.draw = function() {
  const gl = this.gl;
  // set vertex buffer to pipeline input
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(
    0,
    3,
    gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexColorBuffer);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(
    1,
    3,
    gl.FLOAT, //< three pieces of float
    false, //< do not normalize (make unit length)
    0, //< tightly packed
    0 //< data starts at array start
  );

  // set index buffer to pipeline input
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
};
