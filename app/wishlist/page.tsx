import { WishlistContent } from "@/app/wishlist/WishlistContent";

type WishlistPageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function WishlistPage({ searchParams }: WishlistPageProps) {
  const params = await searchParams;
  const emptyParam = params.empty;
  const forceEmpty = Array.isArray(emptyParam)
    ? emptyParam.includes("1")
    : emptyParam === "1";

  return <WishlistContent forceEmpty={forceEmpty} />;
}
