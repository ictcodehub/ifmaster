// @ts-nocheck
import React from 'react';
import { Flame } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-white border-t border-gray-200 py-3 mt-auto">
            <div className="max-w-5xl mx-auto px-4">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-600">
                    <span>Made with</span>
                    <Flame size={14} className="text-orange-500 animate-pulse" fill="currentColor" />
                    <span>by Mr. Tio</span>
                    <span>|</span>
                    <span>Powered by React & Firebase</span>
                </div>
            </div>
        </footer>
    );
}
