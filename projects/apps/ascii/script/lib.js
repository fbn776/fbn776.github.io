const width = window.innerWidth;
const height = window.innerHeight;
const twoPi = 2 * Math.PI;

function setUpCanvas(c, w, h) {
	c.width = w;
	c.height = h;
	return {
		canvas: c,
		ctx: c.getContext("2d"),
		cw: c.width,
		ch: c.height,
		cx: c.width / 2,
		cy: c.height / 2
	}
}


function toggleFade(elm, state, opaMax) {
	if (state == 0) {
		elm.style.opacity = "0";
		setTimeout(function() {
			elm.style.display = "none";
		}, 200);
	} else {
		elm.style.display = "block";
		setTimeout(() => {
			elm.style.opacity = opaMax || "1"
		}, 0);
	}
}


//HTML elements functions
function s(x) {
	return document.querySelector(x)
};

function css(elm, prop) {
	return window.getComputedStyle(elm).getPropertyValue(prop);
};
//Strings functions
function small(x) {
	return x.toLowerCase()
};

function big(x) {
	return x.toUpperCase()
};

function jsonS(x) {
	return JSON.stringify(x);
};

function jsonP(x) {
	return JSON.parse(x);
};


//Maths functions
function map_range(val, in_min, in_max, out_min, out_max) {
	return (val - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
