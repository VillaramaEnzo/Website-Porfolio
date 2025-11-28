
// Personal Details
export const details = {

  firstName: "Enzo",
  lastName: "Villarama",
  title: "Designer • Programmer",
  currentLocation: "Auckland, NZ" 

}


export const whatDoText = "While others make magic by creating new worlds, I create wonder by taking the world and making it more real." 


// Define the preloader texts and their durations
export const preloaderTexts = [
  { text: "Downloading project.exe", duration: 1000 },
  { text: "Loading [Insert Project Name]", duration: 1000 },
  { text: "Running blank.app", duration: 500 },
  { text: "Preparing [BLANK]", duration: 500 },
  { text: "Starting app", duration: 500 }
]

// Test phrases for the scramble text
export const testPhrases = [
  "Something Interesting will go here...",
  "... Fucking speechless...",
  "AI is supposed to help me but it hasn't.",
  "I'm not a robot, I'm a human.",
  "Getting an anurism from this Garbage...",
  "AI is supposed to learn from what I give it, but it hasn't been...",
  "It keeps giving me worse and worse results...",
  "It astonishes me how it continues to get worse sometimes...",
  "It's like I'm speaking to a wall...",
  "Can't wait for the day it actually helps me without me having to ask a hundred times..."
]

// Phrases for the scramble text in the header
export const phrases = [
    "Hey there! Welcome to my corner of the internet (｡◕ᴗ◕｡)੭",
    "Feel free to explore and have fun!",
    "Thanks for stopping by (◕‿↼)",
    "I'm always down for a chat, so email or DM me for anything",
    "You'll find me drinking boba, or scribbling on my iPad (or both)",
    "I only code when I have to; just like how I coded this website",
    "I'm not your typical Webflow or Framer developer. I ain't that basic.",
    "Down to chat if you like anime, cars and girls (not necessarily in that order)",
    "I gym regularly, (just on hiatus currently)", 
    "I used to be a gamer, was pretty good at Halo, but I don't have time for that anymore (ಥ﹏ಥ)",
    "Am not some copycat, conformist simpleton, I have my own style",
    "Apparently I'm also too nice, I can't stand ghosting, so don't be surprised if you get a reply",
    "Cause the truth is I'm actually never free, I just make the time.",
    "BTW, hover over the logo for a lil fun (nᴗn)✌︎︎",
    "Feel free to reach out if you want to collaborate!",
    "See ya later! (੭˃ᴗ˂)੭"
  ]

 // Texts for the landing page, depending on the audience
export const audienceTexts = [
  { 
    audience: "For anyone", 
    text: "Hello there, I'm just a boy chasing my dreams; And I'm glad you're here to see it.",
    image: {
      src: "https://picsum.photos/seed/anyone-but-you/1440/848",
      alt: "Anyone but you",
      className: "object-cover",
    }
  },
  { 
    audience: "Recruiters", 
    text: "I'm a skilled designer with a passion for creating impactful user experiences.",
    image: {
      src: "https://picsum.photos/seed/recruiters/1440/848",
      alt: "Recruiters",
      className: "object-cover",
    }
  },
  { 
    audience: "Design Directors", 
    text: "I bring a unique blend of creativity and strategic thinking to every project.",
    image: {
      src: "https://picsum.photos/seed/directors/1440/848",
      alt: "Directors",
      className: "object-cover",
    }
  },
  { 
    audience: "Product Designers", 
    text: "I specialise in crafting intuitive and visually appealing product designs.",
    image: {
      src: "https://picsum.photos/seed/designers/1440/848",
      alt: "Designers",
      className: "object-cover",
    }
  },
  { 
    audience: "Product Managers", 
    text: "I collaborate effectively to turn product visions into stunning realities.",
    image: {
      src: "https://picsum.photos/seed/managers/1440/848",
      alt: "Managers",
      className: "object-cover",
    }
  },
  { 
    audience: "Engineers", 
    text: "I create designs that are not just beautiful, but also implementable and user-friendly.",
    image: {
      src: "https://picsum.photos/seed/engineers/1440/848",
      alt: "Engineers",
      className: "object-cover",
    }
  }
  
]

// Socials Metadata
// ------------------------------------------------------------
export interface HeaderLink {
  href: string
  icon: string
  label: string
  subtext: string
}


// Eventually handle this better for privacy reasons
const ig = "___e_vil"
const linkedin = "enzo-villarama"
const github = "VillaramaEnzo"


export const links: HeaderLink[] = [
  {
    href: `https://www.instagram.com/${ig}`,
    icon: "instagram",
    label: "Instagram",
    subtext: "Followers welcome"
  },
  {
    href: `https://www.linkedin.com/in/${linkedin}`,
    icon: "linkedin",
    label: "LinkedIn",
    subtext: "Connect with me"
  },
  {
    href: `https://github.com/${github}`,
    icon: "github",
    label: "GitHub",
    subtext: "Peek my code"
  },
  {
    href: "/cv.pdf",
    icon: "document",
    label: "Resume",
    subtext: "Download PDF"
  }
]

// ------------------------------------------------------------