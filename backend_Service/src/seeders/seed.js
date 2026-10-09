const bcrypt = require('bcryptjs');
const { sequelize, User, ScholarProfile, Award, AwardApplication, Sponsor } = require('../models');

const seedDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('🔄 Connecting and synchronizing database schemas...');
    await sequelize.sync({ force: true }); // Clean slate for fresh seed

    console.log('🌱 Seeding Super Admin user...');
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('AdminPass123!', salt);
    const defaultScholarPassword = await bcrypt.hash('ScholarPass123!', salt);

    const admin = await User.create({
      email: 'admin@africanscholar.org',
      password_hash: adminPassword,
      role: 'SUPER_ADMIN',
      avatar_url: '/default-avatar.svg',
      is_verified: true
    });

    console.log('🌱 Seeding Award categories and benchmark criteria...');
    const awardsData = [
      {
        tier: 'NATIONAL',
        title: 'National Scholar of the Year (Nigeria)',
        country: 'Nigeria',
        description: 'Recognizing outstanding academic output, high impact research, and national leadership across Nigerian universities.',
        award_value: {
          prize_amount: '$5,000',
          plaque: 'National Academic Laureate Plaque',
          icon_items: 'Gold Medal Pin of Excellence',
          podcast_interview: 'Exclusive Feature on The African Scholar Podcast'
        },
        evaluation_index: [
          { rule: 'Attended at least 3 conferences within Nigeria in the last 3 years (including evaluation year)', benchmark: '>= 3 Conferences', key: 'conferences_last_3_years' },
          { rule: 'Cited by researchers across different regions (West, East, South, North Nigeria)', benchmark: 'All 4 Regional Citations', key: 'national_citation_spread' },
          { rule: 'At least 25 total publications by evaluation year', benchmark: '>= 25 Publications', key: 'min_publications', target: 25 },
          { rule: 'At least 1 publication in Q1 journal OR at least 3 in Q2 in evaluation year', benchmark: '>= 1 Q1 or >= 3 Q2', key: 'q1_q2_journals' },
          { rule: 'At least 2,500 citations by evaluation year', benchmark: '>= 2,500 Citations', key: 'min_citations', target: 2500 },
          { rule: 'At least h-index of 15 by evaluation year', benchmark: '>= 15 h-index', key: 'min_h_index', target: 15 },
          { rule: 'Supervised at least 5 MSc and 3 PhD graduates', benchmark: '>= 5 MSc & 3 PhD', key: 'graduates_supervised' },
          { rule: 'At least 1 local/national research collaboration within the last 5 years', benchmark: '>= 1 Collaboration', key: 'national_collaboration' },
          { rule: 'At least 1 research grant within the last 5 years', benchmark: '>= 1 Grant', key: 'research_grants' }
        ],
        year: 2026,
        is_active: true
      },
      {
        tier: 'CONTINENTAL',
        title: 'Continental Scholar of the Year (Africa)',
        country: null,
        description: 'The highest continental academic honour, celebrating pioneering research that addresses African development and cross-border innovation.',
        award_value: {
          prize_amount: '$15,000',
          plaque: 'Pan-African Scholar Trophy',
          icon_items: 'African Scholar Commemorative Insignia',
          podcast_interview: 'Continental Broadcast & Documentary Feature'
        },
        evaluation_index: [
          { rule: 'Attended at least 2 conferences on the African continent in the last 3 years', benchmark: '>= 2 Continental Conferences', key: 'continental_conferences' },
          { rule: 'Cited by researchers from diverse African regions (West, East, South, North)', benchmark: 'Pan-African Regional Spread', key: 'continental_citations' },
          { rule: 'At least 50 total publications by evaluation year', benchmark: '>= 50 Publications', key: 'min_publications', target: 50 },
          { rule: 'At least 2 publications in Q1 journal OR at least 5 in Q2 in evaluation year', benchmark: '>= 2 Q1 or >= 5 Q2', key: 'q1_q2_journals' },
          { rule: 'At least 5,000 citations by evaluation year', benchmark: '>= 5,000 Citations', key: 'min_citations', target: 5000 },
          { rule: 'At least h-index of 25 by evaluation year', benchmark: '>= 25 h-index', key: 'min_h_index', target: 25 },
          { rule: 'Supervised at least 10 MSc and 5 PhD graduates', benchmark: '>= 10 MSc & 5 PhD', key: 'graduates_supervised' },
          { rule: 'At least 1 research grant (national/continental/international) in last 3 years', benchmark: '>= 1 Grant (3 yrs)', key: 'research_grants' },
          { rule: 'At least 1 continental or international collaboration in last 3 years', benchmark: '>= 1 Continental Collab', key: 'continental_collaboration' }
        ],
        year: 2026,
        is_active: true
      },
      {
        tier: 'GLOBAL',
        title: 'Global Scholar of the Year',
        country: null,
        description: 'Honouring an African scholar whose breakthrough contributions have gained definitive international acclaim and worldwide adoption.',
        award_value: {
          prize_amount: '$30,000',
          plaque: 'Global Academic Laureate Plaque & Sash',
          icon_items: 'Custom Diamond Lapel & Medal of Honour',
          podcast_interview: 'Global Keynote Address & International Media Circuit'
        },
        evaluation_index: [
          { rule: 'Attended conferences on at least 2 continents in the last 3 years', benchmark: '>= 2 Continents', key: 'global_conferences' },
          { rule: 'Cited by researchers from all continents (Africa, Europe, Asia, Americas, Oceania)', benchmark: 'Worldwide Citations', key: 'global_citations' },
          { rule: 'At least 75 total publications by evaluation year', benchmark: '>= 75 Publications', key: 'min_publications', target: 75 },
          { rule: 'At least 3 publications in Q1 journal OR at least 10 in Q2 in evaluation year', benchmark: '>= 3 Q1 or >= 10 Q2', key: 'q1_q2_journals' },
          { rule: 'At least 2 publications in journals with Impact Factor (IF) > 10 in evaluation year', benchmark: '>= 2 IF > 10', key: 'high_impact_publications' },
          { rule: 'At least 50,000 citations by evaluation year', benchmark: '>= 50,000 Citations', key: 'min_citations', target: 50000 },
          { rule: 'At least h-index of 50 by evaluation year', benchmark: '>= 50 h-index', key: 'min_h_index', target: 50 },
          { rule: 'Supervised at least 10 MSc and 10 PhD graduates', benchmark: '>= 10 MSc & 10 PhD', key: 'graduates_supervised' },
          { rule: 'At least 1 international collaboration in last 3 years', benchmark: '>= 1 Global Collab', key: 'international_collaboration' },
          { rule: 'At least 2 research grants (national/continental/international) in last 3 years', benchmark: '>= 2 Major Grants', key: 'research_grants' }
        ],
        year: 2026,
        is_active: true
      }
    ];

    const createdAwards = await Award.bulkCreate(awardsData);

    console.log('🌱 Seeding Sample Scholars across African Institutions...');
    const scholarsData = [
      {
        email: 'prof.adebayo@ui.edu.ng',
        first_name: 'Babajide',
        initials: 'B.O.',
        surname: 'Adebayo',
        title: 'Full Prof',
        highest_degree: 'PhD',
        gender: 'Male',
        marital_status: 'Married',
        official_email: 'b.adebayo@ui.edu.ng',
        secondary_email: 'prof.badebayo@gmail.com',
        phone: '+234 803 123 4567',
        nationality: 'Nigeria',
        hobbies: 'Chess, Botanical Photography, Classical Afrobeat',
        bio: 'Professor Babajide Adebayo is a Distinguished Chair of Renewable Energy & Computational Fluid Dynamics at the University of Ibadan with over 22 years of groundbreaking research in solar thermal technologies tailored for Sub-Saharan agriculture.',
        university_name: 'University of Ibadan',
        campus: 'Main Campus',
        city: 'Ibadan',
        country: 'Nigeria',
        discipline: 'Mechanical & Energy Engineering',
        research_focus: 'Solar Thermal Harvesting, Sustainable Agriculture Drying Systems, Computational Fluid Dynamics',
        past_positions: [
          'Head of Department of Mechanical Engineering (2015-2018)',
          'Director of Energy Research Center, University of Ibadan (2018-2022)'
        ],
        present_positions: [
          'Dean, Faculty of Technology, University of Ibadan',
          'Executive Council Member, Nigerian Academy of Engineering'
        ],
        mentees_count: 38,
        postdocs_count: 6,
        phd_count: 14,
        msc_count: 32,
        honours_count: 8,
        conferences_count: 42,
        publications_count: 94,
        citations_count: 6420,
        google_h_index: 38,
        google_i10_index: 67,
        awards_count: 6,
        grants_count: 7,
        patents_count: 3,
        community_impact_activities: [
          'Deployed solar-powered crop drying units to 42 agrarian communities in Oyo and Osun states',
          'Founded the West Africa Clean Tech STEM Outreach for Secondary Schools mentoring over 3,000 youths',
          'Technical Advisor to Nigerian Federal Ministry of Power on Solar Grid Integration'
        ],
        avatar_url: '/default-avatar.svg'
      },
      {
        email: 'prof.chimamanda.okafor@unilag.edu.ng',
        first_name: 'Ngozi',
        initials: 'N.C.',
        surname: 'Okafor',
        title: 'Full Prof',
        highest_degree: 'PhD',
        gender: 'Female',
        marital_status: 'Married',
        official_email: 'nokafor@unilag.edu.ng',
        secondary_email: 'ngozi.okafor.sci@gmail.com',
        phone: '+234 802 987 6543',
        nationality: 'Nigeria',
        hobbies: 'Violin, Hiking, Mentoring Young Women in STEM',
        bio: 'Professor Ngozi Okafor is an internationally acclaimed Molecular Biologist at the University of Lagos. Her work focuses on genomic characterization of neglected tropical infectious diseases and anti-microbial resistance surveillance across West Africa.',
        university_name: 'University of Lagos',
        campus: 'Akoka Campus',
        city: 'Lagos',
        country: 'Nigeria',
        discipline: 'Molecular Biology & Genomics',
        research_focus: 'Pathogen Genomics, Infectious Diseases Epidemiology, Anti-Microbial Resistance in Africa',
        past_positions: [
          'Coordinator, Center for Genomics Research, UNILAG (2016-2020)',
          'Visiting Fellow, Wellcome Sanger Institute UK (2014)'
        ],
        present_positions: [
          'Director of Research & Innovation, University of Lagos',
          'Lead Investigator, West African Infectious Disease Genomic Consortium'
        ],
        mentees_count: 45,
        postdocs_count: 8,
        phd_count: 12,
        msc_count: 28,
        honours_count: 11,
        conferences_count: 56,
        publications_count: 112,
        citations_count: 11500,
        google_h_index: 46,
        google_i10_index: 89,
        awards_count: 9,
        grants_count: 12,
        patents_count: 2,
        community_impact_activities: [
          'Led free community genomic screening clinics for 12,000 rural residents in coastal Lagos',
          'Convener of African Women in Bio-Sciences fellowship providing 50 postgraduate grants',
          'National rapid response scientific committee member during epidemic outbreaks'
        ],
        avatar_url: '/default-avatar.svg'
      },
      {
        email: 'prof.mwangi@uonbi.ac.ke',
        first_name: 'Peter',
        initials: 'P.K.',
        surname: 'Mwangi',
        title: 'Full Prof',
        highest_degree: 'PhD',
        gender: 'Male',
        marital_status: 'Married',
        official_email: 'pmwangi@uonbi.ac.ke',
        secondary_email: 'prof.p.mwangi@gmail.com',
        phone: '+254 712 345 678',
        nationality: 'Kenya',
        hobbies: 'Wildlife Conservation Photography, Marathons',
        bio: 'Professor Peter Mwangi is a pioneer in Artificial Intelligence and Satellite Remote Sensing for Climate Resilience at the University of Nairobi, collaborating extensively across IGAD and UNEP to predict drought occurrences in the Horn of Africa.',
        university_name: 'University of Nairobi',
        campus: 'Chiromo Campus',
        city: 'Nairobi',
        country: 'Kenya',
        discipline: 'Computer Science & Artificial Intelligence',
        research_focus: 'Geospatial Deep Learning, Climate Modeling, Predictive Disaster Warning Systems',
        past_positions: [
          'Head of School of Computing, University of Nairobi (2017-2021)'
        ],
        present_positions: [
          'Director, East African AI & Climate Analytics Lab',
          'Scientific Advisor, African Union Space Agency'
        ],
        mentees_count: 30,
        postdocs_count: 5,
        phd_count: 9,
        msc_count: 22,
        honours_count: 6,
        conferences_count: 38,
        publications_count: 78,
        citations_count: 5800,
        google_h_index: 34,
        google_i10_index: 52,
        awards_count: 5,
        grants_count: 8,
        patents_count: 1,
        community_impact_activities: [
          'Developed SMS drought warning portal serving 120,000 smallholder pastoralists in Northern Kenya',
          'Trained over 500 African meteorological officers on machine learning satellite processing'
        ],
        avatar_url: '/default-avatar.svg'
      },
      {
        email: 'prof.mensah@ug.edu.gh',
        first_name: 'Kwame',
        initials: 'K.A.',
        surname: 'Mensah',
        title: 'Associate Prof',
        highest_degree: 'PhD',
        gender: 'Male',
        marital_status: 'Married',
        official_email: 'kamensah@ug.edu.gh',
        secondary_email: 'kmensah.scholar@outlook.com',
        phone: '+233 244 567 890',
        nationality: 'Ghana',
        hobbies: 'Highlife Music, Organic Farming, Table Tennis',
        bio: 'Professor Kwame Mensah is an Associate Professor of Agricultural Economics and Food Policy at the University of Ghana, Legon. He has spearheaded pan-African grain supply chain optimizations and sustainable cocoa cooperative frameworks.',
        university_name: 'University of Ghana',
        campus: 'Legon Campus',
        city: 'Accra',
        country: 'Ghana',
        discipline: 'Agricultural Economics',
        research_focus: 'Food Security, Agricultural Value Chains, Smallholder Economics in West Africa',
        past_positions: [
          'Senior Research Fellow, Institute of Statistical, Social and Economic Research (ISSER)'
        ],
        present_positions: [
          'Associate Professor and Head of Agribusiness Unit, University of Ghana',
          'Policy Advisor, ECOWAS Food Security Taskforce'
        ],
        mentees_count: 24,
        postdocs_count: 2,
        phd_count: 6,
        msc_count: 18,
        honours_count: 4,
        conferences_count: 29,
        publications_count: 48,
        citations_count: 3200,
        google_h_index: 22,
        google_i10_index: 36,
        awards_count: 3,
        grants_count: 5,
        patents_count: 0,
        community_impact_activities: [
          'Established farmer field schools for 2,400 cocoa smallholders across Ashanti and Western regions',
          'Authored ECOWAS tariff reduction brief for intra-African cereal trade'
        ],
        avatar_url: '/default-avatar.svg'
      },
      {
        email: 'prof.kruger@uct.ac.za',
        first_name: 'Anel',
        initials: 'A.M.',
        surname: 'van der Merwe',
        title: 'Full Prof',
        highest_degree: 'DSc',
        gender: 'Female',
        marital_status: 'Single',
        official_email: 'anel.merwe@uct.ac.za',
        secondary_email: 'prof.anel.merwe@gmail.com',
        phone: '+27 21 650 9111',
        nationality: 'South Africa',
        hobbies: 'Ocean Swimming, Astronomy, Sculpture',
        bio: 'Professor Anel van der Merwe holds the South African Research Chair in Astrophysics & Computational Cosmology at the University of Cape Town. She is a core contributor to the Square Kilometre Array (SKA) project.',
        university_name: 'University of Cape Town',
        campus: 'Upper Campus',
        city: 'Cape Town',
        country: 'South Africa',
        discipline: 'Astrophysics & Data Science',
        research_focus: 'Radio Astronomy, Cosmic Magnetism, Big Data Processing for SKA Observatory',
        past_positions: [
          'Chair of Astronomy Department, UCT (2014-2019)'
        ],
        present_positions: [
          'Director of Institute for Data Intensive Astronomy, UCT',
          'Member of Science Advisory Committee, SKA Observatory'
        ],
        mentees_count: 52,
        postdocs_count: 14,
        phd_count: 18,
        msc_count: 35,
        honours_count: 14,
        conferences_count: 75,
        publications_count: 185,
        citations_count: 54000,
        google_h_index: 68,
        google_i10_index: 142,
        awards_count: 12,
        grants_count: 15,
        patents_count: 4,
        community_impact_activities: [
          'Built mobile planetarium outreach bringing astrophysics to 45 rural schools in the Karoo',
          'Organized African Astronomical Society schools for 400 African physics students'
        ],
        avatar_url: '/default-avatar.svg'
      }
    ];

    const createdUsers = [];

    for (const scholar of scholarsData) {
      const user = await User.create({
        email: scholar.email,
        password_hash: defaultScholarPassword,
        role: 'SCHOLAR',
        avatar_url: scholar.avatar_url,
        is_verified: true
      });

      await ScholarProfile.create({
        user_id: user.id,
        title: scholar.title,
        highest_degree: scholar.highest_degree,
        first_name: scholar.first_name,
        initials: scholar.initials,
        surname: scholar.surname,
        gender: scholar.gender,
        marital_status: scholar.marital_status,
        official_email: scholar.official_email,
        secondary_email: scholar.secondary_email,
        phone: scholar.phone,
        nationality: scholar.nationality,
        hobbies: scholar.hobbies,
        bio: scholar.bio,
        university_name: scholar.university_name,
        campus: scholar.campus,
        city: scholar.city,
        country: scholar.country,
        discipline: scholar.discipline,
        research_focus: scholar.research_focus,
        past_positions: scholar.past_positions,
        present_positions: scholar.present_positions,
        mentees_count: scholar.mentees_count,
        postdocs_count: scholar.postdocs_count,
        phd_count: scholar.phd_count,
        msc_count: scholar.msc_count,
        honours_count: scholar.honours_count,
        conferences_count: scholar.conferences_count,
        publications_count: scholar.publications_count,
        citations_count: scholar.citations_count,
        google_h_index: scholar.google_h_index,
        google_i10_index: scholar.google_i10_index,
        awards_count: scholar.awards_count,
        grants_count: scholar.grants_count,
        patents_count: scholar.patents_count,
        community_impact_activities: scholar.community_impact_activities,
        fee_paid: true,
        paystack_reference: 'PROMO-2026-WAIVED'
      });

      createdUsers.push(user);
    }

    console.log('🌱 Seeding Sample Award Applications for Review Station...');
    // Prof Adebayo applied for National Award
    await AwardApplication.create({
      user_id: createdUsers[0].id,
      award_id: createdAwards[0].id, // National
      supporting_evidence: {
        conferences_list: [
          'Nigerian Society of Engineers Annual National Conference, Abuja (2025)',
          'West African Clean Energy Summit, Lagos (2024)',
          'Northern Renewable Energy Workshop, Kaduna (2023)'
        ],
        regional_citations_spread: 'Verified citations from North (ABU Zaria), East (UNN Nsukka), South (UNIPORT), and West (OAU Ife & UI)',
        q1_q2_publications: [
          'Nature Energy (Q1, 2025) - DOI: 10.1038/s41560-025-0123-x',
          'Applied Energy (Q1, 2025) - DOI: 10.1016/j.apenergy.2025.119200',
          'Renewable Energy (Q1, 2024) - DOI: 10.1016/j.renene.2024.108421'
        ],
        grants_and_collaborations: [
          'TETFund National Research Fund (NRF) Grant ($80,000, 2024)',
          'National Collaboration with Federal University of Technology Minna (2023-2026)'
        ],
        supervision_graduates: '14 PhDs & 32 MSc graduates documented and confirmed by UI Postgraduate College'
      },
      status: 'UNDER_REVIEW',
      admin_comments: 'Strong documentation submitted. Meets all minimum thresholds for publications, citations, and multi-regional citation distribution across Nigeria.',
      score_details: {
        publications_verified: true,
        citations_verified: true,
        regional_spread_verified: true,
        q1_journal_verified: true
      }
    });

    // Prof Okafor applied for Continental Award
    await AwardApplication.create({
      user_id: createdUsers[1].id,
      award_id: createdAwards[1].id, // Continental
      supporting_evidence: {
        conferences_list: [
          'African Society of Human Genetics Conference, Kigali, Rwanda (2024)',
          'African Conference on Emerging Infectious Diseases, Dakar, Senegal (2025)'
        ],
        regional_citations_spread: 'Citations documented from West (Nigeria, Ghana), East (Kenya, Uganda), South (South Africa), North (Egypt)',
        q1_q2_publications: [
          'The Lancet Infectious Diseases (Q1, IF 36.4, 2025)',
          'Cell Host & Microbe (Q1, IF 21.0, 2024)',
          'Nature Microbiology (Q1, 2025)'
        ],
        grants_and_collaborations: [
          'Wellcome Trust Continental Collaborative Grant ($450,000, 2024-2027)',
          'Pan-African Genomic Surveillance Consortium collaboration with Stellenbosch & KEMRI'
        ],
        supervision_graduates: '12 PhDs and 28 MScs graduated'
      },
      status: 'APPROVED',
      admin_comments: 'Exceptional continental footprint. Published in premier tier Q1 journals and demonstrates active cross-border African research consortium leadership.',
      score_details: {
        continental_conferences: true,
        pan_african_citations: true,
        publications_verified: true,
        q1_journal_verified: true,
        continental_grants: true
      }
    });

    // Prof Anel applied for Global Award
    await AwardApplication.create({
      user_id: createdUsers[4].id,
      award_id: createdAwards[2].id, // Global
      supporting_evidence: {
        conferences_list: [
          'International Astronomical Union General Assembly, Cape Town (Africa, 2024)',
          'European Astronomical Society Annual Meeting, Padua (Europe, 2024)',
          'American Astronomical Society Meeting, Seattle (North America, 2025)'
        ],
        regional_citations_spread: 'Global citations across all 6 continents with over 54,000 recorded citations and h-index of 68.',
        q1_q2_publications: [
          'Nature (Q1, IF 64.8, 2025) - Discovery of Fast Radio Burst Cosmic Echoes',
          'Science (Q1, IF 56.9, 2024) - High-resolution SKA precursor mapping',
          'Astrophysical Journal Letters (Q1, 2025)'
        ],
        grants_and_collaborations: [
          'European Research Council / South Africa Bilateral Mega Grant ($2.1M, 2023-2027)',
          'SKA Observatory Inter-Continental Consortium Director'
        ],
        supervision_graduates: '18 PhDs and 35 MScs graduated across 8 nationalities'
      },
      status: 'AWARDED',
      admin_comments: 'Unanimously selected as Global Scholar of the Year 2026. Breakthrough astrophysical leadership and transformative impact for African science globally.',
      score_details: {
        global_continents: true,
        impact_factor_gt10: true,
        citations_gt50k: true,
        h_index_gt50: true,
        international_consortium: true
      }
    });

    console.log('🌱 Seeding Sponsor Banners and Partners...');
    const sponsorsData = [
      {
        sponsor_name: 'African Development Bank (AfDB) Research Fund',
        banner_image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=1200&auto=format&fit=crop&q=80',
        redirect_url: 'https://www.afdb.org',
        placement: 'HERO_BANNER',
        is_active: true
      },
      {
        sponsor_name: 'MTN Foundation STEM Grant Initiative',
        banner_image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80',
        redirect_url: 'https://www.mtn.ng',
        placement: 'SIDEBAR',
        is_active: true
      },
      {
        sponsor_name: 'Elsevier African Science Research Alliance',
        banner_image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&auto=format&fit=crop&q=80',
        redirect_url: 'https://www.elsevier.com',
        placement: 'FOOTER',
        is_active: true
      }
    ];

    await Sponsor.bulkCreate(sponsorsData);

    console.log('🎉 Database seeding complete!');
    console.log('Credentials:');
    console.log('Super Admin: admin@africanscholar.org / AdminPass123!');
    console.log('Scholar Login: prof.adebayo@ui.edu.ng / ScholarPass123!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedDatabase();
