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
		this.dispX = opt.dispX || 2;
		this.craft = opt.craft;
		this.exhaustArr = [];
		this.hitbox = [];
		this.mainHitbox = {};

		this.maxRotAngle = 1;
		this.rot_val = 0;
		this.lastDir = 0;
		this.i = 0;
		this.i_lim = 20;

		//endgame stuffs:
		this.hasCollision = false;
		this.pauseCtrlVar = false;
		this.explosionClass = opt.explosionClass;
		this.shockWave;
		this.incr = 0;
		this.expTime = 150;
		this.overrideRot = false;
		this.gameEnd = false;

		//Bullet:
		this.hasGun = true;
		this.bulletArr = [];
		this.gunTipPos = [];
		this.ogGunPos;
		this.firingTimeDelay = 50;
		this.lastFiredTime = 0;

		//Max ammo count:
		this.maxAmmo = 0;
		this.bulletCount = this.maxAmmo;

		//Bullet Damage(out of 100):
		this.bulletDamge;
		this.healthBarH = 6;
		this.shield = 0;
	}
	pauseCtrl() {
		this.pauseCtrlVar = true;
		this.rot_val = 0;
		this.vel.x = 0;
		this.exhaustArr = [];
		this.overrideRot = true;
	}
	//Single call function
	explodeStart() {
		this.shockWave = new ShockWave(junks_canvas.ctx, {
			x: this.pos.x,
			y: this.pos.y,
			num: 4,
			interval: 3,
			count: 120,
		});
		this.vel = new Vector(random(-1, 1), 1);
		this.health = 0;
	}
	//Animiation loop
	explode() {
		if (this.shockWave) {
			if (this.incr <= this.expTime) {
				let mapped = 1 - map_range(this.incr, 0, this.expTime, 0, 1);
				this.shockWave.show();
				for (let i = 0; i < random(0, 20 * mapped); i++) {
					let dx = Math.floor(random(-this.sizeX / 4, this.sizeX / 4));
					let dy = Math.floor(random(-this.sizeY / 4, this.sizeY / 4));
					this.explosionClass.add(this.pos.x + dx, this.pos.y + dy);
				}
				this.incr++;
			}
			this.explosionClass.update();
		}
	}

	initDesign() {
		this.img = this.craft.img;
		this.i_lim = this.craft.rot_time || 20;
		this.maxRotAngle = this.craft.max_rot || 4;
		if (this.craft.noGun) {
			this.hasGun = false;
		} else {
			this.hasGun = true;
		}
		if (this.hasGun) {
			this.bulletDamage = this.craft.bulletDamage || 20;
			for (let gunPos of this.craft.guns) {
				this.gunTipPos.push({
					x: this.pos.x - (this.sizeX / 2) + gunPos.x,
					y: this.pos.y - (this.sizeY / 2) + gunPos.y,
				})
			};
			this.ogGunPos = this.craft.guns;
			this.maxAmmo = this.craft.maxAmmo;
			this.bulletCount = this.maxAmmo;
		}
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

			//Set the Y pos of player:
			this.posY1 = this.pos.y - this.sizeY / 2;
			this.posY2 = this.pos.y + this.sizeY / 2;

			//Main hitbox:
			this.mainHitbox = {
				x: this.pos.x - (this.sizeX / 2),
				y: this.pos.y - (this.sizeY / 2),
				w: this.sizeX,
				h: this.sizeY
			};
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
		};

		this.health = this.craft.health;
		this.damgeResistance = this.craft.damgeResistance;
		this.shield = this.craft.shield || 0;
	}

	setDir(player_dir) {
		if (!this.pauseCtrlVar) {
			this.lastDir = this.player_dir;
			this.player_dir = player_dir;
			this.vel.x = player_dir * this.dispX;
			this.i = 0;
			this.rot_val = this.player_dir * this.maxRotAngle;
		}
	}
	//Bullet shooter function:
	fireBullet() {
		if (this.hasGun) {
			let currTime = Date.now();
			if (this.bulletCount > 0 && currTime - this.lastFiredTime > this.firingTimeDelay) {
				for (let a of this.gunTipPos) {
					let bullet = new Bullet(junks_canvas.ctx, {
						startX: a.x,
						startY: a.y,
						dir: new Vector(0, -1),
						color: this.craft.bulletColor,
					});
					this.bulletArr.push(bullet);
					this.bulletCount--;
				};
				this.lastFiredTime = Date.now();
			}
		}
	};

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
			currIndex++;
		};

		if (this.pauseCtrlVar) {
			if (this.pos.y - (this.sizeY / 2) > sh) {
				this.gameEnd = true;
			}
		};

		if (this.hasGun) {
			//Bullet Updating code:
			for (let i = 0; i < this.bulletArr.length; i++) {
				let currBullet = this.bulletArr[i];
				if (currBullet.pos.y < 0) {
					this.bulletArr.splice(i, 1);
					continue;
				}
				currBullet.showAndUpdate();
			}
			for (let p = 0; p < this.gunTipPos.length; p++) {
				this.gunTipPos[p].x = this.pos.x - (this.sizeX / 2) + this.ogGunPos[p].x;
				this.gunTipPos[p].y = this.pos.y - (this.sizeY / 2) + this.ogGunPos[p].y;
			}
		};

		//Main hitbox updater
		this.mainHitbox = {
			x: this.pos.x - (this.sizeX / 2),
			y: this.pos.y - (this.sizeY / 2),
			w: this.sizeX,
			h: this.sizeY
		}

		if (this.health < 0) {
			this.health = 0
		}
	}
	show() {
		//Code to revert the rotation of thr craft
		if (this.rot_val && !this.overrideRot) {
			this.i++;
			if (this.i >= this.i_lim) {
				this.rot_val = 0;
				this.i = 0;
			}
		};

		this.ctx.save();
		this.ctx.translate(this.pos.x, this.pos.y);
		this.ctx.rotate(rad(this.rot_val));

		for (let a of this.exhaustArr) {
			a.add(a.opt.ogPos.x, a.opt.ogPos.y);
			a.update();
		};
		this.ctx.drawImage(this.img, 0, 0, this.craft.dim.w, this.craft.dim.h, -this.sizeX / 2, -this.sizeY / 2, this.sizeX, this.sizeY);
		this.ctx.restore();
	}

	rotateCraft(v) {
		this.rot_val = v;
	}
}