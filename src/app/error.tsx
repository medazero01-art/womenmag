"use client";

import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
            <h2 className="text-xl font-bold font-poppins text-gray-800">Une erreur est survenue !</h2>
            <p className="text-gray-500 text-sm">{error.message || "Erreur inattendue"}</p>
            <button
                onClick={reset}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            >
                Réessayer
            </button>
        </div>
    );
}
