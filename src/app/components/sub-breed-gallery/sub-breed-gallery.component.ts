import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DogService } from '../../services/dog.service';
import { materialImports } from '../../shared/exports/material';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';
import { PageEvent } from '@angular/material/paginator';
import { PaginationService } from '../../services/pagination.service';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/image-dialog/image-dialog.component'; // ajusta la ruta según tu estructura


@Component({
  selector: 'app-sub-breed-gallery',
  standalone: true,
   imports: [
      HeaderComponent,
      PaginatorComponent,
      CommonModule,
      ...materialImports
    ],
  templateUrl: './sub-breed-gallery.component.html',
  styleUrl: './sub-breed-gallery.component.scss',
})
export class SubBreedGalleryComponent implements OnInit {
  breed: string = '';
  subbreed: string = '';
  title: string = 'Gallery';
  showBackButton: boolean = false;
  images: string[] = [];
  loading: boolean = true;
  paginatedImages: string[] = [];
  length: number = 0; // Total number of items
  pageSize: number = 10; // Items per page
  currentPage: number = 0; // Current page

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dogService: DogService,
    private paginationService: PaginationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.breed = this.route.snapshot.paramMap.get('breed') || '';
    this.subbreed = this.route.snapshot.paramMap.get('subbreed') || '';
    this.title =
      this.route.snapshot.queryParamMap.get('title') || `Galería de ${this.subbreed}`;
    this.showBackButton =
      this.route.snapshot.queryParamMap.get('showBackButton') === 'true';

    this.loadImages();
  }

  loadImages(): void {
    this.dogService.getSubBreedImages(this.breed, this.subbreed).subscribe({
      next: (images) => {
        this.images = images;
        this.length = this.images.length;
        this.paginateImages();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al obtener imágenes:', err);
        this.loading = false;
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/']); // Ajusta esta ruta según tu flujo
  }

  onPageChange(event: PageEvent) {
        this.currentPage = event.pageIndex;
        this.pageSize = event.pageSize;
        this.paginateImages();
      }

      paginateImages() {
        this.paginatedImages = this.paginationService.paginate(
          this.images,
          this.currentPage,
          this.pageSize
        );
      }

      openImageDialog(imageUrl: string): void {
        this.dialog.open(ImageDialogComponent, {
          data: { imageUrl },
          panelClass: 'full-screen-dialog',
          hasBackdrop: true
        });
      }

}
