// src/app/services/marathon.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Movie } from '../../types/movie.type';

@Injectable({ providedIn: 'root' })
export class MarathonService {
  private _list$ = new BehaviorSubject<Movie[]>([]);
  public list$ = this._list$.asObservable(); // <-- ESTA LINHA CRIA O list$

  get list(): Movie[] {
    return this._list$.value;
  }

  addMovie(movie: Movie) {
    if (!this.list.find(m => m.id === movie.id)) {
      this._list$.next([...this.list, movie]);
      console.log('[MarathonService] movie added:', movie.title);
    } else {
      console.log('[MarathonService] movie already in list:', movie.title);
    }
  }

  removeMovie(movieId: number) {
    this._list$.next(this.list.filter(m => m.id !== movieId));
    console.log('[MarathonService] movie removed id:', movieId);
  }

  clear() {
    this._list$.next([]);
  }
}
