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

//Collision checker function
/*function hasCollision(a,b){
		return !(
		((a.y + a.h) < (b.y)) ||
		(a.y > (b.y + b.h)) ||
		((a.x + a.w) < b.x) ||
		(a.x > (b.x + b.w))
	);
}
*/

function hasCollision(rect1, rect2) {
	return (rect1.x < rect2.x + rect2.w &&
		rect1.x + rect1.w > rect2.x &&
		rect1.y < rect2.y + rect2.h &&
		rect1.y + rect1.h > rect2.y);
}