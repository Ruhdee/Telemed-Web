"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Define simplified roles
export type UserRole = "patient" | "doctor" | "pharmacist" | "admin";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const router = useRouter();

    // Load from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('token');
        if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (email: string, password: string) => {
        const response = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        const userData: User = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);

        // Redirect based on role
        if (userData.role === "patient") router.push("/dashboard");
        else if (userData.role === "doctor") router.push("/doctor");
        else if (userData.role === "pharmacist") router.push("/dashboard"); // or appropriate page
        else router.push("/dashboard");
    };

    const register = async (name: string, email: string, password: string, role: UserRole) => {
        const response = await fetch(`${API_BASE}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }

        const data = await response.json();
        const userData: User = {
            id: data.id,
            name: data.name,
            email: data.email,
            role: data.role,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', data.token);

        // Redirect based on role
        if (userData.role === "patient") router.push("/dashboard");
        else if (userData.role === "doctor") router.push("/doctor");
        else if (userData.role === "pharmacist") router.push("/dashboard");
        else router.push("/dashboard");
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        router.push("/");
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
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
