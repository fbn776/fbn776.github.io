
class Arrow {
	constructor(x1,y1,x2,y2,c){
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;		
		this.ctx = c;
		this.size = 10;
		this.color = "black";
	}
	show(){
		let context = this.ctx || ctx;
		let size = this.size;
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
class Particle {
	constructor(obj){
		this.x = obj.x;
		this.y = obj.y;
		this.pos = new Vector(this.x,this.y);
		this.vel = obj.vel || new Vector(0,0);
		this.acc = obj.acc || new Vector(0,0);
		this.mass = obj.mass || 2;
		this.size = obj.size || obj.mass*10;
		this.limitVel = obj.limitVel || false;
		this.fixed = obj.fixed || false;
		this.energy_lost = obj.energy_lost || 1;
		this.charge = obj.charge || 0;
		//Style:
		this.color = this.charge < 0?"blue":"green";
	}
	applyForce(f){
		if(!this.fixed){
		    this.vel = this.vel.mult(this.energy_lost);
			f = f.div(this.mass);
			this.acc = this.acc.add(f);
		}
	}
	update(){
		if(!this.fixed){
			this.vel = this.vel.add(this.acc);
			if(this.limitVel){
				this.vel = this.vel.limit(this.limitVel);
			}
			this.pos = this.pos.add(this.vel);
			this.acc = this.acc.mult(0);
			
		}else {
			this.vel = this.vel.mult(0);
		}
	}
	show(){
		ctx.beginPath();
			ctx.fillStyle = this.color;
			ctx.arc(this.pos.x,this.pos.y,this.size,0,2*Math.PI);
			ctx.fill();
		ctx.closePath();
	}
}