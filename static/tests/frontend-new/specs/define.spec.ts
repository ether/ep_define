import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_define', () => {
  test('Defining a word shows a gritter notification', async ({page}) => {
    await page.locator('#ep_define_input').fill('time');
    await page.locator('#ep_define_input_ok').click();
    await expect(page.locator('.gritter-item').first()).toBeVisible({timeout: 30_000});
  });
});
