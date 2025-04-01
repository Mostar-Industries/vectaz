
// Functions for intent classification and entity extraction

export function classifyIntent(query: string, trainingData?: any): string {
  const query_lower = query.toLowerCase();
  
  // Enhanced intent classification with more fine-grained categories
  if (/risk|disrupt|delay|fail|hazard|danger|problem/.test(query_lower)) return "query_risk";
  if (/forwarder|carrier|freight|perform|ship|transport|logistics provider/.test(query_lower)) return "query_forwarder";
  if (/warehouse|storage|facility|origin|stock|inventory|fulfillment/.test(query_lower)) return "query_warehouse";
  if (/cost|price|expense|budget|save|money|financial|economic/.test(query_lower)) return "query_cost";
  if (/route|corridor|path|lane|journey|transit|way|travel/.test(query_lower)) return "query_route";
  if (/trend|pattern|history|time|development|progress|evolution/.test(query_lower)) return "query_trends";
  if (/compare|versus|vs|against|difference|better|worse/.test(query_lower)) return "query_comparison";
  if (/improve|optimize|recommend|suggest|enhance|better|advise/.test(query_lower)) return "query_recommendations";
  if (/why|reason|cause|explain|rationale|analysis|root cause/.test(query_lower)) return "query_explanation";
  if (/how|process|method|approach|strategy|procedure|step/.test(query_lower)) return "query_how";
  if (/when|time|schedule|date|deadline|eta|arrival/.test(query_lower)) return "query_when";
  if (/which|choose|select|pick|decision|option|alternative/.test(query_lower)) return "query_which";
  
  return "query_general";
}

export function extractEntities(query: string, trainingData?: any): Record<string, any> {
  const entities: Record<string, any> = {};
  const query_lower = query.toLowerCase();
  
  // Extract country entities with a more comprehensive list
  const countryPatterns = [
    /\b(kenya|ethiopia|zimbabwe|tanzania|uganda|south africa|nigeria|somalia|mozambique|malawi|zambia)\b/gi,
    /\b(south sudan|sudan|rwanda|burundi|drc|congo|djibouti|eritrea|egypt|ghana)\b/gi
  ];
  
  for (const pattern of countryPatterns) {
    const countryMatches = query_lower.match(pattern);
    if (countryMatches) {
      entities.countries = entities.countries || [];
      entities.countries = [
        ...entities.countries,
        ...countryMatches.map(c => c.toLowerCase())
      ];
    }
  }
  
  // Extract forwarder entities with an expanded list
  const forwarderPatterns = [
    /\b(dhl|kenya airways|kuehne nagel|maersk|fedex|ups|bwosi|agl|siginon)\b/gi,
    /\b(frieght in time|freight in time|scan global|agility|db schenker|bolloré|expeditors)\b/gi
  ];
  
  for (const pattern of forwarderPatterns) {
    const forwarderMatches = query_lower.match(pattern);
    if (forwarderMatches) {
      entities.forwarders = entities.forwarders || [];
      entities.forwarders = [
        ...entities.forwarders,
        ...forwarderMatches.map(f => f.toLowerCase())
      ];
    }
  }
  
  // Extract timeframe entities with more variations
  const timeframeMap = {
    "last month": "last_month",
    "previous month": "last_month",
    "last 30 days": "last_month",
    "last quarter": "last_quarter",
    "previous quarter": "last_quarter",
    "last 3 months": "last_quarter",
    "last year": "last_year",
    "previous year": "last_year",
    "last 12 months": "last_year",
    "year to date": "ytd",
    "ytd": "ytd",
    "this year": "ytd",
    "last week": "last_week",
    "previous week": "last_week",
    "last 7 days": "last_week"
  };
  
  for (const [phrase, value] of Object.entries(timeframeMap)) {
    if (query_lower.includes(phrase)) {
      entities.timeframe = value;
      break;
    }
  }
  
  // Extract metric entities with more granular categories
  const metricPatterns = {
    cost: /\b(cost|price|expense|budget|money|financial|economic|dollar|usd)\b/,
    time: /\b(time|duration|transit|delay|speed|fast|slow|quick|eta|arrival)\b/,
    reliability: /\b(reliability|success|consistent|dependable|predictable|trustworthy)\b/,
    risk: /\b(risk|danger|hazard|threat|disruption|problem|issue)\b/,
    volume: /\b(volume|quantity|amount|weight|mass|tonnage|size)\b/,
    quality: /\b(quality|standard|grade|rating|performance|effectiveness)\b/
  };
  
  for (const [metric, pattern] of Object.entries(metricPatterns)) {
    if (pattern.test(query_lower)) {
      entities.metric = entities.metric || [];
      if (!entities.metric.includes(metric)) {
        entities.metric.push(metric);
      }
    }
  }
  
  // Extract mode entities
  const modePatterns = {
    air: /\b(air|flight|plane|aircraft)\b/,
    road: /\b(road|truck|vehicle|land|drive)\b/,
    sea: /\b(sea|ocean|ship|vessel|maritime)\b/,
    rail: /\b(rail|train|track|railway)\b/
  };
  
  for (const [mode, pattern] of Object.entries(modePatterns)) {
    if (pattern.test(query_lower)) {
      entities.mode = entities.mode || [];
      if (!entities.mode.includes(mode)) {
        entities.mode.push(mode);
      }
    }
  }
  
  // Return the enhanced entities
  return entities;
}
