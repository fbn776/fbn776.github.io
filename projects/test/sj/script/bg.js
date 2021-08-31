
function setBackground(canvas){
	let dp = 20,
			threshVal = 0.1;
			
	var cw = canvas.width,
			ch = canvas.height,
			cx = canvas.width/2,
			cy = canvas.height/2,
			ctx = canvas.getContext("2d");
		
	for (let y = 0; y < ch; y += dp) {
		for (let x = 0; x < cw; x += dp) {
			if (Math.random() < threshVal) {
				let starX = random(10, cw- 10)
						starY = random(10, ch - 10),
						size = random(0.2, 3),
						alpha = random(0.5, 1);
				ctx.beginPath();
					ctx.fillStyle = `rgba(255,255,255,${alpha})`;
					ctx.arc(starX, starY, size, 0, two_pi);
					ctx.fill();
				ctx.closePath();
			}
		}
	}
}