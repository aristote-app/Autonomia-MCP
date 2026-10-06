import Link from "next/link";

export const metadata = {
  title: "Mentions légales | AUTONOMIA",
  description: "Mentions légales du site build-autonomia.com."
};

export default function LegalNoticePage() {
  return (
    <main className="legalPage">
      <section className="legalHero">
        <p className="eyebrow">INFORMATIONS JURIDIQUES</p>
        <h1>Mentions légales</h1>
        <p>Dernière mise à jour : 6 octobre 2026</p>
      </section>

      <section className="legalContent">
        <h2>1. Édition du site et groupement AUTONOMIA</h2>
        <p>AUTONOMIA est exploité dans le cadre d’un groupement opérationnel réunissant les trois structures ci-dessous. Selon la nature de la prestation, l’entité contractante est indiquée sur le devis, la convention, le bon de commande ou la facture.</p>

        <h3>DDG GROUPE</h3>
        <p>Société par actions simplifiée — SIREN 982 727 034 — SIRET siège 982 727 034 00026 — TVA intracommunautaire FR71982727034 — siège social : 229 rue Saint-Honoré, 75001 Paris.</p>

        <h3>ODEXIS</h3>
        <p>SARL au capital de 11 500 € — SIREN 503 918 120 — SIRET siège 503 918 120 00026 — TVA intracommunautaire FR60503918120 — siège social : 2 rue Faidherbe, 94160 Saint-Mandé.</p>

        <h3>MAJY ME</h3>
        <p>Association déclarée loi 1901 — SIREN 999 688 575 — SIRET 999 688 575 00011 — RNA W751282348 — siège social : 6 rue d’Armaillé, 75017 Paris. Organisme de formation, déclaration d’activité n° 11757506175 auprès du préfet de région d’Île-de-France.</p>

        <h2>2. Site concerné</h2>
        <p>Nom du site : AUTONOMIA — Adresse : build-autonomia.com — Contact : <a href="mailto:deborah@build-autonomia.com">deborah@build-autonomia.com</a>.</p>

        <h2>3. Direction de la publication</h2>
        <p>Pour toute demande relative à la publication du site : <a href="mailto:deborah@build-autonomia.com">deborah@build-autonomia.com</a>.</p>

        <h2>4. Hébergement</h2>
        <p>Le site est hébergé par o2switch, SAS au capital de 100 000 €, SIRET 510 909 807 00032, RCS Clermont-Ferrand, Chemin des Pardiaux, 63000 Clermont-Ferrand — téléphone : 04 44 44 60 40.</p>

        <h2>5. Propriété intellectuelle</h2>
        <p>Les contenus, textes, éléments graphiques, marques, logos, interfaces, bases de données et créations présents sur le site sont protégés par les règles applicables à la propriété intellectuelle. Toute réutilisation dépassant les exceptions légales nécessite l’autorisation préalable du titulaire des droits.</p>

        <h2>6. Données personnelles</h2>
        <p>Les traitements de données personnelles réalisés via le site sont décrits dans notre <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>.</p>

        <h2>7. Conditions de vente</h2>
        <p>Les prestations commercialisées via AUTONOMIA sont soumises aux <Link href="/conditions-generales-de-vente">Conditions générales de vente</Link>, complétées le cas échéant par les conditions particulières figurant sur le devis, la convention ou le bon de commande.</p>
      </section>
    </main>
  );
}
