"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "home", target: "home", offset: -100 },
  { name: "about", target: "about", offset: -80 },
  { name: "service", target: "service", offset: -80 },
  { name: "team", target: "team", offset: 0 },
  { name: "prices", target: "prices", offset: -40 },
];

const Nav = ({ containerStyles }: { containerStyles: string }) => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <nav className={`${containerStyles}`}>
      {links.map((link, index) => (
        <Link
          key={index}
          href={`/#${link.target}`}
          scroll={true}
          className="cursor-pointer hover:text-accent transition-all capitalize"
        >
          {link.name}
        </Link>
      ))}
    </nav>
  );
};

export default Nav;
