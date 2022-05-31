const canvas = document.getElementById("bg");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function random(x, y, round = false) {
	let r = x + Math.random() * (y - x);
	return round ? Math.floor(r) : r;
}
function rad(x) {
	return (Math.PI / 180) * x;
};

class Particle {
	constructor(x, y, vel, size) {
		this.pos = { x: x, y: y };
		this.vel = vel || { x: 0, y: 0 };
		this.size = size;
		this.tsize = 40;
		this.opa = random(0.5, 1);
		this.rot = 0;
		this.rotBy = rad(random(-8, 8, true))
	}
	update(dt) {
		this.pos.x += (this.vel.x * dt);
		this.pos.y += (this.vel.y * dt);
	}
	show() {
		ctx.save();
		ctx.globalAlpha = this.opa;
		ctx.translate(this.pos.x, this.pos.y)
		ctx.rotate(this.rot)
		ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size)
		ctx.globalAlpha = 1;
		ctx.restore();
		this.rot += this.rotBy;
	}
}

class Particles {
	constructor() {
		this.arr = [];
	}
	add(x, y, velX, velY, size) {
		this.arr.push(new Particle(x, y, { x: velX, y: velY }, size))
	}
	update(dt) {
		for (let i = 0; i < this.arr.length; i++) {
			const curr = this.arr[i];
			if (curr.pos.x < -curr.tsize || curr.pos.x > canvas.width + curr.tsize ||
				curr.pos.y < -curr.tsize || curr.pos.y > canvas.height + curr.tsize) {
				this.arr.splice(i, 1);
				i--;
				continue;
			}
			curr.update(dt);
			curr.show();
		}
	}
}

const particles = new Particles();
let now;
let lastTime = Date.now();
function draw() {
	now = Date.now();
	let dt = (now - lastTime) / 1000.0;
	ctx.clearRect(0, 0, canvas.width, canvas.height)

	if (Math.random() < 0.03) {
		let x, y, vx, vy;
		if (Math.random() > 0.5) {
			x = random(-30, canvas.width + 30);
			const rand = (Math.random() > 0.5 ? 0 : 1)
			y = rand * canvas.height + (rand == 0 ? -1 : 1) * 30;
		} else {
			const rand = (Math.random() > 0.5 ? 0 : 1)
			x = canvas.width * rand + (rand == 0 ? -1 : 1) * 30;
			y = random(-30, canvas.height + 30);
		}
		const vel = random(50, 120, true);
		vx = random(10, canvas.width - 10, true) - x;
		vy = random(10, canvas.height - 10, true) - y;
		const dist = Math.sqrt(vx ** 2 + vy ** 2);
		vx = (vel * vx / dist);
		vy = (vel * vy / dist);
		particles.add(x, y, vx, vy, random(8, 20, true));
	}
	particles.update(dt);
	lastTime = now;
	window.requestAnimationFrame(draw);
}
draw();
