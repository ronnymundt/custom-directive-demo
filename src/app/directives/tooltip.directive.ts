import {
  DestroyRef,
  Directive,
  ElementRef,
  Input,
  OnInit,
  Renderer2,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent, merge } from 'rxjs';
import { TooltipComponent } from '../components/tooltip/tooltip.component';

@Directive({
  selector: '[customerTooltip]',
})
export class TooltipDirective implements OnInit {
  // INPUTS
  @Input() set customerTooltip(value: string) {
    this.ttpText = value;
  }
  @Input() set customerTooltipImgUrl(value: string) {
    this.ttpImgUrl = value;
  }

  // PRIVATES
  private natRef: HTMLElement = this.elmRef.nativeElement;
  private ttpOffset: number = 15;
  private ttpText: string = '';
  private ttpImgUrl: string = '';
  private ttpClass: string = 'customer-tooltip';

  constructor(
    private elmRef: ElementRef,
    private readonly rnd2: Renderer2,
    private readonly vcr: ViewContainerRef,
    private readonly destroyRef: DestroyRef,
  ) {}

  ngOnInit(): void {
    this.initSubscriber();
  }

  /**
   * Methode initialisiert die Subscriber.
   */
  private initSubscriber(): void {
    const obs$ = merge(
      fromEvent<MouseEvent>(this.natRef, 'mouseenter'),
      fromEvent<MouseEvent>(this.natRef, 'mouseleave'),
      fromEvent<MouseEvent>(this.natRef, 'mousemove'),
    );

    obs$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event: MouseEvent) => {
        if (event.type === 'mouseenter') {
          this.onMouseEnter();
        } else if (event.type === 'mousemove') {
          this.onMouseMove(event);
        } else {
          this.onMouseLeave();
        }
      });
  }

  // EVENTS

  /**
   * Event wenn Maus das Native Element betritt.
   * @returns
   */
  private onMouseEnter(): void {
    const ttps = this.natRef.querySelectorAll(`.${this.ttpClass}`);
    if (ttps.length > 0) {
      return;
    }

    const ttpComp = this.vcr.createComponent(TooltipComponent);
    ttpComp.setInput('tooltipText', this.ttpText);
    ttpComp.setInput('tooltipImgUrl', this.ttpImgUrl);

    const ttpNatv = ttpComp.location.nativeElement;
    this.rnd2.addClass(ttpNatv, this.ttpClass);
    this.rnd2.appendChild(this.natRef, ttpNatv); // füge tootltip als child zu native element hinzu
  }

  /**
   * Event wenn Maus im Native Element bewegt.
   */
  private onMouseMove(event: MouseEvent): void {
    const ttp = this.natRef.querySelector(`.${this.ttpClass}`);
    if (!ttp) {
      return;
    }

    // position des tooltip folgt der maus position
    this.rnd2.setStyle(ttp, 'left', `${event.pageX + this.ttpOffset}px`);
    this.rnd2.setStyle(ttp, 'top', `${event.pageY + this.ttpOffset}px`);
  }

  /**
   * Event wenn Maus das Native Element verlässt.
   * @returns
   */
  private onMouseLeave(): void {
    const ttps = this.natRef.querySelectorAll(`.${this.ttpClass}`);
    if (!ttps.length) {
      return;
    }

    for (let i = 0; i < this.vcr.length; i++) {
      this.vcr.remove(i);
    }
  }
}
