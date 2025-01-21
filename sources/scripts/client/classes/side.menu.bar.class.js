import { Modal } from "./modal.controller.class.js"
// Extends modal because it is a component of a page,
// it has a parent page
export class SideMenuBar extends Modal{
	// Variable Initialization
	constructor ( modalData ){
		super ( modalData );
		this.isRestored = this.modalData.isRestored;
		this.currentNavIndex = this.modalData.defaultIndex;
	}
	// HTML DOM after load
	constructs(){
		this.toggle();
		this.populateSideMenuBar(this.isRestored , true);
		this.navigate({index:this.modalData.defaultIndex});
	}
	//override
	init(){
	}
	
	//animate width of sidebar and the opposite
	toggle(){
		if(!this.isRestored){
			$(this.modalData.menuParentDiv).css("width","4%");
			$('#'+this.modalData.oppositeDiv).css("width","96%");
			$("#side-menu-bar-toggle-btn").attr("align","center");
			$("#toggle-btn").text(">>");
			this.isRestored = true;
		}
		else{
			$(this.modalData.menuParentDiv).css("width","15%");
			$('#'+this.modalData.oppositeDiv).css("width","85%");
			$("#side-menu-bar-toggle-btn").attr("align","right");
			$("#toggle-btn").text("<<");
			this.isRestored = false;
		}
		this.populateSideMenuBar(this.isRestored);
	}
	
	populateSideMenuBar( isRestored , load ){
		let sidebarMenus = document.querySelector ( "#side-menu-bar-menus ul" );
			sidebarMenus.innerHTML = "";
		for( let mi in this.modalData.args.menus ){
			let selMI = this.modalData.args.menus[mi];
			let txt = document.createElement("span");
			let li = document.createElement("li");
			let a = document.createElement("a");
			let txtMenu = `${selMI.name}`;
			if (this.currentNavIndex == mi){
				a.className = "active";
			}
			if (selMI.icon){
				if(selMI.icon.isClass){
					let icon = document.createElement("i");
					icon.className = selMI.icon.value;
					a.appendChild(icon);
				}
				else{
					txtMenu = `${selMI.icon.value} ${txtMenu}`;
					if(isRestored){
						txtMenu = `${selMI.icon.value}`;
						txt.style.fontSize = !selMI.width ? "4vh" : selMI.width;
					}
				}
			} 
			a.dataset.params = '{"index":"'+mi+'"}';
			a.dataset.event = "SideMenuBar.click.navigate";
			txt.innerHTML = txtMenu;
			a.href = "javascript:void(0);";
			a.id = `_${mi}`;
			a.title = `${selMI.name}`;
			/* a.dataset.toggle = "tooltip";
			a.dataset.placement = "right"; */
			a.appendChild (txt) ;
			li.appendChild(a);
			sidebarMenus.appendChild (li);
		}
		if( !load ){
			this.binds(this.controllerName,`#${this.modalID}`);
			this.bindChildObject(this,false);
		}
	}
	
	navigate ( args ){
		let index = args.index;
		this.currentNavIndex = index;
		for(let i in this.modalData.args.menus){
			let sl = this.modalData.args.menus[i];
			let selAnchor = document.querySelector ( `${this.modalData.menuParentDiv} ul li > a#_${i}` );
			if ( i == index ){
				if(!this.modalData.args.menus[i].page.isRendered){
					selAnchor = document.querySelector ( `${this.modalData.menuParentDiv} ul li > a#_${index}` );
					selAnchor.className = "active";
					this.modalData.args.menus[i].page.object.renderDiv(this.modalData.oppositeDiv);
					this.modalData.args.menus[i].page.isRendered = true;
				}
				else{
					return;
				}
			}
			else{
				selAnchor.className = "";
				this.modalData.args.menus[i].page.object.destroyModal();
				this.modalData.args.menus[i].page.isRendered = false;
			}
		}
	}
}