"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, Calendar, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface CartItem {
    medicineId: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartModalProps {
    isOpen: boolean;
    onClose: () => void;
    cart: CartItem[];
    updateQuantity: (id: number, delta: number) => void;
    removeFromCart: (id: number) => void;
    placeOrder: () => void;
    deliveryDate: string;
    setDeliveryDate: (date: string) => void;
    cartTotal: number;
    loadingOrder: boolean;
}

export const CartModal = ({
    isOpen, onClose, cart, updateQuantity, removeFromCart,
    placeOrder, deliveryDate, setDeliveryDate, cartTotal, loadingOrder
}: CartModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-md bg-white shadow-2xl p-6 flex flex-col"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <ShoppingCart className="text-[var(--gold-primary)]" /> Your Cart
                            </h2>
                            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4">
                            {cart.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                    <ShoppingCart size={48} className="mb-2 opacity-50" />
                                    <p>Your cart is empty</p>
                                </div>
                            ) : (
                                cart.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center border-b border-gray-100 pb-4">
                                        <div className="flex-1">
                                            <p className="font-bold">{item.name}</p>
                                            <p className="text-sm text-gray-500">₹{item.price}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.medicineId, -1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-bold w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.medicineId, 1)}
                                                className="p-1 hover:bg-gray-100 rounded"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <div className="ml-4 text-right">
                                            <p className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</p>
                                            <button
                                                onClick={() => removeFromCart(item.medicineId)}
                                                className="text-xs text-red-400 hover:text-red-600 mt-1"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {cart.length > 0 && (
                            <div className="pt-4 border-t border-gray-100 space-y-4">
                                <div className="flex justify-between items-center text-xl font-bold">
                                    <span>Total</span>
                                    <span>₹{cartTotal.toFixed(2)}</span>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-bold flex items-center gap-2 text-gray-600">
                                        <Calendar size={16} /> Requested Delivery Date
                                    </label>
                                    <input
                                        type="datetime-local"
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[var(--gold-primary)] outline-none"
                                        value={deliveryDate}
                                        onChange={(e) => setDeliveryDate(e.target.value)}
                                    />
                                </div>

                                <Button
                                    variant="primary"
                                    className="w-full h-12 text-lg"
                                    onClick={placeOrder}
                                    disabled={loadingOrder}
                                >
                                    {loadingOrder ? "Processing..." : "Place Order"}
                                </Button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
