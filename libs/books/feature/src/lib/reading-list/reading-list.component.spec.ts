import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { createReadingListItem, SharedTestingModule } from '@tmo/shared/testing';

import { ReadingListComponent } from './reading-list.component';
import { BooksFeatureModule } from '@tmo/books/feature';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {getReadingList, removeFromReadingList, addToReadingList} from "@tmo/books/data-access";
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReadingListItem } from '@tmo/shared/models';

export class MatSnackBarMock {
  public open() {
    return {
      onAction: () => of({})
    }
  }
  public dismiss() {}
}
describe('ReadingListComponent', () => {
  let component: ReadingListComponent;
  let fixture: ComponentFixture<ReadingListComponent>;
  let mockStore: MockStore;
  let item: ReadingListItem;
  const initialBooksState = {loaded: false};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, SharedTestingModule, NoopAnimationsModule],
      providers: [provideMockStore({ initialState: initialBooksState }),
        { provide: MatSnackBar, useClass: MatSnackBarMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadingListComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    item = createReadingListItem('123');
    mockStore.overrideSelector(getReadingList, [item]);
    spyOn(mockStore, 'dispatch').and.callThrough();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should remove from reading list', () => {
    component.removeFromReadingList(item);
    expect(mockStore.dispatch).toHaveBeenCalledWith(removeFromReadingList({item}));
  })

  it('should Undo remove item from reading list', () => {
    const book = {id: item.bookId, ...item};
    component.undoItemRemoval(item);
    expect(mockStore.dispatch).toHaveBeenCalledWith(addToReadingList({book}));
  })
});
