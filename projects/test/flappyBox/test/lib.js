function s(e){
	return document.querySelector(e)
}
function rad(x){
	return (Math.PI/180)*x;
}
function deg(x){
	return (180/Math.PI)*x;
}

function intersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    	return false
    }
    denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))
    if (denominator === 0) {
        return false
    }
    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
        return false
    }
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)
    return {x,y}
}
CanvasRenderingContext2D.prototype.line=function(x1,y1,x2,y2,color,width,dashed,dashArr){
	var ctx=this;
	ctx.beginPath();
		var c = color || "black";
		var w = width || 1;
		ctx.strokeStyle = c;
		ctx.lineWidth = w;
		if(dashed){
			ctx.setLineDash(dashArr || [5,2])
		}
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.stroke();
		ctx.setLineDash([0,0])
	ctx.closePath();
}
CanvasRenderingContext2D.prototype.circle = function(x,y,r,start,end,color,width,dashed,dashArr){
	var ctx=this;
	ctx.beginPath();
		var c = color || "black";
		var w = width || 1;
		ctx.strokeStyle = c;
		ctx.lineWidth = w;
		if(dashed){
			ctx.setLineDash(dashArr || [5,2])
		}
		ctx.arc(x,y,r,start,end);
		ctx.stroke();
		ctx.setLineDash([0,0])
	ctx.closePath();
}
CanvasRenderingContext2D.prototype.box = function(x,y,w,h,c,str){
	ctx.beginPath();
	if(str){
		ctx.strokeStyle = c || "black";
		ctx.rect(x,y,w,h);
		ctx.stroke();
	}else {
		ctx.fillStyle = c || "black";
		ctx.fillRect(x,y,w,h);
	}
	ctx.closePath();
}

function dist(xa,ya,xb,yb){return Math.sqrt(((xb-xa)**2)+((yb-ya)**2))};

function circleCords(R,r,X,Y,angle){
	x=(R-r)*Math.cos(rad(angle))+X;
	y=(R-r)*Math.sin(rad(angle))+Y;	
	var cords=new Object();
		cords.x=x;
		cords.y=y;	
	return cords;
}
function createRandomWalls(arr,n){
	for(let i=0;i<n;i++){
		var x1 = Math.floor(Math.random()*width);
		var y1 = Math.floor(Math.random()*height);
		var x2 = Math.floor(Math.random()*width);
		var y2 = Math.floor(Math.random()*height);	
		arr.push([x1,y1,x2,y2]);
	}
}
function section(x1,y1,x2,y2,m1,m2){
	return {
		x:((m1*x2)+(m2*x1))/(m2+m1),
		y:((+m1*y2)+(m2*y1))/(m2+m1),
	}
}
function css(x,y){
    return window.getComputedStyle(x).getPropertyValue(y);
}
function slope(x1,y1,x2,y2){
	var diffY = (y2-y1),
		diffX = (x2-x1);
	return deg(Math.atan2((diffY),(diffX)));
}
function isPositive(n){
	return ((Math.abs(n) + n) !== 0)
}
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};
function map_range(inMin, inMax, outMin, outMax) {
	return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};
Array.prototype.min = function() {
  return Math.min.apply(null, this);
};