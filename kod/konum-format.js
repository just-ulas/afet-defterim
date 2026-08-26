/** konum biçimleme ve harita linkleri */

export function formatKonum(loc) {
  if (!loc) return 'konum yok';
  const a = typeof loc.acc === 'number' ? ' ±' + Math.round(loc.acc) + 'm' : '';
  return loc.lat.toFixed(5) + ', ' + loc.lon.toFixed(5) + a;
}

export function googleMaps(loc) {
  if (!loc) return '';
  return 'https://maps.google.com/?q=' + loc.lat + ',' + loc.lon;
}

export function osmLink(loc) {
  if (!loc) return '';
  return 'https://www.openstreetmap.org/?mlat=' + loc.lat + '&mlon=' + loc.lon + '#map=16/' + loc.lat + '/' + loc.lon;
}

export function geoUri(loc) {
  if (!loc) return '';
  return 'geo:' + loc.lat + ',' + loc.lon;
}

/** ham WGS84 → yaklaşık il/ilçe yok, sadece dms */
export function toDms(deg, isLat) {
  const abs = Math.abs(deg);
  const d = Math.floor(abs);
  const mFloat = (abs - d) * 60;
  const m = Math.floor(mFloat);
  const s = ((mFloat - m) * 60).toFixed(1);
  const hem = isLat ? (deg >= 0 ? 'N' : 'S') : (deg >= 0 ? 'E' : 'W');
  return d + '°' + m + "'" + s + '"' + hem;
}

export function formatDms(loc) {
  if (!loc) return '';
  return toDms(loc.lat, true) + ' ' + toDms(loc.lon, false);
}
