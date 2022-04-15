function s(x){
    return document.querySelector(x)
}
function css(x,y){
    return window.getComputedStyle(x).getPropertyValue(y);
}
function small(x){
    return x.toLowerCase()
}
function big(x){
    return x.toUpperCase()
}
function jsonS(x){
	return JSON.stringify(x);
}
function jsonP(x){
	return JSON.parse(x);
};
function getCords(R,r,X,Y,angle){
	var x=(R-r)*Math.cos(rad(angle))+X;
	var y=(R-r)*Math.sin(rad(angle))+Y;	
	var cords=new Object();
		cords.x=x;
		cords.y=y;	
	return cords;
};
function rad(x){
    return (Math.PI/180)*x;
};
function deg(x){
    return (180/Math.PI)*x;
};
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
};
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
};
function dist(xa,ya,xb,yb){return Math.sqrt(((xb-xa)**2)+((yb-ya)**2))};
function slope(x1,y1,x2,y2){
	var diffY = (y2-y1),
		diffX = (x2-x1);
	return deg(Math.atan2((diffY),(diffX)));
};
function round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
};
function map_range(inMin, inMax, outMin, outMax) {
	return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
Object.prototype.getKeys = function(){
	return Object.getOwnPropertyNames(this);
};
Object.prototype.getValues = function(){
	let keys = this.getKeys();
	let arr = [];
	for(let n of keys){arr.push(this[n])};
	return arr;
};
Array.prototype.getRandom = function(){
	var n = Math.floor(Math.random()*this.length);
	return this[n];
}
function root(n){return Math.sqrt(n)};
function sin(n){return Math.sin(n)};
function cos(n){return Math.cos(n)};
function tan(n){return Math.tan(n)};
function cosec(n){return 1/sin(n)};
function sec(n){return 1/cos(n)};
function cot(n){return 1/tan(n)};
Array.prototype.max = function() {
	return Math.max.apply(null,this);
};
Array.prototype.min = function() {
	return Math.min.apply(null, this);
};
CanvasRenderingContext2D.prototype.circle = function(x,y,r,start,end,color,filled,stroked){
	var ctx=this;
	ctx.beginPath();
		var c = color || "black";
		var strk = stroked || "true";
		ctx.strokeStyle = c;
		ctx.arc(x,y,r,start,end);
		if(strk == "true"){
			ctx.stroke();
		}
		if(filled){
			ctx.fill();
			ctx.fillStyle = c;
		}
		ctx.setLineDash([0,0]);
	ctx.closePath();
}
function random(x,y){
	return x+Math.random()*(y-x);
}
function rgb(a){
	return `rgba(${Math.random()*255},${Math.random()*255},${Math.random()*255},${a || 1})`;
}
function winOp(win,stuff){
	if(win){
		if(stuff == "open"){
			win.style.visibility = "visible";
			win.style.opacity = 1;
			win.style.transform = 'translateY(0px) scale(1)';
		}else if(stuff == "close"){
			win.style.opacity = 0;
			win.style.transform = 'translateY(200px) scale(0.5)';
			setTimeout(()=>{
				win.style.visibility = "hidden";				
			},300);
		}
	}
}