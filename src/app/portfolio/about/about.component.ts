import { Component, AfterViewInit, Renderer2, ElementRef, ViewChild, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { GESliderDirective } from '../geslider/geslider.directive';
import { Step } from './steps.interface';
import { STEPS } from './mock-steps';
import { ObjLoop } from '../../loop/object-loop.pipe';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/observable/fromEvent';


@Component({
	templateUrl: './about.template.html',
	styleUrls: ['./about.style.scss'],
})
export class AboutComponent implements AfterViewInit
{
	private currentStep: number = 0;
	private currentSlide: number = 1
	private maxStep: number = 5;
	private cursor;
	private prev: number;
	public steps: { [key: number]: Step }; 
	private stateChange: boolean = true;
	private delayWheel = 0;

	constructor(private elRef: ElementRef, private renderer: Renderer2) {
		this.setSteps();
	}

    @Output() changeStep = new EventEmitter();
	@ViewChild('sliderText', {read: GESliderDirective}) sliderText:GESliderDirective;
	@ViewChild('sliderSchema', {read: GESliderDirective}) sliderSchema:GESliderDirective;
    test = Observable.fromEvent(document, 'changeStep');



	// @HostListener('changeStep', ['$event']) listenerWheelUp(event: any) {
 //    	console.log(event);
 //  //       	setTimeout(()=>{
			
	// 	// }, 4900);
 //    }
    stepChanging(id:number) {
    	if(this.stateChange) {		
    		this.stateChange = false;
				this.changeStepTo(id);
	    	setTimeout(()=>{
				this.stateChange = true;
			}, this.delayWheel);
    	}
    }

	ngAfterViewInit() {
        // this.test
        // // .debounceTime(1000)
        // .subscribe((event) => {
        //     console.log('subscribe');
        // });


		this.cursor = document.querySelector("#cursor");
        this.stepChanging(1);
	    // document.dispatchEvent(new CustomEvent( 'mousewheel' )); 		
	}

	setSteps() {
		this.steps = STEPS;
	}

    prevStep(): void {    	
    	this.stepChanging(this.currentStep-1)
		// this.changeStepTo(this.currentStep - 1);
    }

    nextStep(): void {
    	this.stepChanging(this.currentStep+1)
		// this.changeStepTo(this.currentStep + 1);
    }

    selectStep(tou : number) {
    	console.log(this.delayWheel);
    	if(tou != this.currentStep) this.stepChanging(tou);
    }

    changeStepTo(idStep : number) {
    	// this.delayWheel = 10000;

   		if(this.currentStep > 0) {
   			console.log(this.currentStep);
   			console.log(idStep);

   			if(idStep in this.steps) {

	   			if(this.currentStep in this.steps) {
					this.delayWheel = this.steps[this.currentStep].delay;
	   			}
				
				// console.log(this.currentStep);
				// console.log(this.steps[this.currentStep]);
				// console.log(this.currentStep in this.steps);
				// console.log(this.delayWheel);
	    		if(idStep >  this.currentStep) {
					this.delayWheel = this.steps[this.currentStep].delay;
				}
				else {
					this.delayWheel = this.steps[idStep].delay;
				}
				// console.log(this.delayWheel);
   			}
   			else {
   				this.delayWheel = 1000;
   			}

		}

    	if(idStep > 0 && idStep <= this.maxStep) {

	    	//Supprime les classes lorsqu'on n'est plus au premier passage
	    	if(this.currentStep != 0) {

			    this.cursor.classList = "";
				//Permet de trigger un changement sur mon élement pour que la prochaine animation soit prise en compte
				this.cursor.offsetWidth;
	    	}

	    	console.log(this.cursor);

	    	this.renderer.addClass(this.cursor, 'step-'+this.currentStep+'-'+idStep);
	    	
	    	if(idStep in this.steps) {
	     		this.sliderText.goToSlide(this.steps[idStep].idSlide);
	    	}

	        if(idStep%3 == 0) {       
	        	let stepFunction = '';
	        	if(idStep >  this.currentStep) {
	        		++this.currentSlide 
	        		stepFunction = 'next'
	        	} else { 
	        		--this.currentSlide;
	        		stepFunction = 'prev'
	        	}
	        	this.sliderSchema.goToSlide(this.currentSlide);		

	        	setTimeout(()=>{
					stepFunction == "next" ? this.nextStep() : this.prevStep();
	        	}, 2000);

	        	// document.dispatchEvent(new CustomEvent( 'changeStep', { detail: { 'target': this.currentSlide, 'stepFunction' : stepFunction }} )); 		
	        }
	        this.prev = this.currentStep;
			this.currentStep = idStep;    
    	}
    	else if (idStep <= 0) {
	    	this.renderer.removeClass(this.cursor, 'block-top');
			this.cursor.offsetWidth;
	    	this.renderer.addClass(this.cursor, 'block-top');
    	}
    	else if (idStep > this.maxStep) {
    		this.renderer.removeClass(this.cursor, 'block-bottom');
			this.cursor.offsetWidth;
	    	this.renderer.addClass(this.cursor, 'block-bottom');
    	}

    }
}