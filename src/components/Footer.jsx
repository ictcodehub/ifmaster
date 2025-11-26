// @ts-nocheck
import React from 'react';
import { Heart } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 mt-8 py-4">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                        <span>Made with</span>
                        <Heart size={14} className="text-red-500" fill="currentColor" />
                        <span>by Excel IF Master Team</span>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                        <span>© 2025 Excel IF Master</span>
                        <span className="hidden md:inline">•</span>
                        <span>Powered by React & Firebase</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
