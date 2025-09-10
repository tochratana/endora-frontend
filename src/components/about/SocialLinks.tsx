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
    <ul className={`flex gap-3 justify-center mt-2 ${className ?? ""}`}>
      {portfolio && (
        <li>
          <Link
            href={portfolio}
            target={portfolio.startsWith("http") ? "_blank" : ""}
            rel="noopener noreferrer"
            className={`text-gray-600 hover:text-teal-400 hover:scale-110 transition-all duration-200 ${iconClassName ?? ""}`}
          >
            <Globe className="w-5 h-5" />
          </Link>
        </li>
      )}
      {github && (
        <li>
          <Link
            href={github}
            target={github.startsWith("http") ? "_blank" : ""}
            rel="noopener noreferrer"
            className={`text-gray-600 hover:text-purple-400 hover:scale-110 transition-all duration-200 ${iconClassName ?? ""}`}
          >
            <Github className="w-5 h-5" />
          </Link>
        </li>
      )}
      {linkedin && (
        <li>
          <Link
            href={linkedin}
            target={linkedin.startsWith("http") ? "_blank" : ""}
            rel="noopener noreferrer"
            className={`text-gray-600 hover:text-teal-400 hover:scale-110 transition-all duration-200 ${iconClassName ?? ""}`}
          >
            <Linkedin className="w-5 h-5" />
          </Link>
        </li>
      )}
    </ul>
  );
}