import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Fundraiser } from './fundraiser';

describe('Fundraiser', () => {
  let component: Fundraiser;
  let fixture: ComponentFixture<Fundraiser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fundraiser],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Fundraiser);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
