import sample from 'lodash/sample';

export const NAMES: string[] = [
  'Goob',
  'Goobers',
  'Goomba',
  'Goomba Roomba',
  'Gom Goms',
  'Gruber',
  'Gub Gubs',
  'Groombers',
  'Gubbers',
  'Goobus',
  'Glombus',
  'Gorbus',
  'Gobble Gops',
  'Gobble Gooks',
];

export const getRandomName = () => sample(NAMES) ?? 'Goob';
