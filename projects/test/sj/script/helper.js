function setUpCanvas(id, width, height) {
	var canva = document.getElementById(id);
	if (canva) {
		var contxt = canva.getContext("2d");
		canva.width = width;
		canva.height = height;
		var obj = {
			canvas: canva,
			ctx: contxt,
			cw: canva.width,
			ch: canva.height,
			cx: canva.width / 2,
			cy: canva.height / 2,
		};
		return obj;
	}
}

function setUpOgSizeCanvas(id) {
	var elm = document.getElementById(id);
	if (elm) {
		let w = parseInt(css(elm, "width")),
			h = parseInt(css(elm, "height"));

		elm.width = w;
		elm.height = h;

		var context = elm.getContext("2d");
		var obj = {
			canvas: elm,
			ctx: context,
			cw: elm.width,
			ch: elm.height,
			cx: elm.width / 2,
			cy: elm.height / 2,
		}
		return obj;
	}
}

//Rectangle - rectangle collision:
function hasCollision(rect1, rect2) {
	return (rect1.x < rect2.x + rect2.w &&
		rect1.x + rect1.w > rect2.x &&
		rect1.y < rect2.y + rect2.h &&
		rect1.y + rect1.h > rect2.y);
}
//Circle - Rectangle collision:
function hasCollisionCR(circle, rect) {
	let R = circle.r,
		Xc = circle.x,
		Yc = circle.y,
		X1 = rect.x,
		Y1 = rect.y,
		X2 = rect.x + rect.w,
		Y2 = rect.y + rect.h;
	let Xn = Math.max(X1, Math.min(Xc, X2));
	let Yn = Math.max(Y1, Math.min(Yc, Y2));
	let Dx = Xn - Xc;
	let Dy = Yn - Yc;
	return (Dx * Dx + Dy * Dy) <= R * R;
}

function startAnimating(fps, anim) {
	fpsInterval = 1000 / fps;
	then = Date.now();
	startTime = then;
	anim();
}

//Sound player:
function Sound(src) {
	this.sound = document.createElement("audio");
	this.sound.src = src;
	this.sound.setAttribute("preload", "auto");
	this.sound.setAttribute("controls", "none");
	this.sound.style.display = "none";
	document.body.appendChild(this.sound);
	this.play = function() {
		this.sound.play();
	}
	this.stop = function() {
		this.sound.pause();
	}
};