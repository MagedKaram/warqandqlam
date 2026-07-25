"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  PiArrowsClockwise,
  PiArrowLeft,
  PiHeart,
  PiHeartFill,
  PiShoppingCartSimple,
  PiStar,
  PiStarFill,
  PiTruck,
  PiWallet,
} from "react-icons/pi";
import { useCart } from "@/components/cart/CartProvider";
import { ProductCard } from "@/components/product/ProductCard";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { createProductCardCartInput } from "@/lib/cart/product-card-adapter";
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
  inheritDirection = false,
  rating,
  size = "text-lg",
}: {
  inheritDirection?: boolean;
  rating: number;
  size?: string;
}) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      dir={inheritDirection ? undefined : "ltr"}
    >
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
    <div className="flex min-w-0 flex-col gap-4 xl:col-start-1 xl:row-start-1 xl:grid xl:w-[533px] xl:grid-cols-[80px_421px] xl:gap-8">
      <div className="relative h-[358px] w-full overflow-hidden rounded-[9px] bg-cool-200 xl:col-start-2 xl:row-start-1 xl:w-[421px]">
        <span className="absolute right-6 top-5 z-20 inline-flex h-8 w-[72px] items-center justify-center whitespace-nowrap rounded-[7px] bg-auth-accent px-2 text-sm font-semibold leading-[1.5] text-white">
          {discountBadge}
        </span>
        <button
          aria-label={isWishlisted ? "إزالة من المفضلة" : "إضافة إلى المفضلة"}
          aria-pressed={isWishlisted}
          className="absolute left-6 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-auth-ink shadow-sm transition hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
          onClick={onToggleWishlist}
          type="button"
        >
          {isWishlisted ? (
            <PiHeartFill aria-hidden className="text-xl text-auth-accent" />
          ) : (
            <PiHeart aria-hidden className="text-xl" />
          )}
        </button>
        <Image
          alt={activeImage.alt}
          className="object-cover"
          fill
          loading="eager"
          sizes="(min-width: 1280px) 421px, (min-width: 768px) calc(100vw - 5rem), calc(100vw - 3rem)"
          src={activeImage.src}
        />
      </div>

      <div className="flex max-w-full gap-4 overflow-x-auto pb-1 xl:col-start-1 xl:row-start-1 xl:h-[358px] xl:w-20 xl:flex-col xl:justify-between xl:gap-0 xl:overflow-visible xl:pb-0">
        {images.map((image) => (
          <button
            aria-label={`عرض صورة ${image.alt}`}
            aria-pressed={activeImage.id === image.id}
            className={`flex h-[65px] w-20 shrink-0 items-center justify-center rounded-md border bg-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 ${
              activeImage.id === image.id
                ? "border-auth-accent"
                : "border-auth-border/60 hover:border-auth-accent"
            }`}
            key={image.id}
            onClick={() => onSelectImage(image)}
            type="button"
          >
            <span
              className={`relative block h-[49px] w-16 overflow-hidden ${
                activeImage.id === image.id ? "rounded-[9px]" : ""
              }`}
            >
              <Image
                alt=""
                className="object-cover"
                fill
                sizes="64px"
                src={image.src}
              />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ProductPurchasePanel({
  product,
  quantity,
  selectedColor,
  onQuantityChange,
  onAddToCart,
  onBuyNow,
  onSelectColor,
}: {
  product: ProductDetail;
  quantity: number;
  selectedColor: string;
  onQuantityChange: (quantity: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  onSelectColor: (colorId: string) => void;
}) {
  return (
    <section className="w-full text-start xl:col-start-2 xl:row-start-1 xl:w-[538px]">
      <div className="flex flex-col items-start gap-[27px]">
        <div className="flex flex-col items-start gap-2 self-stretch xl:h-[158px]">
          <span className="inline-flex h-9 items-center gap-1 rounded-full bg-home-promo py-2 pe-3 ps-2 text-sm font-semibold leading-[1.5] text-auth-accent">
            <PiStarFill aria-hidden className="text-base" />
            {product.badge}
          </span>

          <div className="flex flex-col items-start gap-2.5 self-stretch">
            <h1 className="w-full text-start font-body text-[32px] font-semibold leading-[1.3] text-auth-ink">
              <span>{product.title} </span>
              <bdi className="whitespace-nowrap text-auth-link" dir="ltr">
                {product.brandHighlight}
              </bdi>
            </h1>
            <p className="w-full text-start font-body text-base font-semibold leading-[1.35] text-auth-muted">
              {product.subtitle}
            </p>

            <div className="flex min-h-[30px] flex-wrap items-center gap-3 text-base font-semibold leading-[1.35] text-auth-ink">
              <span className="flex items-center gap-1">
                <RatingStars
                  inheritDirection
                  rating={product.rating}
                  size="text-base"
                />
                <span className="flex items-center gap-2">
                  <bdi dir="ltr">{product.rating}</bdi>
                  <span>
                    (<bdi dir="ltr">{product.reviewCount}</bdi> تقييم)
                  </span>
                </span>
              </span>
              <span className="whitespace-nowrap border-s border-auth-border px-2 py-1">
                {product.soldText}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <bdi
            className="font-heading text-2xl font-bold leading-[1.35] text-auth-accent"
            dir="ltr"
          >
            {product.price} {product.currency}
          </bdi>
          <bdi
            className="font-heading text-xl font-normal leading-[1.35] text-auth-muted line-through"
            dir="ltr"
          >
            {product.oldPrice} جنيه
          </bdi>
        </div>

        <div className="flex flex-col items-start gap-8 xl:flex-row xl:items-center xl:gap-[84px]">
          <div className="flex items-center gap-4">
            <span
              className="font-body text-base font-semibold leading-[1.35] text-auth-muted"
              id="product-quantity-label"
            >
              الكمية:
            </span>
            <QuantityStepper
              labelledBy="product-quantity-label"
              onChange={onQuantityChange}
              value={quantity}
            />
          </div>

          <div
            aria-labelledby="product-color-label"
            className="flex items-center gap-2"
            role="group"
          >
            <span
              className="font-body text-base font-semibold leading-[1.35] text-auth-muted"
              id="product-color-label"
            >
              اللون:
            </span>
            <div className="flex flex-row-reverse items-center gap-2">
              {product.colors.map((color) => (
                <button
                  aria-label={color.label}
                  aria-pressed={selectedColor === color.id}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2 ${
                    selectedColor === color.id
                      ? "border-auth-ink bg-white"
                      : "border-transparent"
                  }`}
                  key={color.id}
                  onClick={() => onSelectColor(color.id)}
                  style={
                    selectedColor === color.id
                      ? undefined
                      : { backgroundColor: color.value }
                  }
                  type="button"
                >
                  {selectedColor === color.id ? (
                    <span
                      aria-hidden
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: color.value }}
                    />
                  ) : null}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 self-stretch xl:gap-8">
          <button
            className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-auth-accent px-4 text-base font-semibold text-white transition hover:bg-auth-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
            onClick={onAddToCart}
            type="button"
          >
            <PiShoppingCartSimple aria-hidden className="text-2xl" />
            أضف للسلة
          </button>
          <button
            className="h-12 rounded-lg border border-auth-ink bg-white px-4 text-base font-semibold text-auth-ink transition hover:border-auth-accent hover:text-auth-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent focus-visible:ring-offset-2"
            onClick={onBuyNow}
            type="button"
          >
            اشتري الآن
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
      <div className="flex max-w-full justify-start gap-8 overflow-x-auto overflow-y-hidden border-b border-auth-border sm:gap-12 lg:gap-16">
        {tabs.map((tab) => (
          <button
            className={`relative shrink-0 pb-5 font-heading text-2xl font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-auth-accent sm:text-3xl ${
              activeTab === tab ? "text-auth-accent" : "text-auth-ink"
            }`}
            key={tab}
            onClick={() => onSelectTab(tab)}
            type="button"
          >
            {tabLabels[tab]}
            {activeTab === tab ? (
              <span className="absolute inset-x-0 bottom-0 h-0.5 bg-auth-accent" />
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
                  <summary className="flex w-full min-w-0 cursor-pointer list-none items-center justify-between gap-6 text-start font-body text-lg font-bold text-auth-ink">
                    <span className="min-w-0 text-start">{item.title}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-2xl text-auth-accent"
                    >
                      <span className="group-open:hidden">+</span>
                      <span className="hidden group-open:inline">-</span>
                    </span>
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

function RelatedProducts({
  onAddProduct,
  products,
}: {
  onAddProduct: (product: RelatedProduct) => void;
  products: RelatedProduct[];
}) {
  return (
    <section>
      <div className="mb-8 flex min-w-0 flex-wrap items-center justify-between gap-4">
        <h2 className="text-start font-heading text-4xl font-bold text-auth-ink">
          منتجات ذات صلة
        </h2>
        <Link
          className="inline-flex items-center gap-2 font-body text-base font-semibold text-auth-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-auth-accent"
          href="/products"
          prefetch={false}
        >
          عرض جميع المنتجات
          <PiArrowLeft aria-hidden className="text-lg" />
        </Link>
      </div>
      <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            onAddToCart={() => onAddProduct(product)}
            product={product}
          />
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
  const router = useRouter();
  const { addProduct } = useCart();
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [activeTab, setActiveTab] = useState<ProductDetailTabId>("details");
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState(
    product.colors.find((color) => color.id === "black")?.id ??
      product.colors[0]?.id ??
      "",
  );
  const [wishlisted, setWishlisted] = useState(false);
  const [cartMessage, setCartMessage] = useState("");

  function getSelectedColor() {
    const color = product.colors.find((option) => option.id === selectedColor);
    return color
      ? { id: color.id, label: color.label, value: color.value }
      : undefined;
  }

  function addCurrentProduct() {
    addProduct({
      productId: product.id,
      title: product.title,
      brandName: product.brandHighlight,
      image: product.images[0].src,
      imageAlt: product.images[0].alt,
      href: `/products/${product.slug}`,
      unitPrice: product.price,
      quantity,
      selectedColor: getSelectedColor(),
    });
    setCartMessage("تمت إضافة المنتج إلى سلة التسوق.");
  }

  function addRelatedProduct(relatedProduct: RelatedProduct) {
    addProduct(createProductCardCartInput(relatedProduct));
    setCartMessage("تمت إضافة المنتج المقترح إلى سلة التسوق.");
  }

  return (
    <main className="bg-white text-foreground">
      <section className="px-6 pb-16 pt-10 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto grid w-full max-w-[1111px] grid-cols-1 items-start gap-10 xl:grid-cols-[533px_538px]">
            <ProductPurchasePanel
              onAddToCart={addCurrentProduct}
              onBuyNow={() => {
                addCurrentProduct();
                router.push("/checkout");
              }}
              product={product}
              quantity={quantity}
              selectedColor={selectedColor}
              onQuantityChange={setQuantity}
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
            <RelatedProducts
              onAddProduct={addRelatedProduct}
              products={product.relatedProducts}
            />
          </div>
        </div>
      </section>

      <p aria-live="polite" className="sr-only">
        {cartMessage}
      </p>

      <DeliveryPromo promo={product.deliveryPromo} />
    </main>
  );
}
