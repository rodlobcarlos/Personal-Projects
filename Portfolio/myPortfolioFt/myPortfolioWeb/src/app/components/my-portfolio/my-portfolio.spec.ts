import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyPortfolioComponent } from './my-portfolio';

describe('MyPortfolioComponent', () => {
  let component: MyPortfolioComponent;
  let fixture: ComponentFixture<MyPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyPortfolioComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MyPortfolioComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
