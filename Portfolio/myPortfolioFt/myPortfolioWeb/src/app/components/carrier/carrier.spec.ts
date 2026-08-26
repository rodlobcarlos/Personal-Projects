import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarrierComponent } from './carrier';

describe('CarrierComponent', () => {
  let component: CarrierComponent;
  let fixture: ComponentFixture<CarrierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarrierComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarrierComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
