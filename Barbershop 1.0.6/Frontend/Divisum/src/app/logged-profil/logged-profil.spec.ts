import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggedProfil } from './logged-profil';

describe('LoggedProfil', () => {
  let component: LoggedProfil;
  let fixture: ComponentFixture<LoggedProfil>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoggedProfil]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoggedProfil);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
