import { Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface CarouselItem {
  id: number;
  title?: string;
  name?: string;
  imgSrc?: string;
  link: string;
  rating?: number;
  vote?: number;
  character?: string;
}

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CarouselComponent implements AfterViewInit {
  @Input() title!: string;
  @Input() items: CarouselItem[] = [];
  @Input() isExplore = false;
  @Input() exploreLink = '';
  @Input() isDefaultCarousel = true;
  @Input() isCastCarousel = false;

  @Output() prevSlideEvent = new EventEmitter<void>();
  @Output() nextSlideEvent = new EventEmitter<void>();

  @ViewChild('carouselContainer', { static: false }) carouselContainer!: ElementRef;

  private _canNavigateLeft = false;
  private _canNavigateRight = false;

  get canNavigateLeft() { return this._canNavigateLeft; }
  get canNavigateRight() { return this._canNavigateRight; }

  ngAfterViewInit() {
    // Aguarda o DOM renderizar
    setTimeout(() => this.updateNavigation(), 0);
  }

  prevSlide() {
    const container = this.carouselContainer.nativeElement;
    container.scrollLeft -= 300;
    // Aguarda o scroll atualizar
    setTimeout(() => this.updateNavigation(), 50);
    this.prevSlideEvent.emit();
  }

  nextSlide() {
    const container = this.carouselContainer.nativeElement;
    container.scrollLeft += 300;
    // Aguarda o scroll atualizar
    setTimeout(() => this.updateNavigation(), 50);
    this.nextSlideEvent.emit();
  }

  private updateNavigation() {
    const container = this.carouselContainer.nativeElement;
    this._canNavigateLeft = container.scrollLeft > 0;
    // Math.ceil para compensar arredondamento de pixels
    this._canNavigateRight = container.scrollLeft < Math.ceil(container.scrollWidth - container.clientWidth);
  }

  getPosterUrl(imgSrc: string): string {
    return `https://image.tmdb.org/t/p/w500${imgSrc}`;
  }
}
