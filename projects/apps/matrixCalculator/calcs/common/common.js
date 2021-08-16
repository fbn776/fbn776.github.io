//Constants:
const maxCalcArrayLimit = 50;

//Set body height correctly
const body = {
	cont:s(".main_content"),
	footer:s(".footer"),
};
body.cont.style.minHeight = `calc(100% - 20px - ${css(body.footer,"height")})`;

//Code for suggesting other calculations.
const otherThingsCont = s(".suggested .cont");
if(!isNaN(prevIndex)){
	let obj = supportCalcList[prevIndex];
	let btn = document.createElement("button");
	btn.setAttribute("class","prevLinkBtn");
	let name = obj.name;
	let url = obj.src;
	url = url.replace("calcs/","");
	btn.innerHTML = `<a href="${url}">${name}</a>`;
	otherThingsCont.appendChild(btn);
}
if(!isNaN(nextIndex)){
	let obj = supportCalcList[nextIndex];
	let btn = document.createElement("button");
	btn.setAttribute("class","nextLinkBtn");	
	let name = obj.name;
	let url = obj.src;
	url = url.replace("calcs/","");
	btn.innerHTML = `<a href="${url}">${name}</a>`;
	otherThingsCont.appendChild(btn);
};
otherThingsCont.innerHTML += `<button id="history_btn"><a href="#">History</a></button><button><a id="saved_matrix_btn">Saved Matrices</a></button>`;


function convertToTable(obj,singleValueMode){
	let table = document.createElement("table");
	table.setAttribute("class","matrix_display_table");
	if(!singleValueMode){
		let arr = Matrix.extractMatrixByRow(obj);
		table.setAttribute("order",`[${obj.n},${obj.m}]`);
		var order = document.createElement("order");
			order.innerHTML = `${obj.n}&times;${obj.m}`;
		table.appendChild(document.createElement("left"));
		for(let row of arr){
			let tr = document.createElement("tr");
			for(let cell of row){
				let td = document.createElement("td");
				td.innerHTML = cell;
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		table.appendChild(document.createElement("right"));
		table.appendChild(order);
	}else {
		table.innerHTML = obj;
		table.style.fontWeight = 800
		table.style.fontSize = "15px";
	}
	return table;
};

//Input node element:
function inputMatrixCont(to,obj){
	this.mainElm = new createElm("div",{
		attr:{class:"matrix-main-cont"},
	});
	this.title = new createElm("div",{
		attr:{class:"name"},
		text:obj.text,
	});
	this.calcCont = new createElm("div",{
		attr:{class:"matrix-calc-cont"},
	});
	//calcCont elements:
	this.btn = new createElm("div",{
		attr:{class:"create-new-btn"},
		childs:[new createElm("button",{text:"Create"})],
	});
	this.display = new createElm("div",{
		attr:{class:"display"}
	});
	this.edit = new createElm("div",{
		attr:{class:"edit"},
		childs:[
			new createElm("img",{attr:{src:"../../../../icons/edit.png"}}),
			new createElm("img",{attr:{src:"../../../../icons/trash.png"}}),		
			new createElm("img",{attr:{src:"../../../../icons/bookmark.png"}}),
		],
	});
	this.calcCont.addChild([this.btn,this.display,this.edit]);
	this.mainElm.addChild([this.title,this.calcCont]);
	this.mainElm.addTo(to);
}
//Input node setter
function setInputMatrixCont(name,callback = function(){},inVal){
	let refer = this;
	this.data = {
		isEditOpen:false,
		isBtnOpen:true,
		hasTable:false,
		tableElm:undefined,
		matrix:undefined,
		lastTime:null,
		hasLoad:false,
	};
	this.takeLoad = function(n,m){
		refer.data.hasLoad = true;
		refer.data.loadOrder = [n,m];
	}
	this.cancelLoad = function(){
		refer.data.hasLoad = false;
		refer.data.loadOrder = undefined;
	};
	const to = s(".calc-area");
	
	var elm = new inputMatrixCont(to,{text:name});
	this.elm = elm;
	this.hideCreateBtn = function(){
		refer.data.isBtnOpen = false;
		elm.btn.elm.style.opacity = 0;
		setTimeout(function(){
			elm.btn.elm.style.visibility = "hidden";
		},300);
	};
	this.showCreateBtn = function(){
		refer.data.isBtnOpen = true;
		elm.btn.elm.setStyle({
			opacity:1,
			visibility:"visible",
		});
	};	
	this.hideEdit = function(){
		refer.data.isEditOpen = false;
		elm.edit.elm.style.transform = "translateY(100%)";
	};
	this.showEdit = function(){
		refer.data.isEditOpen = true;		
		elm.edit.elm.style.transform = "translateY(0%)";		
	};	
	this.displayTable = function(data){
		let display = elm.display.elm;
		if(data){
			let table = convertToTable(data);
			refer.data.hasTable = true;
			refer.data.tableElm = table;
			refer.data.matrix = data;
			refer.data.lastTime = Date.now();
			display.innerHTML = "";
			display.appendChild(table);
			refer.hideCreateBtn();
			refer.showEdit();
			callback(refer);
			refer.cancelLoad();
		};
	};
	this.deleteTable = function(){
		if(refer.data.hasTable){
			refer.hideEdit();
			var tableElm = refer.data.tableElm;
			var td = tableElm.getElementsByTagName("td")
			let order = tableElm.getElementsByTagName("order")[0];
			let left = tableElm.getElementsByTagName("left")[0];
			let right = tableElm.getElementsByTagName("right")[0];
			order.remove();
			let timing = 8;
			let i = timing * td.length;
			let count = td.length;
			for(let a of td){
				i -= timing;
				setTimeout(function(){
					count --;
					let time = i;
					a.remove();
					if(count <= 0){
						tableElm.style.opacity = 0;
						tableElm.style.transform = "scale(2)";
						setTimeout(()=>{
							tableElm.remove();
							refer.showCreateBtn();
						},300);
					}
				},i);
			};
			refer.data.hasTable = false;
			refer.data.tableElm = undefined;
			refer.data.matrix = {};
			//When deleting a input matrix, make it so that the other inputs are cleared of the matrix load
			callback(refer,true);
		};
	};
	this.onCreateClick = function(){
		let data = {};
		if(refer.data.hasLoad){
			data.n = refer.data.loadOrder[0] || "";
			data.m = refer.data.loadOrder[1] || "";
		}
		creator.openWindow(function(result){
			if(result.sucess){
				refer.displayTable(result.matrix);
			}
		},data);
	};
	
	this.loadMatrix = function(matrix = {}){
		if(Matrix.isMatrix(matrix)){
			refer.displayTable(matrix);
		}
	}	
	elm.btn.childs[0].elm.onclick = refer.onCreateClick;
	elm.edit.childs[0].elm.onclick = function(){
		creator.openWindow(function(result){
			if(result.sucess){
				refer.displayTable(result.matrix);
			}
		},refer.data.matrix);
	};	
	elm.edit.childs[1].elm.onclick = function(){
		let youSure = confirm("Do you want to delete the matrix?");
		if(youSure){
			refer.deleteTable();
		}
	}
	elm.edit.childs[2].elm.onclick = function(){
		if(refer.data.hasTable){
			let curr = this;
			saveWin.open(refer.data.matrix);
		}
	}
}
function resultMatrixCont(to){
	let refer = this;
	this.mainElm = new createElm("div",{
		attr:{class:"matrix-main-cont result-cont"},
	});
	this.title = new createElm("div",{
		attr:{class:"name"},
		text:"Result",
	});
	this.calcCont = new createElm("div",{
		attr:{class:"matrix-calc-cont"},
	});
	//calcCont elements:
	this.display = new createElm("div",{
		attr:{class:"display"}
	});
	this.edit = new createElm("div",{
		attr:{class:"edit"},
		childs:[
			new createElm("img",{attr:{src:"../../../../icons/share.png"}}),
			new createElm("img",{attr:{src:"../../../../icons/trash.png"}}),		
			new createElm("img",{attr:{src:"../../../../icons/bookmark.png"}}),		
		],
	});
	this.calcCont.addChild([this.display,this.edit]);
	this.mainElm.addChild([this.title,this.calcCont]);
	this.mainElm.addTo(to);
};
function setResultMatrixCont(shareFunc=function(){},singleValueMode = false){	
	let refer = this;
	//functions:
	this.data = {
		hasTable:false,
		matrix:undefined,
	};
	var elm = new resultMatrixCont(s(".result-area"));
	this.cont = elm;
	let mainElm = elm.mainElm.elm;
	this.show = function(){
		mainElm.style.maxHeight = mainElm.scrollHeight*10 + "px";
		mainElm.style.opacity = 1;
		mainElm.style.transform = "scale(1)";
	};
	this.hide = function(){
		mainElm.style.maxHeight = null;
		mainElm.style.opacity = 0;
		mainElm.style.transform = "scale(0)";	
	}	
	this.hideEdit = function(){
		elm.edit.elm.style.transform = "translateY(100%)";
	};
	this.showEdit = function(){
		elm.edit.elm.style.transform = "translateY(0%)";		
	};	
	this.displayTable = function(data,rule){
		let display = elm.display.elm;
		if(data){
			errorLog.hide();
			let table = convertToTable(data,singleValueMode);
			refer.data.hasTable = true;
			refer.data.tableElm = table;
			refer.data.matrix = data;
			refer.data.lastTime = Date.now();
			display.innerHTML = "";
			display.appendChild(table);
			refer.showEdit();
			refer.show();
			if(rule){
				refer.data.main = rule;
			}
		};
	};
	this.deleteTable = function(atLast){
		if(refer.data.hasTable){
			refer.hideEdit();
			var tableElm = refer.data.tableElm;
			if(!singleValueMode){
				var td = tableElm.getElementsByTagName("td")
				let order = tableElm.getElementsByTagName("order")[0];
				let left = tableElm.getElementsByTagName("left")[0];
				let right = tableElm.getElementsByTagName("right")[0];
				order.remove();
				let timing = 8;
				let i = timing * td.length;
				let count = td.length;
				for(let a of td){
					i -= timing;
					setTimeout(function(){
						count --;
						let time = i;
						a.remove();
						if(count <= 0){
							tableElm.style.opacity = 0;
							tableElm.style.transform = "scale(2)";
							setTimeout(()=>{
								tableElm.remove();
								atLast();
								errorLog.default();
								setTimeout(()=>{
									errorLog.show();
								},300);
							},300);
						}
					},i);
				};
			}else {
				tableElm.remove();
				atLast();
				errorLog.default();
				setTimeout(()=>{
					errorLog.show();
				},300);
			}
			refer.data.hasTable = false;
			refer.data.tableElm = undefined;
			refer.data.matrix = {};
			refer.data.main = {};
		};
	};
	this.hideResult = function(){
		refer.deleteTable(refer.hide);
		refer.data.hasTable = false;
		refer.data.matrix = {};
	}
	elm.edit.childs[1].elm.onclick = function(){
		let youSure = confirm("Do you want to delete this?");
		if(youSure){
			refer.hideResult();
		}
	};
	elm.edit.childs[0].elm.onclick = function(){
		shareFunc(refer);
	};
	
	if(!singleValueMode){
		elm.edit.childs[2].elm.onclick = function(){
			if(refer.data.hasTable){
				saveWin.open(refer.data.matrix);
			}
		}
	}else {
		elm.edit.elm.style.width = "70px"
		elm.edit.childs[2].elm.remove();
	}
};
function inputScalarCont(to,obj){
	this.mainElm = new createElm("div",{
		attr:{class:"matrix-main-cont"},
	});
	this.title = new createElm("div",{
		attr:{class:"name"},
		text:obj.text,
	});
	this.calcCont = new createElm("div",{
		attr:{class:"matrix-calc-cont"},
	});
	//calcCont elements:
	this.btn = new createElm("div",{
		attr:{class:"create-new-btn"},
		childs:[new createElm("button",{text:"Enter Value"})],
	});
	this.display = new createElm("div",{
		attr:{class:"display"},
	});
	this.edit = new createElm("div",{
		attr:{class:"edit"},
		childs:[
			new createElm("img",{attr:{src:"../../../../icons/edit.png"}}),
			new createElm("img",{attr:{src:"../../../../icons/trash.png"}}),
		],
	});
	this.edit.elm.style.width = "65px";
	this.calcCont.addChild([this.btn,this.display,this.edit]);
	this.mainElm.addChild([this.title,this.calcCont]);
	this.mainElm.addTo(to);
}
function setInputScalarMatrix(name,obj){
	let refer = this;
	this.data = {
		isEditOpen:false,
		isBtnOpen:true,
		lastTime:null,
		hasValue:false,
		value:undefined
	};
	obj = obj || {};
	const MIN = obj.min;
	const MAX = obj.max;
	const onlyInt = obj.onlyInt || false;
	
	const to = s(".calc-area");
	var elm = new inputScalarCont(to,{text:name})
	this.elm = elm;
	
	
	this.enterValue = function(txt){
		let val = prompt(txt);		
		let d = {result:true,val:undefined};
		if(isNum(val)){
			val = parseFloat(val);
			if(MIN){
				if(!(val >= MIN)){
					d.result = false;
					new createMessage("Input value should be greater than or equal to "+MIN);
					return val;
				}
			}
			if(MAX){
				if(!(val <= MAX)){
					d.result = false;
					new createMessage("Input value should be less than or equal to "+MAX);
					return val;
				}
			}
			if(onlyInt){
				if(!isInt(val)){
					d.result = false;
					new createMessage("Input should be an Integer number")
					return val;
				}
			};
		}else {
			new createMessage("Input value should be a number");
			d.result = false;
			return val;
		};
		
		if(d.result){
			d.val = val
		}
		return d;
	};
	
	this.hideCreateBtn = function(){
		refer.data.isBtnOpen = false;
		elm.btn.elm.style.opacity = 0;
		setTimeout(function(){
			elm.btn.elm.style.visibility = "hidden";
		},300);
	};
	this.showCreateBtn = function(){
		refer.data.isBtnOpen = true;
		elm.btn.elm.setStyle({
			opacity:1,
			visibility:"visible",
		});
	};	
	this.hideEdit = function(){
		refer.data.isEditOpen = false;
		elm.edit.elm.style.transform = "translateY(100%)";
	};
	this.showEdit = function(){
		refer.data.isEditOpen = true;		
		elm.edit.elm.style.transform = "translateY(0%)";		
	};
	
	this.displayValue = function(val){
		let display = elm.display.elm;
		if(val){
			display.innerHTML = "";
			refer.data.hasValue = true;
			refer.data.value = val;
			var holder = document.createElement("div");
			holder.setAttribute("class","matrixScalarText");
			holder.innerHTML = val;
			display.appendChild(holder)
			refer.hideCreateBtn();
			refer.showEdit();
		}
	}
	this.deleteValue = function(){
		let display = elm.display.elm;
		refer.data.hasValue = false;
		refer.data.value = undefined;
		display.innerHTML = "";
		refer.showCreateBtn();
		refer.hideEdit();
	}	
	
	elm.btn.childs[0].elm.onclick = function(){
		let obj = refer.enterValue("Enter Number:");
		if(obj.result){
			refer.displayValue(obj.val);
		}
	};
	elm.edit.childs[0].elm.onclick = function(){
		let youSure = confirm("Do you want to edit this value?");
		if(youSure){
			let obj = refer.enterValue("Enter Number:");
			if(obj.result){
				refer.displayValue(obj.val);
			}
		}
	};
	elm.edit.childs[1].elm.onclick = function(){
		let youSure = confirm("Do you want to delete this?")
		if(youSure){
			refer.deleteValue()
		};
	};
}

function errorMsg(){
	var elm = s("#error-msg");
	this.show = function(){
		elm.setStyle({
			opacity:1,
			display:"block",
		});
	};
	this.hide = function(){
		elm.style.opacity = 0;
		elm.style.display = "none";
	};
	this.default = function(){
		elm.innerHTML = "No calculations found";
	}
	this.log = function(txt){
		elm.innerHTML = txt;
	}
};

function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        return window.clipboardData.setData("Text", text);
    }
    else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        }
        catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        }
        finally {
            document.body.removeChild(textarea);
        }
    }
};
function shareFunc(refer){
	let str = ""+currURL;
	str = str.replace(location.search,"");
	if(str.endsWith("#")){
		str = str.substring(0,str.length-1);
	}
	let json = encodeURI(JSON.stringify(refer.data.main));
	str += `?data=`+json;
	var shareData = {
		title:'Share Matrix Calculations',
		url:str,
	}
	async function shareNow(){
		try{
			await navigator.share(shareData)
		}catch(err){
			let copied = copyToClipboard(shareData.url);
			if(copied){
				creator.msg("Link copied to the clipboard",3);
			}
		}
	};	
	shareNow();
};