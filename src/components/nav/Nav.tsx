"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Trang chủ", target: "home", offset: -100 },
  { name: "Giới thiệu", target: "about", offset: -80 },
  { name: "Dịch vụ phổ biến", target: "trending", offset: -80 },
  { name: "Nhân sự", target: "team", offset: 0 },
  { name: "Tin tức", target: "blog", offset: -40 },
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
