import { Component, OnInit } from '@angular/core';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-favourites',
  templateUrl: './favourites.component.html',
  styleUrls: ['./favourites.component.css'],
})
export class FavouritesComponent implements OnInit {
  favourites: Array<any> = [];

  constructor(private data: MusicDataService) {}

  ngOnInit(): void {
    this.data
      .getFavourites()
      .subscribe((data) => (this.favourites = data.tracks));
  }

  //removeFromFavourites(id)
  removeFromFavourites(id: any) {
    this.data
      .removeFromFavourites(id)
      .subscribe((data) => (this.favourites = data.tracks));
  }
}
