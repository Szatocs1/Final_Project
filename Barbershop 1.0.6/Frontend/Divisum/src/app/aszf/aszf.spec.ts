import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Aszf } from './aszf';

describe('Aszf', () => {
  let component: Aszf;
  let fixture: ComponentFixture<Aszf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Aszf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Aszf);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
