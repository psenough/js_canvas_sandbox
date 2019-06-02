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
	
	ImageLoader(img_ref, './gfx/autumn1_ddg/', autumn1_ddg, 
		function(result){
			if(result.error.length != 0){
				// outputs: ["example.png", "example.jpg"]
				console.log("The following images couldn't be properly loaded: ", result.error);
			}

			// outputs: ["http://i.imgur.com/fHyEMsl.jpg"]
			console.log("The following images were succesfully loaded: ", result.success);
			drawCanvas();
	});
	
}

var w;
var h;
var ctx;
var values = [];

var init_time = (new Date()).getTime();

var ext = {'num_lines': 20, 'cos_width': 10};

let scheduled_pings;

function drawCanvas() {

	resize();

	var num_nodes = 120;

	var sync = 100;
	var csync = 0;
	var bsync = 0;

	var bgcolor = 'rgba(0,0,0,1.0)';
	
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
		
	}
	
	requestAnimationFrame( animate );

	function animate() {
		requestAnimationFrame( animate );
		let milis = (new Date()).getTime() - init_time;
		ctx.clearRect(0,0,w,h);
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