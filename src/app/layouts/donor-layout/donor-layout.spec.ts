import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { DonorLayout } from './donor-layout';

describe('DonorLayout', () => {
  let component: DonorLayout;
  let fixture: ComponentFixture<DonorLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DonorLayout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(DonorLayout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
