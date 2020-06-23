import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { SharedTestingModule, createBook, createReadingListItem } from '@tmo/shared/testing';

import { ReadingListEffects } from './reading-list.effects';
import * as ReadingListActions from './reading-list.actions';
import { HttpTestingController } from '@angular/common/http/testing';
import { ReadingListItem, Book } from '@tmo/shared/models';

describe('ToReadEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: ReadingListEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot(), SharedTestingModule],
      providers: [
        ReadingListEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(ReadingListEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('loadReadingList$', () => {
    it('should load items in the reading list', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.loadReadingList());

      effects.loadReadingList$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.loadReadingListSuccess({ list: [] })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush([]);
    });
    it('should produce an error while loading reading list items', done => {
      actions = new ReplaySubject();
      actions.next(ReadingListActions.loadReadingList());

      const res = ReadingListActions.loadReadingListError(new ErrorEvent(""));
      effects.loadReadingList$.subscribe(action => {
        expect(action.type).to.eql(
          res.type
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').error(new ErrorEvent(""));
    });
  });

  describe('addBook$', () => {
    it('should add the book to the reading list', done => {
      actions = new ReplaySubject();
      const book: Book = createBook("Abc");
      actions.next(ReadingListActions.addToReadingList({book}));

      effects.addBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.confirmedAddToReadingList({ book })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').flush(book);
    });
    it('should provide error while adding book to reading list', done => {
      actions = new ReplaySubject();
      const book: Book = createBook("Abc");
      actions.next(ReadingListActions.addToReadingList({book}));

      effects.addBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.failedAddToReadingList({ book })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list').error(new ErrorEvent(""));
    });
  });

  describe('removeBook$', () => {
    it('should remove the book from reading list', done => {
      actions = new ReplaySubject();
      const item: ReadingListItem = createReadingListItem("123");
      actions.next(ReadingListActions.removeFromReadingList({item}));

      effects.removeBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.confirmedRemoveFromReadingList({ item })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/123').flush(item);
    });
    it('should provide error while removing book from reading list', done => {
      actions = new ReplaySubject();
      const item: ReadingListItem = createReadingListItem("123");
      actions.next(ReadingListActions.removeFromReadingList({item}));

      effects.removeBook$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.failedRemoveFromReadingList({ item })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/123').error(new ErrorEvent(""));
    });
  });

  describe('markBookReadingStatus$', () => {
    it('should mark the book status to reading completed in reading list', done => {
      actions = new ReplaySubject();
      const item: ReadingListItem = createReadingListItem("123");
      actions.next(ReadingListActions.markAsReadingComplete({item}));

      effects.markBookReadingStatus$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.confirmedMarkAsReadingComplete({item})
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/123/finished').flush([item]);
    });
    it('should provide error while marking the reading status of a book in reading list', done => {
      actions = new ReplaySubject();
      const item: ReadingListItem = createReadingListItem("123");
      actions.next(ReadingListActions.markAsReadingComplete({item}));

      effects.markBookReadingStatus$.subscribe(action => {
        expect(action).to.eql(
          ReadingListActions.failedMarkAsReadingComplete({ item })
        );
        done();
      });

      httpMock.expectOne('/api/reading-list/123/finished').error(new ErrorEvent(""));
    });
  });
  
});
