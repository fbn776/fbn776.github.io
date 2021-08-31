const player_width = 60,
	player_height = 60;


//Area in the player canvas in which the player is active
const player_area = {
	x: 0,
	y: sh - 100 - player_height,
	w: sw,
	h: 100 + player_height,
}


class Player {
	constructor(ctx, opt) {
		this.opt = opt || {}
		this.x = this.opt.x;
		this.y = this.opt.y;
		this.pos = new Vector(this.x, this.y);
		this.vel = new Vector(0, 0);
		this.sizeX = player_width;
		this.sizeY = player_height;
		this.ctx = ctx;

		this.player_dir = 0;
		//Value controlling the X val of the velocity vector
		this.dispX = 1;
		this.craft = opt.craft;
		this.exhaustArr = [];
		this.hitbox = [];

		this.maxRotAngle = 4;
		this.rot_val = 0;
		this.lastDir = 0;
		this.i = 0;
		this.i_lim = 20;
	}
	initDesign() {
		this.img = this.craft.img;


		this.i_lim = this.craft.rot_time || 20;
		this.maxRotAngle = this.craft.max_rot || 4;
		//Code for creating particles for exhaust
		for (let a of this.craft.exhaust) {
			let p = new FireParticles(this.ctx, {
				x: this.x + a.x,
				y: this.y + a.y,
				size: [6, 13],
				useEffect: true,
				maxAge: [10, 30],
				vel: {
					x: [-0.1, 0.1],
					y: [1, 3],
				},
				ogPos: { x: a.x, y: a.y },
			})
			this.exhaustArr.push(p);
		};

		for (let curr of this.craft.hitbox) {
			let currX = this.pos.x - (this.sizeX / 2);
			let currY = this.pos.y - (this.sizeY / 2);
			let hitbox = {
				x: currX + curr.x,
				y: currY + curr.y,
				w: curr.w,
				h: curr.h,
			}
			this.hitbox.push(hitbox);
		}
	}

	setDir(player_dir) {
		this.lastDir = this.player_dir;
		this.player_dir = player_dir;
		this.vel.x = player_dir * this.dispX;
		this.i = 0;
		this.rot_val = this.player_dir * this.maxRotAngle;
	}

	update() {
		//Handles collision with the walls:
		if (this.pos.x - (this.sizeX / 2) < 0 || this.pos.x + (this.sizeX / 2) > sw) {
			this.pos.x = this.pos.x + (this.sizeX / 2) > sw ? sw - (this.sizeX / 2) : this.sizeX / 2;
			this.setDir(0);
		};
		this.pos = this.pos.add(this.vel);

		//Code for setting the hitbox:
		let currIndex = 0;
		for (let a of this.hitbox) {
			let ref = this.craft.hitbox[currIndex]
			let currX = this.pos.x - (this.sizeX / 2);
			let currY = this.pos.y - (this.sizeY / 2);
			let hitbox = {
				x: currX + ref["x"],
				y: currY + ref["y"],
				w: a.w,
				h: a.h,
			}
			this.hitbox[currIndex] = hitbox;
			currIndex ++;
		}
	}
	show() {
		//Code to revert the rotation of thr craft
		if (this.rot_val) {
			this.i++;
			if (this.i >= this.i_lim) {
				this.rot_val = 0;
				this.i = 0;
			}
		};

		this.ctx.save();
		this.ctx.translate(this.pos.x, this.pos.y);
		this.ctx.rotate(rad(this.rot_val))

		for (let a of this.exhaustArr) {
			a.add(a.opt.ogPos.x, a.opt.ogPos.y);
			a.update();
		};
		this.ctx.drawImage(this.img, 0, 0, this.craft.dim.w, this.craft.dim.h, -this.sizeX / 2, -this.sizeY / 2, this.sizeX, this.sizeY);
		this.ctx.restore();

	}
}