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
function fullscreen(el){
	if(el.webkitRequestFullScreen) {
		el.webkitRequestFullScreen();
	}
	else {
		el.mozRequestFullScreen();
	}            
}
const canvas = s("#canvas");
const ctx = canvas.getContext("2d");
var width = window.innerWidth;
var height = window.innerHeight;
canvas.width = width;
canvas.height = height;


var angle = 0;
var debug = false;


//Control panel
const ctrl = s(".ctrl_panel");
var ctrl_toggle = s(".ctrl_toggle");
ctrl.style.transform = `translateY(${css(ctrl,"height")})`;
//Display the value of the input;
var inputs = document.getElementsByTagName("input");
for(let i=0;i<inputs.length;i++){
	let prev = inputs[i].previousElementSibling;
	prev = prev.previousElementSibling;
	inputs[i].addEventListener('input',function(){
		let val = inputs[i].value;
		if(this.type === "checkbox"){
			val = this.checked;
		}
		prev.innerHTML = val;
	});
}
//Control on off state
var ctrl_n = 0;
ctrl_toggle.onclick = function(){
	let h = css(ctrl,"height");
	if(ctrl_n % 2 == 1){
		ctrl.style.transform = `translateY(${h})`;
	}else {
		ctrl.style.transform = `translateY(0px)`;	
	}
	return ctrl_n = ctrl_n + 1;
}
class Walls {
	constructor(arr,color){
		this.arr = arr;
		this.color = color;
	}
	updateWalls(a){
		this.arr = a;
	}
	wallArr(){
		return this.arr;
	}
	show(ogX,ogY){
		let arr = this.arr;
		var arrays = [];
		for(let i of arr){
			let x1 = i[0],
				y1 = i[1],
				x2 = i[2],
				y2 = i[3];
			ctx.beginPath();
				ctx.line(x1,y1,x2,y2,this.color,2);
			ctx.closePath();
			arrays.push({
				x1:x1,
				y1:y1,
				x2:x2,
				y2:y2,
			});
		}
		this.obj = arrays;
	}
	cords(){
		return this.obj
	}
}

class Rays {
	constructor(x,y,fov,n,walls,angle){
		this.x = x;
		this.y = y;
		this.d = Math.sqrt((canvas.width**2)+(canvas.height**2));
		this.fov = fov;
		this.n = n;
		this.angle = angle;
	}
	updatePos(x,y){
		this.x = x;
		this.y = y;
	}
	updateAngle(a){
		this.angle = a;
	}
	updateFov(a){
		this.fov = a;
	}
	updateN(a){
		this.n = a;
	}
	show(walls){
		var len = this.d;
		var fov = this.fov;
		var nOfRays = fov/this.n;
		var angle = this.angle;
		for(let i=-fov/2;i<fov/2;i+=nOfRays){
			var cords = circleCords(len,0,this.x,this.y,angle+i);
			var x2 = cords.x,
				y2 = cords.y;
			var crds = [];
			for(let j=0;j<walls.length;j++){
				let curr = walls[j];
				let point = intersect(this.x,this.y,cords.x,cords.y,curr.x1,curr.y1,curr.x2,curr.y2);
				var xOg = this.x,
					yOg = this.y;
				if(point){
					crds.push({
						xI:point.x,
						yI:point.y,
						d:dist(xOg,yOg,point.x,point.y),
					});
				}
			}
			crds.sort((a,b) => {
				return a.d - b.d;
			});
			if(crds.length != 0){
				x2 = crds[0].xI;
				y2 = crds[0].yI;
				if(debug){
					ctx.box(x2-2.5,y2-2.5,5,5,"blue");				
				}
			}
			ctx.line(this.x,this.y,x2,y2,"rgba(255,255,255,0.5)");
		}
	}
}
var walls_array = wall_array;

var walls = new Walls(walls_array,"green");
var rays = new Rays(width/2,height/2,45,80,angle);

//Controls main
s("#fov").addEventListener('input',function(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	rays.updateFov(this.value);
	walls.show(rays.x,rays.y);
	rays.show(walls.cords());
});
s("#n").addEventListener('input',function(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	rays.updateN(this.value);
	walls.show(rays.x,rays.y);
	rays.show(walls.cords());
});
s("#debugCtrl").addEventListener('input',function(){
	return debug = this.checked;
});
canvas.addEventListener('touchmove',innit);
function innit(e){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	
	//To get the slope of the line from orgin to touch.
	let x1 = rays.x;
		y1 = rays.y;
	let x2 = e.touches[0].clientX,
		y2 = e.touches[0].clientY;
	let diffY = y2 - y1,
		diffX = x2 - x1;
	var angle = deg(Math.atan2((diffY), (diffX)))
	
	rays.updateAngle(angle);
	walls.show(rays.x,rays.y);
	rays.show(walls.cords());
	
	//Orgin box
	ctx.box(rays.x-2.5,rays.y-2.5,5,5,"red");	
	
	//Movement (Second touch)
	if(e.touches.length > 1){
		let xP = e.touches[1].clientX,
			yP = e.touches[1].clientY;
		rays.updatePos(xP,yP);
	}
	
	//If debug is true, then show these
	if(debug){
		ctx.box(x2-2.5,y2-2.5,5,5,"orange");
		ctx.line(x1,y1,x2,y2,"#00BCD4",2,true);
		ctx.line(x1,y1,x2,y1,"#009688",2,true);
		ctx.line(x2,y1,x2,y2,"#FFB300",2,true);
		ctx.circle(x1,y1,dist(x1,y1,x2,y2),0,Math.PI*2,"#FFEE58",2,true);
	}
};
