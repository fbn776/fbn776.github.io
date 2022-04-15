
setTheme(currTheme);


themeChangerBtn.onclick = function(){
	themeChangerBtn.setAttribute("theme",currTheme);
	
	themeChangerBtn.setStyle({
		transform:"translateY(-50px) rotate(145deg)",
		opacity:0.1,
	});	
	setTimeout(()=>{
		themeChangerBtn.setStyle({
			transform:"translateY(0px) rotate(0deg)",
			opacity:1,
		});	
	},200);
	if(currTheme == "light"){
		setTheme("dark");
	}else {
		setTheme("light");
	}
}
