class Smoke {
	constructor(x, y, size = 32, vel = new Vector(0, 0), life, scaleStart = 1, scaleFactor = 1) {
		this.x = x;
		this.y = y;
		this.pos = new Vector(this.x, this.y)
		this.vel = vel;
		this.size = size;
		this.img = new Image();
		this.img.src = "sprites/smoke.png";
		this.life = life;
		this.age = 0;

		this.scaleStart = scaleStart; //|| 1;
		this.scaleFactor = scaleFactor;
	}
	update(dt) {
		this.pos = this.pos.add(this.vel.mult(dt))
	}
	show() {
		let opacity = map_range(this.age, 0, this.life, 1, 0);
		if (opacity <= 0) {
			opacity = 0;
		}
		ctx.save()
		ctx.globalAlpha = opacity
		//			ctx.drawImage(this.img, 0, 0, 32, 32, this.pos.x - (this.size / 2), this.pos.y - (this.size / 2), this.size, this.size)
		ctx.translate(this.pos.x, this.pos.y);
		let scale = (this.scaleStart + (1 - opacity));
		ctx.scale(scale, scale);
		ctx.drawImage(this.img, 0, 0, 32, 32, -this.size / 2, -this.size / 2, this.size, this.size)

		ctx.globalAlpha = 1;
		ctx.restore();
	}
}

class Smokes {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.arr = [];
		this.allDead = false;
	}
	add(vel, size, life, scaleStart, scaleFactor) {
		size = size || Math.floor(random(10, 40))
		life = life || random(200, 250)
		this.arr.push(new Smoke(this.x, this.y, size, vel, life, scaleStart, scaleFactor));
	}
	addN(n, size, life, scaleStart, scaleFactor, vel) {
		let angle = 0;
		for (let i = 0; i < n; i++) {
			angle += 360 / n;
			this.add(vel || vectorFromAngle(angle, Math.floor(random(10, 20))), size, life, scaleStart, scaleFactor);
		}
	}
	update(dt) {
		for (let i = 0; i < this.arr.length; i++) {
			let curr = this.arr[i]
			if (curr.age > curr.life) {
				this.arr.splice(i, 1);
				i -= 1;
				if (this.arr.length == 0) {
					this.allDead = true;
				}
				continue;
			}
			curr.update(dt)
			curr.age += 1;
			curr.show();
		}
	}
}

class Bullet {
	constructor(ctx, sx, sy, angle, vel = 80) {
		this.ctx = ctx;
		this.sx = sx;
		this.sy = sy;
		this.angle = angle;
		this.pos = new Vector(sx, sy);
		this.vel = vectorFromAngle(angle, vel);
		this.sprite = new Image();
		this.sprite.src = "sprites/bullet.png"
		this.w = 15;
		this.h = 20;
		this.dead = false;
		this.trail = new Smokes(this.sx, this.sy)
	}
	update(dt) {
		let x_off = 20;
		let y_off = 20;
		if (this.pos.x < -x_off || this.pos.x > ctx.canvas.width + x_off || this.pos.y < -y_off || this.pos.y > ctx.canvas.height + y_off) {
			this.dead = true;
		};
		let trailCord = circleCord(this.pos.x, this.pos.y, (this.h / 2) + 2, this.angle + Math.PI)
		this.trail.x = trailCord.x;
		this.trail.y = trailCord.y;
		this.pos = this.pos.add(this.vel.mult(dt));
		this.trail.add(this.vel.mult(-1 / 10), random(5, 10), random(10, 30));
		this.trail.update(dt)
	}
	show() {
		this.ctx.save()
		this.ctx.translate(this.pos.x, this.pos.y);
		this.ctx.rotate(this.angle + Math.PI / 2)
		this.ctx.drawImage(this.sprite, 0, 0, 64, 64, -this.w / 2, -this.h / 2, this.w, this.h)
		//ctx.box(this.pos.x,this.pos.y,10,10,{fill:"red"})
		this.ctx.restore()

	}
}

class Player {
	constructor(ctx, x, y) {
		this.ctx = ctx;
		this.pos = new Vector(x, y);
		this.size = 50;
		this.center_sprite = new Image();
		this.center_sprite.src = "sprites/center.png";
		this.gun_sprite = new Image();
		this.gun_sprite.src = "sprites/gun.png";
		this.gun_angle = 0;
		this.last_touch = { x: cx, y: cy };

		this.bullets = [];
		this.enemies = {};

		this.explosion = [];
		this.gameEnd = false;

		this.bulletLastFiredTime = 0;
		this.coolOffTime = 400;
		this.score = 0;
	}

	fireAt(x, y) {
		if (!this.gameEnd) {
			this.last_touch = { x: x, y: y }
			this.gun_angle = rad(slope(this.pos.x, this.pos.y, x, y) + 90);
			if (Date.now() - this.bulletLastFiredTime > this.coolOffTime) {
				audio.push(new Audio("audio/fire.mp3"))
				let gun_end = circleCord(this.pos.x, this.pos.y, 15, this.gun_angle - Math.PI / 2);
				let bullet = new Bullet(this.ctx, gun_end.x, gun_end.y, this.gun_angle - (Math.PI / 2));
				this.bullets.push(bullet);
				this.bulletLastFiredTime = Date.now();
			}
		}
	}
	update(dt) {
		for (let i = 0; i < this.bullets.length; i++) {
			let curr = this.bullets[i];
			if (curr.dead) {
				this.bullets.splice(i, 1);
				i--;
				continue;
			};
			curr.show()
			curr.update(dt);
		};

		for (let k = 0; k < this.explosion.length; k++) {
			let curr = this.explosion[k];
			if (curr.allDead) {
				this.explosion.splice(k, 1);
				k--;
				continue;
			}
			curr.update(dt);
		}

	}
	show() {

		this.ctx.drawImage(this.center_sprite, 0, 0, 128, 128, this.pos.x - (this.size / 2), this.pos.y - (this.size / 2), this.size, this.size)
		this.ctx.line(this.last_touch.x, this.last_touch.y, this.pos.x, this.pos.y, { color: "rgba(200,200,200,0.5)",dash:[5,2]})
		this.ctx.circle(this.last_touch.x,this.last_touch.y,5,{fill:"rgba(200,200,200,0.5)"})

		this.ctx.save()
		this.ctx.translate(this.pos.x, this.pos.y)
		this.ctx.rotate(this.gun_angle)
		this.ctx.drawImage(this.gun_sprite, 0, 0, 128, 128, -this.size / 2, -this.size / 2, this.size, this.size)
		this.ctx.restore()
		
		let size = 40;
		let cooldown = map_range(Date.now() - this.bulletLastFiredTime, 0, this.coolOffTime,0,size);
		cooldown = cooldown > size?size:cooldown
		this.ctx.box(this.pos.x -size/2,this.pos.y + 40, cooldown,5,{fill:"rgba(255,255,255,0.5)"})
		this.ctx.box(this.pos.x -size/2,this.pos.y + 40, size,5,{fill:"transparent",color:"white"})
	}
}


class Enemy {
	constructor(ctx, x, y, player) {
		this.x = x;
		this.y = y;
		this.player = player;

		this.pos = new Vector(x, y)
		this.vel = this.pos.sub(this.player.pos).setMag(-20);
		this.ctx = ctx;
		this.acc = this.vel.mult(0.1 / 20);

		this.sprite = new Image();
		this.sprite.src = "sprites/enemy" + Math.floor(random(1, 4)) + ".png"
		this.angle = 0;

		this.size = random(10, 30);
		this.angle_incr = (Math.random() > 0.5 ? 1 : -1) * rad(map_range(size, 10, 30, 30, 5));

	}
	show() {
		this.ctx.save();
		this.ctx.translate(this.pos.x, this.pos.y);
		this.ctx.rotate(this.angle);
		this.ctx.drawImage(this.sprite, 0, 0, 128, 128, -this.size / 2, -this.size / 2, this.size, this.size)
		this.ctx.restore();
	}
	update(dt) {
		this.angle += this.angle_incr * dt; //1/(2*Math.PI);
		this.vel = this.vel.add(this.acc.mult(dt))
		this.pos = this.pos.add(this.vel.mult(dt));
	}
}
class Enemies {
	constructor(ctx, player) {
		this.ctx = ctx;
		this.arr = [];
		this.player = player;
	}
	add() {
		let angle = rad(random(0, 360));
		let x = ((this.ctx.canvas.width - 50) * Math.cos(angle)) + this.player.pos.x;
		let y = ((this.ctx.canvas.height - 50) * Math.sin(angle)) + this.player.pos.y;
		this.arr.push(new Enemy(this.ctx, x, y, this.player));
	}
	update(dt) {
		for (let i = 0; i < this.arr.length; i++) {
			let curr_enemy = this.arr[i];

			if (curr_enemy) {
				let player_collision = has_collision(
					this.player.pos.x - this.player.size / 2, this.player.pos.y - this.player.size / 2, this.player.size, this.player.size,
					curr_enemy.pos.x - curr_enemy.size / 2, curr_enemy.pos.y - curr_enemy.size / 2, curr_enemy.size, curr_enemy.size
				);
				if (player_collision) {
					if (!this.player.gameEnd) {
						this.player.endTime = Date.now();
					}
					
					//add sound;
					audio.push(new Audio("audio/hit.mp3"));
					
					let smokes = new Smokes(curr_enemy.pos.x, curr_enemy.pos.y);
					smokes.addN(random(5, 10));
					this.player.explosion.push(smokes);
					this.player.gameEnd = true;
					this.arr.splice(i, 1);
					i--;
					continue;
				} else {
					for (let j = 0; j < this.player.bullets.length; j++) {
						let curr_bullet = this.player.bullets[j];
						let bullet_collision = has_collision(
							curr_bullet.pos.x - curr_bullet.w / 2, curr_bullet.pos.y - curr_bullet.h / 2, curr_bullet.w, curr_bullet.h,
							curr_enemy.pos.x - curr_enemy.size / 2, curr_enemy.pos.y - curr_enemy.size / 2, curr_enemy.size, curr_enemy.size
						);
						if (bullet_collision) {
							audio.push(new Audio("audio/hit.mp3"))
							this.player.score += 1;
							let vel = curr_bullet.vel.mult(0.05);
							let particles = new Smokes(curr_enemy.pos.x, curr_enemy.pos.y)
							particles.addN(3, map_range(curr_enemy.size, 10, 30, 40, 60), random(200, 250), 0.3, 2, vel) //random(5,8));
							this.player.explosion.push(particles);
							this.arr.splice(i, 1);
							this.player.bullets.splice(j, 1);
							j--;
							i--;
							continue;
						}
					}
				};
				curr_enemy.show()
				curr_enemy.update(dt);
			}
		}
	}
}
