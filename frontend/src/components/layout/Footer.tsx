"use client";

import { Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "../ui/Button";

export const Footer = () => {
    return (
        <footer className="bg-[#0f0f0f] text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 mb-16 border-b border-white/10 pb-16">

                {/* Brand Column */}
                <div className="space-y-6">
                    <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--gold-light)] to-[var(--gold-primary)]">
                        TeleMedCare
                    </h3>
                    <p className="text-gray-400 leading-relaxed">
                        Pioneering the future of digital healthcare with AI-driven diagnostics and world-class medical expertise.
                    </p>
                    <div className="flex gap-4">
                        {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                            <div key={i} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--gold-primary)] hover:text-black transition-colors cursor-pointer">
                                <Icon size={18} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="text-lg font-bold mb-6 text-[var(--gold-light)]">Platform</h4>
                    <ul className="space-y-4 text-gray-400">
                        {['About Us', 'Our Doctors', 'Specialties', 'Pricing', 'Testimonials'].map(item => (
                            <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                        ))}
                    </ul>
                </div>

                {/* Legal */}
                <div>
                    <h4 className="text-lg font-bold mb-6 text-[var(--gold-light)]">Legal</h4>
                    <ul className="space-y-4 text-gray-400">
                        {['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Cookie Policy'].map(item => (
                            <li key={item}><a href="#" className="hover:text-white transition-colors">{item}</a></li>
                        ))}
                    </ul>
                </div>

                {/* Newsletter */}
                <div>
                    <h4 className="text-lg font-bold mb-6 text-[var(--gold-light)]">Stay Updated</h4>
                    <p className="text-gray-400 mb-4 text-sm">Subscribe for health tips and platform updates.</p>
                    <div className="flex gap-2">
                        <input type="email" placeholder="Your Email" className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 w-full focus:border-[var(--gold-primary)] outline-none" />
                        <Button variant="primary" className="px-4">Go</Button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
                <p>&copy; {new Date().getFullYear()} TeleMedCare Inc. All rights reserved. Designed with Gold Standard.</p>
            </div>
        </footer>
    );
};
