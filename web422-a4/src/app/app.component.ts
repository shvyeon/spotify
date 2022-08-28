/*********************************************************************************
 *  WEB422 – Assignment 06
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part of this
 *  assignment has been copied manually or electronically from any other source (including web sites) or
 *  distributed to other students.
 *
 *  Name: Seonhye Hyeon Student ID: 125635193 Date: April 10, 2022
 *
 *  Angular App (Deployed) Link: https://web422a6-seonhye.netlify.app
 *
 *  User API (Heroku) Link: https://afternoon-sands-14573.herokuapp.com/
 *
 ********************************************************************************/

import { Component } from '@angular/core';
import { Event, NavigationStart, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'web422-a6';
  searchString: string = '';
  token: any;

  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        // only read the token on "NavigationStart"
        this.token = this.auth.readToken();
      }
    });
  }

  //handleSearch()
  handleSearch() {
    this.router.navigate(['/search'], {
      queryParams: { q: this.searchString },
    });
    this.searchString = '';
  }

  // logout()
  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
