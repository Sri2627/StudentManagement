import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardAccountsComponent } from './board-accounts.component';

describe('BoardAccountsComponent', () => {
  let component: BoardAccountsComponent;
  let fixture: ComponentFixture<BoardAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoardAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
