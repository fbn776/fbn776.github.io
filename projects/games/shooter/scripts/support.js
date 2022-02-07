function setBackground(canvas) {
	let dp = 20,
		threshVal = 0.1;

	var cw = canvas.width,
		ch = canvas.height,
		cx = canvas.width / 2,
		cy = canvas.height / 2,
		ctx = canvas.getContext("2d");

	for (let y = 0; y < ch; y += dp) {
		for (let x = 0; x < cw; x += dp) {
			if (Math.random() < threshVal) {
				let starX = random(10, cw - 10)
				starY = random(10, ch - 10),
					size = random(0.1, 2.5),
					alpha = random(0.5, 1);
				ctx.beginPath();
				ctx.fillStyle = `rgba(255,255,255,${alpha})`;
				ctx.arc(starX, starY, size, 0, 2*Math.PI);
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}

/**
 * Checks if two rectangles have collision
*/
function has_collision(x1,y1,w1,h1,x2,y2,w2,h2){
	return (x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && h1 + y1 > y2)
}

function fullscreen(el){
	if(el.webkitRequestFullScreen) {
		el.webkitRequestFullScreen();
	}
	else {
		el.mozRequestFullScreen();
	}            
}

