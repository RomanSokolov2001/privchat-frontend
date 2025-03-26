import React from "react";

const WhiteFrame = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col justify-between p-20 bg-white min-h-[200px] rounded-xl">
            {children}
        </div>
    );
};

export default WhiteFrame;
