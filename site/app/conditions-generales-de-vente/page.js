import Link from "next/link";

export const metadata = {
  title: "Conditions générales de vente | AUTONOMIA",
  description: "Conditions générales de vente des prestations AUTONOMIA."
};

export default function TermsPage() {
  return (
    <main className="legalPage">
      <section className="legalHero">
        <p className="eyebrow">CONDITIONS CONTRACTUELLES</p>
        <h1>Conditions générales de vente</h1>
        <p>Version du 6 octobre 2026</p>
      </section>

      <section className="legalContent">
        <h2>1. Objet et champ d’application</h2>
        <p>Les présentes CGV s’appliquent aux prestations proposées sous la marque AUTONOMIA : mise à disposition ou mise en relation avec des experts IA, prestations de conseil, cadrage, conception, automatisation et construction de solutions numériques ou IA, ainsi que prestations de formation professionnelle. Elles s’appliquent sous réserve des conditions particulières figurant sur le devis, la convention, le bon de commande ou tout document contractuel accepté par le client.</p>

        <h2>2. Entité contractante</h2>
        <p>AUTONOMIA est exploité dans le cadre d’un groupement opérationnel réunissant DDG GROUPE, ODEXIS et MAJY ME. L’entité juridiquement cocontractante est identifiée sur le devis, la convention, le bon de commande ou la facture. Ce document prévaut pour déterminer l’identité du prestataire, le prix, le périmètre et les modalités particulières de la mission.</p>

        <h2>3. Commande</h2>
        <p>La commande devient ferme après acceptation du devis, de la proposition commerciale, de la convention ou du bon de commande selon le processus convenu. Toute demande complémentaire ou modification du périmètre peut donner lieu à un chiffrage additionnel ou à un avenant.</p>

        <h2>4. Prix</h2>
        <p>Les prix sont exprimés en euros, hors taxes lorsqu’une TVA est applicable. Le prix et les éventuels frais sont précisés dans l’offre commerciale. Pour les missions réalisées sur la base d’un tarif journalier, le nombre de jours ou la consommation réelle est déterminé selon les modalités prévues au devis.</p>

        <h2>5. Facturation et paiement</h2>
        <p>Les échéances, acomptes et modalités de paiement figurent sur le devis, la convention ou la facture. Pour les clients professionnels, tout retard de paiement peut entraîner l’application des pénalités prévues par l’article L.441-10 du Code de commerce ainsi que l’indemnité forfaitaire légale de 40 € pour frais de recouvrement, sans préjudice des frais complémentaires pouvant être réclamés dans les conditions prévues par la loi.</p>

        <h2>6. Prestations Experts</h2>
        <p>Lorsque la prestation consiste en une mise en relation ou en la mobilisation d’un consultant, le profil, le tarif, la disponibilité, le périmètre, la durée et le mode d’intervention sont précisés dans l’offre. Toute prolongation ou évolution substantielle de la mission fait l’objet d’un accord entre les parties.</p>

        <h2>7. Prestations Build</h2>
        <p>Les prestations de cadrage, automatisation, développement, intégration ou construction de solutions IA sont réalisées sur la base du périmètre et des livrables définis contractuellement. Les éléments fournis par le client, les accès aux outils, les validations et les délais de réponse du client conditionnent le calendrier de réalisation.</p>

        <h2>8. Formations</h2>
        <p>Pour les actions de formation, les objectifs, prérequis, durée, modalités, prix, délais d’accès, moyens pédagogiques et conditions d’annulation sont précisés dans le programme et la convention ou le contrat de formation. Lorsque la formation relève de MAJY ME, l’organisme dispose du numéro de déclaration d’activité 11757506175. Le financement par un OPCO ou un autre financeur reste soumis à l’accord de l’organisme concerné.</p>

        <h2>9. Annulation, report et résiliation</h2>
        <p>Les conditions d’annulation, de report ou de résiliation applicables à une prestation sont précisées dans le devis, la convention ou les conditions particulières. En cas d’événement empêchant raisonnablement l’exécution, les parties recherchent prioritairement une solution de report ou d’adaptation.</p>

        <h2>10. Obligations du client</h2>
        <p>Le client s’engage à fournir les informations, accès, validations, contenus et interlocuteurs nécessaires à la bonne exécution de la prestation. Il garantit disposer des droits nécessaires sur les données, documents, logiciels, contenus et environnements qu’il met à disposition.</p>

        <h2>11. Intelligence artificielle et services tiers</h2>
        <p>Certaines prestations peuvent s’appuyer sur des services tiers, API, modèles d’intelligence artificielle ou logiciels dont les conditions, performances, tarifs ou fonctionnalités peuvent évoluer. Les choix d’outils, abonnements et frais tiers sont précisés dans l’offre lorsque ceux-ci sont nécessaires à la réalisation.</p>

        <h2>12. Confidentialité</h2>
        <p>Chaque partie s’engage à préserver les informations confidentielles reçues de l’autre partie et à les utiliser uniquement pour l’exécution de la relation contractuelle, sous réserve des obligations légales ou réglementaires de divulgation.</p>

        <h2>13. Propriété intellectuelle</h2>
        <p>Les droits portant sur les livrables, développements, supports, méthodes, composants réutilisables et éléments préexistants sont déterminés par le devis ou les conditions particulières. À défaut de disposition spécifique, les éléments préexistants, méthodes, savoir-faire et composants génériques restent la propriété de leur titulaire respectif.</p>

        <h2>14. Données personnelles</h2>
        <p>Le traitement des données personnelles est réalisé conformément à la <Link href="/politique-de-confidentialite">Politique de confidentialité</Link>. Lorsque la prestation implique un traitement de données pour le compte du client, les responsabilités et instructions correspondantes peuvent être précisées dans un accord dédié.</p>

        <h2>15. Responsabilité</h2>
        <p>Chaque partie répond des dommages directs qui lui sont imputables dans les conditions du droit applicable. Le client reste responsable des décisions métier, des validations, de l’usage des livrables et du respect des règles applicables à son activité. Les éventuelles limitations ou plafonds de responsabilité sont précisés dans les conditions particulières lorsqu’ils sont convenus.</p>

        <h2>16. Droit applicable et litiges</h2>
        <p>Les présentes CGV sont soumises au droit français. Les parties recherchent une solution amiable avant toute action contentieuse. Pour les relations entre professionnels, la juridiction compétente est déterminée conformément aux règles de procédure applicables et, lorsqu’une clause attributive valable figure dans le document contractuel signé, conformément à cette clause.</p>

        <h2>17. Contact</h2>
        <p>Pour toute question relative aux présentes CGV : <a href="mailto:deborah@build-autonomia.com">deborah@build-autonomia.com</a>.</p>
      </section>
    </main>
  );
}
