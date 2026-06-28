type AuthHeaderProps = {
  title: string;
  subtitle: string;
  compact?: boolean;
};

export function AuthHeader({ title, subtitle, compact = false }: AuthHeaderProps) {
  return (
    <div className="max-w-full space-y-5 text-center">
      <h1
        className={`max-w-full whitespace-normal break-words font-bold leading-tight text-auth-ink ${
          compact ? "text-2xl sm:text-4xl md:text-[2.55rem]" : "text-2xl sm:text-4xl md:text-[2.6rem]"
        }`}
      >
        {title}
      </h1>
      <p className="max-w-full text-base font-semibold leading-8 text-auth-muted sm:text-xl">{subtitle}</p>
    </div>
  );
}
