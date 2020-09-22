const puppeteer = require('puppeteer');
const constants = require('./constant');
const utils = require('./utils');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //访问网址 只有2个网络连接时触发（至少500毫秒后）
  await page.goto('http://www.aastocks.com/sc/stocks/market/ipo/upcomingipo/company-summary', {timeout: 10 * 1000, waitUntil: 'networkidle2'});

  await page.waitForSelector('#tblUpcoming', {timeout: 10 * 1000})

  let upcomingTableHeadInfo = {} //表头信息
  let upcomingTableBodyInfo = [] // 最近新股列表

  // 获取表头信息
  upcomingTableHeadInfo = await page.$$eval('#tblUpcoming thead tr td', elements => {
    let result = [];
    for (let i = 0, len = elements.length; i < len; i++) {
      elements[i].innerText && result.push(elements[i].innerText)
    }
    // [ '代号▼', '公司名称▼', '行业', '招股价', '每手股价', '入场费', '招股日期', '上市日期▲' ]
    return result;
  });

  // 最近新股列表
  let tableContent = await page.$$("#tblUpcoming tbody tr");
  for (let i = 0, len = tableContent.length; i < len; i++) {
    let rowContent = await tableContent[i].$$eval('td', els1 => {
      let arr = [];
      for (let i = 0, len = els1.length; i < len; i++) {
        els1[i].innerText && arr.push(els1[i].innerText);
      }
      return arr;
    });
    // 格式化

    let result = {}
    rowContent.forEach((item, index) => {
      result[constants.HEAD_INFO_MAP[upcomingTableHeadInfo[index]]] = item
    })
    upcomingTableBodyInfo.push(result)
  }
  console.log(JSON.stringify(upcomingTableBodyInfo))

  // 循环拉取即将上市的公司的信息
  for (let index = 0, len = upcomingTableBodyInfo.length; index < len; index++) {
    let upcomingIpoInfo = {
      name: '',
      code: '',
    }
    let ipoTimeTable = {
      title: '招股日程',
      content: []
    } //
    let companyInfo = {
      title: '公司资料',
      content: []
    }
    let ipoInfo = {
      title: '招股资料',
      content: []
    }

    upcomingIpoInfo.code = upcomingTableBodyInfo[index].code
    upcomingIpoInfo.name = upcomingTableBodyInfo[index].name

    const code = upcomingTableBodyInfo[index].code.replace('.HK', '')
    // 根据 返回的数据列表 抓取公司信息
    await page.goto(`http://www.aastocks.com/sc/stocks/market/ipo/upcomingipo/company-summary?symbol=${code}&s=3&o=1#info`, {timeout: 10 * 1000, waitUntil: 'networkidle2'});

    // 招股资料
    let timeTable = await page.$$('#IPOInfo tr');
    for (let i = 0, len = timeTable.length; i < len; i++) {
      let rowContent = await timeTable[i].$$eval('td', els1 => {
        let arr = [];
        for (let i = 0, len = els1.length; i < len; i++) {
          els1[i].innerText && arr.push(els1[i].innerText);
        }
        return arr;
      });
      utils.arrayToObject(rowContent, constants.IPO_INFO_MAP) && ipoInfo.content.push(utils.arrayToObject(rowContent, constants.IPO_INFO_MAP))
    }
    console.log(JSON.stringify(ipoInfo))

    // 招股日程、公司资料
    let companyInfoList = await page.$$('#UCCompanySummary #tblCom .vat .ns2 tbody');
    for (let i = 0, len = companyInfoList.length; i < len; i++) {
      let rowContent = await companyInfoList[i].$$eval('tr', els1 => {
        let arr = [];
        for (let i = 0, len = els1.length; i < len; i++) {
          els1[i].innerText && arr.push(els1[i].innerText);
        }
        return arr;
      });
      // 招股资料
      if (i === 0) {
        rowContent.forEach(item => {
          let arr = item.split('\t')

          utils.arrayToObject(arr, constants.IPO_TIME_MAP) && ipoTimeTable.content.push(utils.arrayToObject(arr, constants.IPO_TIME_MAP))
        })
      } else if (i === 1) {
        rowContent.forEach(item => {
          let arr = item.split('\t')
          utils.arrayToObject(arr, constants.COMPANY_MAP) && companyInfo.content.push(utils.arrayToObject(arr, constants.COMPANY_MAP))
        })
      }
    }

    upcomingIpoInfo = {
      ...upcomingIpoInfo,
      ipoTimeTable,
      companyInfo,
      ipoInfo
    }

    console.log(JSON.stringify(upcomingIpoInfo))
    fs.writeFileSync('./'+code+'.txt', JSON.stringify(upcomingIpoInfo))
  }

  await browser.close();
})();
var a = {
  "code": "06988.HK",
  "name": "乐享互动",
  "industry": "电子商贸及互联网服务",
  "offerPrice": "2.14-3.21",
  "lotSize": "1,000",
  "entryFee": "3,242",
  "offerPeriod": "2020/09/10-2020/09/15",
  "listingDate": "2020/09/23"
}
