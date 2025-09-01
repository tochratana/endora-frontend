import Link from "next/link";
import { Github, Linkedin, Globe } from "lucide-react";

type SocialLinksProps = {
  portfolio?: string;
  github?: string;
  linkedin?: string;
  className?: string;
  iconClassName?: string;
};

export default function SocialLinks({
  portfolio,
  github,
  linkedin,
  className,
  iconClassName,
}: SocialLinksProps) {
  return (
    <ul className={`flex gap-1 justify-center mt-2 ${className ?? ""}`}>
      {portfolio && (
        <li>
          <Link
            href={portfolio}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[var(--color-primary)] ${iconClassName ?? ""}`}
          >
            <Globe />
          </Link>
        </li>
      )}
      {github && (
        <li>
          <Link
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[var(--color-primary)] ${iconClassName ?? ""}`}
          >
            <Github />
          </Link>
        </li>
      )}
      {linkedin && (
        <li>
          <Link
            href={linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[var(--color-primary)] ${iconClassName ?? ""}`}
          >
            <Linkedin />
          </Link>
        </li>
      )}
    </ul>
  );
}
