import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';
import { SlideOverService } from '../services/slide_over.service';

@Component({
  selector: 'fse-slide-over',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slide_over.component.html',
  styleUrl: './slide_over.component.scss',
  animations: [
    trigger('slideInOut', [
      state(
        'in',
        style({
          transform: 'translateX(0)',
          opacity: 1,
        })
      ),
      state(
        'out',
        style({
          transform: 'translateX(100%)',
          opacity: 0,
        })
      ),
      transition('in => out', animate('500ms ease-in-out')),
      transition('out => in', animate('500ms ease-in-out')),
    ]),
   
  ],
})
export class SlideOverComponent {
  isOpen$ = this.slideOverService.isOpen$;

  constructor(
    private slideOverService: SlideOverService,
  
  ) {}

  toggleSlideOver(): void {
    this.slideOverService.toggle();  }
active:boolean = true

  changeStatus():void{
    this.active = !this.active
  }
  

}


