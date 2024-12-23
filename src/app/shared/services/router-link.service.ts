import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class routerLink {
  private activeLink = new BehaviorSubject<any>(null)
  data = this.activeLink.asObservable()

  update(data: any){
    this.activeLink.next(data)
  }

  constructor() { }
}
