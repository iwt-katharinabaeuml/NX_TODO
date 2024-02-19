import { Component , HostBinding} from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HeaderComponent } from './header/header.component';
import { TodosComponent } from './lists/todos/todos/todos.component';
import { SlideOverComponent } from './slide_over/slide_over.component';


@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, HeaderComponent, TodosComponent, SlideOverComponent, RouterLink, RouterOutlet],
  selector: 'fse-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
