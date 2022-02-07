function Img(src){
	let img = new Image();
	img.src = src;
	return img;
}

//HTML elements functions
function Log(elm){
	this.elm = elm;
	this.log = function(txt){
		this.elm.innerHTML = txt;
	}
}
function s(x){
    return document.querySelector(x)
};
function css(x,y){
    return window.getComputedStyle(x).getPropertyValue(y);
};
HTMLElement.prototype.setProps = function(obj){
	if(obj){
		let keys = obj.getKeys();
		for(let i of keys){
			this[i] = obj[i];
		}
	}
};
HTMLElement.prototype.setStyle = function(obj){
	if(obj){
		let keys = obj.getKeys();
		for(let i of keys){
			this.style[i] = obj[i];
		}
	}
};
HTMLElement.prototype.setAttr = function(obj){
	if(obj){
		let keys = obj.getKeys();
		for(let i of keys){
			this.setAttribute(i,obj[i]);
		}
	}
};
function createElm(type,obj){
	if(type){
		let elm = document.createElement(type);
		if(obj.attribute){
			elm.setAttr(obj.attribute);
		};
		if(obj.property){
			elm.setProps(obj.property);
		};
		if(obj.style){
			elm.setStyle(obj.style);
		}
		return elm;
	}
};
//Strings functions
function small(x){
    return x.toLowerCase()
};
function big(x){
    return x.toUpperCase()
};
function jsonS(x){
	return JSON.stringify(x);
};
function jsonP(x){
	return JSON.parse(x);
};


//Maths functions
function circleCord(h,k,r,angle){
	return {
		x:(r*Math.cos(angle))+h,
		y:(r*Math.sin(angle))+k,
	};
}
function rad(x){
    return (Math.PI/180)*x;
};
function deg(x){
    return (180/Math.PI)*x;
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
function map_range(x,inMin, inMax, outMin, outMax) {
	return (x - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
};
function root(n){return Math.sqrt(n)};
function sin(n){return Math.sin(n)};
function cos(n){return Math.cos(n)};
function tan(n){return Math.tan(n)};
function cosec(n){return 1/sin(n)};
function sec(n){return 1/cos(n)};
function cot(n){return 1/tan(n)};

function random(x,y,round=false){
	let r = round?Math.floor(Math.random()):Math.random();
	return x+r*(y-x);
}

//Objects and array functions
Object.prototype.getKeys = function(){
	return Object.getOwnPropertyNames(this);
};
Object.prototype.getValues = function(){
	let keys = this.getKeys();
	let arr = [];
	for(let n of keys){arr.push(this[n])};
	return arr;
};
Array.prototype.max = function() {
	return Math.max.apply(null,this);
};
Array.prototype.min = function() {
	return Math.min.apply(null, this);
};
Array.prototype.randomItem = function(){
	return this[Math.floor(Math.random()*this.length)];
};
Object.prototype.randomItem = function(){
	let keys = this.getValues();
	return keys.randomItem();
};
