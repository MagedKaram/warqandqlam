import type { Product, ProductDetail, ProductFilterGroup } from "@/types/product";

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
};

export type CompanyLogo = {
  id: string;
  name: string;
  image: string;
};

export type CategoryListItem = {
  id: string;
  slug: string;
  title: string;
  productCount: number;
  image: string;
  description?: string;
};

export const featuredProducts: Product[] = [
  {
    id: "notebook-001",
    title: "دفتر ملاحظات فاخر",
    category: "دفاتر",
    image: "/assets/images/home/74319bbead95c81298ab94642e9aaf991dfcf47e.jpg",
    price: 85,
    href: "/products/notebook-001",
  },
  {
    id: "pen-001",
    title: "طقم أقلام كتابة",
    category: "أقلام",
    image: "/assets/images/home/42da388c2d2410b04a781432c9f4662cda0e7bb4.jpg",
    price: 120,
    href: "/products/pen-001",
  },
  {
    id: "book-001",
    title: "رواية عربية مختارة",
    category: "كتب",
    image: "/assets/images/home/aaec0c79556aa3e629687f2426ad4f31175c67a2.jpg",
    price: 150,
    href: "/products/book-001",
  },
];

export const bestSellerProducts: Product[] = [
  {
    id: "doms-pencil-001",
    image: "/assets/images/home/products/5c1859d3fbe6c5466a768087253369d66bbc52f2.png",
    title: "قلم رصاص ماركه دومز",
    price: 17,
    href: "/products/doms-pencil-001",
    isNew: true,
  },
  {
    id: "doms-pencil-002",
    image: "/assets/images/home/products/abff56314cbbf5ca94f386695c001f1421b1711e.png",
    title: "قلم رصاص ماركه دومز",
    price: 17,
    href: "/products/doms-pencil-002",
    isNew: true,
  },
  {
    id: "doms-pencil-003",
    image: "/assets/images/home/products/b0860bc767a2176310a580e1af25106ec5c51167.png",
    title: "قلم رصاص ماركه دومز",
    price: 17,
    href: "/products/doms-pencil-003",
  },
  {
    id: "doms-pencil-004",
    image: "/assets/images/home/products/5c1859d3fbe6c5466a768087253369d66bbc52f2.png",
    title: "قلم رصاص ماركه دومز",
    price: 17,
    href: "/products/doms-pencil-004",
    isNew: true,
  },
  {
    id: "doms-pencil-005",
    image: "/assets/images/home/products/abff56314cbbf5ca94f386695c001f1421b1711e.png",
    title: "قلم رصاص ماركه دومز",
    price: 17,
    href: "/products/doms-pencil-005",
  },
  {
    id: "doms-pencil-006",
    image: "/assets/images/home/products/b0860bc767a2176310a580e1af25106ec5c51167.png",
    title: "قلم رصاص ماركه دومز",
    price: 17,
    href: "/products/doms-pencil-006",
    isNew: true,
  },
];

const productImages = [
  "/assets/images/products/7432d8314779a4712fe77702149bfdc70edff1b1.png",
  "/assets/images/products/ec3d0775b84e2a135576da109af94b743efeb209.png",
  "/assets/images/products/b86d75b5285cc8340f90ad2c25adf932e29b2ddf.png",
  "/assets/images/products/b0860bc767a2176310a580e1af25106ec5c51167 (1).png",
];

export const productsPageProducts: Product[] = Array.from({ length: 12 }, (_, index) => {
  const image = productImages[index % productImages.length];

  return {
    id: `products-page-pen-${index + 1}`,
    image,
    title: "قلم رصاص ماركة دومز",
    price: 17,
    href: `/products/products-page-pen-${index + 1}`,
    isNew: true,
  };
});

export const productFilterGroups: ProductFilterGroup[] = [
  {
    id: "categories",
    title: "الأقسام",
    options: [
      { id: "pens", label: "أقلام", count: 42 },
      { id: "school-supplies", label: "مستلزمات مدرسية", count: 28 },
      { id: "notebooks", label: "كراسات ودفاتر", count: 19 },
      { id: "colors", label: "ألوان", count: 13 },
    ],
  },
  {
    id: "price",
    title: "السعر",
    options: [
      { id: "under-25", label: "أقل من 25 LE" },
      { id: "25-50", label: "من 25 إلى 50 LE" },
      { id: "over-50", label: "أكثر من 50 LE" },
    ],
  },
  {
    id: "status",
    title: "الحالة",
    options: [
      { id: "new", label: "منتج جديد" },
      { id: "available", label: "متوفر الآن" },
    ],
  },
];

export const wishlistProducts: Product[] = bestSellerProducts
  .slice(0, 4)
  .map((product) => ({
    ...product,
    isWishlisted: true,
  }));

export const categoryListItems: CategoryListItem[] = [
  {
    id: "printing",
    slug: "printing",
    title: "خدمة الطباعة",
    productCount: 0,
    image: "/assets/images/home/Frame 427321653.png",
    description: "خدمة لطباعة ملفات ال pdf",
  },
  {
    id: "engineering-tools",
    slug: "engineering-tools",
    title: "ادوات هندسية",
    productCount: 5,
    image: "/assets/images/home/0970376f852e6bac2da6f54a612467bcdf8bc860.jpg",
  },
  {
    id: "gel-pens",
    slug: "gel-pens",
    title: "أقلام جاف وجيل",
    productCount: 27,
    image: "/assets/images/home/products/5c1859d3fbe6c5466a768087253369d66bbc52f2.png",
  },
  {
    id: "highlighters",
    slug: "highlighters",
    title: "اقلام الهايلايتر",
    productCount: 13,
    image: "/assets/images/home/46ebafc890e79d420f4898c1d7b101bd604872ea.png",
  },
  {
    id: "notebooks",
    slug: "notebooks",
    title: "نوت بوك",
    productCount: 5,
    image: "/assets/images/home/74319bbead95c81298ab94642e9aaf991dfcf47e.jpg",
  },
  {
    id: "stickers",
    slug: "stickers",
    title: "استيكات",
    productCount: 12,
    image: "/assets/images/home/products/abff56314cbbf5ca94f386695c001f1421b1711e.png",
  },
  {
    id: "pencils",
    slug: "pencils",
    title: "اقلام رصاص",
    productCount: 20,
    image: "/assets/images/home/aaec0c79556aa3e629687f2426ad4f31175c67a2.jpg",
  },
  {
    id: "sharpeners",
    slug: "sharpeners",
    title: "برايات",
    productCount: 10,
    image: "/assets/images/home/products/b0860bc767a2176310a580e1af25106ec5c51167.png",
  },
  {
    id: "sticky-notes",
    slug: "sticky-notes",
    title: "استيكي نوت",
    productCount: 19,
    image: "/assets/images/home/6a7ad6a2ea33ce7fba7e26439160aebd852cc90b.png",
  },
  {
    id: "rulers",
    slug: "rulers",
    title: "مساطر",
    productCount: 5,
    image: "/assets/images/home/0970376f852e6bac2da6f54a612467bcdf8bc860.jpg",
  },
  {
    id: "correctors",
    slug: "correctors",
    title: "كوريكتور",
    productCount: 5,
    image: "/assets/images/home/products/abff56314cbbf5ca94f386695c001f1421b1711e.png",
  },
  {
    id: "fun-pens",
    slug: "fun-pens",
    title: "اقلام أشكال متنوعه",
    productCount: 5,
    image: "/assets/images/home/products/5c1859d3fbe6c5466a768087253369d66bbc52f2.png",
  },
  {
    id: "glue",
    slug: "glue",
    title: "صمغ",
    productCount: 3,
    image: "/assets/images/home/products/b0860bc767a2176310a580e1af25106ec5c51167.png",
  },
  {
    id: "colors",
    slug: "colors",
    title: "الألوان",
    productCount: 13,
    image: "/assets/images/home/15fc77b692cc66d7edfa4f01fd4bc56d09fe1ae9.jpg",
  },
  {
    id: "toys",
    slug: "toys",
    title: "الألعاب",
    productCount: 5,
    image: "/assets/images/home/6a7ad6a2ea33ce7fba7e26439160aebd852cc90b.png",
  },
  {
    id: "whiteboard-markers",
    slug: "whiteboard-markers",
    title: "أقلام سبورة",
    productCount: 5,
    image: "/assets/images/home/products/abff56314cbbf5ca94f386695c001f1421b1711e.png",
  },
  {
    id: "pencil-cases",
    slug: "pencil-cases",
    title: "مقالم",
    productCount: 5,
    image: "/assets/images/home/74319bbead95c81298ab94642e9aaf991dfcf47e.jpg",
  },
  {
    id: "wire-notebooks",
    slug: "wire-notebooks",
    title: "كشاكيل سلك",
    productCount: 27,
    image: "/assets/images/home/42da388c2d2410b04a781432c9f4662cda0e7bb4.jpg",
  },
  {
    id: "paper",
    slug: "paper",
    title: "كراسات",
    productCount: 13,
    image: "/assets/images/home/46ebafc890e79d420f4898c1d7b101bd604872ea.png",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "ahmed-mohamed",
    quote:
      "الخدمة كانت سريعة جداً، طلبت طباعة ملفات الجامعة واستلمتها في نفس اليوم والجودة كانت ممتازة. أكيد هكرر التجربة",
    name: "احمد محمد",
    role: "طالب جامعي",
    avatar: "/assets/images/home/513dd7bc494865ca5a45fb92277a8d681c3397ff.jpg",
    rating: 5,
  },
  {
    id: "salma-ali",
    quote:
      "تجربة سهلة ومنظمة، المنتجات وصلتني مغلفة بشكل ممتاز والدعم كان متعاون جداً.",
    name: "سلمى علي",
    role: "مصممة",
    avatar: "/assets/images/home/513dd7bc494865ca5a45fb92277a8d681c3397ff.jpg",
    rating: 5,
  },
  {
    id: "omar-hassan",
    quote:
      "طلبت مستلزمات للمدرسة والطباعة في نفس الطلب، كل شيء وصل في الموعد وبجودة كويسة.",
    name: "عمر حسن",
    role: "ولي أمر",
    avatar: "/assets/images/home/513dd7bc494865ca5a45fb92277a8d681c3397ff.jpg",
    rating: 5,
  },
];

export const companyLogos: CompanyLogo[] = [
  {
    id: "grapho",
    name: "Grapho",
    image: "/assets/images/home/company/Compnay logo-4 1.png",
  },
  {
    id: "wayline",
    name: "WAYLINE",
    image: "/assets/images/home/company/Compnay logo-15 1.png",
  },
  {
    id: "signet",
    name: "Signet",
    image: "/assets/images/home/company/Compnay logo-10 1.png",
  },
  {
    id: "prelude",
    name: "PRELUDE",
    image: "/assets/images/home/company/Compnay logo-16 1.png",
  },
];

const productDetailBase: ProductDetail = {
  id: "ams-plus-engineering-set",
  slug: "doms-pencil-001",
  title: "أدوات الهندسة الاحترافية من",
  brandHighlight: "AMS PLUS",
  subtitle: "طقم هندسي متكامل بجودة عالية و دقة مثالية للرسم الهندسي و العملي.",
  badge: "الأكثر مبيعاً",
  rating: 4,
  reviewCount: 128,
  soldText: "+50 تم بيعهم هذا الأسبوع",
  price: 65,
  oldPrice: 80,
  currency: "جنيه",
  discountBadge: "خصم 20%",
  images: [
    {
      id: "main",
      src: "/assets/images/productdetails/7619c2f80e29ffb555d5039986c861eda904c083.jpg",
      alt: "طقم هندسة دومز جيوفاين على لوحة رسم",
    },
    {
      id: "box",
      src: "/assets/images/productdetails/bbdf7c2cdfa2479bfc903b12c7a2ce27d0b5ecf0.jpg",
      alt: "مكونات طقم الهندسة داخل علبة",
    },
    {
      id: "parts",
      src: "/assets/images/productdetails/d5aaf2cd76e42e1680587a8600c934a4b0e5b485.jpg",
      alt: "تفاصيل أدوات طقم الهندسة",
    },
    {
      id: "package",
      src: "/assets/images/productdetails/524a1bd0c4e1f782ad9d20a6a5adc47e48c4d163.jpg",
      alt: "علبة طقم الهندسة دومز جيوفاين",
    },
  ],
  colors: [
    { id: "red", label: "أحمر", value: "#ff3131" },
    { id: "blue", label: "أزرق", value: "#1f9be6" },
    { id: "green", label: "أخضر", value: "#45b957" },
    { id: "black", label: "أسود", value: "#050505" },
  ],
  services: [
    { id: "delivery", title: "توصيل سريع", description: "2-5 أيام", icon: "truck" },
    { id: "returns", title: "استرجاع سهل", description: "خلال 14 يوم", icon: "returns" },
    {
      id: "payment",
      title: "طرق الدفع",
      description: "الدفع عند الاستلام، البطاقات الائتمانية، والمحافظ الإلكترونية.",
      icon: "wallet",
    },
  ],
  detailsText: "طقم هندسي متكامل بجودة عالية و دقة مثالية للرسم الهندسي و العملي.",
  accordions: [
    {
      id: "shipping",
      title: "الشحن و التوصيل",
      content: "يتم تجهيز الطلب وشحنه خلال 2-5 أيام حسب المنطقة.",
    },
    {
      id: "returns-policy",
      title: "سياسة الإرجاع",
      content: "يمكن استرجاع المنتج خلال 14 يوم إذا كان بحالته الأصلية.",
    },
    {
      id: "payment-methods",
      title: "طرق الدفع",
      content: "الدفع متاح عند الاستلام أو من خلال البطاقات والمحافظ الإلكترونية.",
    },
  ],
  specs: [
    { id: "components", label: "مكونات الطقم", value: "مسطرة، مثلثات، منقلة، برجل، ممحاة، ومبراة" },
    { id: "quality", label: "الخامات و الجودة", value: "خامات عالية الجودة (بلاستيك مقوى + معدن)" },
    { id: "count", label: "عدد القطع", value: "8-9 قطع" },
  ],
  reviews: [
    {
      id: "review-1",
      author: "محمد اسامة",
      avatar: "/assets/images/home/513dd7bc494865ca5a45fb92277a8d681c3397ff.jpg",
      rating: 5,
      text: "الشحن كان سريع و المنتج بجودة عالية",
    },
  ],
  relatedProducts: [
    {
      id: "related-bravo-pencils",
      title: "اقلام رصاص - من شركة bravo",
      image: "/assets/images/productdetails/8473fb09f37a407664daf00cbb18b12436e0c5fd.png",
      price: 170,
      href: "/products/related-bravo-pencils",
      rating: 4,
      reviewCount: 98,
      badge: "خصم %20",
      badgeTone: "discount",
    },
    {
      id: "related-doms-fusion-1",
      title: "قلم رصاص ماركه دومز",
      image: "/assets/images/productdetails/37ccc0ff0532db9833cd58daad53dd68572fd4f9.png",
      price: 17,
      href: "/products/related-doms-fusion-1",
      isNew: true,
      rating: 4,
      reviewCount: 98,
      badge: "منتج جديد",
      badgeTone: "success",
    },
    {
      id: "related-doms-fusion-2",
      title: "قلم رصاص ماركه دومز",
      image: "/assets/images/productdetails/37ccc0ff0532db9833cd58daad53dd68572fd4f9 (1).png",
      price: 17,
      href: "/products/related-doms-fusion-2",
      isNew: true,
      rating: 4,
      reviewCount: 98,
      badge: "منتج جديد",
      badgeTone: "success",
    },
    {
      id: "related-faber-pencils",
      title: "قلم رصاص ماركه دومز",
      image: "/assets/images/productdetails/7b3fa5b4707e18a86f0f0292da38176032c817b4.jpg",
      price: 17,
      href: "/products/related-faber-pencils",
      rating: 4,
      reviewCount: 98,
    },
  ],
  deliveryPromo: {
    image: "/assets/images/productdetails/36269bfa459b74a06ac459a939a2d0b7c6c1a6e6.png",
    imageAlt: "مندوب توصيل على دراجة",
    title: "توصيل مجاني",
    subtitle: "للطلبات فوق 500 جنيه",
    label: "عرض خاص",
  },
};

const productDetailSlugs = [
  "doms-pencil-001",
  "doms-pencil-002",
  "doms-pencil-003",
  "doms-pencil-004",
  "doms-pencil-005",
  "doms-pencil-006",
  "products-page-pen-1",
  "products-page-pen-2",
  "products-page-pen-3",
  "products-page-pen-4",
  "products-page-pen-5",
  "products-page-pen-6",
  "products-page-pen-7",
  "products-page-pen-8",
  "products-page-pen-9",
  "products-page-pen-10",
  "products-page-pen-11",
  "products-page-pen-12",
  "related-bravo-pencils",
  "related-doms-fusion-1",
  "related-doms-fusion-2",
  "related-faber-pencils",
];

export const productDetails: ProductDetail[] = productDetailSlugs.map((slug) => ({
  ...productDetailBase,
  id: slug,
  slug,
}));

export function getProductDetailBySlug(slug: string) {
  return productDetails.find((product) => product.slug === slug);
}
