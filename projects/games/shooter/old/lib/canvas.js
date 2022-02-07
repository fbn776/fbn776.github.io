const PI = pi = Math.PI;
const root2 = Root2 = Math.sqrt(2);
const twoPi = two_pi = 2*Math.PI;
const width = window.innerWidth;
const height = window.innerHeight;

var mouseX = mouseY = undefined;

var canvas = ctx = cx = cy = cw = ch = undefined;
function isElm($obj){
    try {
        return ($obj.constructor.__proto__.prototype.constructor.name)?true:false;
    }catch(e){
        return false;
    }
}
function createLog(c){
	let elm = document.createElement("div");
	document.body.appendChild(elm);
	elm.setStyle({
		position:"fixed",
		zIndex:9999,
		padding:"2px",
		left:0,
		top:0,
		
		backgroundColor:"rgba(255,255,255,0.5)",
		color:c || "black",
	});	
	this.log = function(x){
		elm.innerHTML = x;
	}
}
function enableMouse(){
	let elm = canvas;
	let args = arguments;
	let opt = {};
	if(isElm(args[0])){
		elm = args[0];
	}else {
		opt = args[0];
	}
	elm.addEventListener('touchmove',function(e){
		let x = e.touches[0].clientX,
			y = e.touches[0].clientY;		
		mouseX = x;
		mouseY = y;
	});
	elm.addEventListener('click',function(e){
		let x = e.clientX,
			y = e.clientY;		
		mouseX = x;
		mouseY = y;
	});
	if(!opt.save){
		elm.addEventListener('touchend',function(){
			mouseX = mouseY = undefined;
		});
	}
}
function setUpCanvas(elm_name,w,h){
	canvas = document.querySelector(elm_name);
	ctx = canvas.getContext('2d');
	canvas.width = w || window.innerWidth;
	canvas.height = h || window.innerHeight;
	cx = canvas.width/2;
	cy = canvas.height/2;
	cw = canvas.width;
	ch = canvas.height;
}

function clear(){
	let args = arguments;
	let x = args[0] || 0,
		y = args[1] || 0,
		w = args[2] || canvas.width,
		h = args[3] || canvas.height;
	ctx.clearRect(x,y,w,h);
}

function rotate(rot){
	ctx.rotate(rot);
}
function translate(x,y){
	ctx.translate(x,y);
}
function scale(x,y){
	ctx.scale(x,y);
}


CanvasRenderingContext2D.prototype.line = function(){
	let args = arguments;
	let x1 = args[0],
		y1 = args[1],
		x2 = args[2],
		y2 = args[3],
		opt = args[4] || {};
	ctx.beginPath();
	let strokeColor = (opt.color || opt.strokColor || "black"),
		lineWidth = (opt.width || opt.lineWidth || 1);
		if(opt.dash || opt.dashed){
			ctx.setLineDash(opt.dash || opt.dashed || [5,2]);
		}
		ctx.strokeStyle = strokeColor;
		ctx.lineWidth = lineWidth;
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
		ctx.setLineDash([0,0])
	ctx.closePath();
	
};
CanvasRenderingContext2D.prototype.box = function(){
	let args = arguments;
	let x = args[0],
		y = args[1],
		w = args[2],
		h = args[3],
		opt = args[4] || {};
		
	ctx.beginPath();
		ctx.strokeStyle = (opt.color || opt.strokeStyle || opt.borderColor || "black");
		ctx.fillStyle = (opt.fill || opt.fillColor || opt.bg || opt.bgColor || "black");
		ctx.lineWidth = (opt.width || opt.lineWidth || opt.borderWidth || 1);
		ctx.rect(x,y,w,h);
		
		ctx.fill();
		ctx.stroke();
	ctx.closePath();
};

CanvasRenderingContext2D.prototype.circle = function(){
	let args = arguments;
	let x = args[0],
		y = args[1],
		r = args[2],
		opt = args[3] || {};
		
	ctx.beginPath();
		ctx.strokeStyle = (opt.color || opt.strokeStyle || opt.borderColor || "black");
		ctx.fillStyle = (opt.fill || opt.fillColor || opt.bg || opt.bgColor || "black");
		ctx.lineWidth = (opt.width || opt.lineWidth || opt.borderWidth || 1);
		ctx.arc(x,y,r,0,twoPi);
		ctx.fill();
		ctx.stroke();
	ctx.closePath();
};

CanvasRenderingContext2D.prototype.text = function(){
	let args = arguments;
	let x = args[0],
		y = args[1],
		txt = args[2],
		opt = args[3] || {};
		
	ctx.beginPath();
		ctx.font = opt.font || "10px Arial";
		ctx.fillText(txt,x,y);		
	ctx.closePath();
};
CanvasRenderingContext2D.prototype.Arrow = function(){
	let args = arguments;
	let sX = args[0],
		sY = args[1],
		eX = args[2],
		eY = args[3],
		opt = args[4] || {};
	let diffY = eY - sY,
		diffX = eX - sX,
		angle = Math.atan2((diffY), (diffX));
	
	ctx.line(sX,sY,eX,eY,{
		color:opt.color || "black",
		width:opt.width || 1,
	});
	let size = opt.arrowSize || opt.size || 8;
	ctx.save();
		translate(eX,eY);
		rotate(angle);
		ctx.beginPath();
			ctx.fillStyle = opt.color || "black";
			ctx.moveTo(0,0);
			ctx.lineTo(0,-size+2);
			ctx.lineTo(size+2,0);
			ctx.lineTo(0,size-2);
			ctx.lineTo(0,0);
			ctx.fill();
		ctx.closePath();
	ctx.restore();
	
};
/*
class Arrow {
	constructor(x1,y1,x2,y2,c,size,color){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;		
		this.ctx = c;
		this.size = size;
		this.color = color || "black";
	}
	show(){
		let context = ctx || this.ctx;
		let size = this.size || 10;
		let diffY = this.y2 - this.y1,
			diffX = this.x2 - this.x1,
			angle = Math.atan2((diffY), (diffX));			
		context.line(this.x1,this.y1,this.x2,this.y2);
		context.save();
			context.translate(this.x2,this.y2);
			context.rotate(angle);						
			context.beginPath();
				context.fillStyle = this.color;
				context.moveTo(0,0);
				context.lineTo(0,-size+2);
				context.lineTo(size+2,0);
				context.lineTo(0,size-2);
				context.lineTo(0,0);
				context.fill();
			context.closePath();
		context.restore();
	}
}

*/
function circleCord(){
	let args = arguments;
	let	h = args[0],
		k = args[1],
		r = args[2],
		angle = args[3];
	return {
		x:(r*Math.cos(angle))+h,
		y:(r*Math.sin(angle))+k,
	};
}
function slope(){
	let args = arguments;
	let	x1 = args[0],
		y1 = args[1],
		x2 = args[2],
		y2 = args[3];
	return (y2-y1)/(x2-x1);
}