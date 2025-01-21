import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { SearchModal } from "./search.modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";
import { DateRangeModal } from "./date.range.modal.controller.js";
import { ResidentBenifitClaimRecordsModalController } from "./residents.benifit.claim.records.modal.controller.class.js";

export class ResidentsModalController extends Modal {
	constructor ( modalData ){
		super ( modalData );
		this.brgyname = session_data.BARANGAY_NAME;
		this.CITY_ADDRESS = `${session_data.CITY_M} ${session_data.PROVINCE}`;
		this.tenYearsAgo = this.mainService.minusDays(this.mainService.getCurrentDate(),3650)
		this.isUpdate = this.modalData.isUpdate;	
		let hhcode = `${session_data.CODE}-HH-${this.mainService.makeidV2(15)}`;

		this.residentVars = {
			FIRSTNAME : "",
			LASTNAME : "",
			MIDDLENAME : "",
			IS_FAMILY_LEADER : 0,
			HAS_SCHOLARSHIP : 0,
			ADDRESS : `${session_data.CITY_M} ${session_data.PROVINCE}`,
			BIRTHDAY : this.tenYearsAgo,
			//AGE : 0,
			HH_CODE : hhcode,
			PUROK : "",
			BARANGAY_ID : "",
			RESIDENT_ID : this.mainService.makeid(15),
			FULLNAME : "",
			HH_LEADER : "",
			BLOOD_TYPE : "O+",
			COMORDIBITY : [],
			VACCINATION : [],
			EMERGENCY : {
				NAME: '',
				CONTACT_NUMBER : '',
				ADDRESS : '',
			},
			ITEM_IMAGE : '',
			IS_BARANGAY_KAGAWAD : 0,
			PRECINCT_NUMBER : '',
			RELATIONSHIP_TO_HH_LEADER : 'Not Specified',
		}

		this.BARANGAY_NAME = this.modalData.args['BARANGAY_NAME'] ? this.modalData.args['BARANGAY_NAME'] : "" ;
		this.PUROK_NAME = this.modalData.args['PUROK_NAME'] ? this.modalData.args['PUROK_NAME'] : "" ;
		this.hh_leader = this.modalData.args['hh_leader'] ? this.modalData.args['hh_leader'] : "" ;
		
		if(!this.modalData.instanceID){
			this.houseHoldMembers = [];
			this.removedHHMembers = [];
		}
		//console.log(this.modalData.args)
		for (let md in this.residentVars){
			let sel = this.modalData.args[md];
			if (sel){
				try {
					sel =  JSON.parse(sel);
				} catch (e) {
				}
				finally {
					this.residentVars[md] = sel;
				}
			}
		}
		
		if (this.modalData.args['ID']) {
			this.residentVars['ID'] = this.modalData.args['ID'];
		}
		//console.log('this.residentVars', this.residentVars);
		
		if ( this.modalData.brgyargs ){
			this.residentVars.HH_LEADER =  this.modalData.brgyargs.HH_LEADER;
			this.residentVars.PUROK =  this.modalData.brgyargs.PUROK;
			this.residentVars.ADDRESS  =  this.modalData.brgyargs.ADDRESS;
			this.PUROK_NAME = this.modalData.brgyargs.PUROK_NAME;
			this.hh_leader =  this.modalData.brgyargs.hh_leader_;
		}
		
		//console.log(this.modalData.args['hh_members'])
		if ( this.modalData.args['hh_members'] ){
			for ( let r in this.modalData.args['hh_members'] ){
				let rsss = this.modalData.args['hh_members'][r];  
				if (!rsss.age){
					rsss['age'] = this.mainService.calculateAge( rsss.BIRTHDAY.split("-") , this.mainService.getCurrentDate().split("-") );
				}
			}
			
			this.houseHoldMembers =  this.modalData.args['hh_members'];
		}
		
		this.comordibities = [
			'',
			'Cancer',
			'Diabetes',
			'Asthma',
			'Arthritis',
			'COPD',
			'Kidney Disease',
			'Mental Health Issues',
			'Hypertension',
			'Obesity',
			'Sensory impairment',
			'Joint disease',
		];

		this.vaccines = [
			'',
			'ASTRAZENECA',
			'PHIZER BIONTECH',
			'SINOVAC',
			'SPUTNIC V',
			'JHONSON AND JHONSON`S',
			'MODERNA VACCINE',
		];
		//console.log(this.houseHoldMembers );;
		
		this.calcAge({load:true});
	}

	async printVoters () {
		if (! this.isUpdate) return;
		if (this.residentVars.IS_BARANGAY_KAGAWAD == 0 && this.residentVars.IS_FAMILY_LEADER == 0) return;
		
		let zoneData = await this.mainService.getPurokData(this.residentVars.PUROK)

		let params = {
            'barangay_id' : this.residentVars.BARANGAY_ID,
			'kagawad_id' : zoneData.BARANGAY_KAGAWAD,
        }

		if (this.residentVars.IS_BARANGAY_KAGAWAD == 0) {
			params['house_hold_leader_id'] = this.residentVars.RESIDENT_ID;
			params['zone_id'] = this.residentVars.PUROK;
		} 
		
		let load = new LoadingModal ({
			modalID :  "loading-modal-load",
			controllerName : "loadingmodal",
			template : "/vims/sources/templates/modal/loading.modal.template.html",
			parent : this,
		});
		load.render();
		let voters = await this.mainService.votersList(params);
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
	
	constructs(){
		let qrid = "qrcode";
		if(this.modalData.instanceID){
			/* qrid = `qrcode${this.modalData.instanceID}`
			$("#residents-modal").attr("id",this.modalData.instanceID);
			//console.log($("#"+this.params.instanceID).data("controller"))
			$("#"+this.modalData.instanceID).data("controller",this.modalData.instanceID); */
			qrid  = "qrcode2"
		}
		else{
			if (this.residentVars.IS_FAMILY_LEADER == 0){
				$("#fam-members-tbl-container").css("display","none");
				//$("#ResidentModalAddress").attr("disabled",true);
				$("#fam-leader-container").show(300);
			}else{
				$("#fam-members-tbl-container").css("display","block");
				//$("#ResidentModalAddress").removeAttr("disabled");
				$("#fam-leader-container").hide(300);
			}
		}

		if ( this.modalData.args['new_location_modal'] ){ 
			$('#others_1_container').css('display', 'none');
			$('#contacts_container').css('display', 'none');
			$('#res_qrcode_container').css('display', 'none');
			$('#res_save_btn').css('display', 'none');
			$('#res_print_card_btn').css('display', 'none');
			$('#family_leader_container').css('display' ,'none');
			$('#res_claim_records').css('display', 'none');
		}

		if (!this.isUpdate) {
			$('#res_claim_records').css('display', 'none');
		}

		var qrcode = new QRCode(qrid);
		qrcode.makeCode(this.residentVars.RESIDENT_ID);
		//this.setComordibity();
		//this.setVaccine();

		this.tempprofpic = this.residentVars.ITEM_IMAGE == '' ? './sources/images/prof.jpg' : `${this.residentVars.ITEM_IMAGE}`;
		this.itemtemppic =  this.tempprofpic;
		//this.residentVars.ITEM_IMAGE = '';
		//this.displayUnit ();

		if(!this.modalData.instanceID)
			this.addMembers();
	}

	chooselogo(){
		$('#itemimage_pic').click();
	}

	changeProfPic(...args){
		var reader = new FileReader();
        reader.onload = (e) => {
		  $('#itemimage').attr('src',e.target.result);
        }
       	reader.readAsDataURL(args[1].target.files[0]);
	}
	
	changefamilyleaderstat(){
		if(!this.modalData.instanceID){
			this.bindChildObject(this,true);
			if (this.residentVars.IS_FAMILY_LEADER == 1){
				if (this.hh_leader!=""){
					alert("cannot be a family leader!")
					this.residentVars.IS_FAMILY_LEADER = 0;
					this.bindChildObject(this,false);
					return;
				}
				$("#ResidentModalAddress").removeAttr("disabled");
				$("#fam-members-tbl-container").show(300);
				$("#fam-leader-container").hide(300);
			}
			else{
				if (this.houseHoldMembers.length > 0){
					alert("please remove all members first!")
					this.residentVars.IS_FAMILY_LEADER = 1;
					this.bindChildObject(this,false);
					return;
				}
				$("#ResidentModalAddress").attr("disabled",true);
				$("#fam-members-tbl-container").hide(300);
				$("#fam-leader-container").show(300);
			}
			return;
		}
		this.residentVars.IS_FAMILY_LEADER = 0;
		alert ("Cannot set as family leader!");
		this.bindChildObject(this,false);
	}

	addComordibity () {
		this.residentVars.COMORDIBITY.push('');
		this.setComordibity();
	}

	removeComordibity (params) {
		this.residentVars.COMORDIBITY.splice(params.index, 1);
		this.setComordibity();
	}

	setComordibity ( ) {
		let table = document.querySelector('#comordibity-table');
		table.innerHTML = "";
		for (let j in this.residentVars.COMORDIBITY) {
			
			let select = document.createElement('select');
			select.dataset.valuectrl = `residentVars.COMORDIBITY.${j}`;
			select.dataset.event = `${this.controllerName}.change.changeComordibity`;
			select.className = 'form-control';

			for (let i in this.comordibities) {
				let sel = this.comordibities[i];
				let option = document.createElement('option');
				option.dataset.params = `{'index':${i}}`;
				option.innerHTML = sel;
				select.appendChild(option);
			}
			let tr = document.createElement('tr');
			let td1 = document.createElement('td');
			let td2 = document.createElement('td');
			let removeButton = document.createElement('button');
				removeButton.classList='btn btn-danger';
				removeButton.innerText = 'x';
				removeButton.dataset.params = '{"index":"'+j+'"}' ;
				removeButton.dataset.event = `${this.controllerName}.click.removeComordibity`;
			td1.appendChild(select);
			td2.appendChild(removeButton);
			tr.appendChild(td1);
			tr.appendChild(td2);
			
			table.appendChild(tr);

			//this.residentVars.COMORDIBITY.push('');
			
		}
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
	}


	addVaccine () {
		this.residentVars.VACCINATION.push({
			VACCINE_DATE : '0000-00-00',
			VACCINE : '',
			//DOSE : this.residentVars.VACCINE.length,	
		});
		this.setVaccine();
	}

	removeVaccination (params) {
		this.residentVars.VACCINATION.splice(params.index, 1);
		this.setVaccine();
	}


	setVaccine ( ) {
		let table = document.querySelector('#vaccine-table');
		table.innerHTML = "";
		for (let j in this.residentVars.VACCINATION) {
			
			let select = document.createElement('select');
			let date = document.createElement('input');
				date.type = 'date';
				date.className = 'form-control';
				date.dataset.valuectrl = `residentVars.VACCINATION.${j}.VACCINE_DATE`
			select.dataset.valuectrl = `residentVars.VACCINATION.${j}.VACCINE`;
			select.dataset.event = `${this.controllerName}.change.changeValues`;
			select.className = 'form-control';
			this.residentVars.VACCINATION[j].DOSE = j;
			for (let i in this.vaccines) {
				let sel = this.vaccines[i];
				let option = document.createElement('option');
				option.dataset.params = `{'index':${i}}`;
				option.innerHTML = sel;
				select.appendChild(option);
			}
			let tr = document.createElement('tr');
			let td1 = document.createElement('td');
			let td2 = document.createElement('td');
			let td3 = document.createElement('td');
			let removeButton = document.createElement('button');
				removeButton.classList='btn btn-danger';
				removeButton.innerText = 'x';
				removeButton.dataset.params = '{"index":"'+j+'"}' ;
				removeButton.dataset.event = `${this.controllerName}.click.removeVaccination`;
			td1.appendChild(select);
			td2.appendChild(date);
			td3.appendChild(removeButton);
			tr.appendChild(td1);
			tr.appendChild(td2);
			tr.appendChild(td3);
			table.appendChild(tr);

			//this.residentVars.COMORDIBITY.push('');
			
		}
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
	}

	

	changeComordibity (...args) {
	
		let alreadySelected = this.residentVars.COMORDIBITY.findIndex (x => x === args[1].srcElement.value);

		if (alreadySelected > -1) {
			alert("already selected")
			return;
		}
		
		this.changeValues();
	}
	
	calcAge( args ){
		if ( !args.load ){
			this.bindChildObject(this,true);
		}
		this.currentAge = this.mainService.calculateAge( this.residentVars.BIRTHDAY.split("-") , this.mainService.getCurrentDate().split("-") );
		if ( !args.load ){
			this.bindChildObject(this,false);
		}
	}
	
	printHealthCard(){
		this.mainService.openTab("POST","/vims/sources/templates/reports/district.five.health.card.template.php",
		{
			data : this.residentVars,
		},"blank_");
	}
	
	changeRelationToHHLeader () {

	}
	
	addMembers(){
		console.log(this.houseHoldMembers)
		let tbody = document.querySelector ( "#members-hh-table > tbody" );
			tbody.innerHTML = "";
		let tbodyContents = "";
		for ( let i in this.houseHoldMembers ){
			let m = this.houseHoldMembers[i];
			tbodyContents += 
			`<tr>
				<td>${m.FULLNAME}</td>
				<td>${m.BIRTHDAY}</td>
				<td>${m.age}</td>
				<td>
					<select 
						class="form-control"
						data-event="${this.controllerName}.change.changeRelationToHHLeader"
						data-valuectrl="houseHoldMembers.${i}.RELATIONSHIP_TO_HH_LEADER"
					>
						<option default>Not Specified</option>
						<option>Wife</option>
						<option>Husband</option>
						<option>Daughter</option>
						<option>Son</option>
						<option>Mother</option>
						<option>Father</option>
						<option>Brother</option>
						<option>Sister</option>
						<option>Cousin</option>
						<option>Uncle</option>
						<option>Aunt</option>
						<option>Niece</option>
						<option>Nephew</option>
						<option>Grandfather</option>
						<option>Grandmother</option>
						<option>Step Daughter</option>
						<option>Step Son</option>
						<option>Step Mother</option>
						<option>Step Father</option>
						<option>Step Brother</option>
						<option>Step Sister</option>
						<option>Step Cousin</option>
						<option>Step Uncle</option>
						<option>Step Aunt</option>
						<option>Step Niece</option>
						<option>Step Nephew</option>
						<option>Step Grandfather</option>
						<option>Step Grandmother</option>
						<option>Others</option>
					</select>
				</td>
				<td>
					<a  style="color:red" href="javascript:void(0)" data-params='{"RESIDENT_ID":"${m.RESIDENT_ID}"}' data-event="ResidentsModalController.click.removeMember"><i class="icon-remove"></i> Remove</a>
				</td>
			</tr>`;
		}
		tbody.insertAdjacentHTML("beforeend",tbodyContents);
	}
	
	removeMember( arg ){
		if ( !confirm ( "Do you want to remove this member?" ) )
			return;
		//console.log(this.removedHHMembers)
		let index = this.houseHoldMembers.findIndex(x=>x.RESIDENT_ID == arg.RESIDENT_ID);
		let rem = this.houseHoldMembers[index]
		//console.log(this.houseHoldMembers,index,rem,arg.MEMBER_ID,arg)
		this.removedHHMembers.push(this.houseHoldMembers[index])
		//console.log(this.removedHHMembers)
		//setTimeout ( ( ) => {
			this.houseHoldMembers.splice ( index , 1 );
			this.addMembers();
			this.binds(this.controllerName,'#'+this.modalID);
			this.bindChildObject ( this , false );
		//},1000);
	}

	async viewClaimRecordsFamilyMembers () {
		//let claimRecordsFamilyMembers = 
		//	await this.mainService.viewClaimRecordsFamilyMembers(this.residentVars.RESIDENT_ID);
		let ssm = new DateRangeModal ({
			modalID :  "dateRangeModal",
			controllerName : "DateRangeModal",
			template : "/vims/sources/templates/modal/date.range.modal.template.html",
			params : {
				asyncRequest: this.mainService.viewClaimRecordsFamilyMembers,
				next: this.openMembersClaimsReport,
				paramsMethod : {
					RESIDENT_ID : this.residentVars.RESIDENT_ID,
					MAIN_SERVICE_CONTEXT : this.mainService,
				}
			},
			parent : this,
		});
		ssm.render();
	}

	openMembersClaimsReport (result, context, params) {
		let _this = context;
		_this.mainService.openTab(
			"POST", 
			"/vims/sources/templates/reports/residents.benifit.claims.report.template.php", {
				data : {
					res : result,
					param : params
				},
			}, "blank_");
	}
	
	viewMember( arg ){
		
	}
	
	init(){
	}
	
	onSelectBrgyHead( arg ){
		let hd = arg.detail.query;
		this.residentVars.HH_LEADER = hd.RESIDENT_ID;
		this.residentVars.ADDRESS = hd.ADDRESS;
		this.residentVars.PUROK = hd.PUROK;
		this.PUROK_NAME = hd.PRK_NAME;
		this.hh_leader = hd.FULLNAME;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		hd.modal.onClose();
	}
	
	removeBrgyHead( ){
		if ( !confirm ("Are you sure you want to remove?") )
			return;
		
		this.residentVars.HH_LEADER = "";
		this.hh_leader = "";
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
	}
	
	searchResident( arg ){
		//console.log(arg)
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type : arg.search ? arg.search : 'resident',
				action : 'link',
				controller : this.controllerName,
				evt : arg.onevt ? arg.onevt : ':onAddMembers',
				//arg : args,
				brgyargs : {
					HH_LEADER : this.residentVars.RESIDENT_ID,
					hh_leader_ : this.residentVars.FULLNAME,
					PUROK : this.residentVars.PUROK,
					PUROK_NAME : this.PUROK_NAME,
					ADDRESS : this.residentVars.ADDRESS,
				},
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		ssm.render();
	}
	
	searchBarangay (arg) {
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

	searchPurok (arg){
		let ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type : "purok",
				action : 'link',
				controller : this.controllerName,
				evt : ':onLinkPurok',
				//arg : args,
			},
			
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
		ssm.render();
	}
	
	onAddMembers( arg ){
		let mems = arg.detail.query;
		let index = this.houseHoldMembers.findIndex(x=>x.RESIDENT_ID == mems.RESIDENT_ID);
		if ( index > -1 || (mems.HH_LEADER != "" && mems.HH_LEADER != this.residentVars.RESIDENT_ID) ){
			alert ("Has already added as family member!");
			return;
		}
		
		if ( mems.RESIDENT_ID == this.residentVars.RESIDENT_ID ){
			alert ( "You cannot add yourself as a member!" )
			return;
		}
		
		mems.modal.onClose();
		
		this.houseHoldMembers.push ({
			FULLNAME : mems.FULLNAME,
			BIRTHDAY : mems.BIRTHDAY,
			age : this.mainService.calculateAge( mems.BIRTHDAY.split("-") , this.mainService.getCurrentDate().split("-") ),
			RESIDENT_ID : mems.RESIDENT_ID,
		});
		
		this.addMembers();
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
	}
	
	claimBenifitRecords () {
		let ssm = new ResidentBenifitClaimRecordsModalController ({
			modalID :  "claim-benifits-modal",
			controllerName : "ResidentBenifitClaimRecordsModalController",
			template : "/vims/sources/templates/modal/residents.benifit.claim.records.modal.template.html",
			parent : this,
		});
		ssm.render();
	}

	onLinkBarangay ( arg ){
		/* if (this.residentVars.IS_FAMILY_LEADER == 0){
			alert ( "Cannot change purok!" );
			return;
		} */
		let ms = arg.detail.query;
		this.residentVars.BARANGAY_ID = ms.BARANGAY_ID;
		this.BARANGAY_NAME = ms.BARANGAY_NAME;
		this.residentVars.ADDRESS = `${this.PUROK_NAME} ${this.BARANGAY_NAME} ${this.CITY_ADDRESS}`;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		ms.modal.onClose();
	}
	
	onLinkPurok ( arg ){
		/* if (this.residentVars.IS_FAMILY_LEADER == 0){
			alert ( "Cannot change purok!" );
			return;
		} */
		let ms = arg.detail.query;
		this.residentVars.PUROK = ms.PRK_ID;
		this.PUROK_NAME = ms.PRK_NAME;
		this.residentVars.ADDRESS = `${this.PUROK_NAME} ${this.BARANGAY_NAME} ${this.CITY_ADDRESS}` ;
		this.binds(this.controllerName,'#'+this.modalID);
		this.bindChildObject ( this , false );
		ms.modal.onClose();
	}
	
	changeValues() {
		this.bindChildObject(this,true);
	}
	
	save() {
		this.bindChildObject(this,true);
		let origEmergency = this.residentVars.EMERGENCY;
		this.residentVars.EMERGENCY = JSON.stringify(this.residentVars.EMERGENCY);
		this.residentVars.FULLNAME = `${this.residentVars.LASTNAME} ${this.residentVars.FIRSTNAME} ${this.residentVars.MIDDLENAME}`;
		this.residentVars.ITEM_IMAGE = this.residentVars.ITEM_IMAGE == '' ? this.itemtemppic : `/vims/sources/complist/${session_data.COMPANY_DIR}/itemimage/${this.residentVars.RESIDENT_ID}/profpic/${this.residentVars.ITEM_IMAGE.split("\\")[2]}`;
		if (this.residentVars.IS_FAMILY_LEADER != 1) this.residentVars['HH_CODE'] = '';
		let saveparams = ( ServerRequest.queryBuilder( this.mainService.object2array(this.residentVars) , this.isUpdate ? "UPDATE" : "INSERT" ) );
		
		
		//console.log(this.residentVars.ITEM_IMAGE);

		//return;

		let sqlformems = "";
		let valformems = [];
		
		let sqlformres = "";
		let valformres = [];
		
		let sqlforremovedmems = "";
		let valforremovedmems = [];

		for ( let rhh in this.removedHHMembers ){
			let rhhsel = this.removedHHMembers[rhh];
			//console.log(this.removedHHMembers,rhh)
			sqlforremovedmems += `UPDATE vims.barangay_res_setup SET  HH_LEADER = ?, RELATIONSHIP_TO_HH_LEADER = ? WHERE RESIDENT_ID = ?;`;
			valforremovedmems.push ("");
			valforremovedmems.push ("");
			valforremovedmems.push (rhhsel.RESIDENT_ID);
		}
		//console.log(this.houseHoldMembers)
		for ( let mm in this.houseHoldMembers ){
			let selm = this.houseHoldMembers[mm];
			
			sqlformres += `UPDATE vims.barangay_res_setup SET PUROK = ?, HH_LEADER = ?,  ADDRESS = ?,
				RELATIONSHIP_TO_HH_LEADER = ?
				WHERE RESIDENT_ID = ?;`;
			valformres.push (this.residentVars.PUROK);
			valformres.push (this.residentVars.RESIDENT_ID);
			valformres.push (this.residentVars.ADDRESS);
			valformres.push (selm.RELATIONSHIP_TO_HH_LEADER);
			valformres.push (selm.RESIDENT_ID);

		}
		
		//console.log(saveparams)
		
		let sql1 = !this.isUpdate ? `INSERT INTO barangay_res_setup ${saveparams.initial} VALUES ${saveparams.seconds}` :
									`UPDATE barangay_res_setup ${saveparams.initial} where RESIDENT_ID = "${this.residentVars.RESIDENT_ID}"`;
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
							sql : sqlformres,
							db : 'DB',
							query_request : "INSERT",
							values : valformres
						},	
						{
							sql : sqlforremovedmems,
							db : 'DB',
							query_request : "UPDATE",
							values : valforremovedmems
						},
					]
				}			
			}	
		};
		for(let dq in dataQuery.data.data.REQUEST_QUERY){
			if ( dataQuery.data.data.REQUEST_QUERY[dq].values.length == 0 )
				dataQuery.data.data.REQUEST_QUERY.splice ( dq , 1 );
		}

		this.mainService.serverRequest( dataQuery , ( res ) => {

			let formData = new FormData();
				formData.append('file',$('#itemimage_pic')[0].files[0]);
				formData.append('dir',`${session_data.COMPANY_DIR}/itemimage/${this.residentVars.RESIDENT_ID}/profpic/`);
				formData.append('createdir',true);
				formData.append('request','file_upload');


			this.mainService.serverRequestFileUpload( {
				type: "POST",
				url : this.mainService.urls["generic"]['url'],
				data : {
					data : {
						formdata : formData,
					}			
				}
			} , 
			( res ) => {
				MainService.EventObject[this.modalData.parent.controllerName].dispatch (`${this.modalData.onSearchEvent}` , {
					detail : {
						query : {
						}
					} 
				});
				alert("success!");
				//this.onClose();
				this.residentVars.EMERGENCY = origEmergency;
			});

			
		} 
		, ( res ) => {
			//err
		});	
	}
	
}