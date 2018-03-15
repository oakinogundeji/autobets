'use strict';
if(process.env.NODE_ENV != 'production') {
  require('dotenv').config();
}

// dependencies
const P = require('puppeteer');

// module variables
const
  EMAIL = process.env.EMAIL,
  PWD = process.env.BETFAIR_PWD,
  EVENT_URL = process.env.BETFAIR_URL,
  EMAIL_SELECTOR = '#ssc-liu',
  PWD_SELECTOR = '#ssc-lipw',
  LOGIN_BTN_SELECTOR = '#ssc-lis',
  SELECTIONS_CONTAINER_SELECTOR = 'div.main-mv-runners-list-wrapper',
  MATCHED_AMOUNT_SELECTOR = '#main-wrapper > div > div.scrollable-panes-height-taker > div > div.page-content.nested-scrollable-pane-parent > div > div.bf-col-xxl-17-24.bf-col-xl-16-24.bf-col-lg-16-24.bf-col-md-15-24.bf-col-sm-14-24.bf-col-14-24.center-column.bfMarketSettingsSpace.bf-module-loading.nested-scrollable-pane-parent > div.scrollable-panes-height-taker.height-taker-helper > div > div.bf-row.main-mv-container > div > bf-main-market > bf-main-marketview > div > div.mv-sticky-header > bf-marketview-header-wrapper > div > div > mv-header > div > div > div.mv-secondary-section > div > div > span.total-matched',
  RUNNERS_SELECTOR = 'tr.runner-line',
  BET_SELECTOR = 'div.bet',
  RUNNER_NAME_SELECTOR = 'span.bet-runner-name',
  BET_VALUES_SELECTOR = 'div.bet-values',
  PRICE_INPUT_SELECTOR = 'input.price-input',
  SIZE_INPUT_SELECTOR = 'input.size-input',
  SUBMIT_BET_SELECTOR = 'button.betslip-submit-btn';

async function bot() {
  // instantiate browser
  const browser = await P.launch({
    headless: false,
    timeout: 180000
  });
  // create blank page
  const page = await browser.newPage();
  // set viewport to 1366*768
  await page.setViewport({width: 1366, height: 768});
  // set the user agent
  await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
  // navigate to EVENT_URL
  await page.goto(EVENT_URL, {
    waitUntil: 'networkidle2',
    timeout: 180000
  });
  await page.waitFor(30*1000);
  // wait for EMAIL and PWD selectors to be available
  await page.waitForSelector(EMAIL_SELECTOR, {timeout: 30000});
  await page.waitForSelector(PWD_SELECTOR, {timeout: 30000});
  // enter email
  await page.type(EMAIL_SELECTOR, EMAIL, {delay: 100});
  await page.waitFor(2*1000);
  //enter password
  await page.type(PWD_SELECTOR, PWD, {delay: 100});
  await page.waitFor(2*1000);
  // click login button
  await page.click(LOGIN_BTN_SELECTOR);
  await page.waitFor(30*1000);
  // ensure race container selector available
  await page.waitForSelector(SELECTIONS_CONTAINER_SELECTOR, {
    timeout: 180000
  });
  // allow 'page' instance to output any calls to browser log to process obj
  //page.on('console', data => process.send(data.text()));
  page.on('console', data => console.log(data.text()));
  // bind to races container and lsiten for updates to , bets etc
  await page.$eval(SELECTIONS_CONTAINER_SELECTOR,
    (target, MATCHED_AMOUNT_SELECTOR) => {
      
      target.addEventListener('DOMSubtreeModified', function (e) {
        // check for most common element of back and lay as source of event
        if(e.target.parentElement.parentElement.parentElement.parentElement.className == 'runner-line') {
          // define variables
          let
            betType,
            odds,
            liquidity,
            SELECTION;
           SELECTION = e.target.parentElement.parentElement.parentElement.parentElement.children[0].children[1].children[1].children[0].children[0].children[0].children[2].children[0].innerText.split('\n')[0];
          // check 12 conditions
          if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')) {
            betType = 'b0';
            odds = e.target.innerText;
            liquidity = e.target.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')) {
            betType = 'l0';
            odds = e.target.innerText;
            liquidity = e.target.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
            betType = 'b1';
            odds = e.target.innerText;
            liquidity = e.target.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
            betType = 'l1';
            odds = e.target.innerText;
            liquidity = e.target.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
            betType = 'b2';
            odds = e.target.innerText;
            liquidity = e.target.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if((e.target.className == 'bet-button-price') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
            betType = 'l2';
            odds = e.target.innerText;
            liquidity = e.target.parentElement.parentElement.children[0].children[1].innerText;
          }
          else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons back-cell last-back-cell')) {
            betType = 'b0';
            odds = e.target.parentElement.children[0].innerText;
            liquidity = e.target.innerText;
          }
          else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.className == 'bet-buttons lay-cell first-lay-cell')) {
            betType = 'l0';
            odds = e.target.parentElement.children[0].innerText;
            liquidity = e.target.innerText;
          }
          else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
            betType = 'b1';
            odds = e.target.parentElement.children[0].innerText;
            liquidity = e.target.innerText;
          }
          else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
            betType = 'l1';
            odds = e.target.parentElement.children[0].innerText;
            liquidity = e.target.innerText;
          }
          else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons back-cell last-back-cell')) {
            betType = 'b2';
            odds = e.target.parentElement.children[0].innerText;
            liquidity = e.target.innerText;
          }
          else if((e.target.className == 'bet-button-size') && (e.target.parentElement.parentElement.parentElement.nextElementSibling.nextElementSibling.className == 'bet-buttons lay-cell first-lay-cell')) {
            betType = 'l2';
            odds = e.target.parentElement.children[0].innerText;
            liquidity = e.target.innerText;
          }
          if(!!betType && !!odds && !!liquidity && !!SELECTION) {
            let timestamp = new Date();
            timestamp = timestamp.toISOString();
            let matchedAmount = document.querySelector(MATCHED_AMOUNT_SELECTOR).innerText;
            matchedAmount = Number(matchedAmount.replace(/\D/g, ''));
            const data = {
              betType,
              matchedAmount,
              timestamp,
              odds: Number(odds),
              liquidity: Number(liquidity.slice(1)),
              selection: SELECTION

            };
            const output = JSON.stringify(data);
            console.log(output);
          }
        }
      }
    );
  }, MATCHED_AMOUNT_SELECTOR);

  async function placeBet(SELECTION, TYPE) {
    // create blank page
    const page = await browser.newPage();
    // set viewport to 1366*768
    await page.setViewport({width: 1366, height: 768});
    // set the user agent
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko)');
    // navigate to EVENT_URL
    await page.goto(EVENT_URL, {
      waitUntil: 'networkidle2',
      timeout: 180000
    });
    // ensure race container selector available
    await page.waitForSelector(RUNNERS_SELECTOR, {
      timeout: 180000
    });

    // get RUNNERS
    let targets = await page.$$eval(RUNNERS_SELECTOR, (targets, SELECTION, TYPE) => {
      console.log('targets');
      console.log(targets);
      targets.filter(target => {// filter for SELECTION
        if(target.children[0].children[1].children[1].children[0].children[0].children[0].children[2].children[0].innerText.split('\n')[0] == SELECTION) {
          if(TYPE == 'bet') {
            return target.children[3].firstChild.click(); 
          }
          else if(TYPE == 'lay') {
            return target.children[4].firstChild.click(); 
          }         
        }
      }); 
      return targets;        
    }, SELECTION, TYPE);    
  }
  setTimeout(() => placeBet('Dubai Waves', 'lay'), 3000);
}

// execute scraper
bot()
  .catch(err => console.error(err));
//=============================================================================
