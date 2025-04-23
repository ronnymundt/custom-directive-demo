import { Component } from '@angular/core';
import { TooltipDirective } from '../../directives';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  imports: [TooltipDirective],
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
