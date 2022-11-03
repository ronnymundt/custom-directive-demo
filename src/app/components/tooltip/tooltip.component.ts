import { Component, Input, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit, OnDestroy {
  @Input() tooltipText: string = '';
  @Input() tooltipImgUrl: string = '';

  constructor() { }
  
  ngOnInit(): void { }

  ngOnDestroy(): void { }
}
