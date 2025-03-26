import React from "react";

const PageBackground = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex items-center justify-center min-h-screen min-w-screen bg-gray-200">
            {children}
        </div>
    );
};

export default PageBackground;
