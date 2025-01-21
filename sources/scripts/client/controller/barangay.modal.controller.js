import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";

export class BarangayModalController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.brgyname = session_data.BARANGAY_NAME;
		this.tenYearsAgo = this.mainService.minusDays(this.mainService.getCurrentDate(),3650)
		this.isUpdate = this.modalData.isUpdate;	
		this.BARANGAY_CAPTAIN_NAME = this.modalData.args.ID ? this.modalData.args.BARANGAY_CAPTAIN_NAME  : "";
		this.RESIDENT_PRK_LD_ID = this.modalData.args.BARANGAY_CAPTAIN ? this.modalData.args.BARANGAY_CAPTAIN : "";
		this.BRGY_KAGAWADS = this.modalData.args.BRGY_KAGAWADS ?? [];
		this.IS_BARANGAY_CAPTAIN = 1;
		this.prkvars = {
			BARANGAY_NAME : "",
			BARANGAY_ID : this.mainService.makeid(15),
			BARANGAY_CAPTAIN: null,
		}
		
		for (let md in this.prkvars){
			let sel = this.modalData.args[md];
			if (sel){
				this.prkvars[md] = sel;
			}
		}
	
	}

	async votersBrgyList () {
		if (!this.isUpdate) return;
        let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/vims/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		load.render();
		let voters = await this.mainService.votersList({
            'barangay_id' : this.prkvars.BARANGAY_ID
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
	
	displayKagawadList () {
		let ol = document.querySelector("#brgy-kagawad-list");
		for ( let i in this.BRGY_KAGAWADS.result ){ 
			let sel = this.BRGY_KAGAWADS.result[i];
			let li = document.createElement ('li');
				li.innerText = sel.FULLNAME
			ol.append(li)
		}
	}
	
	constructs(){
		this.displayKagawadList()
	}
	
	viewMember( arg ){
	}
	
	init(){
	}
	
	searchBarangayCaptain( ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type : "resident",
				action : 'link',
				controller : this.controllerName,
				evt : ':onSelectBarangayCaptain',
				//arg : args,
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		ssm.render();
	}
	
	onSelectBarangayCaptain ( ...args ) {
		let res = args[0].detail.query;
		this.prkvars.BARANGAY_CAPTAIN = res.RESIDENT_ID;
		this.RESIDENT_PRK_LD_ID = res.RESIDENT_ID;
		this.BARANGAY_CAPTAIN_NAME = `${res.FULLNAME}`;
		this.IS_BARANGAY_CAPTAIN = 1;
		res.modal.onClose();
		this.bindChildObject ( this , false );
	}
	
	removeBarangayCaptain(){
		//this.binds(this.controllerName,`#${this.modalID}`);
		this.prkvars.BARANGAY_CAPTAIN = ``;
		this.BARANGAY_CAPTAIN_NAME = ``;
		this.IS_BARANGAY_CAPTAIN = 0;
		this.bindChildObject ( this , false );
	}
	
	changebox(){
		this.bindChildObject(this,this.elem);
	}
	
	
	save(){
		this.bindChildObject(this,true);
		let saveparams = ( ServerRequest.queryBuilder( this.mainService.object2array(this.prkvars) , this.isUpdate ? "UPDATE" : "INSERT" ) );

		let sql1 = !this.isUpdate ? `INSERT INTO barangays ${saveparams.initial} VALUES ${saveparams.seconds}` :
									`UPDATE barangays ${saveparams.initial} where BARANGAY_ID = "${this.prkvars.BARANGAY_ID}"`;
		let sql2 = `UPDATE vims.barangay_res_setup SET IS_BARANGAY_CAPTAIN = ? WHERE RESIDENT_ID = ?`;
		
		
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
							values : [this.IS_BARANGAY_CAPTAIN, this.RESIDENT_PRK_LD_ID]
						},	
					]
				}
						
			}
			
		}
		this.mainService.serverRequest( dataQuery , ( res ) => {
			MainService.EventObject[this.modalData.parent.controllerName].dispatch (`${this.modalData.onSearchEvent}` , {
				detail : {
					query : {}
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