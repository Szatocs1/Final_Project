import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Adatvedelem } from './adatvedelem';

describe('Adatvedelem', () => {
  let component: Adatvedelem;
  let fixture: ComponentFixture<Adatvedelem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Adatvedelem]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Adatvedelem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
