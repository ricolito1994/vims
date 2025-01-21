import { Modal } from "../classes/modal.controller.class.js"
import { DataTableService } from "../classes/datatable.service.class.js";
import { ServerRequest } from "../classes/serverrequest.service.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";

export class ResidentBenifitClaimRecordsModalController extends Modal {
    constructor (modalData) {
        super(modalData);
        this.parent = this.modalData.parent;
        this.residentArgs = this.parent.residentVars;
        this.totalAmountClaim = 0;
        this.claimObject = {
            CLAIM_TYPE : 0,
            AMOUNT : 0,
            DATE_CLAIM : this.mainService.getCurrentDate(),
            RESIDENT_ID : this.residentArgs.RESIDENT_ID,
            ENCODED_BY : session_data.EMP_ID,
        }
        this.dateClaimTo = this.mainService.getCurrentDate();
    }

    init () {
        let condClaimType = this.claimObject.CLAIM_TYPE == 0 ? "" : `AND CLAIM_TYPE = ${this.claimObject.CLAIM_TYPE}`;

        let valsQuery = [
            this.residentArgs.RESIDENT_ID,
            this.claimObject.DATE_CLAIM,
            this.dateClaimTo,
        ]

        let dataQuery = {
			type: "POST",
			url : this.mainService.urls["generic"].url,
			data : {
				data : {
					request : 'generic',
					REQUEST_QUERY : [
						{
							sql : `SELECT *, 
                                    (
                                        SELECT BENIFIT_NAME FROM 
                                        vims.benifit_claim_types WHERE ID = CLAIM_TYPE
                                    ) as BENIFIT_NAME 
                                    FROM vims.benifit_claim_records WHERE RESIDENT_ID = ? 
                                    AND DATE_CLAIM BETWEEN ? AND ? ${condClaimType}` ,
							db : 'DB',
							query_request : 'GET',
							index : 'result',
							values : valsQuery,
						},	
					]
				}
						
			}
		};
		
		this.mainService.serverRequest(dataQuery, (res) => {
			setTimeout( ( ) => {
				let stds = (JSON.parse(res))['result'];
				let d = stds.length >= 130 ? 130 : Math.round( stds.length / 1 );
                this.totalAmountClaim = 0;
                for (let i in stds) {
                    let s = stds[i];
                    this.totalAmountClaim = parseFloat(this.totalAmountClaim) + parseFloat(s.AMOUNT);
                }
				this.dataTable.setTableData(stds);
				this.dataTable.setPaginateCtr(d);
				this.dataTable.construct();
				//load.onClose();
                setTimeout (() => {
                    this.bindChildObject(this,false);
                });
			},110);
		} 
		, ( res ) => {
			//err
			console.log(res);
		});	
    }

    searchClaim () {
        this.bindChildObject(this,true);
        this.init();	
    }

    addClaim () {
        this.bindChildObject(this,true);
        if(this.claimObject.CLAIM_TYPE == 0){
            alert("Please chose a valid Benifit");
            return;
        };

        let saveparams = (ServerRequest.queryBuilder(this.mainService.object2array(this.claimObject), "INSERT"));
        let sql1 = `INSERT INTO benifit_claim_records ${saveparams.initial} VALUES ${saveparams.seconds}`;
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
					]
				}			
			}	
		};
		
		this.mainService.serverRequest(dataQuery, (res) => {
            alert("Claim Success");
            this.init();
		}, (err) => {
            console.log(res)
		});	
    }

    async changeBenifitType () {
		this.bindChildObject(this,true);
        let benifitsType = await this.mainService.getBenifitTypes();
        let amount = 
            this.claimObject.CLAIM_TYPE > 0 ?
            benifitsType[this.claimObject.CLAIM_TYPE - 1]['AMOUNT'] : 0;
        this.claimObject.AMOUNT = amount;
        setTimeout (() => {
            this.bindChildObject(this,false);
        });
    }

    async constructs () {
        let benifitsType = await this.mainService.getBenifitTypes();
        let selectBenifitDom = document.getElementById('select-benifit');
        let optionAll = document.createElement('option');
            optionAll.value = 0;
            optionAll.innerText = 'ALL';
            selectBenifitDom.appendChild(optionAll);
        for (let i in benifitsType) {
            let option = document.createElement('option');
                option.value = benifitsType[i]['ID'];
                option.innerText = benifitsType[i]['BENIFIT_NAME'];
                selectBenifitDom.appendChild(option);
        }

        this.dataTable = new DataTableService({
			template : "/vims/sources/templates/section/datatable.template.section.html",
			controller : this,
			controllername : this.controllerName,
			tableID : "dttable",
			service : this.mainService,
			parentDiv : ".resident-claims-benifit-table-container",
			filterElems : [],
			fields : [
				{
					head : "BENIFIT",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['BENIFIT_NAME'];
									},
								},
							]
						}
					]
				},
				{
					head : "AMOUNT",
					sort : {
						asc : ['AMOUNT'],
						dsc : ['-AMOUNT'],
					},
					sortBy : 'asc',
					elements : [
						{
							createElement : "b",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['AMOUNT'];
									},
								}
							]
						}
					]
				},
				{
					head : "DATE CLAIM",
					elements : [
						{
							createElement : "span",
							attributes : [
								{
									attribute : "innerText",
									value : ( selData ) => {
										return selData['DATE_CLAIM'];
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
									value : "btn btn-danger",
								},
								{
									type : "event",
									attribute : "click",
									value : ( argss ) => {
										//this.openitem(arg)
										let dataQuery = {
											type: "POST",
											url : this.mainService.urls["generic"].url,
											data : {
												data : {
													request : 'generic',
													REQUEST_QUERY : [
														{
															sql : `DELETE FROM vims.benifit_claim_records WHERE ID = ?`,
															db : 'DB',
															query_request : "DELETE",
															values : [argss.ID]
														},	
													
													]
												}	
											}
											
										};
										//console.log(dataQuery)
										this.mainService.serverRequest( dataQuery , ( res ) => {
                                            if (! confirm("Are you sure?")) return;
											setTimeout ( ( ) =>{
												this.init();
											},100);
										},err=>{
												
										});
										
									},
								}
							],
							children : [
								{
									createElement : "span",
									attributes : [
										{
											attribute: "innerText",
											value : "×",
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
}
