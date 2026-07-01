"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  PiArrowsClockwise,
  PiArrowLeft,
  PiHeart,
  PiHeartFill,
  PiMinus,
  PiPlus,
  PiShoppingCartSimple,
  PiStar,
  PiStarFill,
  PiTruck,
  PiWallet,
} from "react-icons/pi";
import type {
  ProductDetail,
  ProductDetailImage,
  ProductDetailTabId,
  ProductServiceItem,
  RelatedProduct,
} from "@/types/product";

type ProductDetailsViewProps = {
  product: ProductDetail;
};

const tabLabels: Record<ProductDetailTabId, string> = {
  details: "التفاصيل",
  specs: "المواصفات",
  reviews: "التقييم",
};

function RatingStars({
  rating,
  size = "text-lg",
}: {
  rating: number;
  size?: string;
}) {
  return (
    <span className="inline-flex items-center gap-0.5" dir="ltr">
      {Array.from({ length: 5 }, (_, index) => {
        const Icon = index < rating ? PiStarFill : PiStar;
        return (
          <Icon
            aria-hidden
            className={`${size} ${index < rating ? "text-auth-accent" : "text-auth-ink"}`}
            key={index}
          />
        );
      })}
    </span>
  );
}

function ProductGallery({
  activeImage,
  discountBadge,
  images,
  isWishlisted,
  onSelectImage,
  onToggleWishlist,
}: {
  activeImage: ProductDetailImage;
  discountBadge: string;
  images: ProductDetailImage[];
  isWishlisted: boolean;
  onSelectImage: (image: ProductDetailImage) => void;
  onToggleWishlist: () => void;
}) {
  return (
    <div className="flex gap-8 lg:flex-row" dir="rtl">
      <div className="hidden w-20 shrink-0 flex-col gap-8 lg:flex">
        {images.map((image) => (
          <button
            aria-label={`عرض صورة ${image.alt}`}
            className={`relative h-[65px] w-20 overflow-hidden rounded-md border bg-white p-2 transition ${
              activeImage.id === image.id
                ? "border-auth-accent"
                : "border-auth-border/60 hover:border-auth-accent"
            }`}
            key={image.id}
            onClick={() => onSelectImage(image)}
            type="button"
          >
            <Image
              alt=""
              className="object-cover"
              fill
              sizes="80px"
              src={image.src}
            />
          </button>
        ))}
      </div>

      <div className="relative h-[358px] w-full overflow-hidden rounded-lg bg-cool-200 lg:w-[421px] lg:shrink-0">
        <span className="absolute right-6 top-6 z-20 rounded-md bg-auth-accent px-4 py-2 text-sm font-bold text-white">
          {discountBadge}
        </span>
        <button
          aria-label={isWishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          aria-pressed={isWishlisted}
          className="absolute left-6 top-6 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-white text-auth-ink shadow-sm transition hover:text-auth-accent focus:outline-none focus:ring-2 focus:ring-auth-accent"
          onClick={onToggleWishlist}
          type="button"
        >
          {isWishlisted ? (
            <PiHeartFill aria-hidden className="text-2xl text-auth-accent" />
          ) : (
            <PiHeart aria-hidden className="text-2xl" />
          )}
        </button>
        <Image
          alt={activeImage.alt}
          className="object-cover"
          fill
          priority
          sizes="(min-width: 1024px) 421px, 92vw"
          src={activeImage.src}
        />
      </div>
    </div>
  );
}

function ProductPurchasePanel({
  product,
  quantity,
  selectedColor,
  onDecrease,
  onIncrease,
  onSelectColor,
}: {
  product: ProductDetail;
  quantity: number;
  selectedColor: string;
  onDecrease: () => void;
  onIncrease: () => void;
  onSelectColor: (colorId: string) => void;
}) {
  return (
    <section className="w-full text-right lg:w-[538px] lg:shrink-0" dir="rtl">
      <div className="flex flex-col items-end gap-[27px]">
        <div className="flex flex-col items-end gap-2 self-stretch">
          <span className="inline-flex items-center gap-1 rounded-full bg-home-promo px-4 py-2 text-sm font-bold text-auth-accent">
            <PiStarFill aria-hidden />
            {product.badge}
          </span>

          <div className="flex flex-col items-end gap-2.5 self-stretch">
            <h1 className="rtl-text self-stretch font-body text-[32px] font-semibold leading-[1.3] text-auth-ink">
              <span>{product.title} </span>
              <bdi className="ltr-isolate text-auth-link">
                {product.brandHighlight}
              </bdi>
            </h1>
            <p className="rtl-text self-stretch font-body text-base font-semibold leading-[1.35] text-auth-muted">
              {product.subtitle}
            </p>

            <div
              className="flex flex-wrap items-center gap-3 text-base font-semibold text-auth-ink"
              dir="ltr"
            >
              <span className="rtl-isolate">{product.soldText}</span>
              <span className="text-auth-muted">|</span>
              <span className="rtl-isolate">
                ({product.reviewCount} تقييم)
              </span>
              <span>{product.rating}</span>
              <RatingStars rating={product.rating} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8" dir="ltr">
          <span className="price-text text-xl font-semibold text-auth-muted line-through">
            {product.oldPrice} جنيه
          </span>
          <span className="price-text text-2xl font-bold text-auth-accent">
            {product.price} {product.currency}
          </span>
        </div>

        <div
          className="flex flex-col items-end gap-8 xl:flex-row xl:items-center xl:justify-end xl:gap-[84px]"
          dir="ltr"
        >
          <div className="flex items-center justify-end gap-3">
            <div className="flex items-center gap-3" dir="ltr">
              {product.colors.map((color) => (
                <button
                  aria-label={color.label}
                  aria-pressed={selectedColor === color.id}
                  className={`h-9 w-9 rounded-full border-2 transition focus:outline-none focus:ring-2 focus:ring-auth-accent ${
                    selectedColor === color.id
                      ? "border-auth-ink"
                      : "border-transparent"
                  }`}
                  key={color.id}
                  onClick={() => onSelectColor(color.id)}
                  style={{ backgroundColor: color.value }}
                  type="button"
                />
              ))}
            </div>
            <span className="font-body text-lg font-bold text-auth-muted">
              اللون:
            </span>
          </div>

          <div className="flex items-center justify-end gap-3">
            <div
              className="flex h-12 w-36 items-center justify-between rounded-md border border-auth-border bg-white px-3"
              dir="ltr"
            >
              <button
                aria-label="زيادة الكمية"
                className="flex h-9 w-9 items-center justify-center rounded-md text-auth-ink transition hover:bg-cool-200 focus:outline-none focus:ring-2 focus:ring-auth-accent"
                onClick={onIncrease}
                type="button"
              >
                <PiPlus aria-hidden className="text-xl" />
              </button>
              <span className="text-xl font-bold text-auth-ink">
                {quantity}
              </span>
              <button
                aria-label="تقليل الكمية"
                className="flex h-9 w-9 items-center justify-center rounded-md text-auth-ink transition hover:bg-cool-200 focus:outline-none focus:ring-2 focus:ring-auth-accent"
                onClick={onDecrease}
                type="button"
              >
                <PiMinus aria-hidden className="text-xl" />
              </button>
            </div>
            <span className="font-body text-lg font-bold text-auth-muted">
              الكمية:
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 self-stretch" dir="ltr">
          <button
            className="h-12 rounded-md border border-auth-ink bg-white px-6 text-lg font-bold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus:outline-none focus:ring-2 focus:ring-auth-accent focus:ring-offset-2"
            type="button"
          >
            اشتري الآن
          </button>
          <button
            className="inline-flex h-12 items-center justify-center gap-3 rounded-md bg-auth-accent px-6 text-lg font-bold text-white transition hover:bg-auth-accent/90 focus:outline-none focus:ring-2 focus:ring-auth-accent focus:ring-offset-2"
            type="button"
          >
            أضف للسلة
            <PiShoppingCartSimple aria-hidden className="text-2xl" />
          </button>
        </div>
      </div>
    </section>
  );
}

function ServiceIcon({ icon }: { icon: ProductServiceItem["icon"] }) {
  if (icon === "truck") return <PiTruck aria-hidden className="text-4xl" />;
  if (icon === "returns")
    return <PiArrowsClockwise aria-hidden className="text-4xl" />;
  return <PiWallet aria-hidden className="text-4xl" />;
}

function ServiceStrip({ services }: { services: ProductServiceItem[] }) {
  return (
    <section className="rounded-lg bg-home-promo px-6 py-7">
      <div className="grid gap-7 md:grid-cols-3">
        {services.map((service) => (
          <div
            className="flex items-center justify-center gap-6 text-center md:text-right"
            key={service.id}
          >
            <div className="text-auth-accent">
              <ServiceIcon icon={service.icon} />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-auth-ink">
                {service.title}
              </h2>
              <p className="mt-2 max-w-xs font-body text-base font-semibold leading-7 text-auth-muted">
                {service.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProductInfoTabs({
  activeTab,
  product,
  onSelectTab,
}: {
  activeTab: ProductDetailTabId;
  product: ProductDetail;
  onSelectTab: (tab: ProductDetailTabId) => void;
}) {
  const tabs = useMemo<ProductDetailTabId[]>(
    () => ["details", "specs", "reviews"],
    [],
  );

  return (
    <section>
      <div className="flex justify-start gap-16 border-b border-auth-border">
        {tabs.map((tab) => (
          <button
            className={`relative pb-5 font-heading text-3xl font-bold transition focus:outline-none focus:ring-2 focus:ring-auth-accent ${
              activeTab === tab ? "text-auth-accent" : "text-auth-ink"
            }`}
            key={tab}
            onClick={() => onSelectTab(tab)}
            type="button"
          >
            {tabLabels[tab]}
            {activeTab === tab ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-auth-accent" />
            ) : null}
          </button>
        ))}
      </div>

      <div className="min-h-60 pt-7 text-right">
        {activeTab === "details" ? (
          <div>
            <p className="font-body text-lg font-semibold leading-8 text-auth-muted">
              {product.detailsText}
            </p>
            <div className="mt-12">
              {product.accordions.map((item) => (
                <details
                  className="group border-b border-auth-border py-5"
                  key={item.id}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-body text-lg font-bold text-auth-ink">
                    <span className="text-2xl text-auth-accent">+</span>
                    <span>{item.title}</span>
                  </summary>
                  <p className="mt-4 font-body text-base font-semibold leading-7 text-auth-muted">
                    {item.content}
                  </p>
                </details>
              ))}
            </div>
          </div>
        ) : null}

        {activeTab === "specs" ? (
          <div className="grid">
            {product.specs.map((row) => (
              <div
                className="grid min-h-20 grid-cols-[1fr_12rem] items-center border-b border-auth-border text-lg font-semibold text-auth-ink"
                key={row.id}
              >
                <span className="text-right text-auth-ink">{row.label}</span>
                <span className="text-left text-auth-ink">{row.value}</span>
              </div>
            ))}
          </div>
        ) : null}

        {activeTab === "reviews" ? (
          <div className="flex justify-start">
            {product.reviews.map((review) => (
              <article className="max-w-xl text-right" key={review.id}>
                <RatingStars rating={review.rating} size="text-xl" />
                <p className="mt-3 font-body text-lg font-bold leading-8 text-auth-ink">
                  &ldquo;{review.text}&rdquo;
                </p>
                <div className="mt-4 flex items-center justify-end gap-4">
                  <span className="font-body text-base font-bold text-auth-ink">
                    {review.author}
                  </span>
                  {review.avatar ? (
                    <Image
                      alt={review.author}
                      className="rounded-full object-cover"
                      height={48}
                      src={review.avatar}
                      width={48}
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-cool-200 font-bold text-auth-ink">
                      {review.author.slice(0, 1)}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

function RelatedProductCard({ product }: { product: RelatedProduct }) {
  return (
    <article className="relative rounded-lg border border-neutral-400 bg-white p-4 text-right">
      {product.badge ? (
        <span
          className={`absolute right-4 top-4 rounded-full px-3 py-1 text-sm font-bold ${
            product.badgeTone === "discount"
              ? "bg-home-promo text-auth-accent"
              : "bg-auth-success-soft text-auth-success"
          }`}
        >
          {product.badge}
        </span>
      ) : null}
      <button
        aria-label="إضافة إلى المفضلة"
        className="absolute left-4 top-4 z-10 flex h-8 w-8 items-center justify-center text-auth-ink transition hover:text-auth-accent focus:outline-none focus:ring-2 focus:ring-auth-accent"
        type="button"
      >
        <PiHeart aria-hidden className="text-lg" />
      </button>
      <Link className="block" href={product.href} prefetch={false}>
        <div className="relative mx-auto h-52 w-full">
          <Image
            alt={product.title}
            className="object-contain"
            fill
            sizes="25vw"
            src={product.image}
          />
        </div>
        <h3 className="mt-4 min-h-8 font-body text-lg font-bold text-auth-ink">
          {product.title}
        </h3>
        <p
          className="mt-1 text-right text-xl font-bold text-auth-ink"
          dir="ltr"
        >
          {product.price} {product.currency ?? "LE"}
        </p>
        <div className="mt-2 flex items-center justify-end gap-2">
          <RatingStars rating={product.rating} />
          <span className="text-sm font-bold text-auth-muted">
            {product.reviewCount}
          </span>
        </div>
      </Link>
      <button
        className="mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-auth-accent text-base font-bold text-white transition hover:bg-auth-accent/90 focus:outline-none focus:ring-2 focus:ring-auth-accent focus:ring-offset-2"
        type="button"
      >
        <PiShoppingCartSimple aria-hidden className="text-xl" />
        أضف للسلة
      </button>
    </article>
  );
}

function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  return (
    <section>
      <div className="mb-8 flex items-center justify-between gap-6" dir="ltr">
        <Link
          className="inline-flex items-center gap-2 font-body text-base font-semibold text-auth-accent hover:underline"
          href="/products"
          prefetch={false}
        >
          عرض جميع المنتجات
          <PiArrowLeft aria-hidden className="text-lg" />
        </Link>
        <h2 className="font-heading text-4xl font-bold text-auth-ink" dir="rtl">
          منتجات ذات صلة
        </h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <RelatedProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

function DeliveryPromo({ promo }: { promo: ProductDetail["deliveryPromo"] }) {
  return (
    <section className="bg-home-promo px-6 py-8 md:px-10">
      <div
        className="mx-auto grid max-w-7xl grid-cols-3 items-center gap-6"
        dir="ltr"
      >
        <div className="flex justify-start">
          <Image
            alt={promo.imageAlt}
            className="h-auto w-44 object-contain md:w-56"
            height={500}
            src={promo.image}
            width={500}
          />
        </div>
        <div className="text-center" dir="rtl">
          <h2 className="font-heading text-5xl font-bold leading-tight text-auth-ink">
            {promo.title}
          </h2>
          <p className="font-heading text-3xl font-bold text-auth-ink">
            {promo.subtitle}
          </p>
        </div>
        <p
          className="text-right font-heading text-4xl font-bold text-auth-ink"
          dir="rtl"
        >
          {promo.label}
        </p>
      </div>
    </section>
  );
}

export function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState<ProductDetailTabId>("details");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors[0]?.id ?? "",
  );
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <main className="bg-white text-foreground">
      <section className="px-6 pb-16 pt-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div
            className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-end"
            dir="ltr"
          >
            <ProductPurchasePanel
              product={product}
              quantity={quantity}
              selectedColor={selectedColor}
              onDecrease={() =>
                setQuantity((current) => Math.max(1, current - 1))
              }
              onIncrease={() => setQuantity((current) => current + 1)}
              onSelectColor={setSelectedColor}
            />
            <ProductGallery
              activeImage={activeImage}
              discountBadge={product.discountBadge}
              images={product.images}
              isWishlisted={wishlisted}
              onSelectImage={setActiveImage}
              onToggleWishlist={() => setWishlisted((current) => !current)}
            />
          </div>

          <div className="mt-16">
            <ServiceStrip services={product.services} />
          </div>

          <div className="mt-12">
            <ProductInfoTabs
              activeTab={activeTab}
              product={product}
              onSelectTab={setActiveTab}
            />
          </div>

          <div className="mt-20">
            <RelatedProducts products={product.relatedProducts} />
          </div>
        </div>
      </section>

      <DeliveryPromo promo={product.deliveryPromo} />
    </main>
  );
}
