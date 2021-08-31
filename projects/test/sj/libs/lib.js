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
function createMessage(txt,type){
	let maxTime = 6000;
	type = type || 0;
	let types = [
		//[border,bg,color]
		//0 is alert type
		["#E53935","#ea7b7b","white"],
		//1 is info
		["#2979FF","#64B5F6","white"],
		//2 is warning (notes)
		["#FF9100","#FFCC80","white"],
		//3 is success
		["#4CAF50","#81C784","white"],
		//4 is default
		["#424242","#9e9e9e","white"],
	];
	let seq = types[type] || types[0];	
	//Max number of boxes
	let MAX = 10;
	//List of all boxes
	let elms = document.getElementsByClassName("popup_box");	
	this.open = function(elm){
		elm.setStyle({
			transform:"translate(0px)",
			opacity:1,
		});
		let total = elms.length;
		for(let i=elms.length-1;i>=0;i--){
			let transX = (total-1) - i;
			let curr = elms[i];
			curr.style.transform = `translateY(${transX*5}px)`;
		}		
	}
	this.close = function(elm){
		elm.style.transform += "translateX(100px)";
		elm.setStyle({opacity:0});
		elm.setAttr({state:0});
		let boxes = document.getElementsByClassName("popup_box");
		let total = boxes.length - 1;
		for(let i=boxes.length-1;i>=0;i--){
			let a = boxes[i];
			let state = a.getAttribute("state")
			if(state == 0){continue}
			else {
				let transX = (total-1) - i;
				if(transX <= 0){transX = 0};
				let curr = elms[i];
				curr.style.transform = `translateY(${transX*5}px)`;
			}
		}
		setTimeout(()=>{
			elm.remove();
		},300);
	}	
	let ref = this;	
	if(elms.length >= MAX){
		this.close(elms[0]);
	}
	if(elms.length <= MAX){
		var main = document.createElement("div");
		main.setAttr({
			class:"popup_box",
		});			
		main.setStyle({
			borderColor:seq[0],
			backgroundColor:seq[1],
			color:seq[2],
		});
		var msg = document.createElement("msg");
		msg.innerHTML = txt;
		var close = document.createElement("closeIc");
		close.innerHTML = "&times;";
		close.setStyle({
			backgroundColor:seq[0]
		});
		main.appendChild(msg)
		main.appendChild(close);		
		close.onclick = function(){
			ref.close(main);
		}		
		document.body.appendChild(main);
		setTimeout(()=>{
			this.open(main);
		},10);		
		setTimeout(()=>{
			this.close(main);
		},maxTime);
	}
}
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
function random(x,y){
	return x+Math.random()*(y-x);
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