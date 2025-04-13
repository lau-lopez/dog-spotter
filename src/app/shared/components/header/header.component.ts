import { CommonModule } from '@angular/common';
import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { materialImports } from '../../exports/material';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';
export interface BreedOption {
  name: string;
  images?: string[]; // opcional
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
     CommonModule,
     ...materialImports,
     RouterLink
  ]
})
export class HeaderComponent implements OnInit {
  @Input() searchType: 'breed' | 'subbreed' = 'breed';
  @Input() breedOptions: BreedOption[] = [];
  @Input() subBreedOptions: BreedOption[] = [];
  @Output() search = new EventEmitter<string>();
  @Input() showFilter: boolean = false;
  @Input() showBack: boolean = true;


  searchControl = new FormControl('');
  filteredOptions$: Observable<BreedOption[]> = new Observable();

  constructor(private location: Location) {}


  ngOnInit(): void {
    this.searchControl.valueChanges
    .pipe(
      filter((value: any): value is string => value !== null)
    )
    .subscribe((value: string) => {
      this.search.emit(value);
    });
  }


  goBack() {
    this.location.back();
  }
}
