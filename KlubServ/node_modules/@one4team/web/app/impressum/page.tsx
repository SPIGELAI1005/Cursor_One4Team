import GuestHeader from "../components/guest/GuestHeader";
import GuestFooter from "../components/guest/GuestFooter";

export default function ImpressumPage() {
  return (
    <div className="min-h-screen bg-white">
      <GuestHeader />
      
      <main className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
            
            <div className="prose prose-lg max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
                <p className="text-gray-600 mb-4">
                  <strong>One4Team GmbH</strong><br />
                  Musterstraße 123<br />
                  12345 Musterstadt<br />
                  Deutschland
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Vertreten durch</h3>
                <p className="text-gray-600 mb-4">
                  Geschäftsführer: Max Mustermann
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Kontakt</h3>
                <p className="text-gray-600 mb-4">
                  Telefon: +49 123 456 789<br />
                  E-Mail: info@one4team.com
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Registereintrag</h3>
                <p className="text-gray-600 mb-4">
                  Eintragung im Handelsregister<br />
                  Registergericht: Amtsgericht Musterstadt<br />
                  Registernummer: HRB 12345
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Umsatzsteuer-ID</h3>
                <p className="text-gray-600 mb-4">
                  Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                  DE123456789
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
                <p className="text-gray-600 mb-4">
                  Max Mustermann<br />
                  One4Team GmbH<br />
                  Musterstraße 123<br />
                  12345 Musterstadt
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">Haftungsausschluss</h2>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Haftung für Inhalte</h3>
                <p className="text-gray-600 mb-4">
                  Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, 
                  Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. 
                  Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                  nach den allgemeinen Gesetzen verantwortlich.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Haftung für Links</h3>
                <p className="text-gray-600 mb-4">
                  Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen 
                  Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                  Seiten verantwortlich.
                </p>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Urheberrecht</h3>
                <p className="text-gray-600 mb-4">
                  Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                  dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                  der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                  Zustimmung des jeweiligen Autors bzw. Erstellers.
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      
      <GuestFooter />
    </div>
  );
} 