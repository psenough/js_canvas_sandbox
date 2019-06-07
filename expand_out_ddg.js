var D = document;

rand = function(n){
	return 0|(Math.random()*n);
};

D.title = 'expand out';

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
//var c = D.createElement('canvas');
//b.appendChild(c);
c = document.getElementById('c');


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



var rms = 0;

var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
//var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
//var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
//var is_opera = navigator.userAgent.indexOf("Presto") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}

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
		if (is_safari) request.open('GET', 'audio/himalayha_-_tao_perto_tao_longe.m4a', true);
			else request.open('GET', 'audio/himalayha_-_tao_perto_tao_longe.ogg', true);
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
				analyser.fftSize = 256;
				bufferLength = analyser.fftSize;
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

var img_ref_spring = [];
var img_ref_winter = [];

function ImageLoader(Ref, ImgDir, Images, Callback){
    // Keep the count of the verified images
    var allLoaded = 0;

    // The object that will be returned in the callback
    var _log = {
        success: [],
        error: []
    };

    // Executed everytime an img is successfully or wrong loaded
    var verifier = function(){
        allLoaded++;

        // triggers the end callback when all images has been tested
        if(allLoaded == Images.length){
			//console.log(_log);
            Callback.call(undefined, _log);
        }
    };

    // Loop through all the images URLs
    for (var index = 0; index < Images.length; index++) {
        // Prevent that index has the same value by wrapping it inside an anonymous fn
        (function(i){
            // Image path providen in the array e.g image.png
            var imgSource = Images[i];
            var img = new Image();
            
            img.addEventListener("load", function(){
                _log.success.push(imgSource);
                verifier();
            }, false); 
            
            img.addEventListener("error", function(err){
                _log.error.push(imgSource);
                verifier();
            }, false); 
           //console.log(img_dir + imgSource);
            img.src = ImgDir + imgSource;
			
			Ref.push(img);
        })(index);
    }
}

var vignette;

b.onload = function() {
	
	vignette = new Image();
    vignette.src = './gfx/reference_vignette.png';
	vignette.addEventListener("load", function(){
		console.log('my vignette is dark and long!');
	}, false);
	
	ImageLoader(img_ref_spring, './gfx/spring3_ddg/', spring3_ddg, 
		function(result){
			if(result.error.length != 0){
				console.log("The following images couldn't be properly loaded: ", result.error);
			}

			ImageLoader(img_ref_winter, './gfx/winter1_ddg/', winter1_ddg, 
				function(result){
					if(result.error.length != 0){
						// outputs: ["example.png", "example.jpg"]
						console.log("The following images couldn't be properly loaded: ", result.error);
					}

					// outputs: ["http://i.imgur.com/fHyEMsl.jpg"]
					console.log("The following images were succesfully loaded: ", result.success);
					//init();
					initAudio( function(){
						let dom = document.getElementById('btn');
						if (dom) {
							dom.value = 'Start Demo!';
							dom.disabled = false;
						}
					} );
			});
	});
	
}

var w;
var h;
var ctx;
var values = [];

var init_time = (new Date()).getTime();

let scheduled_pings;

let avg = 0.0;

function drawCanvas() {

	var num_nodes = 120;

	var sync = 100;
	var csync = 0;
	var bsync = 0;

	var bgcolor = 'rgba(0,0,0,1.0)';
	
	function drawSpectrum() {	
		analyser.getByteTimeDomainData(dataArray);
		let wb = w / bufferLength;	
		for(let i = 0; i < bufferLength; i++) {
			let v = dataArray[i] / bufferLength;
			let d = (1.0+Math.sin(v*20.0))*v*10.0;			
			color = "rgba(255,255,255,"+v*0.25+")";
			ctx.fillStyle = color;
			ctx.beginPath();
			ctx.moveTo(i*wb-d,0);
			ctx.lineTo(i*wb+wb+d,0);
			ctx.lineTo(i*wb+wb+d,h);
			ctx.lineTo(i*wb-d,h);
			ctx.fill();
		}
	}
	
	function drawPings() {
		let timer = ((new Date()).getTime()-init_time);
		let dom = document.getElementById('timer');
		if (dom) dom.innerText = timer;

		let img_ref;
		if (timer < 96000) img_ref = img_ref_spring;
			else img_ref = img_ref_winter;

		for (let j=0; j<scheduled_pings.length; j++) {
			let timed = timer-scheduled_pings[j]['inittime'];
			let initimg = scheduled_pings[j]['initimg'];
			let initx = scheduled_pings[j]['initx'];
			let inity = scheduled_pings[j]['inity'];
			let niter = scheduled_pings[j]['niter'];
			let speed = scheduled_pings[j]['speed'];
			let width = scheduled_pings[j]['width'];
			ctx.save();
			var im = initimg+niter; //img_ref.length;
			for (var i=initimg; i<im; i++) {
				ctx.beginPath();
				var radius = -width*im + width*(im-i) + timed*0.5 + width*initimg;
				//console.log(initx);
				if (radius > 0) {
					ctx.arc(initx, inity, radius, 0, 2 * Math.PI);
					ctx.clip();
					ctx.drawImage(img_ref[i],0,0,w,h);
				}
			}
			ctx.restore();
		}
		
	}
	
	requestAnimationFrame( animate );

	function animate() {
		requestAnimationFrame( animate );
		ctx.clearRect(0,0,w,h);
		ctx.globalAlpha = 1.0;
		//console.log(avg);
		//ctx.drawImage(img_ref[1],0,0,w,h);
		drawPings();
		drawSpectrum();
		ctx.drawImage(vignette,0,0,w,h);
	}
}

window.onresize = resize;

function resize() {
	w = window.innerWidth;
	h = window.innerHeight;
	
	c.setAttribute("width", w);
	c.setAttribute("height", h);
	
	ctx = c.getContext("2d");
	ctx.width = w;
	ctx.height = h;
}

function start() {
	let dom = document.getElementById('btn');
	if (dom) dom.parentNode.removeChild(dom);

	resize();
	scheduled_pings = [
		{'inittime':      0, 'initimg':  0, 'initx': 0, 'inity': h*0.5, 'niter': 6, 'speed': 0.3, 'width': 300 }
		,{'inittime':  4500, 'initimg':  5, 'initx': w, 'inity': h*0.5, 'niter': 6, 'speed': 0.2, 'width': 250 }
		,{'inittime':  8000, 'initimg': 12, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.8, 'width': 50 }
		,{'inittime': 12000, 'initimg':  0, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.8, 'width': 50 }
		,{'inittime': 16000, 'initimg':  9, 'initx': 0, 'inity': h*0.5, 'niter': 6, 'speed': 0.3, 'width': 300 }
		,{'inittime': 20500, 'initimg': 13, 'initx': w, 'inity': h*0.5, 'niter': 6, 'speed': 0.2, 'width': 250 }
		,{'inittime': 24000, 'initimg': 19, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.3, 'width': 50 }
		,{'inittime': 28000, 'initimg': 15, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.3, 'width': 50 }
		,{'inittime': 32000, 'initimg': 16, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 36000, 'initimg': 17, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 40000, 'initimg': 18, 'initx': w*0.5, 'inity': h*0.5, 'niter': 2, 'speed': 0.5, 'width': 50 }
		,{'inittime': 44000, 'initimg': 11, 'initx': w*0.5, 'inity': h*0.5, 'niter': 2, 'speed': 0.5, 'width': 50 }
		,{'inittime': 48000, 'initimg': 20, 'initx': w*0.2, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 48400, 'initimg': 21, 'initx': w*0.4, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 48800, 'initimg': 22, 'initx': w*0.6, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 49300, 'initimg': 23, 'initx': w*0.8, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 52000, 'initimg':  0, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 52300, 'initimg':  2, 'initx': w*0.25, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 52600, 'initimg':  3, 'initx': w*0.75, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 56000, 'initimg':  7, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 56500, 'initimg':  8, 'initx': w*0.25, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 57300, 'initimg':  9, 'initx': w*0.75, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 58800, 'initimg': 10, 'initx': w*0.25, 'inity': h*0.5, 'niter': 10, 'speed': 0.2, 'width': 25 }
		,{'inittime': 59300, 'initimg': 10, 'initx': w*0.75, 'inity': h*0.5, 'niter': 10, 'speed': 0.2, 'width': 25 }
		,{'inittime': 60000, 'initimg':  1, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 64000, 'initimg': 23, 'initx': w*0.5, 'inity': h*0.5, 'niter': 2, 'speed': 0.5, 'width': 50 }
		,{'inittime': 68000, 'initimg': 16, 'initx': w*0.5, 'inity': h*0.5, 'niter': 2, 'speed': 0.5, 'width': 50 }
		,{'inittime': 70500, 'initimg':  2, 'initx': w*0.25, 'inity': h*0.5, 'niter': 2, 'speed': 0.5, 'width': 50 }
		,{'inittime': 72000, 'initimg': 13, 'initx': w*0.2, 'inity': h*0.5, 'niter': 2, 'speed': 0.5, 'width': 50 }
		,{'inittime': 72400, 'initimg':  4, 'initx': w*0.4, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 72800, 'initimg':  5, 'initx': w*0.6, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 73150, 'initimg':  6, 'initx': w*0.8, 'inity': h*0.5, 'niter': 2, 'speed': 0.5, 'width': 50 }
		,{'inittime': 74600, 'initimg':  8, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 76100, 'initimg':  9, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 76100, 'initimg': 10, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 76200, 'initimg': 11, 'initx': w*0.25, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 76500, 'initimg': 12, 'initx': w*0.75, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 80000, 'initimg': 13, 'initx': w*0.25, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 84000, 'initimg': 14, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 86500, 'initimg': 15, 'initx': w*0.75, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 88000, 'initimg':  1, 'initx': w*0.25, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 88400, 'initimg':  2, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 88800, 'initimg':  3, 'initx': w*0.75, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 89200, 'initimg':  4, 'initx': w*0.5, 'inity': h*0.5, 'niter': 2, 'speed': 0.5, 'width': 50 }
		,{'inittime': 90600, 'initimg':  7, 'initx': w*0.25, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 92000, 'initimg':  8, 'initx': w*0.5, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 92200, 'initimg':  9, 'initx': w*0.25, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 92500, 'initimg': 10, 'initx': w*0.75, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }

		,{'inittime': 96000, 'initimg':  1, 'initx': w*0.2, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 97000, 'initimg':  2, 'initx': w*0.4, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 97550, 'initimg':  3, 'initx': w*0.6, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime': 97850, 'initimg':  4, 'initx': w*0.8, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime':100000, 'initimg':  5, 'initx': w*0.2, 'inity': h*0.5, 'niter': 3, 'speed': 0.5, 'width': 50 }
		,{'inittime':101100, 'initimg':  8, 'initx': w*0.4, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime':101500, 'initimg':  9, 'initx': w*0.6, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime':102000, 'initimg': 10, 'initx': w*0.8, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime':104000, 'initimg': 11, 'initx': w*0.2, 'inity': h*0.5, 'niter': 3, 'speed': 0.5, 'width': 50 }
		,{'inittime':105100, 'initimg': 12, 'initx': w*0.4, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime':105500, 'initimg': 13, 'initx': w*0.6, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime':105600, 'initimg': 14, 'initx': w*0.8, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
		,{'inittime':108000, 'initimg': 15, 'initx': w*0.2, 'inity': h*0.5, 'niter': 3, 'speed': 0.5, 'width': 50 }
 		,{'inittime':109000, 'initimg': 19, 'initx': w*0.4, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
 		,{'inittime':109500, 'initimg': 20, 'initx': w*0.6, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
 		,{'inittime':109600, 'initimg': 21, 'initx': w*0.8, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }
 		,{'inittime':112000, 'initimg': 22, 'initx': w*0.2, 'inity': h*0.5, 'niter': 1, 'speed': 0.5, 'width': 50 }

	];
	backgroundAudio.start(0);
	init_time = (new Date()).getTime();
	drawCanvas();
}

document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
	var keyCode = e.keyCode;
	console.log(keyCode);

	switch(keyCode) {
		case 32: // space
			//init_time = (new Date()).getTime();
			backgroundAudio.stop();
		break;
	}

}
