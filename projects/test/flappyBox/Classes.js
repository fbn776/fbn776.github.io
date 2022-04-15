//Code by fbn776
//Images
const wall_img = new Image();
wall_img.src = "img/wall_tile.svg";
const player_face = new Image();
player_face.src = "img/player_face.svg";



class Player {
	constructor(startX,size,color){
		this.size = size;
		this.color = color;
		this.startPos = startX;
		this.pos = new Vector(this.startPos,cy);
		this.vel = new Vector(0,0);
	}	
	show(){
		this.vel = this.vel.add(g);
		this.vel = this.vel.limit(10);
		this.pos = this.pos.add(this.vel);
		ctx.drawImage(player_face,0,0,10,10,this.pos.x,this.pos.y,10,10);
	}
	
	applyUpForce() {
		this.vel = this.vel.add(new Vector(0,-15));
	}
}
class Walls {
	constructor(x,gapMin,gapMax) {
		this.x = x;
		this.wall_vel = -1;
		this.color = "green";
		this.height = random(20,canvas.height/2);
		this.width = 40;
		this.gap = random(gapMin,gapMax);
		this.vel = new Vector(this.wall_vel,0);
		this.pos = new Vector(this.x,0);
		this.passed = false;
		this.dim = {};
	}
	show(velo) {
		this.vel.x = velo;
		this.pos = this.pos.add(this.vel);
		this.x = this.pos.x;
		
		this.dim = {
			top:{
				x:this.x,
				y:0,
				width:this.width,
				height:this.height,
			},
			bottom:{
				x:this.x,
				y:this.height+this.gap,
				width:this.width,
				height:canvas.height-(this.height+this.gap),
			},
		};
		//Top bar
		for(let i=1;i<(this.dim.top.height/40)+1;i++){
			ctx.drawImage(wall_img,0,0,40,40,this.pos.x,this.dim.top.height-(40*i),40,40);
		}
		//Bottom bar
		for(let i=0;i<=Math.floor(this.dim.bottom.height/40)+1;i++){
			ctx.drawImage(wall_img,0,0,40,40,this.pos.x,this.dim.bottom.y+(40*i),40,40);		
		}
	}
}