import { ImageSourcePropType } from 'react-native';

export interface Champion {
  id: string;
  name: string;
  title: string;
  color: string;
  image?: ImageSourcePropType;
}

// Gen-Z aesthetic colors - bold pastels and vibrant tones
export const CHAMPIONS: Champion[] = [
  { id: 'kaisa', name: "Kai'Sa", title: 'Daughter of the Void', color: '#B8A9E8', image: require('../assets/champions/kaisa.png') }, // Soft lavender
  { id: 'volibear', name: 'Volibear', title: 'Relentless Storm', color: '#7EC8E3', image: require('../assets/champions/volibear.png') }, // Sky blue
  { id: 'jinx', name: 'Jinx', title: 'Loose Cannon', color: '#FF8FAB', image: require('../assets/champions/jinx.png') }, // Bubblegum pink
  { id: 'darius', name: 'Darius', title: 'Hand of Noxus', color: '#E85D75', image: require('../assets/champions/darius.png') }, // Bold coral
  { id: 'ahri', name: 'Ahri', title: 'Nine-Tailed Fox', color: '#FFB5C5', image: require('../assets/champions/ahri.png') }, // Soft rose
  { id: 'leesin', name: 'Lee Sin', title: 'Blind Monk', color: '#FFB347' }, // Warm orange
  { id: 'yasuo', name: 'Yasuo', title: 'Unforgiven', color: '#6B8E8E' }, // Sage teal
  { id: 'leona', name: 'Leona', title: 'Radiant Dawn', color: '#FFE066' }, // Sunny yellow
  { id: 'teemo', name: 'Teemo', title: 'Swift Scout', color: '#77DD77' }, // Mint green
  { id: 'viktor', name: 'Viktor', title: 'Herald of the Arcane', color: '#9B7EDE' }, // Electric purple
  { id: 'missfortune', name: 'Miss Fortune', title: 'Bounty Hunter', color: '#FF6B6B' }, // Bright red
  { id: 'sett', name: 'Sett', title: 'The Boss', color: '#2ECC87' }, // Bold emerald
  { id: 'annie', name: 'Annie', title: 'Dark Child', color: '#E74C3C', image: require('../assets/champions/annie.png') }, // Fiery red
];

export const DEFAULT_CHAMPION = CHAMPIONS[0];
