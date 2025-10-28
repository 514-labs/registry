import type { DiscountWithKey, BrandWithKey } from '../ingest/models';

/**
 * Check if anonymization is enabled based on environment variable.
 * Anonymization is enabled by default unless DUTCHIE_ANONYMIZE is explicitly set to "false".
 */
export function shouldAnonymize(): boolean {
  const envValue = process.env.DUTCHIE_ANONYMIZE;
  return envValue !== 'false';
}

/**
 * Generate a random string for anonymizing text fields
 */
function generateRandomString(prefix: string, length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = prefix;
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate a random future date string (YYYY-MM-DD format)
 */
function generateRandomDate(yearsAhead: number = 1): string {
  const now = new Date();
  const futureDate = new Date(now.getTime() + Math.random() * yearsAhead * 365 * 24 * 60 * 60 * 1000);
  return futureDate.toISOString().split('T')[0];
}

/**
 * Generate a random integer within a range
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Fictional cannabis brand names for anonymization
 */
const CANNABIS_BRAND_NAMES = [
  'Green Valley Farms',
  'Pacific Coast Botanicals',
  'Mountain Peak Cannabis',
  'Desert Bloom Collective',
  'Northern Lights Co.',
  'Golden State Gardens',
  'Emerald Triangle Farms',
  'Sunset Valley Organics',
  'Alpine Wellness',
  'Coastal Green',
  'Terra Verde Cannabis',
  'Blue Sky Botanicals',
  'Silver Leaf Farms',
  'Redwood Reserve',
  'High Desert Harvest',
  'Valley View Cannabis',
  'Summit Peak Extracts',
  'Evergreen Farms',
  'Crystal Creek Cannabis',
  'Wildflower Wellness',
  'Pine Ridge Botanicals',
  'Cascade Mountain Farms',
  'Horizon Gardens',
  'Riverstone Cannabis',
  'Meadow Creek Collective',
  'Skyline Organics',
  'Oakwood Farms',
  'Highland Hemp Co.',
  'Lakeside Botanicals',
  'Canyon Verde',
  'Windmill Gardens',
  'Harvest Moon Farms',
  'Sunrise Wellness',
  'Maple Grove Cannabis',
  'Thunder Ridge Farms',
  'Solstice Gardens',
  'Moonlight Meadows',
  'Cedar Valley Organics',
  'Willow Creek Farms',
  'Aurora Botanicals',
];

/**
 * Get a deterministic but random-looking brand name based on an ID
 */
function getAnonymousBrandName(brandId: number): string {
  const index = brandId % CANNABIS_BRAND_NAMES.length;
  return CANNABIS_BRAND_NAMES[index];
}

/**
 * Anonymize a single discount record
 */
export function anonymizeDiscount(discount: DiscountWithKey): DiscountWithKey {
  const anonymized: DiscountWithKey = {
    ...discount,
    id: discount.id,
    
    // Anonymize string identifiers
    externalId: discount.externalId ? `ANON-EXT-${discount.id}` : undefined,
    discountCode: discount.discountCode ? generateRandomString('CODE', 6) : undefined,
    discountDescription: discount.discountDescription ? `Anonymized discount ${discount.id}` : undefined,
    onlineName: discount.onlineName ? `Anonymized Online Discount ${discount.id}` : undefined,
    
    // Anonymize dates
    validDateFrom: discount.validDateFrom ? generateRandomDate(0.5) : undefined,
    validDateTo: discount.validDateTo ? generateRandomDate(1) : undefined,
    
    // Anonymize numeric values
    maxRedemptions: discount.maxRedemptions !== undefined ? randomInt(10, 100) : undefined,
    redemptionLimit: discount.redemptionLimit !== undefined ? randomInt(1, 10) : undefined,
    
    // Keep enum values as-is (they don't reveal sensitive info)
    firstTimeCustomerOnly: discount.firstTimeCustomerOnly,
    applicationMethodId: discount.applicationMethodId,
    applicationMethod: discount.applicationMethod,
    
    // Keep boolean flags
    canStackAutomatically: discount.canStackAutomatically,
    monday: discount.monday,
    tuesday: discount.tuesday,
    wednesday: discount.wednesday,
    thursday: discount.thursday,
    friday: discount.friday,
    saturday: discount.saturday,
    sunday: discount.sunday,
    isActive: discount.isActive,
    isBundledDiscount: discount.isBundledDiscount,
    
    // Anonymize array of numbers (location/group restrictions)
    locationRestrictions: discount.locationRestrictions?.map((_, idx) => 1000 + idx),
    restrictToGroupIds: discount.restrictToGroupIds?.map((_, idx) => 2000 + idx),
    
    // Anonymize constraint objects
    constraints: discount.constraints?.map((constraint, idx) => ({
      ...constraint,
      discountConstraintId: constraint.discountConstraintId !== undefined ? 10000 + idx : undefined,
      thresholdMin: constraint.thresholdMin !== undefined ? randomInt(10, 50) : undefined,
    })),
    
    // Anonymize reward fields
    reward_discountRewardId: discount.reward_discountRewardId !== undefined ? randomInt(5000, 6000) : undefined,
    reward_discountId: discount.reward_discountId !== undefined ? discount.id : undefined,
    reward_discountValue: discount.reward_discountValue !== undefined ? randomInt(5, 50) : undefined,
    reward_thresholdMin: discount.reward_thresholdMin !== undefined ? randomInt(10, 100) : undefined,
    reward_thresholdMax: discount.reward_thresholdMax !== undefined ? randomInt(100, 500) : undefined,
    reward_highestOrLowest: discount.reward_highestOrLowest,
    reward_calculationMethodId: discount.reward_calculationMethodId,
    reward_calculationMethod: discount.reward_calculationMethod,
    reward_includeNonCannabis: discount.reward_includeNonCannabis,
    reward_thresholdTypeId: discount.reward_thresholdTypeId,
    reward_thresholdType: discount.reward_thresholdType,
    reward_hasThreshold: discount.reward_hasThreshold,
    reward_itemGroupTypeId: discount.reward_itemGroupTypeId,
    reward_itemGroupType: discount.reward_itemGroupType,
    reward_applyToOnlyOneItem: discount.reward_applyToOnlyOneItem,
    
    // Anonymize menu display fields
    menuDisplay_menuDisplayDescription: discount.menuDisplay_menuDisplayDescription 
      ? `Anonymized menu description ${discount.id}` 
      : undefined,
    menuDisplay_menuDisplayImageUrl: discount.menuDisplay_menuDisplayImageUrl 
      ? `https://example.com/images/discount-${discount.id}.jpg` 
      : undefined,
    menuDisplay_menuDisplayName: discount.menuDisplay_menuDisplayName 
      ? `Anonymized Menu Item ${discount.id}` 
      : undefined,
    menuDisplay_menuDisplayRank: discount.menuDisplay_menuDisplayRank !== undefined 
      ? randomInt(1, 100) 
      : undefined,

    paymentRestrictions_payByBankSignupIncentive: discount.paymentRestrictions_payByBankSignupIncentive,
  };
  
  return anonymized;
}

/**
 * Anonymize a single brand record
 */
export function anonymizeBrand(brand: BrandWithKey): BrandWithKey {
  return {
    ...brand,
    brandId: brand.brandId,
    
    // Anonymize brand name with realistic cannabis brand
    brandName: brand.brandName ? getAnonymousBrandName(brand.brandId) : undefined,
    
    // Anonymize catalog brand ID
    brandCatalogBrandId: brand.brandCatalogBrandId 
      ? `CAT-${brand.brandId.toString().padStart(6, '0')}` 
      : undefined,
  };
}

