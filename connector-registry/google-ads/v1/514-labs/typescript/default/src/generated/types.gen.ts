// Google Ads API Types
// TODO: Auto-generate from OpenAPI spec or Google Ads API discovery document

export interface Customer {
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

export interface Campaign {
  id: string
  name: string
  status: 'ENABLED' | 'PAUSED' | 'REMOVED'
  servingStatus?: string
  advertisingChannelType?: 'SEARCH' | 'DISPLAY' | 'SHOPPING' | 'VIDEO' | 'MULTI_CHANNEL' | 'HOTEL' | 'LOCAL' | 'SMART' | 'PERFORMANCE_MAX'
  startDate?: string
  endDate?: string
  biddingStrategyType?: string
  targetSpend?: {
    targetSpendMicros?: string
    cpcBidCeilingMicros?: string
  }
  networkSettings?: {
    targetGoogleSearch?: boolean
    targetSearchNetwork?: boolean
    targetContentNetwork?: boolean
    targetPartnerSearchNetwork?: boolean
  }
}

export interface AdGroup {
  id: string
  campaignId: string
  name: string
  status: 'ENABLED' | 'PAUSED' | 'REMOVED'
  type?: 'SEARCH_STANDARD' | 'DISPLAY_STANDARD' | 'SHOPPING_PRODUCT_ADS' | 'HOTEL_ADS' | 'SHOPPING_SMART_ADS' | 'VIDEO_BUMPER' | 'VIDEO_TRUE_VIEW_IN_STREAM' | 'VIDEO_TRUE_VIEW_IN_DISPLAY' | 'VIDEO_RESPONSIVE' | 'VIDEO_EFFICIENT_REACH' | 'SMART_CAMPAIGN_ADS'
  cpcBidMicros?: string
  cpmBidMicros?: string
  targetCpaMicros?: string
  cpvBidMicros?: string
  targetCpmMicros?: string
  percentCpcBidMicros?: string
}

export interface Ad {
  id: string
  adGroupId: string
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
  type?: 'TEXT_AD' | 'EXPANDED_TEXT_AD' | 'CALL_ONLY_AD' | 'EXPANDED_DYNAMIC_SEARCH_AD' | 'HOTEL_AD' | 'SHOPPING_SMART_AD' | 'SHOPPING_PRODUCT_AD' | 'VIDEO_AD' | 'GMAIL_AD' | 'IMAGE_AD' | 'RESPONSIVE_SEARCH_AD' | 'LEGACY_RESPONSIVE_DISPLAY_AD' | 'APP_AD' | 'LEGACY_APP_INSTALL_AD' | 'RESPONSIVE_DISPLAY_AD' | 'LOCAL_AD' | 'DISPLAY_UPLOAD_AD' | 'APP_ENGAGEMENT_AD' | 'SHOPPING_COMPARISON_LISTING_AD' | 'SMART_CAMPAIGN_AD' | 'APP_PRE_REGISTRATION_AD' | 'DISCOVERY_MULTI_ASSET_AD' | 'DISCOVERY_CAROUSEL_AD' | 'DISCOVERY_VIDEO_RESPONSIVE_AD' | 'SMART_SHOPPING_AD'
  finalUrls?: string[]
  finalMobileUrls?: string[]
  trackingUrlTemplate?: string
  urlCustomParameters?: Record<string, string>
  displayUrl?: string
  name?: string
  expandedTextAd?: {
    headlinePart1?: string
    headlinePart2?: string
    headlinePart3?: string
    description?: string
    description2?: string
    path1?: string
    path2?: string
  }
  responsiveSearchAd?: {
    headlines?: Array<{ text: string; pinnedField?: string }>
    descriptions?: Array<{ text: string; pinnedField?: string }>
    path1?: string
    path2?: string
  }
}

export interface Keyword {
  id: string
  adGroupId: string
  status?: 'ENABLED' | 'PAUSED' | 'REMOVED'
  text: string
  matchType: 'EXACT' | 'PHRASE' | 'BROAD'
  cpcBidMicros?: string
  finalUrls?: string[]
  finalMobileUrls?: string[]
  trackingUrlTemplate?: string
  urlCustomParameters?: Record<string, string>
}

// API Response types
export interface ApiResponse<T> {
  data: T
  nextPageToken?: string
}

export interface ErrorResponse {
  error: {
    code: number
    message: string
    status: string
    details?: Array<{
      '@type': string
      [key: string]: any
    }>
  }
}
