class Junk {
	constructor(ctx, opt) {
		this.ctx = ctx;
		this.opt = opt;
		this.x = opt.x;
		this.y = opt.y;
		this.pos = new Vector(this.x, this.y);
		this.vel = new Vector(0, opt.vel);
		this.size = opt.size;
		this.img = opt.sprite;
		this.rotate = opt.rotate || false;
		this.rotation = 0;
		this.rot_incr = round(random(-3,3),2);
		this.sizeRange = opt.sizeRange || [20,45];
		this.smoke = new SmokeParticles(this.ctx,{
			x:this.x,
			y:this.y,
			vel:{
				x:[-0.5,0.5],
				y:[-2,-0.5],
			},
			size:[1,7],
			maxAge:[10,60],
			useEffect:true,
			rotate_incr:random(0.1,2)
		});
		this.hitbox = {};
	}
	update() {
		this.pos = this.pos.add(this.vel);
		let chance = map_range(this.size,this.sizeRange[0],this.sizeRange[1],0,0.7)
		if(Math.random() < chance){
			let pX = random(this.pos.x-this.size,this.pos.x);
			let pY = random(this.pos.y-this.size,this.pos.y)
			this.smoke.add(pX,pY)
		}
		this.smoke.update();
		
		this.hitbox = {
			x:this.pos.x - this.size,
			y:this.pos.y - this.size,
			w:this.size,
			h:this.size,
		}
	}
	show() {
		this.ctx.beginPath();
		this.ctx.save()
			if(this.rotate){
				this.rotation += rad(this.rot_incr);
				this.ctx.translate(this.pos.x-(this.size/2),this.pos.y-(this.size/2))//,this.size,this.size
				this.ctx.rotate(this.rotation);
				
				this.ctx.drawImage(this.img.img,0,0,this.img.dim.w,this.img.dim.h,-this.size/2,-this.size/2, this.size, this.size);

			}else {
				this.ctx.drawImage(this.img.img,0,0,this.img.dim.w,this.img.dim.h,this.pos.x - (this.size / 2), this.pos.y - (this.size / 2), this.size, this.size);
			}
		this.ctx.restore()
		this.ctx.closePath();
	}
}


class Junks {
	constructor(ctx, opt) {
		this.ctx = ctx;
		this.opt = opt || {};

		this.junks_arr = [];
		
		this.time_range = opt.timeRange || [400,2000];
		this.time_interval = 0;
		
		this.curr_time = Date.now();
		this.last_time = Date.now();

		this.chance = opt.chance || 0.01;
		this.size = opt.size || [20,45];
		
		this.vel = opt.vel || 1;
		
		this.spaceAvil = false;
	}
	add() {
		this.curr_time = Date.now();
		if ((Math.random() < this.chance) && ((this.curr_time-this.last_time) > this.time_interval)) {
			this.spaceAvil = true;
			let size = Math.floor(random(this.size[0],this.size[1]));
			let xpos = Math.floor(random(size, sw - size));
			
			let sprite = asteroids.randomItem();
			
			let junk = new Junk(junks_canvas.ctx, {
				x:xpos,
				y:-size,
				vel:this.vel,
				size:size,
				sprite:sprite,
				rotate:true,
				sizeRange:this.size,
			});
			this.junks_arr.push(junk);
			
			//Update last time:
			this.last_time = Date.now();
			this.time_interval = random(this.time_range[0],this.time_range[1]);
		}else {
			this.spaceAvil = false
		}
	}
	
	show(){
		for(let i=0;i<this.junks_arr.length;i++){
			let curr = this.junks_arr[i];
			
			curr.update();
			curr.show();
		
			if(curr.pos.y - (curr.size/2) > sh){
				this.junks_arr.splice(i,1);
				i--;
			}
		}
	}
}