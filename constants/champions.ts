export interface Champion {
  id: string;
  name: string;
  title: string;
  color: string;
}

export const CHAMPIONS: Champion[] = [
  { id: 'kaisa', name: "Kai'Sa", title: 'Daughter of the Void', color: '#9B59B6' },
  { id: 'volibear', name: 'Volibear', title: 'Relentless Storm', color: '#3498DB' },
  { id: 'jinx', name: 'Jinx', title: 'Loose Cannon', color: '#E91E63' },
  { id: 'darius', name: 'Darius', title: 'Hand of Noxus', color: '#C0392B' },
  { id: 'ahri', name: 'Ahri', title: 'Nine-Tailed Fox', color: '#FF6B9D' },
  { id: 'leesin', name: 'Lee Sin', title: 'Blind Monk', color: '#E67E22' },
  { id: 'yasuo', name: 'Yasuo', title: 'Unforgiven', color: '#5D6D7E' },
  { id: 'leona', name: 'Leona', title: 'Radiant Dawn', color: '#F1C40F' },
  { id: 'teemo', name: 'Teemo', title: 'Swift Scout', color: '#27AE60' },
  { id: 'viktor', name: 'Viktor', title: 'Herald of the Arcane', color: '#8E44AD' },
  { id: 'missfortune', name: 'Miss Fortune', title: 'Bounty Hunter', color: '#E74C3C' },
  { id: 'sett', name: 'Sett', title: 'The Boss', color: '#DC143C' },
];

export const DEFAULT_CHAMPION = CHAMPIONS[0];
