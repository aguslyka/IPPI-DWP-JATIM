export const IPPI_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
  <!-- Outer Ring -->
  <circle cx="100" cy="100" r="90" fill="#FFFFFF" />
  <circle cx="100" cy="100" r="85" fill="none" stroke="#00488B" stroke-width="10" />
  
  <!-- Flanking Figures -->
  <!-- Left Figure -->
  <circle cx="58" cy="75" r="14" fill="#00488B" />
  <path d="M36,118 C36,96 72,96 72,118 L72,126 L36,126 Z" fill="#00488B" />
  
  <!-- Right Figure -->
  <circle cx="142" cy="75" r="14" fill="#00488B" />
  <path d="M128,118 C128,96 164,96 164,118 L164,126 L128,126 Z" fill="#00488B" />
  
  <!-- Center Figure -->
  <circle cx="100" cy="56" r="21" fill="#FFFFFF" />
  <circle cx="100" cy="56" r="18" fill="#00488B" />
  
  <path d="M62,126 C62,94 138,94 138,126 Z" fill="#FFFFFF" />
  <path d="M66,126 C66,97 134,97 134,126 Z" fill="#00488B" />
  
  <!-- Gold Open Book -->
  <path d="M26,122 C50,123 75,152 100,131 C125,152 150,123 174,122 C174,136 142,174 100,152 C58,174 26,136 26,122 Z" fill="#FAB209" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round" />
</svg>`;

export const IPPI_LOGO_DATA_URL = `data:image/svg+xml;utf8,\${encodeURIComponent(IPPI_LOGO_SVG)}`;
