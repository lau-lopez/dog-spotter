import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { materialImports } from '../../shared//exports/material';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { PopularBreedsComponent } from '../../components/popular-breeds/popular-breeds.component'


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    PopularBreedsComponent,
    ...materialImports
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent {}
