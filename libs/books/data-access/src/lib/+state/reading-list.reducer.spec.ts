import { expect } from 'chai';
import * as ReadingListActions from './reading-list.actions';
import {
  initialState,
  readingListAdapter,
  reducer,
  State
} from './reading-list.reducer';
import { createBook, createReadingListItem } from '@tmo/shared/testing';

describe('Reading list Reducer', () => {
  describe('valid Books actions', () => {
    let state: State;

    beforeEach(() => {
      state = readingListAdapter.setAll(
        [createReadingListItem('A'), createReadingListItem('B')],
        initialState
      );
    });

    it('loadReadingList() with Initial values', () => {
      const action = ReadingListActions.loadReadingList();

      const result: State = reducer(initialState, action);

      expect(result.loaded).to.be.false;
      expect(result.ids.length).to.eq(0);
    });

    it('loadReadingListSuccess() method should load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListSuccess({ list });

      const result: State = reducer(initialState, action);

      expect(result.loaded).to.be.true;
      expect(result.ids.length).to.eq(3);
    });

    it('loadReadingListError() should fail to load books from reading list', () => {
      const list = [
        createReadingListItem('A'),
        createReadingListItem('B'),
        createReadingListItem('C')
      ];
      const action = ReadingListActions.loadReadingListError(new ErrorEvent(""));

      const result: State = reducer(initialState, action);

      expect(result.loaded).to.be.false;
      expect(result.ids.length).to.eq(0);
    });

    it('addToReadingList() should add book to the state', () => {
      const action = ReadingListActions.addToReadingList({
        book: createBook('C')
      });
      const result: State = reducer(state, action);
      expect(result.ids).to.eql(['A', 'B', 'C']);
    });

    it('failedAddToReadingList() should undo book removal from the state', () => {
      const action = ReadingListActions.failedAddToReadingList({
        book: createBook('C')
      });
      const result: State = reducer(state, action);
      expect(result.ids).to.eql(['A', 'B']);
    });

    it('removeFromReadingList() should undo book addition to the state', () => {
      const itemToRemove = createReadingListItem('B');
      const action = ReadingListActions.removeFromReadingList({ item: itemToRemove });
      const result: State = reducer(state, action);
      expect(result.ids).to.eql(['A']);
    });

    it('failedRemoveFromReadingList() should undo book removal from the state', () => {
      const action = ReadingListActions.failedRemoveFromReadingList({
        item: createReadingListItem('C')
      });
      const result: State = reducer(state, action);
      expect(result.ids).to.eql(['A', 'B', 'C']);
    });
  });

  describe('unknown action', () => {
    it('should return the previous state', () => {
      const action = {} as any;

      const result = reducer(initialState, action);

      expect(result).to.eql(initialState);
    });
  });
});
