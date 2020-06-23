import { initialState, reducer, State } from './books.reducer';
import * as BooksActions from './books.actions';
import { createBook } from '@tmo/shared/testing';

describe('Books Reducer', () => {
  describe('valid Books actions', () => {
    it('SearchBooksSuccess should return set the list of known Books', () => {
      const books = [createBook('A'), createBook('B'), createBook('C')];
      const action = BooksActions.searchBooksSuccess({ books });

      const result: State = reducer(initialState, action);

      expect(result.loaded).toBe(true);
      expect(result.ids.length).toBe(3);
    });
    it('SearchBooksFailure should return set the empty list', () => {
      const action = BooksActions.searchBooksFailure({ error: new Error()});
      const result: State = reducer(initialState, action);

      expect(result.ids.length).toBe(0);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });
  describe('clearSearch actions', () => {
    it('clearSearch should return empty list', () => {
      const action = BooksActions.clearSearch();
      const result: State = reducer(initialState, action);
      expect(result.ids.length).toBe(0);
    });
  });
});
