//Varibles/Constants;
const gravity = new Vector(0, 400);
const Smoke_img = new Image();
Smoke_img.src = "sprites/smoke.png";
const Player_img = new Image();
Player_img.src = "sprites/player.png";
const Wall_img = new Image();
Wall_img.src = "sprites/wall.png";
const Clouds_img_list = [new Image(), new Image(), new Image()];
clouds_img: {
	let i = 1;
	for (let a of Clouds_img_list) {
		a.src = "sprites/cloud" + i + ".png";
		i++;
	}
}
const Sun_img = new Image();
Sun_img.src = "sprites/sun.png";



class Smoke {
	constructor(x, y, size = 32, vel = new Vector(0, 0), life, scaleStart = 1, scaleFactor = 1) {
		this.x = x;
		this.y = y;
		this.pos = new Vector(this.x, this.y)
		this.vel = vel;
		this.size = size;
		this.img = Smoke_img;
		this.life = life;
		this.age = 0;

		this.scaleStart = scaleStart;
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


class Player {
	constructor(x, y, props) {
		this.props = props;
		this.pos = new Vector(x, y);
		this.vel = new Vector(0, 100);
		this.acc = gravity;
		this.size = 12;
		this.halfSize = this.size / 2;
		this.moveUpCounter = 0;
		this.lastMoveUp = 0;
		this.dt = 1;
		this.lastSpeedUp = Date.now();
		
		this.score = 0;
		this.hasCollision = false;
		this.smokes = new Smokes(x, y);
	}
	moveUp() {
		if (!this.hasCollision) {
			this.moveUpCounter++;
			//Add smoke when jumping;
			for (let k = 0; k < random(4, 9); k++) {
				this.smokes.add(vecFromAngle(rad(random(0, 180)), Math.floor(random(0, 30)))
					.add(this.props.barVelocity)
					.add(new Vector(0, 40)),
					random(8, 20),
					random(100, 150)
				);
			}
			if (Date.now() - this.lastMoveUp > 1000) {
				this.moveUpCounter = 0;
			}
			this.vel = new Vector(0, -150 - (this.moveUpCounter * 10));
			this.lastMoveUp = Date.now();
		}
	}
	update(dt) {
		this.dt = dt;
		this.vel = this.vel.add(this.acc.multScalar(dt));
		this.pos = this.pos.add(this.vel.multScalar(dt));
		this.smokes.x = this.pos.x;
		this.smokes.y = this.pos.y;
		this.smokes.update(dt);
		this.rotateAngle = map_range(this.vel.y, -200, 200, 15, -15);
	}
	show() {
		ctx.save();
		ctx.translate(this.pos.x, this.pos.y);
		ctx.rotate(rad(this.rotateAngle));
		ctx.drawImage(Player_img, 0, 0, 64, 64, -this.halfSize, -this.halfSize, this.size, this.size);
		ctx.restore();
	}
	onCollision() {
		//Collision animation;
		if (this.pos.y - this.halfSize < 0) {
			this.vel = this.vel.multScalar(-0.8).add(new Vector(-80, 0));
		}
		else if (this.pos.y + this.halfSize > ch) {
			this.vel = this.vel.multScalar(-0.8).add(new Vector(-80, 0));
		} else {
			this.vel = this.vel.add(this.props.barVelocity);
		}
		this.smokes.addN(10);
		this.props.barVelocity.x = 0;
		this.hasCollision = true;
	}
}

class Bar {
	constructor(x, topHeight, gap, width) {
		this.pos = new Vector(x, 0);
		this.vel = new Vector(0, 0);
		this.topHeight = topHeight;
		this.gap = gap;
		this.width = width;
		this.bottomHeight = ch - (this.topHeight + this.gap);
		this.passed = false;
	}
	update(dt, barVelocity) {
		this.pos.x += barVelocity.x * dt;
	}
	show() {
		for (let j = this.topHeight - this.width; j >= -this.width; j -= this.width) {
			ctx.drawImage(Wall_img, 0, 0, 64, 64,
				this.pos.x - (this.width / 2), j,
				this.width, this.width
			);
		};
		for (let j = this.topHeight + this.gap; j < ch; j += this.width) {
			ctx.drawImage(Wall_img, 0, 0, 64, 64,
				this.pos.x - (this.width / 2), j,
				this.width, this.width
			);
		}
	}
}

class Bars {
	constructor(player, props, minGap,maxGap,minDist,maxDist) {
		this.player = player;
		this.props = props;
		this.arr = [];
		
		this.width = 40;
		this.minDelay = 3000;
		this.maxDelay = 7000;
		this.minGap = minGap || 80;
		this.maxGap = maxGap || 130;
		this.minDist = minDist || 15*cw;
		this.maxDist = maxDist || 24*cw;
		
		this.nextDist = Math.floor(random(cw, 2 * cw));
		this.lastAddTime = 0;
	}
	addNew() {
		const gap = Math.floor(random(this.minGap, this.maxGap));
		const topHeight = Math.floor(random(50, ch - gap - 50));
		this.arr.push(new Bar(cw + (this.width * 2), topHeight, gap, this.width));

		this.lastAddTime = Date.now();
		this.nextDist = Math.floor(random(this.minDist, this.maxDist));
	}
	update(dt) {
		const barVelocity = this.props.barVelocity;
		const player = this.player;
		if ((!player.hasCollision) && Date.now() - this.lastAddTime > this.nextDist / (-barVelocity.x * dt)) {
			this.addNew();
		}
		for (let i = 0; i < this.arr.length; i++) {
			const curr = this.arr[i];
			if (curr.pos.x + this.width < 0) {
				this.arr.splice(i, 1);
				i--;
				continue;
			};
			if ((!player.hasCollision) && Math.abs(curr.pos.x - player.pos.x) <= curr.width + 20) {
				//const collided = has_collision(curr.pos.x-(curr.width/2),curr.pos.y,0,curr.topHeight,player.pos.x-player.halfSize,player.pos.y-player.halfSize,player.size,player.size)
				if (player.pos.x + player.halfSize > curr.pos.x - (curr.width / 2) &&
					player.pos.x - player.halfSize < curr.pos.x + (curr.width / 2))
				{
					if (player.pos.y - player.halfSize > curr.topHeight && player.pos.y + player.halfSize < curr.topHeight + curr.gap) {
						//Passed through the hole;
						if (!curr.passed) {
							player.score++;
							curr.passed = true;
						}
					} else {
						//Collison with the poles;
						player.onCollision();
					}
				}
			}
			curr.update(dt, barVelocity);
			curr.show();
		}
	}
}


class SkyObject {
	constructor(x, y, vel, size, opa, img) {
		this.pos = new Vector(x, y);
		this.vel = vel;
		this.img = img;
		this.size = size;
		this.opa = opa;
	}
	update(dt) {
		this.pos = this.pos.add(this.vel.multScalar(dt));
	}
	show() {
		ctx.globalAlpha = this.opa;
		ctx.drawImage(this.img, 0, 0, 128, 128, this.pos.x, this.pos.y, this.size, this.size);
		ctx.globalAlpha = 1;
	}
}

class Clouds {
	constructor(list) {
		this.list = list;
		this.arr = [];
	}
	add(x, y) {
		const size = random(20, 80),
			vel = new Vector(-random(30, 60), 0);
		const opa = map_range(-vel.x, 30, 60, 0.8, 1);
		const img = this.list.randomItem();
		this.arr.push(new SkyObject(x, y, vel, size, opa, img));
	}
	update(dt) {
		for (let i = 0; i < this.arr.length; i++) {
			const curr = this.arr[i];
			if (curr.pos.x + curr.size < 0) {
				this.arr.splice(i, 1);
				i--;
				continue;
			}
			curr.update(dt);
			curr.show();
		}

		if (Math.random() < 0.015) {
			const y = Math.floor(random(-10, ch - 50));
			this.add(cw + 80, y);
		};
	}
}
