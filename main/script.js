function getAllCSSVariableNames(styleSheets = document.styleSheets){
   var cssVars = [];
   for(var i = 0; i < styleSheets.length; i++){
      try{
         for( var j = 0; j < styleSheets[i].cssRules.length; j++){
            try{
               for(var k = 0; k < styleSheets[i].cssRules[j].style.length; k++){
                  let name = styleSheets[i].cssRules[j].style[k];
                  if(name.startsWith('--') && cssVars.indexOf(name) == -1){
                     cssVars.push(name);
                  }
               }
            } catch (error) {}
         }
      } catch (error) {}
   }
   return cssVars;
}
function getElementCSSVariables (allCSSVars, element = document.body, pseudo){
   var elStyles = window.getComputedStyle(element, pseudo);
   var cssVars = {};
   for(var i = 0; i < allCSSVars.length; i++){
      let key = allCSSVars[i];
      let value = elStyles.getPropertyValue(key)
      if(value){cssVars[key] = value;}
   }
   return cssVars;
}

//HTML elements functions
function s(x){
    return document.querySelector(x)
};
function css(x,y){
    return window.getComputedStyle(x).getPropertyValue(y);
};
HTMLElement.prototype.setProps = function(obj){
	if(obj){
		let keys = obj.getKeys();
		for(let i of keys){
			this[i] = obj[i];
		}
	}
};
HTMLElement.prototype.setStyle = function(obj){
	if(obj){
		let keys = obj.getKeys();
		for(let i of keys){
			this.style[i] = obj[i];
		}
	}
};
HTMLElement.prototype.setAttr = function(obj){
	if(obj){
		let keys = obj.getKeys();
		for(let i of keys){
			this.setAttribute(i,obj[i]);
		}
	}
};
//Strings functions
function small(x){
    return x.toLowerCase()
};
function big(x){
    return x.toUpperCase()
};
function jsonS(x){
	return JSON.stringify(x);
};
function jsonP(x){
	return JSON.parse(x);
};

//Objects and array functions
Object.prototype.getKeys = function(){
	return Object.getOwnPropertyNames(this);
};
Object.prototype.getValues = function(){
	let keys = this.getKeys();
	let arr = [];
	for(let n of keys){arr.push(this[n])};
	return arr;
};
Object.prototype.hasProp = function(key) {
      return this?Object.prototype.hasOwnProperty.call(this,key):false;
}


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
