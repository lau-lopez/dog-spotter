import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DogService } from '../../services/dog.service';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component'
import { materialImports } from '../../shared/exports/material';
import { PaginationService } from '../../services/pagination.service';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ImageDialogComponent } from '../../shared/components/image-dialog/image-dialog.component';

@Component({
  selector: 'app-breed-gallery',
  standalone: true,
  imports: [CommonModule,
      HeaderComponent,
      PaginatorComponent,
      ...materialImports],
  templateUrl: './breed-gallery.component.html',
  styleUrl: './breed-gallery.component.scss'
})
export class BreedGalleryComponent implements OnInit {
  breedName: string = '';
  images: string[] = [];
  paginatedImages: string[] = [];
  length: number = 0;
  pageSize: number = 10;
  currentPage: number = 0;

  constructor(private route: ActivatedRoute, private dogService: DogService, private paginationService: PaginationService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.breedName = this.route.snapshot.paramMap.get('breedName') || '';
    this.dogService.getBreedImages(this.breedName).subscribe((imgs) => {
      this.images = imgs;
      this.length = this.images.length;
      this.paginateImages();
    });
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
