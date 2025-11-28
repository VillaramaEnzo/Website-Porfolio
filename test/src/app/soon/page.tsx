/* 
Coming Soon Page

- Will be a page that is automatically redirected if a page is coming soon / work in progress
- Will just be a staic page with a video background
- Will have a button to go back to the home page
- Just a page I can manually redirect 

*/

import ComingSoon from '@/components/Widgets/ComingSoon'

export default function Soon() {
  return (
    <div className="flex items-center justify-center w-screen h-screen">
      <ComingSoon />
    </div>
  )
}