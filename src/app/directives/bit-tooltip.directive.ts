import { Directive, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewContainerRef } from '@angular/core';
import { fromEvent, merge, Subscription } from 'rxjs';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[bitTooltip]'
})
export class BitTooltipDirective implements OnInit, OnDestroy {
  // INPUTS
  @Input() set bitTooltip(value: string) { this._ttpText = value; };
  @Input() set bitTooltipImgUrl(value: string) { this._ttpImgUrl = value; }
  
  // PRIVATES
  private _sub: Subscription = Subscription.EMPTY;
  private _natRef: HTMLElement = this._elmRef.nativeElement;
  private _ttpOffset: number = 15;
  private _ttpText: string = '';
  private _ttpImgUrl: string = '';
  private _ttpClass: string = 'bit-tooltip';

  constructor(
    private _elmRef: ElementRef,
    private _rnd2: Renderer2,
    private _vcr: ViewContainerRef
    ) { } 

  ngOnInit(): void { 
    this._initSubscriber(); 
  }

  ngOnDestroy(): void {
    this._sub.unsubscribe();    
  }

  /**
  * Methode initialisiert die Subscriber.
  */
  private _initSubscriber(): void {
    const obs$ = merge(
      fromEvent<MouseEvent>(this._natRef, 'mouseenter'),
      fromEvent<MouseEvent>(this._natRef, 'mouseleave'),
      fromEvent<MouseEvent>(this._natRef, 'mousemove')
    );

    this._sub = obs$.subscribe((event: MouseEvent) => {
      if(event.type === 'mouseenter') {       
        this._onMouseEnter();
      } else if(event.type === 'mousemove') {
        this._onMouseMove(event);
      } else {           
        this._onMouseLeave();
      }
    }); 
  }  

  // EVENTS

  /**
   * Event wenn Maus das Native Element betritt.
   * @returns 
   */
  private _onMouseEnter(): void {
    const ttps = this._natRef.querySelectorAll(`.${this._ttpClass}`);
    if(ttps.length > 0) { return; }

    const ttpComp = this._vcr.createComponent(TooltipComponent);
    ttpComp.setInput('tooltipText', this._ttpText);
    ttpComp.setInput('tooltipImgUrl', this._ttpImgUrl);

    const ttpNatv = ttpComp.location.nativeElement;
    this._rnd2.addClass(ttpNatv, this._ttpClass);
    this._rnd2.appendChild(this._natRef, ttpNatv); // füge tootltip als child zu native element hinzu
  }

  /**
   * Event wenn Maus im Native Element bewegt.
   */
  private _onMouseMove(event: MouseEvent): void {
    const ttp = this._natRef.querySelector(`.${this._ttpClass}`);
    if(!ttp) { return; }

    // position des tooltip folgt der maus position    
    this._rnd2.setStyle(ttp, 'left', `${event.pageX + this._ttpOffset}px`);
    this._rnd2.setStyle(ttp, 'top', `${event.pageY + this._ttpOffset}px`);
  }

  /**
   * Event wenn Maus das Native Element verlässt.
   * @returns 
   */
  private _onMouseLeave(): void {
    let ttps = this._natRef.querySelectorAll(`.${this._ttpClass}`); 
    if(!ttps.length) { return; }      
    
    for(let i = 0; i < ttps.length; i++) {
      this._vcr.remove(i);
    }
  }
}
