import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { DogService } from '../../services/dog.service';
import { materialImports } from '../../shared/exports/material';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { PaginationService } from '../../services/pagination.service';
import { PageEvent } from '@angular/material/paginator';

interface Breed {
  name: string;
  image: string;
  subBreeds: string[];
}

interface BreedImage {
  name: string;
  image: string;
}

interface SubBreedInfo {
  breed: string;
  subBreeds: string[];
}

@Component({
  selector: 'app-all-breeds',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule,
    HeaderComponent,
    PaginatorComponent,
    ...materialImports],
  templateUrl: './all-breeds.component.html',
  styleUrls: ['./all-breeds.component.scss']
})
export class AllBreedsComponent implements OnInit {
  allBreeds: any[] = []; // Usamos la interfaz Breed
  loading = true;
  paginatedBreeds: Breed[] = []; // Usamos la interfaz Breed
  length: number = 0; // Total number of items
  pageSize: number = 10; // Items per page
  currentPage: number = 0; // Current page

  constructor(
    private dogService: DogService,
    private router: Router,
    private paginationService: PaginationService
  ) {}

  ngOnInit() {
    this.dogService.getAllBreeds().subscribe(breeds => {
      // Obtener imágenes de las razas
      const imageRequests = breeds.map(breed =>
        this.dogService.getBreedImage(breed).pipe(
          map((image: string) => ({ name: breed, image })) // Imagen por cada raza
        )
      );

      // Obtener subrazas de cada raza
      const subBreedRequests = breeds.map(breed =>
        this.dogService.getSubBreeds(breed).pipe(
          map(subBreeds => ({ breed, subBreeds })) // Subrazas por cada raza
        )
      );

      // Ejecutar ambas solicitudes de imágenes y subrazas
      forkJoin([...imageRequests, ...subBreedRequests]).subscribe(results => {
        // Primeros resultados: imágenes
        const breedImages: any[] = results.slice(0, breeds.length);

        // Restantes resultados: subrazas
        const subBreedsInfo: any[] = results.slice(breeds.length);

        // Combinamos imágenes y subrazas
        this.allBreeds = breedImages.map((breedImage, index) => {
          const subBreed = subBreedsInfo.find(sub => sub.breed === breedImage.name);
          return { ...breedImage, subBreeds: subBreed ? subBreed.subBreeds : [] };
        });

        // Ajustamos la longitud total de los elementos
        this.length = this.allBreeds.length;
        this.paginateBreeds(this.allBreeds); // Paginamos los resultados
        this.loading = false;
      });
    });
  }

  onPageChange(event: PageEvent) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.paginateBreeds(this.allBreeds);
  }

  paginateBreeds(breeds: any[]) {
    this.paginatedBreeds = this.paginationService.paginate(
      breeds,
      this.currentPage,
      this.pageSize
    );
  }

  viewGallery(breedName: string) {
    this.router.navigate(['/breed-gallery', breedName]);
  }

  viewSubBreeds(breedName: string) {
    const breed = this.allBreeds.find(b => b.name === breedName);
    if (breed && breed.subBreeds.length > 0) {
      this.router.navigate(['/breed', breedName]);
    } else {
      alert('No subbreeds available for this breed!');
    }
  }

  onBack() {
    window.history.back();
  }

  onBreedSearch(term: any): void {
    console.log('Buscando:', term);
    // Aquí puedes filtrar `allBreeds` o llamar a un servicio

    const filterbreeds = this.allBreeds.filter(b => b.name.toLowerCase().includes(term.toLowerCase()));
    this.paginateBreeds(term == '' ? this.allBreeds : filterbreeds);
  }

}
