import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InteractionGraphComponent } from './interaction-graph.component';

describe('InteractionGraphComponent', () => {
  let component: InteractionGraphComponent;
  let fixture: ComponentFixture<InteractionGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InteractionGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InteractionGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
