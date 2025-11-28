import { usePathname } from 'next/navigation'
import Header from '@/components/Widgets/Header/Header'
import { VALID_ROUTES, DYNAMIC_ROUTES } from '@/utils/routes'


export default function HeaderProvider() {
  const pathname = usePathname()
  
  // Split path into segments
  const segments = pathname?.split('/').filter(Boolean) || [];
  
  // Check if path is valid
  const isNotFound = segments.some((segment, index) => {
    // Check if segment is a valid static route
    if (VALID_ROUTES.includes(segment)) return false;
    
    // Check if segment is a valid dynamic route parameter
    const parentSegment = segments[index - 1];
    if (parentSegment && DYNAMIC_ROUTES[parentSegment as keyof typeof DYNAMIC_ROUTES]?.includes(segment)) {
      return false;
    }
    
    return true;
  });
  
  return !isNotFound ? <Header /> : null;
} 