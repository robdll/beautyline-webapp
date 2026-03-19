export type HomeCourseCard = {
  title: string;
  imageSrc: string;
  href: string;
  /** CSS `object-position` for `object-fit: cover` (e.g. center a focal point). */
  imageObjectPosition?: string;
};

export const HOME_COURSE_CARDS: HomeCourseCard[] = [
  {
    title: 'Corsi Unghie',
    imageSrc: '/images/card-1.jpg',
    href: '/corsi',
  },
  {
    title: 'Corsi Occhi',
    imageSrc: '/images/card-2.png',
    href: '/corsi',
    // Source art has the eye toward the right; bias crop so the eye sits nearer the card center.
    imageObjectPosition: '72% 38%',
  },
  {
    title: 'Percorsi Master',
    imageSrc: '/images/card-3.png',
    href: '/corsi',
  },
];

