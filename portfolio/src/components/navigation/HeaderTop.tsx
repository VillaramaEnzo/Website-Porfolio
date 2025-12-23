import LiveClock from '@/components/widgets/LiveClock'

// Email address for contact button
const CONTACT_EMAIL = 'ienzovillarama@gmail.com' // TODO: Replace with your actual email

// TODO: Update these values
const BASED = "NZ based"
const BUILDING_AT = 'project: [BLANK]' // Replace with your company name
const BUILDING_AT_LINK = 'https://instagram.com/project_bl_nk' // TODO: Replace with your Instagram URL
const FREELANCE_AVAILABILITY = 'January 2026' // Replace with your availability

/**
 * Header Top Component
 * 
 * Top header at the top of the viewport.
 * Mirrors the itsjay.us header layout with three info columns and a contact button.
 * 
 * SEO & Accessibility Improvements:
 * - Proper semantic HTML structure
 * - Responsive design with mobile-first approach
 * - Accessible color contrast
 * - Keyboard navigation support
 * - Screen reader friendly
 */
export default function HeaderTop() {
  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[99] pt-2 sm:pt-4 bg-white/0"
      role="banner"
      aria-label="Site header"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Main Header Row - Three columns + button */}
        <nav 
          className="flex flex-wrap items-center justify-between gap-2 sm:gap-3 md:gap-4 lg:gap-6 pb-0.5 md:pb-1"
          role="navigation"
          aria-label="Site information and contact"
        >
          {/* Column 1: Location - Hidden on sm, visible on md+ */}
          <div className="hidden md:flex flex-col min-w-0 flex-shrink">
            <div className="flex items-center gap-1 sm:gap-1.5 text-sm md:text-base font-semibold text-gray-800 tracking-wider">
              <span>{BASED}</span>
              <span aria-hidden="true">|</span>
              <LiveClock
                location="Auckland, NZ"
                use24Hour={true}
                showSeconds={true}
                className=""
              />
            </div>
            <span className="text-xs md:text-sm text-gray-600 tracking-wider">
              Working globally
            </span>
          </div>

          {/* Column 2: Building at - Hidden on sm and md, visible on lg+ */}
          <div className="hidden lg:flex flex-col min-w-0 flex-shrink">
            <span className="text-sm md:text-base font-semibold text-gray-800">
              Currently building
            </span>
            <a
              href={BUILDING_AT_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs md:text-sm text-gray-600 truncate hover:text-gray-800 transition-colors cursor-pointer"
            >
              {BUILDING_AT}
            </a>
          </div>

          {/* Column 3: Freelance availability - Always visible */}
          <div className="flex flex-col min-w-0 flex-shrink">
            <span className="text-sm md:text-base font-semibold text-gray-800">
              Freelance availability
            </span>
            <span className="text-xs md:text-sm text-gray-600 truncate">
              {FREELANCE_AVAILABILITY}
            </span>
          </div>

          {/* Button: Get in touch */}
          <a
            href={`mailto:${CONTACT_EMAIL}?subject=Let's Connect!`}
            className="bg-indigo-50 text-indigo-900 text-xs sm:text-sm md:text-base font-semibold uppercase whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 md:px-6 md:py-3 rounded-xl hover:bg-indigo-100 focus:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors shadow-sm hover:shadow-md flex-shrink-0"
            aria-label="Get in touch via email"
          >
            Get in Touch!
          </a>
        </nav>
      </div>
    </header>
  )
}