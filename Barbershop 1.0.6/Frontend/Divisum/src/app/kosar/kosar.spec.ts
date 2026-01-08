import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kosar } from './kosar';

describe('Kosar', () => {
  let component: Kosar;
  let fixture: ComponentFixture<Kosar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Kosar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kosar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
