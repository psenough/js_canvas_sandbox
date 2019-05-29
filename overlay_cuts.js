var D = document;

rand = function(n){
	return 0|(Math.random()*n);
};

D.title = 'overlay cuts';

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

var img_dir = 'gfx/';
var img_ref = [];

function ImageLoader(Images, Callback){
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
            img.src = img_dir + imgSource;
			
			img_ref.push(img);
        })(index);
    }
}

b.onload = function() {
	
	ImageLoader(["6a8c475c1ca295ce2ea124fd5cf30ceeaa31ae30.jpg", "51fd74aa826ee476acdcfa9ec197080a20301d9f.jpg", "80e0f8fd0b4eb67a1ce295b578dc3957bb62056c.jpg", "871846d2bd4ad184a5a57bc4f8130e770e89765b.jpg"],
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

var tc = ['rgba(164,36,59,1)', 'rgba(216, 201, 155, 1)', 'rgba(216, 151, 160, 1)', 'rgba(189, 99, 47, 1)', 'rgba(39, 62, 71, 1)'];
var img_dir = 'gfx/';
/*function loadBackgroundImage(image_filename, cb) {
	bg_img = new Image();
	bg_img.onload = cb;
	bg_img.src = img_dir + image_filename;
}*/

var init_time = (new Date()).getTime();

var ext = {'num_lines': 20, 'cos_width': 10};

function drawCanvas() {

	resize();

	var num_nodes = 120;
//	var angle = (Math.PI*2)/num;

	var sync = 100;
	var csync = 0;
	var bsync = 0;

	var bgcolor = 'rgba(0,0,0,1.0)';
	
	//console.log(img_ref);
	var bg_img = img_ref[2];
	
	function drawThis(milis) {
		
	let num_lines = ext['num_lines'];
	let cos_width = ext['cos_width'];
						
		if (bg_img != undefined) {
			
			d2 = new Date();
			n2 = d2.getTime(); 
			timer = (n2-init_time);

			let len = Math.floor(w / num_lines);
			let iw = bg_img.width;
			let ih = bg_img.height;
			let ilen = Math.floor(iw / num_lines);
			//let iwww = iw/ilen;
			//console.log(ilen);
			
			/*ctx.save();
			ctx.fillStyle = "red";
			//ctx.rect(40, 20, 200, 200);
			ctx.beginPath();
			ctx.arc(200, 175, 200, 0, 2 * Math.PI);
			//ctx.fill();
			//ctx.stroke();
			ctx.clip();
			
			ctx.drawImage(img_ref[2],0,0,w,h);
			
			ctx.beginPath();
			ctx.arc(250, 175, 50, 0, 2 * Math.PI);
			ctx.clip();
			ctx.drawImage(img_ref[3],0,0,w,h);
			ctx.restore();*/
			
			ctx.save();
			var im = img_ref.length;
			for (var i=0; i<im; i++) {
				ctx.beginPath();
				ctx.arc(w*0.5, h*0.5, 200*(im-i) + Math.sin(timer*0.002+i*10)*140 + 10*Math.sin(Math.PI*0.5+i*2*Math.cos(timer*0.001)), 0, 2 * Math.PI);
				ctx.clip();
				ctx.drawImage(img_ref[i],0,0,w,h);
			}
			ctx.restore();
			
			
				//ctx.drawImage(bg_img, i*ilen, imid, i*ilen+ilen, ih-imid, i*len, 0,   i*len+len, h-mid);
				
				//ctx.drawImage(bg_img, i*ilen, 0,    i*ilen+ilen, imid,    i*len, h-mid, i*len+len, h);
				
				//ctx.drawImage(bg_img, i*ilen, imid, i*ilen+ilen, ih-imid, i*len, mid, i*len+len, h-mid);
		
		}
		
		
	}
	
	requestAnimationFrame( animate );

	function animate() {
		requestAnimationFrame( animate );
		let milis = (new Date()).getTime() - init_time;
		//ctx.clearRect(0,0,w,h);
		ctx.drawImage(img_ref[1],0,0,w,h);
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
}


document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
	var keyCode = e.keyCode;
	console.log(keyCode);

	switch(keyCode) {
		case 32: // space
			ext = {'num_lines': 30, 'cos_width': 20};
		break;
	}

}