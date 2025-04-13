import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DogService } from '../../services/dog.service';
import { materialImports } from '../../shared/exports/material';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { forkJoin, map } from 'rxjs';

@Component({
  selector: 'app-breed-detail',
  standalone: true,
  imports: [
    HeaderComponent,
    CommonModule,
    ...materialImports
  ],
  templateUrl: './breed-detail.component.html',
  styleUrls: ['./breed-detail.component.scss']
})
export class BreedDetailComponent implements OnInit {
  breedName = '';
  subBreeds: any[] = [];
  subBreedsAux: any[] = [];
  subBreedImages: string = '';
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private dogService: DogService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {
      this.breedName = params.get('breedName') || '';
      if (this.breedName) {
        this.loadSubBreeds(this.breedName);
      }
    });

  }

  loadSubBreeds(breed: string): void {
    this.loading = true;

    // Primero obtenemos las subrazas
    this.dogService.getSubBreeds(breed).subscribe(
      (subBreeds) => {
        if (subBreeds.length === 0) {
          this.subBreeds = [];
          this.subBreedsAux = this.subBreeds;
          this.loading = false;
          return;
        }

        const imageRequests = subBreeds.map((sub) =>
          this.dogService.geSubBreedImage(breed, sub).pipe(
            map((image) => ({
              name: sub,
              image: image.length > 0 ? image : '',
            }))
          )
        );

        forkJoin(imageRequests).subscribe(
          (results) => {
            this.subBreeds = results;
            this.subBreedsAux = this.subBreeds;
            this.loading = false;
          },
          (error) => {
            console.error('Error en la carga de imágenes:', error);  // Imprime cualquier error que ocurra
            this.subBreeds = [];
            this.subBreedsAux = this.subBreeds;
            this.loading = false;
          }
        );
      },
      (error) => {
        this.subBreeds = [];
        this.subBreedsAux = this.subBreeds;
        this.loading = false;
      }
    );
  }


  loadSubBreedImage(sub: string): void {
    this.dogService.geSubBreedImage(this.breedName, sub).subscribe(
      (images) => {
        this.subBreedImages = images;
      },
      (error) => {
        console.error('Error al obtener la imagen de subraza:', error);
        this.subBreedImages = '';  // Aseguramos que no falle si hay un error
      }
    );
  }

  viewGallery(breedName: string, subName: string): void {
    this.router.navigate(
      ['/subbreed', breedName, subName],
      {
        queryParams: {
          title: `${subName} Gallery`,
          showBackButton: true,
        }
      }
    );
  }

  onBreedSearch(term: any): void {
    this.subBreedsAux = this.subBreeds.filter(b => b.name.toLowerCase().includes(term.toLowerCase()));
  }

}
