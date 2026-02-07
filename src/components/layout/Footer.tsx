import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-secondary/30 mt-auto pt-10 pb-6 border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-primary">Women Mag</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">
                            La mode femme en Algérie, simplifiée.
                            Commandez maintenant, payez à la livraison.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-text-primary">Liens Utiles</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li><Link href="/products" className="hover:text-primary">Nos Produits</Link></li>
                            <li><Link href="/tracking" className="hover:text-primary">Suivi de commande</Link></li>
                            <li><Link href="/policies" className="hover:text-primary">Politique de retour</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4 text-text-primary">Contact & Confiance</h4>
                        <ul className="space-y-2 text-sm text-text-secondary">
                            <li>📞 +213 555 555 555</li>
                            <li>📦 Paiement à la livraison (48 wilayas)</li>
                            <li>✅ Confirmation avant expédition</li>
                        </ul>
                    </div>
                </div>

                <div className="text-center pt-8 border-t border-gray-200 text-xs text-text-disabled">
                    © {new Date().getFullYear()} Women Mag. Tous droits réservés.
                </div>
            </div>
        </footer>
    );
}
