import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent } from '../lists/todos/todos/todos.component';
import { DonesComponent } from '../lists/dones/dones.component';
@Component({
  selector: 'fse-header',
  standalone: true,
  imports: [CommonModule, TodosComponent,DonesComponent ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {}
