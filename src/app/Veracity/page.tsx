'use client'

import { motion } from "framer-motion"
import { ArrowRight, Shield, Lock, Code } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function VeracityCampaign() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-950 to-black text-white overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(120,0,255,0.15),transparent_50%)]" />
        
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            
            {/* Glowing background shapes */}
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-purple-600/30 rounded-full filter blur-[128px]" />
            <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-600/20 rounded-full filter blur-[128px]" />

            {/* Title container */}
            <div className="transform -skew-y-6">
              <div className="bg-purple-600/20 backdrop-blur-sm p-8 rounded-lg shadow-[0_0_50px_rgba(168,85,247,0.4)] mb-6">
                <h1 className="text-5xl md:text-7xl font-bold text-white">
                  Veracity
                </h1>
              </div>

              <div className="bg-purple-600/20 backdrop-blur-sm p-8 rounded-lg shadow-[0_0_50px_rgba(168,85,247,0.4)] max-w-4xl">
                <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                  Our mission is to secure the decentralized internet
                </h2>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="relative px-4 py-32">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid gap-16"
          >
            {/* About Section */}
            <div className="bg-purple-900/20 backdrop-blur-sm p-8 rounded-lg transform hover:-translate-y-1 transition-transform duration-300">
              <p className="text-xl leading-relaxed mb-6">
                The DeFi landscape is changing and security has never been as in demand as it is now. Hundreds of contracts are breached or drained a day, due to hacks or failed code. In the market of decentralisation, security is of the highest value.
              </p>
              <p className="text-xl leading-relaxed">
                Veracity is a leading smart contract auditing company with an essential focus on decentralized finance protocols. We work mainly with EVM-compatible protocols to help increase the security of their contracts.
              </p>
            </div>

            {/* Services Grid */}
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-800/20 backdrop-blur-sm p-6 rounded-lg"
              >
                <Shield className="w-12 h-12 mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">Smart Contract Audits</h3>
                <p>Comprehensive security assessments for your smart contracts</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                
                className="bg-purple-800/20 backdrop-blur-sm p-6 rounded-lg"
              >
                <Lock className="w-12 h-12 mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">DeFi Security</h3>
                <p>Specialized protection for decentralized finance protocols</p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="bg-purple-800/20 backdrop-blur-sm p-6 rounded-lg"
              >
                <Code className="w-12 h-12 mb-4 text-purple-400" />
                <h3 className="text-xl font-bold mb-2">Code Review</h3>
                <p>Detailed analysis of your protocol's functionality</p>
              </motion.div>
            </div>

            {/* Main Services Section */}
            <div className="bg-gradient-to-r from-purple-900/30 to-purple-600/30 backdrop-blur-sm p-8 rounded-lg transform -skew-y-3">
              <h2 className="text-3xl font-bold mb-6">High level security audits for Web3 dApps</h2>
              <p className="text-lg mb-6">
                Our team of independent top auditors and white hat hackers are specialists in decentralized finance protocols and are ready to assist you in evaluating your project for safety, functionality, protection, and utility. We provide user-centric audits as well as contract functionality assessments.
              </p>
              <p className="text-xl font-semibold text-purple-300">
                The most competitive prices for highest of quality available, Veracity is on point.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative px-4 py-32">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-8">Get a Quote for Your Protocol</h2>
            <Link href="">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white text-lg py-6 px-8 rounded-lg shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-all duration-300"
              >
              Request an Audit
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
              </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

