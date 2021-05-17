var currPath = window.location.pathname;
var pageName = (currPath.split("/").pop()).replace(".html","");
var navBar = s(".side_menu");
var navBarCont = s(".side_menu_cont");
let next_btn = s("#next_btn");
let prev_btn = s("#prev_btn");
let currIndex;

function createSideNavElm(n,l,isCurr){
	var a = document.createElement("a");
	a.setAttr({
		href:l+".html",
		class:"side_menu_elm",
		isCurr:isCurr,
	});
	a.innerHTML = n;
	navBarCont.appendChild(a);	
}
for(let a of LIST){
	let name = a.name;
	let src = a.src;
	let isCurr = (small(src) == small(pageName));
	if(isCurr){
		currIndex = LIST.indexOf(a);
	}
	createSideNavElm(name,src,isCurr);
}
if(currIndex === 0){
		prev_btn.remove();
}
if(currIndex === (LIST.length-1)){
		next_btn.remove();
}
let prev = LIST[currIndex-1],
	next = LIST[currIndex+1];

if(prev && prev_btn){
	prev_btn.setAttribute("href",prev.src+".html")
}
if(next && next_btn){
	next_btn.setAttribute("href",next.src+".html");
}	

function openOrCloseNav(t){
	let text = ["&#9776;","&times;"];
	let state = parseInt(t.getAttribute("state"));
	
	if(state == 0){
		t.setAttribute("state",1);
		t.innerHTML = text[1];
		navBar.setStyle({
			visibility:"visible",
			transform:"translateX(0px)",
			opacity:1,
		});
	}else {
		t.setAttribute("state",0);
		t.innerHTML = text[0];
		navBar.setStyle({
			transform:"translateX(-70%)",
			opacity:0,
		});
		setTimeout(()=>{
			navBar.setStyle({
				visibility:"hidden",
			});
		},200)
	}
}