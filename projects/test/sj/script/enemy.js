class Enemy {
	constructor(ctx, opt) {
		this.opt = opt || {}
		this.x = this.opt.x;
		this.y = this.opt.y;
		this.pos = new Vector(this.x, this.y);
		this.vel = opt.vel || new Vector(0, 1);
		this.sizeX = opt.size;
		this.sizeY = opt.size;
		this.ctx = ctx;

		this.craft = opt.craft;
		this.exhaustArr = [];
		this.hitbox = [];

		this.end = false;
		this.endOnce = false;
		this.skipThis = false;
		this.explosionClass = new ExplosionParticles(junks_canvas.ctx, {
			x: this.x,
			y: this.y,
			//	maxAge:[1,35],
			vel: {
				x: [-2, 2],
				y: [-2, 2],
			},
			useEffect: true,
		});
		this.rot_incr = 0;

		//Health:
		this.health = 100;
		this.healthBarH = 6;

		//Front View:
		this.frontViewRect = {};

		//Bullet:
		this.hasGun = true;
		this.bulletArr = [];
		this.gunTipPos = [];
		this.lastFiredTime = 0;
		this.firingTimeDelay = 500;
	}
	initDesign() {
		this.img = this.craft.img;
		this.i_lim = this.craft.rot_time || 20;
		this.maxRotAngle = this.craft.max_rot || 4;
		
		this.bulletDamage = this.craft.bulletDamage || 20;
		
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
					y: [-1, -3],
				},
				ogPos: { x: a.x, y: a.y },
			})
			this.exhaustArr.push(p);
		};

		if (this.hasGun) {
			this.bulletDamage = this.craft.bulletDamage || 20;
			for (let gunPos of this.craft.guns) {
				this.gunTipPos.push({
					x: this.pos.x - (this.sizeX / 2) + gunPos.x,
					y: this.pos.y - (this.sizeY / 2) + gunPos.y,
				})
			};
			this.ogGunPos = this.craft.guns;
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
		this.hasGun = this.craft.hasGun ? true : false;
	};
	delObj(fnc) {
		this.vel = new Vector(0, 0);
		this.end = true;
		if (!this.endOnce) {
			this.shockWave = new ShockWave(junks_canvas.ctx, {
				x: this.pos.x,
				y: this.pos.y,
				num: 4,
				interval: 3,
				count: 60,
			});
			this.skipThis = true;
			this.endOnce = true;
		};
		for (let i = 0; i < 150; i++) {
			let dx = Math.floor(random(-this.sizeX / 4, this.sizeX / 4));
			let dy = Math.floor(random(-this.sizeY / 4, this.sizeY / 4));
			this.explosionClass.add(this.pos.x + dx, this.pos.y + dy);
		};
		if (this.shockWave.finished) {
			fnc();
		}
	}
	//Bullet shooter function:
	fireBullet() {
		if (this.hasGun) {
			let currTime = Date.now();
			if (currTime - this.lastFiredTime > this.firingTimeDelay) {
				for (let a of this.gunTipPos) {
					let bullet = new Bullet(junks_canvas.ctx, {
						startX: a.x,
						startY: a.y,
						dir: new Vector(0, 1),
						color: this.craft.bulletColor,
					});
					this.bulletArr.push(bullet);
				};
				this.lastFiredTime = Date.now();
			}
		}
	};
	update() {
		if (this.health < 0) {
			this.health = 0;
		}
		this.pos = this.pos.add(this.vel);
		if (!this.end) {
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
				//junks_canvas.ctx.box(hitbox.x, hitbox.y, hitbox.w, hitbox.h, { fill: "transparent", color: "blue" })

				this.hitbox[currIndex] = hitbox;
				currIndex++;
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

			this.frontViewRect = {
				x: this.pos.x - (this.sizeX / 2),
				y: this.pos.y + (this.sizeY / 2),
				w: this.sizeX,
			}
			this.frontViewRect.h = sh - this.frontViewRect.y;

		} else {
			this.explosionClass.update();
			this.shockWave.show();
		}
	}
	show() {
		if (!this.end) {
			this.ctx.save();
			this.ctx.translate(this.pos.x, this.pos.y);
			//this.ctx.rotate(rad(180));
			for (let a of this.exhaustArr) {
				a.add(a.opt.ogPos.x, a.opt.ogPos.y);
				a.update();
			}
			this.ctx.drawImage(this.img, 0, 0, this.craft.dim.w, this.craft.dim.h, -this.sizeX / 2, -this.sizeY / 2, this.sizeX, this.sizeY);
			this.ctx.restore();
			this.ctx.box(this.pos.x - (this.sizeX / 2), this.pos.y - (this.sizeY / 2) - this.healthBarH - 10, this.sizeX, this.healthBarH, {
				fill: "transparent",
				color: "red"
			});
			let barW = (this.health / 100) * this.sizeX;
			this.ctx.box(this.pos.x - (this.sizeX / 2), this.pos.y - (this.sizeY / 2) - this.healthBarH - 10, barW, this.healthBarH, {
				fill: "red",
			});
		}
	}
}

class Enemies {
	constructor(ctx, opt, junksRef) {
		this.ctx = ctx;
		this.opt = opt;
		this.junksRef = junksRef;
		this.size = 60;
		this.startY = -70;
		this.arr = [];
		this.vel = new Vector(0, 2.5);

		this.lastAddTime = Date.now();
		this.currTime = Date.now();
		this.time_interval = 0;
		this.end = false;
	}
	add(directAdd = false,x,y) {
		if (!this.end) {
			this.currTime = Date.now();
			let timeDiff = this.currTime - this.lastAddTime;
			let junksTimeDiff = this.junksRef.curr_time - this.junksRef.last_time;
			let cond = timeDiff > this.time_interval;


			if (directAdd || (Math.random() < 0.1 && this.junksRef.time_interval > this.junksRef.time_range[1] * 0.8 && cond && ((junksTimeDiff > this.junksRef.time_interval * 0.45) && (junksTimeDiff < this.junksRef.time_interval * 0.55)))) {
				let xPos = random(this.size, sw - this.size);

				var enemy_img = enemy_sprites.randomItem();
				var enemy = new Enemy(this.ctx, {
					x: directAdd?x:xPos,
					y: directAdd?y:this.startY,
					vel: this.vel,
					size: this.size,
					craft: enemy_img,
				});
				enemy.initDesign();
				this.arr.push(enemy);
				this.time_interval = random(15000, 30000, true);
				this.lastAddTime = Date.now();
			}
		}
	}
	stop() {
		this.end = true;
	}
	update() {
		for (let i = 0; i < this.arr.length; i++) {
			let curr = this.arr[i];
			if (!this.end) {
				curr.update();
				this.ctx.box(curr.pos.x, curr.pos.y, 3, 3)
				if (curr.pos.y - (this.size / 2) > sh) {
					this.arr.splice(i, 1)
					i--;
				}
			}
			curr.show();
		}
	}
}