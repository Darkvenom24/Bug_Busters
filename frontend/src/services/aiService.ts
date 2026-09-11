import { DemandPrediction, PriceRecommendation, MatchRecommendation, BuyerRequirement, Produce, QualityGrade } from '../types';
import { DEMAND_FORECASTS, PRICE_RECOMMENDATIONS } from './mockData';

export interface VoiceAssistantResponse {
  intent: 'SELL_PRODUCE' | 'ORDER_STATUS' | 'PRICE_INQUIRY' | 'FIND_BUYER' | 'GENERAL_HELP';
  language: 'Gujarati' | 'Hindi' | 'English';
  extractedCrop?: string;
  extractedQuantityKg?: number;
  message: string;
  actionableData?: Record<string, unknown>;
}

export const aiService = {
  getDemandForecast(crop: string): DemandPrediction {
    if (DEMAND_FORECASTS[crop]) {
      return DEMAND_FORECASTS[crop];
    }
    // Dynamic generator for other crops
    return {
      crop,
      location: 'Gujarat Agricultural Zone',
      currentDemandTons: 1100,
      predictedDemandTons: 1350,
      percentChange: 22.7,
      period: 'Next 30 Days',
      aiInsight: `AI Demand analysis indicates steady upward movement for ${crop} driven by regional wholesale mandates.`,
      chartData: [
        { month: 'Jun', actual: 920, predicted: 910 },
        { month: 'Jul', actual: 1010, predicted: 1000 },
        { month: 'Aug', actual: 1080, predicted: 1100 },
        { month: 'Sep (Now)', actual: 1100, predicted: 1120 },
        { month: 'Oct (AI)', actual: 0, predicted: 1250 },
        { month: 'Nov (AI)', actual: 0, predicted: 1350 }
      ]
    };
  },

  calculatePriceRecommendation(
    crop: string,
    qualityGrade: QualityGrade,
    distanceKm = 25,
    isOrganic = false
  ): PriceRecommendation {
    const baseRec = PRICE_RECOMMENDATIONS[crop] || {
      crop,
      marketReferencePrice: 25,
      recommendedMin: 26,
      recommendedMax: 29,
      demandLevel: 'Medium' as const,
      supplyLevel: 'Medium' as const,
      qualityFactor: 'Grade A standard',
      logisticsPerKg: 2.5,
      confidenceScore: 90,
      factorsSummary: 'Reference mandi rate with standard logistics and seasonal correction.'
    };

    let min = baseRec.marketReferencePrice;
    let max = min + 3;

    // Adjust for quality
    if (qualityGrade === 'Grade A') {
      min += 2;
      max += 3;
    } else if (qualityGrade === 'Grade C') {
      min -= 2;
      max -= 1;
    }

    // Adjust for organic
    if (isOrganic) {
      min += 3;
      max += 4;
    }

    // Adjust for logistics distance
    const logisticsPerKg = Number((1.5 + (distanceKm * 0.04)).toFixed(2));

    return {
      ...baseRec,
      recommendedMin: Math.max(10, Math.round(min)),
      recommendedMax: Math.max(12, Math.round(max)),
      logisticsPerKg,
      factorsSummary: `Based on ₹${baseRec.marketReferencePrice}/kg Mandi base, ${qualityGrade} quality adjustment, and ₹${logisticsPerKg}/kg transit.`
    };
  },

  calculateMatches(requirement: BuyerRequirement, produceList: Produce[]): MatchRecommendation[] {
    const matches: MatchRecommendation[] = [];

    produceList.forEach(produce => {
      // Basic filter: crop must match (case-insensitive substring match)
      if (!produce.crop.toLowerCase().includes(requirement.crop.toLowerCase()) &&
          !requirement.crop.toLowerCase().includes(produce.crop.toLowerCase())) {
        return;
      }

      // Distance score (assuming max acceptable distance)
      const distance = 15 + Math.floor(Math.random() * 35); // between 15km and 50km
      const distanceScore = Math.max(0, 100 - (distance / requirement.maxDistanceKm) * 60);

      // Price score: if produce price <= requirement maxPrice, higher score
      const priceScore = produce.pricePerKg <= requirement.maxPricePerKg
        ? 95 - ((produce.pricePerKg / requirement.maxPricePerKg) * 10)
        : Math.max(40, 100 - (produce.pricePerKg - requirement.maxPricePerKg) * 15);

      // Quantity fulfillment score
      const qtyRatio = Math.min(produce.quantityKg / requirement.quantityKg, 1.2);
      const quantityScore = qtyRatio >= 0.8 ? 95 : (qtyRatio / 0.8) * 90;

      // Quality score
      const qualityScore = produce.qualityGrade === requirement.qualityRequirement ? 95 : 78;

      // Reliability score
      const reliabilityScore = 92;

      // Weighted combination as specified in PDF page 7
      // Distance (25%), Price (30%), Quantity (20%), Quality (15%), Reliability (10%)
      const totalScore = Math.round(
        distanceScore * 0.25 +
        priceScore * 0.30 +
        quantityScore * 0.20 +
        qualityScore * 0.15 +
        reliabilityScore * 0.10
      );

      matches.push({
        farmerId: produce.farmerId,
        produceId: produce.id,
        farmerName: produce.farmerName,
        crop: produce.crop,
        location: produce.location,
        distanceKm: distance,
        matchScore: Math.min(99, Math.max(65, totalScore)),
        pricePerKg: produce.pricePerKg,
        availableKg: produce.quantityKg,
        qualityGrade: produce.qualityGrade,
        reliabilityRating: 4.8,
        breakdown: {
          distanceScore: Math.round(distanceScore),
          priceScore: Math.round(priceScore),
          quantityScore: Math.round(quantityScore),
          qualityScore: Math.round(qualityScore),
          reliabilityScore: Math.round(reliabilityScore),
        }
      });
    });

    // Sort descending by match score
    return matches.sort((a, b) => b.matchScore - a.matchScore);
  },

  parseVoiceCommand(transcript: string): VoiceAssistantResponse {
    const text = transcript.toLowerCase().trim();

    // Crop detection mapping (Gujarati, Hindi, English)
    let extractedCrop: string | undefined;
    if (text.includes('dungri') || text.includes('kanda') || text.includes('pyaz') || text.includes('onion')) {
      extractedCrop = 'Onion';
    } else if (text.includes('tomato') || text.includes('tameta') || text.includes('tamatar')) {
      extractedCrop = 'Tomato';
    } else if (text.includes('palak') || text.includes('bhaji') || text.includes('spinach')) {
      extractedCrop = 'Spinach (Palak)';
    } else if (text.includes('kela') || text.includes('banana')) {
      extractedCrop = 'Banana';
    } else if (text.includes('bataka') || text.includes('batata') || text.includes('aloo') || text.includes('potato')) {
      extractedCrop = 'Potato';
    }

    // Quantity extraction (e.g. 500 kilo, 300 kg)
    const qtyMatch = text.match(/(\d+)\s*(kilo|kg|ton|quintal|kilos)?/i);
    const extractedQuantityKg = qtyMatch ? parseInt(qtyMatch[1], 10) : undefined;

    // Detect Language
    let language: 'Gujarati' | 'Hindi' | 'English' = 'English';
    if (text.includes('che') || text.includes('mare') || text.includes('vechvi') || text.includes('shu') || text.includes('joiye') || text.includes('bhav')) {
      language = 'Gujarati';
    } else if (text.includes('hai') || text.includes('kya') || text.includes('chahiye') || text.includes('daam') || text.includes('bechna')) {
      language = 'Hindi';
    }

    // Detect Intent
    // 1. SELL_PRODUCE
    if (text.includes('vechvi') || text.includes('vechvu') || text.includes('bechna') || text.includes('sell') || text.includes('list produce')) {
      return {
        intent: 'SELL_PRODUCE',
        language,
        extractedCrop: extractedCrop || 'Tomato',
        extractedQuantityKg: extractedQuantityKg || 500,
        message: language === 'Gujarati'
          ? `મેં ${extractedQuantityKg || 500} kg ${extractedCrop || 'પાક'} વેચવાની વિનંતી સમજી લીધી છે. આપનું લિસ્ટિંગ તૈયાર છે!`
          : language === 'Hindi'
          ? `मैंने ${extractedQuantityKg || 500} kg ${extractedCrop || 'फसल'} बेचने का अनुरोध समझ लिया है। लिस्टिंग तैयार है!`
          : `Understood intent to sell ${extractedQuantityKg || 500} kg of ${extractedCrop || 'Produce'}. Auto-populating listing form!`,
        actionableData: { crop: extractedCrop || 'Tomato', quantityKg: extractedQuantityKg || 500 }
      };
    }

    // 2. ORDER_STATUS
    if (text.includes('status') || text.includes('kya status') || text.includes('shu che') || text.includes('kahan pahuncha')) {
      return {
        intent: 'ORDER_STATUS',
        language,
        message: language === 'Gujarati'
          ? 'તમારો ઓર્ડર #ORD-8821 હાલમાં ટ્રાન્ઝિટમાં છે અને આજે બપોરે 2:30 વાગ્યે પહોંચશે.'
          : language === 'Hindi'
          ? 'आपका ऑर्डर #ORD-8821 रास्ते में है और आज दोपहर 2:30 बजे तक पहुंच जाएगा।'
          : 'Your order #ORD-8821 is currently In Transit and scheduled for delivery at 02:30 PM today.',
      };
    }

    // 3. PRICE_INQUIRY
    if (text.includes('bhav') || text.includes('rate') || text.includes('price') || text.includes('daam') || text.includes('kimat')) {
      const cropName = extractedCrop || 'Tomato';
      return {
        intent: 'PRICE_INQUIRY',
        language,
        extractedCrop: cropName,
        message: language === 'Gujarati'
          ? `આજે ${cropName} નો એઆઈ આધારિત બજાર ભાવ ₹30 - ₹33 પ્રતિ કિલો છે.`
          : language === 'Hindi'
          ? `आज ${cropName} का AI अनुशंसित भाव ₹30 - ₹33 प्रति किलो है।`
          : `Today's AI Recommended Price for ${cropName} is ₹30 - ₹33 per kg with strong market demand.`,
      };
    }

    // 4. FIND_BUYER
    if (text.includes('buyer') || text.includes('grahak') || text.includes('kharidar') || text.includes('joiye')) {
      return {
        intent: 'FIND_BUYER',
        language,
        extractedCrop: extractedCrop || 'Onion',
        extractedQuantityKg: extractedQuantityKg || 500,
        message: language === 'Gujarati'
          ? `${extractedCrop || 'ડુંગળી'} માટે 3 હોટેલ અને સુપરમાર્કેટ ખરીદદારો ઉપલબ્ધ છે (સૌથી વધુ મેચ 92%).`
          : language === 'Hindi'
          ? `${extractedCrop || 'प्याज'} के लिए 3 सत्यापित खरीदार उपलब्ध हैं (उच्चतम मैच 92%)।`
          : `Found 3 verified bulk buyers actively looking for ${extractedCrop || 'Onion'} (Highest match 92%).`,
      };
    }

    // Default
    return {
      intent: 'GENERAL_HELP',
      language,
      message: language === 'Gujarati'
        ? 'નમસ્તે! હું FarmSetu AI સહાયક છું. તમે પાક વેચવા, ભાવ જાણવા કે ઓર્ડર ટ્રેક કરવા પૂછી શકો છો.'
        : language === 'Hindi'
        ? 'नमस्ते! मैं FarmSetu AI सहायक हूँ। आप फसल बेचने, भाव जानने या ऑर्डर ट्रैक करने के लिए बोल सकते हैं।'
        : 'Welcome to FarmSetu AI Assistant! You can speak in Gujarati, Hindi, or English to list produce, check market prices, or track deliveries.',
    };
  }
};
