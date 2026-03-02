// Socials Metadata
// ------------------------------------------------------------
export interface socialLink {
    href: string
    icon: string
    label: string
  }
  
  // Eventually handle this better for privacy reasons
  const ig = "___e_vil"
  const linkedin = "enzo-villarama"
  const github = "VillaramaEnzo"
  const linktree = "___e_vil"

  export const links: socialLink[] = [
    {
      href: `https://www.instagram.com/${ig}`,
      icon: "instagram",
      label: "Instagram",
    },
    {
      href: `https://www.linkedin.com/in/${linkedin}`,
      icon: "linkedin",
      label: "LinkedIn",
    },
    {
      href: `https://github.com/${github}`,
      icon: "github",
      label: "GitHub"
    },
    {
      href: `https://linktr.ee/${linktree}`,
      icon: "linktree",
      label: "Linktree",
    }
  ]

export const aboutMe = {

  name: "Enzo Villarama",
  title: "Creative Design Engineer",
  description: "I'm a creative design engineer with a passion for creating impactful user experiences.",
  skills: [
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe InDesign",
    "Adobe XD",
  ],
  interests: [
    "Design",
    "Development",
    "Art",
    "Music",
    "Travel",
    "Food",
  ],
  hobbies: [
    "Photography",
    "Videography",
    "Music Production",
    "Travel",
    "Food",
  ]

}
