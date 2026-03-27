'use client'

interface ParagraphData {
  text?: string
  link?: { text: string; href: string }
  textAfter?: string
  link2?: { text: string; href: string }
  textAfter2?: string
}

interface IntroContentProps {
  greeting: string
  paragraphs: (string | ParagraphData)[]
  greetingClassName?: string
  paragraphClassName?: string
}

export function IntroContent({ 
  greeting, 
  paragraphs, 
  greetingClassName = '',
  paragraphClassName = ''
}: IntroContentProps) {
  return (
    <>
      <h1 className={greetingClassName} style={{ fontWeight: 600 }}>{greeting}</h1>
      {paragraphs.map((paragraph, index) => {
        if (typeof paragraph === 'string') {
          return (
            <p key={index} className={paragraphClassName}>
              {paragraph}
            </p>
          )
        }
        
        return (
          <p key={index} className={paragraphClassName}>
            {paragraph.text}
            {paragraph.link && (
              <a 
                href={paragraph.link.href}
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontWeight: 600 }}
                className="animated-underline cursor-pointer"
              >
                {paragraph.link.text}
              </a>
            )}
            {paragraph.textAfter}
            {paragraph.link2 && (
              <a 
                href={paragraph.link2.href}
                style={{ fontWeight: 600 }}
                className="animated-underline cursor-pointer"
              >
                {paragraph.link2.text}
              </a>
            )}
            {paragraph.textAfter2}
          </p>
        )
      })}
    </>
  )
}

interface CTAContentProps {
  prompt: string
  heading: string
  promptClassName?: string
  headingClassName?: string
}

export function CTAContent({ 
  prompt, 
  heading, 
  promptClassName = '',
  headingClassName = ''
}: CTAContentProps) {
  return (
    <>
      <p className={promptClassName}>{prompt}</p>
      <h1 className={headingClassName}>{heading}</h1>
    </>
  )
}
