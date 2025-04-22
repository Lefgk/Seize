import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { FaDiscord, FaTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="mt-auto bg-default-800 text-foreground py-4 px-4 md:px-8 lg:px-16">
      <div className="mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="flex space-x-7 mb-4 md:mb-0">

          <Link href={"/faq"}>
            <Button
              variant="link"
              className="text-foreground hover:text-primary transition-all px-0 ease-in duration-100"
            >
              FAQs
            </Button>
          </Link>
          <Link href={"/terms-of-service"}>
            <Button
              variant="link"
              className="text-foreground hover:text-primary transition-all px-0 ease-in duration-100"
            >
              Terms of Service
            </Button>
          </Link>
          <Link href={"/trade-vpn"}>
            <Button
              variant="link"
              className="text-foreground hover:text-primary transition-all px-0 ease-in duration-100"
            >
              Discounts & Referrals
            </Button>
          </Link>

        </div>
        <div className="flex space-x-4">
          <Link
            href="https://x.com/Seizefund"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground transition-all ease-in duration-150 hover:text-primary"
          >
            <FaTwitter className="h-5 w-5" />
          </Link>
          <Link
            href="https://discord.gg/3ub3XtvTKy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary"
          >
            <FaDiscord className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
