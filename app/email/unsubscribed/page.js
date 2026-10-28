export const dynamic = 'force-dynamic';
export default async function Unsubscribed({ searchParams }) {
  const params = await searchParams;
  return <main style={{ maxWidth: 560, margin: '60px auto', padding: 24 }}><h1>{params?.error ? 'Réessaie dans quelques instants' : 'Demande prise en compte'}</h1><p>{params?.error ? 'La désinscription n’a pas pu être enregistrée. Tu peux aussi écrire à contact@majy.me.' : 'Si le lien correspond à un destinataire de nos campagnes, son adresse est désormais exclue des prochains envois.'}</p></main>;
}
