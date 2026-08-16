/* ============================================================
   PORTOFOLIO — sprite ikon
   Disuntikkan lewat JS (bukan fetch) supaya tetap jalan
   baik dibuka lewat server maupun langsung dari file://.
   Semua ikon digambar orisinal untuk proyek ini.
   Tambah ikon baru: tulis <g id="art-xxx"> di bawah,
   lalu panggil dengan <use href="#art-xxx"/>.
   ============================================================ */
(function () {
  'use strict';

  var svg =
'<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>' +

  /* ornamen bintang berputar */
  '<g id="spice-star">' +
    '<g fill="none" stroke="currentColor" stroke-width="3">' +
      '<circle cx="50" cy="50" r="14"/><circle cx="50" cy="50" r="30"/>' +
    '</g>' +
    '<g fill="currentColor">' +
      '<path d="M50 4 L57 26 L43 26 Z"/><path d="M50 96 L43 74 L57 74 Z"/>' +
      '<path d="M4 50 L26 43 L26 57 Z"/><path d="M96 50 L74 57 L74 43 Z"/>' +
      '<path d="M17 17 L36 28 L28 36 Z"/><path d="M83 83 L64 72 L72 64 Z"/>' +
      '<path d="M83 17 L72 36 L64 28 Z"/><path d="M17 83 L28 64 L36 72 Z"/>' +
    '</g>' +
  '</g>' +

  /* ornamen bunga — dipakai sebagai dekorasi berputar */
  '<g id="deco-flower">' +
    '<g fill="currentColor">' +
      '<ellipse cx="50" cy="24" rx="12" ry="23"/>' +
      '<ellipse cx="50" cy="24" rx="12" ry="23" transform="rotate(45 50 50)"/>' +
      '<ellipse cx="50" cy="24" rx="12" ry="23" transform="rotate(90 50 50)"/>' +
      '<ellipse cx="50" cy="24" rx="12" ry="23" transform="rotate(135 50 50)"/>' +
      '<ellipse cx="50" cy="24" rx="12" ry="23" transform="rotate(180 50 50)"/>' +
      '<ellipse cx="50" cy="24" rx="12" ry="23" transform="rotate(225 50 50)"/>' +
      '<ellipse cx="50" cy="24" rx="12" ry="23" transform="rotate(270 50 50)"/>' +
      '<ellipse cx="50" cy="24" rx="12" ry="23" transform="rotate(315 50 50)"/>' +
    '</g>' +
    '<circle cx="50" cy="50" r="13" fill="#FFF300" stroke="#111" stroke-width="3"/>' +
  '</g>' +

  /* ===== ikon teknis (viewBox 0 0 400 300) ===== */

  /* AI / chip syaraf */
  '<g id="art-ai">' +
    '<rect x="130" y="90" width="140" height="140" rx="16" fill="#111"/>' +
    '<rect x="152" y="112" width="96" height="96" rx="10" fill="#00DEFF"/>' +
    '<g stroke="#111" stroke-width="7" stroke-linecap="round">' +
      '<path d="M176 136 L224 136"/><path d="M176 160 L224 160"/><path d="M176 184 L224 184"/>' +
    '</g>' +
    '<g fill="#FFF300"><circle cx="176" cy="136" r="9"/><circle cx="224" cy="160" r="9"/><circle cx="176" cy="184" r="9"/></g>' +
    '<g stroke="#111" stroke-width="9" stroke-linecap="round">' +
      '<path d="M130 122 L96 122"/><path d="M130 160 L96 160"/><path d="M130 198 L96 198"/>' +
      '<path d="M270 122 L304 122"/><path d="M270 160 L304 160"/><path d="M270 198 L304 198"/>' +
      '<path d="M166 90 L166 58"/><path d="M234 90 L234 58"/>' +
      '<path d="M166 230 L166 262"/><path d="M234 230 L234 262"/>' +
    '</g>' +
    '<g fill="#E60012">' +
      '<circle cx="92" cy="122" r="8"/><circle cx="92" cy="198" r="8"/>' +
      '<circle cx="308" cy="160" r="8"/><circle cx="234" cy="54" r="8"/>' +
    '</g>' +
  '</g>' +

  /* kode / terminal */
  '<g id="art-code">' +
    '<rect x="70" y="70" width="260" height="180" rx="14" fill="#111"/>' +
    '<rect x="70" y="70" width="260" height="34" rx="14" fill="#2D2D2D"/>' +
    '<g fill="#FFF300"><circle cx="94" cy="87" r="7"/></g>' +
    '<g fill="#00DEFF"><circle cx="116" cy="87" r="7"/></g>' +
    '<g fill="#E60012"><circle cx="138" cy="87" r="7"/></g>' +
    '<g stroke="#00DEFF" stroke-width="9" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
      '<path d="M138 146 L112 172 L138 198"/>' +
      '<path d="M262 146 L288 172 L262 198"/>' +
    '</g>' +
    '<path d="M212 138 L188 206" stroke="#FFF300" stroke-width="9" stroke-linecap="round"/>' +
  '</g>' +

  /* basis data */
  '<g id="art-db">' +
    '<ellipse cx="200" cy="88" rx="96" ry="30" fill="#00DEFF" stroke="#111" stroke-width="8"/>' +
    '<path d="M104 88 v58 a96 30 0 0 0 192 0 v-58" fill="#FFF300" stroke="#111" stroke-width="8"/>' +
    '<path d="M104 146 v58 a96 30 0 0 0 192 0 v-58" fill="#fff" stroke="#111" stroke-width="8"/>' +
    '<ellipse cx="200" cy="204" rx="96" ry="30" fill="none" stroke="#111" stroke-width="8"/>' +
    '<g fill="#111"><circle cx="248" cy="128" r="8"/><circle cx="248" cy="186" r="8"/></g>' +
  '</g>' +

  /* jendela antarmuka */
  '<g id="art-ui">' +
    '<rect x="60" y="66" width="280" height="188" rx="14" fill="#fff" stroke="#111" stroke-width="8"/>' +
    '<path d="M60 80 a14 14 0 0 1 14 -14 h252 a14 14 0 0 1 14 14 v22 H60 z" fill="#111"/>' +
    '<g fill="#FFF300"><circle cx="86" cy="84" r="6"/><circle cx="106" cy="84" r="6"/><circle cx="126" cy="84" r="6"/></g>' +
    '<rect x="80" y="122" width="86" height="112" rx="8" fill="#00DEFF"/>' +
    '<g fill="#111" opacity=".8">' +
      '<rect x="186" y="122" width="134" height="16" rx="8"/>' +
      '<rect x="186" y="150" width="104" height="12" rx="6"/>' +
      '<rect x="186" y="172" width="118" height="12" rx="6"/>' +
    '</g>' +
    '<rect x="186" y="200" width="80" height="30" rx="15" fill="#FFF300" stroke="#111" stroke-width="5"/>' +
  '</g>' +

  /* graf pengetahuan */
  '<g id="art-graph">' +
    '<g stroke="#111" stroke-width="7">' +
      '<path d="M200 96 L120 168"/><path d="M200 96 L282 168"/>' +
      '<path d="M120 168 L282 168"/><path d="M120 168 L160 240"/>' +
      '<path d="M282 168 L246 240"/><path d="M160 240 L246 240"/>' +
    '</g>' +
    '<g stroke="#111" stroke-width="7">' +
      '<circle cx="200" cy="96"  r="30" fill="#FFF300"/>' +
      '<circle cx="120" cy="168" r="26" fill="#00DEFF"/>' +
      '<circle cx="282" cy="168" r="26" fill="#00DEFF"/>' +
      '<circle cx="160" cy="240" r="22" fill="#fff"/>' +
      '<circle cx="246" cy="240" r="22" fill="#fff"/>' +
    '</g>' +
  '</g>' +

  /* kilau / percikan AI */
  '<g id="art-spark">' +
    '<path d="M200 60 L222 150 L312 172 L222 194 L200 284 L178 194 L88 172 L178 150 Z" fill="#FFF300" stroke="#111" stroke-width="8" stroke-linejoin="round"/>' +
    '<path d="M300 74 L310 108 L344 118 L310 128 L300 162 L290 128 L256 118 L290 108 Z" fill="#00DEFF" stroke="#111" stroke-width="6" stroke-linejoin="round"/>' +
  '</g>' +

  /* dokumen bertumpuk */
  '<g id="art-doc">' +
    '<rect x="92" y="60" width="180" height="220" rx="12" fill="#2D2D2D"/>' +
    '<rect x="112" y="48" width="180" height="220" rx="12" fill="#fff" stroke="#111" stroke-width="8"/>' +
    '<g stroke="#111" stroke-width="8" stroke-linecap="round" opacity=".65">' +
      '<path d="M142 96 h120"/><path d="M142 130 h120"/><path d="M142 164 h96"/><path d="M142 198 h110"/>' +
    '</g>' +
    '<circle cx="262" cy="216" r="34" fill="#00DEFF" stroke="#111" stroke-width="8"/>' +
    '<path d="M248 216 l10 12 l20 -24" stroke="#111" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</g>' +

  /* kotak paket */
  '<g id="art-box">' +
    '<path d="M70 120 h260 v150 a12 12 0 0 1 -12 12 H82 a12 12 0 0 1 -12 -12 z" fill="#FFF300" stroke="#111" stroke-width="8"/>' +
    '<rect x="56" y="86" width="288" height="46" rx="10" fill="#00DEFF" stroke="#111" stroke-width="8"/>' +
    '<rect x="178" y="86" width="44" height="196" fill="#111"/>' +
  '</g>' +

'</defs></svg>';

  function inject() {
    document.body.insertAdjacentHTML('afterbegin', svg);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
})();
