//Handle the opening and closing of the menu bar
function doMenuBar(t) {
	let menu_bar = t.nextElementSibling;
	if (menu_bar.getAttribute("state") == "0") {
		menu_bar.setStyle({
			transform: 'translateY(0px)',
			opacity: 1,
			visibility: 'visible',
		});
		menu_bar.setAttribute("state", "1");
		t.setStyle({
			backgroundColor: 'var(--menu-color)',
		});
	} else {
		menu_bar.setStyle({
			transform: 'translateY(-100px)',
			opacity: 0,
		});
		setTimeout(() => {
			menu_bar.style.visibility = 'hidden';
		}, 200);
		menu_bar.setAttribute("state", "0");
		t.setStyle({
			backgroundColor: 'transparent',
		});
	}
}

//Code for controlling the css varibles, which is used to change the theme
function getRootStyle(prop) {
	var rs = getComputedStyle(css_root);
	return rs.getPropertyValue(`--${prop}`);
}

function setRootStyle(prop, val) {
	css_root.style.setProperty(`--${prop}`, val);
}

function setTheme(t) {
	var cssVars = getAllCSSVariableNames();
	let allNames = getElementCSSVariables(cssVars, document.documentElement).getKeys();
	currTheme = t;
	themeChangerBtn.setAttribute("theme", currTheme);
	localStorage.setItem("theme", currTheme)
	if (currTheme === "light") {
		themeChangerBtn.children[0].src = "icons/sun.png";
	} else {
		themeChangerBtn.children[0].src = "icons/moon.png";
	}
	for (let a of allNames) {
		if (a.endsWith(t)) {
			let str = a;
			str = str.replace('--', '');
			var ret = str.replace(`-${t}`, '');
			setRootStyle(ret, getRootStyle(str));
		}
	}

}
function createPanel(name, des, link) {
	let a = document.createElement("a");
	a.setAttr({
		class: "projects",
		href: link,
	});
	a.innerHTML = `<name>${name}</name><des>${des}</des>`;
	bottom.appendChild(a);
}

///////////------------>
setTheme(currTheme);

themeChangerBtn.onclick = function() {
	themeChangerBtn.setAttribute("theme", currTheme);
	themeChangerBtn.setStyle({
		transform: "translateY(-50px) rotate(145deg)",
		opacity: 0.1,
	});
	setTimeout(() => {
		themeChangerBtn.setStyle({
			transform: "translateY(0px) rotate(0deg)",
			opacity: 1,
		});
	}, 200);
	if (currTheme == "light") {
		setTheme("dark");
	} else {
		setTheme("light");
	}
}