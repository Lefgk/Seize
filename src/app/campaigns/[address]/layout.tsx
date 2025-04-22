import React, { ReactNode } from "react"

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="px-4 md:px-8 py-4 md:py-4">
            {children}
        </div>
    )
};

export default Layout;
