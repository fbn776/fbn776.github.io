
//Main particles class
class Particle {
	constructor(ctx,opt){
		this.ctx = ctx;
		this.x = opt.x;
		this.y = opt.y;
		this.pos = new Vector(this.x,this.y);
		this.vel = opt.vel || new Vector(0,0);
		this.acc = opt.acc || new Vector(0,0);
		this.color = opt.color;
		this.size = opt.size || 4;
		this.age = 0;
		this.life_span = opt.maxAge || 150;
		this.dead = false;
		this.rotate = opt.rotate || false;
		this.rotate_count = 0;
		this.rotate_incr = opt.rotate_incr || 1;
		this.alpha = this.color[3] || 1;
		this.type = Math.random() < 0.5;
	}
	update(){
		if(!this.dead){
			this.age ++;
			if(this.age >= this.life_span*(3/4)){
				this.alpha -= 1/(this.life_span*(3/4));
				if(this.size >= 0){
					this.size -= 0.5;
					if(this.size <= 0){
						this.size = 0;
					}
				}
				if(this.age >= this.life_span){
					this.dead = true;
				}
			}
			if(this.pos.y > this.ctx.canvas.height){
				this.dead = true;
				return false;
			}
			this.vel = this.vel.add(this.acc);
			this.pos = this.pos.add(this.vel);
			this.rotate_count += this.rotate_incr;
		}
	}
	show(){
		if(this.type){
			if(this.rotate){
				this.ctx.save();
				this.ctx.translate(this.pos.x,this.pos.y);
				this.ctx.rotate(this.rotate_count);
					this.ctx.beginPath();
						this.ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.alpha})`;
						this.ctx.fillRect(-(this.size/2),-(this.size/2),this.size,this.size);
					this.ctx.closePath();
				this.ctx.restore();
			}else {
				this.ctx.beginPath();
					this.ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.alpha})`;
					this.ctx.fillRect(this.pos.x-(this.size/2),this.pos.y-(this.size/2),this.size,this.size);
				this.ctx.closePath();
			}
		}else {
			this.ctx.beginPath();
				this.ctx.fillStyle = `rgba(${this.color[0]},${this.color[1]},${this.color[2]},${this.alpha})`;
				this.ctx.arc(this.pos.x,this.pos.y,this.size/2,0,two_pi);
				this.ctx.fill();
			this.ctx.closePath();
		}
	}
};

class Particles {
	constructor(ctx,opt){
		this.opt = opt;
		this.arr = [];
		this.ctx = ctx;
		this.x = opt.x;
		this.y = opt.y;
		this.pos = new Vector(this.x,this.y);
		this.colors = [
			[255,0,0,1],
			[0,255,0,1],
			[0,0,255,1]
		];
		this.rotate_incr = opt.rotate_incr || 1;
		//Format: [min,max]
		this.size = opt.size || [3,7];
		//Format: [min,max]
		this.maxAge = opt.maxAge || [30,80];
		//Format: {x:[min,max],y:[min,max]}
		this.vel = opt.vel || {x:[-0.5,0.5],y:[0.8,4]};
		this.useEffect = opt.useEffect;
	}
	
	add(x=this.pos.x,y=this.pos.y){
		let currColor = this.colors.randomItem();
//		currColor[3] = random(0.4,0.8);
		
		var vel = new Vector(random(this.vel.x[0],this.vel.x[1]),random(this.vel.y[0],this.vel.y[1]));
		var p = new Particle(this.ctx,{
			x:x,
			y:y,
			vel:vel,
			size:random(this.size[0],this.size[1]),
			maxAge:random(this.maxAge[0],this.maxAge[1]),
			color:currColor,
			rotate:true,
			rotate_incr:this.rotate_incr,
		});
		
		this.arr.push(p)
	}
	update(){
		let ctx = this.ctx;
		for(let i=0;i<this.arr.length;i++){
			let curr = this.arr[i];
			curr.update();
			ctx.beginPath();
				ctx.globalCompositeOperation = this.useEffect?"lighter":"source-over";
				curr.show();
			ctx.closePath();
			ctx.globalCompositeOperation = "source-over";
			//Remove the dead particles
			if(curr.dead || curr.pos.y >= sh){
				this.arr.splice(0,1);
				i--;
			}
		}
	}
}

//Particle class for fire 
class FireParticles extends Particles {
	constructor(ctx, opt) {
		super(ctx, opt);
		this.colors = [
			[253,207,88,1],
			[117,118,118,1],
			[242,125,12,1],
			[128,9,9,1],
			[240,127,19,1],
			[255,214,0,1],
			[245,127,23,1],
			[183,28,28,1],
			[198,40,40,1],
			[229,57,53,1],
			[191,54,12,1],
			[255,112,67,1],
			[230,74,25,1],
			[230,81,0,1],
			[255,145,0,1],
		];
	}
};
//Particles class for smoke
class SmokeParticles extends Particles {
	constructor(ctx,opt){
		super(ctx,opt);
		this.colors = [
			[73,68,68,1],
			[114,111,111,1],
			[139,137,137,1],
			[187,187,187,1],
			[170,170,170,1],
		];
	}
}