import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  removeFromReadingList,
  getBooksError
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  errorStatus: Boolean = false;

  getAllBookSubscriber: Subscription;
  getBooksErrorSubscriber: Subscription;

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder,
    private readonly snackBar: MatSnackBar
  ) { }

  get searchTerm(): string {
    return this.searchForm.value.term;
  }

  ngOnInit(): void {
    this.getAllBookSubscriber = this.store.select(getAllBooks).subscribe(books => {
      this.books = books;
    });

    this.getBooksErrorSubscriber = this.store.select(getBooksError).subscribe(errorInfo => {
      if (errorInfo) {
        this.errorStatus = true;
        this.store.dispatch(clearSearch());
      }
    });
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
    const snackBarRef = this.snackBar.open('Book added to reading list', 'Undo', {
      duration: 3000
    });
    snackBarRef.onAction().subscribe(() => {
      this.undoBookAddition(book);
    });
  }

  undoBookAddition(book: Book) {
    const item = { item: { bookId: book.id, ...book } };
    this.store.dispatch(removeFromReadingList(item));
  }

  searchExample() {
    this.searchForm.controls.term.setValue('javascript');
    this.searchBooks();
  }

  searchBooks() {
    if (this.searchForm.value.term) {
      this.store.dispatch(searchBooks({ term: this.searchTerm }));
    } else {
      this.store.dispatch(clearSearch());
    }
  }

  ngOnDestroy() {
    if(this.getAllBookSubscriber){
      this.getAllBookSubscriber.unsubscribe();
    }
    if(this.getBooksErrorSubscriber){
      this.getBooksErrorSubscriber.unsubscribe();
    }
  }
}
