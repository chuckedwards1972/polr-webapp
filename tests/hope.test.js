const { chromium } = require('playwright');
const BASE = 'https://chuckedwards1972.github.io/polr-webapp/POLR-WIRED-ENHANCED.html';
const API = 'https://polr-backend-production.up.railway.app/api';
async function run() {
  const results = [];
  const browser = await chromium.launch();
  const page = await browser.newPage();
  async function test(name, fn) {
    try { await fn(); results.push({name,status:'PASS'}); console.log('PASS:',name); }
    catch(e) { results.push({name,status:'FAIL',error:e.message}); console.log('FAIL:',name,'-',e.message); }
  }
  await test('Site loads', async () => {
    const res = await page.goto(BASE, {waitUntil:'domcontentloaded',timeout:60000});
    if (!res || !res.ok()) throw new Error('HTTP error');
  });
  await test('No white screen', async () => {
    await page.waitForTimeout(3000);
    const text = await page.textContent('body');
    if (!text || text.trim().length < 50) throw new Error('Page blank');
  });
  await test('HOPE branding present', async () => {
    const text = await page.textContent('body');
    if (!text.includes('HOPE')) throw new Error('HOPE not found');
  });
  await test('Port Allen location shown', async () => {
    const text = await page.textContent('body');
    if (!text.includes('Port Allen')) throw new Error('Port Allen not found');
  });
  await test('Railway backend responds', async () => {
    const res = await page.evaluate(async (api) => {
      try { const r = await fetch(api+'/health'); return r.status; } catch(e) { return 0; }
    }, API);
    if (res === 0) throw new Error('Backend unreachable');
  });
  await test('Mobile viewport ok', async () => {
    await page.setViewportSize({width:390,height:844});
    await page.goto(BASE, {waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(2000);
    const text = await page.textContent('body');
    if (!text || text.length < 50) throw new Error('Mobile render failed');
  });
  await browser.close();
  const failed = results.filter(r=>r.status==='FAIL');
  const passed = results.filter(r=>r.status==='PASS');
  console.log('');
  console.log('=== RESULTS ===');
  console.log('PASSED:',passed.length,'FAILED:',failed.length);
  if (failed.length>0) { failed.forEach(f=>console.log('FAIL:',f.name,f.error)); }
  require('fs').mkdirSync('evolution',{recursive:true});
  require('fs').writeFileSync('evolution/last-results.json',JSON.stringify({timestamp:new Date().toISOString(),results,passed:passed.length,failed:failed.length},null,2));
  if (failed.length>0) process.exit(1);
}
run().catch(e=>{console.error(e);process.exit(1);});