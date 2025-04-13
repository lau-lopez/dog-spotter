import { Component, OnInit } from '@angular/core';

import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DogService } from '../../services/dog.service';
import { materialImports } from '../../shared/exports/material';

@Component({
  selector: 'app-popular-breeds',
  standalone: true,
  templateUrl: './popular-breeds.component.html',
  styleUrl: './popular-breeds.component.scss',
  imports: [
    CommonModule,
    RouterModule,
    ...materialImports]
})
export class PopularBreedsComponent implements OnInit {
  previewBreeds: { name: string; image: string }[] = [];

  constructor(private dogService: DogService) {}

  ngOnInit() {
    this.dogService.getAllBreeds().subscribe(breeds => {
      const randomBreeds = this.getRandomItems(breeds, 10);
      randomBreeds.forEach(breed => {
        this.dogService.getBreedImage(breed).subscribe(image => {
          this.previewBreeds.push({ name: breed, image });
        });
      });
    });
  }

  getRandomItems(arr: string[], count: number): string[] {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
