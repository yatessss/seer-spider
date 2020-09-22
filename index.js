const puppeteer = require('puppeteer');
const constants = require('./constant');


(async () => {

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //访问网址 只有2个网络连接时触发（至少500毫秒后）
  await page.goto('http://www.aastocks.com/sc/stocks/market/ipo/upcomingipo/company-summary', {timeout: 10 * 1000, waitUntil: 'networkidle2'});

  await page.waitForSelector('#tblUpcoming', {timeout: 10 * 1000})

  // 获取表头信息
  let tableHeadInfo = await page.$$eval('#tblUpcoming thead tr td', elements => {
    let result = [];
    for (let i = 0, len = elements.length; i < len; i++) {
      elements[i].innerText && result.push(elements[i].innerText)
    }
    // [ '代号▼', '公司名称▼', '行业', '招股价', '每手股价', '入场费', '招股日期', '上市日期▲' ]
    return result;
  });


  let tableBodyInfo = [];
  let _con = await page.$$("#tblUpcoming tbody tr");
  for (let i = 0, len = _con.length; i < len; i++) {
    let titleArr = await _con[i].$$eval('td', els1 => {
      let arr = [];
      //开始解析每篇文章的标题
      for (let i = 0, len = els1.length; i < len; i++) {
        els1[i].innerText && arr.push(els1[i].innerText); //获取文章的标题
      }
      return arr;
    });
    tableBodyInfo.push(titleArr)
    console.log(JSON.stringify(titleArr))
  }
//  await console.log(_con)
//  let titleArr = await page.$$eval('#tblUpcoming tr', els => {
//    let arr = new Array();
//    //开始解析每篇文章的标题
//    for (let i = 0, len = els.length; i < len; i++) {
//      arr.push(els[i].innerText); //获取文章的标题
//    }
//    return arr;
//  });
//  // 输出获取的标题
//  await  console.log('输出方法获取的标题');
//  for (let i = 0, len = titleArr.length; i < len; i++) {
//    await console.log(titleArr[i]);
//  }


  await page.screenshot({
    path: 'capture.png',  //图片保存路径
    type: 'png',
    fullPage: true //边滚动边截图
    // clip: {x: 0, y: 0, width: 1920, height: 800}
  });

  await browser.close();
})();
