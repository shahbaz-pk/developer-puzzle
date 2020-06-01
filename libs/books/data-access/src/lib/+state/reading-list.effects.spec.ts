import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { ReplaySubject } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { SharedTestingModule, createReadingListItem, createBook } from '@tmo/shared/testing';

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
    it('should work', done => {
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
    it('should through error', done => {
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
    it('should work', done => {
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
    it('should through error', done => {
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
    it('should work', done => {
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
    it('should through error', done => {
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
});
