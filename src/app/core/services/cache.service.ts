import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

// Cache duration set to 15 minutes in milliseconds
const CACHE_DURATION_MS = 15 * 60 * 1000;

interface CacheData<T> {
  data: T;
  timestamp: number;
}

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  // Retrieves data from cache if valid; otherwise returns null
  private getCache<T>(key: string): CacheData<T> | null {
    const cached = localStorage.getItem(key);
    if (!cached) return null;

    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp > CACHE_DURATION_MS) {
      this.clearCache(key);
      return null;
    }
    return { data, timestamp };
  }

  // Saves data to cache with a timestamp
  private setCache<T>(key: string, data: T): void {
    const cacheData: CacheData<T> = { data, timestamp: Date.now() };
    localStorage.setItem(key, JSON.stringify(cacheData));
  }

  // Removes data from cache
  private clearCache(key: string): void {
    localStorage.removeItem(key);
  }

  // Fetches data either from cache or via a fetch function
  fetchData<T>(key: string, fetchFn: () => Observable<T>): Observable<T> {
    const cached = this.getCache<T>(key);
    if (cached) return of(cached.data);

    return fetchFn().pipe(
      tap((data) => this.setCache(key, data)), // Save to cache on successful fetch
      catchError(() => of([] as T)) // Handle errors and return an empty array as a fallback
    );
  }
}
