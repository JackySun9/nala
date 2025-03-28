import { test } from '@playwright/test';
import { features } from '../../../features/visual/bacom-blog/sot.spec.js';
import { takeTwo } from '../../../libs/screenshot/take.js';
import { writeResultsToFile } from '../../../libs/screenshot/utils.js';

const { WebUtil } = require('../../../libs/webutil.js');

const folderPath = 'screenshots/bacom-blog';
const results = {};
const MILO_LIBS = '?milolibs=stage';

test.describe('BACOM Blog SOT visual comparison test suite', () => {
  // reset timeout because we use this to run all test data
  test.setTimeout(10 * 60 * 1000);

  for (const feature of features) {
    test(`${feature.name},${feature.tags}`, async ({ page }, testInfo) => {
      const testdata = await WebUtil.loadTestData(`${feature.data}`);

      for (const key of Object.keys(testdata)) {
        const stableURL = testdata[key];
        console.info(stableURL);
        const betaURL = testdata[key] + MILO_LIBS;
        console.info(betaURL);

        const name = `${feature.name}-${key}-${testInfo.project.name}`;
        const result = await takeTwo(
          page,
          stableURL,
          async () => { await page.waitForSelector('.feds-footer-privacyLink'); },
          betaURL,
          async () => { await page.waitForSelector('.feds-footer-privacyLink'); },
          folderPath,
          name,
          { fullPage: true },
        );
        results[name] = [result];
      }
      writeResultsToFile(folderPath, testInfo, results);
    });
  }
});
