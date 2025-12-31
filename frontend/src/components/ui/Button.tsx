"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "glass";
    children: ReactNode;
    icon?: ReactNode;
}

export const Button = ({ variant = "primary", children, icon, className, ...props }: ButtonProps) => {
    const baseStyle = "px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 shadow-lg";

    const variants = {
        primary: "bg-gradient-to-r from-[var(--gold-primary)] to-[var(--gold-dark)] text-white hover:scale-105 hover:shadow-xl border border-transparent",
        secondary: "bg-white text-[var(--gold-dark)] border border-[var(--gold-primary)] hover:bg-[var(--bg-warm)] hover:scale-105",
        outline: "bg-transparent border-2 border-[var(--gold-primary)] text-[var(--gold-primary)] hover:bg-[var(--gold-primary)] hover:text-white",
        glass: "glass-panel text-[var(--text-primary)] hover:bg-white/90 border border-[var(--glass-border)]"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ y: -2 }}
            className={`${baseStyle} ${variants[variant]} ${className || ""}`}
            {...props}
        >
            {children}
            {icon && <span className="ml-1">{icon}</span>}
        </motion.button>
    );
};
