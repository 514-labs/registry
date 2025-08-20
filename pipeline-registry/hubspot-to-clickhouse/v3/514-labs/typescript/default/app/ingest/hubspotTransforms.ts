import { 
  HubSpotDealRawPipeline, 
  HubSpotDealPipeline, 
  HubSpotDealRaw, 
  HubSpotDeal 
} from "./hubspotModels";

// Array of fake companies for obfuscating deal names
const FAKE_COMPANIES = [
  "Acme Corporation", "Global Dynamics", "TechNova Solutions", "Apex Industries",
  "Summit Enterprises", "NextGen Systems", "Horizon Technologies", "Atlas Corp",
  "Stellar Industries", "Phoenix Technologies", "Quantum Solutions", "Pinnacle Group",
  "Velocity Systems", "Infinity Corp", "Zenith Technologies", "Catalyst Solutions",
  "Nexus Enterprises", "Titan Industries", "Vortex Systems", "Eclipse Technologies",
  "Fusion Corp", "Matrix Solutions", "Orbital Systems", "Spectrum Enterprises",
  "Pulse Technologies", "Vertex Solutions", "Cosmos Industries", "Dynamo Corp",
  "Element Systems", "Frontier Technologies", "Genesis Solutions", "Helix Corp",
  "Impact Industries", "Kinetic Systems", "Lunar Technologies", "Meridian Corp",
  "Nova Solutions", "Omega Industries", "Paradigm Systems", "Quantum Leap Corp",
  "Radiant Technologies", "Synergy Solutions", "Turbo Industries", "Unity Corp",
  "Vector Systems", "Wavelength Technologies", "Xerion Solutions", "Zenith Corp"
];

// Deal types for variety
const DEAL_TYPES = [
  "Enterprise License", "Professional Services", "Annual Subscription", 
  "Implementation Project", "Support Contract", "Consulting Agreement",
  "Software License", "Platform Migration", "Digital Transformation",
  "Cloud Infrastructure", "Security Audit", "Data Analytics Project"
];

// Check if data should be anonymized (defaults to false for real data)
const ANONYMIZE_DATA = process.env.ANONYMIZE_DATA === 'true';

// Log the anonymization mode on startup
console.log(`🔧 HubSpot Pipeline Mode: ${ANONYMIZE_DATA ? 'ANONYMIZED DATA (Demo/Public Safe)' : 'REAL DATA (Internal Use)'}`);

// Helper function to generate deterministic random values based on deal ID
const getRandomFromId = (dealId: string, arrayLength: number): number => {
  let hash = 0;
  for (let i = 0; i < dealId.length; i++) {
    const char = dealId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash) % arrayLength;
};

// Transform raw HubSpot deal events to processed/normalized deal events
HubSpotDealRawPipeline.stream!.addTransform(
  HubSpotDealPipeline.stream!,
  async (rawDeal: HubSpotDealRaw): Promise<HubSpotDeal> => {
    /**
     * Transform HubSpot raw deal data to normalized format.
     * 
     * Normal flow:
     * 1. Extract and type properties from flexible HubSpot properties object
     * 2. Convert string values to appropriate types
     * 3. Calculate derived fields (isWon, isClosed, daysToClose)
     * 4. Return normalized deal
     * 
     * Error flow (DLQ):
     * - If transformation fails, deal goes to dead letter queue
     * - Enables monitoring, debugging, and retry strategies
     */

    const props = rawDeal.properties;

    // Generate deal name based on anonymization flag
    let dealName: string;
    let amount: number;
    
    if (ANONYMIZE_DATA) {
      // Generate obfuscated deal information using fake companies
      const companyIndex = getRandomFromId(rawDeal.id, FAKE_COMPANIES.length);
      const dealTypeIndex = getRandomFromId(rawDeal.id + "type", DEAL_TYPES.length);
      dealName = `${FAKE_COMPANIES[companyIndex]} - ${DEAL_TYPES[dealTypeIndex]}`;
      
      // Ensure amount is always over 100K (between 100K and 5M)
      const originalAmount = parseFloat(props.amount || "0") || 0;
      const baseAmount = 100000; // 100K minimum
      const multiplier = (getRandomFromId(rawDeal.id + "amount", 100) + 1) / 2; // 0.5 to 50
      amount = baseAmount + (originalAmount > 0 ? Math.max(originalAmount, baseAmount * multiplier) : baseAmount * multiplier);
      amount += 20001;
    } else {
      // Use real HubSpot data
      dealName = props.dealname || "Untitled Deal";
      amount = parseFloat(props.amount || "0") || 0;
    }
    const currency = props.deal_currency_code || "USD";
    const stage = props.dealstage || "unknown";
    const stageLabel = props.dealstage_label || stage;
    const pipeline = props.pipeline || "default";
    const pipelineLabel = props.pipeline_label || pipeline;

    // Parse dates with fallbacks - properties may be missing
    const parseDate = (dateStr?: string): Date => {
      if (!dateStr) return new Date();
      try {
        return new Date(dateStr);
      } catch {
        return new Date();
      }
    };

    const createdAt = parseDate(props.createdate || undefined) || new Date(rawDeal.createdAt);
    const lastModifiedAt = parseDate(props.hs_lastmodifieddate || undefined) || new Date(rawDeal.updatedAt);
    const closeDate = props.closedate ? parseDate(props.closedate || undefined) : undefined;

    // Extract owner and metrics - handle null values
    const ownerId = props.hubspot_owner_id;
    const stageProbability = parseFloat(props.hs_deal_stage_probability || "0") || 0;
    
    // Calculate forecast and projected amounts based on anonymization
    let forecastAmount: number;
    let projectedAmount: number;
    
    if (ANONYMIZE_DATA) {
      forecastAmount = parseFloat(props.hs_forecast_amount || "0") || amount * (stageProbability / 100);
      projectedAmount = parseFloat(props.hs_projected_amount || "0") || amount;
    } else {
      forecastAmount = parseFloat(props.hs_forecast_amount || props.amount || "0") || 0;
      projectedAmount = parseFloat(props.hs_projected_amount || props.amount || "0") || 0;
    }

    // Calculate deal status flags
    const isWon = stage.toLowerCase().includes("won") || stage.toLowerCase().includes("closed");
    const isClosed = isWon || stage.toLowerCase().includes("lost") || stage.toLowerCase().includes("closed");
    
    // Calculate days to close if applicable
    let daysToClose: number | undefined;
    if (isClosed && closeDate) {
      const diffTime = Math.abs(closeDate.getTime() - createdAt.getTime());
      daysToClose = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Extract contact and company associations
    const associatedContacts = rawDeal.associations.contacts || [];
    const associatedCompanies = rawDeal.associations.companies || [];

    // Parse counts
    const contactCount = parseInt(props.num_associated_contacts || "0") || associatedContacts.length;
    const noteCount = parseInt(props.num_contacted_notes || "0") || 0;

    // Separate custom properties (excluding standard HubSpot properties)
    const standardProperties = new Set([
      'dealname', 'amount', 'dealstage', 'pipeline', 'dealtype', 'closedate',
      'createdate', 'hs_lastmodifieddate', 'hubspot_owner_id', 'amount_in_home_currency',
      'hs_deal_stage_probability', 'dealstage_label', 'pipeline_label', 'deal_currency_code',
      'hs_forecast_amount', 'hs_projected_amount', 'num_associated_contacts',
      'num_contacted_notes', 'days_to_close'
    ]);

    const customProperties: Record<string, any> = {};
    Object.entries(props).forEach(([key, value]) => {
      if (!standardProperties.has(key) && value !== undefined && value !== null) {
        customProperties[key] = value;
      }
    });

    // Create the normalized deal
    const result: HubSpotDeal = {
      id: rawDeal.id,
      dealName,
      amount,
      currency,
      stage,
      stageLabel,
      pipeline,
      pipelineLabel,
      dealType: props.dealtype || undefined,
      closeDate,
      createdAt,
      lastModifiedAt,
      ownerId: ownerId || undefined,
      stageProbability,
      forecastAmount,
      projectedAmount,
      daysToClose,
      isWon,
      isClosed,
      isArchived: rawDeal.archived,
      contactCount,
      noteCount,
      associatedContacts,
      associatedCompanies,
      customProperties
    };

    console.log(`Processed HubSpot deal: ${dealName} (${rawDeal.id}) - ${stage} - $${amount} ${ANONYMIZE_DATA ? '[ANONYMIZED]' : '[REAL DATA]'}`);
    return result;
  }
);

// Add a streaming consumer to log raw HubSpot deal events
const printHubSpotDealEvent = (rawDeal: HubSpotDealRaw): void => {
  let displayName: string;
  
  if (ANONYMIZE_DATA) {
    // Generate obfuscated name for logging consistency
    const companyIndex = getRandomFromId(rawDeal.id, FAKE_COMPANIES.length);
    const dealTypeIndex = getRandomFromId(rawDeal.id + "type", DEAL_TYPES.length);
    displayName = `${FAKE_COMPANIES[companyIndex]} - ${DEAL_TYPES[dealTypeIndex]}`;
  } else {
    displayName = rawDeal.properties.dealname || "Untitled";
  }
  
  console.log("Received HubSpot Deal event:");
  console.log(`  Deal ID: ${rawDeal.id}`);
  console.log(`  Deal Name: ${displayName}`);
  console.log(`  Amount: ${rawDeal.properties.amount || "0"}`);
  console.log(`  Stage: ${rawDeal.properties.dealstage || "unknown"}`);
  console.log(`  Updated: ${rawDeal.updatedAt}`);
  console.log(`  Anonymized: ${ANONYMIZE_DATA ? 'Yes' : 'No'}`);
  console.log("---");
};

// Note: Consumer registration APIs may vary by Moose version. If available, register here.

// DLQ consumer for handling failed transformations
// Dead-letter handling is configured on the pipelines; hook specific consumers if supported by your Moose version.
