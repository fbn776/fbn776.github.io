function historyContElm(urlStr){
	let refer = this;
	if(urlStr.endsWith("#")){
		urlStr = urlStr.substring(0,urlStr.length-1);
	}
	let params = (new URL(urlStr)).searchParams;
	let data = params.get('data');

	data = JSON.parse(data);
	if(data){
		let name = data.type;
		let timeThen = new Date(data.time);
		let timeNow = new Date();
		let timeDiff = calcTimeDiff(timeNow,timeThen);		
		
		let timeDiffStr = "";		
		if(timeDiff.hh){
			timeDiffStr = `${timeDiff.hh}h ${timeDiff.mm}m`;
		}else if(timeDiff.mm){
			timeDiffStr = `${timeDiff.mm}m`;		
		}else {
			timeDiffStr = `${timeDiff.ss}s`;
		};
		refer.elm = new createElm("div",{
			attr:{class:"list-item-cont"},
			childs:[
				new createElm("div",{
					attr:{class:"upper-item-cont"},
					childs:[
						new createElm("div",{
							attr:{class:"main-img-cont"},
							childs:[
								new createElm("img",{attr:{src:"../../../../icons/math.png"}}),
							]
						}),
						new createElm("div",{
							attr:{class:"main-text-cont"},
							childs:[
								new createElm("name",{text:name}),
								new createElm("date",{text:timeDiffStr+" ago"}),									
							],
						}),
						new createElm("div",{
							attr:{class:"main-load-img-cont"},
							childs:[
								new createElm("img",{attr:{src:"../../../../icons/arrow-right.png"}}),
							]
						}),
					],
				}),
				new createElm("div",{
					attr:{class:"lower-item-cont"},
					childs:[
						new createElm("img",{attr:{src:"../../../../icons/trash.png"}}),						
						//new createElm("img",{attr:{src:"../../../../icons/arrows-maximize.png"}}),
					],
				}),
			]
		});
		refer.delElm = refer.elm.childs[1].childs[0].elm;
		refer.loadElm = refer.elm.childs[0].childs[2].elm;
	};
}

function historyWindow(){
	let refer = this;
	
	this.window = new createElm("window",{
		attr:{class:"historyWindow"},
	});
	//Top part things:
	this.upper = new createElm("div",{
		attr:{
			class:"upper-cont",
		},
		childs:[
			new createElm("header",{text:"Calculation History"}),
		],
	});
	this.title = new createElm("label",{text:"Matrix List:",attr:{class:"list-cont-title"},childs:[
		new createElm("img",{attr:{class:"delete_ic",src:"../../../../icons/trash.png"}}),
	]});
	this.listCont = new createElm("div",{attr:{class:"list-sub-cont"},
		childs:[],
	});
	
	this.upper.addChild([this.title,this.listCont]);
	//Bottom part things:
	this.lower = new createElm("div",{
		attr:{class:"lower-cont"},
		childs:[
			new createElm("button",{text:"Close"}),
		]
	});
	this.window.addChild([this.upper,this.lower]);
	document.body.appendChild(this.window.elm);
	this.closeBtn = this.lower.childs[0].elm;	
	
	
	
	//Set the height of list cont for scrolling
	var height = parseFloat(css(this.window.elm,"height"));	
	var listContPos = this.listCont.elm.getBoundingClientRect().top - height;
	var bottomPos = this.lower.elm.getBoundingClientRect().top - height;	
	let scrollWidth = bottomPos - listContPos;
	this.listCont.elm.style.height = scrollWidth+"px"
	
	
	
	
	this.title.childs[0].elm.onclick = function(){
		if(calcHistory.list.length > 0){
			let youSure = confirm("Do you want to clear all the calculation history?");
			if(youSure){
				refer.listCont.elm.setAttribute("hasElm","true");
				refer.title.childs[0].elm.style.opacity = 0.5;
				calcHistory.list = [];
				let list = JSON.stringify(calcHistory.list);
				localStorage.setItem(calcHistory.id,list);
				let delay = 0;
				let childrens = refer.listCont.elm.children;
				for(let a of childrens){
					setTimeout(()=>{
						a.setStyle({
							transform:"translateX(100%) translateY(-200px)",
							height:"0px",
							opacity:0,
						});
						setTimeout(()=>{
							a.remove();
						},400);
					},delay);
					delay += 50;
				}
			}
		}
	};
	
	this.close = function(){
		let win = refer.window.elm;
		win.setStyle({
			transform:"translateY(100%)",
			opacity:0,
		});
		setTimeout(function(){
			win.style.visibility = "hidden";
		},300);
	};
	
	
	this.open = function(){
		let win = refer.window.elm;
		win.setStyle({
			visibility:"visible",
			transform:"translateY(0%)",
			opacity:1,
		});
		refer.listCont.elm.innerHTML = "";
		setTimeout(function(){
			refer.initSavedList();
		},350);
		if(calcHistory.list.length == 0){
			refer.listCont.elm.setAttribute("hasElm","true");
			refer.title.childs[0].elm.style.opacity = 0.5;
		}else {
			refer.listCont.elm.setAttribute("hasElm","false");		
			refer.title.childs[0].elm.style.opacity = 1;		
		};		
	};
	this.closeBtn.onclick = function(){
		refer.close();
	};
	
	this.initSavedList = function(){
		let delay = 0;
		refer.listCont.elm.innerHTML = "";
		let listCopy = [].concat(calcHistory.list);
			listCopy.reverse();
		for(let a of listCopy){
			let elm = new historyContElm(a);
			if(elm.elm){
				refer.listCont.addChild(elm.elm.elm);
				elm.delElm.onclick = function(){
					let youSure = confirm("Do you want to delete this?");
					if(youSure){
						let list = calcHistory.list;
						for(let str of list){
							if(a == str){
								calcHistory.list.splice(calcHistory.list.indexOf(a),1);
								localStorage.setItem(calcHistory.id,JSON.stringify(calcHistory.list));
								elm.elm.elm.setStyle({
									transform:"translateX(100%)",
									height:"0px",
									opacity:0,
								});
								setTimeout(()=>{
									elm.elm.elm.remove();
								},400);
								break;
							}
						};
						if(calcHistory.list.length == 0){
							refer.listCont.elm.setAttribute("hasElm","true");
							refer.title.childs[0].elm.style.opacity = 0.5;
						}
					}
				};
				elm.loadElm.onclick = function(){
					let youSure = confirm("Do you want to load this calculation?");
					if(youSure){
						window.open(a,"_self");
					}
				};
				//Animation on entry:
				elm.elm.elm.setStyle({
					transform:"translateY(200px)",
					opacity:0,
				});
				setTimeout(()=>{
					elm.elm.elm.setStyle({
						transform:"translateY(0px)",
						opacity:1,
					});
				},delay);			
				delay += 50;
			}
		}
	}
}