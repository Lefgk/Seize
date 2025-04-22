'use client'

import { motion } from "framer-motion"
import { Rocket, Paintbrush, BarChart, Video } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import Link from "next/link"

const services = [
  {
    icon: Rocket,
    title: "Digital Marketing",
    description:
      "Strategic digital marketing solutions to grow your online presence and drive measurable results. We specialize in SEO, social media marketing, content strategy, and paid advertising campaigns.",
  },
  {
    icon: Paintbrush,
    title: "Digital Design",
    description:
      "Creative and innovative design solutions that capture your brand's essence. From UI/UX design to graphic design, we create visually stunning assets that engage and inspire.",
  },
  {
    icon: BarChart,
    title: "Brand Management",
    description:
      "Comprehensive brand management services to build and maintain a strong, consistent brand identity. We help develop brand strategies, guidelines, and positioning to set you apart.",
  },
  {
    icon: Video,
    title: "Video Editing",
    description:
      "Professional video editing services that tell your story with impact. From promotional content to social media videos, we create engaging visual narratives that captivate your audience.",
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
}

export default function ServicesSection() {
  return (
    <section className="relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-background to-background/80 py-24">
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:60px_60px]" />
      <div className="container relative">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Our Professional Services
          </h2>
          <p className="text-muted-foreground">
            Elevating your brand with cutting-edge solutions
          </p>
        </div>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {services.map((service, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="group relative h-full overflow-hidden border-muted-foreground/20 transition-colors hover:border-primary">
                <CardHeader>
                  <div className="mb-4 inline-flex rounded-xl bg-primary/10 p-3 text-primary">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold">{service.title}</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              </Card>
            </motion.div>
          ))}
        </motion.div>
        <div className="mt-20 text-center">
          <div className="relative mx-auto max-w-2xl">
            <h3 className="mb-4 text-3xl font-bold">Ready to Transform Your Brand?</h3>
            <p className="mb-8 text-muted-foreground">
              Let&apos;s create something amazing together
            </p>
            <Link href={"https://discord.gg/9ESFD8sJ"} target="_blank">
            <Button size="lg" className="font-semibold">
              Get Started
            </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

