var D = document;

rand = function(n){
	return 0|(Math.random()*n);
};

D.title = 'slit images';

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

b.onload = function() {
	loadBackgroundImage( '6a8c475c1ca295ce2ea124fd5cf30ceeaa31ae30.jpg', drawCanvas);
}

var w;
var h;
var ctx;
var values = [];

var tc = ['rgba(164,36,59,1)', 'rgba(216, 201, 155, 1)', 'rgba(216, 151, 160, 1)', 'rgba(189, 99, 47, 1)', 'rgba(39, 62, 71, 1)'];
var bg_img;
var img_dir = 'gfx/';
function loadBackgroundImage(image_filename, cb) {
	bg_img = new Image();
	bg_img.onload = cb;
	bg_img.src = img_dir + image_filename;
}
function drawCanvas() {

	resize();

	var num_nodes = 120;
	var num_lines = 500;
//	var angle = (Math.PI*2)/num;

	for (let i=0; i<num_lines; i++) {
		values[i] = [];
		let lsep = w/num_lines;
		//let nsep = h/num_nodes;
		
		for (let j=0; j<num_nodes; j++) {
			let rnd = rand(5)-2;
			let prev = 0;
			if (i!=0) prev = values[i-1][j];
			
			values[i][j] = prev + lsep + rnd;
			
			//if (j==0) ctx.moveTo(values[i][j], j * nsep);
			// else ctx.lineTo(values[i][j], j * nsep);
		}
		
		//ctx.stroke();
		//ctx.closePath();
	}

	var sync = 100;
	var csync = 0;
	var bsync = 0;

	var bgcolor = 'rgba(0,0,0,1.0)';
	
	var init_time = (new Date()).getTime();
	
	function drawThis(milis) {
		
		let split = '100000001110'; //params['split_data']['value']);
						
		if (bg_img != undefined) {
			
			d2 = new Date();
			n2 = d2.getTime(); 
			timer = (n2-init_time);

			let len = Math.floor(w / split.length);
			let iw = bg_img.width;
			let ih = bg_img.height;
			let ilen = Math.floor(iw / split.length);
			let iwww = iw/ilen;
			//console.log(ilen);
			
			for (let i=0; i < split.length; i++) {
				
				let wild = (1-parseInt(split[i],10)) * (rand(5) + Math.cos(timer) + Math.sin(timer));
				
				let top_elev = (Math.sin( i*Math.PI*0.02 + wild + (timer/(Math.PI*200)) ) + 1.0) * 0.5;
				
				let imid = top_elev * ih;
				let mid = top_elev * h;
				
				ctx.drawImage(bg_img, i*ilen, imid, i*ilen+ilen, ih-imid, i*len, 0,   i*len+len, h-mid);
				
				ctx.drawImage(bg_img, i*ilen, 0,    i*ilen+ilen, imid,    i*len, h-mid, i*len+len, h);
				
				//ctx.drawImage(bg_img, i*ilen, imid, i*ilen+ilen, ih-imid, i*len, mid, i*len+len, h-mid);
			}
		}
		
		
	}
	
	requestAnimationFrame( animate );

	function animate() {
		requestAnimationFrame( animate );
		let milis = (new Date()).getTime() - init_time;
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
