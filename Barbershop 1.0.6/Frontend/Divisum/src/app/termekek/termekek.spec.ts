import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Termekek } from './termekek';

describe('Termekek', () => {
  let component: Termekek;
  let fixture: ComponentFixture<Termekek>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Termekek]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Termekek);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
