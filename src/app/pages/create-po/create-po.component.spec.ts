import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePoComponent } from './create-po.component';

describe('CreatePoComponent', () => {
  let component: CreatePoComponent;
  let fixture: ComponentFixture<CreatePoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CreatePoComponent]
    });
    fixture = TestBed.createComponent(CreatePoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
