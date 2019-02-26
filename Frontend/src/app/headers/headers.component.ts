import { Component, OnDestroy, OnInit, ViewChild, ElementRef, HostListener, AfterViewInit, Input } from '@angular/core';
import { AuthenticationService, MessageService, LanguageService } from '../_services';
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
  lang: string;
  @ViewChild('stickyMenu') menuElement: ElementRef;
  @Input() test;

  sticky = false;
  elementPosition: any;

  constructor(
    private authenticationService: AuthenticationService,
    private messageService: MessageService,
    private router: Router,
    private languageService: LanguageService,
  ) {
    this.subscription = this.messageService.getMessage().subscribe(message => {
      if (message.text === 'login') {
        this.connected = true;
      } else if (message.text === 'logout') {
        this.connected = false;
      }
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('currentUser')) {
      this.connected = true;
    } else {
      this.connected = false;
    }

    this.lang = localStorage.getItem('language') ? localStorage.getItem('language') : 'fr';
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
          this.router.navigate(['/guest']);
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

  changeLanguage(language: string) {
    if (language === 'en') {
      this.lang = 'en';
      this.languageService.setLanguage('en');
    } else {
      this.lang = 'fr';
      this.languageService.setLanguage('fr');
    }
  }
}
