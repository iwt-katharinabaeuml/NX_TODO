import { Component , HostBinding} from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { TodosComponent } from './lists/todos/todos/todos.component';
import { SlideOverComponent } from './slide_over/slide_over.component';
import { MenuIconComponent } from './shared/menu.component';



@Component({
  standalone: true,
  imports: [ RouterModule, HeaderComponent, TodosComponent, SlideOverComponent, RouterLink, RouterOutlet, MenuIconComponent],
  selector: 'fse-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
