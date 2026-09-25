// Header, full-screen menu and footer data. Every link points at the live site (checked against it, see README).
// The three live dropdowns list the same 83 categories under /services, /collaborations and /products.
import { data, url } from "@/lib/home-content";

export type MenuTab = { id: string; label: string; title: string; blurb: string; base: string; all: { label: string; href: string } };

// Blurbs are the live homepage's own card copy for each area.
export const menuTabs: MenuTab[] = [
  { id: "services", label: "Worldwide Services", title: "Worldwide Services", base: "/services/category/", blurb: "Find your next partnership and browse services provided by GlobalHUB members", all: { label: "Browse all services", href: url("/search?filter=SERVICES") } },
  { id: "collaboration", label: "Collaboration", title: "Collaboration", base: "/collaborations/category/", blurb: "Partner with other businesses to share capacity, spread the cost of minimum order quantities (MOQs), collaborate on projects and much more.", all: { label: "All collaborations", href: url("/collaborations") } },
  { id: "products", label: "Products & Parts", title: "Products & Parts", base: "/products/category/", blurb: "Looking for a specific part or product? Find it on GlobalHUB", all: { label: "All products", href: url("/products") } },
];

export const menuCategories = data.categories.map(({ name, slug }) => ({ name, slug }));

export const headerLinks = {
  find: { label: "Find a business", href: url("/businesses") },
  join: { label: "Join GlobalHUB", href: url("/register") },
  login: { label: "Log in", href: url("/login") },
};

export const footerGroups = [
  { title: "Explore", links: [["Find a business", url("/businesses")], ["Worldwide Services", url("/services")], ["Collaboration", url("/collaborations")], ["Products & Parts", url("/products")]] },
  { title: "Account", links: [["Join GlobalHUB", url("/register")], ["Register a business", url("/register-business")], ["Log in", url("/login")], ["FAQ", url("/faq")]] },
  { title: "Legal", links: [["Terms & Conditions", url("/terms-and-conditions")], ["Privacy Policy", url("/privacy-policy")], ["Terms of Use", url("/terms-of-use")], ["Cookie Policy", url("/cookie-policy")]] },
];

export const socials = [
  { name: "LinkedIn", icon: "linkedin", href: "https://www.linkedin.com/company/globalhubhome/" },
  { name: "Instagram", icon: "instagram", href: "https://www.instagram.com/globalhub_ig/" },
  { name: "X", icon: "x", href: "https://x.com/globalhubUK" },
  { name: "Facebook", icon: "facebook", href: "https://www.facebook.com/profile.php?id=61576247230954" },
  { name: "YouTube", icon: "youtube", href: "https://www.youtube.com/@globalhub_youtube" },
] as const;

export const contact = { email: "Ask@GlobalHUB.co.uk", href: "mailto:ask@globalhub.co.uk" };
export const legalName = "© GlobalHUB Holdings Limited 15794525";
