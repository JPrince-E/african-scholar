// Complete list of all 54 sovereign African countries recognized by the African Union & United Nations
export const AFRICAN_COUNTRIES = [
  'Algeria',
  'Angola',
  'Benin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cameroon',
  'Central African Republic',
  'Chad',
  'Comoros',
  'Congo (Republic of the Congo)',
  'Congo (Democratic Republic of the Congo)',
  "Côte d'Ivoire",
  'Djibouti',
  'Egypt',
  'Equatorial Guinea',
  'Eritrea',
  'Eswatini',
  'Ethiopia',
  'Gabon',
  'Gambia',
  'Ghana',
  'Guinea',
  'Guinea-Bissau',
  'Kenya',
  'Lesotho',
  'Liberia',
  'Libya',
  'Madagascar',
  'Malawi',
  'Mali',
  'Mauritania',
  'Mauritius',
  'Morocco',
  'Mozambique',
  'Namibia',
  'Niger',
  'Nigeria',
  'Rwanda',
  'São Tomé and Príncipe',
  'Senegal',
  'Seychelles',
  'Sierra Leone',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Sudan',
  'Tanzania',
  'Togo',
  'Tunisia',
  'Uganda',
  'Zambia',
  'Zimbabwe'
];

// Fetch universities for any country via External Universities API with proxy and fallbacks
export const fetchUniversitiesByCountry = async (countryName) => {
  if (!countryName) return [];
  
  // Clean country name for external API
  let queryCountry = countryName;
  if (countryName.includes('Congo')) {
    queryCountry = 'Congo';
  } else if (countryName === "Côte d'Ivoire") {
    queryCountry = 'Ivory Coast';
  }

  // 1. Try our backend proxy endpoint (handles CORS, timeout, and response normalization)
  try {
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const proxyRes = await fetch(`${apiBase}/profiles/external-universities?country=${encodeURIComponent(countryName)}`);
    if (proxyRes.ok) {
      const json = await proxyRes.json();
      if (json.success && Array.isArray(json.universities) && json.universities.length > 0) {
        return json.universities;
      }
    }
  } catch (err) {
    console.debug('Backend universities proxy not reachable, attempting direct fetch...', err);
  }

  // 2. Direct external API fetch (Hipo Labs Universities API via HTTPS)
  try {
    const url = `https://universities.hipolabs.com/search?country=${encodeURIComponent(queryCountry)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const names = Array.from(new Set(data.map(u => u.name))).sort();
        return names;
      }
    }
  } catch (err) {
    console.warn(`External universities API fetch failed for ${countryName}:`, err);
  }

  // Fallback notable universities per major African country if offline or external API throttles
  const fallbacks = {
    'Nigeria': [
      'University of Ibadan',
      'University of Lagos',
      'Obafemi Awolowo University',
      'Ahmadu Bello University',
      'University of Nigeria, Nsukka',
      'University of Benin',
      'University of Ilorin',
      'Federal University of Technology, Akure',
      'Federal University of Technology, Minna',
      'Covenant University',
      'Lagos State University',
      'University of Port Harcourt',
      'University of Calabar',
      'University of Jos',
      'Bayero University Kano',
      'Rivers State University',
      'Nnamdi Azikiwe University'
    ],
    'Kenya': [
      'University of Nairobi',
      'Kenyatta University',
      'Moi University',
      'Jomo Kenyatta University of Agriculture and Technology',
      'Strathmore University',
      'Egerton University',
      'Maseno University'
    ],
    'Ghana': [
      'University of Ghana',
      'Kwame Nkrumah University of Science and Technology',
      'University of Cape Coast',
      'Ashesi University',
      'University of Education, Winneba',
      'Ghana Institute of Management and Public Administration'
    ],
    'South Africa': [
      'University of Cape Town',
      'University of the Witwatersrand',
      'Stellenbosch University',
      'University of Pretoria',
      'University of KwaZulu-Natal',
      'University of Johannesburg',
      'Rhodes University',
      'North-West University'
    ],
    'Egypt': [
      'Cairo University',
      'Ain Shams University',
      'Alexandria University',
      'American University in Cairo',
      'Mansoura University',
      'Assiut University'
    ],
    'Uganda': [
      'Makerere University',
      'Kyambogo University',
      'Mbarara University of Science and Technology',
      'Uganda Christian University'
    ],
    'Rwanda': [
      'University of Rwanda',
      'Carnegie Mellon University Africa',
      'African Leadership University'
    ],
    'Ethiopia': [
      'Addis Ababa University',
      'Jimma University',
      'Hawassa University',
      'Bahir Dar University'
    ],
    'Tanzania': [
      'University of Dar es Salaam',
      'Sokoine University of Agriculture',
      'Muhimbili University of Health and Allied Sciences'
    ],
    'Senegal': [
      'Cheikh Anta Diop University',
      'Gaston Berger University'
    ]
  };

  return fallbacks[countryName] || [];
};
