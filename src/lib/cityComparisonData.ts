export type ComparisonFactor = {
  label: string;
  value: string;
  score: number;
  context: string;
};

export type ComparisonCity = {
  id: string;
  name: string;
  region: string;
  flag: string;
  match: number;
  summary: string;
  bestFor: string;
  factors: Record<string, ComparisonFactor>;
};

const factor = (label: string, value: string, score: number, context: string): ComparisonFactor => ({ label, value, score, context });

export const comparisonCities: ComparisonCity[] = [
  { id:'lisbon', name:'Lisbon', region:'Lisbon metro', flag:'🇵🇹', match:88, bestFor:'Career & connections', summary:'The most international job market and best-connected airport, with the highest housing costs.', factors:{
    cost:factor('Monthly living cost','€2,150',54,'Rent and dining run higher than elsewhere in Portugal.'), rent:factor('Typical 1-bed rent','€1,350',44,'Central neighborhoods command a sizable premium.'), work:factor('Employment','Strong',92,'Portugal’s deepest market for tech, startups and international roles.'), transport:factor('Public transport','Excellent',91,'Metro, trains, trams and ferries make most areas reachable.'), lifestyle:factor('Pace of life','Energetic',76,'Busy by Portuguese standards, with year-round cultural life.'), climate:factor('Climate','Mild · 300 sun days',90,'Warm, dry summers and gentle winters.'), nature:factor('Access to nature','Very good',82,'Beaches, Sintra and the Arrábida coast are easy day trips.'), airport:factor('Airport connections','Excellent',96,'The widest range of nonstop international routes in Portugal.') } },
  { id:'porto', name:'Porto', region:'Northern Portugal', flag:'🇵🇹', match:94, bestFor:'Balanced city life', summary:'A compact, characterful city with lower costs and strong transit, but a smaller job market.', factors:{
    cost:factor('Monthly living cost','€1,720',75,'Daily costs are generally lower than Lisbon, especially outside the center.'), rent:factor('Typical 1-bed rent','€1,050',68,'Popular central areas are competitive, while nearby districts offer value.'), work:factor('Employment','Good',76,'Growing tech and services scene, though fewer international roles than Lisbon.'), transport:factor('Public transport','Very good',85,'Metro and buses cover the core well; hills affect some journeys.'), lifestyle:factor('Pace of life','Relaxed',91,'A sociable city that feels calmer and more compact than the capital.'), climate:factor('Climate','Mild · wetter winters',76,'Comfortable summers, with more rain and cloud in winter.'), nature:factor('Access to nature','Excellent',91,'Atlantic beaches, river walks and the Douro Valley are close.'), airport:factor('Airport connections','Very good',83,'Strong European network, with fewer long-haul options than Lisbon.') } },
  { id:'braga', name:'Braga', region:'Minho', flag:'🇵🇹', match:82, bestFor:'Families & value', summary:'Affordable and family-friendly with a younger feel, though daily life is more car-dependent.', factors:{
    cost:factor('Monthly living cost','€1,430',89,'Housing and everyday spending stretch noticeably further.'), rent:factor('Typical 1-bed rent','€780',88,'Good value remains available beyond the historic center.'), work:factor('Employment','Moderate',62,'Local tech and university sectors are growing, but the market is smaller.'), transport:factor('Public transport','Fair',59,'Buses serve the center; a car helps for the wider region.'), lifestyle:factor('Pace of life','Calm',94,'Unhurried, community-oriented and well suited to family routines.'), climate:factor('Climate','Green · rainy winters',68,'Warm summers, with frequent rain through the cooler months.'), nature:factor('Access to nature','Excellent',94,'Peneda-Gerês National Park and Minho countryside are close.'), airport:factor('Airport connections','Fair',61,'Porto airport is roughly an hour away by road or coach.') } },
  { id:'coimbra', name:'Coimbra', region:'Central Portugal', flag:'🇵🇹', match:79, bestFor:'Students & calm', summary:'A walkable university city with accessible costs, fewer flights and a specialized job market.', factors:{
    cost:factor('Monthly living cost','€1,480',86,'Student demand affects the center, but overall costs remain manageable.'), rent:factor('Typical 1-bed rent','€820',84,'More space for the budget than Lisbon or Porto.'), work:factor('Employment','Moderate',60,'Strongest in education, healthcare and research.'), transport:factor('Public transport','Good',72,'The compact center is walkable; regional connections are useful.'), lifestyle:factor('Pace of life','Calm',92,'Academic energy without big-city intensity.'), climate:factor('Climate','Warm · seasonal',80,'Hotter summers and cooler nights than the coast.'), nature:factor('Access to nature','Very good',86,'Riverfront, forests and central mountain areas are within reach.'), airport:factor('Airport connections','Limited',48,'International flights require a rail or road trip to Porto or Lisbon.') } },
];

export const comparisonFactors = ['cost','rent','work','transport','lifestyle','climate','nature','airport'] as const;