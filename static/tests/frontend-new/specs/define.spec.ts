import {expect, test} from '@playwright/test';
import {goToNewPad} from 'ep_etherpad-lite/tests/frontend-new/helper/padHelper';

test.beforeEach(async ({page}) => {
  await goToNewPad(page);
});

test.describe('ep_define', () => {
  test('define input is placed in the right toolbar area', async ({page}) => {
    await expect(page.locator('.menu_right #ep_define_toolbar')).toBeVisible();
  });

  test('Defining a word shows a gritter notification', async ({page}) => {
    const defineInput = page.locator('#ep_define_input');
    await defineInput.focus();
    await page.evaluate(() => {
      const input = document.querySelector<HTMLInputElement>('#ep_define_input');
      if (input == null) throw new Error('define input missing');
      input.value = 'time';
      document.querySelector<HTMLButtonElement>('#ep_define_input_ok')!.click();
    });
    await expect(page.locator('.gritter-item').first()).toBeVisible({timeout: 30_000});
  });
});
