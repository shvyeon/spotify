import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicDataService } from '../music-data.service';

@Component({
  selector: 'app-artist-discography',
  templateUrl: './artist-discography.component.html',
  styleUrls: ['./artist-discography.component.css'],
})
export class ArtistDiscographyComponent implements OnInit {
  id: any;
  artist: any;
  albums: any;

  constructor(private route: ActivatedRoute, private data: MusicDataService) {
    this.id = this.route.snapshot.params['id'];
  }

  ngOnInit(): void {
    this.data.getArtistById(this.id).subscribe((data) => (this.artist = data));

    this.data
      .getAlbumsByArtistId(this.id)
      .subscribe(
        (data) =>
          (this.albums = data.items.filter(
            (curValue, index, self) =>
              self.findIndex(
                (t) => t.name.toUpperCase() === curValue.name.toUpperCase()
              ) === index
          ))
      );
  }
}
