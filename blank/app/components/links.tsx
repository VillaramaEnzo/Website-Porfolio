import getIcon from "../utils/getIcon";
import { links, socialLink } from "../utils/text";

export default function Links() {
  return (
    <nav aria-label="Social media links">
      <div className="flex flex-col gap-4 lg:gap-8 2xl:gap-10 items-end">

        {links.map((link: socialLink) => (
            <a 
            key={link.href} 
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="rounded-md hover:bg-background hover:text-foreground hover:scale-150 transition-transform duration-200"
            title={link.label}
            >
            {getIcon(link.icon, 'text-2xl lg:text-3xl 2xl:text-4xl')}
            </a>
        ))}
      </div>
    </nav>
  );
}

