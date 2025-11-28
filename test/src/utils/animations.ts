export const intitialFadeIn = {
    duration: 1.2,
    ease: "easeInOut",
    delay: 0
    // Used for
    // SectionNav
}


export const welcomeFadeIn = {
    // Welcome text fade in

    variants: {
        initial: { opacity: 0, y: "-5vw" },
        animate: { opacity: 1, y: ["-5vw", "5vw" ,"0vw"] },
        exit: { opacity: 0, y: "-5vw" }
    },

    transition: {
       ...intitialFadeIn,
       staggerChildren: 0.2
    }
}
