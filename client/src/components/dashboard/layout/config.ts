import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
  { key: 'addsite', title: 'Add Site', href: paths.dashboard.addsite, icon: 'plus-circle' },
  { key: 'allsites', title: 'Manage Sites', href: paths.dashboard.allsites, icon: 'browsers' },
  { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
] satisfies NavItemConfig[];
