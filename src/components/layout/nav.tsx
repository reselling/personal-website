"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/now", label: "Now" },
  { href: "/thoughts", label: "Thoughts" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center justify-between py-6">
      <Link href="/" className="text-lg font-semibold">
        Mario Barraza
      </Link>
      <div className="flex gap-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm transition-colors hover:text-foreground ${
              (link.href === "/" ? pathname === "/" : pathname.startsWith(link.href))
                ? "text-foreground"
                : "text-foreground/60"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
