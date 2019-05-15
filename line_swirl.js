var D = document;

rand = function(n){
	return 0|(Math.random()*n);
};

D.title = 'lines';

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
	drawCanvas();
}

var w;
var h;
var ctx;
var values = [];

var tc = ['rgba(164,36,59,1)', 'rgba(216, 201, 155, 1)', 'rgba(216, 151, 160, 1)', 'rgba(189, 99, 47, 1)', 'rgba(39, 62, 71, 1)'];

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
		
		// update bg
		if (bsync < milis) {
			bgcolor = tc[rand(tc.length-1)];
			bsync = milis + sync*40;
		}	
		
		// clear canvas
		ctx.globalAlpha=1.0;
		ctx.fillStyle = bgcolor;
		ctx.fillRect(0,0,w,h);

		// update lines
		if (csync < milis) {
			for (let i=0; i<num_lines; i++) {
				let lsep = w/num_lines;
				for (let j=0; j<num_nodes; j++) {
					let rnd = rand(5)-2;
					//let prev = values[i-1][j];
					//let next = values[i+1][j];

					let j = rand(num_nodes)+1;
					values[i][j] = values[i][j-1] + rnd;//(prev+next)*0.5 + lsep + rnd;
				}
			}
			csync = milis + sync;
		}	
		
		ctx.globalAlpha=0.2;
		ctx.strokeStyle = tc[4];
		
		// draw lines
		for (let i=0; i<num_lines; i++) {
			let nsep = h/num_nodes;
			
			ctx.beginPath();
			for (let j=0; j<num_nodes; j++) {
				let microshift = Math.sin(milis/2500)*1.5;
				let drift = Math.sin((i-num_lines)*0.01*microshift + j*0.02 + milis/1000)*500;
				if (j==0) ctx.moveTo(values[i][j] + drift, j * nsep);
				 else ctx.lineTo(values[i][j] + drift, j * nsep);
			}
			
			ctx.stroke();
			ctx.closePath();
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
