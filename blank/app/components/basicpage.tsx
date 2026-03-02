import ThemeToggle from './themetoggle'
import Links from './links'


function Layout() {

  return (
  
    <div className="flex flex-col xl:flex-row w-[95%] md:w-[90%] xl:w-[90%] h-[95%] md:h-[95%] xl:h-[90%] gap-4 xl:gap-6 py-4 xl:py-[10vh] justify-center">
    
      {/* Mobile/Tablet Header - visible below xl breakpoint */}
      <div className="flex xl:hidden w-full justify-between items-start mb-4">
        <ThemeToggle />
        <Links />
      </div>
    
      {/* Mobile Layout - visible below md breakpoint */}
      <div className="flex md:hidden flex-col w-full gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-xl pb-2">Hi, I&apos;m Enzo</h1>
          <p className="text-sm">Creative technologist exploring digital systems, identity, and self-directed work. Currently building project: BLANK.</p>
          <p className="text-sm">I live in Auckland, New Zealand. You can keep up with me on Instagram or feel free to send me an Email</p>
          <p className="text-sm">My new website portfolio is also under-construction.</p>
        </div>
        
        <div className="flex flex-col gap-2 mt-auto">
          <p className="text-lg">Got a project in mind?</p>
          <h1 className="text-4xl">Let&apos;s talk.</h1>
        </div>
      </div>
    
      {/* Tablet/Small Desktop Layout - visible between md and xl */}
      <div className="hidden md:flex xl:hidden flex-col w-full max-w-3xl mx-auto gap-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl lg:text-3xl pb-4">Hi, I&apos;m Enzo</h1>
          <p className="text-base">Creative technologist exploring digital systems, identity, and self-directed work. Currently building project: BLANK.</p>
          <p className="text-base">I live in Auckland, New Zealand. You can keep up with me on Instagram or feel free to send me an Email</p>
          <p className="text-base">My new website portfolio is also under-construction.</p>
        </div>
        
        <div className="flex flex-col gap-2 mt-auto">
          <p className="text-xl lg:text-2xl">Got a project in mind?</p>
          <h1 className="text-6xl lg:text-7xl">Let&apos;s talk.</h1>
        </div>
      </div>
    
      {/* Desktop Layout - visible only at xl and above */}
      <div className = "hidden xl:flex flex-col xl:flex-row w-full xl:w-[50%]">
        
        {/* Desktop ThemeToggle */}
        <div className = "flex flex-1 items-start justify-start"> 

          <ThemeToggle/>
        
        </div>
        
        <div className = "flex flex-col w-full xl:w-[60%] justify-between"> 

          <div className = "flex flex-col xl:flex-row xl:justify-between gap-4 xl:gap-0"> 
            
            <div className = "flex flex-col gap-4 w-full xl:w-[55%]">

              <h1 className = "text-2xl xl:text-2xl 2xl:text-3xl pb-4">Hi, I&apos;m Enzo</h1>
              <p className="text-base">Creative technologist exploring digital systems, identity, and self-directed work. Currently building project: BLANK.</p>
              <p className="text-base">I live in Auckland, New Zealand. You can keep up with me on Instagram or feel free to send me an Email</p>
              <p className="text-base">My new website portfolio is also under-construction. </p>

            </div>
            
            {/* Desktop Links */}
            <div>
              <Links/>
            </div>
            
          </div> 

          <div className = "flex flex-row justify-between items-end border gap-0"> 

            <div className = "flex flex-col"> 

              <p className = "text-xl 2xl:text-2xl">Got a project in mind?</p>
              <h1 className = "text-6xl 2xl:text-8xl">Let&apos;s talk.</h1>

            </div>

            <div> [arrow placeholder] </div> 

          </div>

        </div>
      </div>
    </div>
  
  )
}


export default function Page() {

  return (
   <Layout/>
  )
}
