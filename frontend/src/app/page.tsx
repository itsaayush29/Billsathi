import Link from "next/link";
import { getSessionUser } from "../lib/api";

const trustedLogos = [
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuCmi5th9tNyjRSE6ZUPbgFVneKgxKe3af48YbLLQKoEhZ9pFbe-t0GuXKuQApI4mPDkzCBP2wSOqvbYvoRq0CrI4frA073skq32KmzHH40poIttmW_1KLIGGbg1IKmcDofGVR0Ub19dqCM2wh0ofFfHwxvwV3QiJE75pKLh3p2hBcAJRzZo3GkQq2vldtAfsfyEOb85MeYoBXBrfiIWlX_NIZCqI2K797L7B-XwuUICUAUCUGzvcCsEj_yJuuYYdwuT6XP4RdIOoUrD",
    alt: "Minimalist fintech startup logo"
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGBu4VB6khLWWlcT73AkHRidJYa-PDTlMUBocgKq55_zrlGuJLvLb_uaO4Ia_2llr_B186l54JLexKR8Ck5YCyl_EOlxK1KD4KpN1Mwiy401ulX0KaiHVFXXp77wiIVO8VP5KqmWK5a3vPFsVaSrfGiJwEKLEUygg9slJyehK2vTrAXGhhSTqRd833qkaaxrLzV1cGzjApE0OgYBD7Gi0fXUx3t9y8Jb8WAfBr1XrDuSN4xq_XrM2lXs7ia4KAziqKKcQyGPSB8I6q",
    alt: "Technology company logo"
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDeZ6TemvJ-kAFsuEBNJUPny3qoI-OVJeCSHTnyXaAlkmf0DIZaoTQYXj8TYa2_W43Da10ZhYiHaqPiQm7k8Ay_i6z0LwTuXZhBKTiBWl5NuCpg5v3ILihdXRc3PeHvaisXBmr_KNB0upNZ2C8fe2nnHT_nvGDD7_d7EXYfPzbN6Ij1pElhwFwswse4ELrM1WZvSq2d5cEhTsbMJ-f6YXvxVQPmq37wVYBhUVkGsUP-RcgGOzcGYtrE6bkb8llO0UiSzr5QJNYyCzxx",
    alt: "Logistics company logo"
  },
  {
    src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfv-DQln-dkwLjTi9Oz3-uJvigWlki5syAdb_RhqooIknOC1vDVQIaDgFocAMBdTjuOEVNzI4IUPXjWM0GDWqNvEczCXH2U-oPaEXlOjQZEz6pKBPbvZQWuJmj_ZcuAbkM21gxBtLQ-TNFMBQ68dxc-xFXWtCycvoLbA_f3NsljLVhpCkUT3mZH7KO72NN6F2IDR2X0JU6SpiH4K7FXEjqMT4FX-RcYr6dkvxCe0DLLUWLL6KLEP5cxjYfWs60mz3mrrjb-uiIN2cd",
    alt: "Architectural firm logo"
  }
];

const testimonials = [
  {
    quote:
      "Much easier than Tally. I can literally generate an invoice while talking to the customer on my phone.",
    name: "Rahul Verma",
    company: "RV Hardware Solutions",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5LucMOhQg4o377caX2-W2yFpvFjmXgf7enWivn8ynzJlknYCEVa9Uary2Ab6tqzWIn0KgGkyV2Xa79wH0IMZE57JUMm0Nb1aMy_1GPxv4_-RF-bxjJsglg2mrkO-Y6Jyqiz0vydAAW9wpOW2mZRSW0c-iZdHhHLBOr63lLKcJc-3Yy-oXg4dpXDMtdWxeTN7AfSFKh7fMRP90GA-sKaGI2kYy8TJpgCND-wGbMeKOLH9RfVZGhKJ_6_jMSql6CEaiFPtxMeL05eql"
  },
  {
    quote:
      "The WhatsApp integration is a game changer. Payments are coming in 40% faster than before.",
    name: "Priya Singh",
    company: "Creatives & More",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB1SV4N7gBIQU9dK9Y625Xr4tqTmPHdYT8uyXF2QPs1NZLbJTgaxuCog6KxIIbnhVOAvw7drVemjAM7GpNu4zGiYl0ptyecuu7Aj_1l0edFRSrq8_mkaxz8zsYsomAklCkwt2op7A8rBWzRkCIadmFZgGbu85afu9vM4ct-e2Y-W4dxqhY1Doed5BZxyQtih8S-a_-vcLSY6Q0v7uhwBE8OiAj4sTaeX4SEUwDy3jScuo33AK2CKqPzTKyuWUnCNDmrOCR9rj43o70l"
  },
  {
    quote:
      "Clean UI, no junk features. It does exactly what it says and does it extremely fast.",
    name: "Anil Mehta",
    company: "Mehta Garments",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCQMvD2T5ztrSc_X9ClYt4bOpQ83hT4PaDA8MLrm9dvpts-4k0sDHO-Nm8YoYzD_SrfXBykSqDJ7FE6N7JoUZjsGLbpIB-6fEhSx44YP1CQZWrUMmh96lU65zyOGB1ILulDJk27NL2K4qSiES1O0V5g_mcpmbgsH3EbOJHi1OYfTPw2727GWKcw5A1usnNk6wZeiih6eueSF_HIzNyrDQfSoygzlHuTSIQ5bMxd21_75djC9XLWoYwYw-LCPgsow75E0Oeepgn4e8ip"
  }
];

export default async function LandingPage() {
  const user = await getSessionUser();
  const primaryHref = user ? (user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard") : "/register";
  const secondaryHref = user ? (user.role === "ADMIN" ? "/admin/dashboard" : "/dashboard") : "/login";
  const primaryLabel = user ? "Open Dashboard" : "Get Started";
  const secondaryLabel = user ? "Go to Workspace" : "Login";

  return (
    <div className="scroll-smooth bg-[#f9f9ff] font-body text-[#151c27] selection:bg-[#e2dfff] selection:text-[#001a42]">
      <nav className="fixed top-0 z-50 w-full bg-white/80 shadow-[0_4px_20px_rgba(79,70,229,0.05)] backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-4 sm:gap-8">
            <Link className="font-headline text-xl font-bold tracking-tighter text-indigo-600 sm:text-2xl" href="/">
              BillSathi
            </Link>
            <div className="hidden items-center gap-6 md:flex">
              <a className="font-headline font-semibold tracking-tight text-slate-600 transition-colors duration-200 hover:text-indigo-500" href="#features">
                Features
              </a>
              <a className="font-headline font-semibold tracking-tight text-slate-600 transition-colors duration-200 hover:text-indigo-500" href="#solutions">
                Solutions
              </a>
              <a className="font-headline font-semibold tracking-tight text-slate-600 transition-colors duration-200 hover:text-indigo-500" href="#pricing">
                Pricing
              </a>
              <a className="font-headline font-semibold tracking-tight text-slate-600 transition-colors duration-200 hover:text-indigo-500" href="#resources">
                Resources
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link className="hidden scale-95 px-4 py-2 font-headline font-semibold tracking-tight text-slate-600 transition-all active:scale-90 hover:text-indigo-500 sm:block" href={secondaryHref}>
              {secondaryLabel}
            </Link>
            <Link className="signature-gradient kinetic-shadow scale-95 rounded-lg px-4 py-2 text-sm font-headline font-semibold tracking-tight text-white transition-transform active:scale-90 sm:px-6 sm:py-2.5 sm:text-base" href={primaryHref}>
              {primaryLabel}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        <section className="relative overflow-hidden pb-20 pt-12 sm:pb-24 sm:pt-16 lg:pb-32 lg:pt-20">
          <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:gap-12">
            <div className="z-10">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-[#e2dfff] px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#001a42]">
                <span className="material-symbols-outlined text-[14px]">bolt</span>
                The Kinetic Sanctuary of Billing
              </div>
              <h1 className="mb-6 font-headline text-4xl font-extrabold leading-[1.1] tracking-tight text-[#151c27] sm:text-5xl lg:text-7xl">
                Create GST Invoices in <span className="italic text-[#3525cd]">30 Seconds</span>
              </h1>
              <p className="mb-8 max-w-xl text-base leading-relaxed text-[#464555] sm:mb-10 sm:text-xl">
                Simple billing for small businesses. No complexity. No confusion. Wrapped in a premium experience that respects your time.
              </p>
              <div className="grid gap-3 sm:flex sm:flex-wrap sm:gap-4">
                <Link className="signature-gradient kinetic-shadow rounded-xl px-6 py-3 text-center font-headline text-base font-bold text-white transition-all hover:scale-105 active:scale-95 sm:px-8 sm:py-4 sm:text-lg" href={primaryHref}>
                  {user ? "Open Workspace" : "Get Started Free"}
                </Link>
                <Link className="flex items-center justify-center gap-3 rounded-xl border border-[#c7c4d8]/20 bg-white px-6 py-3 font-headline text-base font-bold text-[#151c27] transition-all hover:bg-[#f0f3ff] sm:px-8 sm:py-4 sm:text-lg" href="#solutions">
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch Demo
                </Link>
              </div>
              <div className="mt-12 pt-6 sm:mt-16 sm:pt-10">
                <p className="mb-6 text-sm font-semibold uppercase tracking-widest text-[#464555]">
                  Trusted by 100+ small businesses
                </p>
                <div className="flex flex-wrap items-center gap-4 opacity-60 grayscale transition-all hover:grayscale-0 sm:gap-6">
                  {trustedLogos.map((logo) => (
                    <img key={logo.src} alt={logo.alt} className="h-8 w-auto" src={logo.src} />
                  ))}
                </div>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-4 rounded-full bg-[#3525cd]/20 blur-3xl opacity-30 transition-opacity group-hover:opacity-50" />
              <div className="kinetic-shadow relative rounded-3xl border border-white/50 bg-white p-5 backdrop-blur-sm transition-transform duration-500 group-hover:rotate-0 sm:rotate-2 sm:p-8">
                <div className="mb-8 flex items-start justify-between">
                  <div>
                    <h3 className="font-headline text-2xl font-extrabold">Invoice #2401</h3>
                    <p className="text-sm text-[#464555]">Issued Jan 24, 2024</p>
                  </div>
                  <div className="rounded-full bg-[#6cf8bb] px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#00714d]">
                    Paid
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex justify-between border-b border-[#e7eefe] pb-4">
                    <span className="text-[#464555]">Client Name</span>
                    <span className="font-semibold">Acme Corporation</span>
                  </div>
                  <div className="flex justify-between border-b border-[#e7eefe] pb-4">
                    <span className="text-[#464555]">Service</span>
                    <span className="font-semibold">Digital Strategy</span>
                  </div>
                  <div className="flex items-end justify-between pt-4">
                    <div>
                      <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#464555]">
                        Total Amount
                      </p>
                      <p className="font-headline text-4xl font-extrabold text-[#3525cd]">
                        ₹45,000
                      </p>
                    </div>
                    <div className="rounded-xl bg-[#4f46e5] p-3">
                      <span className="material-symbols-outlined text-3xl text-white">qr_code_2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="bg-[#f0f3ff] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-headline text-3xl font-extrabold sm:text-4xl">Precision Billing Features</h2>
              <p className="mx-auto max-w-2xl text-[#464555]">
                Everything you need to manage your business finances with WhatsApp-speed interactions.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="kinetic-shadow group rounded-3xl bg-white p-8 transition-all hover:-translate-y-2">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e2dfff] text-[#3525cd] transition-all group-hover:text-white signature-gradient">
                  <span className="material-symbols-outlined text-3xl">flash_on</span>
                </div>
                <h3 className="mb-3 font-headline text-xl font-extrabold">Instant Billing</h3>
                <p className="mb-6 leading-relaxed text-[#464555]">
                  Create and share professional GST invoices in under 30 seconds. No steep learning curves.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px] text-[#006c49]" style={{ fontVariationSettings: '"FILL" 1' }}>
                      check_circle
                    </span>
                    Auto-fill customer details
                  </li>
                  <li className="flex items-center gap-2 text-sm font-medium">
                    <span className="material-symbols-outlined text-[18px] text-[#006c49]" style={{ fontVariationSettings: '"FILL" 1' }}>
                      check_circle
                    </span>
                    Smart tax calculation
                  </li>
                </ul>
              </div>

              <div className="kinetic-shadow group rounded-3xl bg-white p-8 transition-all hover:-translate-y-2">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#6cf8bb] text-[#00714d] transition-all group-hover:bg-[#006c49] group-hover:text-white">
                  <span className="material-symbols-outlined text-3xl">chat</span>
                </div>
                <h3 className="mb-3 font-headline text-xl font-extrabold">WhatsApp Sync</h3>
                <p className="mb-6 leading-relaxed text-[#464555]">
                  Send invoices directly to your customer&apos;s WhatsApp. No more &quot;didn&apos;t receive email&quot; excuses.
                </p>
                <div className="rounded-xl border border-[#c7c4d8]/10 bg-[#f0f3ff] p-4">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 shrink-0 rounded-full bg-[#6ffbbe]" />
                    <div className="kinetic-shadow rounded-lg bg-white p-2 text-[10px]">
                      &quot;Your invoice for ₹12,500 is ready!&quot;
                    </div>
                  </div>
                </div>
              </div>

              <div className="kinetic-shadow group rounded-3xl bg-white p-8 transition-all hover:-translate-y-2">
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#d8e2ff] text-[#004395] transition-all group-hover:bg-[#004598] group-hover:text-white">
                  <span className="material-symbols-outlined text-3xl">payments</span>
                </div>
                <h3 className="mb-3 font-headline text-xl font-extrabold">Easy Payments</h3>
                <p className="mb-6 leading-relaxed text-[#464555]">
                  Integrated UPI and card payments for faster settlements. Get paid as soon as they view.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["UPI", "Card", "Net Banking"].map((tag) => (
                    <span key={tag} className="rounded-full bg-[#f0f3ff] px-3 py-1 text-xs font-bold text-[#464555]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="solutions" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-20 text-center">
              <h2 className="mb-4 font-headline text-3xl font-extrabold sm:text-4xl">Zero Friction, Three Steps</h2>
              <p className="text-[#464555]">Built for entrepreneurs who hate paperwork.</p>
            </div>
            <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3">
              <div className="absolute left-1/4 right-1/4 top-12 hidden h-[2px] bg-[#c7c4d8] opacity-30 md:block" />
              {[
                ["person_add", "1. Add Customer", "Select from phonebook or type details once."],
                ["add_shopping_cart", "2. Add Items", "Add products or services from your catalog."],
                ["send", "3. Send Invoice", "One tap to share on WhatsApp or Email."]
              ].map(([icon, title, description]) => (
                <div key={title} className="relative text-center">
                  <div className="kinetic-shadow relative z-10 mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-white">
                    <span className="material-symbols-outlined text-4xl text-[#3525cd]">{icon}</span>
                  </div>
                  <h4 className="mb-2 font-headline text-xl font-bold">{title}</h4>
                  <p className="text-sm text-[#464555]">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[#e7eefe] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="kinetic-shadow overflow-hidden rounded-[40px] border border-white/20 bg-white">
              <div className="flex min-h-[600px] flex-col lg:flex-row">
                <div className="hidden w-64 border-r border-[#c7c4d8]/10 bg-[#f0f3ff] p-6 lg:block">
                  <div className="mb-10 font-headline text-xl font-bold text-[#3525cd]">BillSathi</div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 rounded-xl bg-[#e2dfff] p-3 font-bold text-[#3525cd]">
                      <span className="material-symbols-outlined">dashboard</span> Dashboard
                    </div>
                    <div className="flex items-center gap-3 rounded-xl p-3 text-[#464555]">
                      <span className="material-symbols-outlined">receipt</span> Invoices
                    </div>
                    <div className="flex items-center gap-3 rounded-xl p-3 text-[#464555]">
                      <span className="material-symbols-outlined">group</span> Customers
                    </div>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-5 sm:p-8 lg:p-10">
                  <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h2 className="font-headline text-2xl font-extrabold sm:text-3xl">Overview</h2>
                    <Link className="signature-gradient rounded-xl px-6 py-2 text-center text-sm font-bold text-white" href={primaryHref}>
                      New Invoice
                    </Link>
                  </div>
                  <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div className="rounded-3xl bg-[#f0f3ff] p-6">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#464555]">Monthly Sales</p>
                      <p className="font-headline text-4xl font-extrabold">₹2,84,500</p>
                      <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#c7c4d8]/20">
                        <div className="h-full w-[75%] bg-[#006c49]" />
                      </div>
                    </div>
                    <div className="rounded-3xl bg-[#f0f3ff] p-6">
                      <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#464555]">Outstanding</p>
                      <p className="font-headline text-4xl font-extrabold text-[#ba1a1a]">₹18,200</p>
                      <p className="mt-4 text-xs text-[#464555]">3 invoices pending</p>
                    </div>
                  </div>
                  <div className="rounded-3xl bg-[#f0f3ff] p-6">
                    <h3 className="mb-6 font-headline font-bold">Recent Activity</h3>
                    <div className="space-y-4">
                      {[
                        ["SC", "Sharma Canteens", "#INV-982", "₹4,200", "Paid", "bg-[#6cf8bb] text-[#00714d]"],
                        ["LK", "Laxmi Kirana", "#INV-981", "₹12,850", "Sent", "bg-[#d8e2ff] text-[#004395]"]
                      ].map(([initials, name, invoice, amount, status, badgeClass]) => (
                        <div key={invoice} className="flex items-center justify-between rounded-2xl bg-white p-4">
                          <div className="flex items-center gap-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e7eefe] font-bold text-[#3525cd]">
                              {initials}
                            </div>
                            <div>
                              <p className="text-sm font-bold">{name}</p>
                              <p className="text-xs text-[#464555]">{invoice}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{amount}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${badgeClass}`}>
                              {status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-16 text-center">
              <h2 className="mb-4 font-headline text-3xl font-extrabold sm:text-4xl">Transparent Pricing</h2>
              <p className="text-[#464555]">Scale your business without scaling your bills.</p>
            </div>
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
              <div className="kinetic-shadow rounded-[32px] border border-[#c7c4d8]/10 bg-white p-6 sm:p-10">
                <h3 className="mb-2 font-headline text-xl font-extrabold">Starter</h3>
                <p className="mb-6 text-sm text-[#464555]">Perfect for solo founders.</p>
                <div className="mb-8">
                  <span className="font-headline text-5xl font-extrabold">₹0</span>
                  <span className="text-[#464555]">/month</span>
                </div>
                <ul className="mb-10 space-y-4">
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-[#006c49]">check</span> 5 Invoices per month
                  </li>
                  <li className="flex items-center gap-3 text-sm">
                    <span className="material-symbols-outlined text-[#006c49]">check</span> WhatsApp sharing
                  </li>
                  <li className="flex items-center gap-3 text-sm text-[#464555] opacity-50">
                    <span className="material-symbols-outlined">close</span> Custom branding
                  </li>
                </ul>
                <Link className="block w-full rounded-xl border-2 border-[#c7c4d8] py-4 text-center font-bold transition-all hover:bg-[#f0f3ff]" href={user ? "/subscription" : "/register"}>
                  Start Free
                </Link>
              </div>

              <div className="signature-gradient kinetic-shadow relative rounded-[32px] p-[2px]">
                <div className="h-full rounded-[30px] bg-white p-6 sm:p-10">
                  <div className="signature-gradient absolute -top-4 right-8 rounded-full px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
                    Most Popular
                  </div>
                  <h3 className="mb-2 font-headline text-xl font-extrabold">Business Pro</h3>
                  <p className="mb-6 text-sm text-[#464555]">For growing small businesses.</p>
                  <div className="mb-8">
                    <span className="font-headline text-5xl font-extrabold">₹499</span>
                    <span className="text-[#464555]">/month</span>
                  </div>
                  <ul className="mb-10 space-y-4">
                    {[
                      "Unlimited Invoices",
                      "WhatsApp & SMS automated",
                      "Advanced GST reporting",
                      "Inventory Management"
                    ].map((feature) => (
                      <li key={feature} className="flex items-center gap-3 text-sm">
                        <span className="material-symbols-outlined text-[#006c49]">check</span> {feature}
                      </li>
                    ))}
                  </ul>
                  <Link className="signature-gradient kinetic-shadow block w-full rounded-xl py-4 text-center font-bold text-white transition-all hover:scale-[1.02]" href={user ? "/subscription" : "/register"}>
                    Upgrade Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-[#f0f3ff] py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="mb-16 flex flex-col items-end justify-between gap-8 md:flex-row">
              <div>
                <h2 className="mb-4 font-headline text-3xl font-extrabold sm:text-4xl">Loved by Founders</h2>
                <p className="text-[#464555]">Join 100+ businesses who switched for simplicity.</p>
              </div>
              <div className="flex gap-4">
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7c4d8] transition-all hover:bg-white">
                  <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <button className="flex h-12 w-12 items-center justify-center rounded-full border border-[#c7c4d8] transition-all hover:bg-white">
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div key={testimonial.name} className="kinetic-shadow rounded-3xl bg-white p-8">
                  <div className="mb-6 flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={`${testimonial.name}-${index}`}
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="mb-8 text-lg italic leading-relaxed">{`"${testimonial.quote}"`}</p>
                  <div className="flex items-center gap-4">
                    <img alt={testimonial.name} className="h-12 w-12 rounded-full object-cover" src={testimonial.image} />
                    <div>
                      <p className="font-bold">{testimonial.name}</p>
                      <p className="text-xs text-[#464555]">{testimonial.company}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="relative py-20 sm:py-32">
          <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
            <h2 className="mb-8 font-headline text-4xl font-extrabold leading-tight sm:text-5xl">
              Start creating invoices in seconds.
            </h2>
            <p className="mx-auto mb-12 max-w-2xl text-base text-[#464555] sm:text-xl">
              Join the new era of stress-free billing. No credit card required to start.
            </p>
            <Link className="signature-gradient kinetic-shadow mb-8 inline-block rounded-2xl px-8 py-4 font-headline text-lg font-extrabold text-white transition-all hover:scale-105 active:scale-95 sm:px-10 sm:py-5 sm:text-xl" href={primaryHref}>
              {user ? "Open Dashboard" : "Get Started Free"}
            </Link>
            <div className="flex flex-wrap items-center justify-center gap-8 text-sm font-medium text-[#464555]">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#006c49]">verified</span> No Credit Card
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#006c49]">verified</span> GST Ready
              </span>
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-sm text-[#006c49]">verified</span> 24/7 Support
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer id="resources" className="w-full bg-slate-50 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="mb-4 font-headline text-xl font-bold text-slate-900">BillSathi</div>
            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
              Making GST billing accessible, fast, and beautiful for every small business in India.
            </p>
          </div>
          <div>
            <h5 className="mb-6 font-headline text-xs font-bold uppercase tracking-widest text-slate-900">Product</h5>
            <ul className="space-y-4">
              <li><a className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href="#features">Features</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href="#pricing">Pricing</a></li>
              <li><Link className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href={user ? primaryHref : "/login"}>Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-6 font-headline text-xs font-bold uppercase tracking-widest text-slate-900">Resources</h5>
            <ul className="space-y-4">
              <li><a className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href="#solutions">Blog</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href="#pricing">GST Guide</a></li>
              <li><Link className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href="/login">Help Center</Link></li>
            </ul>
          </div>
          <div>
            <h5 className="mb-6 font-headline text-xs font-bold uppercase tracking-widest text-slate-900">Legal</h5>
            <ul className="space-y-4">
              <li><a className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href="#">Privacy Policy</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href="#">Terms of Service</a></li>
              <li><a className="text-sm text-slate-500 transition-all hover:text-indigo-600 hover:opacity-80" href="#">Security</a></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 md:flex-row">
          <p className="text-sm text-slate-500">© 2024 BillSathi. All rights reserved.</p>
          <div className="flex gap-6">
            <a className="text-slate-500 transition-all hover:text-indigo-600" href="#"><span className="material-symbols-outlined">share</span></a>
            <a className="text-slate-500 transition-all hover:text-indigo-600" href="#"><span className="material-symbols-outlined">alternate_email</span></a>
            <a className="text-slate-500 transition-all hover:text-indigo-600" href="#"><span className="material-symbols-outlined">contact_support</span></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
