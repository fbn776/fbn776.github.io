function createElm(type,obj){
	this.type = type;	
	this.obj = obj || {};	
	this.attr = this.obj.attr || {};	
	this.style = this.obj.style || {};
	this.text = this.obj.text || "";
	
	this.childs = this.obj.childs || [];
	
	this.elm = document.createElement(this.type);
	this.elm.setAttr(this.attr);
	this.elm.setStyle(this.style);
	this.elm.innerHTML = this.text;
	
	
	this.addChild = function(a,addToList){
		if(Array.isArray(a)){
			for(let i of a){
				this.addChild(i);
			}
		}else {
			if(a instanceof HTMLElement){
				this.elm.appendChild(a);
			}else {
				this.elm.appendChild(a.elm);
			}
			if(addToList){
				this.childs.push(a);
			}
		}
	};
	for(let a of this.childs){
		this.addChild(a,false);
	}
	this.addTo = function(par){
		par = par || document.body;
		par.appendChild(this.elm);
	};
};
function getCurrTime(date) {
  	var hours = date.getHours();
  	var minutes = date.getMinutes();
  	var ampm = hours >= 12 ? 'pm' : 'am';
  	hours = hours % 12;
  	hours = hours ? hours : 12; // the hour '0' should be '12'
  	minutes = minutes < 10 ? '0'+minutes : minutes;
  	var strTime = hours + ':' + minutes + ' ' + ampm;
	return strTime;
}
window.lastErrors = {
	main:{
		lastTime:0,
	},
	overflow:{
		lastTime:0,
	},
	underflow:{
		lastTime:0,
	},
	notInt:{
		lastTime:0,
	}
};
function showError(key,msg,t){
	let currTime = Date.now();
	let last = window.lastErrors;	
	key = key || "main";
	let dict = window.lastErrors[key];
	let lastTime = dict.lastTime;	
	let newMsg = document.getElementsByClassName("popup_box")
	if(newMsg.length > 0){
		newMsg = newMsg[newMsg.length-1];
		newMsg = newMsg.getElementsByTagName("msg")[0];
	}else {
		newMsg = {
			innerHTML:"-1",
		}
	};
	if((newMsg.innerHTML !== msg) || ((currTime - lastTime) > 6000)){
		new createMessage(msg,t);
		window.lastErrors[key].lastTime = Date.now();
	}
	
}
function toNum(x){
	return Number(x);
};
function isNaN(x){
	return Number.isNaN(x);
}
function isNum(x){
	x = toNum(x);
	return !isNaN(x);
}
function isInt(x){
	x = toNum(x);
	return Number.isInteger(x);
}
function toInt(x){
	return parseInt(x);
}
Object.prototype.update = function(obj){
	obj = obj || {};
	let objKeys = obj.getKeys();
	for(let a of obj.getKeys()){
		this[a] = obj[a];
	}
}