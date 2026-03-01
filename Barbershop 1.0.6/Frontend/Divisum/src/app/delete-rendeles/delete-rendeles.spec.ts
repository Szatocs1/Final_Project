import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteRendeles } from './delete-rendeles';

describe('DeleteRendeles', () => {
  let component: DeleteRendeles;
  let fixture: ComponentFixture<DeleteRendeles>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteRendeles]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteRendeles);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
