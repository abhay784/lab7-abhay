describe('Basic user flow for Website', () => {
  // First, visit the lab 7 website
  beforeAll(async () => {
    await page.goto('https://cse110-sp25.github.io/CSE110-Shop/');
  });

  // Each it() call is a separate test
  // Here, we check to make sure that all 20 <product-item> elements have loaded
  it('Initial Home Page - Check for 20 product items', async () => {
    console.log('Checking for 20 product items...');

    // Query select all of the <product-item> elements and return the length of that array
    const numProducts = await page.$$eval('product-item', (prodItems) => {
      return prodItems.length;
    });

    // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
    expect(numProducts).toBe(20);
  });

  // Check to make sure that all 20 <product-item> elements have data in them
  // We use .skip() here because this test has a TODO that has not been completed yet.
  // Make sure to remove the .skip after you finish the TODO.
  it('Make sure <product-item> elements are populated', async () => {
    console.log('Checking to make sure <product-item> elements are populated...');

    // Start as true, if any don't have data, swap to false
    let allArePopulated = true;

    // Query select all of the <product-item> elements
    const prodItemsData = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        // Grab all of the json data stored inside
        return data = item.data;
      });
    });

    // STEP 1: Check every product item, not just the first one
    for (let i = 0; i < prodItemsData.length; i++) {
      console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
      const currentValue = prodItemsData[i];
      if (currentValue.title.length == 0) { allArePopulated = false; }
      if (currentValue.price.length == 0) { allArePopulated = false; }
      if (currentValue.image.length == 0) { allArePopulated = false; }
    }

    // Expect allArePopulated to still be true
    expect(allArePopulated).toBe(true);

  }, 10000);

  // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // the button swaps to "Remove from Cart"
  it('Clicking the "Add to Cart" button should change button text', async () => {
    console.log('Checking the "Add to Cart" button...');

    // STEP 2: Query the first product-item, get its shadowRoot button, click it
    const firstProduct = await page.$('product-item');
    const shadowRoot = await firstProduct.getProperty('shadowRoot');
    const button = await shadowRoot.$('button');
    await button.click();

    // Get the button's innerText after clicking
    const buttonText = await button.getProperty('innerText');
    const textValue = await buttonText.jsonValue();

    expect(textValue).toBe('Remove from Cart');

  }, 2500);

  // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // number in the top right has been correctly updated
  it('Checking number of items in cart on screen', async () => {
    console.log('Checking number of items in cart on screen...');

    // STEP 3: Click all "Add to Cart" buttons and check cart count is 20
    await page.$$eval('product-item', prodItems => {
      prodItems.forEach(item => {
        const button = item.shadowRoot.querySelector('button');
        if (button.innerText === 'Add to Cart') {
          button.click();
        }
      });
    });

    // Check that cart count is 20
    const cartCount = await page.$('#cart-count');
    const countText = await cartCount.getProperty('innerText');
    const countValue = await countText.jsonValue();

    expect(countValue).toBe('20');

  }, 10000);

  // Check to make sure that after you reload the page it remembers all of the items in your cart
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // STEP 4: Reload page and verify buttons say "Remove from Cart" and cart is still 20
    await page.reload();

    // Check that all buttons say "Remove from Cart"
    const buttonTexts = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        const button = item.shadowRoot.querySelector('button');
        return button.innerText;
      });
    });

    const allRemoveButtons = buttonTexts.every(text => text === 'Remove from Cart');
    expect(allRemoveButtons).toBe(true);

    // Check that cart count is still 20
    const cartCount = await page.$('#cart-count');
    const countText = await cartCount.getProperty('innerText');
    const countValue = await countText.jsonValue();
    expect(countValue).toBe('20');

  }, 10000);

  // Check to make sure that the cart in localStorage is what you expect
  it('Checking the localStorage to make sure cart is correct', async () => {

    // STEP 5: Check localStorage cart is '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]'
    const cartValue = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cartValue).toBe('[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]');

  });

  // Checking to make sure that if you remove all of the items from the cart that the cart
  // number in the top right of the screen is 0
  it('Checking number of items in cart on screen after removing from cart', async () => {
    console.log('Checking number of items in cart on screen...');

    // STEP 6: Click all buttons that say "Remove from Cart" to remove all items
    await page.$$eval('product-item', prodItems => {
      prodItems.forEach(item => {
        const button = item.shadowRoot.querySelector('button');
        if (button.innerText === 'Remove from Cart') {
          button.click();
        }
      });
    });

    // Check that cart count is 0
    const cartCount = await page.$('#cart-count');
    const countText = await cartCount.getProperty('innerText');
    const countValue = await countText.jsonValue();

    expect(countValue).toBe('0');

  }, 10000);

  // Checking to make sure that it remembers us removing everything from the cart
  // after we refresh the page
  it('Checking number of items in cart on screen after reload', async () => {
    console.log('Checking number of items in cart on screen after reload...');

    // STEP 7: Reload page and verify buttons say "Add to Cart" and cart is still 0
    await page.reload();

    // Check that all buttons say "Add to Cart"
    const buttonTexts = await page.$$eval('product-item', prodItems => {
      return prodItems.map(item => {
        const button = item.shadowRoot.querySelector('button');
        return button.innerText;
      });
    });

    const allAddButtons = buttonTexts.every(text => text === 'Add to Cart');
    expect(allAddButtons).toBe(true);

    // Check that cart count is still 0
    const cartCount = await page.$('#cart-count');
    const countText = await cartCount.getProperty('innerText');
    const countValue = await countText.jsonValue();
    expect(countValue).toBe('0');

  }, 10000);

  // Checking to make sure that localStorage for the cart is as we'd expect for the
  // cart being empty
  it('Checking the localStorage to make sure cart is correct', async () => {
    console.log('Checking the localStorage...');

    // STEP 8: Check localStorage cart is '[]'
    const cartValue = await page.evaluate(() => {
      return localStorage.getItem('cart');
    });

    expect(cartValue).toBe('[]');

  });
});
