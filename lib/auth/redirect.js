export function safeInternalPath(value,fallback='/missions-formateurs'){
 const path=String(value||'');return /^\/(?![\/\\])/.test(path)&&!/[\r\n\x00]/.test(path)?path:fallback;
}
