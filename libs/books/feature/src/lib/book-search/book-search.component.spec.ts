import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { SharedTestingModule, createBook } from '@tmo/shared/testing';

import { BooksFeatureModule } from '../books-feature.module';
import { BookSearchComponent } from './book-search.component';
import {MockStore, provideMockStore} from "@ngrx/store/testing";
import {getAllBooks, getBooksError, removeFromReadingList, addToReadingList, clearSearch} from "@tmo/books/data-access";
import { of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

export class MatSnackBarMock {
  public open() {
    return {
      onAction: () => of({})
    }
  }
  public dismiss() {}
}

describe('ProductsListComponent', () => {
  let component: BookSearchComponent;
  let fixture: ComponentFixture<BookSearchComponent>;
  let mockStore: MockStore;
  const initialBooksState = {loaded: false};
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BooksFeatureModule, NoopAnimationsModule, SharedTestingModule],
      providers: [provideMockStore({ initialState: initialBooksState }),{ provide: MatSnackBar, useClass: MatSnackBarMock }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookSearchComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(MockStore);
    mockStore.overrideSelector(getAllBooks, []);
    mockStore.overrideSelector(getBooksError, null);
    spyOn(mockStore, 'dispatch').and.callThrough();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Search Books', () => {
    it('Should load books on search query', () => {
      component.searchForm.controls.term.setValue('javascript');
      mockStore.overrideSelector(getAllBooks, [{...createBook('A'), isAdded: false}]);
      mockStore.refreshState();
      expect(component.books.length).toBe(1);
    });

    it('Should load books error on search query', () => {
      component.searchForm.controls.term.setValue('javascript');
      mockStore.overrideSelector(getBooksError, "Internal Server error");
      mockStore.refreshState();
      expect(component.books.length).toBe(0);
      expect(component.errorStatus).toBe(true);
    });

    it('Should load default search query', () => {
      component.searchExample();
      expect(mockStore.dispatch).toHaveBeenCalled();
      expect(component.searchTerm).toBe("javascript");
    });

    it('should clear selector on Search query', () => {
      
      component.searchForm.controls.term.setValue("");
      component.searchBooks();
      expect(mockStore.dispatch).toHaveBeenCalledWith(clearSearch());
      
    });

    it('should Add to reading list', () => {
      const book = createBook('A');
      component.addBookToReadingList(book);
      expect(mockStore.dispatch).toHaveBeenCalledWith(addToReadingList({book}));
    });

    it('should Undo the addition', () => {
      component.searchForm.controls.term.setValue('javascript');
      const book = createBook('A');
      mockStore.overrideSelector(getAllBooks, [{...book, isAdded: true}]);
      mockStore.refreshState();
      expect(component.books.length).toBe(1);
      component.undoBookAddition(book);
      const item = { item: { bookId: book.id, ...book } };
      expect(mockStore.dispatch).toHaveBeenCalledWith(removeFromReadingList(item));
    });

    it('should return undefined', () => {
      const result = component.formatDate();
      expect(result).toBeUndefined();
     
    });

    it('should return date', () => {
      const result = component.formatDate('11-06-2020');
     expect(result).toEqual('11/6/2020');
    });
  });
});
