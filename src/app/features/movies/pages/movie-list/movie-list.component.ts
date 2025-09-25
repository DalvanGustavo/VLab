import { Component, OnInit, inject } from '@angular/core';
import { MovieFacade } from '../../services/movie.facade';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CarouselItem } from '@shared/components/carousel/carousel.component';
import { RouterModule, Router } from '@angular/router';
import { CarouselComponent } from '@shared/components/carousel/carousel.component';
import { Movie, GenreMap } from '../../types/movie.type';
import { MarathonService } from '../movie-marathon/marathon.service';

@Component({
  standalone: true,
  selector: 'app-movie-list',
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.scss'],
  imports: [CommonModule, AsyncPipe, MovieCardComponent, ReactiveFormsModule, CarouselComponent, RouterModule]
})
export class MovieListComponent implements OnInit {
  facade = inject(MovieFacade);
  router = inject(Router);
  marathonService = inject(MarathonService);

  filteredMovies: Movie[] = [];
  popularMovieList: Movie[] = [];

  nameFilter = new FormControl('');
  genreFilter = new FormControl('');
  yearFilter = new FormControl('');
  sortControl = new FormControl('');

  genreOptions: string[] = Object.values(GenreMap);
  yearOptions: number[] = [];

  popularMovies: CarouselItem[] = [];
  topRatedMovies: CarouselItem[] = [];
  upcomingMovies: CarouselItem[] = [];
  nowPlayingMovies: CarouselItem[] = [];

  ngOnInit() {
    this.loadMovieCategories();

    this.nameFilter.valueChanges.pipe(debounceTime(200), distinctUntilChanged())
      .subscribe(() => this.applyFilters());
    this.genreFilter.valueChanges.subscribe(() => this.applyFilters());
    this.yearFilter.valueChanges.subscribe(() => this.applyFilters());
    this.sortControl.valueChanges.subscribe(() => this.applySort());
  }

  private loadMovieCategories() {
    this.facade.loadPopularMovies();
    this.facade.movies$.subscribe(state => {
      if (!state.movies.length) return;

      this.popularMovieList = state.movies.map(m => ({ ...m }));
      const yearsSet = new Set(this.popularMovieList.map(m => new Date(m.release_date).getFullYear()));
      this.yearOptions = Array.from(yearsSet).filter(y => !Number.isNaN(y)).sort((a, b) => b - a);
      this.applyFilters();

      this.popularMovies = state.movies.map(m => ({
        id: m.id,
        title: m.title,
        imgSrc: m.poster_path,
        link: `/movie/${m.id}`,
        rating: (m.vote_average / 10) * 100,
        vote: m.vote_average
      }));

      this.topRatedMovies = this.popularMovies.slice(0, 10);
      this.upcomingMovies = this.popularMovies.slice(10, 20);
      this.nowPlayingMovies = this.popularMovies.slice(20, 30);
    });
  }

  applyFilters() {
    const name = this.nameFilter.value?.toLowerCase() || '';
    const genre = this.genreFilter.value || '';
    const year = this.yearFilter.value || '';

    this.filteredMovies = this.popularMovieList.filter(m => {
      const matchesName = !name || m.title.toLowerCase().includes(name);
      const movieGenres = m.genre_ids?.map(id => GenreMap[id] || '').filter(Boolean) || [];
      const matchesGenre = !genre || movieGenres.some(g => g === genre);
      const movieYear = m.release_date ? new Date(m.release_date).getFullYear() : null;
      const matchesYear = !year || (movieYear === +year);

      return matchesName && matchesGenre && matchesYear;
    });

    this.applySort();
  }

  applySort() {
    const sortBy = this.sortControl.value;
    if (!sortBy) return;
    this.filteredMovies.sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.title.localeCompare(b.title);
        case 'year': return (new Date(a.release_date).getFullYear() || 0) - (new Date(b.release_date).getFullYear() || 0);
        case 'rating': return (b.vote_average || 0) - (a.vote_average || 0);
        case 'duration': return (a.runtime || 0) - (b.runtime || 0);
        case 'popularity': return (b.popularity || 0) - (a.popularity || 0);
        default: return 0;
      }
    });
  }

  // ---- Marathon integration ----
  addToMarathon(movie: Movie) {
    console.log('[MovieList] addToMarathon called:', movie?.title);
    this.marathonService.addMovie(movie);
  }

  navigateToMarathon() {
    console.log('[MovieList] navigating to /movies/marathon');
    this.router.navigate(['/movies/marathon']);
  }
}
