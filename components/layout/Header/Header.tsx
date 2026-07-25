"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PiHeart,
  PiHeartFill,
  PiList,
  PiMagnifyingGlass,
  PiShoppingCartSimple,
  PiUser,
  PiX,
} from "react-icons/pi";
import { useCart } from "@/components/cart/CartProvider";

type NavItem = {
  label: string;
  href: string;
};

type ActionItem = {
  label: string;
  href: string;
  icon: typeof PiUser;
  activeIcon?: typeof PiUser;
  drawerOnly?: boolean;
};

const navItems: NavItem[] = [
  { label: "الرئيسية", href: "/" },
  { label: "الأقسام", href: "/categories" },
  { label: "الطباعة", href: "/printing" },
  { label: "المنتجات", href: "/products" },
  { label: "تواصل معنا", href: "/contact" },
];

const actionItems: ActionItem[] = [
  { label: "الحساب", href: "/login", icon: PiUser, drawerOnly: true },
  { label: "السلة", href: "/cart", icon: PiShoppingCartSimple },
  {
    label: "المفضلة",
    href: "/wishlist",
    icon: PiHeart,
    activeIcon: PiHeartFill,
    drawerOnly: true,
  },
];

function isActivePath(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname.startsWith(href);
}

function HeaderNavLink({
  href,
  label,
  onClick,
}: NavItem & {
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);

  return (
    <Link
      className={`text-base font-semibold transition hover:text-auth-accent ${
        active ? "text-auth-accent" : "text-auth-ink"
      }`}
      href={href}
      onClick={onClick}
      prefetch={false}
    >
      {label}
    </Link>
  );
}

function ActionLink({
  href,
  icon,
  activeIcon,
  label,
  count,
}: ActionItem & { count?: number }) {
  const pathname = usePathname();
  const active = isActivePath(pathname, href);
  const Icon = active && activeIcon ? activeIcon : icon;

  return (
    <Link
      aria-current={active ? "page" : undefined}
      aria-label={
        typeof count === "number" && count > 0
          ? `${label}، ${count} ${count === 1 ? "عنصر" : "عناصر"}`
          : label
      }
      className={`relative flex h-14 w-14 items-center justify-center rounded-md transition hover:bg-auth-cream hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-link ${
        active ? "bg-home-promo text-auth-accent" : "text-auth-ink"
      }`}
      href={href}
      prefetch={false}
    >
      <Icon aria-hidden className="text-3xl" />
      {typeof count === "number" && count > 0 ? (
        <bdi
          aria-hidden
          className="absolute -top-1 start-0 flex h-6 min-w-6 items-center justify-center rounded-full bg-auth-ink px-1 text-xs font-bold text-white"
          dir="ltr"
        >
          {count > 99 ? "99+" : count}
        </bdi>
      ) : null}
    </Link>
  );
}

export function Header() {
  const { hydrated, lineCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <header className="w-full bg-white">
      <div className="bg-auth-ink px-6 py-2 text-center text-sm font-medium text-white sm:text-base">
        <span>احصل على خصم 25% على أول طلب لك </span>
        <Link
          className="font-bold underline-offset-4 hover:underline"
          href="/products"
          prefetch={false}
        >
          اطلب الآن
        </Link>
      </div>

      <div className="border-b border-neutral-400 bg-white shadow-sm">
        <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6 md:px-10">
          <nav
            aria-label="التنقل الرئيسي"
            className="hidden items-center gap-12 lg:flex"
          >
            {navItems.map((item) => (
              <HeaderNavLink key={item.href} {...item} />
            ))}
          </nav>

          <button
            aria-expanded={drawerOpen}
            aria-label="فتح القائمة"
            className="flex h-10 w-10 items-center justify-center rounded-md text-auth-ink transition hover:bg-auth-cream hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-link lg:hidden"
            onClick={() => setDrawerOpen(true)}
            type="button"
          >
            <PiList aria-hidden className="text-3xl" />
          </button>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button
                aria-expanded={searchOpen}
                aria-label="بحث"
                className="flex h-14 w-14 items-center justify-center rounded-md text-auth-ink transition hover:bg-auth-cream hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-link"
                onClick={() => setSearchOpen((current) => !current)}
                type="button"
              >
                <PiMagnifyingGlass aria-hidden className="text-3xl" />
              </button>
              {searchOpen ? (
                <div className="absolute end-0 top-[calc(100%+0.75rem)] z-40 w-72 max-w-[calc(100vw-2rem)] rounded-md border border-auth-border bg-white p-3 shadow-xl">
                  <input
                    aria-label="بحث في الموقع"
                    className="h-11 w-full rounded-md border border-auth-border px-4 text-start text-base outline-none placeholder:text-auth-muted focus:border-auth-link focus:ring-2 focus:ring-auth-link/20"
                    placeholder="ابحث عن منتج"
                    type="search"
                  />
                </div>
              ) : null}
            </div>

            <div className="hidden items-center gap-5 lg:flex">
              <ActionLink
                href="/wishlist"
                icon={PiHeart}
                activeIcon={PiHeartFill}
                label="المفضلة"
              />
              <ActionLink
                count={hydrated ? lineCount : undefined}
                href="/cart"
                icon={PiShoppingCartSimple}
                label="السلة"
              />
              <ActionLink href="/login" icon={PiUser} label="الحساب" />
            </div>

            <div className="flex items-center gap-3 lg:hidden">
              <ActionLink
                count={hydrated ? lineCount : undefined}
                href="/cart"
                icon={PiShoppingCartSimple}
                label="السلة"
              />
            </div>
          </div>
        </div>
      </div>

      {drawerOpen ? (
        <div
          className="fixed inset-0 z-50 bg-auth-ink/60 lg:hidden"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDrawerOpen(false);
            }
          }}
        >
          <aside className="ml-auto flex h-full w-80 max-w-[86vw] flex-col bg-white px-6 py-6 shadow-xl">
            <div className="flex items-center justify-between">
              <p className="text-lg font-bold text-auth-ink">ورقة وقلم</p>
              <button
                aria-label="إغلاق القائمة"
                className="flex h-10 w-10 items-center justify-center rounded-md text-auth-ink hover:bg-auth-cream hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-link"
                onClick={() => setDrawerOpen(false)}
                type="button"
              >
                <PiX aria-hidden className="text-3xl" />
              </button>
            </div>

            <nav aria-label="قائمة الهاتف" className="mt-10 flex flex-col gap-6">
              {navItems.map((item) => (
                <HeaderNavLink
                  key={item.href}
                  {...item}
                  onClick={() => setDrawerOpen(false)}
                />
              ))}
            </nav>

            <div className="mt-10 grid gap-3 border-t border-neutral-400 pt-6">
              {actionItems
                .filter((item) => item.drawerOnly)
                .map(({ href, icon: Icon, label }) => (
                  <Link
                    className="flex items-center gap-3 rounded-md px-3 py-3 text-base font-semibold text-auth-ink hover:bg-auth-cream hover:text-auth-accent"
                    href={href}
                    key={href}
                    onClick={() => setDrawerOpen(false)}
                    prefetch={false}
                  >
                    <Icon aria-hidden className="text-2xl" />
                    {label}
                  </Link>
                ))}
            </div>
          </aside>
        </div>
      ) : null}
    </header>
  );
}
