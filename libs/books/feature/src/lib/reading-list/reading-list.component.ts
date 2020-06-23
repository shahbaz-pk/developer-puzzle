import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { getReadingList, removeFromReadingList, addToReadingList } from '@tmo/books/data-access';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ReadingListItem } from '@tmo/shared/models';

@Component({
  selector: 'tmo-reading-list',
  templateUrl: './reading-list.component.html',
  styleUrls: ['./reading-list.component.scss']
})
export class ReadingListComponent {
  readingList$ = this.store.select(getReadingList);

  constructor(private readonly store: Store,
              private readonly snackBar: MatSnackBar) {}

  removeFromReadingList(item) {
    const snackBarRef = this.snackBar.open('Book removed from reading list', 'Undo', {
      duration: 3000
    });
    snackBarRef.onAction().subscribe(() => {
      this.undoItemRemoval(item);
    });
    this.store.dispatch(removeFromReadingList({ item }));
  }

  undoItemRemoval(item: ReadingListItem) {
    const book = {id: item.bookId, ...item};
    this.store.dispatch(addToReadingList({book}));
  }
}
