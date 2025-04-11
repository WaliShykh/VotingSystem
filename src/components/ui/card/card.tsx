import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card = ({ children, className }: CardProps) => (
  <div className={`bg-white shadow-md rounded-md p-6 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="text-gray-600">{children}</div>
);

export { Card, CardContent };
