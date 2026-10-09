// Publication Controller: DOI Lookup & Metadata Verification via Crossref Open API

exports.lookupDoi = async (req, res) => {
  try {
    let doi = req.query.doi || req.body.doi;
    if (!doi) {
      return res.status(400).json({ success: false, message: 'DOI query parameter is required.' });
    }

    // Clean DOI: strip common prefixes
    doi = doi.trim();
    doi = doi.replace(/^https?:\/\/doi\.org\//i, '');
    doi = doi.replace(/^doi:\s*/i, '');
    doi = doi.trim();

    if (!doi) {
      return res.status(400).json({ success: false, message: 'Invalid DOI format.' });
    }

    const crossrefUrl = `https://api.crossref.org/works/${encodeURIComponent(doi)}`;
    
    // Crossref polite pool requires Mailto / User-Agent
    const response = await fetch(crossrefUrl, {
      headers: {
        'User-Agent': 'AfricanScholarAcademicRegistry/1.0 (mailto:adebayoea1@gmail.com)'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'DOI not found in the global Crossref registry. Please verify the DOI string.'
        });
      }
      return res.status(response.status).json({
        success: false,
        message: `Crossref API returned error (${response.status})`
      });
    }

    const data = await response.json();
    const work = data.message;

    // Parse authors
    const authorsList = (work.author || []).map(a => {
      if (a.family && a.given) return `${a.family}, ${a.given.charAt(0)}.`;
      if (a.family) return a.family;
      if (a.name) return a.name;
      return '';
    }).filter(Boolean);

    let authorsFormatted = 'Unknown Author';
    if (authorsList.length > 0) {
      if (authorsList.length <= 3) {
        authorsFormatted = authorsList.join(' & ');
      } else {
        authorsFormatted = `${authorsList.slice(0, 2).join(', ')} et al.`;
      }
    }

    // Parse year
    let year = 'n.d.';
    if (work['published-print']?.['date-parts']?.[0]?.[0]) {
      year = work['published-print']['date-parts'][0][0];
    } else if (work['published-online']?.['date-parts']?.[0]?.[0]) {
      year = work['published-online']['date-parts'][0][0];
    } else if (work.created?.['date-parts']?.[0]?.[0]) {
      year = work.created['date-parts'][0][0];
    }

    const title = work.title?.[0] || 'Untitled Work';
    const journal = work['container-title']?.[0] || work.publisher || 'Academic Journal';
    const citationsCount = work['is-referenced-by-count'] || 0;
    const url = work.URL || `https://doi.org/${doi}`;
    const volume = work.volume || '';
    const issue = work.issue || '';

    // Generate formatted academic citation
    let citation = `${authorsFormatted} (${year}). ${title}. ${journal}`;
    if (volume) citation += `, ${volume}`;
    if (issue) citation += `(${issue})`;
    citation += `. https://doi.org/${doi}`;

    return res.json({
      success: true,
      publication: {
        doi,
        title,
        journal,
        authors: authorsFormatted,
        year,
        volume,
        issue,
        url,
        citations_count: citationsCount,
        publisher: work.publisher || '',
        type: work.type || 'journal-article',
        formatted_citation: citation,
        is_verified: true
      }
    });
  } catch (error) {
    console.error('[DOI Lookup Error]:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to resolve DOI: ${error.message}`
    });
  }
};

exports.lookupOrcid = async (req, res) => {
  try {
    let orcid = req.query.orcid || req.body.orcid;
    if (!orcid) {
      return res.status(400).json({ success: false, message: 'ORCID iD parameter is required.' });
    }

    orcid = orcid.trim();
    orcid = orcid.replace(/^https?:\/\/orcid\.org\//i, '');
    orcid = orcid.trim();

    const orcidRegex = /^\d{4}-\d{4}-\d{4}-[\dX]{4}$/i;
    if (!orcidRegex.test(orcid)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ORCID format. Expected format: 0000-0002-1825-0097'
      });
    }

    const orcidUrl = `https://pub.orcid.org/v3.0/${orcid}/record`;
    const response = await fetch(orcidUrl, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'AfricanScholarAcademicRegistry/1.0 (mailto:adebayoea1@gmail.com)'
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({
          success: false,
          message: 'ORCID record not found in the public ORCID registry.'
        });
      }
      return res.status(response.status).json({
        success: false,
        message: `ORCID registry returned error (${response.status})`
      });
    }

    const data = await response.json();
    const person = data.person || {};
    const activities = data['activities-summary'] || {};

    // Names
    const names = person.name || {};
    const givenNames = names['given-names']?.value || '';
    const familyName = names['family-name']?.value || '';
    const creditName = names['credit-name']?.value || `${givenNames} ${familyName}`.trim();

    // Bio
    const bio = person.biography?.content || '';

    // Primary Affiliation (first employment)
    let currentAffiliation = '';
    let currentRole = '';
    const employments = activities.employments?.['affiliation-group'] || [];
    if (employments.length > 0) {
      const empSummary = employments[0]?.summaries?.[0]?.['employment-summary'];
      if (empSummary) {
        currentAffiliation = empSummary.organization?.name || '';
        currentRole = empSummary['role-title'] || '';
      }
    }

    // Works / Publications
    const worksGroup = activities.works?.group || [];
    const totalWorksCount = worksGroup.length;
    const topWorks = [];

    for (let i = 0; i < Math.min(5, worksGroup.length); i++) {
      const summary = worksGroup[i]['work-summary']?.[0];
      if (summary) {
        const title = summary.title?.title?.value || 'Untitled Research';
        const journal = summary['journal-title']?.value || '';
        const year = summary['publication-date']?.year?.value || '';
        let workDoi = '';
        const extIds = summary['external-ids']?.['external-id'] || [];
        const doiObj = extIds.find(id => id['external-id-type']?.toLowerCase() === 'doi');
        if (doiObj) {
          workDoi = doiObj['external-id-value'] || '';
        }

        topWorks.push({
          title,
          journal,
          year,
          doi: workDoi
        });
      }
    }

    return res.json({
      success: true,
      orcid,
      profile: {
        orcid,
        fullName: creditName || 'Distinguished Scholar',
        givenNames,
        familyName,
        biography: bio,
        primaryAffiliation: currentAffiliation,
        role: currentRole,
        totalWorksCount,
        recentPublications: topWorks,
        orcidUrl: `https://orcid.org/${orcid}`
      }
    });

  } catch (error) {
    console.error('[ORCID Lookup Error]:', error);
    return res.status(500).json({
      success: false,
      message: `Failed to resolve ORCID record: ${error.message}`
    });
  }
};

