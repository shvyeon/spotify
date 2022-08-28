import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-album',
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
})
export class AlbumComponent implements OnInit {
  id: any;
  album: any;
  private albumeSub: Subscription | undefined;

  constructor(
    private route: ActivatedRoute,
    private data: MusicDataService,
    private snackBar: MatSnackBar
  ) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.data.getAlbumById(this.id).subscribe((data) => (this.album = data));
  }

  //addToFavourites(TrackID)
  // addToFavourites(trackID: any) {
  //   if (this.data.addToFavourites(trackID)) {
  //     this.snackBar.open('Adding to Favourites...', 'Done', { duration: 1500 });
  //   }
  // }
  addToFavourites(trackID: any) {
    this.data.addToFavourites(trackID).subscribe(
      (success) => {
        this.snackBar.open('Adding to Favourites...', 'Done', {
          duration: 1500,
        });
      },
      (err) => {
        this.snackBar.open('Unable to add song to Favourites', '', {
          duration: 1500,
        });
      }
    );
  }
}
