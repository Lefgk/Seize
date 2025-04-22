'use client'

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

const Page = () => {
    return (
        <div className="w-full space-y-3 px-4 md:px-8 py-4 md:py-4">
            <h1 className="text-4xl font-bold my-8">Seize FAQs</h1>

            <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="what-is-seize">
                    <AccordionTrigger>What is SEIZE?</AccordionTrigger>
                    <AccordionContent>
                        Seize is an online crowdfunding platform that brings Investors together to support crowdfunding campaigns featuring innovative products, creative design, and inspired ventures. It allows Seizers to launch and seek to raise funds for their own Campaigns and to contribute to the Campaigns of others. Campaign Owners can offer Perks, Percent return, Percent ownership, etc to the Investors as a thanks for the Investors' offering of funds.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="recommend-investments">
                    <AccordionTrigger>Do we recommend investments?</AccordionTrigger>
                    <AccordionContent>
                        NO! We are not financial advisors. We employ a number of checks and balances to our website in order to weed out as many bad actors where possible. However, scams have been a part of business since the beginning of time, and will never stop. We cannot recommend, or say that an investment is "safe". We can however do absolutely every check these projects will allow us to do and allow you to know which ones they passed with a cool sticker system. These stickers, or Seize Badges, all have a specific meaning and will show what information we have verified from the project and team.
                        <br /><br />
                        Just to be as plain and clear as possible about this: There are NO projects, no matter where it appears on our website, social media, or our mailers, that we endorse. We do offer advice, help, and even offer services to some of these projects. When this happens it will be announced for transparency purposes. Also, the team from Seize may be on other project's teams in the space. This also is not a direct endorsement from Seize for their project.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="risk-level">
                    <AccordionTrigger>What is the level of risk here?</AccordionTrigger>
                    <AccordionContent>
                        High. Very high. Especially if you are an inexperienced investor. You should only invest what you can afford to lose. Only invest so much that it won't impact your lifestyle or retirement plans. Every investment on Seize is much riskier than a public company on the stock market. You may lose every dollar you invest on Seize.
                        <br /><br />
                        Although not all information will be made public in the beginning, we will make ALL information known if a project breaches their contract with us to honor their promises.
                        We will dox any project that attempts to circumvent our contractual agreements.
                        We will dox any project that performs illegal actions.
                        We will post only information requested by the Seizer in question until such time as an issue arises which breaches the contract or law of the land.
                        <br /><br />
                        Investing in the private crypto market carries higher risks than investing in the traditional markets. Therefore, investors should exercise extra caution and conduct thorough due diligence before making any investment decisions. One way to do this is to review all the available materials provided by the company. In conclusion it is up to the investors to evaluate the quality of each Seize campaign and make informed decisions based on their own research.
                        <br /><br />
                        Seize understands that the experience of our investors and donors is extremely important for our success and growth. We are determined to put our investors on the same level as our Seizers to give them the best experience possible. Both parties will be treated as if they were top tier investors or multimillion dollar businesses from the beginning. We will protect our investors from bad actors to the best of our ability while ensuring our Seizers are introduced to the community in a fair and serious manner.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="lessen-risk">
                    <AccordionTrigger>Is there a way to lessen my risk?</AccordionTrigger>
                    <AccordionContent>
                        Diversification and investing from an educated stance are the two most important risk management tactics you can employ. Never invest in something if you can't understand how it's going to make you money. Also, diversification is important in any portfolio. Finding out how to do this without diluting your returns will involve research on the User's part. Knowing and following the teams behind the startup, project, or venture will give you an advantage over blind investors. Professional investors have specifically tailored strategies when investing in highly volatile/risky markets such as start ups especially in the crypto space.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="platform-right">
                    <AccordionTrigger>Is the Seize platform right for me?</AccordionTrigger>
                    <AccordionContent>
                        Only if you have disposable income that you won't need in the next 3-7+ years. Start-up investing is an extremely long-term venture. Do NOT invest with funds you may need anytime within the near to distant future. Retrieving funds after your position has been purchased in a project may be impossible. This will depend on if the project sets up a method for OTC (Over The Counter) trades to be made P2P (Party to Party).
                        <br /><br />
                        You might strongly believe in a company's future success, but it's safer to think of an equity investment as a lottery ticket that might pay off in the long term.
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="offer-loans">
                    <AccordionTrigger>Do you offer loans to projects?</AccordionTrigger>
                    <AccordionContent>
                        Not at the moment, but coming soon will be the SEIZE Borrowing and Lending (Sbal). This will only be eligible for incorporated companies, LLCs, or doxxed persons within the participating countries. There are an astronomical amount of legal hurdles associated with facilitating crowdsourced loans with a percent return promised to the investing party.
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}


export default Page