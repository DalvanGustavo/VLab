import { Routes } from '@angular/router';
import { MovieListComponent } from './pages/movie-list/movie-list.component';
import { MarathonListComponent } from './pages/movie-marathon/marathon-list.component';

export const MOVIE_ROUTES: Routes = [
  {
    path: '',
    component: MovieListComponent
  },
  {
    path: 'marathon',
    component: MarathonListComponent
  }
];
