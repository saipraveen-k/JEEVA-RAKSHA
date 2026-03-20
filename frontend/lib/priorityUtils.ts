export interface PriorityConfig {
  highKeywords: string[];
  mediumKeywords: string[];
  lowKeywords: string[];
}

export const PRIORITY_CONFIG: PriorityConfig = {
  highKeywords: [
    'emergency', 'urgent', 'critical', 'danger', 'injury', 'wounded', 'bleeding',
    'attack', 'attacked', 'hit', 'car accident', 'vehicle', 'injured', 'pain',
    'sick', 'ill', 'dying', 'death', 'dead', 'severe', 'broken', 'fracture',
    'poison', 'poisoned', 'strangled', 'choking', 'starving', 'malnourished'
  ],
  mediumKeywords: [
    'trapped', 'stuck', 'lost', 'abandoned', 'scared', 'frightened', 'cold',
    'wet', 'shivering', 'hungry', 'thirsty', 'weak', 'tired', 'exhausted',
    'sick', 'illness', 'disease', 'infection', 'wound', 'cut', 'scratch',
    'limping', 'lame', 'hurt', 'unwell', 'distressed', 'distress'
  ],
  lowKeywords: [
    'small', 'minor', 'little', 'tiny', 'normal', 'routine', 'checkup',
    'vaccination', 'vaccine', 'food', 'water', 'shelter', 'homeless',
    'stray', 'wander', 'play', 'happy', 'healthy', 'fine', 'ok', 'okay'
  ]
};

export const getPriorityFromDescription = (description: string): string => {
  if (!description || typeof description !== 'string') {
    return 'medium';
  }

  const lowerDesc = description.toLowerCase();
  
  // Check for high priority keywords
  for (const keyword of PRIORITY_CONFIG.highKeywords) {
    if (lowerDesc.includes(keyword)) {
      return 'high';
    }
  }

  // Check for medium priority keywords
  for (const keyword of PRIORITY_CONFIG.mediumKeywords) {
    if (lowerDesc.includes(keyword)) {
      return 'medium';
    }
  }

  // Check for low priority keywords
  for (const keyword of PRIORITY_CONFIG.lowKeywords) {
    if (lowerDesc.includes(keyword)) {
      return 'low';
    }
  }

  // Default to medium if no keywords match
  return 'medium';
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return '#ef4444'; // Red
    case 'medium':
      return '#f97316'; // Orange
    case 'low':
      return '#eab308'; // Yellow
    default:
      return '#94a3b8'; // Gray
  }
};

export const getPriorityTextColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return '#fee2e2'; // Light red
    case 'medium':
      return '#fed7aa'; // Light orange
    case 'low':
      return '#fde68a'; // Light yellow
    default:
      return '#e5e7eb'; // Light gray
  }
};

export const getPriorityLabel = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'HIGH';
    case 'medium':
      return 'MEDIUM';
    case 'low':
      return 'LOW';
    default:
      return 'UNKNOWN';
  }
};