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
b.innerHTML = '';
var c = D.createElement('canvas');
b.appendChild(c);
c.style.background = "transparent";

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
				
function init() {
	    
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
				backgroundAudio.loop = true;
				backgroundAudio.start(0);
				
				analyser = context.createAnalyser();
				analyser.fftSize = 256;
				bufferLength = analyser.fftSize;
				dataArray = new Uint8Array(bufferLength);
				analyser.getByteTimeDomainData(dataArray);
				backgroundAudio.connect(analyser);
				/*analyser.connect(context.destination);*/
				
				// start canvas
				drawCanvas();
	  
				console.log('decoded');

	  
			}, function(evt) {
				console.log('failed to load buffer');
				console.log(evt);
			});
		}
		request.send();

	} catch(e) {
		console.log('Web Audio API is not supported in this browser');
		console.log(e);
		drawCanvas();
	}

}
var buffer;

var process = function(e) {
	buffer = e.inputBuffer.getChannelData(0);
	var len = buffer.length; 
	var total = 0;
	var i = 0;
	
	freq1 = Math.abs(buffer[parseInt(len*0.015,10)]*2.0);
	freq2 = Math.abs(buffer[parseInt(len*0.1,10)]*2.0);

	while ( i < len ) total += Math.abs( buffer[i++] );
	
	rms = (rms + Math.sqrt( total / len )) * 0.5;
}

var img_ref = [];

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

b.onload = function() {
	
}

function LoadAndLaunch() {
	ImageLoader(img_ref, './gfx/spring3_ddg/', spring3_ddg, 
		function(result){
			if(result.error.length != 0){
				// outputs: ["example.png", "example.jpg"]
				console.log("The following images couldn't be properly loaded: ", result.error);
			}

			// outputs: ["http://i.imgur.com/fHyEMsl.jpg"]
			console.log("The following images were succesfully loaded: ", result.success);
			init();
	});
}

var w;
var h;
var ctx;
var values = [];

var init_time = (new Date()).getTime();

var ext = {'num_lines': 20, 'cos_width': 10};

let scheduled_pings;

let avg = 0.0;

function drawCanvas() {

	resize();

	var num_nodes = 120;

	var sync = 100;
	var csync = 0;
	var bsync = 0;

	var bgcolor = 'rgba(0,0,0,1.0)';
	
	function drawSpectrum() {
	
		//let cnt = 0.0;
		
		analyser.getByteTimeDomainData(dataArray);
		
		let wb = w / bufferLength; // 1000 / 20 = 50
		
		for(let i = 0; i < bufferLength; i++) {
			let v = dataArray[i] / bufferLength;
			let d = (1.0+Math.sin(v*20.0))*v*10.0;			
			//if (i == 1) console.log(v);
			color = "rgba(255,255,255,"+v*0.25+")";
			ctx.fillStyle = color;
			ctx.beginPath();
			/*ctx.moveTo(i*4+0,h-v*h);
			ctx.lineTo(i*4+2,h-v*h);
			ctx.lineTo(i*4+2,h);
			ctx.lineTo(i*4+0,h);*/
			ctx.moveTo(i*wb-d,0);
			ctx.lineTo(i*wb+wb+d,0);
			ctx.lineTo(i*wb+wb+d,h);
			ctx.lineTo(i*wb-d,h);
			ctx.fill();
			//cnt += v;
		}
		//avg = (avg + avg + cnt/fftsize) / 3;
	}
	
	function drawThis(milis) {
		
		let num_lines = ext['num_lines'];
		let cos_width = ext['cos_width'];
							
		d2 = new Date();
		n2 = d2.getTime(); 
		timer = (n2-init_time);
		//console.log(timer);

		for (let j=0; j<scheduled_pings.length; j++) {
			let timed = timer;//-scheduled_pings[j]['inittime'];
			let initimg = scheduled_pings[j]['initimg'];
			let initx = scheduled_pings[j]['initx'];
			let inity = scheduled_pings[j]['inity'];
			let niter = scheduled_pings[j]['niter'];
			let speed = scheduled_pings[j]['speed'];
			let width = scheduled_pings[j]['width'];
			//console.log(niter + ' ' + initx);
			ctx.save();
			var im = initimg+niter; //img_ref.length;
			for (var i=initimg; i<im; i++) {
				ctx.beginPath();
				var radius = -width*im + width*(im-i) + timed*0.5;
				//console.log(initx);
				if (radius > 0) {
					ctx.arc(initx, inity, radius, 0, 2 * Math.PI);
					ctx.clip();
					ctx.drawImage(img_ref[i],0,0,w,h);
				}
			}
			ctx.restore();
		}
		
		drawSpectrum();
		
	}
	
	requestAnimationFrame( animate );

	function animate() {
		requestAnimationFrame( animate );
		let milis = (new Date()).getTime() - init_time;
		ctx.clearRect(0,0,w,h);
		ctx.globalAlpha = 1.0;
		//console.log(avg);
		//ctx.drawImage(img_ref[1],0,0,w,h);
		drawThis(milis);
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
	
	scheduled_pings = [
		{'inittime': 0, 'initimg': 0, 'initx': w*0.5, 'inity': h*0.5, 'niter': 3, 'speed': 0.5, 'width': 200 }
		,{'inittime': 3000, 'initimg': 10, 'initx': w*0.8, 'inity': h*0.8, 'niter': 2, 'speed': 0.8, 'width': 100 }
	];
}

window.addEventListener("click", function(event) {
	LoadAndLaunch();
});


document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
	var keyCode = e.keyCode;
	console.log(keyCode);

	switch(keyCode) {
		case 32: // space
			//ext = {'num_lines': 30, 'cos_width': 20};
			init_time = (new Date()).getTime();
		break;
	}

}
