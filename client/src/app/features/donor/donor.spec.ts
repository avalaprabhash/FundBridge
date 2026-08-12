import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Donor } from './donor';

describe('Donor', () => {
  let component: Donor;
  let fixture: ComponentFixture<Donor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Donor],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Donor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
