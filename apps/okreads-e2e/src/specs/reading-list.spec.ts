import { $, $$, browser, ExpectedConditions, by } from 'protractor';
import { expect } from 'chai';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list tab when clicked on ReadingList button', async () => {
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

  it('Then: mark Reading status of book to completed', async () => {

    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );
    const readingListToggle = await $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    const markedElementsBefore = await $$('.reading-list-item mat-button-toggle-group [title="Mark as finished"]');
    if(markedElementsBefore.length > 0){
      await markedElementsBefore[0].click();
      const markedElementsAfterTest = await $$('.reading-list-item mat-button-toggle-group [title="Mark as finished"]');
      expect(markedElementsBefore.length).to.eq(markedElementsAfterTest.length + 1);
    }
    else{
      return;
    }
  });
});
