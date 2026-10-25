// import { test, expect } from '@playwright/test';


// test('My Test', async ({ page }) => {
//   await page.goto('https://playwright.dev/');
//   //Wait
//   page.waitForLoadState('domcontentloaded');
//   //Static dropdown
//   const dropBox = page.locator('#id');
//   await dropBox.selectOption('1');
//   await expect(dropBox).toHaveValue('1');
//   //Dynamic Dropdown
//   const searchBox =  page.locator('#id');
//   searchBox.fill('red');
//   await page.waitForSelector('input');
//   //Static wait
//   page.waitForTimeout(10000);
//   await page.locator('.class').filter({hasText:'RedTape'}).click();
//   //Screenshot
//   await page.screenshot({path:'src/screenshot',fullPage:true});
//   //File Upload
//   await page.getByRole('button',{name:'Upload'}).setInputFiles('src/files/pdf.pdf');
//   //Download & Wait For Event
//   const downLoad = await page.waitForEvent('download');
//   await page.locator('#id').click();
//   const newDownload = await downLoad;
//   await newDownload.saveAs('/path/src/downloads'+newDownload.suggestedFilename());







// });

// test('get started link', async ({ page }) => {
//   await page.goto('https://playwright.dev/');

//   // Click the get started link.
//   await page.getByRole('link', { name: 'Get started' }).click();

//   // Expects page to have a heading with the name of Installation.
//   await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
// });
