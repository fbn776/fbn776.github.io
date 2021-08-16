
function matrixCreator(saveWindowObj,loadWindowObj){
//Options:
	this.maxOrder = 15;
	this.cellWidth = 45;
	this.cellHeight = 45;
	
	this.return = {};
	this.load = {
		hasLoad:true,
	};

//Support and other quickies:
	this.br = new createElm("br");
	
	const refer = this;

//Main HTML section:
	this.main = new createElm("matrix-creator");
	//Add the main window to the document:
	document.body.appendChild(this.main.elm)
	
//Order section
	this.order = new createElm("window",{attr:{id:"order"},
		childs:[
			//Headers:
			new createElm("window-a-header",{text:"Matrix Creator"}),
			new createElm("window-b-header",{text:"Order"}),
			//Correct spacing: 
			this.br,this.br,this.br,
			//Content:
			new createElm("content",{
				childs:[
					//Inputs elm for m:
					new createElm("input-elm",{
						childs:[
							new createElm("label",{text:"m: "}),
							new createElm("input",{attr:{placeholder:"Rows",type:"number",}}),
						],
					}),
					//Inputs elm for n:
					new createElm("input-elm",{
						childs:[
							new createElm("label",{text:"n: "}),
							new createElm("input",{attr:{placeholder:"Columns",type:"number"}}),
						]
					}),
					//Is square check box
					new createElm("input-elm",{
						childs:[
							new createElm("label",{text:"Is square: "}),
							new createElm("input",{attr:{type:"checkbox"}})
						]
					}),
					//Load button:
					new createElm("input-elm",{
						attr:{class:"order-input-btns"},
						childs:[
							new createElm("button",{text:"Load"}),
						]
					}),
				],
			}),
			//Buttons for going back and next
			new createElm("buttons",{
				childs:[
					new createElm("button",{attr:{class:"alert"},text:"Cancel"}),
					new createElm("button",{attr:{class:"promt"},text:"Next"}),
				],
			}),
		]
	});
	//Add sub window(order) to main window(main):
	this.main.addChild([this.order]);
	//Oder window sub elms:
	
	//Order Content elms:
	//content:
	this.orderContent = this.order.childs[5];	
	//Input[type=number] for n:
	this.nInput = this.orderContent.childs[0].childs[1];
	//Input[type=number] for m:		
	this.mInput = this.orderContent.childs[1].childs[1];
	//Input[type=checkbox] for isSquare:
	this.isSqInput = this.orderContent.childs[2].childs[1];	
	//Load button for loading matrices:
	this.loadBtn = this.orderContent.childs[3].childs[0];
	//Order buttons:
	//Cancel btn:
	this.goHome = this.order.childs[6].childs[0];
	//Next btn:
	this.goNext = this.order.childs[6].childs[1];
	
	this.resetOrder = function(){
		this.nInput.elm.value = "";
		this.mInput.elm.value = "";
		this.isSqInput.elm.checked = false;
	};
	
	//Code for check if order are correct and keyboard control:
	this.last_edited_order_input = this.nInput.elm;	
	let n_m_inputs = [this.nInput,this.mInput];
	for(let i=0;i<n_m_inputs.length;i++){
		let currInput = n_m_inputs[i];
		currInput.elm.addEventListener('input',function(){
			//Converts non-int value to ints:
			this.value = isInt(this.value)?this.value:toInt(this.value);			
			refer.last_edited_order_input = this;			
			if(this.value > refer.maxOrder){
				showError("overflow","Maxium supported value is "+refer.maxOrder);
				this.value = refer.maxOrder;
			}
			if(this.value < 0){
				showError("underflow","Order cannot be negative");
				this.value = 1;
			}
			if(refer.isSqInput.elm.checked){
				if(i == 0){n_m_inputs[1].elm.value = this.value}
				else{n_m_inputs[0].elm.value = this.value};
			}
		});
		currInput.elm.addEventListener('keydown',function(e){
			switch(e.keyCode){
				case 13:
					if(i == 0){n_m_inputs[1].elm.focus()};
				break;
				case 8:
					if(i == 1){setTimeout(()=>{n_m_inputs[0].elm.focus()})}
				break;
			};
		});
	}
	this.isSqInput.elm.addEventListener('click',function(){
		if(this.checked){
			refer.nInput.elm.value = refer.last_edited_order_input.value;
			refer.mInput.elm.value = refer.last_edited_order_input.value;
		}
	});
	this.loadBtn.elm.onclick = function(){
		loadWindowObj.open(function(a){
			if(a.matrix){
				refer.setOrder(a.matrix.n,a.matrix.m);
				refer.load.matrix = a.matrix.matrix;
				goNextToCreateFunc();
				refer.msg("Sucessfully loaded '"+a.name+"'",3);
				//refer.setMatrix(a.matrix.matrix)
			}
		});
	}
//Table section	
	this.create = new createElm("window",{attr:{id:"creator"},
		childs:[
			//Header
			new createElm("window-a-header",{text:"Matrix Creator"}),
			this.br,this.br,this.br,
			//Content
			new createElm("content",{childs:[
				//Table content
				new createElm("table-cont",{childs:[
					new createElm("table"),
				]}),
				//Controls
				new createElm("ctrl",{childs:[
					//Clear,fill,fillEmpty... buttons content
					new createElm("input-elm",{childs:[
						new createElm("button",{text:"Clear all"}),
						new createElm("button",{text:"Fill all"}),
						new createElm("button",{text:"Fill empty"}),
						new createElm("button",{text:"Find and Replace"}),
						new createElm("button",{text:"Save"}),
					]}),
					//Load button
					new createElm("load-btn",{text:"Load Matrix",attr:{closed:"yes"},childs:[
						new createElm("ic",{text:"&plus;",attr:{type:"close",}}),
						new createElm("ic",{text:"&times;",attr:{type:"open",}}),
					]}),
					//Load button accordion panel
					new createElm("load-panel",{childs:[
						new createElm("cont",{childs:[
							new createElm("button",{text:"Identity Matrix",}),
							new createElm("button",{text:"Scalar Matrix"}),
							new createElm("button",{text:"Upper Triangle Matrix"}),
							new createElm("button",{text:"Lower Triangle Matrix"}),
						]}),
					]})
				]}),
			]}),
			//Buttons for going back and creating.
			new createElm("buttons",{childs:[
				new createElm("button",{attr:{class:"alert"},text:"Back"}),
				new createElm("button",{attr:{class:"promt"},text:"Create"}),
			]})
		]
	});
	//Add sub windows(create) to main window(main):
	this.main.addChild([this.create]);
	
	//Create window elements:
	this.aHdr = this.create.childs[0];
	this.createContent = this.create.childs[4];
	this.tableContent = this.createContent.childs[0];
	this.table = this.tableContent.childs[0];
	this.createCtrl = this.createContent.childs[1];
	this.loadPanel = this.createCtrl.childs[2];
	this.bottomBtns = this.create.childs[5];
	this.toOrderBtn = this.bottomBtns.childs[0];
	this.createBtn = this.bottomBtns.childs[1];
	//Object with all control buttons:
	this.ctrlBtns = {
		clearAll:this.createCtrl.childs[0].childs[0],
		fillAll:this.createCtrl.childs[0].childs[1],
		fillEmpty:this.createCtrl.childs[0].childs[2],
		findAndReplace:this.createCtrl.childs[0].childs[3],
		save:this.createCtrl.childs[0].childs[4],
		load:this.createCtrl.childs[1],
		loadIdentity:this.loadPanel.childs[0].childs[0],
		loadScalar:this.loadPanel.childs[0].childs[1],
		loadUpTri:this.loadPanel.childs[0].childs[2],
		loadDownTri:this.loadPanel.childs[0].childs[3],
	};
	//function for opening and closing accordion panel
	this.openOrCloseLoadPanel = function(){
		let load_elm = refer.ctrlBtns.load;
		state = load_elm.elm.getAttribute("closed");
		if(state == "yes"){
			load_elm.elm.setAttribute("closed","no");			
		}else {
			load_elm.elm.setAttribute("closed","yes");
		}
		let panel = refer.loadPanel.elm;
		if(panel.style.maxHeight) {
			panel.style.maxHeight = null;
		}else {
			panel.style.maxHeight = panel.scrollHeight + "px";
		}
	}
	this.ctrlBtns.load.elm.onclick = this.openOrCloseLoadPanel;
	
	//Matrix table creating code:
	this.details = {
		cells:[],
	};
	
	this.emptyTable = function(){
		//Make details default:
		this.details.cells = [];		
		for(let a of this.table.childs){a.remove()};
		this.table.elm.innerHTML = "";
		
	}
	//Creates an empty table of order n×m
	this.createTable = function(n,m){
		//Before creating the table, empty the table:
		this.emptyTable();	
		//Make details default:
		this.details.cells = [];		
		//Main table creating code:
		this.table.elm.setAttr({n:n,m:m});		
		let inputIndex = 0;
		for(let cols=0;cols<n;cols++){
			let tr = new createElm("tr",{attr:{colNo:cols+1}});
			for(let rows=0;rows<m;rows++){
				let td = new createElm("td",{style:{width:this.cellWidth+"px",height:this.cellHeight+"px"},attr:{i:rows+1,j:cols+1},childs:[new createElm("label",{text:`${cols+1} ${rows+1}`})]});
				let td_input = new createElm("input",{attr:{type:"number",n:rows+1,m:cols+1,index:inputIndex,placeholder:`...`}});
				td_input.addTo(td.elm);				
				this.details.cells.push(td_input);				
				td.addTo(tr.elm);
				inputIndex ++;
			};
			tr.addTo(this.table.elm);
		};
		for(let i=0;i<this.details.cells.length;i++){
			let curr = this.details.cells[i].elm;
			//When on focus color the box
			curr.onfocus = function(){
				this.parentElement.style.borderColor = "#2979FF";
				this.parentElement.style.backgroundColor = "#BBDEFB";	
			};
			//When unfocused restore the color
			curr.onblur = function(){
				this.parentElement.style.borderColor = "#313131";
				this.parentElement.style.backgroundColor = "white";		
			};
			curr.onkeydown = function(e){
				if(e.keyCode === 13 && i < (refer.details.cells.length-1)){
					refer.details.cells[i+1].elm.focus();
				};
				if(e.keyCode === 8 && i > 0){
					refer.details.cells[i-1].elm.focus();
				}
			};
		};		
		//Set the width and heights of the table to specific values
		this.tableWidth = css(this.table.elm,"width");
		this.tableHeight = css(this.table.elm,"height");
		this.table.elm.parentElement.style.height = this.tableHeight;		
		if(parseInt(this.tableHeight) > (window.innerHeight*0.6)){
			this.table.elm.parentElement.style.height = `50%`;
		}else {
			this.table.elm.parentElement.style.height = this.tableHeight;			
		}
		if(parseInt(this.tableWidth) > (window.innerWidth*0.9)){
			this.table.elm.parentElement.style.width = `calc(100% - 16px)`;
		}else {this.table.elm.parentElement.setStyle({width:this.tableWidth,margin:`auto`})};				
		//Set and updating height of the "create content" code:
		let contH = parseInt(css(this.createContent.elm,"height"));
			contH = (contH / window.innerHeight)*100;			
		this.createContent.elm.style.height = contH+"%";		
		this.aHdrHeight = parseFloat(css(this.aHdr.elm,"height"));			
		this.btnsHeight = parseFloat(css(this.bottomBtns.elm,"height"));		
		this.createContHeight = `calc(100% - ${this.aHdrHeight}px - ${this.btnsHeight+40}px)`;	
		this.createContent.elm.style.height = this.createContHeight;
	};
	
	//Returns the order of the table as an object {n,m}
	this.getOrder = function(elm){return {n:toNum(elm.getAttribute("n")),m:toNum(elm.getAttribute("m"))}}
	this.getMatrix = function(){
		
		let d = [];
		for(let a of this.details.cells){
			d.push(toNum(a.elm.value));
		};
		return d;
	};
	this.getMatrixData = function(){
		let order = this.getOrder(this.table.elm);
		return {n:order.n,m:order.m,matrix:this.getMatrix()};
	};
	this.msg = function(m,t){new createMessage(m,t || 0)};
	this.numPrompt = function(txt){
		let val = prompt(txt);
		let returnVal = {sucess:false};
		if(val){
			if(isNum(val)){returnVal.sucess = true;returnVal.value = toNum(val)}
			else{refer.msg("Input should be a number");returnVal.sucess = false};
		}else{returnVal.sucess = false;(val===null)?refer.msg("Cancelled",1):refer.msg("No input found")};
		return returnVal;
	};
	
	//Set custom datas:
	this.setOrder = function(m,n){
		//if(n && m){
			this.nInput.elm.value = m;
			this.mInput.elm.value = n;
		//}
	};
	this.setMatrix = function(obj){
		if(obj && (this.details.cells.length == obj.length)){
			for(let i=0;i<this.details.cells.length;i++){
				this.details.cells[i].elm.value = obj[i];
			}
		}
	};
	
	//Matrix formatting functions:
	this.fillTableValues = function(val){val = val ?? "";for(let a of this.details.cells){a.elm.value = val}};
	this.clearTableValues = function(){this.fillTableValues()};
	this.findAndReplace = function(find,rep){let count = 0;for(let a of this.details.cells){let val = a.elm.value;if(String(val) == String(find)){a.elm.value = rep;count ++}};return count};
	this.fillEmptyValues = function(fill){return this.findAndReplace("",fill)};
	//Matrix loaders
	this.loadScalarMatrix = function(val){
		let order = this.getOrder(this.table.elm);
		if(order.n == order.m){
			for(let a of this.details.cells){
				let pos = this.getOrder(a.elm);
				if(pos.n == pos.m){a.elm.value = val}else {a.elm.value = 0}
			}
		}
	};
	this.loadIdentityMatrix = function(){
		this.loadScalarMatrix(1); 
	};
	this.loadTriangleMatrix = function(val,upOrDown){
		//By default produces a upper triangle matrix. on upOrDown = true, it produces a lower triangle matrix
		upOrDown = upOrDown || false;
		let order = this.getOrder(this.table.elm);
		if(order.n == order.m){
			for(let a of this.details.cells){
				let pos = this.getOrder(a.elm);
				if(upOrDown){
					if(pos.n >= pos.m){a.elm.value = val}
					else {a.elm.value = 0}
				}else {
					if(pos.n <= pos.m){a.elm.value = val}
					else {a.elm.value = 0}
				}
			}
		}
	};
	
	
	//Append the matrix formatting to buttons:
	this.ctrlBtns.clearAll.elm.onclick = function(){
		let youSure = confirm("Do you want to clear the matrix?");
		if(youSure){refer.clearTableValues();refer.msg("Sucessfully cleared all the values of matrix",3);
		}else {refer.msg("Cancelled",1)}
	};
	this.ctrlBtns.fillAll.elm.onclick = function(){
		let fill = refer.numPrompt("Enter number to fill with:");
		if(fill.sucess){
			refer.fillTableValues(fill.value);
			refer.msg("Sucessfullly filled",3);
		};
	};
	this.ctrlBtns.fillEmpty.elm.onclick = function(){
		let fill = refer.numPrompt("Enter number to fill empty cells with:");
		if(fill.sucess){
			let count = refer.fillEmptyValues(fill.value);
			refer.msg(`Sucessfullly filled ${count} spots`,3);
		};
	};
	this.ctrlBtns.findAndReplace.elm.onclick = function(){
		let find = refer.numPrompt("Enter number to search for:");
		if(find.sucess){
			let rep = refer.numPrompt("Enter number to replace with:");
			if(rep.sucess){
				let count = refer.findAndReplace(find.value,rep.value);
				refer.msg(`Sucessfully replaced ${count} elements`,3);
			};
		}
	};
	this.ctrlBtns.save.elm.onclick = function(){
		let isValid = refer.isValidMatrix();
		if(isValid.sucess){
			let currMatrix = refer.getMatrixData();
			saveWindowObj.open(currMatrix);
		}else {
			refer.msg("Incomplete data");
		}
	}
	//Load buttons:
	this.ctrlBtns.loadIdentity.elm.onclick = function(){
		let order = refer.getOrder(refer.table.elm);
		if(order.n === order.m){
			let youSure = confirm("Do you want to load an Identity matrix?");		
			if(youSure){
				refer.loadIdentityMatrix();
				refer.msg("Sucessfullly loaded an identity matrix",3);
			}else {refer.msg("Cancelled",1)};
		}else {refer.msg("Current matrix is not a square matrix")}
	};
	this.ctrlBtns.loadScalar.elm.onclick = function(){
		let order = refer.getOrder(refer.table.elm);
			if(order.n === order.m){
			let num = refer.numPrompt("Enter scalar number:");
			if(num.sucess){
				refer.loadScalarMatrix(num.value);
				refer.msg("Sucessfullly loaded a scalar matrix",3);			
			};
		}else {refer.msg("Current matrix is not a square matrix")}
	};
	function trainleMatrixEvent(tf){
		let order = refer.getOrder(refer.table.elm);
		if(order.n === order.m){
			let num = refer.numPrompt("Enter scalar number:");
			if(num.sucess){
				refer.loadTriangleMatrix(num.value,tf);
				refer.msg(`Sucessfully loaded ${tf?"an upper":"a lower"} triangular matrix`,3);
			};
		}else {refer.msg("Current matrix is not a square matrix")}
	};
	this.ctrlBtns.loadUpTri.elm.onclick =()=>{trainleMatrixEvent(true)};
	this.ctrlBtns.loadDownTri.elm.onclick =()=>{trainleMatrixEvent(false)};

	//Opening and closing of order window:
	this.closeOrder = function(){this.order.elm.setStyle({opacity:0,transform:"translateX(-100%)"})};
	this.openOrder = function(){this.order.elm.setStyle({opacity:1,transform:"translateX(0%)"})}
	//Opening and closing of create windo:
	this.openCreate = function(){this.create.elm.setStyle({visibility:"visible",opacity:1,transform:"translateX(0%)"})};
	this.closeCreate = function(){
		this.create.elm.setStyle({opacity:0,transform:"translateX(100%)"});
		setTimeout(()=>{this.create.elm.style.visibility = "hidden"},300);
		if(this.ctrlBtns.load.elm.getAttribute("closed") == "no"){
			this.openOrCloseLoadPanel();
		}
	}
	
	
	//Event support functions:
	this.isValidOrder = function(){
		let data = {sucess:true};
		let n = refer.nInput.elm.value;
		let m = refer.mInput.elm.value;
		if(n && m){
			if(n >= 1 && m >= 1){
				if(isInt(n) && isInt(m)){
					data = {sucess:true,n:toNum(n),m:toNum(m)};
				}else {data.sucess = false;refer.msg("Order needs to be an integer")}
			}else {data.sucess = false;refer.msg("Order cannot be less than 1")}
		}else {refer.msg("Order cannot be empty");data.sucess = false};
		return data;
	};	
	//Go to create window event:
	this.goNext.elm.onclick = goNextToCreateFunc;
	function goNextToCreateFunc(){
		let data = refer.isValidOrder();
		if(data.sucess){
			//Close the order and open the create
			refer.closeOrder();
			refer.openCreate();
			//Create the table:
			refer.createTable(data.n,data.m);
			//If has a load matrix, then load it.
			if(refer.load.hasLoad && refer.load.matrix){
				refer.setMatrix(refer.load.matrix);
			}
		}
	}	
	//Go to order window event:
	this.toOrderBtn.elm.onclick = function(){
		let youSure = confirm("Do you want to go back?");
		if(youSure){
			refer.closeCreate();
			refer.openOrder();
			refer.emptyTable();
		}else {
			refer.msg("Cancelled",1)
		}
	};
	
	//Create the matrix
	this.isValidMatrix = function(){
		let result = {sucess:true};
		for(let i=0;i<this.details.cells.length;i++){
			let curr = this.details.cells[i];
			if(!curr.elm.value){
				result.sucess = false;
				result.elm = curr;
				result.reason = "Empty cell";
				break;
			}else if(!isNum(curr.elm.value)){
				result.sucess = true;
				result.elm = curr;
				result.reason = "Not a number";
				break;
			}
		}
		return result;
	}
	//-->
	
	this.createBtn.elm.onclick = function(){
		let proceed = refer.isValidMatrix();
		if(proceed.sucess){
			refer.return.update({
				endTime:Date.now(),
				sucess:true,
				matrix:refer.getMatrixData(),
			});
			refer.closeWindow();
			refer.msg(`Sucessfully created a matrix of order ${refer.return.matrix.n}&times;${refer.return.matrix.m}`,3);
		}else {
			let errorAt = proceed.elm,
				reason = proceed.reason;
			let pos = refer.getOrder(errorAt.elm);
			errorAt.elm.focus();
			refer.msg(`${reason} at a<sub><sub><sub>${pos.n} ${pos.m}</sub></sub></sub>`);
			errorAt.elm.parentElement.setStyle({
				borderColor:"#EF5350",
				backgroundColor:"#EF9A9A",
			});
		}
	};
	
	//Go back to main body:
	this.goHome.elm.onclick = function(){
		refer.closeWindow();
	};
	
	//Opening and closing of the main window
	
	//Window changer codes:
	this.openWindow = function(call,load){
		this.return = {};
		this.load = {
			hasLoad:(load?true:false),
		};
		
		this.return = {
			sucess:false,
			startTime:Date.now(),
			func:call,
		};
		//Load custom matrix to the table:
		if(load){
			if(isNum(load.n) && isNum(load.m)){
				this.load.n = load.n;
				this.load.m = load.m;
				this.setOrder(load.n,load.m);
				if(load.matrix && Matrix.isMatrix(load)){
					this.load.matrix = load.matrix;
				}
			};
		};
		this.main.elm.setStyle({
			visibility:"visible",
			transform:"translateY(0%)",
			opacity:1,
		});
	}
	this.closeWindow = function(ret){
		this.return.update(ret || {});
		this.resetOrder();
		this.emptyTable();
		this.main.elm.setStyle({
			transform:"translateY(100%)",
			opacity:0,
		});
		setTimeout(function(){
			refer.main.elm.style.visibility = "hidden";
			refer.closeCreate();
			refer.openOrder();
		},300);
		if(this.return.func){
			this.return.func(refer.return);
		}
	};
}