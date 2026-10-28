export function trainingSourceKey(url){const u=new URL(url);return u.hostname.replace(/^(www|fr)\./,'')+u.pathname.replace(/\/$/,'');}
