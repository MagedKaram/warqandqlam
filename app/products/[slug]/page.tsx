import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductDetailsView } from "@/components/product/ProductDetailsView";
import { getProductDetailBySlug, productDetails } from "@/lib/mock-data";

type ProductDetailsPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return productDetails.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: ProductDetailsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);

  if (!product) {
    return {
      title: "المنتج غير موجود | ورقة وقلم",
    };
  }

  return {
    title: `${product.title} ${product.brandHighlight} | ورقة وقلم`,
    description: product.subtitle,
  };
}

export default async function ProductDetailsPage({ params }: ProductDetailsPageProps) {
  const { slug } = await params;
  const product = getProductDetailBySlug(slug);

  if (!product) {
    notFound();
  }

  return <ProductDetailsView product={product} />;
}
