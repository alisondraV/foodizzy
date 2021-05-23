export type Color = 'light-peach' | 'light-green' | 'light-yellow';

import tailwind from '../../../tailwind.config';
export const colors: string[] = Object.values(tailwind.theme.colors);
