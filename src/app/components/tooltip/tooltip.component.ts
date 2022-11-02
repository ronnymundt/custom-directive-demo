import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'tooltip',
  templateUrl: './tooltip.component.html',
  styleUrls: ['./tooltip.component.scss']
})
export class TooltipComponent implements OnInit {
  @Input() tooltipText: string = "";

  constructor() { }

  ngOnInit(): void { }
}
