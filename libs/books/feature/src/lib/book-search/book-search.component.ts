import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  addToReadingList,
  clearSearch,
  getAllBooks,
  ReadingListBook,
  searchBooks,
  getBooksError
} from '@tmo/books/data-access';
import { FormBuilder } from '@angular/forms';
import { Book } from '@tmo/shared/models';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subscription } from 'rxjs';

@Component({
  selector: 'tmo-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.scss']
})
export class BookSearchComponent implements OnInit, OnDestroy {
  books: ReadingListBook[];
  errorStatus: Boolean = false;
  dynamicSubscriber: Subscription;
  getAllBookSubscriber: Subscription;
  getBooksErrorSubscriber: Subscription;

  searchForm = this.fb.group({
    term: ''
  });

  constructor(
    private readonly store: Store,
    private readonly fb: FormBuilder
  ) {}

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

  this.dynamicSubscriber = this.searchForm.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(val => { this.searchBooks(); })
  }

  formatDate(date: void | string) {
    return date
      ? new Intl.DateTimeFormat('en-US').format(new Date(date))
      : undefined;
  }

  addBookToReadingList(book: Book) {
    this.store.dispatch(addToReadingList({ book }));
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
    if(this.dynamicSubscriber){
      this.dynamicSubscriber.unsubscribe();
    }
    if(this.getAllBookSubscriber){
      this.getAllBookSubscriber.unsubscribe();
    }
    if(this.getBooksErrorSubscriber){
      this.getBooksErrorSubscriber.unsubscribe();
    }
  }
}
