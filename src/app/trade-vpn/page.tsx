'use client'

import Image from '@/components/ui/image'
import Link from 'next/link'

const referralLinks = {
  nordvpn: [
    { name: 'NordVPN', url: 'https://go.nordvpn.net/aff_c?offer_id=15&aff_id=114697&url_id=902' },
    { name: 'NordPass', url: 'https://go.nordpass.io/aff_c?offer_id=488&aff_id=114697&url_id=9356' },
  ],
  surfshark: [
    { name: 'Surfshark VPN', url: 'https://get.surfshark.net/aff_c?offer_id=926&aff_id=36130' },
    { name: 'Surfshark Alternative Number', url: 'https://get.surfshark.net/aff_c?offer_id=1691&aff_id=36130' },
    { name: 'Surfshark Search', url: 'https://get.surfshark.net/aff_c?offer_id=1679&aff_id=36130' },
    { name: 'Surfshark CleanWeb / Adblocker 50% RevShare', url: 'https://get.surfshark.net/aff_c?offer_id=1671&aff_id=36130' },
    { name: 'Incogni Revenue Share', url: 'https://get.incogni.io/aff_c?offer_id=1655&aff_id=36130' },
    { name: 'Surfshark CleanWeb / Adblocker', url: 'https://get.surfshark.net/aff_c?offer_id=1498&aff_id=36130' },
    { name: 'Surfshark Alternative-ID', url: 'https://get.surfshark.net/aff_c?offer_id=1421&aff_id=36130' },
    { name: 'Surfshark Alert', url: 'https://get.surfshark.net/aff_c?offer_id=1420&aff_id=36130' },
    { name: 'Surfshark One', url: 'https://get.surfshark.net/aff_c?offer_id=1249&aff_id=36130' },
    { name: 'Surfshark Antivirus', url: 'https://get.surfshark.net/aff_c?offer_id=934&aff_id=36130' },
  ],
  vbot: [
    { name: 'VBOT', url: 'https://t.me/VtopiaBot?start=ref_45_w5gq5u' },
  ],
  hostinger: [
    { name: 'Hostinger', url: 'https://www.hostinger.com/referral?REFERRALCODE=P0ADIEHARXFJ' },
    { name: 'Premium Web Hosting', url: 'https://www.hostinger.com/cart?product=hosting:hostinger_premium&period=12&referral_type=cart_link&REFERRALCODE=P0ADIEHARXFJ&referral_id=01949038-78a8-7366-97fd-0af8202167df' },
    { name: 'Business Web Hosting', url: 'https://www.hostinger.com/cart?product=hosting:hostinger_business&period=12&referral_type=cart_link&REFERRALCODE=P0ADIEHARXFJ&referral_id=01949038-bcc3-724f-941b-a1b72af0f821' },
    { name: 'Cloud Startup', url: 'https://www.hostinger.com/cart?product=hosting:cloud_economy&period=12&referral_type=cart_link&REFERRALCODE=P0ADIEHARXFJ&referral_id=01949038-d9f9-70bd-ad17-ecac65f57860' },
  ],
}

export default function Home() {
  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(referralLinks).map(([category, links]) => (
            <div key={category} className="bg-white/5 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-4 capitalize">{category}</h2>
                <div className="flex mb-6">
                  <Image
                    src={`/referrals/${category}.png`}
                    alt={`${category} logo`}
                    className="rounded-md overflow-hidden w-[100px] max-w-full"
                  />
                </div>
                <ul className="space-y-2">
                  {links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.url}
                        className="text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

