import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceBackground } from './space-background';

describe('SpaceBackground', () => {
  let component: SpaceBackground;
  let fixture: ComponentFixture<SpaceBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpaceBackground],
    }).compileComponents();

    fixture = TestBed.createComponent(SpaceBackground);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
