import ThemeToggle from './themetoggle'
import Links from './links'



function Layout() {
  return (

    <div className="flex w-[90%] h-[90%] gap-6 py-[10vh] border">

      <div className = "flex flex-1 items-start justify-end pr-[5vw]"> 

          <div className = "">
        
            <ThemeToggle />
        
          </div> 
    
      </div>
    
    
      <div className = "flex flex-col h-full w-[40%] justify-between border"> 

        <div className = "flex justify-between gap-4"> 

          <div className = "flex flex-col gap-4 w-[60%]">

            <h1 className = "text-2xl pb-4">Hi, I&apos;m Enzo</h1>
            <p>Creative technologist exploring digital systems, identity, and self-directed work. Currently building project: BLANK.</p>
            <p>I live in Auckland, New Zealand. You can keep up with me on Instagram or feel free to send me an Email</p>
            <p>My new website portfolio is also under-construction. </p>

          </div>
        
          <div className = "flex justify-end">
            <Links />
          </div>
        
        </div>

        <div className = "justify-end flex flex-col border"> 
          <p className = "text-2xl">Got a project in mind?</p>
          <h1 className = "text-8xl">Let&apos;s talk.</h1>
        </div>

      </div>
      
      <div className = "flex flex-1"/> 
    
    </div>


  )
}


function Layout2() {

  return (
  
    <div className="flex w-[90%] h-[90%] gap-6 py-[10vh] justify-center">
    
      <div className = "flex w-[50%]">
        
        <div className = "flex flex-1 items-start"> 

          <ThemeToggle/>
        
        </div>
        
        <div className = "flex flex-col w-[60%] justify-between"> 

          <div className = "flex justify-between"> 
            
            <div className = "flex flex-col gap-4 w-[55%]">

              <h1 className = "text-2xl pb-4">Hi, I&apos;m Enzo</h1>
              <p>Creative technologist exploring digital systems, identity, and self-directed work. Currently building project: BLANK.</p>
              <p>I live in Auckland, New Zealand. You can keep up with me on Instagram or feel free to send me an Email</p>
              <p>My new website portfolio is also under-construction. </p>

            </div>
            
            <Links/>
            
          </div> 

          <div className = "flex justify-between border"> 

            <div className = "flex flex-col"> 

              <p className = "text-2xl">Got a project in mind?</p>
              <h1 className = "text-8xl">Let&apos;s talk.</h1>

            </div>

            <div> arrow </div> 

          </div>

        </div>
      </div>
    </div>
  
  )
}


export default function Page() {

  return (
   <Layout2/>
  )
}
