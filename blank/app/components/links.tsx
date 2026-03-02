import getIcon from "../utils/getIcon";
import { links, socialLink } from "../utils/text";

export default function Links() {
  return (
    <div className="flex flex-row xl:flex-col gap-4 xl:gap-8 2xl:gap-10 items-center xl:items-end">

        {links.map((link: socialLink) => (
            <a 
            key={link.href} 
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="rounded-md hover:bg-background hover:text-foreground hover:scale-150 transition-transform duration-200"
            title={link.label}
            >
            {getIcon(link.icon, 'text-2xl xl:text-3xl 2xl:text-4xl')}
            </a>
        ))}
    </div>
  );
}

