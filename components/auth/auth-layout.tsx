import Image from "next/image";
import type { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  artworkSide?: "left" | "right";
  contentClassName?: string;
};

function ArtworkPanel() {
  return (
    <aside
      aria-label="لوحة ورقة وقلم"
      className="relative hidden min-h-screen overflow-hidden bg-auth-cream lg:block"
      dir="rtl"
    >
      <Image
        alt="تصميم قرطاسية ورقة وقلم"
        className="object-cover"
        fill
        priority
        sizes="50vw"
        src="/assets/images/auth-art.png"
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          alt="ورقة وقلم"
          className="h-auto w-[15rem] lg:w-[18rem]"
          height={220}
          priority
          src="/assets/images/logo.png"
          width={360}
        />
      </div>
    </aside>
  );
}

export function AuthLayout({
  children,
  artworkSide = "left",
  contentClassName = "",
}: AuthLayoutProps) {
  const content = (
    <section
      className={`flex min-h-screen w-full min-w-0 items-center justify-center overflow-x-hidden px-6 py-10 sm:px-10 lg:px-16 ${contentClassName}`}
      dir="rtl"
    >
      {children}
    </section>
  );

  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-auth-ink">
      <div className="grid min-h-screen w-full min-w-0 lg:grid-cols-2" dir="ltr">
        {artworkSide === "left" ? <ArtworkPanel /> : content}
        {artworkSide === "left" ? content : <ArtworkPanel />}
      </div>
    </main>
  );
}
