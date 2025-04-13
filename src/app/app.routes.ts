import { Routes } from '@angular/router';
import { AllBreedsComponent } from './components/all-breeds/all-breeds.component';
import { BreedDetailComponent } from './components/breed-detail/breed-detail.component';
import { BreedGalleryComponent } from './components/breed-gallery/breed-gallery.component';
import { SubBreedGalleryComponent } from './components/sub-breed-gallery/sub-breed-gallery.component';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'breeds', component: AllBreedsComponent },
  { path: 'breed/:breedName', component: BreedDetailComponent },
  { path: 'breed-gallery/:breedName', component: BreedGalleryComponent },
  { path: 'breed/:breedName', component: BreedDetailComponent },
  {path: 'subbreed/:breed/:subbreed', component: SubBreedGalleryComponent},
  { path: '**', redirectTo: '' }
];
