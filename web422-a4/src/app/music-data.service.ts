import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { SpotifyTokenService } from './spotify-token.service';

import { mergeMap } from 'rxjs/operators';

//a6
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MusicDataService {
  constructor(
    private spotifyToken: SpotifyTokenService,
    private http: HttpClient
  ) {}

  getNewReleases(): Observable<SpotifyApi.ListOfNewReleasesResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<SpotifyApi.ListOfNewReleasesResponse>(
          'https://api.spotify.com/v1/browse/new-releases',
          { headers: { Authorization: `Bearer ${token}` } }
        );
      })
    );
  }

  //getArtistById(id)
  getArtistById(id: any): Observable<SpotifyApi.SingleArtistResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<SpotifyApi.SingleArtistResponse>(
          `https://api.spotify.com/v1/artists/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  // getAlbumsByArtistId(id)
  getAlbumsByArtistId(id: any): Observable<SpotifyApi.ArtistsAlbumsResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<SpotifyApi.ArtistsAlbumsResponse>(
          `https://api.spotify.com/v1/artists/${id}/albums?include_groups=album,single&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  //getAlbumById(id)
  getAlbumById(id: any): Observable<SpotifyApi.SingleAlbumResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<SpotifyApi.SingleAlbumResponse>(
          `https://api.spotify.com/v1/albums/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  // searchArtists(searchString)
  searchArtists(
    searchString: any
  ): Observable<SpotifyApi.ArtistSearchResponse> {
    return this.spotifyToken.getBearerToken().pipe(
      mergeMap((token) => {
        return this.http.get<SpotifyApi.ArtistSearchResponse>(
          `https://api.spotify.com/v1/search?q=${searchString}&type=artist&limit=50`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
      })
    );
  }

  // a6
  // addToFavourites(id)
  // addToFavourites(id: any): boolean {
  //   if (id === null || id === undefined || this.favouritesList.length >= 50) {
  //     return false;
  //   }
  //   this.favouritesList.push(id);
  //   return true;
  // }
  addToFavourites(id: string): Observable<[String]> {
    // TODO: make a PUT request to environment.userAPIBase/favourites/:id to add id to favourites
    return this.http.put<[String]>(
      `${environment.userAPIBase}/favourites/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}}`,
        },
      }
    );
  }

  // removeFromFavourites(id)
  // removeFromFavourites(id: any): Observable<any> {
  //   this.favouritesList.splice(this.favouritesList.indexOf(id), 1);
  //   return this.getFavourites();
  // }
  removeFromFavourites(id: string): Observable<any> {
    return this.http
      .delete<[String]>(`${environment.userAPIBase}/favourites/${id}`)
      .pipe(
        mergeMap((favouritesArray) => {
          // TODO: Perform the same tasks as the original getFavourites() method, only using "favouritesArray" from above, instead of this.favouritesList
          // NOTE: for the empty array, you will need to use o=>o.next({tracks: []}) instead of o=>{o.next([])}
          if (favouritesArray.length > 0) {
            return this.spotifyToken.getBearerToken().pipe(
              mergeMap((token) => {
                return this.http.get<any>(
                  `https://api.spotify.com/v1/tracks?ids=${favouritesArray.join(
                    ','
                  )}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              })
            );
          } else {
            return new Observable((o) => o.next({ tracks: [] }));
          }
        })
      );
  }

  // getFavourites()
  // getFavourites(): Observable<any> {
  //   if (this.favouritesList.length > 0) {
  //     return this.spotifyToken.getBearerToken().pipe(
  //       mergeMap((token) => {
  //         return this.http.get<any>(
  //           `https://api.spotify.com/v1/tracks?ids=${this.favouritesList.join(
  //             ','
  //           )}`,
  //           {
  //             headers: { Authorization: `Bearer ${token}` },
  //           }
  //         );
  //       })
  //     );
  //   } else {
  //     return new Observable((o) => {
  //       o.next([]);
  //     });
  //   }
  // }

  getFavourites(): Observable<any> {
    return this.http
      .get<[String]>(`${environment.userAPIBase}/favourites/`)
      .pipe(
        mergeMap((favouritesArray) => {
          // TODO: Perform the same tasks as the original getFavourites() method, only using "favouritesArray" from above, instead of this.favouritesList
          // NOTE: for the empty array, you will need to use o=>o.next({tracks: []}) instead of o=>{o.next([])}
          if (favouritesArray.length > 0) {
            return this.spotifyToken.getBearerToken().pipe(
              mergeMap((token) => {
                return this.http.get<any>(
                  `https://api.spotify.com/v1/tracks?ids=${favouritesArray.join(
                    ','
                  )}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                );
              })
            );
          } else {
            return new Observable((o) => o.next({ tracks: [] }));
          }
        })
      );
  }
}
