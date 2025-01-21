import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { PurokModalController } from "./purok.modal.controller.class.js"

export class ResidentsPurokController extends Modal {
	
	constructor ( modalData ){
		super ( modalData );
		this.brgyname = session_data.BARANGAY_NAME;
		this.PRK_NAME = "";
		this.BARANGAY_ID = "";
		this.BARANGAY_NAME = "";
		this.PRK_LEADER = "";
		this.PRK_LEADER_NAME = "";
		this.KAGAWAD = "";
		this.KAGAWAD_NAME = "";
	}
	
	constructs(){
		this.dataTable = new DataTableService({
			template : "/vims/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : this.controllerName,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".resident-table-container",
			filterElems : [],
			fields : [
				{
					head : "ZONE",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['PRK_NAME'];
									},
								}
							]
						}
					]
				},
				{
					head : "BARANGAY",
					sort : {
						asc : ['BARANGAY_NAME'],
						dsc : ['-BARANGAY_NAME'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										return selData['BARANGAY_NAME'] ? `${selData['BARANGAY_NAME']}` : '';
									},
								}
							]
						}
					]
				},
				{
					head : "KAGAWAD",
					sort : {
						asc : ['BARANGAY_KAGAWAD_NAME'],
						dsc : ['-BARANGAY_KAGAWAD_NAME'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['BARANGAY_KAGAWAD_NAME'] ?? '';
									},
								}
							]
						}
					]
				},
				{
					head : "ZONE LEADER",
					sort : {
						asc : ['PRK_LEADER_NAME'],
						dsc : ['-PRK_LEADER_NAME'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										
										return `${selData['PRK_LEADER_NAME']}`;
									},
								}
							]
						}
					]
				},
				{
					head : "ACTION",
					elements : [
						{	
							createElement : "a",
							attributes : [
								{
									attribute: "href",
									value : "javascript:void(0);",
								},
								{
									attribute: "className",
									value : "btn btn-primary",
								},
								{
									type : "event",
									attribute : "click",
									value : async ( args ) => {
										//this.openitem(arg);
										//this.openwarehouse(arg);
										args ['HH_LEADERS'] = await this.getHHLeaders(args.PRK_ID)
										this.openPurok(args);
									},
								}
							],
							children : [
								{
									createElement : "i",
									attributes : [
										{
											attribute: "className",
											value : "icon-search",
										}
									]
								}
							]
						},
						{	
							createElement : "span",
							attributes:[
								{
									attribute:"innerHTML",
									value : "&nbsp;"
								}
							]
						},
						
						{	
							createElement : "span",
							attributes:[
								{
									attribute:"innerHTML",
									value : "&nbsp;"
								}
							]
						},
						
					]
				},
			],

		});
		this.init();
	}

	async getHHLeaders (prkid) {
		let statement = "SELECT CONCAT(FIRSTNAME,' ',LASTNAME) as FULLNAME FROM barangay_res_setup WHERE PUROK = ? and IS_FAMILY_LEADER = ?"
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : statement,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : [prkid, 1]
						},	
					]
				}		
			}
		};
		return new Promise ( (resolve, reject) => {
			this.mainService.serverRequest( dataQuery , ( res ) => {
				resolve(JSON.parse(res))
			},( res ) => {
				reject(res);
			});	
		});
	}
	
	changeFilter(){
		this.bindChildObject(this,this.elem);
		this.init();
	}
	
	onUpdateTable(){
		this.changeFilter()
	}
	
	openPurok(args){
		let usm = new PurokModalController({
			modalID :  "purok-modal",
			controllerName : "PurokModalController",
			template : "/vims/sources/templates/modal/purok.modal.template.html",
			parent : this,
			isUpdate : args.PRK_ID ? true : false,
			args : args.PRK_ID ? args : {},
			//instanceID : this.mainService.generate_id_timestamp("res"),
			onSearchEvent : `${this.controllerName}:onUpdateTable`,
		});
		usm.render();
	}
	
	 onLinkBarangay( arg ){
		let args =arg.detail.query;
		this.BARANGAY_ID = args.BARANGAY_ID
		this.BARANGAY_NAME = args.BARANGAY_NAME;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		this.init();
		args.modal.onClose();
	}

	onLinkPL ( arg ){
		let args = arg.detail.query;
		this.PRK_LEADER = args.RESIDENT_ID
		this.PRK_LEADER_NAME = args.FULLNAME;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		this.init();
		args.modal.onClose();
	}

	onLinkKagawad ( arg ){
		let args = arg.detail.query;
		this.KAGAWAD = args.RESIDENT_ID
		this.KAGAWAD_NAME = args.FULLNAME;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		this.init();
		args.modal.onClose();
	}
	
	removePurokLeader(){
		this.PRK_LEADER = ``
		this.PRK_LEADER_NAME = ``;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		this.init();
	}

	removeBarangay(){
		this.BARANGAY_ID = ``
		this.BARANGAY_NAME = ``;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		this.init();
	}

	removeKagawad(){
		this.KAGAWAD = ``
		this.KAGAWAD_NAME = ``;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		this.init();
	}

	chooseKagawad( arg ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type :  'kagawad',
				action : 'link',
				controller : this.controllerName,
				evt : ':onLinkKagawad',
				//arg : args,
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		ssm.render();
	}
	
	choosePurokLeader( arg ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type :  'resident_all',
				action : 'link',
				controller : this.controllerName,
				evt : ':onLinkPL',
				//arg : args,
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		ssm.render();
	}

	barangaySetup ( ) {
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
	

	chooseBarangay( arg ){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "barangay",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type :  'barangay',
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

	init(){
		//console.log(this.PRK_NAME)
		let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT PRK.*, BRGY.BARANGAY_NAME, BRGY.BARANGAY_ID,
									IF(CONCAT(RES.FIRSTNAME,' ',RES.LASTNAME) IS NOT NULL , CONCAT(RES.FIRSTNAME,' ',RES.LASTNAME) , '-') PRK_LEADER_NAME ,
									IF(CONCAT(KGWD.FIRSTNAME,' ',KGWD.LASTNAME) IS NOT NULL , CONCAT(KGWD.FIRSTNAME,' ',KGWD.LASTNAME) , '-') BARANGAY_KAGAWAD_NAME 
									FROM vims.barangay_prk_setup PRK 
									LEFT JOIN vims.barangays BRGY ON BRGY.BARANGAY_ID = PRK.BARANGAY_ID 
									LEFT JOIN vims.barangay_res_setup  RES ON RES.RESIDENT_ID = PRK.PRK_LEADER 
									LEFT JOIN vims.barangay_res_setup  KGWD ON KGWD.RESIDENT_ID = PRK.BARANGAY_KAGAWAD 
									WHERE PRK.PRK_NAME LIKE ?`+
									(this.PRK_LEADER !== '' ?` and PRK.PRK_LEADER = ? ` : '')+
									(this.BARANGAY_ID !== '' ?` and PRK.BARANGAY_ID = '${this.BARANGAY_ID}' ` : '')+
									(this.KAGAWAD !== '' ?` and PRK.BARANGAY_KAGAWAD = '${this.KAGAWAD}' ` : '')
									+`order by PRK.ID desc`,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : 
								this.PRK_LEADER !== '' ? [`%${this.PRK_NAME}%`,`${this.PRK_LEADER}`] : [`%${this.PRK_NAME}%`]
						},	
					]
				}
						
			}
			
		};
		
		this.mainService.serverRequest( dataQuery , ( res ) => {
			
			setTimeout( ( ) => {
				let stds = (JSON.parse(res))['result'];
				
				let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
				console.log(stds);
				this.dataTable.setTableData(stds);
				
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
				//load.onClose();
			
			},300);
		} 
		, ( res ) => {
			//err
			console.log(res);
		});	
	}

}
	