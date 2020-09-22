const constants = {
  HEAD_INFO_MAP: {
    '代号▼': 'code',
    '公司名称▼': 'name',
    '行业': 'industry',
    '招股价': 'offerPrice',
    '每手股价': 'lotSize',
    '入场费': 'entryFee',
    '招股日期': 'offerPeriod',
    '上市日期▲': 'listingDate',
  },
  IPO_INFO_MAP: {
    '每手股数': 'lotSize',
    '招股价': 'offerPrice',
    '上市市值': 'marketCap',
    '香港配售股份数目3': 'offerShares',
    '保荐人': 'sponsor',
    '包销商': 'underwriter',
    '收款银行': 'whiteForm',
    'eIPO': 'eIPO',
  },
  IPO_TIME_MAP: {
    '招股日期': 'offerPeriod',
    '定价日期': 'priceSet',
    '公布售股结果日期': 'allotment',
    '退票寄发日期': 'refund',
    '上市日期': 'listing',
  },
  COMPANY_MAP: {
    '上市市场': 'market',
    '行业': 'industry',
    '背景': 'background',
    '业务主要地区': 'businessArea',
    '网址': 'website',
  }

}

module.exports = constants
