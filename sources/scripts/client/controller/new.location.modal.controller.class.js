import { Modal } from "../classes/modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { ResidentsModalController } from "./residents.modal.controller.class.js";
import { PurokModalController } from "./purok.modal.controller.class.js";

export class NewLocationModalController extends Modal {
	constructor (modalData) {
		super ( modalData );
		this.IS_UPDATE = !(!this.modalData.args.args);
		this.LAT = !this.modalData.args.args ? this.modalData.args.POS.LAT : this.modalData.args.args.LAT;
		this.LNG = !this.modalData.args.args ? this.modalData.args.POS.LNG : this.modalData.args.args.LNG;
		this.FULL_ADDRESS = !this.modalData.args.args ? "" : this.modalData.args.args.FULL_ADDRESS;
		this.LOC_TYPE = !this.modalData.args.args ? 'HH' : this.modalData.args.args.TYPE;
		this.LOC_NAME = !this.modalData.args.args ? '' : this.modalData.args.args.LOC_NAME;
		this.SELECTED = !this.modalData.args.args ? {} : this.modalData.args.args;
		this.LOC_CHART = {
			HH : {
				icon : '🏠',
				search : 'resident_leader',
				fieldName : 'FULLNAME',
				pivot_table : 'barangay_res_setup',
				foreignKey : 'RESIDENT_ID',
				addressField : 'ADDRESS',
				openLocationInfo : () => {
					let dataQuery = {
						type: "POST",
						url : this.mainService.urls["generic"].url,
						data : {
							data : {
								request : 'generic',
								REQUEST_QUERY : [
									{
										sql : `SELECT * FROM vims.barangay_res_setup w where w.RESIDENT_ID = ?`,
										db : 'DB',
										query_request : 'GET',
										index : 'result',
										values : [
											!this.SELECTED.RESIDENT_ID 
											?  this.SELECTED.FOREIGN_KEY : this.SELECTED.RESIDENT_ID
										],
									},	
								]
							}		
						}
					};
					this.mainService.serverRequest( dataQuery , ( res ) => {
						setTimeout( async ( ) => {
							let stds = (JSON.parse(res))['result'][0];
							let promises = await Promise.all([
								this.mainService.getHHMembers(stds.RESIDENT_ID),
								this.mainService.getPurokData(stds.PUROK)
							]);
							let hhmembers = promises[0];
							let purokData = promises[1];
							stds['hh_members'] = hhmembers;
							stds['new_location_modal'] = true;
							stds['PUROK_NAME'] = purokData.PRK_NAME;
							let nl = new ResidentsModalController({
								modalID :  "residents-modal",
								controllerName : "ResidentsModalController",
								template : "/vims/sources/templates/modal/residents.modal.template.html",
								parent : this,
								isUpdate : !stds.RESIDENT_ID ? false : true,
								args : stds.RESIDENT_ID ? stds : {},
								onSearchEvent : `${this.controllerName}:onUpdateResidents`,
							});
							nl.render();
						},110);
					} 
					, ( res ) => {
						//err
						console.log(res);
					});	
				}
			},
			P: {
				icon : '🅿',
				search : 'purok',
				fieldName : 'PUROKNAME',
			},
			B: {
				icon : '🏬',
				search : 'business',
			},
			H: {
				icon : '🏥',
				search : 'establishment',
			},
			S: {
				icon : '🏫',
				search : 'establishment',
			},
		}
	}

	
	
	searchNames () {
		this.ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type : this.LOC_CHART[this.LOC_TYPE].search,
				action : 'link',
				controller : this.controllerName,
				evt : ':onSelectName',
				//arg : args,
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		this.ssm.render();
		this.bindChildObject ( this , false );
	}

	changeValues () {
		this.bindChildObject(this,true);
	}
	
	async onSelectName(arg) {
		let selected = arg.detail.query;
		let locationExists = await this.mainService.checkLocationDataExists (
			selected[this.LOC_CHART[this.LOC_TYPE]['foreignKey']],
			this.LOC_CHART[this.LOC_TYPE]['pivot_table'],
			this.LOC_CHART[this.LOC_TYPE]['foreignKey'],
		);
		
		if(locationExists) {
			alert("Location name already exists");
			return;
		}

		this.LOC_NAME = selected[this.LOC_CHART[this.LOC_TYPE].fieldName];
		this.FULL_ADDRESS = selected[this.LOC_CHART[this.LOC_TYPE].addressField];
		this.SELECTED = selected;
		this.ssm.onClose();
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
	}

	closeNewLocation () {
		this.onClose();
		MainService.EventObject[this.modalData.parent.controllerName]
			.dispatch (`${this.modalData.parent.controllerName}:${this.modalData.args.close}`, {});
	}
	
	constructs(){	
	}
	
	initialize(){	
	}
	
	save () {
		this.bindChildObject(this,true);
		let selectedLocData = this.LOC_CHART[this.LOC_TYPE];
		
		if (! this.SELECTED[selectedLocData.foreignKey]) {
			alert("Cannot save, please chose a location.");
			return;
		}

		let data = {
			LOC_NAME : this.LOC_NAME,
			FOREIGN_KEY : this.SELECTED[selectedLocData.foreignKey],
			PIVOT_TABLE : selectedLocData.pivot_table,
			FULL_ADDRESS : this.SELECTED[selectedLocData.addressField],
			FOREIGN_KEY_FIELD :selectedLocData.foreignKey,
			LAT : this.LAT,
			LNG : this.LNG,
			TYPE : this.LOC_TYPE,
			ICON : selectedLocData.icon,
		}

		let saveparams = ( ServerRequest.queryBuilder( this.mainService.object2array(data) , this.IS_UPDATE ? "UPDATE" : "INSERT" ) );
		
		let sql1 = !this.IS_UPDATE ? `INSERT INTO vims.barangay_land_marks ${saveparams.initial} VALUES ${saveparams.seconds}` :
					`UPDATE vims.barangay_land_marks ${saveparams.initial} where ${data.FOREIGN_KEY_FIELD} = "${data.FOREIGN_KEY}"`;

		let request1 = {
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
					]
				}			
			}
		};
		this.mainService.serverRequest(request1, (res) => {
			res = JSON.parse(res).res;
			MainService.EventObject[this.modalData.parent.controllerName]
				.dispatch (`${this.modalData.parent.controllerName}:${this.modalData.args.save}`, {
					detail : {
						query : {
							LAT : this.modalData.args.POS.LAT,
							LNG : this.modalData.args.POS.LNG,
							ICN : this.LOC_CHART[this.LOC_TYPE].icon,
							LID : this.SELECTED[selectedLocData.foreignKey],
							ARG : data,
						}
					} 
				});
			this.onClose();
		}); 
	}
	
	delete(){
	}
	
	open() {
		this.LOC_CHART[this.LOC_TYPE].openLocationInfo();
	}
	
}