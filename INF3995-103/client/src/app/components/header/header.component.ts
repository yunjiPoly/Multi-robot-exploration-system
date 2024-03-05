import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface HeaderItem {
  title: string;
  path: string;
}

interface HeaderItemDisplay extends HeaderItem {
  active: boolean;
}

const HEADER_ITEMS: HeaderItem[] = [
  {
    title: 'Accueil',
    path: '/home'
  },
  {
    title: 'Historique',
    path: '/missions-history'
  }
];

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  protected items: HeaderItemDisplay[];

  constructor(private router: Router) {
    this.items = HEADER_ITEMS.map((item) => ({ ...item, active: false }));

    router.events.subscribe(() => {
      this.items.forEach(
        (item) =>
          (item.active = this.router.isActive(item.path, { paths: 'exact', matrixParams: 'ignored', queryParams: 'ignored', fragment: 'exact' }))
      );
    });
  }
}
