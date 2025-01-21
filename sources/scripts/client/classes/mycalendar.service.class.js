// BTTHS 2020
import { Controller } from "../classes/controller.class.js";
export class CalendarService extends Controller {
	
	constructor ( params ){
		super ( 'calendar' , params.parent.mainService );
		this.parent = params.parent;
		this.months = [
			'January',
			'February',
			'March',
			'April',
			'May',
			'June',
			'July',
			'August',
			'September',
			'October',
			'November',
			'December'
		];
		this.service = this.parent.mainService;
		this.calendarTemplate = params.calendarTemplate;
		this.parentDiv = params.parentDiv;
		this.currentDate = this.service.getCurrentDate();
		this.splitDate = (this.currentDate).split('-');	
		this.currentDay = parseInt(this.splitDate[2]);
		this.currentMonth = parseInt(this.splitDate[1]);
		this.currentYear = parseInt(this.splitDate[0]);
		this.selectedDay = this.currentDay;
		this.selectedMonth = this.currentMonth - 1;
		this.selectedYear = this.currentYear;
		this.selectMonth = this.months[this.selectedMonth];
		this.buildCalendar();
	}
	
	buildCalendar ( ){
		this.service.loadTemplate( this.calendarTemplate ,this.parentDiv,( ) => {
			for ( let i in this.months ){
				let sel = this.months[i];
				let msl = document.querySelector('div.calendar select#calendar-months');
				let opt = document.createElement('option');
				opt.innerText = sel;
				msl.append(opt);
			}
			this.binds("calendar",this.parentDiv);
			this.populatesy ( document.querySelector ( 'div.calendar' ).children , 'calendar' );
			this.spawnCalendar (this.selectedMonth , this.selectedYear);
			this.bindChildObject ( this , false );
		}
		,false,true);
	}
	
	spawnCalendar ( month , year ){
		let tbodyCalendar = document.querySelector('div.calendar table tbody');
		tbodyCalendar.innerHTML="";
		let noOfDays = this.daysInMonth( month, year );
		let firstDay  = ( ( new Date(year, month) ).getDay() );
		let days = 1;
		
		this.selectedMonth = month;
		this.selectedYear = year;
		
		for ( let i = 0 ; i < 6 ; i++ ){
			let row = document.createElement("tr");
			 
			for ( let j = 0 ; j < 7 ;j++ ){
				if ( i === 0 && j < firstDay ){
					let cell = document.createElement('td');
					row.append(cell);
				}
				else if ( days > noOfDays ){
					break;
				}
				else{
					let cell = document.createElement('td');
					cell.innerHTML = days;
					
					if (this.currentDay==days && this.currentYear == year && (this.currentMonth-1) == month)
						cell.className = "today";
					row.append(cell);
					days++;
				}
			}
			tbodyCalendar.append(row);
		}
		
	}
	
	changeCalendar ( ){
		setTimeout ( ( ) => {
			this.bindChildObject(this,this.elem);
			let indexMonth = this.months.findIndex ( x => x === this.selectMonth );
			this.spawnCalendar( indexMonth , this.selectedYear );
		},500);
	}
	
	
	daysInMonth ( month , year ){
		 return 32 - new Date(year, month, 32).getDate();
	}
	
	nextMonth ( ){
		this.selectedMonth++;
		
		if ( this.selectedMonth > 11 ){
			this.selectedMonth=0;
			this.selectedYear++;
		}
		this.selectMonth = this.months[this.selectedMonth];

		this.spawnCalendar( this.selectedMonth , this.selectedYear );
		this.bindChildObject ( this , false );
	}
	
	prevMonth ( ){
		this.selectedMonth--;
		
		if ( this.selectedMonth < 0 ){
			this.selectedMonth=11;
			this.selectedYear--;
		}
		
		this.selectMonth = this.months[this.selectedMonth];

		this.spawnCalendar( this.selectedMonth , this.selectedYear );
		this.bindChildObject ( this , false );
	}
	
	reset ( ){
		this.selectedDay = this.currentDay;
		this.selectedMonth = this.currentMonth - 1;
		this.selectedYear = this.currentYear;
		this.selectMonth = this.months[this.selectedMonth];
		this.spawnCalendar( this.selectedMonth , this.selectedYear );
		this.bindChildObject ( this , false );
	}
	//https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d	
}