import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Movie, GenreMap } from '../../types/movie.type';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  
  // NOVO: controla se deve mostrar botão Remover
  @Input() showRemoveButton = false;

  @Output() addToMarathon = new EventEmitter<Movie>();
  @Output() removeFromMarathon = new EventEmitter<Movie>();

  getPosterUrl(): string {
    return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
  }

  getGenre(): string {
    return this.movie.genre_ids?.[0] ? GenreMap[this.movie.genre_ids[0]] : 'N/A';
  }

  onAddToMarathon(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.addToMarathon.emit(this.movie);
  }

  onRemoveFromMarathon(event?: MouseEvent) {
    if (event) event.stopPropagation();
    this.removeFromMarathon.emit(this.movie);
  }
}
