import { Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit } from '@angular/core';
import { AuthenticationService, MessageService } from '../_services';
import { first } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-headers',
  templateUrl: './headers.component.html',
  styleUrls: ['./headers.component.css']
})

export class HeadersComponent implements OnInit, OnDestroy, AfterViewInit {

  error = '';
  connected: boolean;
  subscription: Subscription;

  @ViewChild('stickyMenu') menuElement: ElementRef;

  sticky = false;
  elementPosition: any;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      console.log(message);
      if (message.text === 'login') {
        this.connected = true;
      } else if (message.text === 'logout') {
        this.connected = false;
      }
    });
  }


  ngOnInit(): void {
    this.authenticationService.checkToken()
      .pipe(first())
      .subscribe(
        data => {
          this.connected = true;
        },
        error => {
          console.log('connected as a guest');
          this.connected = false;
        });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    this.elementPosition = this.menuElement.nativeElement.offsetTop;
  }

  logout() {
    this.authenticationService.logout()
      .pipe(first())
      .subscribe(
        data => {
          this.connected = false;
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
