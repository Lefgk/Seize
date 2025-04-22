"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Code, Palette, Megaphone, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import logo from "@/Images/bg5.webp";
import Link from "next/link";
export default function Page() {
  return (
    <div className="min-h-screen bg-black text-gray-100 overflow-hidden">
      {/* <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black" /> */}
      <div className="relative">
        <main>
          <Hero />
          <About />
          <Services />
          <Vision />
          <Initiatives />
          <Team />
        </main>
        <Footer />
      </div>
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-20 pb-32 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-center mb-12">
          <img className="w-10 h-10 rounded-full" src={logo.src} alt="" />
          <span className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-200">
            SUPERNOVA
          </span>
        </div>
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center rounded-full border border-purple-500/20 bg-purple-500/5 px-4 py-2 text-sm text-purple-300 backdrop-blur-sm mb-8">
            <span className="flex h-2 w-2 rounded-full bg-purple-500 mr-2" />
            Empowering DeFi Projects
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500 leading-tight">
            Supernova: Empowering DeFi to Reach Astronomical Heights
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl mb-12 text-gray-400 max-w-3xl mx-auto">
            Launching the next generation of Web3 projects into the
            stratosphere.
          </p>
          <Link href={"https://discord.gg/74eCKsww"} target="_blank">
            <Button className="bg-purple-600 hover:bg-purple-700 text-white text-xl px-8 py-6 h-auto rounded-full shadow-xl shadow-purple-500/20 w-full sm:w-auto transition-all duration-300 hover:scale-105">
              Launch with Us <ArrowRight className="ml-2 h-6 w-6" />
            </Button>
          </Link>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    </section>
  );
}

function About() {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          Who We Are
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="bg-purple-900/10 backdrop-blur-sm border border-purple-500/10 rounded-3xl p-8 sm:p-12 space-y-6 hover:border-purple-500/30 transition-all duration-300">
            <p className="text-xl sm:text-2xl text-gray-300">
              Welcome to the Future of Web3. We are a Web3 Incubator that WILL
              elevate projects to astronomical heights.
            </p>
            <p className="text-xl sm:text-2xl text-gray-300">
              We bridge the gap between web 2 and web 3 in a meaningful
              capacity, bringing the retail average investor into this world of
              DeFi.
            </p>
            <p className="text-xl sm:text-2xl text-gray-300">
              Our mission is to present the best of the best projects to the Web
              3 world.
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-purple-400">
              Bring a helmet…
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const services = [
    {
      title: "Blockchain/Contract Development",
      description: "Expert smart contract development and blockchain solutions",
      icon: Code,
    },
    {
      title: "Website Design & Development",
      description: "Comprehensive development and marketing services",
      icon: Palette,
    },
    {
      title: "Marketing & Moderation",
      description: "A superstar team",
      icon: Megaphone,
    },
    {
      title: "Consultancy",
      description: "Expert guidance every step of the way",
      icon: Briefcase,
    },
  ];

  return (
    <section id="services" className="py-24 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          Services
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-purple-900/10 backdrop-blur-sm border border-purple-500/10 rounded-3xl p-8 hover:border-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <service.icon className="h-16 w-16 text-purple-400 mb-6 group-hover:scale-110 transition-transform duration-300" />
              <h3 className="text-2xl font-semibold mb-4 text-gray-200">
                {service.title}
              </h3>
              <p className="text-gray-400 text-lg">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Vision() {
  return (
    <section id="vision" className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          Our Vision & Mission
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-purple-900/10 backdrop-blur-sm border border-purple-500/10 rounded-3xl p-8 sm:p-12 hover:border-purple-500/30 transition-all duration-300">
            <h3 className="text-3xl font-semibold mb-6 text-purple-400">
              Our Vision
            </h3>
            <p className="text-xl mb-8 text-gray-300">
              Decentralized finance (DeFi) has become mainstream and we want YOU
              to be ready.
            </p>
            <h3 className="text-3xl font-semibold mb-6 text-purple-400">
              Our Mission
            </h3>
            <ul className="list-none space-y-4 text-gray-300 text-lg">
              {[
                "Unite visionaries, tech innovators, and thrill seekers.",
                "Push the boundaries of publicly available technology and financial operations.",
                "Overcome challenges like high risks and low regulation to unlock DeFi's full potential.",
                "Bridge the gap between Web 2 and Web 3, and push Web 3 to the mainstream.",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="h-2 w-2 rounded-full bg-purple-500 mt-2 mr-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-purple-900/10 backdrop-blur-sm border border-purple-500/10 rounded-3xl p-8 sm:p-12 hover:border-purple-500/30 transition-all duration-300">
            <h3 className="text-3xl font-semibold mb-6 text-purple-400">
              Supernova's Role
            </h3>
            <ul className="list-none space-y-4 text-gray-300 text-lg">
              {[
                "Leveraging our team's extensive experience, we ensure highest levels of safety and security.",
                "Assisting with the building blocks of your project from the ground up; from visualisation, conceptualisation, development, launch and beyond.",
                "For projects already well on the way to release, we assist with a multitude of competitive services aimed to make your project a success in this brutal landscape.",
                "We will unite DeFi under one banner.",
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="h-2 w-2 rounded-full bg-purple-500 mt-2 mr-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

function Initiatives() {
  const initiatives = [
    "Build communities",
    "Special/unique clients",
    "Unlimited expansion",
    "Market maker/communication",
    "Custom bots/functions",
    "Auditing in-house",
    "Estimates tracking",
    "Staff management/interaction",
    "Contract approval",
    "Partnerships/link-ups",
    "Time/value/expense tracking",
    "Daily/weekly reports",
  ];

  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent" />
      <div className="container mx-auto px-4 relative">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          Key Initiatives
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {initiatives.map((initiative, index) => (
            <div
              key={index}
              className="group bg-purple-900/10 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-6 hover:border-purple-500/30 transition-all duration-300 flex items-center space-x-4"
            >
              <span className="h-3 w-3 rounded-full bg-purple-500 shrink-0 group-hover:scale-125 transition-transform duration-300" />
              <span className="text-gray-300 group-hover:text-purple-300 transition-colors text-lg">
                {initiative}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  const team = [
    { name: "Tears", role: "Project Founder" },
    { name: "Andy", role: "Operations and Consultancy + Communications" },
    { name: "Thomas", role: "Community Management" },
    { name: "Khan", role: "Product Coordination, VC advisory" },
    { name: "Zero", role: "Brand + Design" },
    { name: "Kommisar", role: "Development Lead" },
  ];

  return (
    <section id="team" className="py-24 relative">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-200">
          Meet the Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <div
              key={index}
              className="group bg-purple-900/10 backdrop-blur-sm border border-purple-500/10 rounded-2xl p-8 hover:border-purple-500/30 transition-all duration-300 hover:scale-105"
            >
              <h3 className="text-2xl font-semibold mb-2 text-center text-gray-200 group-hover:text-purple-400 transition-colors">
                {member.name}
              </h3>
              <p className="text-gray-400 text-center text-lg">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="relative py-12 sm:py-16 mt-16 sm:mt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-purple-900/30 via-transparent to-transparent" />
      <div className="container mx-auto px-4 relative">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="flex items-center">
            <img className="w-10 h-10 rounded-full" src={logo.src} alt="" />
            <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-purple-200">
              Supernova
            </span>
          </div>
          <div className="max-w-3xl mx-auto px-4">
            <p className="mb-6 text-gray-400 text-lg">
              Pioneering the future of Web3 through innovation, collaboration,
              and cutting-edge technology. Join us on our mission to
              revolutionize the digital landscape.
            </p>
            <p className="text-sm text-gray-500">
              © {currentYear} Supernova. All rights reserved. |
              <a
                href="#"
                className="hover:text-purple-400 transition-colors ml-2"
              >
                Privacy Policy
              </a>{" "}
              |
              <a
                href="#"
                className="hover:text-purple-400 transition-colors ml-2"
              >
                Terms of Service
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
