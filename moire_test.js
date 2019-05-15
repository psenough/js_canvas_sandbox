var D = document;

rand = function(n){
	return 0|(Math.random()*n);
};

D.title = 'moire points test';

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
var nw = 70;
var nh = 70;

var tc = ['rgba(164,36,59,1)', 'rgba(216, 201, 155, 1)', 'rgba(216, 151, 160, 1)', 'rgba(189, 99, 47, 1)', 'rgba(39, 62, 71, 1)'];

function drawCanvas() {

	resize();

	var angle = (Math.PI*2)*0.0005;

	var bgcolor = 'rgba(255,255,255,1.0)';
	var size = 18;
	
	var init_time = (new Date()).getTime();
	
	function drawSquare(ctx, x, y, size) {
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+size, y);
		ctx.lineTo(x+size, y+size);
		ctx.lineTo(x, y+size);
		ctx.closePath();
		ctx.fill();
	}
	
	function drawTri(ctx, x, y, size) {
		ctx.beginPath();
		ctx.moveTo(x,y);
		ctx.lineTo(x+size, y);
		ctx.lineTo(x+size, y+size);
		//ctx.lineTo(x, y+size);
		ctx.closePath();
		ctx.fill();
	}
	
	function drawThis(milis) {
		
		// clear canvas
		ctx.globalAlpha=1.0;
		ctx.fillStyle = bgcolor;
		ctx.fillRect(0,0,w,h);
		
		ctx.fillStyle = "#ff2626";
		ctx.save();
		
		ctx.translate(w*0.5, h*0.5);
		
		for (let x=0; x<nw; x++) {
			for (let y=0; y<nh; y++) {
				drawTri(ctx, w*0.5 - x*(w/nw), w*0.5 - y*(w/nw), size);
			}
		}
		
		ctx.rotate(milis*0.0001+angle);
		
		for (let x=0; x<nw; x++) {
			for (let y=0; y<nh; y++) {
				drawTri(ctx, w*0.5 - x*(w/nw), w*0.5 - y*(w/nw), size);
			}
		}
		
		ctx.restore();
		
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
