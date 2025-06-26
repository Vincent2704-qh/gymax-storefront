"use client";

import Nav from "../nav/Nav";
import MobileNav from "../nav/MobileNav";
import Link from "next/link";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";
import { Input } from "../ui/input";
import { Search, ShoppingCart, Heart, CircleUser, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { getItem } from "@/lib/utils";
import { LocalStorageEnum } from "@/enum/app.enums";

const Header = () => {
  const [headerActive, setHeaderActive] = useState(false);
  const [openNav, setOpenNav] = useState(false);
  const router = useRouter();
  const userInfo = getItem(LocalStorageEnum.UserInfo);

  const handleRedireactToAccount = useCallback(() => {
    const parsedUserInfo = JSON.parse(userInfo!);
    const id = String(parsedUserInfo?.id);
    if (userInfo && userInfo) {
      router.push(`/account/${id}/details`);
    } else {
      router.push("/auth");
    }
  }, [userInfo]);

  useEffect(() => {
    const handleScroll = () => {
      setHeaderActive(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`${
        headerActive ? "h-[100px]" : "h-[124px]"
      } fixed max-w-[1920px] top-0 w-full bg-primary-200 transition-all z-50`}
    >
      <div
        className="container mx-auto h-full
    lg:grid lg:grid-cols-12 lg:gap-6 lg:p-6
    flex items-center justify-between px-4 py-3"
      >
        <div className="lg:col-span-2 ml-2 lg:ml-8">
          <Link href={"/"} className="">
            <Image
              src={"/img/logo.png"}
              alt="Logo"
              width={130}
              height={60}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Nav */}
        <div className="col-span-5">
          <Nav containerStyles="hidden lg:flex gap-8 text-white text-base uppercase font-medium" />
        </div>

        {/* Search */}
        <div className="hidden lg:flex items-center col-span-3">
          <div className="relative w-full">
            <Input
              type="text"
              placeholder="Search"
              className="pl-4 pr-10 py-2 text-white w-full bg-transparent border border-white/30 focus:outline-none focus:ring-1 focus:ring-accent rounded-md"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-white w-5 h-5" />
          </div>
        </div>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-6 text-white text-base uppercase font-medium col-span-2">
          <CircleUser
            className="text-2xl cursor-pointer hover:text-accent"
            onClick={handleRedireactToAccount}
          />
          <ShoppingCart
            className="text-2xl cursor-pointer hover:text-accent"
            onClick={() => router.push("/cart")}
          />
          <button
            onClick={() => router.push("/shop")}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition-all"
          >
            <Store className="w-5 h-5" />
            Mua sắm
          </button>
        </div>

        <button
          onClick={() => setOpenNav(!openNav)}
          className="text-white lg:hidden"
        >
          <MdMenu className="text-4xl" />
        </button>
      </div>

      {/* Mobile Nav */}
      <MobileNav
        containerStyles={`${headerActive ? "top-[90px]" : "top-[124px]"} 
          ${
            openNav
              ? "max-h-max pt-8 pb-10 border-t border-white/10"
              : "max-h-0 pt-0 pb-0 overflow-hidden border-white/0"
          } lg:hidden text-white flex flex-col text-center gap-8 fixed bg-primary-200 w-full left-0 text-base uppercase font-medium transition-all`}
      />
    </header>
  );
};

export default Header;
