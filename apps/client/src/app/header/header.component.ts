import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent } from '../lists/todos/todos/todos.component';
import { DonesComponent } from '../lists/dones/dones.component';

import { MenuSlideService } from '../services/slide_over.service';

@Component({
  selector: 'fse-header',
  standalone: true,
  imports: [CommonModule, TodosComponent, DonesComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [MenuSlideService],
})

export class HeaderComponent implements AfterViewInit {
  @ViewChild('menu', { static: true }) menu!: ElementRef;

  constructor(
    private menuSlideService: MenuSlideService,
    private renderer: Renderer2
  ) {}
  menuOpen$ = this.menuSlideService.menuOpen$;
  
  ngAfterViewInit(): void {
    console.log('Menu ElementRef:', this.menu.nativeElement);

    this.menuOpen$.subscribe((menuOpen) => {
      console.log('hier kommte es an mit ' + menuOpen )
      if (menuOpen) {  this.renderer.removeClass(this.menu.nativeElement, 'opacity-100');
        this.renderer.addClass(this.menu.nativeElement, 'opacity-0');
      
      } else {
       this.renderer.removeClass(this.menu.nativeElement, 'opacity-0');
        this.renderer.addClass(this.menu.nativeElement, 'opacity-100');
      }
    });
  }


  toggleMenuOver(): void {
    console.log('Menu was toggled');
    this.menuSlideService.toggle();
  }

}