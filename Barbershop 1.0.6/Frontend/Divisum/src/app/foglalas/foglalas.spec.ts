import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Foglalas } from './foglalas';

describe('Foglalas', () => {
  let component: Foglalas;
  let fixture: ComponentFixture<Foglalas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Foglalas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Foglalas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
