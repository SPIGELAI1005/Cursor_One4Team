export type ActivityType = 'training' | 'class' | 'seminar' | 'workshop' | 'session' | 'course';

export type SportType = 'football' | 'basketball' | 'tennis' | 'volleyball' | 'handball' | 'karate' | 'swimming' | 'athletics' | 'gymnastics' | 'table tennis' | 'badminton' | 'hockey' | 'baseball' | 'rugby' | 'cricket';

export interface ClubConfig {
  activityType: ActivityType;
  activityTypePlural: string;
  activityTypeSingular: string;
  activityTypeDisplay: string;
  activityTypeDisplayPlural: string;
  primarySportType?: SportType;
  availableSportTypes?: SportType[];
  logo?: string; // URL to the club's custom logo
}

export const ACTIVITY_TYPE_OPTIONS = [
  { value: 'training', label: 'Training', singular: 'Training', plural: 'Trainings' },
  { value: 'class', label: 'Class', singular: 'Class', plural: 'Classes' },
  { value: 'seminar', label: 'Seminar', singular: 'Seminar', plural: 'Seminars' },
  { value: 'workshop', label: 'Workshop', singular: 'Workshop', plural: 'Workshops' },
  { value: 'session', label: 'Session', singular: 'Session', plural: 'Sessions' },
  { value: 'course', label: 'Course', singular: 'Course', plural: 'Courses' },
];

export const SPORT_TYPE_OPTIONS = [
  { value: 'football', label: 'Football/Soccer', icon: '⚽' },
  { value: 'basketball', label: 'Basketball', icon: '🏀' },
  { value: 'tennis', label: 'Tennis', icon: '🎾' },
  { value: 'volleyball', label: 'Volleyball', icon: '🏐' },
  { value: 'handball', label: 'Handball', icon: '🤾' },
  { value: 'karate', label: 'Karate/Martial Arts', icon: '🥋' },
  { value: 'swimming', label: 'Swimming', icon: '🏊' },
  { value: 'athletics', label: 'Athletics/Track', icon: '🏃' },
  { value: 'gymnastics', label: 'Gymnastics', icon: '🤸' },
  { value: 'table tennis', label: 'Table Tennis', icon: '🏓' },
  { value: 'badminton', label: 'Badminton', icon: '🏸' },
  { value: 'hockey', label: 'Hockey', icon: '🏒' },
  { value: 'baseball', label: 'Baseball', icon: '⚾' },
  { value: 'rugby', label: 'Rugby', icon: '🏉' },
  { value: 'cricket', label: 'Cricket', icon: '🏏' },
];

export function getActivityTypeConfig(activityType: ActivityType = 'training', primarySportType: SportType = 'football'): ClubConfig {
  const option = ACTIVITY_TYPE_OPTIONS.find(opt => opt.value === activityType) || ACTIVITY_TYPE_OPTIONS[0];
  
  return {
    activityType,
    activityTypePlural: option.plural,
    activityTypeSingular: option.singular,
    activityTypeDisplay: option.label,
    activityTypeDisplayPlural: option.plural,
    primarySportType,
    availableSportTypes: [primarySportType], // Default to just the primary sport
  };
}

export function getDefaultClubConfig(): ClubConfig {
  return getActivityTypeConfig('training', 'football');
}

// Helper functions for getting activity terminology
export function getActivityTerm(activityType: ActivityType = 'training', plural: boolean = false): string {
  const config = getActivityTypeConfig(activityType);
  return plural ? config.activityTypePlural : config.activityTypeSingular;
}

export function getActivityTermDisplay(activityType: ActivityType = 'training', plural: boolean = false): string {
  const config = getActivityTypeConfig(activityType);
  return plural ? config.activityTypeDisplayPlural : config.activityTypeDisplay;
}

// Helper functions for sport types
export function getSportTypeIcon(sportType: SportType): string {
  const option = SPORT_TYPE_OPTIONS.find(opt => opt.value === sportType);
  return option?.icon || '⚽'; // Default to football
}

export function getSportTypeLabel(sportType: SportType): string {
  const option = SPORT_TYPE_OPTIONS.find(opt => opt.value === sportType);
  return option?.label || 'Football/Soccer';
}

export function getSportTypeConfig(sportType: SportType) {
  return {
    value: sportType,
    label: getSportTypeLabel(sportType),
    icon: getSportTypeIcon(sportType),
  };
} 