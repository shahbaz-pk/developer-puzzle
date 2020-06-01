import { $, $$, browser, ExpectedConditions, by } from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('Then: Add a book to the reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.greaterThan(1, 'At least one book');

    const initialCount = await $$(".reading-list-item").count();
    const enabledReadButtons = await $$('[data-testing="book-item"] button:not(:disabled)').count();
   
    if(enabledReadButtons > 0){
      const firstBook = await $$('[data-testing="book-item"] button:not(:disabled)').first();
      await firstBook.click();
      const secondBook = await $$('[data-testing="book-item"] button:not(:disabled)').first();
      await secondBook.click();
      const listCount = await $$(".reading-list-item").count();
      console.log("Count in list : "+ listCount);
      expect(listCount).to.eql(initialCount+2);
    }
    else {
      return;
    }
  });

  it('Then: Undo the adding of book from snackbar', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = await $('form');
    const input = await $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).to.be.greaterThan(1, 'At least one book');

    const initialCount = await $$(".reading-list-item").count();
    const enabledReadButtons = await $$('[data-testing="book-item"] button:not(:disabled)').count();
    if(enabledReadButtons > 0){
      const enabledButton = await $$('[data-testing="book-item"] button:not(:disabled)').first();
      await enabledButton.click();
      const undoLink = await browser.driver.findElement(by.css('.mat-simple-snackbar-action .mat-button'));
      await undoLink.click();
      const finalCount = await $$(".reading-list-item").count();
      expect(initialCount).to.eql(finalCount);
    }
    else {
      return;
    }
  });

  it('Then: Remove the item from Reading List', async () => {

    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const initialCount = await $$(".reading-list-item").count();
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const elementToremoveFromList = await $$('.reading-list-item mat-button-toggle-group [title="Delete from List"]');
    if(elementToremoveFromList.length > 0){
      await elementToremoveFromList[0].click();
      const finalCount = await $$(".reading-list-item").count();
      expect(finalCount).to.eq(initialCount-1);
    }
    else{
      return;
    }

  });

  it('Then: Undo Removal of the item from Reading List from SnackBar', async () => {

    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const initialCount = await $$(".reading-list-item").count();
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const elementToremoveFromList = await $$('.reading-list-item mat-button-toggle-group [title="Delete from List"]');
    if(elementToremoveFromList.length > 0){
      await elementToremoveFromList[0].click();
      const undoLink = await browser.driver.findElement(by.css('.mat-simple-snackbar-action .mat-button'));
      await undoLink.click();
      const countAfterUndo = await $$(".reading-list-item").count();
      expect(countAfterUndo).to.eq(initialCount);
    }
    else{
      return;
    }
  });
});
