/*Additional stuff to support to the main lib*/
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
Object.prototype.getKeys = function(){
	return Object.getOwnPropertyNames(this);
};
Object.prototype.getValues = function(){
	let keys = this.getKeys();
	let arr = [];
	for(let n of keys){arr.push(this[n])};
	return arr;
};
function isObj(a){
	return !!a && (a.constructor === {x:1}.constructor);
}
function isArray(a){
	return !!a && (a.constructor === [1,2].constructor);
}
function isInt(num){
	return Number.isInteger(num);
}
//Main code:
const Matrix = {
	//Main code
	create:function(data,n,m){
		if(isArray(data)){
			if(typeof (n+m) === typeof 10){
				if(isInt(n+m)){
					let matrix = {
						n:n,
						m:m,
						matrix:data,
					}
					if(Matrix.isMatrix(matrix)){
						return matrix;
					}else {
						throw new Error("Given data has errors in it");
					}
				}else {
					throw new Error("Given 'n' and 'm' are not integers");
				}
			}else {
				throw new Error("Given 'n' and 'm' are not numbers");
				return false;
			}
		}else {
			throw new Error("The input matrix should be an array");
			return false;
		}
	},
	toMatrix:function(arr){
		if(isArray(arr)){
			let n = arr.length,
				m = arr[0].length,
				main = [];
			for(let row of arr){
				if(row.length === m){
					for(let cell of row){
						main.push(cell);
					}
				}else {
					break;
					throw new Error(this.Errors.invalid);
				}
			};
			return {
				n:n,
				m:m,
				matrix:main,
			}
		}
	},
	isMatrix:function(A){
		let condition1 = isObj(A) && (typeof (A.n+A.m) === typeof 10) && (isInt(A.n+A.m));
		let condition2 = condition3 = false;
		if(condition1){
			condition2 = isArray(A.matrix) && (A.matrix.length === (A.n * A.m)) && (typeof A.matrix[0] === typeof 10);
			if(condition2){
				let first = A.matrix[0];
				let contTest = true;
				for(let a of A.matrix){
					let cont = (typeof a === typeof first);
					contTest = contTest && cont;
					if(!contTest){
						break;
					}
				}
				condition3 = contTest;
			}	
		}
		return condition1 && condition2 && condition3;
	},
	extractMatrixByRow:function(A,proceedDirect){
	//Extracts the each row into a new array and returns the array:
		proceedDirect = false || proceedDirect;
		if(proceedDirect || Matrix.isMatrix(A)){
			let matrix = A.matrix;
			let n = A.n,
				m = A.m;		
			let rows = [];
			for(let i=0;i<matrix.length;i+=m){
				let eachRow = matrix.slice(i,i+m);
				rows.push(eachRow);
			}
			return rows;
		}else {
			return false;
		}
	},	
	extractMatrixByCol:function(A,proceedDirect){
		proceedDirect = false || proceedDirect;
		let byRows = Matrix.extractMatrixByRow(A,proceedDirect);
		if(byRows){
			let matrix = A.matrix;
			let n = A.n,
				m = A.m;
			let main = [];
			for(let i=0;i<m;i++){
				let cols = [];
				for(let a of byRows){
					cols.push(a[i]);
				}
				main.push(cols);
			}
			return main;
		}else {
			return false;
		}
	},
	//Namimg issue:
	areMatrix:function(){
		let args = arguments;
		if(args.length > 0){
			let cont = true;
			for(let a of args){
				let curr = this.isMatrix(a);
				cont = cont && curr;
				if(!cont){
					break;
				}
			}
			return cont;
		}else {
			return false;
		}
	},
	hasSameOrder:function(A,B){
		return (A.n == B.n) && (A.m == B.m);
	},
	isEqual:function(A,B,proceedDirect){
		proceedDirect = false || proceedDirect;
		if(proceedDirect || this.areMatrix(A,B)){
			if(this.hasSameOrder(A,B)){
				let Am = A.matrix,
					Bm = B.matrix;
				let result = true;
				for(let i=0;i<Am.length;i++){
					let currA = Am[i];
					let currB = Bm[i];
					if(currA === currB){
						result = true;
					}else {
						result = false;
						break;
					}
				}
				return result;
			}else {
				return false;
			}
		}else {
			return false;
		}
	},
	clone:function(A,proceedDirect){
		proceedDirect = false || proceedDirect;		
		if(proceedDirect || this.isMatrix(A)){
			let clone = this.create(A.matrix,A.n,A.m);
			return clone;
		}else {
			return false;
		}
	},
	//Addition - Subtraction:
	add:function(A,B){
		if(this.areMatrix(A,B) && this.hasSameOrder(A,B)){
			let a = A.matrix,
				b = B.matrix;
			let n = A.n,
				m = A.m;
			let result = [];
			for(let i=0;i<a.length;i++){
				result.push(a[i] + b[i]);
			}
			return this.create(result,n,m);
		}else {
			if(!this.areMatrix(A,B)){
				throw new Error("Given data are not matrices ");
			}else if(!this.hasSameOrder(A,B)){
				throw new Error("Given matrices does not have same order");
			}
		}
	},
	sub:function(A,B){
		return this.add(A,this.neg(B));
	},
	//Multiplication:
	multByScalar:function(A,k,proceedDirect){
		//Multiplies a matrix with a scalar
		proceedDirect = false || proceedDirect;
		if(proceedDirect || (this.isMatrix(A) && (typeof k == typeof 10))){
			let B = this.clone(A,true);
			let arr = B.matrix;
			for(let i=0;i<arr.length;i++){
				arr[i] = arr[i]*k;
			}
			return B;
		}else {
			if(!this.isMatrix(A)){
				throw new Error("Given data must be a matrix");
			}else if(!(typeof k === typeof 10)){
				throw new Error("Scalar must be a number");
			}
		}
	},
	canMult:function(A,B){
		return A.m === B.n;
	},
	mult:function(A,B,proceedDirect){
		//Multiplies two matrices
		proceedDirect = false || proceedDirect;		
		if(proceedDirect || (this.areMatrix(A,B) && (A.m === B.n))){
			let a = this.extractMatrixByRow(A,true);
			let b = this.extractMatrixByRow(B,true);
			let x = a.length,
			z = a[0].length,
			y = b[0].length;
			let productRow = Array.apply(null, new Array(y)).map(Number.prototype.valueOf, 0);
			let product = new Array(x);
			for (let p = 0; p < x; p++) {
				product[p] = productRow.slice();
			}
			for (let i = 0; i < x; i++) {
				for (let j = 0; j < y; j++) {
					for (let k = 0; k < z; k++) {
						product[i][j] += a[i][k] * b[k][j];
					}
				}
			}
			let result = [];
			for(let a of product){
				result = result.concat(a);
			}
			result = this.create(result,A.n,B.m);
			return result;
			
		}else {
			if(!this.areMatrix(A,B)){
				throw new Error("Given data are not matrices ");
			}else if(!this.hasSameOrder(A,B)){
				throw new Error("Given matrices does not have same order");
			}
		}
	},
	power:function(A,power,proceedDirect){
		//Returns the nth power of the given matrix
		proceedDirect = false || proceedDirect;		
		if(proceedDirect || (this.isMatrix(A) && isInt(power) && power > 0)){
			let last = A;
			for(let i=1;i<power;i++){
				last = this.mult(last,A);
			}
			return last;
		}else {
			if(!this.isMatrix(A)){
				throw new Error("Given data is not a matrix");
			}else if(!isInt(power) || !(power > 0)){
				throw new Error("Power can only be an positive integer");
			}
		}
	},
	
	//Type of matrices:
	isSquare:function(A){
		//Check if n = m
		if(this.isMatrix(A)){
			return A.n === A.m;
		}else {
			throw new Error("Given data is not a matrix");
		}
	},
	
	identity:function(order){
		//Returns a identity matrix of the given order
		if(isInt(order)){
			let result = [];
			for(let r=0;r<order;r++){
				for(let c=0;c<order;c++){
					let val = 0;
					if(r == c){
						val = 1;
					}
					result.push(val);
				}
			}
			return this.create(result,order,order); 
		}else {
			throw new Error(this.Errors.orderNotInt);
		}
	},
	identityOf:function(A,proceedDirect){
		//Returns an identity matrix of order as that of the given one.
		proceedDirect = false || proceedDirect;		
		if(proceedDirect || (this.isMatrix(A) && this.isSquare(A))){
			return this.identity(A.n);
		}else {
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				throw new Error(this.Errors.notSq);
			}
		}
	},
	isIdentity:function(A,obj){
		//Checks if a_ij = 1 , when i = j and a_ij = 0, when i != j
		let checkFor = 1;
		if(obj){
			if(isObj(obj)){
				checkFor = obj.checkFor;
			}
		}
		if(this.isMatrix(A)){
			let n = A.n,
				m = A.m;
			let c1 = this.isSquare(A);
			if(c1){
				let rows = this.extractMatrixByRow(A);	
				let result = true;
				for(let x=0;x<rows.length;x++){
					let currRow = rows[x];
					let isRowCorrect = true;
					for(let y=0;y<currRow.length;y++){
						let currCell = currRow[y];
						if((currCell === 0) || (currCell === checkFor)){
							if(currCell === checkFor){
								if(x !== y){
									isRowCorrect = false;
									break;
								}
							}else {
								if(x === y){
									isRowCorrect = false;
									break;
								}
							}
						}else {
							isRowCorrect = false;
							break;
						}
					};
					result = result && isRowCorrect;
					if(!isRowCorrect){
						return false;
					}
				};
				return result;
			}else {
				return false;
			}
		}else {
			throw new Error(this.Errors.notMatrix);
		}
	},
	isDiagonal:function(A){
		//Checks if a_ij != 0, when i=j and a_ij = 0 , when i != j
		if(this.isMatrix(A)){
			let elm = A.matrix[0];
			return this.isIdentity(A,{
				checkFor:elm,
			});
		}else {
			throw new Error(this.Errors.notMatrix);
		}
	},
	isCol:function(A){
		//Checks if m = 0;
		if(this.isMatrix(A)){
			if(A.m === 1){
				return true;
			}else {
				return false;
			}
		}else {
			throw new Error(this.Errors.notMatrix);
		}
	},
	isRow:function(A){
		//Checks if n = 1
		if(this.isMatrix(A)){
			if(A.n === 1){
				return true;
			}else {
				return false;
			}
		}else {
			throw new Error(this.Errors.notMatrix);
		}
	},
	isZero:function(A){
		//Check if each elements are 0
		if(this.isMatrix(A)){
			let result = true;
			for(let a of A.matrix){
				if(a !== 0){
					result = false;
					break;
				}
			}
			return result;
		}else {
			throw new Error(this.Errors.notMatrix);
		}
	},
	neg:function(A){
		//Returns -A
		return this.multByScalar(A,-1);
	},
	transpose:function(A){
		//Returns A'
		if(this.isMatrix(A)){
			let byCols = this.extractMatrixByCol(A);
			let main = [];
			for(let a of byCols){
				main = main.concat(a);
			}
			let result = this.create(main,A.m,A.n);
			return result;
		}else {
			throw new Error(this.Errors.notMatrix);
		}
	},
	isSymmetric:function(A){
		//Checks if A = A'
		if(this.isMatrix(A) && this.isSquare(A)){
			let A_ = this.transpose(A);
			return this.isEqual(A,A_);
		}else {
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				return false;
			}
		}
	},
	isSkew:function(A){
		//Checks if A = -A'
		if(this.isMatrix(A) && this.isSquare(A)){
			let A_ = this.transpose(A);
			A_ = this.neg(A_);
			return this.isEqual(A,A_);
		}else {
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				return false;
			}
		}
	},
	symmetricOf:function(A){
		//Returns A+A'
		if(this.isMatrix(A) && this.isSquare(A)){
			let A_ = this.transpose(A);
			
			return this.add(A,A_);
		}else {
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				throw new Error(Errors.notSq);
			}
		}
	},
	skewOf:function(A){
		//Returns A-A'
		if(this.isMatrix(A) && this.isSquare(A)){
			let A_ = this.transpose(A);
			return this.sub(A,A_);
		}else {
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				throw new Error(Errors.notSq);
			}
		}
	},
	
	//Determinants:
	det:function(A){
		if(this.isMatrix(A) && this.isSquare(A)){
			let m = this.extractMatrixByRow(A);	
			const determinant = m => 
				m.length == 1 ?
				m[0][0] :
				m.length == 2 ? 
				m[0][0]*m[1][1]-m[0][1]*m[1][0] :
				m[0].reduce((r,e,i) => 
				r+(-1)**(i+2)*e*determinant(m.slice(1).map(c => 
				c.filter((_,j) => i != j))),0)		
			return determinant(m);
		}else {		
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				return new Error(this.Errors.noSq);
			}
		}
	},
	minors: function(A,proceedDirect){
	/*
		Returns the minors of a square matrix of any order
		Returns an array with the minors as objects.
		>>eg: [
			{val:M_11,i:1,j:1},...
		]
	*/
		proceedDirect = proceedDirect || false;
		if(proceedDirect || (this.isMatrix(A) && this.isSquare(A))){
			let exp = this.expand(A);
			let minors = [];
			for(let a of exp){
				let i = a.i,
				j = a.j;
				let clone = [].concat(exp);
				for(let k=0;k<clone.length;k++){
					let curr = clone[k];
					if((curr.i === a.i) || (curr.j === a.j)){
						clone.splice(k,1);
						k--;
					}
				}			
				let cM = [];
				for(let a of clone){
					cM.push(a.val);				
				}			
				let result = this.create(cM,A.n-1,A.m-1);
				let det = this.det(result);
				minors.push({
					i:i,
					j:j,
					val:det,
				});
			}
			return minors;
		}else {
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				throw new Error(this.Errors.notSq);
			}
		}
	},
	cofactors: function(A,proceedDirect){
		proceedDirect = proceedDirect || false;	
		if(proceedDirect || (this.isMatrix(A) && this.isSquare(A))){
			let minors = this.minors(A,true);
			let cofactors = [];
			for(let a of minors){
				let obj = {
					val:((-1)**(a.i+a.j))*a.val,
					i:a.i,
					j:a.j,
				}
				cofactors.push(obj);
			};
			return cofactors;
		}else {
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				throw new Error(this.Errors.notSq);
			}
		}
	},
	minorsToMatrix: function(minor){
		if(isArray(minor)){
			let last = minor[minor.length-1];
			let n = last.i,
				m = last.j;
			if((n == m)&& (typeof (n+m) == typeof 10)){
				let arr = [];
				for(let a of minor){
					if(typeof a.val === typeof 10){
						arr.push(a.val);
					}else {
						break;
						throw new Errors(this.Errors.invalid);
					}
				}
				return this.create(arr,n,m);
			}else {
				throw new Errors(this.Errors.invalid);
			}
		}else {
			throw new Errors(this.Errors.invalid);
		}
	},
	cofactorsToMatrix: function(A){
		return this.minorsToMatrix(A);
	},
	adj:function(A){
		if(this.isMatrix(A) && this.isSquare(A)){
			let cofactors = this.cofactors(A,true);
			let matrix = this.cofactorsToMatrix(cofactors);
				matrix = this.transpose(matrix);
			return matrix;
		}else {
			if(!this.isMatrix(A)){
				throw new Error(this.Errors.notMatrix);
			}else if(!this.isSquare(A)){
				throw new Error(this.Errors.notSq);
			}
		}
	},
	hasInverse: function(A){
		return this.det(A) !== 0;
	},
	inverse: function(A){
		let det = this.det(A);
		let adj = this.adj(A);
		if(det !== 0){
			let A_in = this.multByScalar(adj,1/det);
			return A_in;
		}else {
			return false;
		}
	},
	//Sub functions and other codes:
	
	//Errors:
	Errors: {
		notMatrix: "Given data is not a matrix",
		notSq: "Given matrix is not a square matrix",
		orderNotInt: "Order needs to be an integer",
		invalid: "Given data is invalid",
		noInverse: "The given matrix does not have an inverse",
		noOrder: "Order of the matrix is not specified",
	},
	//Display:
	toTable:function(A){
		//Converts a matrix to a HTML table.
		if(this.isMatrix(A)){
			let div = document.createElement("div");
			div.setAttr({
				class: "Matrix_table_container",
			});
			div.setStyle({marginBottom:"20px",position:"relative",display:"inline-block",width:"auto",height:"auto",});
			let rows = this.extractMatrixByRow(A);			
			let table = document.createElement("table");
			table.setStyle({border:"2px solid grey",borderCollapse:"collapse",borderStyle:"groove",position:"relative",});
			let i = j = 1;
			for(let a of rows){
				j = 1;
				let tr = document.createElement("tr");
				for(let b of a){
					let td = document.createElement("td");
					td.innerHTML = `${b} <div class="Matrix_cell_address" style="position:absolute;right:0;bottom:0;font-weight:700;font-size:8px;font-family:monospace;padding:4px;color:rgba(30,30,30,0.5);">${i} ${j}</div>`;
					tr.appendChild(td);
					td.setStyle({border:"2px solid grey",borderStyle:"groove",width:"40px",height:"40px",padding:"8px",textAlign:"center",fontWeight:700,fontSize:"18px",fontFamily:"monospace",position:"relative",});
					j++;
				}
				i++;
				table.appendChild(tr);
			};
			div.appendChild(table);
			//Order:
			var orderElm = document.createElement("div");
			orderElm.setAttr({
				class:"Matrix_table_order",
			});
			orderElm.innerHTML = `${A.n} &times; ${A.m}`;
			div.appendChild(orderElm)			
			orderElm.setStyle({position:"absolute",right:"0",fontWeight:"700",fontSize:"12px",fontFamily:"monospace",border:"2px solid grey",borderStyle:"groove",borderTop:"none",padding:"2px 4px",});
			let data = {};
			data.addTo = function(elm){
				elm = elm || document.body;
				elm.appendChild(div)
			}
			return data;
		}else {
			throw new Error(this.Errors.notMatrix);
		}
	},
	//Expand:
	expand:function(A){
		//Expands a matrix and returns it in a object with each value indexed with indexes
		if(this.isMatrix(A)){
			var n = A.n,
				m = A.m,
				data = A.matrix;
			let byRows = this.extractMatrixByRow(A);
			let result = [];
			let i = j = 1;
			for(let a of byRows){
				j = 1;
				for(let b of a){
					result.push({
						val:b,
						i:i,
						j:j,
					});
					j++;
				}
				i++;
			}
			return result;
		}else {
			throw new Error(this.Errors.notMatrix);
		}
	},
	randomElement:function(A){
		if(this.isMatrix(A)){
			let m = A.matrix;
			let i = Math.floor(Math.random()*m.length);
			return m[i];
		}
	},
	generateRandomMatrix: function(order,minmax,convertToInt = true){
		if(order){
			let n = order,
				m = order,
				min = 0,
				max = (order*order)+1;	
		//Get the order;
			if(typeof order === typeof 10){
				if(isInt(order)){
					n = order;
					m = order;
				}else {
					throw new Error(this.orderNotInt);
				}
			}else {
				if(isArray(order)){
					n = order[0];
					m = order[1];
					if(!isInt(n+m)){
						throw new Error(this.orderNotInt);
					}
				}else {
					throw new Error("Order array is incorrect");
				}
			};		
			//Get the min and max val;
			if(minmax){
				if(isArray(minmax)){
					min = minmax[0];
					max = minmax[1];
					if(typeof (min+max) !== typeof 10){
						throw new Error("Min-max should be a array containing numbers");
					}
				}else {
					throw new Error(this.Errors.invalid);
				}
			}	
			max++;
			let arr = [];
			for(let i=0;i<n*m;i++){
				let num = min+Math.random()*(max-min);
				num = convertToInt ? parseInt(num) : num;			
				arr.push(num);
			}
			return this.create(arr,n,m);
		}else {
			throw new Error(this.noOrder);
		}
	},
}