import { AfterViewInit, Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosComponent } from '../lists/todos/todos/todos.component';
import { DonesComponent } from '../lists/dones/dones.component';

import { MenuSlideService } from '../services/slide_over.service';
import { MenuIconComponent } from '../shared/menu.component';

@Component({
  selector: 'fse-header',
  standalone: true,
  imports: [CommonModule, TodosComponent, DonesComponent, MenuIconComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  providers: [MenuSlideService],
})

export class HeaderComponent implements AfterViewInit {
  @ViewChild('menu', { static: true }) menu!: ElementRef;
  @ViewChild('newTaskButton', { static: true }) newTaskButton!: ElementRef;


  constructor(
    private menuSlideService: MenuSlideService,
    private renderer: Renderer2
  ) {}
  menuOpen$ = this.menuSlideService.menuOpen$;
  
  ngAfterViewInit(): void {
    console.log('Menu ElementRef:', this.menu.nativeElement);

    this.menuOpen$.subscribe((menuOpen) => {
      console.log('hier kommte es an mit ' + menuOpen )
      if (menuOpen) {
        this.renderer.setStyle(this.menu.nativeElement, 'opacity', '1');
        this.renderer.setStyle(this.menu.nativeElement, 'z-index', '50');
      } else {
        this.renderer.setStyle(this.menu.nativeElement, 'opacity', '0');
        this.renderer.setStyle(this.menu.nativeElement, 'z-index', '-1');
      }

    });
  }


  toggleMenuOver(): void {
    console.log('Menu was toggled');
    this.menuSlideService.toggle();
  }

}