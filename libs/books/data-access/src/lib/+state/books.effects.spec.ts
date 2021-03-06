import { TestBed } from '@angular/core/testing';
import { expect } from 'chai';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { DataPersistence, NxModule } from '@nrwl/angular';
import { ReplaySubject } from 'rxjs';
import { createBook, SharedTestingModule } from '@tmo/shared/testing';

import { BooksEffects } from './books.effects';
import * as BooksActions from './books.actions';
import { HttpTestingController } from '@angular/common/http/testing';

describe('BooksEffects', () => {
  let actions: ReplaySubject<any>;
  let effects: BooksEffects;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [NxModule.forRoot(), SharedTestingModule],
      providers: [
        BooksEffects,
        DataPersistence,
        provideMockActions(() => actions),
        provideMockStore()
      ]
    });

    effects = TestBed.inject(BooksEffects);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Load books', () => {
    it('should return the books successfully when searched with title' , done => {
      actions = new ReplaySubject();
      actions.next(BooksActions.searchBooks({ term: '' }));

      effects.searchBooks$.subscribe(action => {
        expect(action).to.eql(
          BooksActions.searchBooksSuccess({ books: [createBook('A')] })
        );
        done();
      });

      httpMock.expectOne('/api/books/search?q=').flush([createBook('A')]);
    });
    it('should produce an error when search term is not valid', done => {
      actions = new ReplaySubject();
      actions.next(BooksActions.searchBooks({ term: '' }));
      const res = BooksActions.searchBooksFailure(new ErrorEvent(""))

      effects.searchBooks$.subscribe(action => {
        expect(action.type).to.eql(
          res.type
        );
        done();
      });

      httpMock.expectOne('/api/books/search?q=').error(new ErrorEvent(""));
    });
  });
});
