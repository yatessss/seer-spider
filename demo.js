// 截图 https://zhuanlan.zhihu.com/p/76237595

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  //设置可视区域大小
  await page.setViewport({width: 1920, height: 800});
  await page.goto('https://youdata.163.com');
  //对整个页面截图
  await page.screenshot({
    path: './files/capture.png',  //图片保存路径
    type: 'png',
    fullPage: true //边滚动边截图
    // clip: {x: 0, y: 0, width: 1920, height: 800}
  });
  //对页面某个元素截图
  let [element] = await page.$x('/html/body/section[4]/div/div[2]');
  await element.screenshot({
    path: './files/element.png'
  });
  await page.close();
  await browser.close();
})();
