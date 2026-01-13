import moment from "moment";
import type { MutualFundScheme } from "../types/mutual-funds";

export default function FundHeader({ scheme, duration }: { scheme: MutualFundScheme; duration?: string }) {
    const currentNav = scheme.nav ? parseFloat(scheme.nav) : 0;

    return (
        <section className="mb-4 border border-blue-500/30 rounded-lg p-4" >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        {scheme.schemeName}
                    </h1>

                    {scheme.fundHouse && (
                        <p className="text-blue-300 text-lg mb-2">
                            <span className="text-blue-400 font-semibold">Fund House:</span> {scheme.fundHouse}
                        </p>
                    )}
                    {
                        duration && (
                            <p className="text-blue-300 text-lg">
                                <span className="text-blue-400 font-semibold">Investment Duration:</span> {duration}
                            </p>

                        )
                    }
                </div>

                {/* Latest NAV */}
                <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/50 rounded-lg p-2 text-right lg:min-w-48">
                    <p className="text-blue-300 text-sm mb-1">Latest NAV</p>
                    <p className="text-xl font-bold text-cyan-300 mb-1">₹{currentNav.toFixed(2)}</p>
                    {scheme.date && (
                        <p className="text-blue-400 text-md font-bold">As of {moment(scheme.date, 'DD-MM-YYYY').format('Do MMM YYYY')}</p>
                    )}
                </div>
            </div>
        </section >
    )
}