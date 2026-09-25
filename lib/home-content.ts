// Homepage copy. Everything here is verbatim from globalhub.co.uk (homepage, captured 25 Sep 2026).
// Data the live homepage loads from its API (slides, social feed, featured businesses, services, categories)
// is snapshotted into content/home.json by scripts/fetch_content.py, with images saved to public/images/.
import snapshot from "@/content/home.json";

export const site = "https://globalhub.co.uk";
export const url = (path: string) => (path.startsWith("http") || path.startsWith("mailto:") ? path : `${site}${path}`);

export type Img = { src: string; width: number; height: number };
export type Company = { name: string; slug: string; logo: Img | null };
export type Service = { id: number; title: string; description: string; image: Img | null; company: Company };

export const data = snapshot as unknown as {
  fetched: string;
  hero: { title: string; description: string; image: Img; primary: { label: string; href: string }; secondary: { label: string; href: string } }[];
  posts: { id: number; company: Company; author: string; date: string; text: string; image: Img | null; comments: number; shares: number }[];
  featured: (Company & { based: string | null; country: string | null; industries: string[]; cover: Img | null })[];
  popular: Service[];
  recent: Service[];
  categories: { name: string; slug: string; image: Img | null }[];
};

export const companyUrl = (slug: string) => url(`/company/${slug}`);
export const serviceUrl = (id: number) => url(`/service/${id}`);
export const categoryUrl = (slug: string) => url(`/category/${slug}`);

/** The "What is GlobalHUB?" film every hero slide links to (cta_primary_link in the slides API). */
export const film = { youtubeId: "xdgnDmeqkMk", title: "What is GlobalHUB?", href: "https://youtu.be/xdgnDmeqkMk" };

/** The three cards under the live hero. The live cards are not links; each here points at the matching live index. */
export const pillars = [
  { title: "Collaborate", text: "Partner with other businesses to share capacity, spread the cost of minimum order quantities (MOQs), collaborate on projects and much more.", href: url("/collaborations"), cta: "Collaboration" },
  { title: "Services", text: "Find your next partnership and browse services provided by GlobalHUB members", href: url("/services"), cta: "Worldwide Services" },
  { title: "Products", text: "Looking for a specific part or product? Find it on GlobalHUB", href: url("/products"), cta: "Products & Parts" },
];

export const feed = {
  title: "Social Feed",
  prompt: "Want to join the conversation?",
  body: "Log in to create posts, like, comment, and repost with the community.",
  cta: { label: "Log in", href: url("/login") },
};

export const featuredTitle = "Featured businesses";

export const services = {
  title: "Services",
  popularTitle: "Popular Services",
  recentTitle: "Recently added",
  browse: { label: "Browse all services", href: url("/search?filter=SERVICES") },
  find: { label: "Find a service", href: url("/search?filter=SERVICES") },
};

export const categoriesTitle = "Browse by category";

export const why = {
  title: "Why GlobalHUB?",
  items: [
    { title: "All-in-one business support platform", text: "GlobalHUB consolidates a comprehensive array of business support tools and resources into one centralised platform. We offer everything you need to succeed, saving you time and effort searching across multiple platforms." },
    { title: "Find the businesses you need", text: "Whether you require suppliers, collaborators, or clients, our platform connects you seamlessly. With advanced search filters, uncover new opportunities and forge valuable connections." },
    { title: "Showcase what you do best", text: "Our platform offers unparalleled possibilities, enabling users to buy and sell parts, products, and services with ease. Whether you're looking to expand your market reach, optimise inventory management, or discover new revenue streams, GlobalHUB provides the tools for exactly this." },
    { title: "Collaborative Networking Opportunities:", text: "Connect with like-minded entrepreneurs, potential collaborators, and industry peers through GlobalHUB's networking features. Build meaningful relationships, share knowledge, and explore new opportunities for growth and collaboration within our vibrant and supportive community." },
    { title: "Create your own company page", text: "GlobalHUB empowers you to create your own company page, transforming how you present your brand. Showcase your product and services and connect with clients and partners effortlessly. With intuitive tools, your page becomes a dynamic platform for advertising and brand awareness." },
    { title: "Opportunity discovery", text: "Explore fresh avenues for growth and collaboration on GlobalHUB's platform. Utilise our intuitive business and product directory and advanced search capabilities to uncover potential opportunities and unlock new possibilities for your business." },
  ],
};

export const join = {
  price: { lead: "Only", amount: "£20.00", terms: "ex tax p/m" },
  label: "Grow your business",
  title: "Unlock the Full Potential of Your Business.",
  text: "Don't miss out on the opportunity to elevate your business to new heights. Sign up now and embark on a journey of success with GlobalHUB",
  cta: { label: "Join today", href: url("/register-business") },
  promo: "3 months FREE - code GH3",
};
