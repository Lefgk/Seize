"use client";
import { Button } from "@/components/ui/button";
import { GiHamburgerMenu } from "react-icons/gi";
import { ConnectButton } from "../utils/wallet/ConnectButton";
import Image from "../ui/image";
import { IconButton } from "../ui/icon-button";
import { cn } from "@/utils/helpers";
import { useState } from "react";
import { RxCross2 } from "react-icons/rx";
import Link from "next/link";
import { FaDiscord, FaXTwitter } from "react-icons/fa6";
import { usePathname } from "next/navigation";
import { ChainSelector } from "../utils/ChainSelector";

const socials = [
  { link: "https://x.com/SEIZE_web3", label: "Twitter", icon: <FaXTwitter /> },
  {
    link: "https://discord.gg/3ub3XtvTKy",
    label: "Discord",
    icon: <FaDiscord />,
  },
];

const pages = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Docs",
    href: "/docs",
  },
  {
    label: "Campaigns",
    href: "/campaigns",
  },
  {
    label: "Start Campaign",
    href: "/campaigns/create",
  },
  {
    label: "My Campaigns",
    href: "my-campaigns",
  },
  {
    label: "Bridge",
    href: "/bridge",
    hidden: true,
  },
];
export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className="flex h-16 w-full items-center justify-between border-b px-4">
        <div className="flex items-center">
          <div className="flex py-5 items-center uppercase px-4 gap-2 text-2xl font-extrabold">
            <Image
              src={"/logo-transparent.png"}
              alt="logo"
              containerClassName="w-[1.7rem] h-[1.7rem]"
            />
            <div>Seize</div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-10">
          {pages
            .filter((page) => !page.hidden)
            .map((x, i) => (
              <Link
                href={x.href}
                key={i}
                data-active={x.href === pathname}
                onClick={() => {
                  setMenuOpen(false);
                }}
                className="text-base cursor-pointer data-[active=true]:text-primary font-semibold text-white my-4 hover:text-primary transition-all ease-in duration-150 relative"
              >
                {x.label}
              </Link>
            ))}
        </div>
        <div className="flex items-center space-x-2">
          <div className="hidden md:block">
            <ChainSelector />
          </div>
          <ConnectButton />
          <Button
            className="w-9 h-9 md:hidden"
            onClick={() => setMenuOpen(true)}
          >
            <GiHamburgerMenu />
          </Button>
        </div>
      </nav>
      <div
        className={cn(
          "fixed inset-0 bg-black/80 h-screen backdrop-blur-md transition-all duration-300 ease-in-out z-[30] md:hidden"
        )}
        style={{
          clipPath: menuOpen
            ? "circle(150% at top right)"
            : "circle(0% at top right)",
        }}
      >
        <div className="flex flex-col justify-center items-center w-full h-full p-5 relative">
          <IconButton
            className="absolute top-4 right-4 text-foreground"
            onClick={() => setMenuOpen(false)}
          >
            <RxCross2 className="h-6 w-6" />
          </IconButton>
          <div className="mt-12"></div>

          {pages.map((x, i) => (
            <Link
              href={x.href}
              key={i}
              onClick={() => {
                setMenuOpen(false);
              }}
              className="text-base cursor-pointer font-semibold text-white my-4 hover:text-primary transition-all ease-in duration-150 relative"
            >
              {x.label}
            </Link>
          ))}

          <div>
            <ChainSelector />
          </div>

          <ConnectButton className="w-full mt-5" />

          <div className="flex mt-4 justify-center flex-wrap gap-2 text-white">
            {socials.map((x) => (
              <Link
                key={x.label}
                href={x.link}
                target="_blank"
                className="text-white p-3 rounded-full bg-black/25 hover:bg-primary/50 transition-all ease-in duration-150 disabled:opacity-50"
                //  isDisabled={x.disabled}
              >
                {x.icon}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}


