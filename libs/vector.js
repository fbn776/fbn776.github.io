function Vector(x,y){
	this.x = x || 0;
	this.y = y || 0;	
	//Operators:
	this.add = function(v){		
		return new Vector(this.x+v.x,this.y+v.y);
	};
	this.sub = function(v){
		return new Vector(this.x-v.x,this.y-v.y);
	};
	this.mult = function(v){
		if(v instanceof Vector){
			return new Vector(this.x*v.x,this.y*v.y);
		}else {
			return new Vector(this.x*v,this.y*v);
		}
	};
	this.div = function(v){
		if(v instanceof Vector){
			return new Vector(this.x/v.x,this.y/v.y);
		}else {
			return new Vector(this.x/v,this.y/v);
		}
	};
	this.dot = function(v) {
		return this.x * v.x + this.y * v.y;
	};
	//Properties:
	this.magSq = function(){
		return	(this.x**2) + (this.y**2);
	};
	this.mag = function(){
		return Math.sqrt(this.magSq());
	};
	this.heading = function(){
		return Math.atan2(this.y,this.x);
	};
	this.dir = this.heading;
	//Controls
	this.unit = function() {
		return this.div(this.mag());
	};
	this.normalize = function(){
		return this.unit();
	}
	this.setMag = function(m){
		return this.unit().mult(m);
	};
	this.invert = function(){
		return new Vector(-this.x,-this.y);
	};
	this.limit = function(lim){
		var a = this;
		if(this.mag() >= lim){
			a = this.setMag(lim);
		}
		return a;
	};
	this.set = function(x,y){
		x = x || this.x || 0;
		y = y || this.y || 0;
		this.x = x;
		this.y = y;
	};
	this.setHeading = function(a){
		let m = this.mag();
		this.x = m*Math.cos(a);
		this.y = m*Math.sin(a);
		return this;
	};
	this.rotate = function(a){
		let newHeading = this.heading() + a,
			mag = this.mag();		
		return new Vector(Math.cos(newHeading) * mag,Math.sin(newHeading) * mag);
	};
	this.lerp = function(x,y,amt){
		if (x instanceof p5.Vectortor) {
			return this.lerp(x.x, x.y, x.z, y);
		}
		var x = this.x + (x - this.x) * amt || 0;
		var y = this.y + (y - this.y) * amt || 0;
		return new Vector(x,y);
	}
	//Utils
	this.equal = function(v){
		return this.x == v.x && this.y == v.y;
	};
	this.toStr = function() {
		return `[${this.x},${this.y}]`;
	};
	this.copy = function(v){
		return new Vector(v.x,v.y);
	};
}
function vectorFromAngle(angle,length){
  	if(typeof length === 'undefined') {
    	length = 1;
 	}
  	return new Vector(length*Math.cos(angle),length*Math.sin(angle));
};
function randomVector(len){
	return vectorFromAngle(rad(Math.random()*360),len || 1);
}