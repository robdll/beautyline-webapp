/**
 * Voce di navigazione (Navbar / footer / mobile menu).
 * `children` opzionale per gestire i sotto-menu di servizi.
 */
export interface NavigationItem {
  label: string;
  href: string;
  children?: NavigationItem[];
}
