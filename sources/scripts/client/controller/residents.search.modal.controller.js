import { Modal } from "../classes/modal.controller.class.js";
import { LoadingModal } from "./loading.modal.controller.class.js";
import { MainService } from "../classes/main.service.class.js";
import { SearchModal } from "./search.modal.controller.class.js";

export class ResidentSearchModal extends Modal{

	constructor ( modalData ){
		super ( modalData );
	}
	
	RESIDENT(){
		this.SEARCH("resident_all");
	}
	PUROK(){
		this.SEARCH("purok");
	}

    SEARCH (search_key) {
        this.ssm = new SearchModal ({
			modalID :  "search-modal",
			controllerName : "searchmodal",
			template : "/vims/sources/templates/modal/search.modal.template.html",
			params : {
				type : search_key,
				action : 'link',
				controller : this.controllerName,
				evt : ':onSelectItem',
				//arg : args,
			},
			instanceID : this.mainService.generate_id_timestamp("sm"),
			parent : this,
		});
        //this.onClose();
		this.ssm.render();
    }

    onSelectItem (selectedItem) {
        let queryDetails = selectedItem.detail.query;
        let queryRequestObject = {};
        if (queryDetails.RESIDENT_ID) {
            queryRequestObject = {
                table : 'barangay_res_setup',
                field : 'RESIDENT_ID',
                value : queryDetails.RESIDENT_ID,
            }
        }

        if (queryDetails.PRK_ID) {
            queryRequestObject = {
                table : 'barangay_prk_setup',
                field : 'PRK_ID',
                value : queryDetails.PRK_ID,
            }
        }

        let requestSearch = {
            type: "POST",
            url : this.mainService.urls["generic"].url,
            data : {
                data : {
                    request : 'generic',
                    REQUEST_QUERY : [
                        {
                            sql : `SELECT * FROM vims.${queryRequestObject.table} WHERE ${queryRequestObject.field} = ?`,
                            db : 'DB',
                            query_request : 'GET',
							index : 'result',
                            values : [queryRequestObject.value]
                        },	
                    ]
                }
                        
            }
        };
        this.mainService.serverRequest (requestSearch, (args) => {
            let resSearch = (JSON.parse(args))['result'][0];
            let foreignKey = '';
            if (resSearch.RESIDENT_ID) {
                foreignKey = resSearch.HH_LEADER !== '' ? 
                    resSearch.HH_LEADER : resSearch.RESIDENT_ID;
            } 
            if (resSearch.PRK_ID) { 
                foreignKey = resSearch.PRK_ID;
            }
            
            let requestSearchLandMark = {
                type: "POST",
                url : this.mainService.urls["generic"].url,
                data : {
                    data : {
                        request : 'generic',
                        REQUEST_QUERY : [
                            {
                                sql : `SELECT * FROM vims.barangay_land_marks WHERE FOREIGN_KEY = ?`,
                                db : 'DB',
                                query_request : 'GET',
							    index : 'result',
                                values : [foreignKey]
                            },	
                        ]
                    }
                            
                }
            };
            this.mainService.serverRequest (requestSearchLandMark, (args1) => { 
                let resSearch1 = (JSON.parse(args1))['result'][0];
                if (resSearch.HH_LEADER!=='') {
                    resSearch1['LOC_NAME'] = `${resSearch.FIRSTNAME} ${resSearch.LASTNAME} ${resSearch.MIDDLENAME}`;
                }

                MainService.EventObject[this.modalData.parent.controllerName]
			        .dispatch (`${this.modalData.parent.controllerName}${this.modalData.params.onSearchLocation}`,
                        {detail: resSearch1});

                if (!resSearch1) {
                    alert("Not found");
                    return;
                }
                this.onClose();
                selectedItem.detail.query.modal.onClose();
            });
        });
    }
	
	constructs(){
	}
	
	initialize(){	
	}
	
}