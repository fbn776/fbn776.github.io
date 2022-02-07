const width = window.innerWidth;
const height = window.innerHeight;
const twoPi = Math.PI * 2;
function setUpCanvas(c,w,h){
	c.width = w;
	c.height = h;
	return {
		canvas:c,
		ctx:c.getContext("2d"),
		cw:c.width,
		ch:c.height,
		cx:c.width/2,
		cy:c.height/2
	}
}

CanvasRenderingContext2D.prototype.line = function(x1,y1,x2,y2,opt = {}){
	let ctx = this;
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
CanvasRenderingContext2D.prototype.box = function(x,y,w,h,opt={}){
	let ctx = this;
	ctx.beginPath();
		ctx.strokeStyle = (opt.color || opt.strokeStyle || opt.borderColor || "black");
		ctx.fillStyle = (opt.fill || opt.fillColor || opt.bg || opt.bgColor || "black");
		ctx.lineWidth = (opt.width || opt.lineWidth || opt.borderWidth || 1);
		ctx.rect(x,y,w,h);
		ctx.fill();
		ctx.stroke();
	ctx.closePath();
};

CanvasRenderingContext2D.prototype.circle = function(x,y,r,opt={}){
	let ctx = this;
	ctx.beginPath();
		ctx.strokeStyle = (opt.color || opt.strokeStyle || opt.borderColor || "black");
		ctx.fillStyle = (opt.fill || opt.fillColor || opt.bg || opt.bgColor || "black");
		ctx.lineWidth = (opt.width || opt.lineWidth || opt.borderWidth || 1);
		ctx.arc(x,y,r,0,twoPi);
		ctx.fill();
		ctx.stroke();
	ctx.closePath();
};

CanvasRenderingContext2D.prototype.showText = function(x,y,txt,opt = {}){
	let ctx = this;
	ctx.beginPath();
		ctx.fillStyle = opt.color || "black";
		ctx.font = opt.font || "10px Arial";
		ctx.fillText(txt,x,y);		
	ctx.closePath();
};
CanvasRenderingContext2D.prototype.Arrow = function(sX,sY,eX,eY,opt={}){
	let ctx = this;
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
CanvasRenderingContext2D.prototype.drawRect = function(obj,opt){
	let ctx = this;
	ctx.box(obj.x,obj.y,obj.w,obj.h,opt);
}

