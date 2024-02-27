const { test, expect } = require('@playwright/test');
const jsonData = require('../data/data.json');

/**
 * Test case for verifying table data with JSON data.
 * @param {Object} params - Test parameters including the Playwright page context.
 */
test.only('@CAW Tables', async ({ page }) => {
    // Go to the web page
    await page.goto("https://testpages.herokuapp.com/styled/tag/dynamic-table.html");

    // Click on the summary to expand
    await page.locator("summary").click();

    // Fill the JSON data into the textarea
    await page.locator('textarea[id="jsondata"]').fill(JSON.stringify(jsonData));

    // Click on the refresh button to populate the table with JSON data
    await page.locator("#refreshtable").click();

    // Wait for the table to load
    await page.waitForSelector('table'); // Adjust the selector if needed
    
    // Retrieve table data
    const tableData = await page.$$eval('#dynamictable', rows => {
        return rows.map(row => {
            const columns = row.querySelectorAll('td');
            return Array.from(columns).map(column => column.textContent.trim());
        });
    });
    
    // Flatten the table data
    const flattenedTableData = tableData.flat();
    
    // Flatten the JSON data for comparison
    const flattenedJsonData = jsonData.flatMap(obj => Object.values(obj).map(value => value.toString()));
        
    // Assert the table data matches the JSON data
    await expect(flattenedTableData).toEqual(flattenedJsonData);

});
