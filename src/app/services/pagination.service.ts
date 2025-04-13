import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaginationService {
  paginate<T>(items: T[], pageIndex: number, pageSize: number): T[] {
    const start = pageIndex * pageSize;
    const end = start + pageSize;
    return items.slice(start, end);
  }
}
