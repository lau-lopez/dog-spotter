// src/app/services/dog.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DogService {
  private baseUrl = 'https://dog.ceo/api';

  constructor(private http: HttpClient) {}

  getAllBreeds(): Observable<string[]> {
    return this.http.get<{ message: any }>(`${this.baseUrl}/breeds/list/all`).pipe(
      map(res => Object.keys(res.message))
    );
  }

  getBreedImage(breed: string): Observable<string> {
    return this.http.get<{ message: string }>(`${this.baseUrl}/breed/${breed}/images/random`).pipe(
      map(res => res.message)
    );
  }

  getBreedImages(breed: string) {
    return this.http.get<{ message: string[] }>(`https://dog.ceo/api/breed/${breed}/images`)
      .pipe(map(res => res.message));
  }

  getSubBreeds(breed: string) {
    return this.http.get<{ message: string[] }>(`https://dog.ceo/api/breed/${breed}/list`)
      .pipe(map(res => res.message));
  }

  geSubBreedImage(breed: string, subbreed: string): Observable<string> {
    return this.http.get<{ message: string }>(`${this.baseUrl}/breed/${breed}/${subbreed}/images/random`).pipe(
      map(res => res.message)
    );
  }

  getSubBreedImages(breed: string, subbreed: string) {
    return this.http.get<{ message: string[] }>(`https://dog.ceo/api/breed/${breed}/${subbreed}/images`)
      .pipe(map(res => res.message));
  }
}
