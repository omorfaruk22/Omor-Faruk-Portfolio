export type Project = {
  slug: string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  github: string;
  serverGithub?: string;
  live: string;
  category: string;
  highlights: string[];
  challenges: string[];
  improvements: string[];
};

// Replace image, github and live placeholders with your own project assets and URLs.
export const projects: Project[] = [
  {
    slug: 'salonbook',
    title: 'SalonBook',
    description:
      'A full-stack salon booking platform where customers discover services, book appointments and track payments, while administrators manage salon operations.',
    image: '/projects/salonbook.png',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Better Auth', 'Stripe', 'ImgBB'],
    github: 'https://github.com/omorfaruk22/Salon-book-client',
    serverGithub: 'https://github.com/omorfaruk22/Salon-book-server',
    live: 'https://salon-book-client-8wvq.vercel.app/',
    category: 'Full Stack',
    highlights: [
      'Built a responsive customer experience for browsing, searching, filtering and sorting salon services.',
      'Added appointment booking and management, plus customer and administrator dashboards.',
      'Created admin tools for managing services, customers, appointments and transactions.',
      'Integrated email/password and Google authentication with Better Auth.',
      'Integrated Stripe Checkout with webhook-based payment status updates and MongoDB-backed data storage.',
    ],
    challenges: [
      'Coordinating appointment and payment state across customer and admin workflows.',
      'Designing a consistent booking experience across desktop and mobile screens.',
    ],
    improvements: [
      'Add a live demo link when one is available.',
      'Expand appointment notifications and reporting for salon administrators.',
    ],
  },
  {
    slug: 'studio-space',
    title: 'StudioSpace',
    description:
      'A peer-to-peer marketplace for discovering, booking and sharing creative workspaces, with tools for both studio hosts and customers.',
    image: '/projects/studiospace.png',
    technologies: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Express', 'Better Auth', 'MongoDB', 'Mongoose', 'Vercel', 'Render'],
    github: 'https://github.com/omorfaruk22/Studio-Space',
    live: 'https://studio-space-phi.vercel.app/',
    category: 'Full Stack',
    highlights: [
      'Built studio discovery with search, location, category, price, capacity, amenities and sorting filters.',
      'Added email/password and Google sign-in, protected host and customer areas, and host listing management.',
      'Implemented booking requests, availability, cancellation, host decisions and overlap protection for confirmed bookings.',
      'Integrated SSLCommerz hosted checkout with server-side transaction validation.',
      'Added wishlists, downloadable booking summaries, theme switching and responsive loading, empty and error states.',
    ],
    challenges: [
      'Preventing overlapping confirmed bookings while coordinating booking requests and host decisions.',
      'Connecting client and API authentication, checkout validation and MongoDB data across separate deployments.',
    ],
    improvements: [
      'Configure SMTP settings to enable booking and payment email delivery.',
      'Connect newsletter signups to an email campaign service and add more studio imagery.',
    ],
  },
  {
    slug: 'bazardor',
    title: 'BazarDor',
    description:
      'An essential commodity price tracker that helps visitors explore product prices, compare changes and follow market updates.',
    image: '/projects/bazardor.png',
    technologies: [
      'Next.js 14',
      'TypeScript',
      'Tailwind CSS',
      'Better Auth',
      'MongoDB Atlas',
    ],
    github: 'https://github.com/omorfaruk22/bazardor',
    live: 'https://bazardor-omega.vercel.app/',
    category: 'Full Stack',
    highlights: [
      'Built with the Next.js App Router and responsive layouts for product discovery.',
      'Added a live infinite-scroll price ticker and sections for rising, falling and all product prices.',
      'Implemented email/password, Google and GitHub sign-in with Better Auth, profile updates and protected /product/[slug] routes.',
      'Added category filters, price sorting with Bangla numeral handling, skeleton loaders, toast feedback and a 404 page.',
    ],
    challenges: [
      'Keeping price changes easy to scan across several product groups while making the interface work on small screens.',
      'Handling Bangla numerals consistently when sorting prices and protecting product detail pages behind authentication.',
    ],
    improvements: [
      'Add a price history chart and configurable alerts when a product crosses a target price.',
      'Expand the product catalogue and add clear data-source and last-updated information.',
    ],
  },
  {
    slug: 'fitlog',
    title: 'FitLog – Workout Library',
    description:
      'A dark, responsive workout library with exercise details and a personal plan for organizing saved workouts.',
    image: '/projects/fitlog.png',
    technologies: [
      'Next.js 15',
      'TypeScript',
      'Tailwind CSS',
      'React',
      'FitLog API',
      'localStorage',
    ],
    github: 'https://github.com/omorfaruk22/FitLog--Workout-Library',
    live: 'https://assignment-006-chi.vercel.app/',
    category: 'Frontend',
    highlights: [
      'Loads workout data from the FitLog API and presents exercise specifications and instructions on detail pages.',
      'Created a My Plan page with Today’s Plan and Saved tabs, plus exercise, time and calorie metrics.',
      'Supports sorting by duration, calories or rating and persists plans with localStorage.',
      'Includes toast notifications, loading states and error handling.',
    ],
    challenges: [
      'Presenting API-loaded workouts with useful loading and error states while keeping browsing responsive.',
      'Keeping saved and daily plans available across reloads with browser storage.',
    ],
    improvements: [
      'Add user accounts and cloud sync so plans follow the visitor across devices.',
      'Add weekly progress summaries, custom workout creation and accessibility-focused exercise media.',
    ],
  },
  {
    slug: 'library-management-system',
    title: 'Library Management System',
    description:
      'A full-stack library management application built with Next.js, MongoDB and authenticated access.',
    image: '/projects/library-management.png',
    technologies: [
      'Next.js',
      'TypeScript',
      'Tailwind CSS',
      'MongoDB Atlas',
      'Mongoose',
      'Auth.js',
    ],
    github: 'https://github.com/omorfaruk22/library-management-system',
    live: 'https://library-management-system.vercel.app/',
    category: 'Full Stack',
    highlights: [
      'Built as a full-stack application with the Next.js App Router.',
      'Uses MongoDB Atlas with Mongoose for data persistence.',
      'Uses Auth.js to provide authenticated access.',
    ],
    challenges: [
      'Connecting the application routes and MongoDB data layer cleanly in a full-stack Next.js project.',
      'Making authenticated access work consistently across protected application views.',
    ],
    improvements: [
      'Add role-based librarian and member workflows, borrowing and return records, and due-date reminders.',
      'Add search, filtering, pagination and reporting as the catalogue grows.',
    ],
  },
  {
    slug: 'movie-explorer',
    title: 'Movie Explorer',
    description:
      'A responsive movie browsing web application built with React and Vite, and deployed on Vercel.',
    image: '/projects/movie-explorer.png',
    technologies: ['React.js', 'Vite', 'JavaScript', 'Vercel'],
    github: 'https://github.com/omorfaruk22/Movie-Explore',
    live: 'https://movie-explore-tawny.vercel.app/',
    category: 'Frontend',
    highlights: [
      'Built a responsive movie browsing experience with React and Vite.',
      'Deployed the application on Vercel.',
    ],
    challenges: [
      'Keeping movie discovery clear and usable across desktop and mobile screen sizes.',
      'Preparing a lightweight frontend build and deployment workflow with Vite and Vercel.',
    ],
    improvements: [
      'Add movie search, genre filters, sorting and a dedicated movie details view.',
      'Add watchlists, loading and empty states, and keyboard-accessible browsing controls.',
    ],
  },
];

export function isPlaceholderUrl(url: string) {
  return url.includes('your-username') || url.includes('your-project');
}
