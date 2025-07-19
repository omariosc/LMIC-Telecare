"use client";

import React from "react";

export const AnimatedElement = ({
  children,
  className = "",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  [key: string]: any;
}) => {
  // Temporarily simplified for successful build
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
};
