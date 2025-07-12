// Spot the Fake CV Game Logic
// Import CSS styles
import './styles/main.css';
import './styles/game.css';

// Import API client for future backend integration
import { api, apiUtils } from './utils/api.js';

console.log('🎮 Spot the Fake CV Game Initializing...');

// Game State Management
const gameState = {
    isPlaying: false,
    isPaused: false,
    currentQuestion: 0,
    totalQuestions: 20,
    score: 0,
    streak: 0,
    temperature: 1.0, // Starting temperature for fake CV generation
    startTime: null,
    questionStartTime: null,
    correctAnswers: 0,
    wrongAnswers: 0,
    currentOptions: [],
    correctOption: null,
    timeElapsed: 0
};

// Work-related loading verbs for dynamic loading messages
const loadingVerbs = [
    'thinking', 'procrastinating', 'brainstorming', 'strategizing', 'ideating',
    'innovating', 'optimizing', 'analyzing', 'researching', 'investigating',
    'collaborating', 'networking', 'negotiating', 'presenting', 'pitching',
    'coding', 'debugging', 'architecting', 'designing', 'prototyping',
    'testing', 'validating', 'iterating', 'deploying', 'scaling',
    'recruiting', 'interviewing', 'onboarding', 'mentoring', 'coaching',
    'managing', 'leading', 'delegating', 'prioritizing', 'organizing',
    'planning', 'scheduling', 'budgeting', 'forecasting', 'reporting',
    'tracking', 'measuring', 'auditing', 'reviewing', 'approving',
    'documenting', 'writing', 'editing', 'proofreading', 'publishing',
    'marketing', 'promoting', 'campaigning', 'advertising', 'branding',
    'selling', 'consulting', 'advising', 'training', 'educating',
    'facilitating', 'moderating', 'mediating', 'resolving', 'troubleshooting',
    'upgrading', 'migrating', 'integrating', 'synchronizing', 'backing up',
    'securing', 'encrypting', 'monitoring', 'alerting', 'patching',
    'faking a CV', 'embellishing achievements', 'exaggerating metrics', 'inflating numbers', 'overselling skills'
];

// DOM Elements
const elements = {
    // Instructions
    gameInstructions: document.getElementById('game-instructions'),
    startGameBtn: document.getElementById('start-game-btn'),
    
    // Game Interface
    gameInterface: document.getElementById('game-interface'),
    cvOptionsGrid: document.getElementById('cv-options-grid'),
    cvOption1: document.getElementById('cv-option-1'),
    cvOption2: document.getElementById('cv-option-2'),
    cvOption3: document.getElementById('cv-option-3'),
    cvOption4: document.getElementById('cv-option-4'),
    cvBullet1: document.getElementById('cv-bullet-1'),
    cvBullet2: document.getElementById('cv-bullet-2'),
    cvBullet3: document.getElementById('cv-bullet-3'),
    cvBullet4: document.getElementById('cv-bullet-4'),
    
    // Feedback
    feedbackOverlay: document.getElementById('feedback-overlay'),
    feedbackIcon: document.getElementById('feedback-icon'),
    
    // Progress
    progressFill: document.getElementById('progress-fill'),
    currentQuestionSpan: document.getElementById('current-question'),
    totalQuestionsSpan: document.getElementById('total-questions'),
    
    // Stats
    scoreDisplay: document.getElementById('score'),
    timerDisplay: document.getElementById('timer'),
    streakDisplay: document.getElementById('streak'),
    levelDisplay: document.getElementById('level'),
    
    // Results
    gameResults: document.getElementById('game-results'),
    finalScore: document.getElementById('final-score'),
    finalTime: document.getElementById('final-time'),
    finalAccuracy: document.getElementById('final-accuracy'),
    playAgainBtn: document.getElementById('play-again-btn'),
    shareBtn: document.getElementById('share-btn'),
    
    // Loading
    loadingOverlay: document.getElementById('loading-overlay'),
    
    // Shortcuts
    keyboardShortcuts: document.getElementById('keyboard-shortcuts'),
    shortcutsTrigger: document.getElementById('shortcuts-trigger'),
    shortcutsClose: document.getElementById('shortcuts-close'),
    shortcutNotification: document.getElementById('shortcut-notification')
};

// CV Bullets Database - Expanded to 100+ bullets per category
const cvBullets = {
    // High-quality professional bullets (low temperature - 0.0-0.3) - 110 bullets
    professional: [
        "Increased sales revenue by 35% through implementation of data-driven lead scoring system",
        "Led cross-functional team of 8 engineers to deliver mobile app 2 weeks ahead of schedule",
        "Reduced customer acquisition cost by 28% via optimization of digital marketing campaigns",
        "Implemented automated testing framework that decreased bug reports by 45%",
        "Negotiated vendor contracts resulting in $2.3M annual cost savings for procurement department",
        "Developed machine learning model that improved fraud detection accuracy to 94.2%",
        "Managed $15M portfolio with 12% average annual return over 3-year period",
        "Streamlined onboarding process reducing new hire training time from 6 weeks to 3 weeks",
        "Architected microservices infrastructure supporting 10x traffic growth with 99.9% uptime",
        "Launched product feature that increased user engagement by 23% within first quarter",
        "Optimized database queries reducing average page load time from 3.2s to 0.8s",
        "Coordinated international expansion into 5 new markets generating $8M additional revenue",
        "Built analytics dashboard providing real-time insights to 200+ stakeholders across organization",
        "Conducted user research with 500+ participants informing product roadmap for next 2 years",
        "Established quality assurance processes reducing production defects by 67%",
        "Designed A/B testing framework that improved conversion rates by 18% across all product lines",
        "Reduced server costs by 42% through strategic cloud infrastructure optimization and rightsizing",
        "Created automated deployment pipeline reducing release time from 4 hours to 12 minutes",
        "Increased customer retention rate from 68% to 89% through personalized engagement campaigns",
        "Secured $5.2M in Series A funding by developing comprehensive business plan and pitch deck",
        "Implemented GDPR compliance program protecting 2.3M user records across EU markets",
        "Optimized inventory management system reducing waste by 31% and improving margins by 15%",
        "Led migration of legacy system to modern architecture serving 500K+ daily active users",
        "Developed partnership strategy that generated $12M in new revenue through strategic alliances",
        "Created content marketing strategy increasing organic traffic by 156% over 8-month period",
        "Established remote work policies that improved employee satisfaction by 34% during pandemic",
        "Implemented cybersecurity framework reducing security incidents by 78% year-over-year",
        "Designed customer feedback loop that improved Net Promoter Score from 6.2 to 8.7",
        "Optimized supply chain logistics reducing delivery times by 40% and costs by 22%",
        "Built recommendation engine that increased average order value by 29% for e-commerce platform",
        "Launched mobile app that achieved 100K downloads within first month of release",
        "Reduced customer support ticket volume by 45% through improved self-service documentation",
        "Implemented agile methodology increasing team velocity by 38% and reducing bugs by 52%",
        "Created data warehouse solution consolidating 12 different data sources for unified reporting",
        "Designed user onboarding flow that improved activation rates from 34% to 67%",
        "Established vendor management program saving $800K annually through consolidated purchasing",
        "Built fraud detection system that prevented $2.1M in potential losses over 18-month period",
        "Created social media strategy that grew follower base by 245% and engagement by 89%",
        "Implemented performance monitoring tools reducing system downtime by 63%",
        "Developed training program that improved employee productivity scores by 41%",
        "Optimized email marketing campaigns achieving 24% open rates and 6.8% click-through rates",
        "Created API documentation that reduced integration time for partners by 60%",
        "Established backup and disaster recovery procedures ensuring 99.9% data availability",
        "Implemented customer segmentation strategy that improved targeting accuracy by 55%",
        "Built real-time monitoring dashboard for operations team tracking 50+ key metrics",
        "Created pricing strategy that increased profit margins by 18% while maintaining market share",
        "Developed mobile-first responsive design improving user experience across all devices",
        "Established code review process that reduced production bugs by 71% and improved code quality",
        "Implemented customer loyalty program that increased repeat purchases by 43%",
        "Created automated reporting system saving 20 hours per week of manual data compilation",
        "Optimized checkout process reducing cart abandonment rate from 68% to 34%",
        "Built scalable event processing system handling 1M+ events per day with <100ms latency",
        "Established employee mentorship program improving retention rates by 28%",
        "Created comprehensive testing strategy covering unit, integration, and end-to-end testing",
        "Implemented search engine optimization increasing organic rankings for 200+ keywords",
        "Developed customer success program reducing churn rate by 36% in first year",
        "Built automated invoice processing system reducing manual work by 85%",
        "Created multi-language support expanding market reach to 8 additional countries",
        "Established version control workflow improving code collaboration across 25-person team",
        "Implemented customer feedback system collecting and analyzing 10K+ monthly responses",
        "Optimized ad spend allocation increasing return on advertising spend by 67%",
        "Created documentation portal reducing customer support calls by 29%",
        "Built ETL pipeline processing 500GB of data daily with 99.5% accuracy",
        "Established project management framework delivering 95% of projects on time and budget",
        "Implemented single sign-on system improving security and user experience",
        "Created performance dashboard tracking team KPIs and individual goal progress",
        "Optimized database indexing strategy improving query performance by 78%",
        "Built customer referral program generating 1,200 new customers in 6-month period",
        "Established change management process reducing deployment failures by 81%",
        "Created automated testing suite covering 92% of codebase with comprehensive test scenarios",
        "Implemented progressive web app features improving mobile engagement by 44%",
        "Developed competitive analysis framework informing product strategy and market positioning",
        "Built real-time chat support system reducing average response time from 4 hours to 8 minutes",
        "Created data privacy framework ensuring compliance with international data protection regulations",
        "Established cross-training program improving team flexibility and knowledge sharing",
        "Implemented container orchestration reducing infrastructure costs by 35%",
        "Created customer journey mapping improving conversion rates at each funnel stage",
        "Built automated backup system ensuring zero data loss across all critical systems",
        "Established accessibility standards making platform compliant with WCAG 2.1 guidelines",
        "Implemented feature flagging system enabling safe deployment of new functionality",
        "Created partnership program generating $3.4M in additional revenue through channel partners",
        "Built notification system with 99.7% delivery rate and personalized message targeting",
        "Established security audit process identifying and resolving 156 potential vulnerabilities",
        "Implemented load balancing solution supporting 10x traffic spikes during peak usage",
        "Created employee recognition program improving team morale and reducing turnover by 31%",
        "Built payment processing integration supporting 15 different payment methods globally",
        "Established quality metrics tracking improving product reliability and user satisfaction",
        "Implemented automated deployment rollback system reducing incident resolution time by 74%",
        "Created customer education platform with 500+ tutorial videos and interactive guides",
        "Built recommendation algorithm increasing cross-sell revenue by 52% for existing customers",
        "Established incident response procedures reducing mean time to resolution by 68%",
        "Implemented caching strategy reducing page load times by 61% across all user interfaces",
        "Created retention analysis framework identifying factors influencing customer lifetime value",
        "Built automated compliance reporting system ensuring adherence to industry regulations",
        "Established design system standardizing user interface components across all products",
        "Implemented database sharding strategy supporting horizontal scaling for growing user base",
        "Created customer success metrics dashboard tracking health scores and expansion opportunities",
        "Built integration platform connecting 25+ third-party services with unified API",
        "Established performance testing framework ensuring system reliability under peak loads",
        "Implemented dynamic pricing algorithm optimizing revenue based on demand and market conditions",
        "Created onboarding automation reducing time-to-value for new customers by 58%",
        "Built anomaly detection system identifying unusual patterns in user behavior and system performance",
        "Established knowledge management system improving information accessibility and team collaboration",
        "Implemented multi-tenant architecture supporting enterprise customers with custom configurations",
        "Created advanced analytics platform providing actionable insights from complex data sets",
        "Built automated customer segmentation system enabling personalized marketing campaigns",
        "Established disaster recovery plan ensuring business continuity with 4-hour recovery time objective",
        "Implemented OAuth authentication system improving security while simplifying user access",
        "Created predictive maintenance program reducing equipment downtime by 47%",
        "Built serverless architecture reducing operational overhead and improving scalability",
        "Established code quality standards and automated enforcement tools maintaining high development standards",
        "Implemented customer health scoring system enabling proactive intervention for at-risk accounts",
        "Created comprehensive API testing suite ensuring reliability and performance of all endpoints",
        "Built automated lead scoring system improving sales team efficiency and conversion rates",
        "Established continuous integration pipeline reducing time from code commit to production deployment",
        "Implemented geographic load distribution ensuring optimal performance for global user base"
    ],
    
    // Slightly inflated but plausible (medium temperature - 0.4-0.7) - 100 bullets
    inflated: [
        "Revolutionized the entire sales process leading to unprecedented growth in company history",
        "Single-handedly transformed team productivity through innovative leadership methodologies",
        "Pioneered groundbreaking techniques that became industry standard across multiple organizations",
        "Orchestrated massive digital transformation initiative that modernized legacy systems company-wide",
        "Spearheaded revolutionary customer experience overhaul resulting in industry-leading satisfaction scores",
        "Architected next-generation platform that disrupted traditional approaches to business intelligence",
        "Masterminded comprehensive strategy that positioned company as market leader in emerging technology",
        "Engineered cutting-edge solution that eliminated operational inefficiencies across all departments",
        "Championed innovative approach to talent acquisition that redefined industry hiring standards",
        "Developed proprietary algorithm that outperformed existing market solutions by significant margins",
        "Conceptualized paradigm-shifting framework that transformed organizational culture permanently",
        "Established revolutionary workflow that became the gold standard for Fortune 500 companies",
        "Innovated breakthrough methodology that disrupted traditional business models globally",
        "Engineered unprecedented automation that eliminated human error entirely from critical processes",
        "Pioneered futuristic approach that positioned organization decades ahead of industry competitors",
        "Masterminded transformational initiative that redefined success metrics across entire sector",
        "Architected visionary platform that revolutionized how businesses approach customer engagement",
        "Orchestrated game-changing strategy that established new benchmarks for operational excellence",
        "Spearheaded industry-disrupting innovation that rendered competitor solutions completely obsolete",
        "Developed cutting-edge framework that became mandatory curriculum at top business schools",
        "Pioneered revolutionary analytics that predicted market trends with unprecedented accuracy",
        "Engineered breakthrough solution that solved previously impossible technical challenges",
        "Masterminded unprecedented integration that unified disparate systems seamlessly",
        "Conceptualized paradigm-defining approach that influenced industry best practices permanently",
        "Established transformational culture that became case study for organizational psychology",
        "Innovated disruptive technology that fundamentally changed how industries operate",
        "Architected revolutionary infrastructure that enabled infinite scalability without performance degradation",
        "Orchestrated visionary transformation that elevated company from startup to industry titan",
        "Spearheaded groundbreaking research that advanced field of artificial intelligence significantly",
        "Developed industry-defining standards that became mandatory compliance requirements globally",
        "Pioneered next-generation methodology that eliminated traditional bottlenecks permanently",
        "Engineered breakthrough platform that achieved perfect user satisfaction scores consistently",
        "Masterminded comprehensive overhaul that optimized every aspect of business operations",
        "Conceptualized revolutionary approach that redefined customer success across all industries",
        "Established unprecedented framework that guaranteed project success rates of 100%",
        "Innovated transformational technology that provided unlimited competitive advantages",
        "Architected futuristic solution that anticipated market needs years before competitors",
        "Orchestrated paradigm-shifting initiative that created entirely new market categories",
        "Spearheaded visionary program that achieved impossible performance metrics consistently",
        "Developed cutting-edge algorithm that revolutionized decision-making processes permanently",
        "Pioneered breakthrough methodology that eliminated all forms of operational waste",
        "Engineered unprecedented system that achieved perfect uptime across all services",
        "Masterminded revolutionary strategy that guaranteed market dominance in perpetuity",
        "Conceptualized industry-defining approach that became standard practice worldwide",
        "Established transformational framework that optimized human potential beyond known limits",
        "Innovated disruptive platform that rendered traditional business models completely irrelevant",
        "Architected visionary infrastructure that supported unlimited growth without constraints",
        "Orchestrated groundbreaking transformation that achieved mythical levels of efficiency",
        "Spearheaded revolutionary innovation that solved century-old industry challenges permanently",
        "Developed paradigm-shifting technology that provided supernatural competitive intelligence",
        "Pioneered next-generation framework that guaranteed customer loyalty for lifetime",
        "Engineered breakthrough solution that eliminated all possible points of failure",
        "Masterminded unprecedented methodology that optimized every conceivable business metric",
        "Conceptualized transformational approach that created unlimited revenue opportunities",
        "Established revolutionary culture that attracted top talent from every major competitor",
        "Innovated cutting-edge platform that provided real-time omniscient market awareness",
        "Architected futuristic system that anticipated customer needs before customers themselves",
        "Orchestrated visionary initiative that achieved legendary status within industry",
        "Spearheaded groundbreaking research that advanced human understanding of productivity science",
        "Developed industry-defining standards that became constitutional law in business practice",
        "Pioneered breakthrough technology that provided telepathic customer communication capabilities",
        "Engineered unprecedented infrastructure that achieved zen-like harmony between all systems",
        "Masterminded revolutionary framework that guaranteed immortal business success",
        "Conceptualized paradigm-shifting approach that transcended traditional business limitations",
        "Established transformational methodology that created perpetual motion in revenue generation",
        "Innovated disruptive solution that provided cosmic-level business intelligence",
        "Architected visionary platform that achieved enlightened customer engagement",
        "Orchestrated groundbreaking strategy that established eternal market leadership",
        "Spearheaded revolutionary transformation that achieved nirvana-level operational efficiency",
        "Developed cutting-edge algorithm that provided divine insight into market dynamics",
        "Pioneered next-generation framework that guaranteed ascension to industry godhood",
        "Engineered breakthrough methodology that achieved spiritual connection with customer base",
        "Masterminded unprecedented approach that transcended mortal business constraints",
        "Conceptualized transformational technology that provided omnipotent competitive advantages",
        "Established revolutionary culture that achieved enlightenment in organizational behavior",
        "Innovated paradigm-defining platform that channeled universal business wisdom",
        "Architected futuristic infrastructure that achieved symbiosis with market forces",
        "Orchestrated visionary initiative that established karmic balance in business ecosystem",
        "Spearheaded groundbreaking transformation that achieved business immortality",
        "Developed industry-defining solution that provided cosmic understanding of customer needs",
        "Pioneered breakthrough framework that guaranteed reincarnation as market leader",
        "Engineered unprecedented methodology that achieved business enlightenment permanently",
        "Masterminded revolutionary approach that transcended earthly business limitations",
        "Conceptualized transformational strategy that provided astral projection into future markets",
        "Established cutting-edge culture that achieved telepathic communication with customers",
        "Innovated disruptive technology that provided divine intervention in business operations",
        "Architected visionary platform that achieved nirvana-level customer satisfaction",
        "Orchestrated paradigm-shifting initiative that established eternal competitive moat",
        "Spearheaded revolutionary innovation that achieved business transcendence permanently",
        "Developed groundbreaking algorithm that provided omniscient market prediction capabilities",
        "Pioneered next-generation methodology that guaranteed spiritual awakening in business success",
        "Engineered breakthrough framework that achieved cosmic alignment with industry forces",
        "Masterminded unprecedented solution that provided supernatural business intuition",
        "Conceptualized transformational approach that achieved enlightened customer relationships",
        "Established revolutionary infrastructure that channeled universal abundance principles",
        "Innovated cutting-edge platform that provided divine guidance in strategic decisions",
        "Architected futuristic system that achieved perfect harmony with market consciousness",
        "Orchestrated visionary transformation that established karmic leadership in industry",
        "Spearheaded groundbreaking methodology that achieved business immortality through innovation",
        "Developed industry-defining technology that provided cosmic intelligence in operations",
        "Pioneered breakthrough culture that guaranteed spiritual evolution in organizational growth",
        "Engineered unprecedented framework that achieved divine optimization of all processes",
        "Masterminded revolutionary strategy that transcended traditional success measurements permanently"
    ],
    
    // Absurd/clearly fake (high temperature - 0.8-1.0) - 100 bullets
    absurd: [
        "Invented time travel to optimize project delivery timelines and consistently meet impossible deadlines",
        "Personally trained artificial intelligence systems to replicate my unique problem-solving capabilities",
        "Achieved telepathic communication with stakeholders enabling instant decision-making across global teams",
        "Discovered secret to perpetual motion and applied it to create infinite energy solutions",
        "Negotiated peace treaties between competing software languages ending the great Programming Wars",
        "Developed quantum computing algorithms using only basic calculator and determination",
        "Established diplomatic relations with alien civilizations to expand market reach beyond Earth",
        "Won Nobel Prize in Economics for revolutionary theory about productivity through coffee consumption",
        "Learned all programming languages in single weekend including ones that haven't been invented yet",
        "Convinced gravity to work differently in office space resulting in 300% efficiency improvements",
        "Mentored Elon Musk, Steve Jobs, and Bill Gates simultaneously via interdimensional video conferences",
        "Solved world hunger during lunch break between important meetings about quarterly projections",
        "Created parallel universe where all deadlines are automatically extended and budgets are unlimited",
        "Taught advanced machine learning to actual machines who now write better code than humans",
        "Discovered that productivity increases exponentially when working exactly 25 hours per day",
        "Invented teleportation device for instant commute to office reducing travel time to zero seconds",
        "Communicated with future versions of myself to predict market trends with 100% accuracy",
        "Developed mind-reading technology for understanding customer needs before they express them",
        "Created artificial wormholes to connect different office locations across space and time",
        "Established trade agreements with beings from alternate dimensions for exotic resources",
        "Won Olympic gold medal in competitive spreadsheet creation while working full-time",
        "Trained dolphins to perform quality assurance testing for underwater user interfaces",
        "Convinced the sun to work overtime providing 26-hour days for extended productivity",
        "Developed friendship with superintelligent AI that handles all my mundane tasks",
        "Created universal translator enabling communication with coffee machines for optimal brewing",
        "Established consulting firm for ghosts helping deceased entrepreneurs with unfinished business",
        "Won argument with physics itself resulting in personal exemption from laws of thermodynamics",
        "Developed ability to clone myself for attending multiple meetings simultaneously",
        "Created time loop ensuring every project deadline is met in perpetual Groundhog Day scenario",
        "Convinced Google's algorithm to personally endorse my LinkedIn profile for better visibility",
        "Established partnership with Santa Claus for global logistics and nice-list optimization",
        "Developed X-ray vision for seeing through corporate bureaucracy and identifying real decision makers",
        "Created portal gun for instant access to any conference room regardless of physical location",
        "Won chess match against Deep Blue while simultaneously closing million-dollar deal",
        "Established embassy on Mars for expanding company's interplanetary business operations",
        "Developed ability to pause time during important presentations for unlimited preparation",
        "Created friendship with Zeus enabling weather manipulation for optimal office working conditions",
        "Won Nobel Prize in Literature for most creative expense reports in corporate history",
        "Developed photographic memory upgrade allowing perfect recall of every email ever written",
        "Established trade route with Atlantis for accessing underwater market opportunities",
        "Created personal force field protecting against interruptions during deep work sessions",
        "Won Iron Man competition using self-designed powered exoskeleton built from office supplies",
        "Developed ability to speak fluent binary enabling direct communication with servers",
        "Created partnership with Marvel Comics to develop superhero-themed productivity methodologies",
        "Won Academy Award for most dramatic quarterly earnings presentation in entertainment history",
        "Established consulting practice for vampires transitioning to remote work during daylight hours",
        "Developed ability to levitate during brainstorming sessions for enhanced creative perspective",
        "Created friendship with Murphy of Murphy's Law fame ensuring nothing goes wrong",
        "Won Grammy Award for most melodious conference call hold music composition",
        "Developed partnership with NASA for zero-gravity team building retreats in space",
        "Created personal weather control system ensuring perfect conditions for outdoor client meetings",
        "Won Pulitzer Prize for investigative journalism into mysteries of printer paper jams",
        "Established diplomatic immunity allowing unlimited coffee breaks without productivity loss",
        "Developed ability to photosynthesize eliminating need for lunch breaks and maximizing work time",
        "Created friendship with Sherlock Holmes for solving complex business mysteries",
        "Won Tony Award for most theatrical sales presentations on Broadway stage",
        "Established trade agreements with unicorns for accessing magic-powered productivity tools",
        "Developed ability to see future stock prices through crystal ball investment strategies",
        "Created partnership with Disney for implementing fairy tale endings in customer service",
        "Won Fields Medal in mathematics for solving equation that calculates perfect work-life balance",
        "Established consulting firm for dragons helping with treasure management and tax optimization",
        "Developed ability to breathe underwater enabling unlimited submarine conference calls",
        "Created friendship with Einstein's ghost for assistance with complex time management calculations",
        "Won Eurovision Song Contest representing company anthem in international business competition",
        "Established embassy in Narnia for exploring fantasy market segments and magical customer base",
        "Developed ability to speak with plants ensuring optimal office foliage for improved air quality",
        "Created partnership with Big Foot for market research in remote wilderness demographics",
        "Won Olympic gold medal in synchronized swimming while delivering investor presentations",
        "Established trade route with Middle Earth for accessing hobbit-sized productivity solutions",
        "Developed ability to transform into different animals for diverse perspective in market research",
        "Created friendship with the Tooth Fairy for innovative approaches to customer retention",
        "Won James Beard Award for most appetizing quarterly financial reports in culinary presentation",
        "Established consulting practice for mermaids transitioning to land-based business operations",
        "Developed ability to control magnetism for organizing all office paperclips automatically",
        "Created partnership with Greek gods for divine intervention in challenging negotiations",
        "Won Nobel Peace Prize for mediating conflicts between competing printer brands",
        "Established diplomatic relations with the Lost City of Atlantis for underwater expansion",
        "Developed ability to speak ancient languages for better communication with legacy systems",
        "Created friendship with Benjamin Franklin for insights on both electricity and productivity",
        "Won Darwin Award for most creative evolution of traditional business processes",
        "Established trade agreements with inhabitants of Bermuda Triangle for mysterious market insights",
        "Developed ability to survive solely on caffeine and determination eliminating meal times",
        "Created partnership with Robin Hood for redistributing inefficient business processes",
        "Won Turing Award for teaching computers how to laugh at appropriate times during meetings",
        "Established embassy on the Moon for gravitationally enhanced brainstorming sessions",
        "Developed ability to communicate with past versions of company founders for historical guidance",
        "Created friendship with Alice from Wonderland for nonsensical solutions to logical problems",
        "Won Michelin Star for presentation of most delicious quarterly performance metrics",
        "Established consulting firm for genies helping with wish fulfillment in corporate culture",
        "Developed ability to see through walls for better understanding of office politics",
        "Created partnership with Peter Pan for maintaining youthful enthusiasm despite corporate stress",
        "Won Nobel Prize in Chemistry for discovering formula that converts coffee directly into productivity",
        "Established trade route with Hogwarts for magical solutions to mundane business problems",
        "Developed ability to duplicate myself for attending infinite number of simultaneous meetings",
        "Created friendship with Count Dracula for insights on working productive night shifts",
        "Won Olympic gold medal in extreme ironing while conducting performance reviews",
        "Established diplomatic immunity from Murphy's Law ensuring everything always goes perfectly",
        "Developed ability to speak fluent emoji for enhanced communication with Generation Z customers",
        "Created partnership with Captain Nemo for submarine-based market research expeditions",
        "Won Nobel Prize in Physiology for discovering organ that processes unlimited workload capacity",
        "Established consulting practice for phoenixes helping with corporate resurrection strategies",
        "Developed ability to photosynthesize office lighting into pure energy eliminating fatigue",
        "Created friendship with Hercules for assistance with impossible project deadlines",
        "Won Academy Award for best documentary about the secret life of office printers",
        "Established trade agreements with residents of fourth dimension for temporal business solutions",
        "Developed ability to control weather ensuring perfect conditions for all outdoor events",
        "Created partnership with Sherlock Holmes for solving mysteries of missing office supplies",
        "Won Fields Medal for mathematical proof that work-life balance is achievable with wormhole technology"
    ]
};

// CV Generation System (Mock temperature-based generation with deduplication)
class CVGenerator {
    constructor() {
        this.apiKey = null; // Will be set when implementing real AI
        this.isEnabled = false; // Toggle for AI vs static bullets
        this.usedBullets = new Set(); // Track used bullets in current game
    }
    
    // Reset used bullets for new game
    resetUsedBullets() {
        this.usedBullets.clear();
    }
    
    async generateCVOptions(temperature = 1.0) {
        // Generate 3 professional bullets and 1 fake bullet based on temperature
        const options = [];
        
        // Add 3 professional bullets (ensuring no duplicates)
        for (let i = 0; i < 3; i++) {
            const bullet = this.getUniqueRandomBullet('professional');
            options.push({
                text: bullet,
                isFake: false,
                temperature: 0.0
            });
        }
        
        // Add 1 fake bullet based on current temperature (ensuring no duplicates)
        const fakeType = this.getBulletTypeByTemperature(temperature);
        const fakeBullet = this.getUniqueRandomBullet(fakeType);
        options.push({
            text: fakeBullet,
            isFake: true,
            temperature: temperature
        });
        
        // Shuffle the options so fake isn't always in same position
        return this.shuffleArray(options);
    }
    
    getBulletTypeByTemperature(temperature) {
        if (temperature >= 0.8) return 'absurd';
        if (temperature >= 0.4) return 'inflated';
        return 'professional'; // This shouldn't happen for fake bullets
    }
    
    getRandomBullet(type) {
        const bullets = cvBullets[type] || cvBullets.professional;
        const randomIndex = Math.floor(Math.random() * bullets.length);
        return bullets[randomIndex];
    }
    
    getUniqueRandomBullet(type) {
        const bullets = cvBullets[type] || cvBullets.professional;
        const availableBullets = bullets.filter(bullet => !this.usedBullets.has(bullet));
        
        // If we've used all bullets of this type, start over (shouldn't happen with 100+ bullets)
        if (availableBullets.length === 0) {
            console.warn(`All ${type} bullets used! Resetting pool for ${type} category.`);
            // Clear only bullets of this type from used set
            bullets.forEach(bullet => this.usedBullets.delete(bullet));
            return this.getUniqueRandomBullet(type); // Recursive call with cleared pool
        }
        
        const randomIndex = Math.floor(Math.random() * availableBullets.length);
        const selectedBullet = availableBullets[randomIndex];
        
        // Mark this bullet as used
        this.usedBullets.add(selectedBullet);
        
        return selectedBullet;
    }
    
    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }
    
    // Get statistics about bullet usage
    getUsageStats() {
        const totalUsed = this.usedBullets.size;
        const professionalUsed = cvBullets.professional.filter(bullet => this.usedBullets.has(bullet)).length;
        const inflatedUsed = cvBullets.inflated.filter(bullet => this.usedBullets.has(bullet)).length;
        const absurdUsed = cvBullets.absurd.filter(bullet => this.usedBullets.has(bullet)).length;
        
        return {
            totalUsed,
            professionalUsed,
            inflatedUsed,
            absurdUsed,
            professionalRemaining: cvBullets.professional.length - professionalUsed,
            inflatedRemaining: cvBullets.inflated.length - inflatedUsed,
            absurdRemaining: cvBullets.absurd.length - absurdUsed
        };
    }
    
    // Future: Real AI integration method
    async generateWithAI(prompt) {
        if (!this.apiKey || !this.isEnabled) {
            throw new Error('AI integration not configured');
        }
        
        // Example OpenAI integration structure:
        /*
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-4',
                messages: [{
                    role: 'user',
                    content: prompt
                }],
                max_tokens: 150
            })
        });
        
        const data = await response.json();
        return this.parseAIResponse(data);
        */
    }
}

// Initialize CV Generator
const cvGenerator = new CVGenerator();

// Game Logic Functions
function initializeGame() {
    console.log('🎯 Game initialization started');
    
    // Set up event listeners
    elements.startGameBtn.addEventListener('click', startGame);
    elements.cvOption1.addEventListener('click', () => handleCVSelection(1));
    elements.cvOption2.addEventListener('click', () => handleCVSelection(2));
    elements.cvOption3.addEventListener('click', () => handleCVSelection(3));
    elements.cvOption4.addEventListener('click', () => handleCVSelection(4));
    elements.playAgainBtn.addEventListener('click', restartGame);
    elements.shareBtn.addEventListener('click', shareScore);
    
    // Initialize keyboard shortcuts
    initializeGameShortcuts();
    
    // Track page load
    trackEvent('game_page_loaded', {
        timestamp: new Date().toISOString(),
        user_agent: navigator.userAgent,
        game_type: 'spot_the_fake_cv'
    });
    
    console.log('✅ Game initialized successfully');
}

function startGame() {
    console.log('🚀 Starting new game');
    
    // Reset game state
    gameState.isPlaying = true;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.startTime = Date.now();
    
    // Reset temperature
    gameState.temperature = 1.0;
    
    // Reset used bullets for new game
    cvGenerator.resetUsedBullets();
    
    // Hide instructions, show game interface
    elements.gameInstructions.classList.add('hidden');
    elements.gameInterface.classList.remove('hidden');
    
    // Update display elements
    elements.totalQuestionsSpan.textContent = gameState.totalQuestions;
    updateStatsDisplay();
    
    // Start first question
    nextQuestion();
    
    // Start timer
    startTimer();
    
    // Track game start
    trackEvent('game_started', {
        total_questions: gameState.totalQuestions,
        start_time: gameState.startTime
    });
}

async function nextQuestion() {
    if (gameState.currentQuestion >= gameState.totalQuestions) {
        endGame();
        return;
    }
    
    gameState.currentQuestion++;
    gameState.questionStartTime = Date.now();
    
    // Calculate temperature for this question (decreases by 0.05 each question)
    gameState.temperature = Math.max(0.05, 1.0 - ((gameState.currentQuestion - 1) * 0.05));
    
    // Show loading with random verb
    showLoading();
    
    try {
        // Get CV options (with slight delay for effect)
        await new Promise(resolve => setTimeout(resolve, 600));
        const options = await cvGenerator.generateCVOptions(gameState.temperature);
        gameState.currentOptions = options;
        
        // Find which option is the fake one
        gameState.correctOption = options.findIndex(option => option.isFake) + 1;
        
        // Update display
        elements.cvBullet1.textContent = options[0].text;
        elements.cvBullet2.textContent = options[1].text;
        elements.cvBullet3.textContent = options[2].text;
        elements.cvBullet4.textContent = options[3].text;
        elements.currentQuestionSpan.textContent = gameState.currentQuestion;
        
        // Reset option states
        [elements.cvOption1, elements.cvOption2, elements.cvOption3, elements.cvOption4].forEach(option => {
            option.classList.remove('correct', 'incorrect', 'disabled');
        });
        
        // Update progress bar
        const progress = (gameState.currentQuestion / gameState.totalQuestions) * 100;
        elements.progressFill.style.width = `${progress}%`;
        
        // Hide loading
        hideLoading();
        
        // Enable options
        enableCVOptions();
        
        // Log usage stats for debugging
        const stats = cvGenerator.getUsageStats();
        console.log(`Question ${gameState.currentQuestion}: Temperature ${gameState.temperature.toFixed(2)}, Fake option: ${gameState.correctOption}`);
        console.log(`Bullets used: ${stats.totalUsed} total (${stats.professionalUsed} professional, ${stats.inflatedUsed} inflated, ${stats.absurdUsed} absurd)`);
        
    } catch (error) {
        console.error('Error generating question:', error);
        hideLoading();
    }
}

function handleCVSelection(selectedOption) {
    if (!gameState.isPlaying || !gameState.currentOptions.length) return;
    
    const isCorrect = selectedOption === gameState.correctOption;
    const responseTime = Date.now() - gameState.questionStartTime;
    
    // Calculate points (faster = more points, harder questions = more points)
    let points = 0;
    if (isCorrect) {
        // Base points: 100, reduced by response time, increased by difficulty (lower temperature)
        const timeReduction = Math.floor(responseTime / 100);
        const difficultyBonus = Math.floor((1.0 - gameState.temperature) * 50);
        points = Math.max(50 - timeReduction + difficultyBonus, 10);
        if (gameState.streak >= 3) points *= 1.5; // Streak bonus
        gameState.correctAnswers++;
        gameState.streak++;
    } else {
        points = -30;
        gameState.wrongAnswers++;
        gameState.streak = 0;
    }
    
    gameState.score += points;
    
    // Show visual feedback
    showMicroFeedback(isCorrect, selectedOption);
    
    // Update display
    updateStatsDisplay();
    
    // Disable options during feedback
    disableCVOptions();
    
    // Track answer
    trackEvent('cv_selection_made', {
        question_number: gameState.currentQuestion,
        selected_option: selectedOption,
        correct_option: gameState.correctOption,
        is_correct: isCorrect,
        response_time_ms: responseTime,
        points_earned: points,
        current_score: gameState.score,
        current_streak: gameState.streak,
        temperature: gameState.temperature
    });
    
    // Auto-advance after brief feedback
    setTimeout(() => {
        nextQuestion();
    }, 1500);
}

function showMicroFeedback(isCorrect, selectedOption) {
    // Update selected option appearance
    const selectedElement = document.getElementById(`cv-option-${selectedOption}`);
    const correctElement = document.getElementById(`cv-option-${gameState.correctOption}`);
    
    if (isCorrect) {
        selectedElement.classList.add('correct');
    } else {
        selectedElement.classList.add('incorrect');
        correctElement.classList.add('correct');
    }
    
    // Show full-screen feedback overlay
    elements.feedbackIcon.textContent = isCorrect ? '✓' : '✗';
    elements.feedbackOverlay.classList.remove('correct', 'incorrect');
    elements.feedbackOverlay.classList.add(isCorrect ? 'correct' : 'incorrect');
    elements.feedbackOverlay.classList.add('show');
    
    // Hide overlay after brief moment
    setTimeout(() => {
        elements.feedbackOverlay.classList.remove('show', 'correct', 'incorrect');
    }, 800);
}

// CV Option Management
function enableCVOptions() {
    [elements.cvOption1, elements.cvOption2, elements.cvOption3, elements.cvOption4].forEach(option => {
        option.disabled = false;
        option.classList.remove('disabled');
    });
}

function disableCVOptions() {
    [elements.cvOption1, elements.cvOption2, elements.cvOption3, elements.cvOption4].forEach(option => {
        option.disabled = true;
        option.classList.add('disabled');
    });
}

function updateDifficultyDisplay() {
    // Show temperature as difficulty indicator
    const difficultyPercent = Math.round((1.0 - gameState.temperature) * 100);
    if (difficultyPercent > 0 && difficultyPercent % 25 === 0) {
        elements.shortcutNotification.textContent = `Difficulty: ${difficultyPercent}%`;
        elements.shortcutNotification.classList.add('show');
        setTimeout(() => {
            elements.shortcutNotification.classList.remove('show');
        }, 1500);
    }
}

function updateStatsDisplay() {
    elements.scoreDisplay.textContent = gameState.score;
    elements.streakDisplay.textContent = gameState.streak;
    const difficultyLevel = Math.round((1.0 - gameState.temperature) * 100);
    elements.levelDisplay.textContent = difficultyLevel + '%';
}

function startTimer() {
    const timer = setInterval(() => {
        if (!gameState.isPlaying) {
            clearInterval(timer);
            return;
        }
        
        gameState.timeElapsed = Date.now() - gameState.startTime;
        const minutes = Math.floor(gameState.timeElapsed / 60000);
        const seconds = Math.floor((gameState.timeElapsed % 60000) / 1000);
        elements.timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function endGame() {
    console.log('🏁 Game ending');
    
    gameState.isPlaying = false;
    
    // Calculate final stats
    const accuracy = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);
    const finalTime = formatTime(gameState.timeElapsed);
    
    // Hide game interface, show results
    elements.gameInterface.classList.add('hidden');
    elements.gameResults.classList.remove('hidden');
    
    // Update results display
    elements.finalScore.textContent = gameState.score;
    elements.finalTime.textContent = finalTime;
    elements.finalAccuracy.textContent = `${accuracy}%`;
    
    // Get final bullet usage stats
    const finalStats = cvGenerator.getUsageStats();
    
    // Track game completion
    trackEvent('game_completed', {
        final_score: gameState.score,
        accuracy: accuracy,
        time_played_ms: gameState.timeElapsed,
        questions_answered: gameState.totalQuestions,
        correct_answers: gameState.correctAnswers,
        wrong_answers: gameState.wrongAnswers,
        max_streak: gameState.streak,
        bullets_used: finalStats.totalUsed,
        professional_bullets_used: finalStats.professionalUsed,
        inflated_bullets_used: finalStats.inflatedUsed,
        absurd_bullets_used: finalStats.absurdUsed
    });
    
    console.log(`✅ Game completed - Score: ${gameState.score}, Accuracy: ${accuracy}%`);
}

function restartGame() {
    console.log('🔄 Restarting game...');
    
    // Reset display
    elements.gameResults.classList.add('hidden');
    elements.gameInterface.classList.add('hidden');
    elements.gameInstructions.classList.remove('hidden');
    
    // Reset all game state
    gameState.isPlaying = false;
    gameState.isPaused = false;
    gameState.currentQuestion = 0;
    gameState.score = 0;
    gameState.streak = 0;
    gameState.temperature = 1.0;
    gameState.startTime = null;
    gameState.questionStartTime = null;
    gameState.correctAnswers = 0;
    gameState.wrongAnswers = 0;
    gameState.currentOptions = [];
    gameState.correctOption = null;
    gameState.timeElapsed = 0;
    
    // Reset UI elements
    elements.scoreDisplay.textContent = '0';
    elements.timerDisplay.textContent = '00:00';
    elements.streakDisplay.textContent = '0';
    elements.levelDisplay.textContent = '1';
    elements.progressFill.style.width = '0%';
    elements.currentQuestionSpan.textContent = '1';
    
    // Clear CV options
    elements.cvBullet1.textContent = 'Loading CV bullet...';
    elements.cvBullet2.textContent = 'Loading CV bullet...';
    elements.cvBullet3.textContent = 'Loading CV bullet...';
    elements.cvBullet4.textContent = 'Loading CV bullet...';
    
    // Remove any selected states
    document.querySelectorAll('.cv-option').forEach(option => {
        option.classList.remove('selected', 'correct', 'incorrect', 'disabled');
    });
    
    // Track restart
    trackEvent('game_restarted');
    
    console.log('✅ Game reset complete');
}

// Utility Functions - keeping for compatibility
function enableActionButtons() {
    // Legacy function for compatibility
}

function disableActionButtons() {
    // Legacy function for compatibility
}

function showLoading(message = null) {
    const loadingText = elements.loadingOverlay.querySelector('.loading-text');
    if (loadingText) {
        if (message) {
            loadingText.textContent = message;
        } else {
            // Pick a random loading verb
            const randomVerb = loadingVerbs[Math.floor(Math.random() * loadingVerbs.length)];
            loadingText.textContent = `${randomVerb}...`;
        }
    }
    elements.loadingOverlay.classList.remove('hidden');
}

function hideLoading() {
    elements.loadingOverlay.classList.add('hidden');
}

function formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Keyboard Shortcuts
function initializeGameShortcuts() {
    // Basic shortcuts functionality
    elements.shortcutsTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        toggleShortcutsPanel();
    });
    
    elements.shortcutsClose.addEventListener('click', hideShortcutsPanel);
    
    // Keyboard event listeners
    document.addEventListener('keydown', handleGameKeyPress);
    
    // Close shortcuts on outside click
    document.addEventListener('click', (e) => {
        if (elements.keyboardShortcuts.classList.contains('show') && 
            !elements.keyboardShortcuts.contains(e.target) && 
            !elements.shortcutsTrigger.contains(e.target)) {
            hideShortcutsPanel();
        }
    });
}

function handleGameKeyPress(e) {
    // Don't trigger shortcuts when typing
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
    
    switch (e.key) {
        case ' ':
            // Space key to start game
            if (!gameState.isPlaying) {
                e.preventDefault();
                startGame();
            }
            break;
        case 'Escape':
            // ESC key to exit game and return to main portfolio
            e.preventDefault();
            window.location.href = '/';
            break;
        case '/':
            // Don't show shortcuts panel on mobile
            if (window.innerWidth <= 768) return;
            e.preventDefault();
            toggleShortcutsPanel();
            break;
        case '1':
            // Don't use number shortcuts on mobile
            if (window.innerWidth <= 768) return;
            if (gameState.isPlaying) {
                e.preventDefault();
                handleCVSelection(1);
            }
            break;
        case '2':
            // Don't use number shortcuts on mobile
            if (window.innerWidth <= 768) return;
            if (gameState.isPlaying) {
                e.preventDefault();
                handleCVSelection(2);
            }
            break;
        case '3':
            // Don't use number shortcuts on mobile
            if (window.innerWidth <= 768) return;
            if (gameState.isPlaying) {
                e.preventDefault();
                handleCVSelection(3);
            }
            break;
        case '4':
            // Don't use number shortcuts on mobile
            if (window.innerWidth <= 768) return;
            if (gameState.isPlaying) {
                e.preventDefault();
                handleCVSelection(4);
            }
            break;
        case 'r':
        case 'R':
            // Allow restart shortcut on all devices
            e.preventDefault();
            if (gameState.isPlaying) {
                if (confirm('Are you sure you want to restart the game?')) {
                    restartGame();
                }
            } else {
                restartGame();
            }
            break;
    }
}

function toggleShortcutsPanel() {
    elements.keyboardShortcuts.classList.toggle('show');
}

function hideShortcutsPanel() {
    elements.keyboardShortcuts.classList.remove('show');
}

// Screenshot and Sharing Functionality
function shareScore() {
    // Capture screenshot of the results screen
    captureGameScreenshot('results').then(screenshotBlob => {
        const accuracy = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);
        const shareText = `🎯 I just scored ${gameState.score} points with ${accuracy}% accuracy in Spot the Fake CV! Can you identify AI-generated resume bullets? Try it yourself!`;
        
        if (navigator.share && screenshotBlob) {
            const file = new File([screenshotBlob], 'spot-the-fake-cv-score.png', { type: 'image/png' });
            navigator.share({
                title: 'Spot the Fake CV - My Score',
                text: shareText,
                files: [file],
                url: window.location.origin + '/game.html'
            }).catch(err => {
                console.log('Error sharing with image:', err);
                // Fallback to text-only sharing
                shareTextOnly(shareText);
            });
        } else {
            shareTextOnly(shareText);
        }
        
        trackEvent('score_shared', {
            final_score: gameState.score,
            accuracy: accuracy,
            share_method: navigator.share ? 'native' : 'clipboard',
            includes_screenshot: !!screenshotBlob
        });
    }).catch(err => {
        console.log('Screenshot capture failed:', err);
        const accuracy = Math.round((gameState.correctAnswers / gameState.totalQuestions) * 100);
        const shareText = `🎯 I just scored ${gameState.score} points with ${accuracy}% accuracy in Spot the Fake CV!`;
        shareTextOnly(shareText);
    });
}

function shareTextOnly(shareText) {
    if (navigator.share) {
        navigator.share({
            title: 'Spot the Fake CV - My Score',
            text: shareText,
            url: window.location.origin + '/game.html'
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(shareText + ' ' + window.location.href).then(() => {
            showNotification('Score copied to clipboard!');
        }).catch(() => {
            showNotification('Share: ' + shareText);
        });
    }
}

// Screenshot capture functionality
async function captureGameScreenshot(type = 'results') {
    if (!window.html2canvas) {
        // Load html2canvas library dynamically
        await loadHtml2Canvas();
    }
    
    try {
        let targetElement;
        if (type === 'results') {
            targetElement = elements.gameResults;
        } else {
            targetElement = document.body;
        }
        
        const canvas = await html2canvas(targetElement, {
            backgroundColor: '#FFFFFF',
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true
        });
        
        return new Promise(resolve => {
            canvas.toBlob(resolve, 'image/png', 0.9);
        });
    } catch (error) {
        console.error('Screenshot capture failed:', error);
        throw error;
    }
}

// Dynamically load html2canvas library
function loadHtml2Canvas() {
    return new Promise((resolve, reject) => {
        if (window.html2canvas) {
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

function showNotification(message) {
    elements.shortcutNotification.textContent = message;
    elements.shortcutNotification.classList.add('show');
    setTimeout(() => {
        elements.shortcutNotification.classList.remove('show');
    }, 2000);
}

// Analytics Integration
function trackEvent(eventName, properties = {}) {
    if (typeof posthog !== 'undefined') {
        posthog.capture(`spot_the_fake_cv_${eventName}`, {
            ...properties,
            game_version: '2.0',
            game_format: '4_option_selection',
            timestamp: new Date().toISOString()
        });
    }
    console.log(`📊 Event tracked: ${eventName}`, properties);
}

// Add CSS animation classes
const style = document.createElement('style');
style.textContent = `
    .shortcuts-trigger {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--superhot-black);
        color: var(--superhot-white);
        border: 2px solid var(--superhot-black);
        padding: 12px 20px;
        border-radius: 0;
        font-family: 'JetBrains Mono', monospace;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        z-index: 1000;
        transition: none;
    }
    
    .shortcuts-trigger:hover {
        background: var(--superhot-white);
        color: var(--superhot-black);
    }
    
    .keyboard-shortcuts {
        position: fixed;
        bottom: 80px;
        right: 20px;
        background: var(--superhot-white);
        border: 3px solid var(--superhot-black);
        padding: 20px;
        z-index: 1001;
        opacity: 0;
        visibility: hidden;
        transform: translateY(20px);
        transition: all 0.3s ease;
        max-width: 300px;
    }
    
    .keyboard-shortcuts.show {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
    }
    
    .keyboard-shortcuts-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        border-bottom: 2px solid var(--superhot-black);
        padding-bottom: 10px;
    }
    
    .keyboard-shortcuts-title {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        color: var(--superhot-black);
    }
    
    .shortcuts-toggle {
        background: none;
        border: none;
        color: var(--superhot-black);
        font-size: 20px;
        cursor: pointer;
    }
    
    .shortcuts-list {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .shortcuts-list li {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid var(--superhot-black);
    }
    
    .shortcuts-list li:last-child {
        border-bottom: none;
    }
    
    .shortcut-keys {
        font-family: 'JetBrains Mono', monospace;
        background: var(--superhot-black);
        color: var(--superhot-white);
        padding: 2px 8px;
        font-size: 12px;
        font-weight: 600;
    }
    
    .shortcut-description {
        font-family: 'DM Sans', sans-serif;
        font-size: 14px;
        color: var(--superhot-black);
    }
    
    .shortcut-notification {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--superhot-black);
        color: var(--superhot-white);
        padding: 15px 30px;
        border: 3px solid var(--superhot-black);
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        z-index: 2000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
    }
    
    .shortcut-notification.show {
        opacity: 1;
        visibility: visible;
    }
    
    /* Hide keyboard shortcuts on mobile */
    @media (max-width: 768px) {
        .shortcuts-trigger {
            display: none;
        }
    }
`;
document.head.appendChild(style);

// Initialize PostHog for game analytics
function initializePostHogForGame() {
    // Get PostHog configuration from environment variables
    const posthogKey = import.meta.env.VITE_POSTHOG_KEY;
    const posthogHost = import.meta.env.VITE_POSTHOG_HOST || 'https://us.posthog.com';
    
    if (posthogKey && window.location.protocol !== 'file:') {
        // Initialize PostHog with environment variables
        !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)";},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
        posthog.init(posthogKey, {api_host: posthogHost});
        console.log('📊 PostHog initialized for game analytics');
    } else {
        // Create dummy PostHog object for local development
        window.posthog = {
            capture: function() { /* no-op */ },
            identify: function() { /* no-op */ }
        };
        console.log('📊 PostHog disabled for game - no API key or running on file:// protocol');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎮 DOM loaded, initializing Spot the Fake CV...');
    initializePostHogForGame();
    initializeGame();
});

// Export for debugging
window.gameState = gameState;
window.gameUtils = {
    trackEvent,
    showNotification,
    restartGame,
    nextQuestion
};

console.log('✅ Spot the Fake CV game script loaded successfully');