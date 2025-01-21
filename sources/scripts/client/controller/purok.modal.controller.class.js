import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";

export class PurokModalController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.brgyname = session_data.BARANGAY_NAME;
		this.tenYearsAgo = this.mainService.minusDays(this.mainService.getCurrentDate(),3650)
		this.isUpdate = this.modalData.isUpdate;	
		this.BARANGAY_NAME = this.modalData.args.ID ? this.modalData.args.BARANGAY_NAME : "";
		this.PRK_LEADER_NAME = this.modalData.args.ID ? this.modalData.args.PRK_LEADER_NAME : "";
		this.BARANGAY_KAGAWAD_NAME = this.modalData.args.BARANGAY_KAGAWAD_NAME ? this.modalData.args.BARANGAY_KAGAWAD_NAME : "";
		this.RESIDENT_PRK_LD_ID = this.modalData.args.PRK_LEADER ? this.modalData.args.PRK_LEADER : "";
		this.IS_PRK_LEADER = 1;
		this.BARANGAY_KAGAWAD = this.modalData.args.BARANGAY_KAGAWAD ?? '';
		this.HH_LEADERS = this.modalData.args.HH_LEADERS ?? [];
		this.prkvars = {
			PRK_NAME : "",
			PRK_ID : this.mainService.makeid(15),
			PRK_LEADER : '',
			BARANGAY_ID : '',
			BARANGAY_KAGAWAD : '',
		}
	
		//console.log(modalData);
		
		for (let md in this.prkvars){
			let sel = this.modalData.args[md];
			if (sel){
				this.prkvars[md] = sel;
			}
		}
	
	}

	

	displayHHLeaders () {
		let ol = document.querySelector("#prk-hh-list");
		for ( let i in this.HH_LEADERS.result ){ 
			let sel = this.HH_LEADERS.result[i];
			let li = document.createElement ('li');
				li.innerText = sel.FULLNAME
			ol.append(li)
		}
	}
	
	constructs(){
		this.displayHHLeaders();
	}
	
	viewMember( arg ){
	}
	
	init(){
	}

	searchKagawad ( ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type : "kagawad",
				action : 'link',
				controller : this.controllerName,
				evt : ':onSelectKagawad',
				//arg : args,
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		ssm.render();
	}
	
	searchPrkLeader( ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type : "resident_all",
				action : 'link',
				controller : this.controllerName,
				evt : ':onSelectPrkLeader',
				//arg : args,
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		ssm.render();
	}

	async votersPrkList () {
		if (!this.isUpdate) return;
        let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/vims/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		load.render();
		let voters = await this.mainService.votersList({
            'barangay_id' : this.prkvars.BARANGAY_ID,
            'zone_id' 	  : this.prkvars.PRK_ID,
			'kagawad_id'  : this.prkvars.BARANGAY_KAGAWAD,
        });
		setTimeout ( () => {
			this.mainService.openTab(
				"POST", 
				"/vims/sources/templates/reports/voterslist.report.php", {
					data : {
						res : voters,
						param : {}
					},
				}, "blank_"); 
			load.onClose();
		},1000);
    }

	searchBarangay( ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type : "barangay",
				action : 'link',
				controller : this.controllerName,
				evt : ':onLinkBarangay',
				//arg : args,
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		ssm.render();
	}

	onLinkBarangay (...args) {
		let res = args[0].detail.query;
		this.prkvars.BARANGAY_ID = res.BARANGAY_ID;
		this.RESIDENT_PRK_LD_ID = res.RESIDENT_ID;
		this.BARANGAY_NAME = `${res.BARANGAY_NAME}`;
		res.modal.onClose();
		//this.binds(this.controllerName,`#${this.modalID}`);
		this.bindChildObject ( this , false );
	}

	onSelectKagawad ( ...args ) {
		let res = args[0].detail.query;
		this.prkvars.BARANGAY_KAGAWAD = res.RESIDENT_ID;
		this.BARANGAY_KAGAWAD = res.RESIDENT_ID;
		this.BARANGAY_KAGAWAD_NAME = `${res.FULLNAME}`;
		res.modal.onClose();
		//this.binds(this.controllerName,`#${this.modalID}`);
		this.bindChildObject ( this , false );
	}
	
	onSelectPrkLeader ( ...args ) {
		let res = args[0].detail.query;
		this.prkvars.PRK_LEADER = res.RESIDENT_ID;
		this.RESIDENT_PRK_LD_ID = res.RESIDENT_ID;
		this.PRK_LEADER_NAME = `${res.FULLNAME}`;
		this.IS_PRK_LEADER = 1;
		res.modal.onClose();
		//this.binds(this.controllerName,`#${this.modalID}`);
		this.bindChildObject ( this , false );
	}
	
	removePrkLeader(){
		this.prkvars.PRK_LEADER = ``;
		this.PRK_LEADER_NAME = ``;
		this.IS_PRK_LEADER = 0;
		//this.binds(this.controllerName,`#${this.modalID}`);
		this.bindChildObject ( this , false );
	}
	
	removeKagawad(){
		this.prkvars.BARANGAY_KAGAWAD = ``;
		this.BARANGAY_KAGAWAD = ``;
		//this.IS_PRK_LEADER = 0;
		//this.binds(this.controllerName,`#${this.modalID}`);
		this.bindChildObject ( this , false );
	}
	
	changebox(){
		this.bindChildObject(this,this.elem);
	}
	
	
	save(){
		this.bindChildObject(this,true);
		let saveparams = ( ServerRequest.queryBuilder( this.mainService.object2array(this.prkvars) , this.isUpdate ? "UPDATE" : "INSERT" ) );
		//console.log(saveparams)
		
		let sql1 = !this.isUpdate ? `INSERT INTO barangay_prk_setup ${saveparams.initial} VALUES ${saveparams.seconds}` :
									`UPDATE barangay_prk_setup ${saveparams.initial} where PRK_ID = "${this.prkvars.PRK_ID}"`;
		let sql2 = `UPDATE vims.barangay_res_setup SET IS_PRK_LEADER = ? WHERE RESIDENT_ID = ?`;
		
		
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						
						{
							sql : sql1,
							db : 'DB',
							query_request : "INSERT",
							values : saveparams.values
						},	
						{
							sql : sql2,
							db : 'DB',
							query_request : "UPDATE",
							values : [this.IS_PRK_LEADER, this.RESIDENT_PRK_LD_ID]
						},	
					]
				}
						
			}
			
		};
		//console.log('dataQuery', dataQuery)
		//console.log(this.isUpdate)
		this.mainService.serverRequest( dataQuery , ( res ) => {
			MainService.EventObject[this.modalData.parent.controllerName].dispatch (`${this.modalData.onSearchEvent}` , {
				detail : {
					query : {
							
					}
				} 
			});
			this.onClose();
		} 
		, ( err ) => {
			//err
			console.log(err)
		});	
		
	}
	
}