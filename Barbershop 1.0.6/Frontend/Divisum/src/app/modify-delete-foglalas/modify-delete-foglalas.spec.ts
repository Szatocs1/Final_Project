import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyDeleteFoglalas } from './modify-delete-foglalas';

describe('ModifyDeleteFoglalas', () => {
  let component: ModifyDeleteFoglalas;
  let fixture: ComponentFixture<ModifyDeleteFoglalas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyDeleteFoglalas]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModifyDeleteFoglalas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
