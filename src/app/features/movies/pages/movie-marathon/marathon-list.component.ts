// src/app/pages/movie-marathon/marathon-list.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movie } from '../../types/movie.type';
import { MarathonService } from './marathon.service';
import { Router } from '@angular/router';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';


@Component({
  standalone: true,
  selector: 'app-marathon-list',
  templateUrl: './marathon-list.component.html',
  styleUrls: ['./marathon-list.component.scss'],
  imports: [CommonModule, MovieCardComponent]
})
export class MarathonListComponent implements OnInit {
  marathonService = inject(MarathonService);
  router = inject(Router);
  marathonList: Movie[] = [];

  ngOnInit() {
    this.marathonService.list$.subscribe(list => {
      this.marathonList = list || [];
      console.log('[MarathonList] list updated, count=', this.marathonList.length);
    });
  }

  getMarathonDuration(): string {
    const totalMinutes = this.marathonList.reduce((sum, movie) => sum + (movie.runtime || 0), 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  }

  removeFromMarathon(movie: Movie) {
    this.marathonService.removeMovie(movie.id);
  }

  goBack() {
    this.router.navigate(['/']);
  }
  
}
