"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define simplified roles
export type UserRole = "patient" | "doctor" | "nurse" | null;

interface AuthContextType {
    userRole: UserRole;
    isLoggedIn: boolean;
    login: (role: UserRole) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userRole, setUserRole] = useState<UserRole>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    // Load from localStorage on mount (simple persistence)
    useEffect(() => {
        const storedRole = localStorage.getItem("telemed_user_role") as UserRole;
        if (storedRole) {
            setUserRole(storedRole);
            setIsLoggedIn(true);
        }
    }, []);

    const login = (role: UserRole) => {
        setUserRole(role);
        setIsLoggedIn(true);
        localStorage.setItem("telemed_user_role", role || "");

        // Redirect based on role
        if (role === "patient") router.push("/dashboard");
        else if (role === "doctor") router.push("/doctor");
        else if (role === "nurse") router.push("/nurse");
        else router.push("/");
    };

    const logout = () => {
        setUserRole(null);
        setIsLoggedIn(false);
        localStorage.removeItem("telemed_user_role");
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ userRole, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
