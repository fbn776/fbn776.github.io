class Background {
	constructor(){
		this.arr = [];
	};
	setup(w,h){
		let xoff = 10,
			yoff = 40;
		for(let i=0;i<h;i+=xoff){		
			for(let j=0;j<w;j+=yoff){
				xoff = random(10,40);
				if(Math.random() < 0.05){
					let alpha = random(0.1,1);
					this.arr.push({x:j,y:i,
						color:`rgba(255,255,255,${alpha})`,
						size:alpha*4,
					});
				}
			}			
		}
	};
	draw(){
		for(let a of this.arr){
			ctx.circle(a.x,a.y,a.size,{
				bg:a.color,
				color:a.color,
			});
		}
	}
}
class Bullet {
	constructor(x,y,angle,mag){
		this.x = x;
		this.y = y;
		this.angle = angle;
		this.mag = mag;
		this.size = 4;
		this.pos = new Vector(this.x,this.y);
		this.vel = vectorFromAngle(angle,this.mag)
	}
	update(){
		this.pos = this.pos.add(this.vel);
	}
	draw(){
		ctx.circle(this.pos.x,this.pos.y,this.size,{
			bg:"green",
		});
	}
}

class Player {
	constructor(){
		this.x = cx;
		this.y = cy;
		this.size = 20;
		this.pos = new Vector(this.x,this.y);
		this.gunDir = 0;
	}
	draw(){
		ctx.circle(this.pos.x,this.pos.y,this.size,{
			bg:"red",
		});
	}
	gun(){
		ctx.save();
			ctx.translate(this.pos.x,this.pos.y);
			let theta = this.gunDir;
			let offDist = 4;
			let d = this.size+(this.size/10);
			
			
			let xOff1 = offDist*Math.cos(theta+(Math.PI/2)),
				yOff1 = offDist*Math.sin(theta+(Math.PI/2));
			let xOff2 = offDist*Math.cos(theta+(Math.PI+Math.PI/2)),
				yOff2 = offDist*Math.sin(theta+(Math.PI+Math.PI/2));
				
			let xp1= xOff1+(d*Math.cos(theta)),
				yp1 = yOff1+(d*Math.sin(theta));
			let xp2 = xOff2+(d*Math.cos(theta)),
				yp2 = yOff2+(d*Math.sin(theta));
			ctx.beginPath();
				ctx.fillStyle = 'green';
				ctx.strokeStyle = 'white';
				ctx.moveTo(xOff1,yOff1);
				ctx.lineTo(xOff2,yOff2);
				ctx.lineTo(xp2,yp2);
				ctx.lineTo(xp1,yp1);
				ctx.lineTo(xOff1,yOff1);
				ctx.fill();
				ctx.stroke();
			ctx.closePath();
		ctx.restore();
		
	}
}



class Enemy {
	constructor(x,y,opt){
		this.x = x;
		this.y = y;
		this.pos = new Vector(x,y);
		this.player = opt.p;
		this.size = opt.size;
		this.dir_vec = this.player.pos.sub(this.pos);
		this.dir_vec = this.dir_vec.unit();
		this.color = `hsl(${opt.color}, 100%, 50%)`
	}
	update(){
		this.pos = this.pos.add(this.dir_vec);
	}
	show(){
		ctx.circle(this.pos.x,this.pos.y,this.size,{
			bg:this.color,
		});
	}
}


class Particle {
	constructor(opt){
		this.x = opt.x;
		this.y = opt.y;
		this.pos = new Vector(this.x,this.y);
		this.vel = opt.vel;
		this.size = opt.size || 4;
		this.og_span = opt.life_span;
		this.life_span = opt.life_span || 50;
		this.dead = false;
		this.alpha = 1;
		this.color = opt.color;
		this.r = this.color[0];
		this.g = this.color[1];
		this.b = this.color[2];
		this.color = `rgba(${this.r},${this.g},${this.b},${this.alpha})`;
	}
	update(){
		this.pos = this.pos.add(this.vel);
		if(this.life_span < 1){
			this.dead = true;
		}else{
			this.life_span--;
			if(this.alpha > 0){
				this.alpha -= 1/this.life_span;
			}
		}
		this.color = `rgba(${this.r},${this.g},${this.b},${this.alpha})`;
	}
	show(){
		ctx.beginPath();
		ctx.circle(this.pos.x,this.pos.y,this.size,{
			color:this.color,
			bg:this.color,
		});
		ctx.closePath();
	}
}


class Explosion {
	constructor(opt){
		this.x = opt.x;
		this.y = opt.y;
		this.arr = [];
		this.colors = [
			[255, 168, 102],
			[255, 255, 113],
			[253,207,88],
			[117,118,118],
			[242,125,12],
			[128,9,9],
			[240,127,19],
		];
		this.size_range = opt.size_range || [1,4];
		this.p_life = opt.p_life || 30;
		this.life = opt.life || 50;
		this.dead = false;
	}
	update(){
		if(this.life < 1){
			//this.dead = true;
			this.arr.splice(this.arr.length-1,1);
			if(this.arr.length == 0){
				this.dead = true;
			}
		}else {
			this.life--;
			for(let i=0;i<5;i++){
				let color = this.colors.randomItem();
				this.arr.push(new Particle({
					x:this.x,
					y:this.y,
					vel:vectorFromAngle(random(0,twoPi),random(1,3)),
					size:random(this.size_range[0],this.size_range[1]),
					color:color,
					life_span:this.p_life,
				}));
			}
		}
		for(let i=0;i<this.arr.length;i++){
			let curr = this.arr[i];			
			curr.update();
			curr.show();
			if(curr.dead){
				this.arr.splice(i,1);
			}
		}
	}
}
