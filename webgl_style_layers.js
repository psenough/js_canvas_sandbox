var D = document;

rand = function(n){
	return 0|(Math.random()*n);
};

D.title = 'webgl lines';

PI = Math.PI;
si = Math.sin;
M = Math.max;
N = Math.min;
Q = Math.sqrt;

var b = D.body;
var Ms = b.style;
Ms.margin='0px';
var blackcolor = Ms.background = "#000";
Ms.overflow = 'hidden';
b.innerHTML = '';
var c = D.createElement('canvas');
b.appendChild(c);
c.style.background = "transparent";

var gl = null;
gl = c.getContext('webgl', { alpha: false }) || c.getContext('experimental-webgl', { alpha: false });

gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LEQUAL);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
gl.enable(gl.BLEND);


var w = c.width = window.innerWidth;
var h = c.height = window.innerHeight;

gl.viewport(0, 0, w, h);

//
// request animation frame, from random place on the internet
//

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = M(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

var textures = [];
var tcount = 0;

function checkLoad(){
	tcount++;
	//console.log('tcount: ' + tcount + ' ' + textures.length);
	if (tcount == textures.length) drawCanvas();
}
b.onload = function() {
	textures[0] = loadImageAndCreateTextureInfo('gfx/winter1_ddg/722d6250471349ae715d3a1b9b09acbdfb4707fd.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[1] = loadImageAndCreateTextureInfo('gfx/winter1_ddg/ca2dd7d1f0d751e260816314fd642f89049a3d8c.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[2] = loadImageAndCreateTextureInfo('gfx/winter1_ddg/cd51b8ee5dede2bb9db8bc70de106f1b3778dd76.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[3] = loadImageAndCreateTextureInfo('gfx/winter1_ddg/0624988c359a6491f9da2dc8ce4918d3d08c96d0.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[4] = loadImageAndCreateTextureInfo('gfx/winter1_ddg/ad2e0d39958900267206e21ef157334e74e428c7.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[5] = loadImageAndCreateTextureInfo('gfx/winter1_ddg/9cd1a90378d9a2647d50b974b5be67102e800851.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[6] = loadImageAndCreateTextureInfo('gfx/winter1_ddg/8e63955d075985dcfc43faa626ad5703146dee49.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[7] = loadImageAndCreateTextureInfo('gfx/winter1_ddg/5b64264b09c6209ba44504732940866511805eaf.jpg', function(ti){ console.log(ti); checkLoad(); });
	//drawCanvas();
}

var elem = D.createElement("div");
var S = elem.style;
S.background = "#fff";
S.position = "absolute";
S.height = "100px";
S.lineHeight = elem.style.height;
S.letterSpacing = "-3px";
S.textAlign = "center";
S.fontSize = "60px";
S.border = "solid #49b249";//"solid #fe9358";
S.borderWidth = "5px 0";
S.fontFamily = "Helvetica";
b.appendChild(elem);

let loop = undefined;

function drawCanvas() {
	
	let d = new Date();
	let n = d.getTime();
	
	let prevtime = n;

	shaderProgramQuad = initShaderProgramQuad();
	
	function drawBackground() {		
		//gl.bindFramebuffer( gl.FRAMEBUFFER, myBuffer.buffer );
		//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		
		gl.bindFramebuffer( gl.FRAMEBUFFER, null );
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	}

	function drawThis() {
		let d2 = new Date();
		let n2 = d2.getTime();
		let timer = n2-n;
		let delta = (n2-prevtime)/30;
		prevtime = n2;
		
		drawBackground();
		drawQuadOnScreen(timer);
	}
	
	(loop = function() {
		if (loop != undefined) {
			requestAnimationFrame(loop);
			drawThis();
		}
	})();

}

// was going to be used for secret part, abandoned
document.onkeydown = checkKeycode;

function checkKeycode(e) {
	var keycode;
	if (window.event) keycode = window.event.keyCode;
		else if (e) keycode = e.which;
	//console.log(keycode);
	if (keycode == 83) {
		for (var j=0; j<16; j++) {
			spliceline(j);
		}
	}
}

var shaderProgramQuad;

var quadVerts = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1];
var myBuffer;
var floodfillBuffer;

var positionLocation;
var texcoordLocation;
var matrixLocation;
var positionBuffer;
var texcoordBuffer;
var textureLocation; // used seperately
var textureLocation1;
var textureLocation2;
var textureLocation3;
var textureLocation4;
var textureLocation5;
var textureLocation6;
var textureLocation7;
var textureLocation8;
var resolutionLocation;
var resolutionLocation2;
var timerLocation;

function initShaderProgramQuad() {

	var vertCode =
		'attribute vec2 a_position;' +
		'attribute vec2 a_texCoord;' +
		'uniform vec2 u_resolution;' +
		'varying vec2 v_resolution;' +
		'varying vec2 v_texCoord;' +
		'void main() {' +
		'vec2 zeroToOne = a_position;' + // / u_resolution;' +
		'vec2 zeroToTwo = zeroToOne * 2.0;' +
		'vec2 clipSpace = zeroToTwo - 1.0;' +
		'gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);' +
		//'gl_Position = vec4(a_position[0], a_position[1], 0, 1);' +
		'v_resolution = u_resolution;' +
		'v_texCoord = a_texCoord;' +
		'}';

	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, vertCode);
	gl.compileShader(vertShader);
	if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		console.log('ERROR compiling vert shader!', gl.getShaderInfoLog(vertShader));
		return;
	}

	var fragCode =
		'precision mediump float;' +
		'uniform sampler2D u_texture1;' +
		'uniform sampler2D u_texture2;' +
		'uniform sampler2D u_texture3;' +
		'uniform sampler2D u_texture4;' +
		'uniform sampler2D u_texture5;' +
		'uniform sampler2D u_texture6;' +
		'uniform sampler2D u_texture7;' +
		'uniform sampler2D u_texture8;' +
		'varying vec2 v_resolution;' +
		'varying vec2 v_texCoord;' +
		'uniform float u_timer;' +
		'float rand(vec2 co){' +
		'return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);' +
		'}' +
		'void main() {' +
		'float iTime = u_timer*0.001;'+
		'vec2 uv = vec2(v_texCoord.xy-0.5)*2.0;'+
		// anim
		'vec2 c1 = vec2(0.8*sin( iTime*1.0 + vec2(4.0,0.5) + 1.0));'+
		'vec2 c2 = vec2(0.8*sin( iTime*1.3 + vec2(1.0,2.0) + 2.0));'+
		'vec2 c3 = vec2(0.8*sin( iTime*1.5 + vec2(0.0,2.0) + 4.0));'+
	
		// potential (3 metaballs)
		'float v = 0.0;	'+
		'v += 1.0-smoothstep(0.0,0.6,length(uv-c1));'+
		'v += 1.0-smoothstep(0.0,0.6,length(uv-c2));'+
		'v += 1.0-smoothstep(0.0,0.6,length(uv-c3));'+
	
		// color	
		'vec4 color0 = vec4(v);'+
		
		//'vec4 color0 = vec4(v_texCoord.x);' + 
		//'vec4 color0 = mix(texture2D(u_texture1, v_texCoord), texture2D(u_texture2, v_texCoord),0.5);' +
		//'color0 += texture2D(u_texture2, v_texCoord);' +
		'if (color0.x < 0.1) { color0 = texture2D(u_texture1, v_texCoord); }' +
		'else if (color0.x < 0.2) { color0 = texture2D(u_texture2, v_texCoord); }' +
		'else if (color0.x < 0.3) { color0 = texture2D(u_texture3, v_texCoord); }' +
		'else if (color0.x < 0.4) { color0 = texture2D(u_texture4, v_texCoord); }' +
		'else if (color0.x < 0.5) { color0 = texture2D(u_texture5, v_texCoord); }' +
		'else if (color0.x < 0.6) { color0 = texture2D(u_texture6, v_texCoord); }' +
		'else if (color0.x < 0.7) { color0 = texture2D(u_texture7, v_texCoord); }' +
		'else { color0 += texture2D(u_texture8, v_texCoord); }' +
		'gl_FragColor = color0;' +
		'}';

	var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragShader, fragCode);
	gl.compileShader(fragShader);
	if (!gl.getShaderParameter(fragShader, gl.COMPILE_STATUS)) {
		console.log('ERROR compiling frag shader!', gl.getShaderInfoLog(fragShader));
		return;
	}

	var shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertShader);
	gl.attachShader(shaderProgram, fragShader);
	gl.linkProgram(shaderProgram);

	// look up where the vertex data needs to go.
	positionLocation = gl.getAttribLocation(shaderProgram, "a_position");
	texcoordLocation = gl.getAttribLocation(shaderProgram, "a_texCoord");

	// Create a buffer.
	positionBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

	// Put a unit quad in the buffer
	var positions = [
	0, 0,
	0, 1,
	1, 0,
	1, 0,
	0, 1,
	1, 1]
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

	// Create a buffer for texture coords
	texcoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);

	// Put texcoords in the buffer
	var texcoords = [
	0, 0,
	0, 1,
	1, 0,
	1, 0,
	0, 1,
	1, 1]
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texcoords), gl.STATIC_DRAW);

	resolutionLocation = gl.getUniformLocation(shaderProgram, "u_resolution");	
	resolutionLocation2 = gl.getUniformLocation(shaderProgram, "v_resolution");
	
	textureLocation1 = gl.getUniformLocation(shaderProgram, "u_texture1");
	textureLocation2 = gl.getUniformLocation(shaderProgram, "u_texture2");
	textureLocation3 = gl.getUniformLocation(shaderProgram, "u_texture3");
	textureLocation4 = gl.getUniformLocation(shaderProgram, "u_texture4");
	textureLocation5 = gl.getUniformLocation(shaderProgram, "u_texture5");
	textureLocation6 = gl.getUniformLocation(shaderProgram, "u_texture6");
	textureLocation7 = gl.getUniformLocation(shaderProgram, "u_texture7");
	textureLocation8 = gl.getUniformLocation(shaderProgram, "u_texture8");

	timerLocation = gl.getUniformLocation(shaderProgram, "u_timer");
	
	return shaderProgram;	 
}

function drawQuadOnScreen(timer) {
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, textures[0].texture);
	gl.activeTexture(gl.TEXTURE1);
	gl.bindTexture(gl.TEXTURE_2D, textures[1].texture);
	gl.activeTexture(gl.TEXTURE2);
	gl.bindTexture(gl.TEXTURE_2D, textures[2].texture);
	gl.activeTexture(gl.TEXTURE3);
	gl.bindTexture(gl.TEXTURE_2D, textures[3].texture);
	gl.activeTexture(gl.TEXTURE4);
	gl.bindTexture(gl.TEXTURE_2D, textures[4].texture);
	gl.activeTexture(gl.TEXTURE5);
	gl.bindTexture(gl.TEXTURE_2D, textures[5].texture);
	gl.activeTexture(gl.TEXTURE6);
	gl.bindTexture(gl.TEXTURE_2D, textures[6].texture);
	gl.activeTexture(gl.TEXTURE7);
	gl.bindTexture(gl.TEXTURE_2D, textures[7].texture);
	
	gl.useProgram(shaderProgramQuad);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.enableVertexAttribArray(texcoordLocation);
    gl.vertexAttribPointer(texcoordLocation, 2, gl.FLOAT, false, 0, 0);

	gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);	
	gl.uniform2f(resolutionLocation2, gl.canvas.width, gl.canvas.height);	
	gl.uniform1i(textureLocation1, 0);
	gl.uniform1i(textureLocation2, 1);
	gl.uniform1i(textureLocation3, 2);
	gl.uniform1i(textureLocation4, 3);
	gl.uniform1i(textureLocation5, 4);
	gl.uniform1i(textureLocation6, 5);
	gl.uniform1i(textureLocation7, 6);
	gl.uniform1i(textureLocation8, 7);
	
	gl.uniform1f(timerLocation, timer);
	
	gl.drawArrays(gl.TRIANGLES, 0, 6);
	
	gl.bindBuffer(gl.ARRAY_BUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, null);
}

// creates a texture info { width: w, height: h, texture: tex }
// The texture will start with 1x1 pixels and be updated
// when the image has loaded
function loadImageAndCreateTextureInfo(url, cb) {
  var tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
 
  // let's assume all images are not a power of 2
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
 
  var textureInfo = {
    width: 1,   // we don't know the size until it loads
    height: 1,
    texture: tex,
  };
  var img = new Image();
  //console.log('loading');
  img.addEventListener('load', function() {
	//console.log('load=?!');
    textureInfo.width = img.width;
    textureInfo.height = img.height;
 
    gl.bindTexture(gl.TEXTURE_2D, textureInfo.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
	
	cb(textureInfo);
  });
  img.src = url;
 
  return textureInfo;
}
