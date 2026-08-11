import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FundraiserLayout } from './fundraiser-layout';

describe('FundraiserLayout', () => {
  let component: FundraiserLayout;
  let fixture: ComponentFixture<FundraiserLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundraiserLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FundraiserLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
