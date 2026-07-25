import Link from "next/link";
import { PiFacebookLogo, PiInstagramLogo, PiTwitterLogo } from "react-icons/pi";

const footerLinks = [
  { label: "الرئيسية", href: "/" },
  { label: "الأقسام", href: "/categories" },
  { label: "الأسئلة الشائعة", href: "/faq" },
  { label: "من نحن", href: "/about" },
  { label: "تواصل معنا", href: "/contact" },
];

const socialLinks = [
  { label: "Facebook", href: "#", icon: PiFacebookLogo },
  { label: "Twitter", href: "#", icon: PiTwitterLogo },
  { label: "Instagram", href: "#", icon: PiInstagramLogo },
];

export function Footer() {
  return (
    <footer className="bg-auth-ink px-6 py-20 text-white md:px-10">
      <div className="mx-auto max-w-7xl text-center">
        <Link
          className="font-heading text-4xl font-bold text-auth-accent"
          href="/"
          prefetch={false}
        >
          ورقة وقلم
        </Link>

        <p className="mx-auto mt-6 max-w-2xl font-body text-xl font-semibold leading-9 text-white/75">
          مكتبة ورقة وقلم هي وجهتك الأولى لكل ما تحتاجه من أدوات مكتبية ومدرسية
          عالية الجودة. نحرص على تقديم منتجات متنوعة بأسعار مناسبة لتلبية
          احتياجات الطلاب والمبدعين في مكان واحد.
        </p>

        <nav
          aria-label="روابط تذييل الصفحة"
          className="mt-16 flex flex-wrap items-center justify-center gap-x-20 gap-y-6"
        >
          {footerLinks.map((link) => (
            <Link
              className="font-body text-xl font-bold text-white/85 transition hover:text-auth-accent"
              href={link.href}
              key={link.href}
              prefetch={false}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="mt-16 flex items-center justify-center gap-10" dir="ltr">
          {socialLinks.map(({ href, icon: Icon, label }) => (
            <Link
              aria-label={label}
              className="text-white transition hover:text-auth-accent"
              href={href}
              key={label}
              prefetch={false}
            >
              <Icon aria-hidden className="text-4xl" />
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
