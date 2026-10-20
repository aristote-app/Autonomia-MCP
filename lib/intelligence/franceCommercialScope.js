// Territory selection applies only to CURRENT commercial targeting.
// Historical records remain available, including agencies and foreign employers.
const EXCLUDED_FOREIGN_EMPLOYERS = [
  /bending spoons/i,
  /wko inhouse/i,
  /sikt.*kunnskaps/i,
  /iarnr.d.*ireann|irish rail/i,
  /eurojust|coop.ration judiciaire en mati.re p.nale/i,
  /as vinmonopolet/i
];
export function isOutsideFranceTarget(company) {
  return EXCLUDED_FOREIGN_EMPLOYERS.some(pattern => pattern.test(String(company || "")));
}
