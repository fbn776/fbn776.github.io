function calcTimeDiff(now,then){
	var diff = now.getTime() - then.getTime();	
	var msec = diff;	
	var hh = Math.floor(msec / 1000 / 60 / 60);
	msec -= hh * 1000 * 60 * 60;
	var mm = Math.floor(msec / 1000 / 60);
	msec -= mm * 1000 * 60;
	var ss = Math.floor(msec / 1000);
	msec -= ss * 1000;
	
	return {
		hh:hh,
		mm:mm,
		ss:ss,
		ms:msec,
	};
}

function loadMatrixContElm(data,openAsFree = false){
	this.data = data;
	let name = data.name;
	var currTime = data.currTime;
	
	let nOrder = data.matrix.n,
		mOrder = data.matrix.m;
		
	var dateNow = new Date();
	var dateThen = new Date(data.dateObj);
	
	let timeDiff = calcTimeDiff(dateNow,dateThen);
	
	let timeDiffStr = "";
	
	if(timeDiff.hh){
		timeDiffStr = `${timeDiff.hh}h ${timeDiff.mm}m`;
	}else if(timeDiff.mm){
		timeDiffStr = `${timeDiff.mm}m`;		
	}else {
		timeDiffStr = `${timeDiff.ss}s`;
	}
	
	
	this.elm = new createElm("div",{
		attr:{class:"list-item-cont"},
		childs:[
			new createElm("div",{
				attr:{class:"upper-item-cont"},
				childs:[
					new createElm("div",{
						attr:{class:"main-img-cont"},
						childs:[
							new createElm("img",{attr:{src:"../../../../icons/matrix.png"}}),
						]
					}),
					new createElm("div",{
						attr:{class:"main-text-cont"},
						childs:[
							new createElm("name",{text:name}),
							new createElm("order",{text:`${nOrder}&times;${mOrder}`}),									
							new createElm("date",{text:timeDiffStr+" ago"}),									
						],
					}),
				],
			}),
			new createElm("div",{
				attr:{class:"lower-item-cont"},
				childs:[
					new createElm("img",{attr:{src:"../../../../icons/trash.png"}}),						
					new createElm("img",{attr:{src:"../../../../icons/arrows-maximize.png"}}),
				],
			}),
		]
	});
	let refer = this;
	this.deleteBtn = this.elm.childs[1].childs[0];
	this.viewBtn = this.elm.childs[1].childs[1];
	if(!openAsFree){
		let loadElm = new createElm("div",{
			attr:{class:"main-load-img-cont"},
			childs:[
				new createElm("img",{attr:{src:"../../../../icons/arrow-right.png"}}),
			]
		});
		refer.elm.childs[0].addChild(loadElm);
		this.loadBtn = loadElm;
	};
};

function loadWindow(){
	let refer = this;
	
	this.data = {
		hasCallback:false,
		callback:undefined,
	};
	this.restoreData = function(){
		refer.data = {
			hasCallback:false,
			callback:undefined,
		};
	}
	
	this.window = new createElm("window",{
		attr:{class:"loadWindow"},
	});	
	//Top part things:
	this.upper = new createElm("div",{
		attr:{
			class:"upper-cont",
		},
		childs:[
			new createElm("header",{text:"Saved Matrices"}),
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
	//Matrix display elm:
	this.matrixDisplayCont = new createElm("div",{attr:{class:"matrix-display-cont"},
		childs:[
			new createElm("div",{attr:{class:"matrix-display-bg"}}),
			new createElm("div",{attr:{class:"matrix-display-main"},
				childs:[
					new createElm("div",{text:"&times",attr:{class:"matrix-display-close-btn"}}),
					new createElm("div",{attr:{class:"matrix-display"}}),
					new createElm("div",{attr:{class:"matrix-display-name"},text:"Matrix A"}),				
				],
			}),
		]
	});
	
	
	this.window.addChild([this.upper,this.lower,this.matrixDisplayCont]);	
	document.body.appendChild(this.window.elm);	
	this.closeBtn = this.lower.childs[0].elm;	
	this.matrixTable = this.matrixDisplayCont.childs[1].childs[1].elm;
	this.matrixCloseBtn = this.matrixDisplayCont.childs[1].childs[0].elm;
	this.matrixBg = this.matrixDisplayCont.childs[0];
	this.matrixName = this.matrixDisplayCont.childs[1].childs[2].elm;
		
		
	this.openDisplayCont = function(){
		let elm = refer.matrixDisplayCont;
		elm.elm.setStyle({
			visibility:"visible",
			opacity:1,
		});
	}
	this.closeDisplayCont = function(){
		let elm = refer.matrixDisplayCont;
		let bg = elm.childs[0];
		
		elm.elm.setStyle({
			opacity:0,
		});
		setTimeout(()=>{
			refer.matrixTable.innerHTML = "";
			refer.matrixName.innerHTML = "";
			elm.elm.style.visibility = "hidden";
		},300);
	};
		
	this.matrixCloseBtn.onclick = refer.closeDisplayCont;
	this.matrixBg.elm.onclick = refer.closeDisplayCont;
	
	this.openMatrixViewer = function(m){
		refer.openDisplayCont();
		let name = m.name;
		let data = m.matrix;
		refer.matrixTable.innerHTML = "";
		refer.matrixName.innerHTML = name;
		let table = convertToTable(data);
		refer.matrixTable.appendChild(table);
	}
	
	
	//Set the height of list cont for scrolling
	var height = parseFloat(css(this.window.elm,"height"));	
	var listContPos = this.listCont.elm.getBoundingClientRect().top - height;
	var bottomPos = this.lower.elm.getBoundingClientRect().top - height;	
	let scrollWidth = bottomPos - listContPos;
	this.listCont.elm.style.height = scrollWidth+"px"
	
	
	
	this.close = function(){
		refer.restoreData();
		let win = refer.window.elm;
		win.setStyle({
			transform:"translateY(100%)",
			opacity:0,
		});
		setTimeout(function(){
			win.style.visibility = "hidden";
		},300);
	};
	
	
	this.open = function(callbackFunc){
		refer.restoreData();
		let win = refer.window.elm;
		win.setStyle({
			visibility:"visible",
			transform:"translateY(0%)",
			opacity:1,
		});
		refer.listCont.elm.innerHTML = "";
		if(callbackFunc){
			refer.data.hasCallback = true;
			refer.data.callback = callbackFunc;
		};
		
		setTimeout(function(){
			refer.initSavedList();
		},350);
		if(savedMatrix.list.length == 0){
			refer.listCont.elm.setAttribute("hasElm","true");
			refer.title.childs[0].elm.style.opacity = 0.5;
		}else {
			refer.listCont.elm.setAttribute("hasElm","false");		
			refer.title.childs[0].elm.style.opacity = 1;		
		}
	};
	this.openAsFreeWin = function(callbackFunc){
		refer.restoreData();
		let win = refer.window.elm;
		win.setStyle({
			visibility:"visible",
			transform:"translateY(0%)",
			opacity:1,
		});
		refer.listCont.elm.innerHTML = "";
		if(callbackFunc){
			refer.data.hasCallback = true;
			refer.data.callback = callbackFunc;
		};
		
		setTimeout(function(){
			refer.initSavedList(true);
		},350);
		if(savedMatrix.list.length == 0){
			refer.listCont.elm.setAttribute("hasElm","true");
			refer.title.childs[0].elm.style.opacity = 0.5;
		}else {
			refer.listCont.elm.setAttribute("hasElm","false");		
			refer.title.childs[0].elm.style.opacity = 1;		
		}
	};
	
	
	this.closeBtn.onclick = function(){
		refer.close();
	};
	this.title.childs[0].elm.onclick = function(){
		if(savedMatrix.list.length > 0){
			let youSure = confirm("Do you want to delete all the saved matrices?");
			if(youSure){
				savedMatrix.list = [];
				let list = JSON.stringify(savedMatrix.list);
				localStorage.setItem(savedMatrix.id,list);
				let delay = 0;
				let childrens = refer.listCont.elm.children
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
				refer.listCont.elm.setAttribute("hasElm","true");
				refer.title.childs[0].elm.style.opacity = 0.5;
			}
		}
	};
	this.initSavedList = function(openAsFree = false){
		let delay = 0;
		refer.listCont.elm.innerHTML = "";
		let savedListCopy = [].concat(savedMatrix.list);
			savedListCopy.reverse();
		for(let a of savedListCopy){
			let elm = new loadMatrixContElm(a,openAsFree);
			refer.listCont.addChild(elm.elm);
			
			elm.viewBtn.elm.onclick = function(){
				refer.openMatrixViewer(a);
			}
			//Animation on entry:
			elm.elm.elm.setStyle({
				transform:"translateY(200px)",
				opacity:0,
			});
			setTimeout(()=>{
				elm.elm.elm.setStyle({
					transform:"translateX(0px)",
					opacity:1,
				});
			},delay);
			
			let orderElm = elm.elm.elm.getElementsByTagName("order")[0];
			let dateElm = elm.elm.elm.getElementsByTagName("date")[0];
		
			orderWidth = css(orderElm,"width");
			dateElm.style.left = `calc(${orderWidth} + 8px + 6px)`;
			if(!openAsFree){
				elm.loadBtn.elm.onclick = function(){
					var youSure = confirm("Do you want to load '"+a.name+"' ?");
					if(youSure){
						if(refer.data.hasCallback){
							refer.data.callback(a);
							refer.close();
						}
					}
				}
			}
					
			elm.deleteBtn.elm.onclick = function(){
				let youSure = confirm("Do you want to delete '"+a.name+"'?");
				if(youSure){
					let index = savedMatrix.list.indexOf(a);
					savedMatrix.list.splice(index,1);					
					let list = JSON.stringify(savedMatrix.list);
					localStorage.setItem(savedMatrix.id,list);
					
					elm.elm.elm.setStyle({
						transform:"translateX(100%)",
						height:"0px",
						opacity:0,
					});
					setTimeout(()=>{
						elm.elm.elm.remove();
					},400);
					
					if(savedMatrix.list.length == 0){
						refer.listCont.elm.setAttribute("hasElm","true");
						refer.title.childs[0].elm.style.opacity = 0.5;					
					}else {
						refer.listCont.elm.setAttribute("hasElm","false");		
						refer.title.childs[0].elm.style.opacity = 1;					
					}
				}
			};
			
			
			delay += 50;
		}
	}
}