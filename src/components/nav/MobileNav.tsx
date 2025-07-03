"use client";

import { useMediaQuery } from "react-responsive";
import { Link as ScrollLink } from "react-scroll";

const links = [
  { name: "Trang chủ", target: "home", offset: -100 },
  { name: "Giới thiệu", target: "about", offset: -80 },
  { name: "Dịch vụ phổ biến", target: "trending", offset: -80 },
  { name: "Nhân sự", target: "team", offset: 0 },
  { name: "Tin tức", target: "blog", offset: -40 },
];

const MobileNav = ({ containerStyles }: { containerStyles: string }) => {
  const isMobile = useMediaQuery({
    query: "(max-width: 640px)",
  });

  return (
    <nav className={`${containerStyles}`}>
      {links.map((link, index) => {
        return (
          <ScrollLink
            offset={link.offset}
            to={link.target}
            smooth
            spy
            activeClass={`${!isMobile && "active"}`}
            className="cursor-pointer hover:text-accent transition-all"
            key={index}
          >
            {link.name}
          </ScrollLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;
