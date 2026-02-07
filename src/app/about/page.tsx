"use client";

import { useLanguage } from "@/context/LanguageContext";
import { Star, Heart, ShieldCheck } from "lucide-react";

export default function AboutPage() {
    const { t, dir } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-16" dir={dir}>
            <div className="max-w-3xl mx-auto text-center mb-16">
                <h1 className="text-4xl font-bold font-poppins mb-6 text-primary">{t.aboutPage?.title || "Women Mag"}</h1>
                <p className="text-xl text-text-secondary italic mb-8">
                    "{t.aboutPage?.subtitle}"
                </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-12">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 leading-relaxed text-lg text-text-primary">
                    <p className="mb-6">{t.aboutPage?.content1}</p>
                    <p>{t.aboutPage?.content2}</p>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-center mb-10">{t.aboutPage?.valuesTitle}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-secondary/20 p-6 rounded-xl text-center hover:bg-secondary/30 transition-colors">
                            <Star className="w-10 h-10 mx-auto text-primary mb-4" />
                            <h3 className="font-bold text-lg">{t.aboutPage?.value1}</h3>
                        </div>
                        <div className="bg-secondary/20 p-6 rounded-xl text-center hover:bg-secondary/30 transition-colors">
                            <Heart className="w-10 h-10 mx-auto text-red-500 mb-4" />
                            <h3 className="font-bold text-lg">{t.aboutPage?.value2}</h3>
                        </div>
                        <div className="bg-secondary/20 p-6 rounded-xl text-center hover:bg-secondary/30 transition-colors">
                            <ShieldCheck className="w-10 h-10 mx-auto text-green-600 mb-4" />
                            <h3 className="font-bold text-lg">{t.aboutPage?.value3}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
