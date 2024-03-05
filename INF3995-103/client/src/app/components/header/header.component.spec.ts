import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderComponent } from './header.component';
import { Router } from '@angular/router';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [RouterTestingModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router.events, 'subscribe').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize header items with the correct data', () => {
    expect(component['items'].length).toBe(2);
    expect(component['items'][0].title).toBe('Accueil');
    expect(component['items'][0].path).toBe('/home');
    expect(component['items'][0].active).toBeFalsy();
    expect(component['items'][1].title).toBe('Historique');
    expect(component['items'][1].path).toBe('/missions-history');
    expect(component['items'][1].active).toBeFalsy();
  });
});
