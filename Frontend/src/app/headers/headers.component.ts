import { Component, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { AuthenticationService } from '../_services';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})

export class HeadersComponent implements OnInit, AfterViewInit {

  error = '';

  @ViewChild('stickyMenu') menuElement: ElementRef;

  sticky = false;
  elementPosition: any;

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  logout() {
    this.authenticationService.logout()
      .pipe(first())
      .subscribe(
        data => {
          this.router.navigate(['/login']);
        },
        error => {
          console.log(error);
        });
  }

  @HostListener('window:scroll', ['$event'])

  handleScroll() {
    const windowScroll = window.pageYOffset;
    if (windowScroll >= this.elementPosition) {
      this.sticky = true;
    } else {
      this.sticky = false;
    }
  }

  test() {
    this.authenticationService.addQueryHistory().subscribe(
      data => {
        console.log(data.message);
      },
      error => {
        console.log(error);
      });
  }

}
