import type { CourseType } from '@/lib/course-types';
import type { EquipmentType } from '@/lib/equipment-types';

export type HomeCourseCard = {
  title: string;
  imageSrc: string;
  href: string;
  openInNewTab?: boolean;
  /** CSS `object-position` for `object-fit: cover` (e.g. center a focal point). */
  imageObjectPosition?: string;
  /** Per modal elenco corsi su /corsi (mode typeModal). */
  courseType?: CourseType;
};

export const HOME_COURSE_CARDS: HomeCourseCard[] = [
  {
    title: 'Corsi Unghie',
    imageSrc: '/images/card-1.jpg',
    href: '/corsi',
    courseType: 'unghie',
  },
  {
    title: 'Corsi Occhi',
    imageSrc: '/images/card-2.png',
    href: '/corsi',
    courseType: 'occhi',
    // Source art has the eye toward the right; bias crop so the eye sits nearer the card center.
    imageObjectPosition: '72% 38%',
  },
  {
    title: 'Percorsi Master',
    imageSrc: '/images/percorsi.webp',
    href: 'https://percorsomaster.it',
    openInNewTab: true,
  },
];

/** Corsi page — “I Nostri Corsi”: solo Unghie e Occhi (senza Percorsi Master). */
export const CORSI_UNGHIE_OCCHI_CARDS: HomeCourseCard[] = [
  { ...HOME_COURSE_CARDS[0], courseType: 'unghie' },
  { ...HOME_COURSE_CARDS[1], courseType: 'occhi' },
];

export type EquipmentHighlightCard = {
  title: string;
  imageSrc: string;
  href: string;
  imageObjectPosition?: string;
  equipmentType: EquipmentType;
};

/** Sezione “Attrezzature e Tecnologie” su /attrezzature — modal catalogo per categoria. */
export const ATTREZZATURE_HIGHLIGHT_CARDS: EquipmentHighlightCard[] = [
  {
    title: 'Trattamenti Viso',
    imageSrc: '/images/attrezzature-1.webp',
    href: '/attrezzature',
    equipmentType: 'viso',
  },
  {
    title: 'Trattamenti Corpo',
    imageSrc: '/images/attrezzature-2.webp',
    href: '/attrezzature',
    equipmentType: 'corpo',
  },
  {
    title: 'Epilazione',
    imageSrc: '/images/attrezzature-3.webp',
    href: '/attrezzature',
    equipmentType: 'epilazione',
  },
  {
    title: 'Multifunzione',
    imageSrc: '/images/attrezzature-4.webp',
    href: '/attrezzature',
    equipmentType: 'multifunzione',
  },
];

