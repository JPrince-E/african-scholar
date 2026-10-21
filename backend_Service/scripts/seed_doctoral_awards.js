require('dotenv').config();
const { Award, sequelize } = require('../src/models');

async function seedDoctoral() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    const doctoralAwards = [
      {
        category: 'DOCTORAL',
        tier: 'NATIONAL',
        title: 'National Doctoral Scholar of the Year (Nigeria)',
        country: 'Nigeria',
        description: 'Recognizing emerging doctoral scholars and PhD researchers demonstrating outstanding citation velocity and national peer impact.',
        award_value: {
          prize_amount: '$2,500',
          plaque: 'Plaque award',
          icon_items: 'Icon item/s',
          podcast_interview: 'Interview/Podcast session with doctoral person of the year'
        },
        evaluation_index: [
          { rule: 'Attended at least one (1) conference within the country WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 In-Country Conference (last 3 yrs)', key: 'conferences_last_3_years', target: 1 },
          { rule: 'At least 25 publications BY the year of the evaluation', benchmark: '>= 25 Publications', key: 'min_publications', target: 25 },
          { rule: 'At least one (1) publication in Q1 journal or at least three (3) publications in Q2 IN the year of the evaluation', benchmark: '>= 1 Q1 or >= 3 Q2 in eval year', key: 'q1_q2_journals' },
          { rule: 'At least 2000 citations BY the year of the evaluation', benchmark: '>= 2,000 Citations', key: 'min_citations', target: 2000 },
          { rule: 'At least h-index 12 BY the year of the evaluation', benchmark: '>= 12 h-index', key: 'min_h_index', target: 12 },
          { rule: 'At least 3 MSc (graduating PhD/s is an added advantage) BY the year of the evaluation', benchmark: '>= 3 MSc (graduating PhD added advantage)', key: 'graduates_supervised' },
          { rule: 'At least one (1) collaboration (locally/national) WITHIN the last five years (with the year of evaluation included)', benchmark: '>= 1 Collaboration locally/national (last 5 yrs)', key: 'national_collaboration', target: 1 }
        ],
        year: 2027,
        is_active: true
      },
      {
        category: 'DOCTORAL',
        tier: 'CONTINENTAL',
        title: 'Continental Doctoral Scholar of the Year (Africa)',
        country: null,
        description: 'Celebrating high-caliber African doctoral researchers and PhD fellows whose cross-regional investigations address key African challenges.',
        award_value: {
          prize_amount: '$7,500',
          plaque: 'Plaque award',
          icon_items: 'Icon item/s',
          podcast_interview: 'Interview/Podcast session with doctoral person of the year'
        },
        evaluation_index: [
          { rule: 'Attended one (1) conference on the continent (Africa) WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 Conference in Africa (last 3 yrs)', key: 'continental_conferences', target: 1 },
          { rule: 'Cited by researchers from different regions of Africa: west, east, south, north BY the year of the evaluation', benchmark: 'Cited by West, East, South & North Africa', key: 'continental_citations' },
          { rule: 'At least 40 publications BY the year of the evaluation', benchmark: '>= 40 Publications', key: 'min_publications', target: 40 },
          { rule: 'At least one (1) publication in Q1 journal or at least three (3) publications in Q2 IN the year of the evaluation', benchmark: '>= 1 Q1 or >= 3 Q2 in eval year', key: 'q1_q2_journals' },
          { rule: 'At least 3500 citations BY the year of the evaluation', benchmark: '>= 3,500 Citations', key: 'min_citations', target: 3500 },
          { rule: 'At least h-index 20 BY the year of the evaluation', benchmark: '>= 20 h-index', key: 'min_h_index', target: 20 },
          { rule: 'At least 5 MSc & 2 PhD BY the year of the evaluation', benchmark: '>= 5 MSc & 2 PhD', key: 'graduates_supervised' },
          { rule: 'At least one (1) research grant (national/continental/international) WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 Research Grant (last 3 yrs)', key: 'research_grants', target: 1 }
        ],
        year: 2027,
        is_active: true
      },
      {
        category: 'DOCTORAL',
        tier: 'GLOBAL',
        title: 'Global Doctoral Scholar of the Year',
        country: null,
        description: 'Honouring an extraordinary African doctoral scholar whose PhD discoveries and international collaborations achieve world-class recognition.',
        award_value: {
          prize_amount: '$15,000',
          plaque: 'Plaque award',
          icon_items: 'Icon item/s',
          podcast_interview: 'Interview/Podcast session with doctoral person of the year'
        },
        evaluation_index: [
          { rule: 'Attended conference on at least one (1) continent (Africa, Europe, Asia, South America, North America, Oceania) WITHIN the last three years (with the year of evaluation included)', benchmark: 'Conference on >= 1 Continent (last 3 yrs)', key: 'global_conferences' },
          { rule: 'Cited by researchers from all the continents: Africa, Europe, Asia, South America, North America, Oceania BY the year of the evaluation', benchmark: 'Cited Across All Continents', key: 'global_citations' },
          { rule: 'At least 60 publications BY the year of the evaluation', benchmark: '>= 60 Publications', key: 'min_publications', target: 60 },
          { rule: 'At least two (2) publications in Q1 journal or at least seven (7) publications in Q2 IN the year of the evaluation', benchmark: '>= 2 Q1 or >= 7 Q2 in eval year', key: 'q1_q2_journals' },
          { rule: 'At least one (1) publications in journal’s of impact factor (IF) >10 IN the year of the evaluation', benchmark: '>= 1 Publication in IF > 10 Journal', key: 'high_impact_publications', target: 1 },
          { rule: 'At least 10000 citations BY the year of the evaluation', benchmark: '>= 10,000 Citations', key: 'min_citations', target: 10000 },
          { rule: 'At least h-index 35 BY the year of the evaluation', benchmark: '>= 35 h-index', key: 'min_h_index', target: 35 },
          { rule: 'At least 7 MSc & 5 PhD BY the year of the evaluation', benchmark: '>= 7 MSc & 5 PhD', key: 'graduates_supervised' },
          { rule: 'At least one (1) international collaboration WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 International Collaboration (last 3 yrs)', key: 'international_collaboration', target: 1 },
          { rule: 'At least one (1) research grant (national/continental/international) WITHIN the last three years (with the year of evaluation included)', benchmark: '>= 1 Research Grant (last 3 yrs)', key: 'research_grants', target: 1 }
        ],
        year: 2027,
        is_active: true
      }
    ];

    for (const data of doctoralAwards) {
      const existing = await Award.findOne({ where: { category: 'DOCTORAL', tier: data.tier } });
      if (!existing) {
        const created = await Award.create(data);
        console.log(` Created Doctoral Award: [ID ${created.id}] ${created.title}`);
      } else {
        console.log(` Already exists: [ID ${existing.id}] ${existing.title}`);
      }
    }

    console.log(' Doctoral awards check complete.');
  } catch (err) {
    console.error('Error seeding doctoral awards:', err.message);
  } finally {
    await sequelize.close();
  }
}

seedDoctoral();
