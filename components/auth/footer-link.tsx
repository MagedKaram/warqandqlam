import Link from "next/link";

type FooterLinkProps = {
  text: string;
  href: string;
  linkText: string;
};

export function FooterLink({ text, href, linkText }: FooterLinkProps) {
  return (
    <p className="text-center text-xl font-semibold text-auth-ink">
      {text}{" "}
      <Link className="text-auth-link underline-offset-4 hover:underline" href={href}>
        {linkText}
      </Link>
    </p>
  );
}
