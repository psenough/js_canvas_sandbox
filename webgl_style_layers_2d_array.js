var D = document;

var sync_stuff = false;

rand = function(n){
	return 0|(Math.random()*n);
};

D.title = 'test';

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
var c = document.getElementById('c');

var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
//var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
//var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
//var is_opera = navigator.userAgent.indexOf("Presto") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}


var gl = null;
gl = c.getContext('webgl2', { alpha: false, antialias: false } ) || c.getContext('experimental-webgl', { alpha: false, antialias: false });

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


var backgroundAudio;
var analyser;
var bufferLength;
var dataArray;
				
function initAudio( cb ) {
	var context;
	try {
		// Fix up for prefixing
		window.AudioContext = window.AudioContext||window.webkitAudioContext;
		if (backgroundAudio != undefined) backgroundAudio.stop();
		context = new AudioContext();

		var request = new XMLHttpRequest();
		//if (is_safari) request.open('GET', 'esem_gre_ii.m4a', true);
		//	else request.open('GET', 'esem_gre_ii.ogg', true);		
		if (is_safari) request.open('GET', 'audio/psenough_191122.m4a', true);
			else request.open('GET', 'audio/psenough_191122.ogg', true);
		request.responseType = 'arraybuffer';
		console.log('requesting');

		// Decode asynchronously
		request.onload = function() {
			context.decodeAudioData(request.response, function(buffer) {
	  
				backgroundAudio = context.createBufferSource(); 	// creates a sound source
				backgroundAudio.buffer = buffer;                    // tell the source which sound to play
				backgroundAudio.connect(context.destination);       // connect the source to the context's destination (the speakers)
				backgroundAudio.loop = false;
				//backgroundAudio.start(0);
				
				analyser = context.createAnalyser();
				analyser.fftSize = 512;
				bufferLength = analyser.frequencyBinCount;
				dataArray = new Uint8Array(bufferLength);
				analyser.getByteTimeDomainData(dataArray);
				backgroundAudio.connect(analyser);
				/*analyser.connect(context.destination);*/
				
				// start canvas
				//drawCanvas();
	  
				console.log('decoded');

				cb();
	  
			}, function(evt) {
				console.log('failed to load buffer');
				console.log(evt);
			});
		}
		request.send();

	} catch(e) {
		console.log('Web Audio API is not supported in this browser');
		console.log(e);
		//drawCanvas();
	}
}

var textures = [];
var tcount = 0;

function checkLoad(){
	tcount++;
	//console.log('tcount: ' + tcount + ' ' + textures.length);
	if (tcount == textures.length) {
		initAudio( function(){
				let dom = document.getElementById('btn');
				if (dom) {
					dom.value = 'Start Demo!';
					dom.disabled = false;
				}
		});
	}
}

//tpolm_ddg = ['1e0c88b198acac03dd2a5e5579a5e156a741486f.jpg','2336ad678515897d65ca3ffcb3fc72123dbc36a2.jpg','2af253c5dcee82b8251bd85956ed1c0bfce13922.jpg','8a5545dac0eb8b8f00d8280b3f831c348b8e01f9.jpg','99b9b160a70a17ed8a65ca9400859b86bb123530.jpg','9ca2308f1feccefe988d398ccda3cc4bf44f4cfc.jpg','ab429dd46af87444de96ab72576d49be9512a43f.jpg','acaf62959cfc5e3ee0acca078751dea376798bd1.jpg','c23f04c43b7508383f1afb661055e344bdd51497.jpg','e99b7185fef47dd8eddbe6011ca7be91874260c7.jpg'];

b.onload = function() {
	textures[0] = loadImageAndCreateTextureInfo('gfx/tpolm_ddg/1e0c88b198acac03dd2a5e5579a5e156a741486f.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[1] = loadImageAndCreateTextureInfo('gfx/tpolm_ddg/2336ad678515897d65ca3ffcb3fc72123dbc36a2.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[2] = loadImageAndCreateTextureInfo('gfx/tpolm_ddg/2af253c5dcee82b8251bd85956ed1c0bfce13922.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[3] = loadImageAndCreateTextureInfo('gfx/tpolm_ddg/8a5545dac0eb8b8f00d8280b3f831c348b8e01f9.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[4] = loadImageAndCreateTextureInfo('gfx/tpolm_ddg/99b9b160a70a17ed8a65ca9400859b86bb123530.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[5] = loadImageAndCreateTextureInfo('gfx/tpolm_ddg/9ca2308f1feccefe988d398ccda3cc4bf44f4cfc.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[6] = loadImageAndCreateTextureInfo('gfx/tpolm_ddg/ab429dd46af87444de96ab72576d49be9512a43f.jpg', function(ti){ console.log(ti); checkLoad(); });
	textures[7] = loadImageAndCreateTextureInfo('gfx/tpolm_ddg/c23f04c43b7508383f1afb661055e344bdd51497.jpg', function(ti){ console.log(ti); checkLoad(); });
}


function start() {
	let dom = document.getElementById('starter_menu');
	if (dom) {//dom.parentNode.removeChild(dom);
		dom.style.display = "none";
	}

	resize();
	
	backgroundAudio.start(0, 0);
	init_time = (new Date()).getTime();
	drawCanvas();
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
	
	(loop = function() {
		if (loop != undefined) {
			//requestAnimationFrame(loop);
			
			let timer;
			if (skip == true) timer = skip_timer;
			 else timer = ((new Date()).getTime()-init_time);
			if (timer < playtime) {
				requestAnimationFrame( loop );
			} else {
				backToStartScreen();
			}
			if (sync_stuff == true) {
				let dom = document.getElementById('timer');
				if (dom) dom.innerText = timer;
				//console.log(timer);
			}
			
			//drawBackground();
			drawQuadOnScreen(timer);
			/*
			// global fader
			let fader = 0.0;
			// fadein
			fader = 1.0 - timer/playtime*10.0;
			if (timer > 5700) fader -= 0.5;
			if (fader < 0.0) fader = 0.0;
			// fadeout
			if (timer > playtime*0.9) fader = ((timer - playtime*0.9)/(playtime*0.1));*/
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
var audiodataLocation;

function initShaderProgramQuad() {

	var vertCode = `
		attribute vec2 a_position;
		attribute vec2 a_texCoord;
		uniform vec2 u_resolution;
		varying vec2 v_resolution;
		varying vec2 v_texCoord;
		void main() {
			vec2 zeroToOne = a_position;
			vec2 zeroToTwo = zeroToOne * 2.0;
			vec2 clipSpace = zeroToTwo - 1.0;
			gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);
			//gl_Position = vec4(a_position[0], a_position[1], 0, 1);
			v_resolution = u_resolution;
			v_texCoord = a_texCoord;
		}`;

	/*var vertCode = `
		#version 300 es
        #define POSITION_LOCATION 0
        #define TEXCOORD_LOCATION 4
        
        precision highp float;
        precision highp int;

        uniform mat4 MVP;

        layout(location = POSITION_LOCATION) in vec2 position;
        layout(location = TEXCOORD_LOCATION) in vec2 texcoord;

        out vec2 v_st;

        void main()
        {
            v_st = texcoord;
            gl_Position = MVP * vec4(position, 0.0, 1.0);
        }
	`;*/
	
	var vertShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertShader, vertCode);
	gl.compileShader(vertShader);
	if (!gl.getShaderParameter(vertShader, gl.COMPILE_STATUS)) {
		console.log('ERROR compiling vert shader!', gl.getShaderInfoLog(vertShader));
		return;
	}

	var fragCode = `
		#version 300 es
        precision highp float;
        precision highp int;
        precision highp sampler2DArray;

		//uniform sampler2D u_texture1;
		//uniform sampler2D u_texture2;
		//uniform sampler2D u_texture3;
		//uniform sampler2D u_texture4;
		//uniform sampler2D u_texture5;
		//uniform sampler2D u_texture6;
		//uniform sampler2D u_texture7;
		//uniform sampler2D u_texture8;
		varying vec2 v_resolution;
		varying vec2 v_texCoord;
		uniform float u_timer;

        uniform sampler2DArray u_texture1;
        uniform int u_layer;

        in vec2 v_st;

        void main()
        {
			gl_FragColor = texture(u_texture1, vec3(v_st, u_layer));
        }
	`;
	
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
	/*textureLocation2 = gl.getUniformLocation(shaderProgram, "u_texture2");
	textureLocation3 = gl.getUniformLocation(shaderProgram, "u_texture3");
	textureLocation4 = gl.getUniformLocation(shaderProgram, "u_texture4");
	textureLocation5 = gl.getUniformLocation(shaderProgram, "u_texture5");
	textureLocation6 = gl.getUniformLocation(shaderProgram, "u_texture6");
	textureLocation7 = gl.getUniformLocation(shaderProgram, "u_texture7");
	textureLocation8 = gl.getUniformLocation(shaderProgram, "u_texture8");*/

	timerLocation = gl.getUniformLocation(shaderProgram, "u_timer");
	
	audiodataLocation = gl.getUniformLocation(shaderProgram, "u_audiodata");
	
	return shaderProgram;	 
}

function drawQuadOnScreen(timer) {
	
	
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D_ARRAY, textures[0].texture);
	gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
	gl.texParameteri(gl.TEXTURE_2D_ARRAY, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	gl.texImage3D(
		gl.TEXTURE_2D_ARRAY,
		0,
		gl.RGBA,
		IMAGE_SIZE.width,
		IMAGE_SIZE.height,
		NUM_IMAGES,
		0,
		gl.RGBA,
		gl.UNSIGNED_BYTE,
		pixels
	);
	
	/*gl.activeTexture(gl.TEXTURE0);
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
	gl.bindTexture(gl.TEXTURE_2D, textures[7].texture);*/
	
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
	/*gl.uniform1i(textureLocation2, 1);
	gl.uniform1i(textureLocation3, 2);
	gl.uniform1i(textureLocation4, 3);
	gl.uniform1i(textureLocation5, 4);
	gl.uniform1i(textureLocation6, 5);
	gl.uniform1i(textureLocation7, 6);
	gl.uniform1i(textureLocation8, 7);*/
	
	gl.uniform1f(timerLocation, timer);
	
	analyser.getByteTimeDomainData(dataArray);
	gl.uniform1fv(audiodataLocation, dataArray);
	
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


let playtime = 10*60*1000+51970;

window.onresize = resize;

function resize() {
	w = window.innerWidth;
	h = window.innerHeight;
	
	c.setAttribute("width", w);
	c.setAttribute("height", h);
	
	gl.viewport(0, 0, w, h);
	
	//ctx = c.getContext("2d");
	//ctx.width = w;
	//ctx.height = h;
}


document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
	if (sync_stuff == false) return;
	var keyCode = e.keyCode;
	console.log(keyCode);

	switch(keyCode) {
		case 32: // space
			//init_time = (new Date()).getTime();
			if (skip == false) {
				enterSkip();
			} else {
				initAudio(function(){
						skip = false;
						init_time = (new Date()).getTime() - skip_timer;
						backgroundAudio.start(0, skip_timer/1000);
					});
			}
		break;
	}

}

function enterSkip() {
	skip_timer = (new Date()).getTime() - init_time;
	backgroundAudio.stop();
	backgroundAudio = undefined;
	skip = true;
}

var skip = false;
var skip_timer = 0;

window.addEventListener("wheel", function(e) {
	if (sync_stuff == false) return;
    //var dir = Math.sign(e.deltaY);
    //console.log(dir + ' ' + e.deltaY);
	if (skip == false) {
		enterSkip();
	}
	skip_timer += -e.deltaY;
	if (skip_timer < 0) skip_timer = 0;
});

function backToStartScreen(){
	let dom = document.getElementById('starter_menu');
	if (dom) {//dom.parentNode.removeChild(dom);
		dom.style.display = "block";
	}
	initAudio(function(){});
}
