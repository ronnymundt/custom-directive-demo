import { Component } from '@angular/core';
import { HomeComponent } from './components/home/home.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [HomeComponent],
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {}
