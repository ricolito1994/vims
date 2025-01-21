// BTTHS 2018
import { Controller } from "../classes/controller.class.js";

export class DataTableService extends Controller{
	
	constructor ( tableData ){
		super ( "datatable", tableData.controller.mainService );
		this.template = tableData.template;
		this.tableID = tableData.tableID;
		this.actions = tableData.actions;
		this.controller = tableData.controller;
		this.parentCtrl = tableData.controllername;
		this.service = tableData.service;
		this.fields = tableData.fields;
		/* this.paginate = tableData.paginate; */
		this.actionButtons = tableData.actionButtons;
		this.filterElems = tableData.filterElems;
		this.parentDiv = tableData.parentDiv;
		this.constructTable();
	}
	
	setTableData ( data ){
		this.tableContents = data;
	}
	
	setPaginateCtr ( paginateCtr ){
		this.paginateCtr = paginateCtr;
	}
	
	constructTable(){
		
		this.service.loadTemplate(this.template,this.parentDiv+" #dt-table",( )=>{
			/* just in case */
			//console.log(this.parentDiv);
			//this.mainService.children( this.filterElems, document.querySelector (`${this.parentDiv} #dttablefilter`) );
			this.constructHead();
			this.constructActions();
			this.table = document.querySelector (this.parentDiv+" "+ '#'+this.tableID);
			//console.log(this.parentDiv);
			this.binds("datatable",this.parentDiv);
			this.bindChildObject ( this );
		},false,true)
	
	}
	
	construct(){
		//console.log(this.tableContents);
		this.populate( 0 , this.paginateCtr , true );
		$(`${this.parentDiv} #dtpaginate`).empty();
		this.paginatePopulate();
	}
	
	constructHead(){
		let thead = document.querySelector (`${this.parentDiv} #dttable-head`);
		let tr = document.createElement("tr");
		for ( let c in this.fields ){
			let th =  document.createElement("th");
				th.innerHTML = this.fields[c].head;
			if(this.fields[c]['sort']){
				th.className = 'hover';
				th.addEventListener("click", function( ) { 
					c = parseInt (c);
					const fieldSorter = (fields) => (a, b) => fields.map(o => {
						
						let dir = 1;
						if (o[0] === '-') { dir = -1; o=o.substring(1); }
						return a[o] > b[o] ? dir : a[o] < b[o] ? -(dir) : 0;
					})
					.reduce((p, n) => p ? p : n, 0);
							
					//console.log ( this.fields[c]['sort'] );
					this.tableContents = this.tableContents.sort(fieldSorter(this.fields[c]['sort'][this.fields[c]['sortBy']]));
					this.construct();
							
					this.fields[c]['sortBy'] = this.fields[c]['sortBy'] == 'asc' ? 'dsc' : 'asc';
						
				}.bind(this),this);
			}
			tr.appendChild(th);
		}
		thead.appendChild(tr);
	}
	
	populate ( start , end , paginate ){
		
		if ( this.table.getElementsByTagName( 'tbody' ).length > 0 ){
			//console.log("wew");
			this.table.removeChild(this.table.getElementsByTagName( 'tbody' )[0]);
		}
		
		let tableBody = document.createElement("tbody");
		let resultLength = this.tableContents.length;
		let d = paginate ? start : 0;
		let ed = paginate ? end : resultLength;
		
		for (  ; d < ed ; d++ ){
			let selData = this.tableContents[d];
			let tr = document.createElement("tr");
			
			
			for ( let field in this.fields ){
				let td = document.createElement("td");
				let selfld = this.fields [ field ];
			 
				if ( selfld.elements && selData ){
					selData['context'] = this.controller;
					this.mainService.children( selfld.elements , td , selData );
				}
				
				tr.appendChild(td);
			}
			
			tableBody.appendChild ( tr );
		}
		
		this.table.appendChild( tableBody );
		
		//console.log( this.table );
	}
	
	paginatePopulate (){
		let c = 0; 
		let d = 1;
		let length = this.tableContents.length ;
		let html = "";
		let paginateList = document.createElement ( "ul" );
			paginateList.id = "dtpaginateitem";
			paginateList.className = "pagination justify-content-center";
		for ( ; c < length ;c++ ){
			
			if ( c % this.paginateCtr == 0  ){
				//console.log(c,this.paginateCtr);
				let finalValue = (c + this.paginateCtr) < this.tableContents.length ? (c + this.paginateCtr) : this.tableContents.length;
				let newElement = document.createElement ( 'li' );
					newElement.className = d > 1 ? "page-item" : "page-item active";
				let childElement = document.createElement ('a');
					childElement.className = "page-link";
					childElement.innerText = d;
					childElement.setAttribute("href","javascript:void(0);");
					childElement.addEventListener( "click" , 
						this.paginateClickNumbers.bind('',c , finalValue , this)
					);
					newElement.appendChild ( childElement );
				d++;
				paginateList.appendChild( newElement );
			}
			
		}
		document.querySelector( `${this.parentDiv} #dtpaginate` ).appendChild ( paginateList );

	}
	
	
	paginateClickNumbers ( a, b, c, e ){
		let paginateLinks = document.querySelectorAll(c.parentDiv+" "+"#dtpaginateitem"+".pagination li");
		let l = ( paginateLinks.length );
			c.populate( a , b, true );
		for ( let p = 0 ; p < l ; p++ ){
			let selected = ( paginateLinks[p] );
			selected.className = "page-item";
		}
		e.path[1].className = "page-item active";
	}
   
	
	refreshTable(){
		
	}

	destroyTable(){
		
	}
	
	searchFromData(){
		
	}
	
	constructActions(){
		for ( let c in this.actions ){
			let sel = this.actions[c];
			//console.log(sel);
			let doc = document.querySelector (`${this.parentDiv} #dt-dp-actions`);
			let act = document.createElement("a");
			let bnd = { fn:sel.fn };
			
			if ( sel.params ){
				bnd ['par'] = sel.params;
			}
			
			act.className="dropdown-item";
			act.innerHTML = sel.html;
			act.href="javascript:void(0);";
			act.addEventListener( "click" , this.pf.bind ( this , bnd ) );
			doc.appendChild(act);
		}
	}
	
	
	pf ( args ){
		console.log (args,"wew");
		this.bindChildObject( this , true );
		if ( this.controller[args.fn] ){
			this.controller[args.fn]( args.par ? args.par : null );
		}
	}

	
	
}