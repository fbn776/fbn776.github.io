const { canvas, ctx, cx, cy, cw, ch } = setUpCanvas(s("#main"), 100, 100);

let data = { w: 100, h: 100 }
data.x = 0;
data.y = 0;

function rgb(r, g, b) {
	return `rgb(${r},${g},${b})`;
}

function changeColor(elm, color) {
	elm.style.color = color;
	elm.style.borderColor = color;
}

const div = s("#text");
const og_density = "Ñ@#W$9876543210?!abc;:+=-,._                        ";

let density = String(og_density);

function editDensity(elm) {
	let p = prompt("Density Value (brighter to dimmer):");
	if (p) {
		density = p;
	}
}

function resetDensity() {
	density = String(og_density)
};


let ctrl = {
	hideCam: false,
	hasOverlay: false,
}


function hideCam(elm) {
	if (!ctrl.hideCam) {
		toggleFade(canvas, 0);
		ctrl.hideCam = true;
		elm.innerHTML = "Show Cam";
		changeColor(elm, "#536DFE")

	} else {
		ctrl.hideCam = false;
		elm.innerHTML = "Hide Cam"
		toggleFade(canvas, 1);
		changeColor(elm, "rgba( 244, 67, 54 ,1)")
		setTimeout(function() {
			if (ctrl.hasOverlay) {
				canvas.style.opacity = 0.5;
			}
		}, 0);
	}
}

function overlayCanvas(elm) {
	if (!ctrl.hideCam) {
		if (ctrl.hasOverlay) {
			ctrl.hasOverlay = false;
			elm.innerHTML = "Show Overlay";
			canvas.style.transform = "none";
			canvas.style.opacity = 1;
			changeColor(elm, "#536DFE")

		} else {
			ctrl.hasOverlay = true;
			elm.innerHTML = "Hide overlay";
			canvas.style.opacity = 0.3;
			changeColor(elm, "rgba( 244, 67, 54 ,1)")

			canvas.style.transform = `scaleX(${window.innerWidth/cw}) scaleY(${window.innerHeight/ch})`;
		}
	}
}




let end = false;
let start_once = false;

if (navigator.mediaDevices.getUserMedia) {
	var successCallback = function(stream) {
		video.srcObject = stream;
	};
	var errorCallback = function(error) {
		end = true;
		document.body.style = "color:white;display:flex;justify-content: center;align-items: center;font-size:14px"
		document.body.innerHTML = "Camera permission denied :(<br><br>Grant permission and refresh the page";
	};
	navigator.mediaDevices.getUserMedia({
		audio: false,
		video: { facingMode: { ideal: 'environment' } }
	}).then(successCallback, errorCallback);
}


function draw() {
	if (end) {
		return false;
	}
	ctx.clearRect(0, 0, cw, ch);
	ctx.drawImage(video, data.x, data.y, data.w, data.h);
	const pixels = ctx.getImageData(data.x, data.y, data.w, data.h);
	const pixel_data = pixels.data;
	txt = "";
	for (let j = 0; j < pixels.height; j++) {
		for (let i = 0; i < pixels.width; i++) {
			const pixelIndex = (i + j * pixels.width) * 4;
			const r = pixels.data[pixelIndex + 0];
			const g = pixels.data[pixelIndex + 1];
			const b = pixels.data[pixelIndex + 2];
			let avg = (r + g + b) / 3;
			let char_index = Math.floor(map_range(avg, 0, 255, 0, density.length - 1));
			char = density[char_index];
			if (char == " ") { char = "&nbsp;" };
			txt += char;
		};
		txt += "</br>";
	}
	div.innerHTML = txt;
	if (!start_once) {
		let w0 = parseFloat(css(div, "width"));
		let h0 = parseFloat(css(div, "height"));
		div.style.transform = `scaleX(${window.innerWidth/w0}) scaleY(${window.innerHeight/h0})`
		start_once = true;
	}
	window.requestAnimationFrame(draw);
};

if (!end) {
	draw();
};

function startResumeBtn(elm) {
	if (end) {
		elm.innerHTML = "Pause"
		end = false;
		changeColor(elm, "rgba( 244, 67, 54 ,1)")

		draw();
	} else {
		elm.innerHTML = "Resume";
		end = true;
		changeColor(elm, "#536DFE")
	}
}
