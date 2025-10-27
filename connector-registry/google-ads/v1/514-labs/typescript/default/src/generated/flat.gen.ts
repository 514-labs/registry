// Flattened Google Ads API Types
// These types are flattened versions of the nested types in types.gen.ts
// for easier data warehouse storage and ETL pipelines

export interface CampaignFlat {
  id: string
  name: string
  status: 'ENABLED' | 'PAUSED' | 'REMOVED'
  servingStatus?: string
  advertisingChannelType?: string
  startDate?: string
  endDate?: string
  biddingStrategyType?: string
  targetSpend_targetSpendMicros?: string
  targetSpend_cpcBidCeilingMicros?: string
  networkSettings_targetGoogleSearch?: boolean
  networkSettings_targetSearchNetwork?: boolean
  networkSettings_targetContentNetwork?: boolean
  networkSettings_targetPartnerSearchNetwork?: boolean
}

export interface AdGroupFlat {
  id: string
  campaignId: string
  name: string
  status: 'ENABLED' | 'PAUSED' | 'REMOVED'
  type?: string
  cpcBidMicros?: string
  cpmBidMicros?: string
  targetCpaMicros?: string
  cpvBidMicros?: string
  targetCpmMicros?: string
  percentCpcBidMicros?: string
}

export interface AdFlat {
  id: string
  adGroupId: string
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
  type?: string
  finalUrls?: string
  finalMobileUrls?: string
  trackingUrlTemplate?: string
  displayUrl?: string
  name?: string
  expandedTextAd_headlinePart1?: string
  expandedTextAd_headlinePart2?: string
  expandedTextAd_headlinePart3?: string
  expandedTextAd_description?: string
  expandedTextAd_description2?: string
  expandedTextAd_path1?: string
  expandedTextAd_path2?: string
  responsiveSearchAd_path1?: string
  responsiveSearchAd_path2?: string
}

export interface KeywordFlat {
  id: string
  adGroupId: string
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
  text: string
  matchType: 'EXACT' | 'PHRASE' | 'BROAD'
  cpcBidMicros?: string
  finalUrls?: string
  finalMobileUrls?: string
  trackingUrlTemplate?: string
}

export interface CustomerFlat {
  id: string
  descriptiveName?: string
  currencyCode?: string
  timeZone?: string
  trackingUrlTemplate?: string
  finalUrlSuffix?: string
  autoTaggingEnabled?: boolean
  hasPartnersBadge?: boolean
  manager?: boolean
}
