import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_define', () => {
  test('Defining a word shows a gritter notification', async ({page}) => {
    // The form lives inside the (closed) help dropdown; the legacy spec
    // poked it via jQuery without opening anything, so do the same here:
    // set the value via DOM and dispatch the click handler directly.
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('#ep_define_input')!;
      input.value = 'time';
      document.querySelector<HTMLButtonElement>('#ep_define_input_ok')!.click();
    });
    await expect(page.locator('.gritter-item').first()).toBeVisible({timeout: 30_000});
  });
});
