import puppeteer from 'https://deno.land/x/puppeteer@16.2.0/mod.ts'
;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()

  await page.goto('https://developers.google.com/web/')

  // Type into search box.
  await page.type('.devsite-search-field', 'Headless Chrome')
  await page.screenshot({path: './foo.png'})
  await browser.close()
})()
