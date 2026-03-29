import { useState, useEffect, useRef, useCallback } from "react";
import {
  Keyboard, Trophy, Target, Zap, Flame, Award, Lock,
  ChevronRight, Star, BookOpen, Play, LogOut,
  Facebook, User as UserIcon, ShieldCheck, CreditCard,
  CheckCircle2, BarChart2, Gamepad2, Home, ArrowLeft,
  Timer, Shuffle, RefreshCw, Crown, FileText, Mail,
  AlertCircle, XCircle
} from "lucide-react";

// ─── EXISTING DATA ────────────────────────────────────────────────────────────
const LESSONS = [
  { id: 1, title: "Home Row: Left Hand",  content: "asdf asdf asdf asdf",    xp: 50  },
  { id: 2, title: "Home Row: Right Hand", content: "jkl; jkl; jkl; jkl;",    xp: 50  },
  { id: 3, title: "Home Row: Both Hands", content: "asdf jkl; asdf jkl;",    xp: 100 },
  { id: 4, title: "G & H Keys",           content: "asdfgh jkl; gh gh gh",    xp: 100 },
  { id: 5, title: "Top Row: QWERT",       content: "qwert qwert qwert qwert", xp: 150 },
];

const PRICING_PLANS = [
  { id: "monthly",     name: "Monthly",     price: 99,  period: "month",     tag: null            },
  { id: "quarterly",   name: "Quarterly",   price: 299, period: "3 months",  tag: null            },
  { id: "semi-annual", name: "Semi-Annual", price: 499, period: "6 months",  tag: "Most Valuable" },
  { id: "annual",      name: "Annual",      price: 999, period: "12 months", tag: "Most Popular"  },
];

const SPEED_WORDS = [
  "the","be","to","of","and","a","in","that","have","it","for","not","on","with",
  "he","as","you","do","at","this","but","his","by","from","they","we","say",
  "her","she","or","an","will","my","one","all","would","there","their","what",
  "so","up","out","if","about","who","get","which","go","me","when","make",
  "can","like","time","no","just","him","know","take",
];

const SCRAMBLE_WORDS = [
  { word: "keyboard", hint: "You type on this"        },
  { word: "typing",   hint: "What you are doing"      },
  { word: "finger",   hint: "You use these to type"   },
  { word: "speed",    hint: "How fast you go"         },
  { word: "practice", hint: "What makes perfect"      },
  { word: "master",   hint: "Expert level"            },
  { word: "accuracy", hint: "How correct you are"     },
  { word: "rhythm",   hint: "The beat of your typing" },
  { word: "lesson",   hint: "Something you learn"     },
  { word: "letters",  hint: "Alphabet characters"     },
];

// ─── INDIA GOVT EXAM MOCK TESTS ───────────────────────────────────────────────
const GOVT_EXAMS = [
  {
    id: "ssc-chsl",
    name: "SSC CHSL",
    fullName: "Staff Selection Commission – Combined Higher Secondary Level",
    badge: "SSC",
    badgeColor: "#1d4ed8",
    post: "LDC / DEO / PA / SA",
    required_wpm: 35,
    time_minutes: 10,
    language: "English",
    category: "Central Govt",
    description: "Typing speed test for Lower Division Clerk and Data Entry Operator post. Minimum 35 WPM required.",
    passage: `The Staff Selection Commission conducts the Combined Higher Secondary Level examination every year to recruit candidates for various posts in government departments and ministries. The examination is conducted in multiple stages including a computer based test and a skill test. The skill test for the post of Lower Division Clerk requires candidates to type at a minimum speed of thirty five words per minute on a computer in English or thirty words per minute in Hindi. For the post of Data Entry Operator the candidate has to perform data entry of eight thousand key depressions per hour. The typing test is conducted on a personal computer and candidates are required to type a given passage within the specified time limit. The accuracy of typing is measured by calculating the number of correct words typed per minute. Errors and corrections are penalised during the evaluation process. Candidates must practice regularly to achieve the required speed and accuracy. The government provides a standardized format for the typing test and all candidates are evaluated under the same conditions. Regular practice on a keyboard following proper finger placement techniques can significantly improve typing speed over a period of time. Aspirants should focus on both speed and accuracy as both are important for clearing the typing test. The test is qualifying in nature and marks are not counted in the final merit list but clearing it is mandatory for appointment to the advertised post in the organization.`,
  },
  {
    id: "ssc-cgl-deo",
    name: "SSC CGL – DEO",
    fullName: "Staff Selection Commission – Combined Graduate Level (Data Entry Operator)",
    badge: "SSC",
    badgeColor: "#1d4ed8",
    post: "Data Entry Operator",
    required_wpm: 27, // 8000 keystrokes/hr = ~27 WPM approx
    key_per_hour: 8000,
    time_minutes: 15,
    language: "English",
    category: "Central Govt",
    description: "Data Entry speed of 8000 key depressions per hour required. Approximately 27 WPM.",
    passage: `India is a country with a rich heritage and culture that spans thousands of years. The history of the Indian subcontinent is one of the oldest in the world with evidence of human habitation dating back to prehistoric times. The Indus Valley Civilization which flourished around four thousand years ago was one of the earliest urban civilizations in the world. After independence in nineteen forty seven India adopted a democratic form of government based on the principles of equality liberty fraternity and justice. The Constitution of India which came into force on the twenty sixth of January nineteen fifty is one of the longest written constitutions in the world. India is a federal republic with a parliamentary form of government at both the central and state levels. The President of India is the constitutional head of the country while the Prime Minister is the head of government. The Parliament of India consists of two houses namely the Lok Sabha and the Rajya Sabha. India has made significant progress in various fields including science technology agriculture and space exploration since independence. The Indian Space Research Organisation has successfully launched numerous satellites and space missions making India one of the leading space faring nations in the world. India is also known for its advancements in information technology software development and digital services. The country has a diverse population with multiple languages religions and cultures coexisting peacefully. Hindi is the official language of the union but there are twenty two scheduled languages recognized by the Constitution of India.`,
  },
  {
    id: "ssc-steno-d",
    name: "SSC Stenographer – Grade D",
    fullName: "Staff Selection Commission – Stenographer Grade D",
    badge: "SSC",
    badgeColor: "#1d4ed8",
    post: "Stenographer Grade D",
    required_wpm: 35,
    time_minutes: 50, // 10 min dictation, 40 min transcription
    language: "English",
    category: "Central Govt",
    description: "Typing test (transcription) at 35 WPM. Dictation at 80 WPM, transcription time 50 minutes.",
    passage: `The government of India has taken several initiatives to promote digital literacy and e-governance across the country. Under the Digital India programme various services have been made available online to citizens so that they do not have to visit government offices for routine work. The programme aims to transform India into a digitally empowered society and knowledge economy. Several departments have launched mobile applications and web portals for the convenience of citizens. The National e-Governance Plan has been instrumental in implementing electronic service delivery at the grass root level throughout the country. Aadhaar the unique identification number issued by the Unique Identification Authority of India has enabled better targeting of government subsidies and benefits to deserving beneficiaries. The direct benefit transfer scheme has helped in eliminating middlemen and ensuring that benefits reach directly to the bank accounts of beneficiaries. The government has also taken steps to ensure that every citizen has access to banking services through the Pradhan Mantri Jan Dhan Yojana. Financial inclusion is an important objective of the government and significant progress has been made in this direction over the past few years. Millions of bank accounts have been opened under this scheme enabling people to access formal financial services for the first time. The success of these programmes demonstrates the potential of technology in improving governance and delivering services to citizens in an efficient and transparent manner at all levels of government.`,
  },
  {
    id: "ssc-steno-c",
    name: "SSC Stenographer – Grade C",
    fullName: "Staff Selection Commission – Stenographer Grade C",
    badge: "SSC",
    badgeColor: "#1d4ed8",
    post: "Stenographer Grade C",
    required_wpm: 40,
    time_minutes: 35,
    language: "English",
    category: "Central Govt",
    description: "Transcription typing at 40 WPM. Dictation at 100 WPM for 7 minutes, transcription 35 minutes.",
    passage: `Education is the most powerful weapon which you can use to change the world. The right to education is a fundamental right of every child in India and the government has taken various steps to ensure that every child gets access to quality education. The Right to Education Act passed in two thousand nine made education compulsory for children between the ages of six and fourteen years. Under this act private schools are required to reserve twenty five percent of their seats for children from economically weaker sections of society. The mid-day meal scheme has been instrumental in increasing school enrolment and reducing dropout rates especially among children from poor families. The scheme provides nutritious meals to children in government schools thereby addressing the problem of hunger and malnutrition among school going children. Higher education in India has also undergone significant changes with the introduction of the New Education Policy in twenty twenty. The policy aims to transform the education system in India by promoting multidisciplinary learning research and innovation at all levels. Several new institutions of national importance have been established to promote excellence in higher education and research. The government has also launched various scholarships and fellowship programmes to support talented students from underprivileged backgrounds. Digital education has gained importance especially after the pandemic which forced educational institutions to adopt online modes of teaching and learning. The National Digital Education Architecture aims to create a comprehensive digital infrastructure for education in the country to ensure continuity of learning for all students.`,
  },
  {
    id: "rrb-ntpc",
    name: "RRB NTPC",
    fullName: "Railway Recruitment Board – Non Technical Popular Categories",
    badge: "RRB",
    badgeColor: "#7c3aed",
    post: "Junior Clerk / Junior Account Assistant / Junior Time Keeper",
    required_wpm: 35,
    time_minutes: 10,
    language: "English",
    category: "Railway",
    description: "Typing test for clerical posts in Indian Railways. 35 WPM in English required.",
    passage: `Indian Railways is one of the largest railway networks in the world and plays a vital role in the transportation of passengers and goods across the length and breadth of the country. It is owned and operated by the Government of India through the Ministry of Railways. The Indian Railways was first established during the British colonial period with the first train running between Mumbai and Thane in eighteen fifty three. Since then the network has expanded significantly and today it covers a distance of over sixty seven thousand kilometres with more than thirteen thousand stations across the country. Indian Railways employs over thirteen lakh employees making it one of the largest employers in the world. The railway system is divided into several zones each managed by a zonal railway headquarter. The zones are further divided into divisions for administrative purposes. Indian Railways has been modernising its infrastructure and services over the years with the introduction of high speed trains improved passenger amenities and advanced signalling systems. The introduction of the Vande Bharat Express trains has been a major step in upgrading the quality of rail travel in India. The Dedicated Freight Corridor project aims to separate freight traffic from passenger traffic on major routes to improve the efficiency of goods transportation. Indian Railways also contributes significantly to the national economy by transporting raw materials finished goods and agricultural produce across the country. The railway network connects major cities and towns with remote areas providing an affordable mode of transport to millions of people every day throughout the year.`,
  },
  {
    id: "cpct",
    name: "CPCT",
    fullName: "Computer Proficiency Certification Test (Madhya Pradesh)",
    badge: "MP",
    badgeColor: "#0f766e",
    post: "Various MP Govt Posts requiring computer proficiency",
    required_wpm: 30,
    time_minutes: 15,
    language: "English",
    category: "State Govt – MP",
    description: "MP government mandatory test. 30 WPM English or 20 WPM Hindi. Required for most MP Govt jobs.",
    passage: `Madhya Pradesh is the second largest state of India by area and is located in the central part of the country. The state is known for its rich natural resources forests wildlife and cultural heritage. Bhopal the capital of Madhya Pradesh is known as the city of lakes owing to the presence of many beautiful lakes in and around the city. The state has a diverse geography ranging from the Vindhya and Satpura ranges to the fertile plains of the Narmada valley. Agriculture is the primary occupation of the majority of the population of Madhya Pradesh with wheat soybean and pulses being the major crops grown in the state. The state is also rich in mineral resources including coal diamonds copper manganese and limestone. Madhya Pradesh is known as the heart of India due to its central location in the country. The state has a rich cultural heritage with several UNESCO world heritage sites including Khajuraho the Buddhist monuments at Sanchi and the rock shelters of Bhimbetka. The state government has been working on various development projects to improve the standard of living of its citizens. Infrastructure development in the form of roads bridges and urban development has been given priority. The tourism sector has been identified as a major driver of economic growth and the state government has been promoting various tourist destinations. Wildlife tourism is particularly popular with several national parks and tiger reserves attracting visitors from across the country and abroad. Kanha Bandhavgarh Pench and Panna are some of the famous tiger reserves in Madhya Pradesh that are home to a large number of tigers and other wildlife.`,
  },
  {
    id: "dsssb",
    name: "DSSSB",
    fullName: "Delhi Subordinate Services Selection Board",
    badge: "DELHI",
    badgeColor: "#b45309",
    post: "Junior Clerk / Steno / PA / LDC",
    required_wpm: 35,
    time_minutes: 10,
    language: "English",
    category: "State Govt – Delhi",
    description: "Typing test for Delhi government posts. 35 WPM English or 30 WPM Hindi required.",
    passage: `Delhi the national capital territory of India is the political and administrative centre of the country. It is one of the most densely populated cities in the world and serves as the seat of the government of India. Delhi has a rich history spanning several centuries and has been the capital of various empires and dynasties. The city is home to numerous historical monuments and heritage sites including the Red Fort Qutub Minar Humayun Tomb and India Gate. The Red Fort which was built by the Mughal Emperor Shah Jahan in the seventeenth century is a symbol of Indian heritage and is used for the Independence Day celebrations every year. The government of Delhi provides various services to its citizens through multiple departments and agencies. The Delhi government has been working on improving the quality of life of its residents through various social welfare schemes and infrastructure development projects. The city has a well-developed public transport system including the Delhi Metro which is one of the largest and busiest metro systems in Asia. The metro has revolutionised public transportation in Delhi making it more convenient affordable and environmentally friendly for millions of commuters. Delhi is also a major centre for commerce trade industry and education with numerous universities colleges and research institutions located in the city. The city attracts migrants from all parts of India in search of employment and better opportunities. The government of Delhi has been working to ensure that basic amenities such as water electricity and housing are available to all its residents including those living in unauthorized colonies and slums.`,
  },
  {
    id: "highcourt-steno",
    name: "High Court Stenographer",
    fullName: "Various High Courts – Stenographer / Personal Assistant",
    badge: "HC",
    badgeColor: "#be123c",
    post: "Stenographer / Personal Assistant",
    required_wpm: 40,
    time_minutes: 10,
    language: "English",
    category: "Judiciary",
    description: "Typing test for High Court steno posts. 40 WPM required. Judiciary standard passages.",
    passage: `The judiciary is one of the three pillars of democracy and plays a crucial role in upholding the rule of law and protecting the rights of citizens. The Supreme Court of India is the apex court of the country and its decisions are binding on all courts in India. The High Courts exercise original appellate and supervisory jurisdiction in their respective states and union territories. The district courts and subordinate courts form the lower tier of the judiciary and deal with the majority of cases filed by citizens. The Constitution of India guarantees the independence of the judiciary and provides for the separation of powers between the executive legislature and judiciary. Judges of the Supreme Court and High Courts are appointed by the President of India in consultation with the Chief Justice of India. The process of appointment of judges is an important aspect of judicial independence and there have been discussions about making the process more transparent and accountable. Access to justice is a fundamental right and the legal aid system provides assistance to those who cannot afford legal representation. The National Legal Services Authority and State Legal Services Authorities provide free legal aid to eligible persons including women children scheduled castes and scheduled tribes. Alternative dispute resolution mechanisms such as Lok Adalat mediation and arbitration have been promoted to reduce the burden on courts and provide quick and affordable justice to litigants. The digitisation of court records and the implementation of the e-Courts project have improved the efficiency of the judicial system and made it more accessible to citizens across the country.`,
  },
  {
    id: "up-police-operator",
    name: "UP Police Computer Operator",
    fullName: "Uttar Pradesh Police – Computer Operator Grade A & B",
    badge: "UP",
    badgeColor: "#065f46",
    post: "Computer Operator Grade A / Grade B",
    required_wpm: 25,
    time_minutes: 10,
    language: "English",
    category: "State Govt – UP",
    description: "Typing test for UP Police computer operator posts. 25 WPM English required.",
    passage: `The Uttar Pradesh Police is one of the largest police forces in India and is responsible for maintaining law and order in the most populous state of the country. The police force is headed by the Director General of Police and is organised into various zones ranges and districts for administrative and operational purposes. The state police works under the overall supervision of the state government and is supported by various specialised units including the crime branch anti-terrorism squad and special task force. The Uttar Pradesh Police has been working on modernising its infrastructure and adopting new technologies to improve its efficiency and effectiveness. The implementation of the digital police portal has made it easier for citizens to register complaints and access police services without visiting the police station. The e-FIR system allows citizens to register first information reports online saving time and reducing the inconvenience of visiting the police station. The state police has also been strengthening its cyber crime unit to deal with the increasing number of crimes committed using digital technology. Community policing initiatives have been launched to build trust between the police and the public and to involve citizens in crime prevention activities. The police force has been working on improving the response time to emergency calls and ensuring that help reaches citizens in distress quickly. The establishment of dial one hundred emergency service has been an important step in this direction. The state government has also been working on improving the welfare and training of police personnel to enhance their capacity to serve the public effectively.`,
  },
  {
    id: "ibps-clerk",
    name: "IBPS Clerk – DEO",
    fullName: "Institute of Banking Personnel Selection – Clerk (Data Entry)",
    badge: "BANK",
    badgeColor: "#1e40af",
    post: "Clerk (Data Entry Operator – Banks)",
    required_wpm: 30,
    time_minutes: 10,
    language: "English",
    category: "Banking",
    description: "Typing / data entry component for banking clerical posts. 30 WPM required.",
    passage: `Banking is the backbone of the financial system of any country and plays a vital role in mobilising savings and channelling them into productive investments. The banking sector in India has undergone significant transformation over the past few decades with the introduction of economic reforms and liberalisation. The Reserve Bank of India is the central bank of the country and is responsible for regulating the monetary policy and overseeing the functioning of all banks in India. Public sector banks private sector banks regional rural banks cooperative banks and foreign banks form the banking landscape of India. The nationalisation of major banks in nineteen sixty nine was a landmark event in the history of Indian banking and helped extend banking services to rural areas and to the masses. The introduction of core banking solutions has enabled banks to provide seamless services to their customers across all branches in India and abroad. Internet banking and mobile banking have revolutionised the way people access banking services allowing them to conduct transactions from the comfort of their homes. The Unified Payments Interface has transformed the digital payments landscape in India making real time fund transfers quick and convenient. The number of digital transactions in India has grown exponentially over the past few years reflecting the increasing adoption of digital payment methods by the people. The financial inclusion agenda of the government has been supported by the banking sector through the opening of bank accounts under the Pradhan Mantri Jan Dhan Yojana scheme. Banks have also been extending credit to small and medium enterprises farmers and self help groups to promote economic development and entrepreneurship at the grass root level across the country.`,
  },
  {
    id: "income-tax-ta",
    name: "Income Tax – Tax Assistant",
    fullName: "Income Tax Department – Tax Assistant / Steno",
    badge: "IT",
    badgeColor: "#1d4ed8",
    post: "Tax Assistant / Multi-Tasking Staff",
    required_wpm: 35,
    time_minutes: 10,
    language: "English",
    category: "Central Govt",
    description: "SSC CGL/CHSL route for Income Tax Dept. 35 WPM English typing test.",
    passage: `The Income Tax Department of India is responsible for administering the direct tax laws in the country and for collecting income tax from individuals companies and other entities. The department functions under the Central Board of Direct Taxes which is a statutory body functioning under the Department of Revenue in the Ministry of Finance. Income tax was first introduced in India during the British period and the current Income Tax Act was enacted in nineteen sixty one. The tax system in India has been undergoing reforms to make it simpler more transparent and taxpayer friendly. The introduction of the Annual Information Statement has made it easier for taxpayers to verify their tax information and file accurate returns. The e-filing portal of the Income Tax Department allows taxpayers to file their income tax returns online from the comfort of their homes. The department has been working on improving its services to taxpayers through various digital initiatives and by reducing the compliance burden on honest taxpayers. The faceless assessment scheme introduced in recent years has eliminated the need for taxpayers to visit income tax offices for routine matters. Under this scheme assessments are conducted online and the identity of the assessing officer is not revealed to the taxpayer ensuring transparency and fairness. The income tax department has also been strengthening its data analytics capabilities to detect tax evasion and ensure that all taxable income is captured and taxed appropriately. Widening the tax base and improving tax compliance are important objectives of the department and various measures have been taken to achieve these goals including the use of technology and data sharing between different government agencies.`,
  },
  {
    id: "epfo-steno",
    name: "EPFO Stenographer",
    fullName: "Employees' Provident Fund Organisation – Stenographer",
    badge: "EPFO",
    badgeColor: "#7c3aed",
    post: "Stenographer / Social Security Assistant",
    required_wpm: 35,
    time_minutes: 10,
    language: "English",
    category: "Central Govt",
    description: "Typing test for EPFO steno posts conducted via SSC. 35 WPM required.",
    passage: `The Employees Provident Fund Organisation is a statutory body under the Ministry of Labour and Employment Government of India. It is one of the largest social security organisations in the world in terms of the number of members and the volume of financial transactions undertaken. The EPFO administers a number of schemes for the benefit of workers in the organised sector including the Employees Provident Fund Scheme the Employees Pension Scheme and the Employees Deposit Linked Insurance Scheme. These schemes provide social security benefits to workers and their families in the form of provident fund pension and insurance. The provident fund is a savings scheme under which both the employer and the employee contribute a percentage of the employee salary every month. The accumulated fund with interest is paid to the employee at the time of retirement or under other specified circumstances. The pension scheme provides monthly pension to employees and their family members after retirement or death. The insurance scheme provides a lump sum payment to the nominee of a member in case of death while in service. The EPFO has been working on modernising its operations and improving services to members and employers through the use of technology. The Universal Account Number allows members to manage their provident fund accounts seamlessly even when they change jobs. Members can view their account balance submit claims and check the status of their claims online through the member portal. The introduction of the composite claim form and the facility to submit claims online has significantly reduced the time taken to settle claims and has improved the overall experience of members interacting with the organisation.`,
  },
  {
    id: "bihar-ssc",
    name: "Bihar SSC – Typist",
    fullName: "Bihar Staff Selection Commission – Lower Division Clerk / Typist",
    badge: "BSSC",
    badgeColor: "#0f766e",
    post: "Lower Division Clerk / Typist",
    required_wpm: 30,
    time_minutes: 10,
    language: "English",
    category: "State Govt – Bihar",
    description: "Bihar state government typing test. 30 WPM English or 25 WPM Hindi required.",
    passage: `Bihar is one of the oldest and most historically significant states of India located in the eastern part of the country. The state is known for its rich cultural heritage and has been the birthplace of several great religions philosophies and empires. Pataliputra the ancient capital of the Maurya Empire and now known as Patna is the capital city of Bihar. The state has a largely agrarian economy with agriculture being the primary occupation of the majority of its population. Rice wheat maize and sugarcane are the major crops grown in Bihar. The state is also known for its production of vegetables and fruits particularly litchi which is grown in the northern districts bordering Nepal. Bihar has made significant strides in governance and development over the past two decades with improvements in law and order infrastructure and social development indicators. The government has been implementing various schemes for the welfare of the people including those related to education health and social protection. The construction of roads and bridges has improved connectivity between different parts of the state making it easier for people to access markets educational institutions and health facilities. The Nitish Kumar government launched the Mukhyamantri Cycle Yojana and Mukhyamantri Kanya Utthan Yojana which helped increase the enrolment of girls in schools across the state. Bihar has a young population which represents both a challenge and an opportunity for the state government. Creating employment opportunities for the youth is one of the key priorities of the state government and various initiatives have been launched to promote skill development and entrepreneurship among young people in the state.`,
  },
  {
    id: "raj-subordinate",
    name: "Rajasthan LDC / Typist",
    fullName: "Rajasthan Staff Selection Board – LDC / Typist / Junior Assistant",
    badge: "RSSB",
    badgeColor: "#b45309",
    post: "LDC / Typist / Junior Assistant",
    required_wpm: 35,
    time_minutes: 10,
    language: "English",
    category: "State Govt – Rajasthan",
    description: "RSSB typing test for Rajasthan state services. 35 WPM English or 30 WPM Hindi.",
    passage: `Rajasthan is the largest state of India by area and is located in the northwestern part of the country. The state is known for its majestic forts palaces sand dunes and vibrant culture. The Thar Desert which covers a large part of western Rajasthan is one of the largest deserts in the world and is home to a unique ecosystem with a diverse range of flora and fauna. The capital city of Rajasthan is Jaipur which is also known as the Pink City due to the colour of its buildings. Jaipur is famous for its stunning architecture including the Hawa Mahal City Palace and Jantar Mantar which is a UNESCO world heritage site. The economy of Rajasthan is largely based on agriculture mineral resources and tourism. Agriculture is the primary occupation of the majority of the rural population with crops like wheat bajra jowar and mustard being cultivated in the state. Rajasthan is rich in mineral resources including marble sandstone limestone zinc lead and copper. The marble quarried in Makrana district was used in the construction of the famous Taj Mahal in Agra. Tourism is a major industry in Rajasthan attracting millions of domestic and international tourists every year. The forts and palaces of Rajasthan including the Amber Fort Mehrangarh Fort and Jaisalmer Fort are major tourist attractions. The state government has been working on developing tourist infrastructure and promoting Rajasthan as a premier tourist destination. The rich folk culture of Rajasthan including its music dance and handicrafts are an important part of the tourism offer of the state.`,
  },
  {
    id: "mp-patwari",
    name: "MP Patwari / Sachivalaya",
    fullName: "Madhya Pradesh Sachivalaya / Patwari Computer Proficiency Test",
    badge: "MP",
    badgeColor: "#0f766e",
    post: "Patwari / Sachivalaya Sahayak / Data Entry Operator",
    required_wpm: 20,
    time_minutes: 10,
    language: "English",
    category: "State Govt – MP",
    description: "MP state typing test via CPCT. 20 WPM Hindi or English required for lower posts.",
    passage: `The state of Madhya Pradesh has been making rapid progress in the field of digital governance and e-services. The government has been implementing several important schemes for the welfare of farmers rural communities and urban poor. The Chief Minister's schemes for housing education health and employment generation have benefited millions of citizens across the state. Agriculture is the backbone of the economy of Madhya Pradesh and the state government has been working to improve the condition of farmers through better irrigation facilities crop insurance schemes and provision of quality seeds and fertilisers at subsidised rates. The Pradhan Mantri Fasal Bima Yojana has been implemented effectively in the state and has provided financial protection to farmers against crop losses due to natural calamities pests and diseases. The state has also been working on improving water conservation and management through watershed development programmes and the construction of check dams small ponds and other water harvesting structures. The Narmada river which originates in Madhya Pradesh is a lifeline for millions of people in the state and the country. Several large dams have been constructed on the Narmada and its tributaries to provide water for irrigation drinking and power generation. The Indira Sagar Dam on the Narmada is one of the largest dams in India and has a massive reservoir behind it. The power sector in Madhya Pradesh has seen significant growth with the state emerging as one of the leading producers of electricity from thermal hydro and solar sources in the country making it energy surplus.`,
  },
];

function doScramble(word) {
  const a = word.split("");
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.join("") === word ? doScramble(word) : a.join("");
}

const INP =
  "w-full px-4 py-3 rounded-xl border border-blue-800 bg-[#0d1424] " +
  "text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 " +
  "focus:ring-2 focus:ring-blue-500/30 transition-all text-base";

// ─── TOAST ────────────────────────────────────────────────────────────────────
function Toast({ msg, color }) {
  if (!msg) return null;
  return (
    <div style={{ background: color || "#2563eb" }}
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl font-bold text-sm text-white shadow-2xl">
      {msg}
    </div>
  );
}

// ─── NAVBAR ───────────────────────────────────────────────────────────────────
function NavBar({ user, view, setView, onLogout }) {
  const items = [
    { id: "dashboard", icon: Home,      label: "Home"  },
    { id: "mocktest",  icon: FileText,  label: "Exams" },
    { id: "stats",     icon: BarChart2, label: "Stats" },
    { id: "games",     icon: Gamepad2,  label: "Games" },
    { id: "pricing",   icon: Crown,     label: "Pro"   },
  ];
  const viewKey = typeof view === "object" ? view.type : view;
  return (
    <header className="bg-[#060b16] border-b border-blue-900/50 sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <button onClick={() => setView("dashboard")} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-[0_0_14px_rgba(37,99,235,0.6)]">
            <Keyboard className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-lg text-white tracking-tight">TypoMaster</span>
        </button>
        <nav className="hidden md:flex items-center gap-1">
          {items.map(it => (
            <button key={it.id} onClick={() => setView(it.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                viewKey === it.id
                  ? "bg-blue-600/25 text-blue-300 border border-blue-500/40"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}>
              <it.icon className="w-4 h-4" />{it.label}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lv {user?.level || 1}</span>
            <div className="w-24 h-1.5 bg-white/10 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${((user?.xp || 0) % 500) / 5}%` }} />
            </div>
          </div>
          {user?.isPremium
            ? <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold"><ShieldCheck className="w-3 h-3" />Pro</span>
            : <span className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-bold"><Zap className="w-3 h-3" />{user?.triesLeft ?? 3} tries</span>
          }
          <button onClick={onLogout} className="text-slate-500 hover:text-red-400 hover:bg-red-400/10 p-2 rounded-lg transition-all">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-[#060b16] border-t border-blue-900/50 flex">
        {items.map(it => (
          <button key={it.id} onClick={() => setView(it.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-2 text-xs font-semibold transition-all ${viewKey === it.id ? "text-blue-400" : "text-slate-600"}`}>
            <it.icon className="w-4 h-4" />{it.label}
          </button>
        ))}
      </div>
    </header>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onGoogle, onFacebook, onEmail }) {
  const [mode, setMode]         = useState("signup");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  return (
    <div className="min-h-screen bg-[#060b16] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-700/10 rounded-full blur-3xl pointer-events-none" />
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[0_0_40px_rgba(37,99,235,0.5)]">
            <Keyboard className="text-white w-9 h-9" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">TypoMaster</h1>
          <p className="text-slate-400 mt-2 text-sm">Master your keyboard. Unlock your speed.</p>
        </div>
        <div className="bg-[#0d1424] border border-blue-900/60 rounded-2xl p-8 shadow-2xl">
          <div className="flex bg-black/40 p-1 rounded-xl mb-8 border border-blue-900/40">
            {["signup","login"].map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all capitalize ${mode === m ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}>
                {m === "signup" ? "Sign Up" : "Login"}
              </button>
            ))}
          </div>
          <div className="space-y-3 mb-6">
            <button type="button" onClick={() => onGoogle(setMode)}
              className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-white/20 hover:bg-gray-50 rounded-xl text-gray-800 font-semibold transition-all text-sm">
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button type="button" onClick={() => onFacebook(setMode)}
              className="w-full flex items-center justify-center gap-3 py-3 bg-[#1877F2] hover:bg-[#1565d8] rounded-xl text-white font-semibold transition-all text-sm">
              <Facebook className="w-5 h-5 flex-shrink-0" />
              Continue with Facebook
            </button>
          </div>
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-blue-900/40" /></div>
            <div className="relative flex justify-center"><span className="bg-[#0d1424] px-3 text-slate-500 text-xs uppercase font-bold tracking-widest">or</span></div>
          </div>
          <form onSubmit={e => { e.preventDefault(); onEmail(email, password, mode, setMode); }} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Email Address</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className={INP} />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Password</label>
              <input type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className={INP} />
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95">
              {mode === "login" ? "Login" : "Create Account"}
            </button>
          </form>
          <p className="text-center text-xs text-slate-600 mt-6">By continuing, you agree to our Terms of Service.</p>
        </div>
      </div>
    </div>
  );
}

// ─── USERNAME PAGE ────────────────────────────────────────────────────────────
function UsernamePage({ onSetUsername, onBack }) {
  const [uname, setUname] = useState("");
  return (
    <div className="min-h-screen bg-[#060b16] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="bg-[#0d1424] border border-blue-900/60 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600/20 border border-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserIcon className="text-blue-400 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">Welcome to the Club!</h2>
            <p className="text-slate-400 mt-2 text-sm">Set up your profile to get started</p>
          </div>
          <div className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Unique Username</label>
              <input type="text" required value={uname} onChange={e => setUname(e.target.value)} placeholder="TypingNinja_24" className={INP} />
            </div>
            <button onClick={() => onSetUsername(uname)} disabled={!uname.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95">
              Start Typing!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, setView, onStartLesson }) {
  const stats = [
    { label: "Top WPM",   value: user?.wpm || 0,          icon: Zap,    c: "text-yellow-400", bg: "bg-yellow-400/10", b: "border-yellow-400/20" },
    { label: "Accuracy",  value: `${user?.accuracy||0}%`, icon: Target, c: "text-green-400",  bg: "bg-green-400/10",  b: "border-green-400/20"  },
    { label: "XP Points", value: user?.xp || 0,           icon: Star,   c: "text-blue-400",   bg: "bg-blue-400/10",   b: "border-blue-400/20"   },
    { label: "Streak",    value: `${user?.streak||0}d`,   icon: Flame,  c: "text-orange-400", bg: "bg-orange-400/10", b: "border-orange-400/20" },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-3xl font-black text-white">Welcome back, <span className="text-blue-400">{user?.username}</span>!</h2>
          <p className="text-slate-400 mt-1 text-sm">Ready to push your limits today?</p>
        </div>
        {!user?.isPremium && (
          <button onClick={() => setView("pricing")} className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Crown className="w-4 h-4" /> Upgrade to Pro
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className={`bg-[#0d1424] border ${s.b} rounded-2xl p-4 flex items-center gap-4`}>
            <div className={`${s.bg} border ${s.b} p-3 rounded-xl`}><s.icon className={`${s.c} w-5 h-5`} /></div>
            <div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p><p className="text-xl font-black text-white mt-0.5">{s.value}</p></div>
          </div>
        ))}
      </div>

      {/* Mock Test Banner */}
      <div onClick={() => setView("mocktest")}
        className="bg-gradient-to-r from-blue-900/50 to-blue-800/20 border border-blue-500/30 rounded-2xl p-5 mb-8 flex items-center justify-between cursor-pointer hover:border-blue-400/60 transition-all group">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600/30 border border-blue-500/40 rounded-xl flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <p className="font-black text-white text-base">Govt Exam Mock Tests</p>
            <p className="text-slate-400 text-xs mt-0.5">SSC · RRB · DSSSB · High Court · CPCT · IBPS · UP Police · and more</p>
          </div>
        </div>
        <ChevronRight className="w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><BookOpen className="w-5 h-5 text-blue-400" /> Your Learning Path</h3>
          <div className="space-y-3">
            {LESSONS.map(lesson => {
              const locked = lesson.id > (user?.unlockedLessons || 1);
              return (
                <button key={lesson.id} onClick={() => !locked && onStartLesson(lesson)} disabled={locked}
                  className={`w-full text-left bg-[#0d1424] border border-blue-900/40 rounded-2xl p-5 transition-all ${locked ? "opacity-40 cursor-not-allowed" : "hover:border-blue-500/40 cursor-pointer group"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-black text-sm ${locked ? "bg-white/5 text-slate-600" : "bg-blue-600/20 text-blue-400 border border-blue-500/30"}`}>{lesson.id}</div>
                      <div><p className="font-bold text-white text-sm">{lesson.title}</p><p className="text-slate-500 text-xs mt-0.5">{lesson.xp} XP · Typing Practice</p></div>
                    </div>
                    {locked ? <Lock className="w-4 h-4 text-slate-600" />
                      : <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-blue-600/20 p-2 rounded-lg"><Play className="w-4 h-4 text-blue-400 fill-blue-400" /></div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="space-y-5">
          <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4"><Gamepad2 className="w-4 h-4 text-blue-400" /> Quick Play</h3>
            <div className="space-y-2">
              <button onClick={() => setView("games")} className="w-full flex items-center justify-between px-4 py-3 bg-blue-600/10 border border-blue-500/20 hover:border-blue-500/50 rounded-xl transition-all group text-sm font-bold text-white">Speed Test <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" /></button>
              <button onClick={() => setView("games")} className="w-full flex items-center justify-between px-4 py-3 bg-white/5 border border-blue-900/40 hover:border-blue-500/30 rounded-xl transition-all group text-sm font-bold text-white">Word Scramble <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400" /></button>
            </div>
          </div>
          <div className="bg-[#0d1424] border border-blue-900/40 rounded-2xl p-5">
            <h3 className="text-base font-bold text-white flex items-center gap-2 mb-4"><Award className="w-4 h-4 text-blue-400" /> Achievements</h3>
            {(user?.xp||0) >= 50
              ? <div className="flex items-center gap-3 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-xl"><Trophy className="w-6 h-6 text-yellow-400 flex-shrink-0" /><div><p className="text-sm font-bold text-white">First Lesson!</p><p className="text-xs text-slate-400">Completed your first lesson</p></div></div>
              : <p className="text-slate-500 text-sm">Complete lessons to unlock achievements!</p>
            }
          </div>
          {!user?.isPremium && (
            <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 border border-blue-500/30 rounded-2xl p-5">
              <h3 className="text-base font-bold text-white flex items-center gap-2 mb-2"><Crown className="w-4 h-4 text-blue-400" /> Go Premium</h3>
              <p className="text-slate-400 text-xs mb-4">Unlimited lessons, all games, all mock tests.</p>
              <button onClick={() => setView("pricing")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-xl transition-all text-sm">View Plans</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── LESSON PAGE ──────────────────────────────────────────────────────────────
function LessonPage({ lesson, onComplete, onBack }) {
  const [typed, setTyped]       = useState("");
  const [startTime, setStart]   = useState(null);
  const [stats, setStats]       = useState({ wpm: 0, accuracy: 0 });
  const [done, setDone]         = useState(false);
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleTyping = e => {
    const value = e.target.value;
    if (!startTime) setStart(Date.now());
    setTyped(value);
    const lessonText = lesson.content;
    let correct = 0;
    for (let i = 0; i < value.length; i++) if (value[i] === lessonText[i]) correct++;
    const accuracy = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
    const elapsed  = (Date.now() - (startTime || Date.now())) / 60000;
    const wpm      = elapsed > 0 ? Math.round((value.length / 5) / elapsed) : 0;
    setStats({ wpm, accuracy });
    if (value === lessonText) {
      setDone(true);
      setTimeout(() => onComplete({ wpm, accuracy, xp: lesson.xp, lessonId: lesson.id }), 1200);
    }
  };
  const chars = lesson.content.split("").map((ch, i) => {
    const color = i < typed.length ? (typed[i] === ch ? "#60a5fa" : "#f87171") : "#475569";
    return <span key={i} style={{ color }}>{ch}</span>;
  });
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><ArrowLeft className="w-4 h-4" /></button>
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Home className="w-4 h-4" /></button>
        <span className="text-slate-500 text-sm">Back to Dashboard</span>
      </div>
      <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">{lesson.title}</h2>
          <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold">+{lesson.xp} XP</span>
        </div>
        <div className="flex gap-4 mb-8">
          <div className="flex-1 bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 text-center"><p className="text-xs font-bold text-slate-500 uppercase">WPM</p><p className="text-3xl font-black text-yellow-400 mt-1">{stats.wpm}</p></div>
          <div className="flex-1 bg-green-400/10 border border-green-400/20 rounded-xl p-4 text-center"><p className="text-xs font-bold text-slate-500 uppercase">Accuracy</p><p className="text-3xl font-black text-green-400 mt-1">{stats.accuracy}%</p></div>
        </div>
        <div className="bg-black/40 border border-blue-900/40 rounded-xl p-6 mb-4 font-mono text-xl tracking-widest text-center leading-loose select-none">{chars}</div>
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${(typed.length / lesson.content.length) * 100}%` }} />
        </div>
        {done
          ? <div className="text-center py-4"><CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-2" /><p className="text-green-400 font-black text-xl">Lesson Complete! 🎉</p></div>
          : <input ref={inputRef} value={typed} onChange={handleTyping} placeholder="Start typing here..." className={INP + " font-mono text-lg"} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
        }
      </div>
    </div>
  );
}

// ─── MOCK TEST LIST PAGE ──────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  "Central Govt":       { bg: "bg-blue-500/10",   border: "border-blue-500/30",   text: "text-blue-400"   },
  "Railway":            { bg: "bg-purple-500/10",  border: "border-purple-500/30", text: "text-purple-400" },
  "Banking":            { bg: "bg-green-500/10",   border: "border-green-500/30",  text: "text-green-400"  },
  "Judiciary":          { bg: "bg-red-500/10",     border: "border-red-500/30",    text: "text-red-400"    },
  "State Govt – Delhi": { bg: "bg-amber-500/10",   border: "border-amber-500/30",  text: "text-amber-400"  },
  "State Govt – MP":    { bg: "bg-teal-500/10",    border: "border-teal-500/30",   text: "text-teal-400"   },
  "State Govt – UP":    { bg: "bg-emerald-500/10", border: "border-emerald-500/30",text: "text-emerald-400"},
  "State Govt – Bihar": { bg: "bg-orange-500/10",  border: "border-orange-500/30", text: "text-orange-400" },
  "State Govt – Rajasthan": { bg: "bg-yellow-500/10", border: "border-yellow-500/30", text: "text-yellow-400" },
};

function MockTestListPage({ setView }) {
  const categories = [...new Set(GOVT_EXAMS.map(e => e.category))];
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <button onClick={() => setView("dashboard")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors">
        <Home className="w-4 h-4" /> Dashboard
      </button>
      <h2 className="text-3xl font-black text-white mb-1">Govt Exam <span className="text-blue-400">Mock Tests</span></h2>
      <p className="text-slate-400 text-sm mb-8">India ke sabhi major government typing exams ke practice tests. Real exam pattern pe based.</p>

      {/* Summary bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: "Total Exams",    value: GOVT_EXAMS.length,  color: "text-blue-400"   },
          { label: "Central Govt",   value: GOVT_EXAMS.filter(e=>e.category==="Central Govt").length, color: "text-blue-400" },
          { label: "State Govt",     value: GOVT_EXAMS.filter(e=>e.category.startsWith("State")).length, color: "text-green-400" },
          { label: "Banking/Others", value: GOVT_EXAMS.filter(e=>!e.category.startsWith("State")&&e.category!=="Central Govt").length, color: "text-purple-400" },
        ].map((s,i) => (
          <div key={i} className="bg-[#0d1424] border border-blue-900/40 rounded-xl p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Exam cards by category */}
      {categories.map(cat => {
        const catExams = GOVT_EXAMS.filter(e => e.category === cat);
        const col = CATEGORY_COLORS[cat] || { bg:"bg-blue-500/10", border:"border-blue-500/30", text:"text-blue-400" };
        return (
          <div key={cat} className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <span className={`${col.bg} ${col.border} ${col.text} border px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest`}>{cat}</span>
              <div className="flex-1 h-px bg-blue-900/30" />
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {catExams.map(exam => (
                <div key={exam.id} className="bg-[#0d1424] border border-blue-900/40 hover:border-blue-500/40 rounded-2xl p-5 transition-all group flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <span style={{ background: exam.badgeColor }} className="text-white text-xs font-black px-2 py-0.5 rounded-md">{exam.badge}</span>
                      <h3 className="text-white font-black text-base mt-2">{exam.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-blue-400 font-black text-lg">{exam.required_wpm} WPM</p>
                      <p className="text-slate-500 text-xs">required</p>
                    </div>
                  </div>
                  {/* Post */}
                  <p className="text-slate-400 text-xs mb-2 font-medium">{exam.post}</p>
                  {/* Description */}
                  <p className="text-slate-500 text-xs mb-4 flex-1">{exam.description}</p>
                  {/* Details row */}
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                      <Timer className="w-3 h-3" /> {exam.time_minutes} min
                    </span>
                    <span className="flex items-center gap-1 text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-lg">
                      {exam.language}
                    </span>
                  </div>
                  {/* CTA */}
                  <button onClick={() => setView({ type: "mocktest-exam", exam })}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-xl text-sm transition-all active:scale-95 flex items-center justify-center gap-2">
                    <Play className="w-4 h-4 fill-white" /> Start Mock Test
                  </button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── MOCK TEST EXAM PAGE ──────────────────────────────────────────────────────
function MockTestExamPage({ exam, setView }) {
  const [phase, setPhase] = useState("intro"); // intro | running | result
  const [typed, setTyped] = useState("");
  const [timeLeft, setTimeLeft] = useState(exam.time_minutes * 60);
  const [startTime, setStart]   = useState(null);
  const [wpm, setWpm]     = useState(0);
  const [accuracy, setAcc] = useState(100);
  const timerRef = useRef(null);
  const inputRef = useRef(null);

  const startTest = () => {
    setPhase("running");
    setTyped("");
    setWpm(0);
    setAcc(100);
    const t = Date.now();
    setStart(t);
    setTimeLeft(exam.time_minutes * 60);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { clearInterval(timerRef.current); setPhase("result"); return 0; }
        return prev - 1;
      });
    }, 1000);
    setTimeout(() => inputRef.current?.focus(), 100);
  };

  useEffect(() => () => clearInterval(timerRef.current), []);

  const handleTyping = e => {
    const value = e.target.value;
    setTyped(value);
    const passage = exam.passage;
    let correct = 0;
    for (let i = 0; i < value.length; i++) if (value[i] === passage[i]) correct++;
    const acc = value.length > 0 ? Math.round((correct / value.length) * 100) : 100;
    const elapsed = (Date.now() - (startTime || Date.now())) / 60000;
    const w = elapsed > 0 ? Math.round((value.length / 5) / elapsed) : 0;
    setWpm(w); setAcc(acc);
    if (value.length >= exam.passage.length) { clearInterval(timerRef.current); setPhase("result"); }
  };

  const submitTest = () => { clearInterval(timerRef.current); setPhase("result"); };

  // Passage display with color
  const passageChars = exam.passage.split("").map((ch, i) => {
    let color = "#334155";
    if (i < typed.length) color = typed[i] === ch ? "#60a5fa" : "#f87171";
    else if (i === typed.length) color = "#94a3b8";
    return <span key={i} style={{ color }}>{ch}</span>;
  });

  const passed = wpm >= exam.required_wpm && accuracy >= 85;
  const mm = String(Math.floor(timeLeft / 60)).padStart(2,"0");
  const ss = String(timeLeft % 60).padStart(2,"0");
  const progress = typed.length / exam.passage.length * 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      {/* Back nav */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => { clearInterval(timerRef.current); setView("mocktest"); }}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><ArrowLeft className="w-4 h-4" /></button>
        <button onClick={() => { clearInterval(timerRef.current); setView("dashboard"); }}
          className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Home className="w-4 h-4" /></button>
        <div className="flex items-center gap-2">
          <span style={{ background: exam.badgeColor }} className="text-white text-xs font-black px-2 py-0.5 rounded-md">{exam.badge}</span>
          <span className="text-white font-bold text-sm">{exam.name}</span>
        </div>
      </div>

      {/* INTRO */}
      {phase === "intro" && (
        <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-white mb-1">{exam.name} Mock Test</h2>
            <p className="text-slate-400 text-sm">{exam.fullName}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {[
              { label: "Required WPM",  value: `${exam.required_wpm} WPM`, color: "text-blue-400"   },
              { label: "Time Limit",    value: `${exam.time_minutes} min`,  color: "text-yellow-400" },
              { label: "Language",      value: exam.language,               color: "text-green-400"  },
            ].map((s,i)=>(
              <div key={i} className="bg-black/30 border border-blue-900/40 rounded-xl p-4 text-center">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-black/30 border border-blue-900/40 rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Post</p>
            <p className="text-white font-semibold text-sm">{exam.post}</p>
          </div>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-400 font-bold text-sm">Instructions</p>
              <ul className="text-slate-400 text-xs mt-1 space-y-1 list-disc list-inside">
                <li>Type the passage exactly as shown. Do not copy-paste.</li>
                <li>Minimum {exam.required_wpm} WPM and 85% accuracy required to pass.</li>
                <li>Timer starts when you click Start Test.</li>
                <li>You can submit early or the test auto-submits when time ends.</li>
              </ul>
            </div>
          </div>
          <button onClick={startTest}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl transition-all text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] active:scale-95">
            Start Mock Test
          </button>
        </div>
      )}

      {/* RUNNING */}
      {phase === "running" && (
        <div className="space-y-4">
          {/* Stats bar */}
          <div className="bg-[#0d1424] border border-blue-900/40 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-black text-xl ${timeLeft <= 30 ? "bg-red-500/20 border border-red-500/30 text-red-400" : "bg-blue-500/10 border border-blue-500/20 text-blue-400"}`}>
              <Timer className="w-5 h-5" />{mm}:{ss}
            </div>
            <div className="flex gap-4">
              <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase">WPM</p><p className="text-yellow-400 font-black text-xl">{wpm}</p></div>
              <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase">Accuracy</p><p className="text-green-400 font-black text-xl">{accuracy}%</p></div>
              <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase">Need</p><p className="text-slate-300 font-black text-xl">{exam.required_wpm}</p></div>
            </div>
            <button onClick={submitTest} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all">Submit</button>
          </div>

          {/* Progress bar */}
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>

          {/* Passage */}
          <div className="bg-[#0d1424] border border-blue-900/40 rounded-2xl p-6 font-mono text-sm leading-7 max-h-52 overflow-y-auto select-none" style={{ wordBreak: "break-word" }}>
            {passageChars}
          </div>

          {/* Input */}
          <textarea
            ref={inputRef}
            value={typed}
            onChange={handleTyping}
            placeholder="Start typing here..."
            rows={5}
            className="w-full px-4 py-3 rounded-xl border border-blue-800 bg-[#0d1424] text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition-all text-sm font-mono resize-none"
            autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false}
          />
        </div>
      )}

      {/* RESULT */}
      {phase === "result" && (
        <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-8 text-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${passed ? "bg-green-400/20 border-2 border-green-400" : "bg-red-400/20 border-2 border-red-400"}`}>
            {passed ? <CheckCircle2 className="w-10 h-10 text-green-400" /> : <XCircle className="w-10 h-10 text-red-400" />}
          </div>
          <h3 className={`text-3xl font-black mb-1 ${passed ? "text-green-400" : "text-red-400"}`}>
            {passed ? "PASSED! 🎉" : "Not Cleared"}
          </h3>
          <p className="text-slate-400 text-sm mb-8">{exam.name} · {exam.post}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className={`${wpm >= exam.required_wpm ? "bg-green-400/10 border-green-400/30" : "bg-red-400/10 border-red-400/30"} border rounded-xl p-4`}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Your WPM</p>
              <p className={`text-3xl font-black mt-1 ${wpm >= exam.required_wpm ? "text-green-400" : "text-red-400"}`}>{wpm}</p>
              <p className="text-xs text-slate-500 mt-1">Need: {exam.required_wpm}</p>
            </div>
            <div className={`${accuracy >= 85 ? "bg-green-400/10 border-green-400/30" : "bg-red-400/10 border-red-400/30"} border rounded-xl p-4`}>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Accuracy</p>
              <p className={`text-3xl font-black mt-1 ${accuracy >= 85 ? "text-green-400" : "text-red-400"}`}>{accuracy}%</p>
              <p className="text-xs text-slate-500 mt-1">Need: 85%</p>
            </div>
            <div className="bg-blue-400/10 border border-blue-400/30 rounded-xl p-4">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Typed</p>
              <p className="text-3xl font-black mt-1 text-blue-400">{typed.length}</p>
              <p className="text-xs text-slate-500 mt-1">characters</p>
            </div>
          </div>

          {!passed && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-6 text-left">
              <p className="text-amber-400 font-bold text-sm mb-1">Tips to Improve</p>
              <ul className="text-slate-400 text-xs space-y-1 list-disc list-inside">
                {wpm < exam.required_wpm && <li>WPM {wpm} hai, {exam.required_wpm} chahiye. Aur practice karo.</li>}
                {accuracy < 85 && <li>Accuracy {accuracy}% hai, 85% chahiye. Slow karo, sahi type karo.</li>}
                <li>Har roz 30 min typing practice karo. Speed aayegi.</li>
              </ul>
            </div>
          )}

          <div className="flex gap-3 justify-center">
            <button onClick={startTest} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all"><RefreshCw className="w-4 h-4" />Try Again</button>
            <button onClick={() => setView("mocktest")} className="border border-blue-900/60 hover:border-blue-500/40 text-white font-bold px-6 py-3 rounded-xl transition-all">All Exams</button>
            <button onClick={() => setView("dashboard")} className="border border-blue-900/60 hover:border-blue-500/40 text-white font-bold px-6 py-3 rounded-xl transition-all"><Home className="w-4 h-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GAMES PAGE ───────────────────────────────────────────────────────────────
function GamesPage({ setView }) {
  const [active, setActive] = useState(null);
  if (active === "speed")    return <SpeedGame    onBack={() => setActive(null)} setView={setView} />;
  if (active === "scramble") return <ScrambleGame onBack={() => setActive(null)} setView={setView} />;
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <button onClick={() => setView("dashboard")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors"><Home className="w-4 h-4" /> Dashboard</button>
      <h2 className="text-3xl font-black text-white mb-1">Games</h2>
      <p className="text-slate-400 text-sm mb-8">Challenge yourself with fun typing games</p>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#0d1424] border border-blue-900/40 rounded-2xl p-6 flex flex-col">
          <div className="w-12 h-12 bg-yellow-400/10 border border-yellow-400/20 rounded-xl flex items-center justify-center mb-4"><Timer className="w-6 h-6 text-yellow-400" /></div>
          <h3 className="text-lg font-bold text-white mb-2">60s Speed Test</h3>
          <p className="text-slate-400 text-sm mb-6 flex-1">Type as many words as you can in 60 seconds.</p>
          <button onClick={() => setActive("speed")} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95">Play Now</button>
        </div>
        <div className="bg-[#0d1424] border border-blue-900/40 rounded-2xl p-6 flex flex-col">
          <div className="w-12 h-12 bg-blue-400/10 border border-blue-400/20 rounded-xl flex items-center justify-center mb-4"><Shuffle className="w-6 h-6 text-blue-400" /></div>
          <h3 className="text-lg font-bold text-white mb-2">Word Scramble</h3>
          <p className="text-slate-400 text-sm mb-6 flex-1">Unscramble 10 typing words as fast as possible.</p>
          <button onClick={() => setActive("scramble")} className="w-full border border-blue-900/60 hover:border-blue-500/40 text-white font-bold py-3 rounded-xl transition-all active:scale-95">Play Now</button>
        </div>
      </div>
    </div>
  );
}

// ─── SPEED GAME ───────────────────────────────────────────────────────────────
function SpeedGame({ onBack, setView }) {
  const [phase, setPhase]     = useState("ready");
  const [timeLeft, setTimeLeft] = useState(60);
  const [words, setWords]     = useState([]);
  const [idx, setIdx]         = useState(0);
  const [input, setInput]     = useState("");
  const [correct, setCorrect] = useState(0);
  const [wrong, setWrong]     = useState(0);
  const inputRef = useRef(null);
  const timerRef = useRef(null);
  const generate = () => Array.from({ length: 80 }, () => SPEED_WORDS[Math.floor(Math.random() * SPEED_WORDS.length)]);
  const startGame = () => {
    clearInterval(timerRef.current);
    setWords(generate()); setIdx(0); setInput(""); setCorrect(0); setWrong(0); setTimeLeft(60); setPhase("playing");
    setTimeout(() => inputRef.current?.focus(), 50);
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if (t <= 1) { clearInterval(timerRef.current); setPhase("done"); return 0; } return t - 1; });
    }, 1000);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);
  const handleInput = e => {
    const val = e.target.value;
    if (val.endsWith(" ")) {
      if (val.trim() === words[idx]) setCorrect(c => c + 1); else setWrong(w => w + 1);
      setIdx(i => i + 1); setInput("");
    } else setInput(val);
  };
  const acc = correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0;
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><ArrowLeft className="w-4 h-4" /></button>
        <button onClick={() => setView("dashboard")} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Home className="w-4 h-4" /></button>
        <h2 className="text-2xl font-bold text-white">60s Speed Test</h2>
      </div>
      {phase === "ready" && <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-10 text-center"><Timer className="w-16 h-16 text-yellow-400 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-2">Ready?</h3><p className="text-slate-400 text-sm mb-8">Type words, press space after each one.</p><button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-12 py-3 rounded-xl transition-all active:scale-95">Start!</button></div>}
      {phase === "playing" && (
        <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-2xl ${timeLeft <= 10 ? "bg-red-400/20 text-red-400 border border-red-400/30" : "bg-blue-400/10 text-blue-400 border border-blue-400/20"}`}>{timeLeft}</div>
            <div className="flex gap-6">
              <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase">Correct</p><p className="text-green-400 font-black text-xl">{correct}</p></div>
              <div className="text-center"><p className="text-xs font-bold text-slate-500 uppercase">Wrong</p><p className="text-red-400 font-black text-xl">{wrong}</p></div>
            </div>
          </div>
          <div className="bg-black/40 border border-blue-900/40 rounded-xl p-4 mb-5 font-mono text-sm leading-8 max-h-28 overflow-hidden">
            {words.slice(idx, idx + 25).map((w, i) => <span key={i} className={`mr-2 ${i === 0 ? "text-blue-400 underline underline-offset-4" : "text-slate-500"}`}>{w}</span>)}
          </div>
          <input ref={inputRef} value={input} onChange={handleInput} placeholder="Type here, space after each word..." className={INP + " font-mono"} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
        </div>
      )}
      {phase === "done" && (
        <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-10 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-6">Time's Up!</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4"><p className="text-xs font-bold text-slate-500 uppercase">WPM</p><p className="text-3xl font-black text-yellow-400">{correct}</p></div>
            <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4"><p className="text-xs font-bold text-slate-500 uppercase">Accuracy</p><p className="text-3xl font-black text-green-400">{acc}%</p></div>
            <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-4"><p className="text-xs font-bold text-slate-500 uppercase">Words</p><p className="text-3xl font-black text-blue-400">{correct}</p></div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={startGame} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all"><RefreshCw className="w-4 h-4" />Play Again</button>
            <button onClick={onBack} className="border border-blue-900/60 hover:border-blue-500/40 text-white font-bold px-6 py-3 rounded-xl transition-all">Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── SCRAMBLE GAME ────────────────────────────────────────────────────────────
function ScrambleGame({ onBack, setView }) {
  const [phase, setPhase]   = useState("ready");
  const [qIdx, setQIdx]     = useState(0);
  const [input, setInput]   = useState("");
  const [score, setScore]   = useState(0);
  const [startMs, setStartMs] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const [status, setStatus] = useState(null);
  const [shuffled, setShuffled] = useState([]);
  const timerRef = useRef(null);
  const inputRef = useRef(null);
  const startGame = () => {
    clearInterval(timerRef.current);
    const q = SCRAMBLE_WORDS.map(w => ({ ...w, sc: doScramble(w.word) }));
    setShuffled(q); setQIdx(0); setInput(""); setScore(0); setStatus(null);
    const t = Date.now(); setStartMs(t); setElapsed(0); setPhase("playing");
    timerRef.current = setInterval(() => setElapsed(Date.now() - t), 100);
    setTimeout(() => inputRef.current?.focus(), 50);
  };
  useEffect(() => () => clearInterval(timerRef.current), []);
  const handleSubmit = e => {
    e.preventDefault();
    const ok = input.trim().toLowerCase() === shuffled[qIdx]?.word;
    setStatus(ok ? "correct" : "wrong");
    if (ok) setScore(s => s + 1);
    setTimeout(() => {
      if (qIdx + 1 >= SCRAMBLE_WORDS.length) { clearInterval(timerRef.current); setPhase("done"); }
      else { setQIdx(i => i + 1); setInput(""); setStatus(null); inputRef.current?.focus(); }
    }, 700);
  };
  const secs = (elapsed / 1000).toFixed(1);
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={onBack} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><ArrowLeft className="w-4 h-4" /></button>
        <button onClick={() => setView("dashboard")} className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"><Home className="w-4 h-4" /></button>
        <h2 className="text-2xl font-bold text-white">Word Scramble</h2>
      </div>
      {phase === "ready" && <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-10 text-center"><Shuffle className="w-16 h-16 text-blue-400 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-2">Word Scramble</h3><p className="text-slate-400 text-sm mb-8">Unscramble 10 typing words!</p><button onClick={startGame} className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-12 py-3 rounded-xl transition-all active:scale-95">Start!</button></div>}
      {phase === "playing" && shuffled[qIdx] && (
        <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{qIdx + 1} / {SCRAMBLE_WORDS.length}</span>
            <span className="flex items-center gap-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full text-xs font-bold"><Timer className="w-3 h-3" />{secs}s</span>
          </div>
          <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden"><div className="h-full bg-blue-500 rounded-full" style={{ width: `${(qIdx / SCRAMBLE_WORDS.length) * 100}%` }} /></div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest text-center mb-4">Unscramble this word</p>
          <div className="flex justify-center gap-2 flex-wrap mb-3">
            {shuffled[qIdx].sc.split("").map((ch, i) => <div key={i} className="w-10 h-12 bg-blue-600/20 border-2 border-blue-500/40 rounded-lg flex items-center justify-center font-black text-xl text-blue-300">{ch.toUpperCase()}</div>)}
          </div>
          <p className="text-center text-slate-500 text-sm italic mb-8">Hint: {shuffled[qIdx].hint}</p>
          <form onSubmit={handleSubmit}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} placeholder="Type your answer..." disabled={!!status}
              className={`${INP} text-center font-mono text-lg ${status === "correct" ? "border-green-500 bg-green-500/10" : status === "wrong" ? "border-red-500 bg-red-500/10" : ""}`}
              autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck={false} />
            {!status && <button type="submit" className="w-full mt-3 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all active:scale-95">Submit</button>}
            {status === "correct" && <p className="text-center text-green-400 font-bold mt-3">✓ Correct!</p>}
            {status === "wrong"   && <p className="text-center text-red-400 font-bold mt-3">✗ It was: <span className="underline">{shuffled[qIdx].word}</span></p>}
          </form>
        </div>
      )}
      {phase === "done" && (
        <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-10 text-center">
          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" /><h3 className="text-2xl font-bold text-white mb-6">Game Over!</h3>
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4"><p className="text-xs font-bold text-slate-500 uppercase">Score</p><p className="text-3xl font-black text-green-400">{score}/{SCRAMBLE_WORDS.length}</p></div>
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4"><p className="text-xs font-bold text-slate-500 uppercase">Time</p><p className="text-3xl font-black text-yellow-400">{secs}s</p></div>
            <div className="bg-blue-400/10 border border-blue-400/20 rounded-xl p-4"><p className="text-xs font-bold text-slate-500 uppercase">Accuracy</p><p className="text-3xl font-black text-blue-400">{Math.round((score/SCRAMBLE_WORDS.length)*100)}%</p></div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={startGame} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3 rounded-xl transition-all"><RefreshCw className="w-4 h-4" />Play Again</button>
            <button onClick={onBack} className="border border-blue-900/60 hover:border-blue-500/40 text-white font-bold px-6 py-3 rounded-xl transition-all">Back</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── STATS PAGE ───────────────────────────────────────────────────────────────
function StatsPage({ user, setView }) {
  const bars = [
    { label: "WPM",        value: user?.wpm || 0,          max: 120, color: "bg-yellow-400" },
    { label: "Accuracy %", value: user?.accuracy || 0,     max: 100, color: "bg-green-400"  },
    { label: "Level × 10", value: (user?.level || 1) * 10, max: 100, color: "bg-blue-400"   },
    { label: "XP / 500",   value: (user?.xp || 0) % 500,  max: 500, color: "bg-purple-400" },
  ];
  const cards = [
    { label: "Top WPM",       value: user?.wpm || 0,          icon: Zap,    c: "text-yellow-400", bg: "bg-yellow-400/10", b: "border-yellow-400/20" },
    { label: "Best Accuracy", value: `${user?.accuracy||0}%`, icon: Target, c: "text-green-400",  bg: "bg-green-400/10",  b: "border-green-400/20"  },
    { label: "Total XP",      value: user?.xp || 0,           icon: Star,   c: "text-blue-400",   bg: "bg-blue-400/10",   b: "border-blue-400/20"   },
    { label: "Current Level", value: user?.level || 1,        icon: Trophy, c: "text-purple-400", bg: "bg-purple-400/10", b: "border-purple-400/20" },
    { label: "Day Streak",    value: `${user?.streak||0} days`,icon: Flame,  c: "text-orange-400", bg: "bg-orange-400/10", b: "border-orange-400/20" },
    { label: "Tries Left",    value: user?.isPremium ? "∞" : user?.triesLeft || 0, icon: Zap, c: "text-sky-400", bg: "bg-sky-400/10", b: "border-sky-400/20" },
  ];
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <button onClick={() => setView("dashboard")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors"><Home className="w-4 h-4" /> Dashboard</button>
      <h2 className="text-3xl font-black text-white mb-1">Your Stats</h2>
      <p className="text-slate-400 text-sm mb-8">Track your progress over time</p>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((s, i) => (
          <div key={i} className={`bg-[#0d1424] border ${s.b} rounded-2xl p-5 flex items-center gap-4`}>
            <div className={`${s.bg} border ${s.b} p-3 rounded-xl`}><s.icon className={`${s.c} w-6 h-6`} /></div>
            <div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.label}</p><p className="text-2xl font-black text-white mt-0.5">{s.value}</p></div>
          </div>
        ))}
      </div>
      <div className="bg-[#0d1424] border border-blue-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-6">Performance Overview</h3>
        <div className="space-y-5">
          {bars.map((b, i) => (
            <div key={i}>
              <div className="flex justify-between mb-2"><span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{b.label}</span><span className="text-sm font-black text-white">{b.value}</span></div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden"><div className={`h-full ${b.color} rounded-full transition-all duration-700`} style={{ width: `${Math.min((b.value / b.max) * 100, 100)}%` }} /></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── PRICING PAGE ─────────────────────────────────────────────────────────────
function PricingPage({ user, setView, handlePayment }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">
      <button onClick={() => setView("dashboard")} className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 text-sm transition-colors"><Home className="w-4 h-4" /> Dashboard</button>
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white mb-2">Upgrade to <span className="text-blue-400">Pro</span></h2>
        <p className="text-slate-400 text-sm">Unlock unlimited lessons, all mock tests, and all games.</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-10">
        {[
          { icon: BookOpen, label: "Unlimited Lessons", desc: "All current & future lessons" },
          { icon: FileText, label: "All Mock Tests",    desc: "SSC · RRB · CPCT · DSSSB · HC · IBPS" },
          { icon: BarChart2,label: "Advanced Stats",   desc: "Detailed progress analytics" },
        ].map((f, i) => (
          <div key={i} className="bg-[#0d1424] border border-blue-900/40 rounded-2xl p-5 text-center">
            <div className="w-10 h-10 bg-blue-600/20 border border-blue-500/20 rounded-xl flex items-center justify-center mx-auto mb-3"><f.icon className="w-5 h-5 text-blue-400" /></div>
            <p className="font-bold text-white text-sm mb-1">{f.label}</p>
            <p className="text-slate-500 text-xs">{f.desc}</p>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {PRICING_PLANS.map(plan => {
          const pop = plan.tag === "Most Popular";
          return (
            <div key={plan.id} className={`relative border rounded-2xl p-6 flex flex-col ${pop ? "bg-blue-600/10 border-blue-500/40" : "bg-[#0d1424] border-blue-900/40"}`}>
              {plan.tag && <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-black ${pop ? "bg-blue-500 text-white" : "bg-amber-500 text-black"}`}>{plan.tag}</span>}
              <p className="text-white font-black text-lg mb-1">{plan.name}</p>
              <div className="flex items-baseline gap-1 mb-5"><span className="text-3xl font-black text-white">₹{plan.price}</span><span className="text-slate-500 text-sm">/ {plan.period}</span></div>
              <div className="flex-1 space-y-2 mb-6">
                {["Unlimited lessons","All mock tests","All games","Priority support"].map(f => (
                  <div key={f} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" /><span className="text-sm text-slate-300">{f}</span></div>
                ))}
              </div>
              <button onClick={() => handlePayment(plan.price)}
                className={`w-full font-bold py-3 rounded-xl transition-all active:scale-95 ${pop ? "bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_20px_rgba(59,130,246,0.3)]" : "border border-blue-900/60 hover:border-blue-500/40 text-white"}`}>
                Get {plan.name}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]           = useState("auth");
  const [user, setUser]           = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [toast, setToast]         = useState({ msg: "", color: "" });

  const showToast = (msg, color = "#2563eb") => {
    setToast({ msg, color });
    setTimeout(() => setToast({ msg: "", color: "" }), 3000);
  };

  useEffect(() => {
    try {
      const s = localStorage.getItem("typomaster_user");
      if (s) { const p = JSON.parse(s); setUser(p); setView(p.username ? "dashboard" : "username"); }
    } catch {}
  }, []);
  useEffect(() => { if (user) localStorage.setItem("typomaster_user", JSON.stringify(user)); }, [user]);

  // ── AUTH HANDLERS (same as original) ──────────────────────────────────────
  const handleEmail = async (email, password, mode, setMode) => {
    try {
      const fb = await import("./firebase").catch(() => null);
      if (fb?.auth) {
        const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification } = fb;
        if (mode === "signup") {
          const cred = await createUserWithEmailAndPassword(fb.auth, email, password);
          await sendEmailVerification(cred.user);
          showToast("Verification email sent! Check your inbox.", "#16a34a");
          setMode("login");
        } else {
          const cred = await signInWithEmailAndPassword(fb.auth, email, password);
          if (!cred.user.emailVerified) { showToast("Please verify your email first!", "#dc2626"); return; }
          const u = { id: cred.user.uid, email: cred.user.email, provider: "email", xp: 0, level: 1, wpm: 0, accuracy: 0, streak: 0, triesLeft: 3, isPremium: false, unlockedLessons: 1 };
          try { await fetch("https://typomaster-backend.onrender.com/api/auth/save", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ uid: u.id, email: u.email }) }); } catch {}
          setUser(u); setView("username");
        }
      } else {
        if (mode === "signup") { showToast("Account created! Please login.", "#16a34a"); setMode("login"); }
        else { const u = { id: "demo_"+Date.now(), email, provider:"email", xp:0, level:1, wpm:0, accuracy:0, streak:0, triesLeft:3, isPremium:false, unlockedLessons:1 }; setUser(u); setView("username"); }
      }
    } catch (err) {
      const msg = err.code === "auth/email-already-in-use" ? "Email already in use" : err.code === "auth/wrong-password" ? "Wrong password" : err.message || "Something went wrong";
      showToast(msg, "#dc2626");
    }
  };

  const handleGoogle = async () => {
    try {
      const fb = await import("./firebase").catch(() => null);
      if (fb?.auth && fb?.GoogleAuthProvider && fb?.signInWithPopup) {
        const cred = await fb.signInWithPopup(fb.auth, new fb.GoogleAuthProvider());
        const u = { id: cred.user.uid, email: cred.user.email, provider:"google", xp:0, level:1, wpm:0, accuracy:0, streak:0, triesLeft:3, isPremium:false, unlockedLessons:1 };
        setUser(u); setView("username");
      } else {
        const u = { id:"g_"+Date.now(), email:"googleuser@gmail.com", provider:"google", xp:0, level:1, wpm:0, accuracy:0, streak:0, triesLeft:3, isPremium:false, unlockedLessons:1 };
        setUser(u); setView("username");
      }
    } catch (err) { showToast(err.message || "Google sign-in failed", "#dc2626"); }
  };

  const handleFacebook = async () => {
    try {
      const fb = await import("./firebase").catch(() => null);
      if (fb?.auth && fb?.FacebookAuthProvider && fb?.signInWithPopup) {
        const cred = await fb.signInWithPopup(fb.auth, new fb.FacebookAuthProvider());
        const u = { id: cred.user.uid, email: cred.user.email, provider:"facebook", xp:0, level:1, wpm:0, accuracy:0, streak:0, triesLeft:3, isPremium:false, unlockedLessons:1 };
        setUser(u); setView("username");
      } else {
        const u = { id:"fb_"+Date.now(), email:"fbuser@facebook.com", provider:"facebook", xp:0, level:1, wpm:0, accuracy:0, streak:0, triesLeft:3, isPremium:false, unlockedLessons:1 };
        setUser(u); setView("username");
      }
    } catch (err) { showToast(err.message || "Facebook sign-in failed", "#dc2626"); }
  };

  const handleSetUsername = async (username) => {
    if (!user || !username) return;
    try { await fetch("https://typomaster-backend.onrender.com/api/auth/update", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ uid: user.id, username }) }); } catch {}
    setUser({ ...user, username });
    setView("dashboard");
  };

  const startLesson = lesson => {
    if (!user) return;
    if (user.triesLeft <= 0 && !user.isPremium) { setView("pricing"); return; }
    setCurrentLesson(lesson);
    setView("lesson");
  };

  const completeLesson = ({ wpm, accuracy, xp, lessonId }) => {
    if (!user) return;
    const isNew = lessonId === user.unlockedLessons;
    setUser({ ...user, xp: user.xp + xp, level: Math.floor((user.xp + xp) / 500) + 1, triesLeft: user.isPremium ? user.triesLeft : Math.max(0, user.triesLeft - 1), unlockedLessons: isNew ? user.unlockedLessons + 1 : user.unlockedLessons, wpm: Math.max(user.wpm, wpm), accuracy: Math.max(user.accuracy, accuracy) });
    showToast(`+${xp} XP earned! 🎉`, "#16a34a");
    setView("dashboard");
    setCurrentLesson(null);
  };

  const handlePayment = price => {
    if (window.Razorpay) {
      new window.Razorpay({
        key: import.meta.env.RAZORPAY_KEY_ID,
        amount: price * 100, currency: "INR", name: "TypoMaster Pro", description: "Premium Upgrade",
        handler: () => { showToast("Payment Successful! You're now Pro ✅", "#16a34a"); setUser(p => ({ ...p, isPremium: true })); setView("dashboard"); },
        prefill: { email: user?.email || "" }, theme: { color: "#2563eb" },
      }).open();
    } else { showToast("Payment gateway not loaded. Add Razorpay script.", "#dc2626"); }
  };

  const logout = () => { localStorage.removeItem("typomaster_user"); setUser(null); setView("auth"); };

  // ── ROUTING ────────────────────────────────────────────────────────────────
  const viewType = typeof view === "object" ? view.type : view;
  const isAuthed = !["auth","username"].includes(viewType);

  return (
    <div className="min-h-screen bg-[#060b16] font-sans">
      <Toast msg={toast.msg} color={toast.color} />
      {isAuthed && <NavBar user={user} view={view} setView={setView} onLogout={logout} />}

      {viewType === "auth"     && <AuthPage onGoogle={handleGoogle} onFacebook={handleFacebook} onEmail={handleEmail} />}
      {viewType === "username" && <UsernamePage onSetUsername={handleSetUsername} onBack={() => setView("auth")} />}
      {viewType === "dashboard"&& <Dashboard user={user} setView={setView} onStartLesson={startLesson} />}
      {viewType === "lesson"   && currentLesson && <LessonPage lesson={currentLesson} onComplete={completeLesson} onBack={() => { setView("dashboard"); setCurrentLesson(null); }} />}
      {viewType === "stats"    && <StatsPage user={user} setView={setView} />}
      {viewType === "games"    && <GamesPage setView={setView} />}
      {viewType === "pricing"  && <PricingPage user={user} setView={setView} handlePayment={handlePayment} />}
      {viewType === "mocktest" && <MockTestListPage setView={setView} />}
      {viewType === "mocktest-exam" && typeof view === "object" && <MockTestExamPage exam={view.exam} setView={setView} />}
    </div>
  );
}
