var height = window.innerHeight;

var navBar = s(".side_menu");
var navBarCont = s(".side_menu_cont");
var navBarBg = s(".side_menu_bg");
var navIc = s(".menu_icon");
var currPath = window.location.pathname;
var pageName = (currPath.split("/").pop()).replace(".html","");
var isHome = (small(pageName) == "index");

var currIndex,prevIndex,nextIndex;

for(let a of supportCalcList){
	if(a.file == pageName){
		currIndex = supportCalcList.indexOf(a);
		break;
	}
}
if(currIndex >= 0){
	prevIndex = currIndex > 0?currIndex-1:undefined;
	nextIndex = currIndex < (supportCalcList.length-1)?currIndex+1:undefined;
}


function openOrCloseNav(t){
	t = t || navIc;
	let text = ["&#9776;","&times;"];
	let state = parseInt(t.getAttribute("state"));	
	t.setStyle({
		opacity:0,
		transform:"translateX(-50px)",
	});
	setTimeout(()=>{
		t.setStyle({
			opacity:1,
			transform:"translateX(0px)",
		});
	},200);
	if(state == 0){
		t.setAttribute("state",1);
		t.innerHTML = text[1];
		navBar.setStyle({
			visibility:"visible",
			transform:"translateX(0px)",
			opacity:1,
		});
		navBarBg.setStyle({
			visibility:"visible",
			opacity:1,
		});
	}else {
		t.setAttribute("state",0);
		t.innerHTML = text[0];
		navBar.setStyle({
			transform:"translateX(-70%)",
			opacity:0,
		});
		navBarBg.style.opacity = 0;
		setTimeout(()=>{
			navBar.setStyle({
				visibility:"hidden",
			});
			navBarBg.setStyle({
				visibility:"hidden",
			});
		},200)
	}
}

//For creating list of all the supported calcs:
function createCalcElms(){
	let elm = s(".operations_list")  || undefined;
	let elm2 = s(".side_menu_cont");
	
	for(let a of supportCalcList){
		if(elm){
			let main = document.createElement("a");
			main.setAttribute("class","list_indv")
			main.setAttribute("href",a.src);
			elm.appendChild(main);
			main.innerHTML = `
				<name>${a.name}</name>
				<img src="../../../icons/chevron-right.png">
			`;
		};
		
		let main2 = document.createElement("a");
		main2.setAttribute("class","side_menu_elm");
		let pageSrc = a.src;
		if(!isHome){
			pageSrc = pageSrc.replace("calcs/","");
		}
		main2.setAttribute("href",pageSrc);
		elm2.appendChild(main2);
		if(a.file === pageName){
			main2.setAttribute("isCurr",true);
		}else {
			main2.setAttribute("isCurr",false);
		}
		main2.innerHTML = a.name;
	}
}
//Init function:
createCalcElms();