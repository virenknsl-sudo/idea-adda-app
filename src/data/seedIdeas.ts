import {
  CollaborationModel,
  CollaborationProposal,
  IdeaCategory,
  IdeaItem,
} from '../types/marketplace';

interface SeedIdeaTuple {
  id: string;
  title: string;
  category: Exclude<IdeaCategory, IdeaCategory.ALL>;
  summary: string;
  detailedDescription: string;
  secretPitch: string;
  roadmap: [string, string, string];
  targetAudience: string;
  collaborationModel: CollaborationModel;
  askingTerms: string;
  isPremium: boolean;
  unlockCredits: number;
  authorId: string;
  authorName: string;
  authorRole: string;
  authorHandle: string;
  createdAt: string;
  upvotes: number;
  tags: string[];
  coverImage?: string;
  isFeatured?: boolean;
  boostCredits?: number;
  featuredAt?: string;
}

function toIdeaItem(raw: SeedIdeaTuple): IdeaItem {
  return {
    id: raw.id,
    title: raw.title,
    category: raw.category,
    summary: raw.summary,
    detailedDescription: raw.detailedDescription,
    secretPitch: raw.secretPitch,
    executionRoadmap: raw.roadmap,
    targetAudience: raw.targetAudience,
    collaborationModel: raw.collaborationModel,
    askingTerms: raw.askingTerms,
    isPremium: raw.isPremium,
    unlockCredits: raw.isPremium ? raw.unlockCredits : 0,
    authorId: raw.authorId,
    authorName: raw.authorName,
    authorRole: raw.authorRole,
    authorHandle: raw.authorHandle,
    createdAt: raw.createdAt,
    upvotes: raw.upvotes,
    tags: raw.tags,
    coverImage: raw.coverImage,
    isFeatured: raw.isFeatured,
    boostCredits: raw.boostCredits,
    featuredAt: raw.featuredAt,
  };
}

const RAW_SEED_IDEAS: SeedIdeaTuple[] = [
  // =====================================================================
  // 1. CREATOR ECONOMY & REGIONAL CONTENT (15)
  // =====================================================================
  {
    id: 'idea-desishorts-script-ai',
    title: 'Hindi, Haryanvi & Punjabi AI Script Engine for YouTube Shorts',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Generates high-retention 45-second storytelling hooks and punchlines in authentic Hindi, Haryanvi, and Punjabi dialects for faceless Shorts channels.',
    detailedDescription:
      'Generic English AI translators sound stiff and robotic when rewritten into Hindi or regional slangs. Creators growing regional commentary, cricket, and folklore channels need punchy local idioms, cultural callbacks, and beat-paced voiceover cues.',
    secretPitch:
      'Pre-seed 50 viral dialect hook formulas from Rohtak, Ludhiana, and Kanpur meme admins—charge ₹299/month via UPI AutoPay after giving 3 free scripts on WhatsApp.',
    roadmap: [
      'Curate 500 high-CTR regional Shorts scripts tagged by dialect & tone',
      'Build 1-click Hinglish/Devanagari teleprompter & voice-pacing exporter',
      'Launch via Telegram creator groups and Tier-2 editing academies',
    ],
    targetAudience: 'Regional YouTube Shorts creators, Reel scriptwriters, meme admins',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹750 Blueprint · 20% Revenue Share',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-zaid',
    authorName: 'Zaid Khan',
    authorRole: 'Short-Form Studio Lead',
    authorHandle: '@zaidreels',
    createdAt: '2026-11-14T16:10:00Z',
    upvotes: 584,
    tags: ['shorts', 'youtube', 'hindi', 'upi'],
    coverImage: '/images/spotlight-content-studio.jpg',
    isFeatured: true,
    boostCredits: 10,
    featuredAt: '2026-11-14T16:10:00Z',
  },
  {
    id: 'idea-city-meme-ad-network',
    title: 'Hyper-Local City Meme Page Brand Deal & Escrow Network',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Connects 200+ Indore, Jaipur, Surat, and Lucknow meme pages directly with local cafes, coaching institutes, and D2C launches.',
    detailedDescription:
      'City meme pages with 100k–400k hyper-engaged college followers struggle to price brand shoutouts cleanly, while local restaurants waste budgets on dead newspaper flyers.',
    secretPitch:
      'Bundle 10 city pages into guaranteed ₹1,500–₹4,500 weekend Reel blitz packages with automated Razorpay/UPI split payouts and Story view screenshots.',
    roadmap: [
      'Verify real city-tier audience splits from Instagram Insights uploads',
      'Standardize ₹499–₹1,499 shoutout rate cards per city cluster',
      'Automate UPI escrow release once Story/Reel stays live 24 hours',
    ],
    targetAudience: 'Regional Instagram meme admins, local cafes, D2C growth leads',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹950 Concept Transfer · 15% Equity',
    isPremium: true,
    unlockCredits: 7,
    authorId: 'author-rohan',
    authorName: 'Rohan Mehta',
    authorRole: 'Creator Network Operator',
    authorHandle: '@rohanedits',
    createdAt: '2026-11-14T11:30:00Z',
    upvotes: 541,
    tags: ['memes', 'hyperlocal', 'upi', 'd2c'],
  },
  {
    id: 'idea-shaadi-vlogger-lut-kit',
    title: 'Indian Shaadi Vlogging LUTs, Dhol SFX & Haldi Title Plugin Kit',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Premiere Pro & CapCut drag-and-drop pack calibrated for Indian wedding lighting, warm marigold tones, dhol risers, and Devanagari couple titles.',
    detailedDescription:
      'Western wedding LUTs wash out brown skin tones and over-saturate red lehengas and yellow haldi decor. Freelance wedding editors spend hours fixing mixed mandap LED lights.',
    secretPitch:
      'Distribute a free 5-LUT "Sangeet Night Fix" sampler inside Indian wedding photography WhatsApp groups, upselling the full 80-asset Haldi-to-Vidaai pack at ₹499.',
    roadmap: [
      'Color-grade 25 LUTs specifically for Canon/Sony footage in Indian mandaps',
      'Record cleared dhol, shehnai, and baraat ambient sound transitions',
      'Set up instant UPI checkout with WhatsApp download delivery',
    ],
    targetAudience: 'Wedding videographers, pre-wedding editors, shaadi vloggers',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹650 Full Kit Spec & Asset List',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-sana',
    authorName: 'Sana Qureshi',
    authorRole: 'Audio & Color Director',
    authorHandle: '@sanastems',
    createdAt: '2026-11-13T18:20:00Z',
    upvotes: 492,
    tags: ['wedding', 'youtube', 'shorts', 'upi'],
  },
  {
    id: 'idea-hinglish-reel-captions',
    title: 'Desi Hinglish & Regional Devanagari Kinetic Reel Subtitle Styler',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Fixes mangled Indian names and Hindi-English code-switching in auto-captions with viral creator font presets and 1-click beat bounce.',
    detailedDescription:
      'Global subtitle apps consistently butcher Hinglish words like "bhai", "jugadu", "crore", or regional town names. Fixing every Reel manually wastes 45 minutes per upload.',
    secretPitch:
      'Offer 5 free exports/week watermarked subtly and charge ₹199/month via UPI for clean 4K transparent subtitle overlays.',
    roadmap: [
      'Build custom Hinglish + Marathi + Punjabi phonetic spelling fixer',
      'Design 16 high-contrast kinetic caption styles tuned for mobile feeds',
      'Ship browser MP4/WebM overlay export with zero After Effects needed',
    ],
    targetAudience: 'Instagram Reels creators, finance educators, regional podcasters',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹800 Blueprint · 15% Equity',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-ishaan',
    authorName: 'Ishaan Kapoor',
    authorRole: 'Short-Form Packaging Strategist',
    authorHandle: '@ishaanctr',
    createdAt: '2026-11-13T14:00:00Z',
    upvotes: 467,
    tags: ['hindi', 'shorts', 'youtube', 'upi'],
  },
  {
    id: 'idea-bhajan-lofi-stem-vault',
    title: 'Copyright-Safe Bhajan, Lo-Fi & Folk Beat Vault for Indian Creators',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Royalty-free tabla, bansuri, harmonium, and devotional lo-fi stems cleared for monetized YouTube Shorts, Reels, and travel vlogs.',
    detailedDescription:
      'Travel and cultural creators get instant copyright strikes whenever temple bells, folk singers, or Bollywood hums bleed into background audio.',
    secretPitch:
      'Commission independent Varanasi & Jaipur classical conservatory students for ₹500/track flat + 30% royalty pool, charging creators ₹299/month for unlimited channel whitelisting.',
    roadmap: [
      'Record 200 authentic acoustic & lo-fi folk loops with clean stem rights',
      'Automate YouTube Channel ID copyright allowlist PDF generation',
      'Partner with 20 Indian moto-vloggers and heritage storytellers',
    ],
    targetAudience: 'Travel vloggers, spiritual channels, cultural Reel creators',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹550 Concept · 20% Rev Share',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-aarti',
    authorName: 'Aarti Kulkarni',
    authorRole: 'Regional Content Strategist',
    authorHandle: '@aartitrends',
    createdAt: '2026-11-12T17:15:00Z',
    upvotes: 388,
    tags: ['youtube', 'hindi', 'shorts'],
  },
  {
    id: 'idea-regional-podcast-clip-bounty',
    title: 'Per-View Short-Clip Bounty Board for Hindi & Regional Podcasters',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Lets podcasters upload raw 90-minute episodes and pay skilled student clippers ₹250–₹1,500 via UPI per verified high-retention Reel.',
    detailedDescription:
      'Paying ₹35,000/month agency retainers rarely delivers viral instincts, while thousands of skilled Tier-2 college editors want performance-based side income.',
    secretPitch:
      'Verify reel view milestones automatically and take a 10% platform escrow cut on UPI payouts.',
    roadmap: [
      'Build episode timestamp & Hindi transcript search dropbox',
      'Add milestone-based UPI escrow bounty payouts (₹250 base + view bonus)',
      'Seed 12 Indian founder/astrology/comedy podcasts at launch',
    ],
    targetAudience: 'Indian podcasters, freelance Reel clippers, college editors',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹1,100 Blueprint · 20% Equity',
    isPremium: true,
    unlockCredits: 8,
    authorId: 'author-nikita',
    authorName: 'Nikita Rao',
    authorRole: 'Podcast Growth Producer',
    authorHandle: '@nikitapods',
    createdAt: '2026-11-12T10:30:00Z',
    upvotes: 356,
    tags: ['podcast', 'shorts', 'upi', 'student'],
  },
  {
    id: 'idea-cricket-fantasy-reel-maker',
    title: 'Match-Day Live Stat & IPL Trivia Graphic Builder for Fan Channels',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Turns live scorecard stats into 9:16 Hindi/Tamil/Telugu animated Reel cards within 3 minutes of every match turning point.',
    detailedDescription:
      'Cricket fan pages live or die by posting speed right after a last-over finish. Manually making stat graphics in Canva takes 25 minutes too long.',
    secretPitch:
      'Sell ₹399 tournament passes during IPL & World Cup seasons promoted via cricket Telegram channels.',
    roadmap: [
      'Pre-build 20 vibrant jersey-matched 9:16 scorecard & poll templates',
      'Auto-format strike-rate, head-to-head, and venue comparisons',
      'Add 1-tap Hindi/Tamil/Telugu headline translation toggle',
    ],
    targetAudience: 'Cricket fan pages, sports commentators, Telegram communities',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹499 Full Template & Flow Spec',
    isPremium: true,
    unlockCredits: 4,
    authorId: 'author-varun',
    authorName: 'Varun Nair',
    authorRole: 'Motion Systems Designer',
    authorHandle: '@varunmotion',
    createdAt: '2026-11-11T15:40:00Z',
    upvotes: 429,
    tags: ['shorts', 'memes', 'hindi', 'upi'],
  },
  {
    id: 'idea-vernacular-thumbnail-lab',
    title: 'Mobile-First Hindi & Regional YouTube Thumbnail Contrast Lab',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Tests Devanagari/Tamil/Telugu thumbnail headlines at real Jio-phone & budget Android widths before publishing.',
    detailedDescription:
      'Complex regional scripts turn muddy and illegible on 160px mobile home feeds, hurting CTR for Tier-2/3 education and news creators.',
    secretPitch:
      'Release a free browser YouTube feed previewer to win organic creator shares; charge ₹199/month for agency multi-thumbnail A/B client sign-off links.',
    roadmap: [
      'Render accurate Android light/dark YouTube mobile feed simulations',
      'Check regional font stroke contrast against busy studio backgrounds',
      'Provide 1-click WhatsApp shareable voting link for editor teams',
    ],
    targetAudience: 'Regional YouTubers, thumbnail artists, EdTech channels',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹350 Concept · 15% Revenue Share',
    isPremium: true,
    unlockCredits: 3,
    authorId: 'author-dev',
    authorName: 'Devansh Joshi',
    authorRole: 'Media Operator',
    authorHandle: '@devanshmedia',
    createdAt: '2026-11-10T12:20:00Z',
    upvotes: 274,
    tags: ['youtube', 'hindi', 'tier2'],
  },
  {
    id: 'idea-astrology-panchang-reels',
    title: 'Daily Rashifal & Panchang Automated Reel Studio for Astro Creators',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Generates 12 zodiac-specific 30-second daily video cards with clean Sanskrit shlokas and voiceover scripts every morning at 5 AM.',
    detailedDescription:
      'Astrology, vastu, and panchang creators pull millions of morning WhatsApp Status & Facebook Reels views but burn out producing 12 videos daily.',
    secretPitch:
      'Charge pandits and astrology creators ₹799/month via UPI for white-labeled watermark packs including their WhatsApp consultation booking QR.',
    roadmap: [
      'Automate daily panchang, tithi, and rashi card templates',
      'Embed creator phone number & UPI booking QR in footer frame',
      'Export 12 WhatsApp-Status-sized MP4s in a single batch',
    ],
    targetAudience: 'Astrology creators, vastu consultants, regional WhatsApp publishers',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹799 Blueprint & Template Architecture',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-pandit-rahul',
    authorName: 'Rahul Tiwari',
    authorRole: 'Vernacular Media Builder',
    authorHandle: '@rahultiwari',
    createdAt: '2026-11-09T09:10:00Z',
    upvotes: 312,
    tags: ['whatsapp', 'shorts', 'hindi', 'upi'],
  },
  {
    id: 'idea-topmate-whatsapp-funnel',
    title: '1-Click WhatsApp Mini-Course & Paid PDF Vault for Micro-Creators',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Lets regional finance, fitness, and exam mentors deliver locked PDFs & 5-day WhatsApp drip lessons straight after a ₹99–₹499 UPI scan.',
    detailedDescription:
      'Tier-2 audiences drop off multi-step foreign checkout forms but pay effortlessly via PhonePe/GPay and read everything inside WhatsApp.',
    secretPitch:
      'Take 5% per successful UPI sale with zero monthly fee—onboard 500 micro-creators from Instagram fitness & sarkari-job niches.',
    roadmap: [
      'Link UPI payment confirmation directly to WhatsApp document delivery',
      'Stamp buyer phone number watermark onto PDFs to curb Telegram leaks',
      'Provide simple creator payout ledger via FamPay/UPI',
    ],
    targetAudience: 'Micro-creators, fitness coaches, PDF note sellers',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹1,200 Blueprint · 20% Equity',
    isPremium: true,
    unlockCredits: 8,
    authorId: 'author-viren-seed',
    authorName: 'Viren Kansal',
    authorRole: 'Product Studio Founder',
    authorHandle: '@virendev',
    createdAt: '2026-11-08T14:50:00Z',
    upvotes: 451,
    tags: ['whatsapp', 'upi', 'hindi'],
  },
  {
    id: 'idea-bhojpuri-marathi-hook-bank',
    title: 'Festival & Cultural Trend Radar for Bhojpuri, Marathi & Tamil Feeds',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Weekly calendar of rising regional audio trends, Chhath/Ganpati/Pongal Reel formats, and clean brand-integration scripts.',
    detailedDescription:
      'National agencies miss hyper-regional festivals and dialect jokes until trends have already peaked locally.',
    secretPitch:
      'Publish a free 5-bullet weekly Telegram alert and sell ₹499/month agency seats with commercial-safe song alternatives.',
    roadmap: [
      'Monitor rising regional audio clips across 6 Indian languages weekly',
      'Pair each trend with 3 safe D2C brand-integration angles',
      'Include bilingual script prompts for small-town creators',
    ],
    targetAudience: 'Regional social media agencies, city influencers, D2C teams',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: 'Open Brief · ₹0 Unlock · 20% Rev Share',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'author-pooja',
    authorName: 'Pooja Bhatia',
    authorRole: 'Local Commerce Strategist',
    authorHandle: '@poojalocal',
    createdAt: '2026-11-07T11:05:00Z',
    upvotes: 146,
    tags: ['shorts', 'tier2', 'd2c'],
  },
  {
    id: 'idea-indie-comic-webtoon-voice',
    title: 'Hindi/Regional Motion-Comic Dubbing & Sound Studio for Creators',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Turns static Instagram carousel comics and mythological art into voiced 60-second animated Reels with cinematic Indian SFX.',
    detailedDescription:
      'Talented Indian illustrators struggle to transition from static Instagram carousels into Reels where organic reach lives today.',
    secretPitch:
      'Offer a ₹199 per-Reel credit pack for solo illustrators plus ₹1,499/month studio bundles for regional story channels.',
    roadmap: [
      'Add smooth 2.5D parallax pan/zoom presets for comic panels',
      'Bundle clean Hindi/Marathi expressive narrator voice presets',
      'Export Instagram-ready 1080x1920 MP4s with speech-bubble pops',
    ],
    targetAudience: 'Indian webcomic artists, mythological storytellers, animators',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹599 Concept · 15% Equity',
    isPremium: true,
    unlockCredits: 4,
    authorId: 'author-tara',
    authorName: 'Tara Singhania',
    authorRole: 'Creator Partnerships Lead',
    authorHandle: '@taracampaigns',
    createdAt: '2026-11-06T16:20:00Z',
    upvotes: 223,
    tags: ['shorts', 'hindi', 'youtube'],
  },
  {
    id: 'idea-creator-sponsorship-gst-desk',
    title: 'Creator Brand-Deal Rate Card, TDS & GST Invoice Buddy',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Helps Indian influencers quote fair CPM rates in ₹, issue proper SAC-coded GST/TDS invoices, and track 45-day agency payments.',
    detailedDescription:
      'Creators lose lakhs to delayed agency payouts and messy 194J TDS surprises at tax filing because they send screenshots instead of proper invoices.',
    secretPitch:
      'Free rate-card & invoice generator; charge ₹299/month for automated WhatsApp payment-reminder nudges to brand managers.',
    roadmap: [
      'Benchmark regional CPM bands for 10k–500k Indian creators',
      'Generate compliant PDF invoices with PAN, TDS 194J & UPI QR',
      'Automate polite 15/30/45-day WhatsApp follow-up reminders',
    ],
    targetAudience: 'Indian influencers, talent managers, UGC creators',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹899 Complete Product Spec',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-neeraj',
    authorName: 'Neeraj Kulkarni',
    authorRole: 'FinOps Product Builder',
    authorHandle: '@neerajpay',
    createdAt: '2026-11-05T10:40:00Z',
    upvotes: 298,
    tags: ['gst', 'upi', 'whatsapp'],
  },
  {
    id: 'idea-city-food-vlogger-map',
    title: 'Verified Street-Food Reel Map & Stall Owner Promo Directory',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Turns food vlogger Reels across Delhi, Mumbai, Indore & Kolkata into a searchable pin map where stalls pay ₹499 for verified timings & UPI links.',
    detailedDescription:
      'Viewers save hundreds of street-food Reels on Instagram and never find the exact corner cart location, phone number, or evening timings.',
    secretPitch:
      'Share 40% of ₹499 verified-stall badge fees with the local food creator who links the map in their bio.',
    roadmap: [
      'Auto-extract location pins & dishes from food vlogger Reel captions',
      'Add verified stall timings, hygiene rating & direct Zomato/maps link',
      'Launch city food trails with 15 mid-tier food vloggers',
    ],
    targetAudience: 'Street-food vloggers, local eateries, city foodies',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹450 Blueprint · 25% Rev Share',
    isPremium: true,
    unlockCredits: 3,
    authorId: 'author-arjun',
    authorName: 'Arjun Malhotra',
    authorRole: 'F&B Growth Operator',
    authorHandle: '@arjunqsr',
    createdAt: '2026-11-04T13:15:00Z',
    upvotes: 365,
    tags: ['hyperlocal', 'shorts', 'upi'],
  },
  {
    id: 'idea-rural-agri-youtube-kit',
    title: 'Mandi Price & Tractor Review Overlay Pack for Rural Creators',
    category: IdeaCategory.CREATOR_REGIONAL,
    summary:
      'Plug-and-play bilingual data cards for India’s booming rural YouTube creators covering tractor mileage, seed yield, and mandi bhav.',
    detailedDescription:
      'Rural farming & tractor channels hit 500k+ views regularly with raw smartphone edits but lack clean Hindi/Punjabi comparison charts for agri sponsors.',
    secretPitch:
      'Offer free basic cards and partner with agri-input & tractor finance brands for ₹1,500 sponsored creator overlay kits.',
    roadmap: [
      'Design bold high-readability tractor & crop yield comparison graphics',
      'Integrate daily Agmarknet mandi price ticker generator',
      'Distribute via rural creator WhatsApp communities',
    ],
    targetAudience: 'Agri YouTubers, rural tech reviewers, agri-input marketers',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: 'Open Brief · ₹0 Unlock · Co-Founder Split',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'author-harsh',
    authorName: 'Harshvardhan Patel',
    authorRole: 'Rural Commerce Consultant',
    authorHandle: '@harshtally',
    createdAt: '2026-11-03T08:45:00Z',
    upvotes: 184,
    tags: ['youtube', 'hindi', 'tier2'],
  },

  // =====================================================================
  // 2. LOCAL & D2C BUSINESSES (15)
  // =====================================================================
  {
    id: 'idea-kirana-whatsapp-order-bot',
    title: 'WhatsApp Automated Ordering & Khata Bot for Local Kirana Stores',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Lets neighborhood customers text or send a handwritten parchi photo on WhatsApp to auto-build a bill, pay via UPI QR, and schedule home delivery.',
    detailedDescription:
      'Quick-commerce apps eat into neighborhood kirana loyalty because calling or texting unstructured grocery lists leads to missed items and manual billing delays.',
    secretPitch:
      'Distribute through local FMCG wholesale salesmen who already visit 40 kiranas a day—charge the shopkeeper ₹299/month with zero per-order commission.',
    roadmap: [
      'Parse Hindi/English handwritten parchi photos & voice notes into item bills',
      'Auto-reply with itemized total + shopkeeper’s own UPI QR link',
      'Send 1-click "Out for Delivery with Chotu" WhatsApp status update',
    ],
    targetAudience: 'Neighborhood kirana stores, mini-marts, gated-society grocers',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹1,450 Blueprint · 20% Co-Founder Equity',
    isPremium: true,
    unlockCredits: 9,
    authorId: 'author-vikas',
    authorName: 'Vikas Tiwari',
    authorRole: 'Hyperlocal Retail Operator',
    authorHandle: '@vikashome',
    createdAt: '2026-11-14T15:00:00Z',
    upvotes: 592,
    tags: ['kirana', 'whatsapp', 'upi', 'hyperlocal'],
    coverImage: '/images/spotlight-commerce-venture.jpg',
  },
  {
    id: 'idea-mehndi-bridal-lead-funnel',
    title: 'Instant Quote & Calendar Lead Funnel for Mehndi Artists & Bridal Studios',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Interactive 4-step WhatsApp/web portfolio quiz capturing wedding date, hand-coverage tier, and ₹500 UPI token advance automatically.',
    detailedDescription:
      'Talented Mehndi artists and independent makeup artists waste hours replying "Price please?" on Instagram DMs only to get ghosted when dates clash.',
    secretPitch:
      'Charge studios ₹499/month or ₹999 for a ready-to-launch Instagram bio page + automated WhatsApp date-lock & UPI token receipt.',
    roadmap: [
      'Create visual package selector (Bridal Full Hand, Sangeet Guests, Engagement)',
      'Block booked wedding dates automatically to stop double-booking chaos',
      'Collect instant ₹500–₹1,500 UPI advance booking token with receipt',
    ],
    targetAudience: 'Mehndi artists, bridal MUAs, nail & saree-draping studios',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹699 Ready Funnel Blueprint',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-naina',
    authorName: 'Naina Kapoor',
    authorRole: 'Bridal Commerce Strategist',
    authorHandle: '@nainagifts',
    createdAt: '2026-11-14T09:40:00Z',
    upvotes: 518,
    tags: ['wedding', 'whatsapp', 'upi', 'hyperlocal'],
  },
  {
    id: 'idea-cloud-kitchen-mandi-supply',
    title: '6 AM Shared Fresh Mandi & Packaging Supply Pool for Cloud Kitchens',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Aggregates daily tomato, paneer, onion, and tamper-proof container orders from 15 nearby cloud kitchens for one wholesale Azadpur/Vashi morning drop.',
    detailedDescription:
      'Small cloud kitchens overpay 18–25% buying fragmented daily veggies and foil boxes locally while wasting 90 minutes each morning at wholesale mandis.',
    secretPitch:
      'Collect consolidated WhatsApp cut-off orders by 10 PM nightly; earn a flat 6% wholesale procurement margin + ₹150 delivery split per kitchen.',
    roadmap: [
      'Sign 12 cloud kitchens within a 3km dark-kitchen cluster',
      'Build 9 PM WhatsApp quick-reorder menu for 40 staple kitchen SKUs',
      'Operate a single 6:30 AM tempo milk-run drop with UPI daily settlement',
    ],
    targetAudience: 'Independent cloud kitchens, tiffin centers, QSR franchisees',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹1,200 Ops Playbook · 15% Equity',
    isPremium: true,
    unlockCredits: 8,
    authorId: 'author-arjun',
    authorName: 'Arjun Malhotra',
    authorRole: 'F&B Unit Economics Lead',
    authorHandle: '@arjunqsr',
    createdAt: '2026-11-13T17:10:00Z',
    upvotes: 476,
    tags: ['cloudkitchen', 'hyperlocal', 'whatsapp', 'upi'],
  },
  {
    id: 'idea-whatsapp-cod-to-upi-rto',
    title: 'WhatsApp 1-Tap COD-to-UPI ₹50 Cashback Nudge to Cut Indian D2C RTO',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Pings Cash-on-Delivery D2C buyers 10 minutes after checkout with a dynamic UPI link offering instant ₹50 off to convert prepaid before dispatch.',
    detailedDescription:
      'RTO losses on fake or impulse COD orders wipe out 20–30% of margins for emerging Indian skincare, apparel, and gadget brands.',
    secretPitch:
      'Charge D2C founders ₹15 per successfully converted prepaid order—delivering immediate ₹120+ reverse-shipping savings per conversion.',
    roadmap: [
      'Score pincode & phone RTO risk in real time on order creation',
      'Send 1-tap PhonePe/GPay UPI intent link via WhatsApp Business API',
      'Auto-update fulfillment tag to prepaid before courier pickup',
    ],
    targetAudience: 'Indian D2C brands, Meesho/Shopify sellers, boutique labels',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹1,500 Concept + Flow · 15% Equity',
    isPremium: true,
    unlockCredits: 10,
    authorId: 'author-shreya',
    authorName: 'Shreya Agarwal',
    authorRole: 'D2C Retention Architect',
    authorHandle: '@shreyad2c',
    createdAt: '2026-11-13T11:50:00Z',
    upvotes: 564,
    tags: ['d2c', 'whatsapp', 'upi'],
  },
  {
    id: 'idea-boutique-ethnicwear-whatsapp',
    title: 'Zero-App WhatsApp Saree & Kurti Video-Catalog Lookbook for Boutiques',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Turns 15-second showroom mannequin clips from Jaipur, Surat, and Kolkata boutiques into shareable 1-tap UPI checkout links.',
    detailedDescription:
      'Thousands of neighborhood ethnicwear boutiques sell 80% of inventory over Instagram Reels and WhatsApp Broadcasts but lose buyers when replying manually to 200 DMs.',
    secretPitch:
      'Offer a ₹499/month turnkey catalog storefront that works seamlessly inside in-app WhatsApp browsers on low-end Android phones.',
    roadmap: [
      'Compress vertical 15s fabric-drape videos for instant 4G loading',
      'Add blouse-size / unstitched / fall-pico customization checkboxes',
      'Integrate instant UPI payment confirmation + courier tracking link',
    ],
    targetAudience: 'Jaipur/Surat textile wholesalers, local boutiques, Instagram sellers',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹850 Full Boutique Blueprint',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-mahima',
    authorName: 'Mahima Jain',
    authorRole: 'Apparel E-commerce Lead',
    authorHandle: '@mahimafit',
    createdAt: '2026-11-12T16:30:00Z',
    upvotes: 438,
    tags: ['d2c', 'whatsapp', 'upi', 'tier2'],
  },
  {
    id: 'idea-diwali-rakhi-corporate-box',
    title: 'Modular Artisanal Mithai & Dry-Fruit Corporate Hamper Assembler',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'B2B portal letting startups and CA firms customize ₹499–₹1,499 Diwali, Rakhi, and client onboarding boxes from vetted local halwais & roasters.',
    detailedDescription:
      'HR and founders hate generic stale supermarket gift boxes yet lack time to coordinate branding sleeves, FSSAI shelf-life, and multi-address speed-post.',
    secretPitch:
      'Take a 15% wholesale curation spread with ₹250 sample tasting kits sent to 200 HR leads 45 days before Diwali & New Year.',
    roadmap: [
      'Partner with 8 regional specialty halwais, millet bakers & tea estates',
      'Build 3-step budget/box-sleeve live customizer with GST invoice',
      'Offer split multi-city employee home dispatch CSV upload',
    ],
    targetAudience: 'Startup HR teams, boutique halwais, artisanal food D2C brands',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹999 Vendor Dossier · 15% Equity',
    isPremium: true,
    unlockCredits: 7,
    authorId: 'author-devika',
    authorName: 'Devika Sharma',
    authorRole: 'Brand Partnerships Consultant',
    authorHandle: '@devikabundle',
    createdAt: '2026-11-12T09:15:00Z',
    upvotes: 344,
    tags: ['d2c', 'gst', 'hyperlocal'],
  },
  {
    id: 'idea-society-mango-coffee-groupbuy',
    title: 'Apartment Society Weekend Group-Buy for Ratnagiri Mangoes & Farm Dairy',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Lets farm-direct growers post 48-hour society group links where 15 neighbor families unlock mandi wholesale crate pricing at zero delivery fee.',
    detailedDescription:
      'Delivering single 2kg Alphonso mango or A2 ghee orders individually burns ₹120 in courier fees. Consolidated Sunday gate drops cut logistics by 75%.',
    secretPitch:
      'Give one "Society Captain" per complex 1 free crate per 15 neighbor orders—scaling purely through apartment MyGate/WhatsApp groups.',
    roadmap: [
      'Build WhatsApp-shareable society countdown group cart',
      'Auto-generate flat-number distribution sheet for Sunday 8 AM drop',
      'Onboard verified Ratnagiri, Coorg & Nashik farmer collectives',
    ],
    targetAudience: 'Farm-direct F&B brands, gated apartment residents, FPOs',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹750 Concept · 20% Equity',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-priya-ecomm',
    authorName: 'Priya Nair',
    authorRole: 'Agri-D2C Operator',
    authorHandle: '@priyadrops',
    createdAt: '2026-11-11T13:45:00Z',
    upvotes: 485,
    tags: ['d2c', 'hyperlocal', 'whatsapp', 'upi'],
  },
  {
    id: 'idea-local-bakery-custom-cake-builder',
    title: 'Live Custom Theme Cake Price & Pickup Slot Estimator for Bakeries',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Replaces endless WhatsApp back-and-forth with a 4-tap eggless weight, flavor, photo-reference upload, and ₹300 UPI advance booking widget.',
    detailedDescription:
      'Home bakers and neighborhood cake shops spend 2 hours every evening quoting 1kg fondant vs truffle prices to window shoppers.',
    secretPitch:
      'Charge home bakers ₹299/month via UPI for an Instagram-bio link that filters serious birthday/anniversary orders automatically.',
    roadmap: [
      'Configure weight (0.5kg–3kg), eggless/vegan & fondant surcharge rules',
      'Allow customer reference photo upload + cake message text preview',
      'Collect instant ₹300–₹500 UPI advance and calendar slot lock',
    ],
    targetAudience: 'Home bakers, neighborhood patisseries, custom cake studios',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹450 Full UI & Pricing Formula',
    isPremium: true,
    unlockCredits: 4,
    authorId: 'author-kritika',
    authorName: 'Kritika Joshi',
    authorRole: 'Local D2C Product Lead',
    authorHandle: '@kritikabakes',
    createdAt: '2026-11-10T17:00:00Z',
    upvotes: 319,
    tags: ['hyperlocal', 'whatsapp', 'upi'],
  },
  {
    id: 'idea-meesho-sourcing-margin-calc',
    title: 'Meesho, Flipkart & Amazon Fee-Slab True Profit Calculator for Sellers',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Factors in shipping weight slabs, 18% GST on marketplace commission, ad ACOS, and expected return losses before listing a ₹299–₹999 SKU.',
    detailedDescription:
      'First-time sellers from Surat, Panipat, and Tirupur price kurtis and bedsheets too low and discover net losses only after monthly settlements arrive.',
    secretPitch:
      'Give a free web calculator to rank on seller YouTube tutorials; upsell ₹399/month bulk settlement PDF reconciliation.',
    roadmap: [
      'Map latest Meesho, Amazon EasyShip & Flipkart weight/zone fee slabs',
      'Simulate net pocket payout across 5%–35% RTO return scenarios',
      'Highlight exact GST input-tax credit recovery per SKU',
    ],
    targetAudience: 'Tier-2/3 Meesho, Flipkart & Amazon India sellers',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹599 Concept · 20% Rev Share',
    isPremium: true,
    unlockCredits: 4,
    authorId: 'author-sanjana',
    authorName: 'Sanjana Verma',
    authorRole: 'Marketplace Growth Lead',
    authorHandle: '@sanjanamp',
    createdAt: '2026-11-10T08:25:00Z',
    upvotes: 407,
    tags: ['d2c', 'gst', 'tier2'],
  },
  {
    id: 'idea-tiffin-home-chef-network',
    title: 'FSSAI-Checked Maa-Ke-Haath Tiffin Subscription Hub for PGs & Offices',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Connects verified home kitchens within 2km of IT parks & coaching hubs with flexible WhatsApp "Pause Today" lunch/dinner passes.',
    detailedDescription:
      'PG students and solo professionals crave clean ghar-ka-khana over oily restaurant thalis, while home chefs struggle with messy manual dabba skip tracking.',
    secretPitch:
      'Charge ₹150 onboarding + ₹15 per delivered tiffin using fixed 12:30 PM & 8:00 PM batched two-wheeler loops.',
    roadmap: [
      'Build 1-tap morning WhatsApp "Skip/Extra Meal" bot',
      'Standardize weekly kitchen hygiene photo audit badges',
      'Manage weekly ₹750–₹1,500 UPI meal pass renewals automatically',
    ],
    targetAudience: 'PG residents, IT park workers, verified home chefs',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹999 Playbook · 15% Equity',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-deepa',
    authorName: 'Deepa Joshi',
    authorRole: 'Community Food Operator',
    authorHandle: '@deepatiffin',
    createdAt: '2026-11-09T12:40:00Z',
    upvotes: 509,
    tags: ['cloudkitchen', 'hyperlocal', 'whatsapp', 'upi'],
  },
  {
    id: 'idea-kirana-expiry-flash-deals',
    title: 'Near-Expiry 40% Off Neighborhood Flash Broadcast for Supermarts',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Helps local mini-supermarkets clear yogurt, bread, paneer, and snacks 5 days before expiry via an opt-in 1km society WhatsApp broadcast.',
    detailedDescription:
      'Independent neighborhood supermarkets throw away ₹15,000–₹35,000 monthly in short-shelf-life dairy and bakery inventory.',
    secretPitch:
      'Charge stores ₹399/month—1 single evening broadcast recovers 10x the subscription in rescued inventory.',
    roadmap: [
      'Snap barcode + expiry date to auto-generate 40% off WhatsApp flyer',
      'Limit deal claims to first-come UPI pre-booking or 7 PM pickup',
      'Track total monthly rescued rupee value for store owners',
    ],
    targetAudience: 'Local mini-marts, organic grocers, neighborhood bakeries',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: 'Open Brief · ₹0 Unlock · 15% Rev Share',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'author-aman',
    authorName: 'Aman Bansal',
    authorRole: 'Retail Ops Engineer',
    authorHandle: '@amanretail',
    createdAt: '2026-11-08T10:15:00Z',
    upvotes: 243,
    tags: ['kirana', 'whatsapp', 'hyperlocal'],
  },
  {
    id: 'idea-jewellery-try-on-video-link',
    title: 'Private Imitation & Silver Jewellery Video-Call & UPI Hold Desk',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Lets regional kundan, oxidised & 925 silver shops host 10-minute scheduled WhatsApp video try-ons for festive buyers with instant ₹500 hold links.',
    detailedDescription:
      'Bridal and festive shoppers hesitate to spend ₹1,500–₹8,000 from static photos alone and want to see earring weight and shine on video.',
    secretPitch:
      'Charge jewellery boutiques ₹799/month for slot booking + auto-deductible ₹250 UPI video-consult token to filter time-wasters.',
    roadmap: [
      'Embed 10-min live showroom slot picker on Instagram & website',
      'Collect refundable ₹250 UPI deposit credited to final jewellery bill',
      'Send 1-tap WhatsApp cart link for selected pieces post-call',
    ],
    targetAudience: 'Imitation/silver jewellers, Jaipur/Delhi bridal shops',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹750 Concept & Checkout Spec',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-kavya',
    authorName: 'Kavya Subramanian',
    authorRole: 'D2C Brand Advisor',
    authorHandle: '@kavyabrand',
    createdAt: '2026-11-07T15:30:00Z',
    upvotes: 194,
    tags: ['d2c', 'wedding', 'whatsapp', 'upi'],
  },
  {
    id: 'idea-ayurveda-dosha-whatsapp-quiz',
    title: 'Hindi/English Prakriti Quiz & Refill Reminder Bot for Ayurveda D2C',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      '3-minute conversational WhatsApp dosha assessment recommending personalized churnas/oils with Day-25 automated UPI refill nudges.',
    detailedDescription:
      'Indian hair-oil, gut-health, and Ayurvedic skincare brands acquire customers expensively on Meta ads but fail to drive Month-2 repeat orders.',
    secretPitch:
      'Price at ₹999/month per D2C store + 2% on WhatsApp-triggered Day-25 repeat orders.',
    roadmap: [
      'Build 7-question mobile-friendly Prakriti & hair/skin quiz',
      'Match answers to 3-SKU curated starter kits under ₹999',
      'Trigger Day-25 1-tap UPI repeat order reminder',
    ],
    targetAudience: 'Ayurvedic D2C startups, wellness clinics, herbal brands',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹1,100 Blueprint · 12% Equity',
    isPremium: true,
    unlockCredits: 7,
    authorId: 'author-riya',
    authorName: 'Riya Chatterjee',
    authorRole: 'D2C Growth Strategist',
    authorHandle: '@riyagrowth',
    createdAt: '2026-11-06T09:55:00Z',
    upvotes: 286,
    tags: ['d2c', 'whatsapp', 'hindi', 'upi'],
  },
  {
    id: 'idea-tirupur-micro-batch-merch',
    title: '50-Piece Low-MOQ Tirupur Heavy-GSM Merch Drop Engine for Clubs',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Lets Indian college fests, developer meetups, and creators launch 7-day pre-order hoodie drops sourced straight from Tirupur factories.',
    detailedDescription:
      'College clubs and indie creators collect messy Google Forms + UPI screenshots and still end up stuck with leftover sizes.',
    secretPitch:
      'Take a flat ₹60 per hoodie orchestration margin; factory ships straight once the 50-order minimum clears via UPI.',
    roadmap: [
      'Standardize 380GSM oversized tee & hoodie size charts',
      'Launch 7-day pre-order page with auto-refund if MOQ misses',
      'Connect 4 verified Tirupur screen-print & puff-print units',
    ],
    targetAudience: 'College cultural clubs, tech communities, Indian creators',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹699 Concept · 18% Equity',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-yash',
    authorName: 'Yashwant Rao',
    authorRole: 'Campus Ops Builder',
    authorHandle: '@yashcampus',
    createdAt: '2026-11-05T14:15:00Z',
    upvotes: 352,
    tags: ['d2c', 'student', 'upi'],
  },
  {
    id: 'idea-dark-store-pincode-watch',
    title: 'Blinkit, Zepto & Instamart Pincode Stockout Alert for Indian D2C',
    category: IdeaCategory.LOCAL_D2C,
    summary:
      'Checks SKU stock and search rank across top Indian metro dark-store pincodes every morning and sends instant WhatsApp restock alerts.',
    detailedDescription:
      'Emerging snack, beverage, and grooming D2C brands lose prime weekend impulse orders whenever top dark stores silently go out of stock.',
    secretPitch:
      'Charge D2C ops managers ₹1,499/month for morning WhatsApp priority replenishment alerts across 100 metro pincodes.',
    roadmap: [
      'Monitor dark-store SKU availability across top 8 Indian metro clusters',
      'Estimate daily lost sales per stockout hub',
      'Send 8 AM WhatsApp summary sheet to warehouse dispatchers',
    ],
    targetAudience: 'Indian FMCG & quick-commerce D2C founders',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹1,350 Complete Spec & Alert Logic',
    isPremium: true,
    unlockCredits: 9,
    authorId: 'author-rohan-qcom',
    authorName: 'Rohan Malhotra',
    authorRole: 'Quick-Commerce Growth Lead',
    authorHandle: '@rohanqcom',
    createdAt: '2026-11-04T09:30:00Z',
    upvotes: 416,
    tags: ['d2c', 'whatsapp', 'hyperlocal'],
  },

  // =====================================================================
  // 3. STUDENT & EDTECH HACKS (15)
  // =====================================================================
  {
    id: 'idea-cbse-handwritten-notes-hub',
    title: 'Peer-to-Peer CBSE & NCERT Handwritten Notes Exchange Marketplace',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Lets board toppers & coaching rankers sell scanned color-coded Class 10/12 NCERT notes, mind-maps, and formula sheets for ₹49–₹199.',
    detailedDescription:
      'Students spend months hunting messy Telegram channels for neat NCERT Biology diagrams, Organic Chemistry reaction charts, and History timelines before board exams.',
    secretPitch:
      'Pay toppers 75% instant UPI royalty on every ₹99 pack sold; watermark buyer phone numbers onto PDFs and acquire via Class 10/12 YouTube one-shot channels.',
    roadmap: [
      'Verify sample 3-page preview quality & NCERT chapter tagging',
      'Add instant ₹49–₹199 UPI checkout with watermarked PDF delivery',
      'Onboard 100 school/coaching toppers ahead of pre-board season',
    ],
    targetAudience: 'Class 9–12 CBSE/ICSE students and board toppers',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹899 Blueprint · 20% Co-Founder Equity',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-ankita',
    authorName: 'Ankita Singh',
    authorRole: 'EdTech Community Builder',
    authorHandle: '@ankitanotes',
    createdAt: '2026-11-14T13:20:00Z',
    upvotes: 558,
    tags: ['student', 'cbse', 'upi', 'hindi'],
  },
  {
    id: 'idea-tier2-vernacular-coding-cohort',
    title: '₹499 Weekend Hindi/Hinglish Coding & AI Bootcamp for Tier-2/3 Cities',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Pocket-friendly live weekend cohorts teaching college students in Jaipur, Bhopal, Patna & Ranchi how to ship real React/Python projects in Hinglish.',
    detailedDescription:
      'Tier-2/3 B.Tech and BCA students cannot afford ₹60,000 placement bootcamps and tune out fast-paced English theory lectures.',
    secretPitch:
      'Run ₹499 4-weekend build sprints mentored by working Tier-2 alumni engineers; monetize top 10% grads via local SME internship placement packs.',
    roadmap: [
      'Design 4 Hinglish hands-on weekend build modules (Portfolio, UPI App, AI Bot)',
      'Pair local alumni mentors per 25-student Discord/WhatsApp pod',
      'Issue GitHub-verified shipped project certificates',
    ],
    targetAudience: 'Tier-2/3 B.Tech, BCA, B.Sc students & alumni mentors',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹750 Curriculum Spec · 20% Rev Share',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-arunabh',
    authorName: 'Arunabh Sen',
    authorRole: 'Hinglish Dev Educator',
    authorHandle: '@arunabhdev',
    createdAt: '2026-11-14T08:15:00Z',
    upvotes: 512,
    tags: ['student', 'tier2', 'hindi', 'upi'],
  },
  {
    id: 'idea-teen-pocket-money-gigs',
    title: 'Verified Pocket-Money Micro-Gig Board for College & Teen Creators',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Matches Indian college students with vetted ₹250–₹1,500 micro-tasks: Reel subtitling, Canva carousels, notes digitizing, and campus mystery audits.',
    detailedDescription:
      'Indian students want ₹3,000–₹8,000/month pocket money without falling into Telegram deposit scams, while D2C startups need affordable fast creative help.',
    secretPitch:
      'Require college ID verification and pre-fund every gig via UPI escrow before work starts—charging businesses a 12% platform fee.',
    roadmap: [
      'Build 60-second college ID verification & skill sample profile',
      'List fixed-price ₹250–₹1,500 micro-gigs with milestone UPI escrow',
      'Seed 30 Indian D2C & creator studios for day-1 paid tasks',
    ],
    targetAudience: 'Indian college students, young creators, indie startups',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹1,250 Concept · 15% Equity',
    isPremium: true,
    unlockCredits: 8,
    authorId: 'author-yash',
    authorName: 'Yashwant Rao',
    authorRole: 'Campus Ops Builder',
    authorHandle: '@yashcampus',
    createdAt: '2026-11-13T15:50:00Z',
    upvotes: 496,
    tags: ['student', 'upi', 'd2c'],
  },
  {
    id: 'idea-jee-neet-mistake-notebook',
    title: 'JEE & NEET Mock-Test Mistake Tracker & Revision Flashcard Bot',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Snaps photos of wrong coaching test questions to build a personalized Sunday WhatsApp revision deck with NCERT page references.',
    detailedDescription:
      'Aspirants take 40+ Allen/PW/Aakash mock tests yet repeat the exact same Physics and Organic Chemistry conceptual traps on exam day.',
    secretPitch:
      'Free up to 30 saved questions; charge ₹199 per exam season (6 months) via student UPI.',
    roadmap: [
      'OCR-crop wrong MCQ photos and tag NCERT chapter + mistake type',
      'Push 10 spaced-repetition WhatsApp revision cards every Sunday morning',
      'Generate pre-exam "Top 50 Personal Trap Questions" printable PDF',
    ],
    targetAudience: 'JEE, NEET, CUET, and NDA aspirants',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹950 Blueprint & Prompt Flow',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-prateek',
    authorName: 'Prateek Bansal',
    authorRole: 'Kota EdTech Alumnus',
    authorHandle: '@prateekjee',
    createdAt: '2026-11-13T09:10:00Z',
    upvotes: 461,
    tags: ['student', 'cbse', 'whatsapp', 'upi'],
  },
  {
    id: 'idea-hostel-semester-luggage-vault',
    title: '₹399/Box Hostel Semester-Break Luggage Pickup & Storage Vault',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Insured campus pickup of student trunks, coolers, and mattresses during summer break with guaranteed hostel room drop when college reopens.',
    detailedDescription:
      'Outstation hostelers struggle hauling heavy suitcases on trains or paying full empty PG rent over 2-month summer vacations.',
    secretPitch:
      'Appoint 2 hostel block ambassadors per campus during May finals—collect 300+ boxes per campus with zero paid ads.',
    roadmap: [
      'Supply barcoded tamper-seal cartons & QR luggage tags',
      'Schedule block-wise pickup slots with ₹399/box UPI checkout',
      'Store in insured peripheral godown 12km outside university town',
    ],
    targetAudience: 'IIT/NIT/private hostel students across India',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹650 Campus Ops Playbook · 20% Equity',
    isPremium: true,
    unlockCredits: 4,
    authorId: 'author-pranav',
    authorName: 'Pranav Joshi',
    authorRole: 'Student Logistics Planner',
    authorHandle: '@pranavcrdt',
    createdAt: '2026-11-12T12:00:00Z',
    upvotes: 382,
    tags: ['student', 'hyperlocal', 'upi'],
  },
  {
    id: 'idea-kota-delhi-pg-verified-finder',
    title: 'Zero-Broker Verified PG, Mess Food & Roommate Match for Freshers',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Crowdsourced fresher portal rating PG electricity charges, Wi-Fi speed, warden rules, and real mess thali photos in Kota, Mukherjee Nagar & Pune.',
    detailedDescription:
      'Parents and freshers get trapped by glossy broker photos and hidden ₹12/unit AC electricity markups when relocating to coaching/college hubs.',
    secretPitch:
      'Charge PG owners ₹999/month for verified availability badges + zero-broker ₹499 direct bed-lock token via UPI.',
    roadmap: [
      'Collect verified current-resident video tours & electricity bill proofs',
      'Add study-schedule & smoking/veg roommate compatibility filters',
      'Enable direct owner WhatsApp visit scheduling without brokers',
    ],
    targetAudience: 'Incoming college freshers, UPSC/JEE aspirants, parents',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹1,150 Concept · 15% Equity',
    isPremium: true,
    unlockCredits: 7,
    authorId: 'author-manish',
    authorName: 'Manish Tiwari',
    authorRole: 'Student Housing Researcher',
    authorHandle: '@manishpg',
    createdAt: '2026-11-11T16:40:00Z',
    upvotes: 439,
    tags: ['student', 'hyperlocal', 'tier2', 'upi'],
  },
  {
    id: 'idea-upsc-pib-hindi-briefs',
    title: '5-Minute Bilingual UPSC/State PCS Current Affairs & PIB Audio Digest',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Distills daily PIB releases, RBI circulars, and editorials into exam-tagged Hindi & English 5-minute audio briefs + GS Mains bullet notes.',
    detailedDescription:
      'Aspirants waste 3 hours every morning reading full newspapers and bulky monthly coaching PDFs without retaining Mains-ready facts.',
    secretPitch:
      'Give daily morning Telegram audio free; sell ₹199/month GS-paper-indexed revision flashcards & Prelims practice quizzes.',
    roadmap: [
      'Tag daily news cleanly to GS1/GS2/GS3/GS4 syllabus topics',
      'Publish crisp 5-minute Hindi & English commute audio tracks by 7 AM',
      'Export Sunday weekly 30-MCQ Prelims sprint test',
    ],
    targetAudience: 'UPSC, UPPSC, BPSC, RAS & SSC aspirants',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: 'Open Brief · ₹0 Unlock · 20% Rev Share',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'author-divya',
    authorName: 'Divya Iyer',
    authorRole: 'Civil Services Content Lead',
    authorHandle: '@divyaupsc',
    createdAt: '2026-11-11T07:50:00Z',
    upvotes: 328,
    tags: ['student', 'hindi', 'tier2'],
  },
  {
    id: 'idea-viva-lab-manual-ai-prep',
    title: 'University Lab Viva & Practical Exam Simulator for B.Tech / B.Sc',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Reads your uploaded AKTU, VTU, SPPU, or Mumbai University practical file and grills you with likely external examiner viva questions.',
    detailedDescription:
      'Engineering and science students panic before external practical vivas because textbook theory differs from lab-table viva questions.',
    secretPitch:
      'Charge ₹149 per semester exam pass via UPI—shared virally across college branch WhatsApp groups the night before lab exams.',
    roadmap: [
      'Index syllabus practicals across top 8 Indian state technical universities',
      'Generate crisp 2-line verbal answers + circuit/code troubleshooting cues',
      'Include voice-practice mode for shy regional-medium students',
    ],
    targetAudience: 'B.Tech, Diploma, BCA, and B.Sc university students',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹499 Full Product Spec',
    isPremium: true,
    unlockCredits: 4,
    authorId: 'author-siddharth',
    authorName: 'Siddharth Gupta',
    authorRole: 'Campus EdTech Developer',
    authorHandle: '@sidcampus',
    createdAt: '2026-11-10T14:20:00Z',
    upvotes: 395,
    tags: ['student', 'tier2', 'upi'],
  },
  {
    id: 'idea-secondhand-books-drafter-olx',
    title: 'Campus-Gate Exchange for Engineering Drafters, Lab Coats & Textbooks',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Zero-shipping hostel marketplace for seniors to pass on ₹2,000+ textbooks, calculators, and ED drafters to juniors for ₹300–₹800.',
    detailedDescription:
      'Every June, graduating seniors throw away expensive Lakshmi/MadeEasy books and calculators while incoming first-years buy brand-new MRP copies.',
    secretPitch:
      'Verify campus enrollment via `.edu`/college ID and charge a flat ₹25 UPI handshake fee per completed campus pickup.',
    roadmap: [
      'Organize listings strictly by university, branch, and semester number',
      'Generate pre-filled semester "Senior Starter Bundles" at 65% off MRP',
      'Coordinate same-hostel canteen meetup slots',
    ],
    targetAudience: 'College freshers, graduating seniors, coaching hostel students',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: 'Open Brief · ₹0 Unlock · 15% Rev Share',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'author-tanvi',
    authorName: 'Tanvi Bhardwaj',
    authorRole: 'Campus Product Designer',
    authorHandle: '@tanvicampus',
    createdAt: '2026-11-09T11:10:00Z',
    upvotes: 214,
    tags: ['student', 'hyperlocal', 'upi'],
  },
  {
    id: 'idea-scholarship-scheme-matcher',
    title: 'State & Central Student Scholarship Eligibility & Document Tracker',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Matches Indian school and college students with 300+ NSP, state, and CSR scholarships (Reliance, Tata, HDFC) before deadlines close.',
    detailedDescription:
      'Lakhs of eligible Tier-2/3 and rural students miss ₹10,000–₹50,000 annual scholarships simply because portals are scattered and income/caste affidavit deadlines slip.',
    secretPitch:
      'Free eligibility scan; charge ₹150 for verified document checklist + WhatsApp deadline countdown reminders.',
    roadmap: [
      'Index state, central NSP, and corporate CSR scholarships by income/marks',
      'Flag required domicile, income certificate, and bank-seeding gaps early',
      'Send Hindi/English WhatsApp alerts 7 days before closing',
    ],
    targetAudience: 'Class 10–12 & UG students across Tier-2/3 cities and rural India',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹550 Database & Flow Spec',
    isPremium: true,
    unlockCredits: 4,
    authorId: 'author-ashok',
    authorName: 'Ashok Verma',
    authorRole: 'Public-Access EdTech Lead',
    authorHandle: '@ashokgov',
    createdAt: '2026-11-08T15:05:00Z',
    upvotes: 347,
    tags: ['student', 'tier2', 'hindi', 'whatsapp'],
  },
  {
    id: 'idea-spoken-english-interview-saathi',
    title: 'Judgment-Free Hinglish-to-English Placement Interview Voice Coach',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Lets Tier-2/3 final-year students practice HR & technical interviews on WhatsApp/web voice notes with gentle pronunciation and framing tips.',
    detailedDescription:
      'Strong coders from non-English-medium schools fail campus HR rounds due to stage fright and hesitation—not lack of technical skill.',
    secretPitch:
      'Sell ₹299 30-day placement sprint passes via UPI, promoted through campus Training & Placement (T&P) student coordinators.',
    roadmap: [
      'Design 40 TCS/Infosys/startup mock HR & project-walkthrough prompts',
      'Give encouraging Hinglish feedback on filler words and sentence clarity',
      'Track 14-day confidence streak for campus placement prep',
    ],
    targetAudience: 'Final-year B.Tech/MBA/B.Com students in Tier-2/3 colleges',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹899 Concept · 15% Equity',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-radhika',
    authorName: 'Radhika Menon',
    authorRole: 'Career Readiness Coach',
    authorHandle: '@radhikacareers',
    createdAt: '2026-11-07T09:40:00Z',
    upvotes: 422,
    tags: ['student', 'tier2', 'hindi', 'whatsapp'],
  },
  {
    id: 'idea-olympiad-abacus-worksheet-gen',
    title: 'Printable SOF Olympiad, Sainik School & Navodaya Practice Pack App',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Generates fresh Class 3–8 Maths/Science Olympiad and JNV entrance worksheets in Hindi & English for local tuition teachers and parents.',
    detailedDescription:
      'Millions of Indian parents buy static guides for SOF/Navodaya/Sainik exams while local home tutors spend Sunday nights hand-typing practice sheets.',
    secretPitch:
      'Sell ₹199 monthly printable PDF packs to parents and ₹499/month white-label coaching-name header packs to neighborhood tuition teachers.',
    roadmap: [
      'Build randomized question banks matching SOF, JNVST & Sainik blueprints',
      'Stamp tutor coaching center name & phone number cleanly on PDF headers',
      'Deliver instant OMR answer-key sheets via WhatsApp',
    ],
    targetAudience: 'Neighborhood tuition teachers, primary parents, rural coaching centers',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹650 Full Generator Blueprint',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-meera',
    authorName: 'Meera Deshmukh',
    authorRole: 'K-8 Curriculum Designer',
    authorHandle: '@meerak8',
    createdAt: '2026-11-06T12:15:00Z',
    upvotes: 268,
    tags: ['cbse', 'student', 'tier2', 'hindi'],
  },
  {
    id: 'idea-internship-proof-portfolio-club',
    title: 'Weekend Proof-of-Work Micro-Project Sprints for Freshers',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      '48-hour ₹199 weekend challenges where students solve real tasks for Indian startups (redesign a checkout, write 5 SQL queries) to earn verified badges.',
    detailedDescription:
      'Freshers get ghosted on job portals because 500 resumes look identical with cloned Netflix/Spotify tutorials.',
    secretPitch:
      'Charge students ₹199 per evaluated weekend challenge; charge early-stage Indian startups ₹1,500 to hire directly from top scorers.',
    roadmap: [
      'Partner with 10 Indian SaaS/D2C founders to publish real mini-briefs',
      'Score submissions publicly with rubric feedback from industry mentors',
      'Generate shareable LinkedIn proof-of-work case study cards',
    ],
    targetAudience: 'College freshers, career switchers, early-stage Indian startups',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹799 Concept · 20% Equity',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-tarun',
    authorName: 'Tarun Nair',
    authorRole: 'Engineering Hiring Mentor',
    authorHandle: '@tarunqa',
    createdAt: '2026-11-05T08:30:00Z',
    upvotes: 311,
    tags: ['student', 'upi', 'd2c'],
  },
  {
    id: 'idea-college-fest-sponsor-kit',
    title: 'Turnkey Sponsor Deck & Footfall Proof Portal for College Cultural Fests',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Helps student fest committees turn messy Word proposals into verified campus demographic decks that close ₹15,000–₹1,50,000 local brand stalls.',
    detailedDescription:
      'Hundreds of Indian college fests fail to convert D2C beverage, telecom, and coaching sponsors because student clubs lack standardized ROI metrics.',
    secretPitch:
      'Free deck builder for fest secretaries; take 8% commission on local stall & title sponsorships closed through the portal.',
    roadmap: [
      'Pre-fill verified university student count, fest footfall & stall tiers',
      'Add QR-verified footfall & coupon scan reporting for sponsors',
      'Connect regional D2C & EdTech marketing managers looking for campus activations',
    ],
    targetAudience: 'College fest committees, campus ambassadors, youth marketers',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹500 Blueprint · 15% Rev Share',
    isPremium: true,
    unlockCredits: 3,
    authorId: 'author-kabir-campus',
    authorName: 'Kabir Malhotra',
    authorRole: 'Youth Marketing Lead',
    authorHandle: '@kabirfests',
    createdAt: '2026-11-03T15:20:00Z',
    upvotes: 179,
    tags: ['student', 'd2c', 'hyperlocal'],
  },
  {
    id: 'idea-ca-cs-article-tracker',
    title: 'CA/CS Articleship Prep, Stipend Benchmark & Mock Audit Diary',
    category: IdeaCategory.STUDENT_EDTECH,
    summary:
      'Peer-reviewed directory of Indian CA firms ranked by real articleship stipend, exam leave policy, and GST/Stat audit exposure.',
    detailedDescription:
      'CA Intermediate pass-outs pick articleship firms blindly via word-of-mouth and end up stuck with unpaid overtime or denied Final exam study leave.',
    secretPitch:
      'Charge ₹299 for verified firm dossier + mock Big-4/mid-size interview kit ahead of ICAI result days.',
    roadmap: [
      'Crowdsource anonymized ICAI firm stipend & study-leave ratings',
      'Include Tally, GST portal & Excel VLOOKUP practical test prep',
      'Launch spike campaign right on CA Inter result week',
    ],
    targetAudience: 'CA & CS Intermediate students across India',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹700 Niche Community Blueprint',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-vivek',
    authorName: 'Vivek Sundaram',
    authorRole: 'Chartered Accountant & Mentor',
    authorHandle: '@vivekfinops',
    createdAt: '2026-11-02T11:40:00Z',
    upvotes: 289,
    tags: ['student', 'gst', 'tier2'],
  },

  // =====================================================================
  // 4. LOCAL SERVICES & AUTOMATION (15)
  // =====================================================================
  {
    id: 'idea-chai-tapri-qr-menu',
    title: 'QR-Code Digital Menu, Table Order & Feedback Loop for Cafes & Tapris',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Zero-app laminated table QR sticker letting roadside cafes, chai addas, and student hangouts take orders, UPI payments, and instant 1-tap feedback.',
    detailedDescription:
      'Small cafes and bustling chai-maggi joints lose repeat evening rush orders when 1 waiter juggles 12 tables, while paper menus tear every week.',
    secretPitch:
      'Print and ship 10 weatherproof table QR stickers free on signup; charge the cafe ₹199/month via UPI for live kitchen ticket sound alerts & menu edits.',
    roadmap: [
      'Build 2-second mobile QR menu loading cleanly on 4G without app install',
      'Add direct UPI QR pay + "Extra Adrak / Less Sugar" modifier chips',
      'Trigger private WhatsApp alert to owner if customer taps a 1-2 star rating',
    ],
    targetAudience: 'Roadside cafes, chai tapris, college canteens, small dhabas',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹999 Full Stack Spec · 20% Equity',
    isPremium: true,
    unlockCredits: 7,
    authorId: 'author-rohan-craft',
    authorName: 'Rohan Kulkarni',
    authorRole: 'Local Hospitality Builder',
    authorHandle: '@rohancafe',
    createdAt: '2026-11-14T14:40:00Z',
    upvotes: 576,
    tags: ['qr', 'upi', 'hyperlocal', 'whatsapp'],
    coverImage: '/images/spotlight-ai-automation.jpg',
  },
  {
    id: 'idea-small-shop-gst-billing-plugin',
    title: '1-Tap WhatsApp Invoice & Automated GST Billing Plugin for Small Shops',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Lightweight thermal/WhatsApp GST bill generator and monthly GSTR-1 Excel exporter built for hardware, mobile, pharmacy, and garment shops.',
    detailedDescription:
      'Small shopkeepers dread bloated desktop accounting software and still scribble kachcha bills, paying CAs extra penalties for mismatched HSN slabs.',
    secretPitch:
      'Give shopkeepers free kachcha-to-pucca WhatsApp PDF receipts; charge ₹249/month for 1-click CA-ready GSTR-1 & GSTR-3B WhatsApp export.',
    roadmap: [
      'Pre-load top 1,500 Indian retail HSN/GST slabs (5%, 12%, 18%, 28%)',
      'Support 58mm Bluetooth thermal printer + instant WhatsApp PDF receipt',
      'Distribute via regional CA offices managing 100+ local dukandars',
    ],
    targetAudience: 'Small retail shops, mobile stores, hardware & garment dealers',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹1,400 Blueprint · 15% Equity',
    isPremium: true,
    unlockCredits: 9,
    authorId: 'author-harsh',
    authorName: 'Harshvardhan Patel',
    authorRole: 'SME FinOps Consultant',
    authorHandle: '@harshtally',
    createdAt: '2026-11-14T10:05:00Z',
    upvotes: 534,
    tags: ['gst', 'whatsapp', 'upi', 'kirana'],
  },
  {
    id: 'idea-voice-tally-gst-bot',
    title: 'Hinglish Voice-Note-to-Tally Voucher Bot for Mandi Traders',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Lets grain, cloth, and auto-parts traders speak Hindi/Gujarati/Marathi invoice notes on WhatsApp to generate Tally-ready GST entries.',
    detailedDescription:
      'Busy wholesale dukandars wrap up at 9 PM and avoid sitting at desktops to key 60 daily credit bills into TallyPrime.',
    secretPitch:
      'Partner with Tally Certified Partners in Indore, Surat, and Ludhiana—share ₹150/month recurring commission per trader.',
    roadmap: [
      'Train dialect parser for Indian units (quintal, peti, dozen, nag)',
      'Auto-match party ledger GSTIN and confirm via WhatsApp reply',
      'Sync approved XML vouchers directly to shop TallyPrime',
    ],
    targetAudience: 'Mandi wholesalers, textile traders, SME accountants',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: '₹1,150 Spec · 20% Revenue Share',
    isPremium: true,
    unlockCredits: 8,
    authorId: 'author-neeraj',
    authorName: 'Neeraj Kulkarni',
    authorRole: 'SME Automation Architect',
    authorHandle: '@neerajpay',
    createdAt: '2026-11-13T16:45:00Z',
    upvotes: 478,
    tags: ['gst', 'whatsapp', 'hindi', 'tier2'],
  },
  {
    id: 'idea-used-car-scooty-pdi-check',
    title: 'On-Demand Used Car & Two-Wheeler PDI Mechanic Booking Desk',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Books a vetted city mechanic with OBD2 scanner & paint gauge for ₹799–₹1,499 pre-delivery checks before buying used cars or showroom bikes.',
    detailedDescription:
      'First-time buyers get burned by tampered odometers, flood-damaged engines, and repainted showroom display vehicles.',
    secretPitch:
      'Acquire buyers via local city Reddit/car YouTuber integrations; collect ₹999 via UPI and pay senior freelance mechanics ₹600 per 45-min check.',
    roadmap: [
      'Build 120-point mobile photo + OBD fault-code inspector checklist',
      'Instant WhatsApp PDF "Buy / Negotiate / Walk Away" scorecard',
      'Launch in Pune, Delhi NCR, and Bengaluru with 10 vetted mechanics',
    ],
    targetAudience: 'Used car/bike buyers, new showroom delivery buyers',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹1,200 Ops & Checklist Buyout',
    isPremium: true,
    unlockCredits: 8,
    authorId: 'author-sameer',
    authorName: 'Sameer Kulkarni',
    authorRole: 'Automotive Diagnostics Lead',
    authorHandle: '@sameerpdi',
    createdAt: '2026-11-13T11:20:00Z',
    upvotes: 445,
    tags: ['hyperlocal', 'upi', 'whatsapp'],
  },
  {
    id: 'idea-rwa-society-maintenance-audit',
    title: 'Apartment RWA Diesel-Generator & Sub-Meter Leak Detector',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Audits monthly apartment society electricity & water sub-meter CSVs to catch faulty dual-source DG billing and unpaid flat arrears automatically.',
    detailedDescription:
      'Gated societies lose ₹40,000–₹1,50,000 yearly to misconfigured DG tariff splits and unbilled vacant-flat meters, sparking resident WhatsApp fights.',
    secretPitch:
      'Sell ₹999/month per apartment tower directly to RWA Treasurers by offering a free 1-month past bill leak audit.',
    roadmap: [
      'Import prepaid smart-meter exports & common DISCOM bill totals',
      'Flag anomalous zero-read occupied flats and tariff mismatch spikes',
      'Generate transparent WhatsApp-ready monthly RWA resident summaries',
    ],
    targetAudience: 'Gated society RWA treasurers and estate managers',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹850 Concept · 15% Equity',
    isPremium: true,
    unlockCredits: 6,
    authorId: 'author-aman',
    authorName: 'Aman Bansal',
    authorRole: 'PropTech Ops Engineer',
    authorHandle: '@amanproptech',
    createdAt: '2026-11-12T15:10:00Z',
    upvotes: 294,
    tags: ['hyperlocal', 'gst', 'whatsapp'],
  },
  {
    id: 'idea-neighborhood-clinic-whatsapp-queue',
    title: 'Zero-App WhatsApp Token & Live Queue Tracker for Local Clinics',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Replaces crowded doctor waiting rooms by letting patients scan a clinic QR to grab a token and get a WhatsApp ping when 2 patients are ahead.',
    detailedDescription:
      'Neighborhood pediatricians, dentists, and ENT clinics have 90-minute evening queues where sick patients sit cramped in small waiting rooms.',
    secretPitch:
      'Charge clinics ₹499/month via UPI—compounder taps one button on a phone browser to advance tokens and send automated WhatsApp alerts.',
    roadmap: [
      'Build 1-button receptionist live token board + QR check-in',
      'Auto-ping patients via WhatsApp when their turn is 10 mins away',
      'Add automated post-visit Google Review & 7-day follow-up link',
    ],
    targetAudience: 'Independent clinics, dental practices, diagnostic centers',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹999 Blueprint · 20% Equity',
    isPremium: true,
    unlockCredits: 7,
    authorId: 'author-kabir',
    authorName: 'Dr. Kabir Sethi',
    authorRole: 'Clinical Operations Advisor',
    authorHandle: '@kabirhealth',
    createdAt: '2026-11-12T08:45:00Z',
    upvotes: 504,
    tags: ['qr', 'whatsapp', 'hyperlocal', 'upi'],
  },
  {
    id: 'idea-salon-offpeak-flash-deals',
    title: 'Tue–Thu Afternoon Salon & Parlour Empty-Chair Flash Pass',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Fills dead Tuesday–Thursday 11 AM–4 PM chairs at local salons with 35% off ₹199–₹999 grooming combos for nearby students & WFH folks.',
    detailedDescription:
      'Neighborhood salons pay full stylist salaries and AC bills while 70% of chairs sit empty on weekday afternoons.',
    secretPitch:
      'Zero listing fee—collect a ₹99 UPI slot booking fee from customers while salons keep 100% of walk-in service upsells.',
    roadmap: [
      'Give salon owners a 2-tap afternoon flash-slot publisher',
      'Broadcast verified neighborhood deals within 2.5km radius',
      'Prevent no-shows with ₹99 UPI booking commitment',
    ],
    targetAudience: 'Local salons, beauty parlours, WFH professionals & students',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: 'Open Brief · ₹0 Unlock · 20% Fee Share',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'author-pooja',
    authorName: 'Pooja Bhatia',
    authorRole: 'Local Commerce Strategist',
    authorHandle: '@poojalocal',
    createdAt: '2026-11-11T10:30:00Z',
    upvotes: 256,
    tags: ['hyperlocal', 'upi', 'student'],
  },
  {
    id: 'idea-pre-monsoon-ac-plumbing-pass',
    title: '₹999/Year Society Flat Plumbing, MCB & AC Preventive Checkup Camp',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Weekend society-wide preventive maintenance camp bundling tap washer fixes, AC jet wash, and earthing/MCB load checks before peak summer.',
    detailedDescription:
      'Homeowners pay ₹500–₹1,200 emergency callout fees every time a concealed pipe drips or an AC trips in May heat.',
    secretPitch:
      'Sign 35+ flats in one apartment society for a Saturday camp—zero technician travel downtime and 55% net margin.',
    roadmap: [
      'Create 24-point visual flat health report card for residents',
      'Organize RWA-approved Saturday society group discounts at ₹999/flat',
      'Upsell annual water-purifier & geyser descaling add-ons',
    ],
    targetAudience: 'Urban apartment societies, local electricians & AC technicians',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹750 Camp Playbook & Checklist',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-vikas',
    authorName: 'Vikas Tiwari',
    authorRole: 'Home Services Operator',
    authorHandle: '@vikashome',
    createdAt: '2026-11-10T16:15:00Z',
    upvotes: 369,
    tags: ['hyperlocal', 'upi', 'whatsapp'],
  },
  {
    id: 'idea-nri-eldercare-errand-escort',
    title: 'Trusted Hospital, Bank & Pharmacy Escort Service for Senior Parents',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Vetted, police-verified local companions who accompany elderly parents on clinic visits and bank KYC runs with live WhatsApp updates to family.',
    detailedDescription:
      'Working children in Bengaluru or abroad worry endlessly when aging parents navigate crowded hospital queues and paperwork alone in Tier-2 hometowns.',
    secretPitch:
      'Sell ₹1,499 single-visit or ₹3,999 monthly companion packs directly to NRI & metro family WhatsApp groups.',
    roadmap: [
      'Recruit retired nurses & hospitality grads with strict background KYC',
      'Stream live check-in, prescription photo & bill receipt to family WhatsApp',
      'Launch pilot across Pune, Chandigarh, Kochi & Jaipur',
    ],
    targetAudience: 'Metro/NRI families with senior parents in Indian cities',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹1,300 Ops Blueprint · 20% Equity',
    isPremium: true,
    unlockCredits: 9,
    authorId: 'author-lakshmi',
    authorName: 'Lakshmi Menon',
    authorRole: 'Geriatric Care Coordinator',
    authorHandle: '@lakshmicare',
    createdAt: '2026-11-09T13:30:00Z',
    upvotes: 491,
    tags: ['hyperlocal', 'whatsapp', 'tier2'],
  },
  {
    id: 'idea-local-coaching-attendance-fee-bot',
    title: 'QR Attendance & Automated Parent Fee-Reminder Bot for Coaching Centers',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Students scan a classroom QR at entry; parents get an instant WhatsApp arrival alert plus polite monthly ₹1,500–₹4,000 UPI fee links.',
    detailedDescription:
      'Neighborhood coaching tutors and dance/karate academies feel awkward chasing parents for overdue monthly fees and lose track of bunking students.',
    secretPitch:
      'Price at ₹399/month per tuition center—automating fee collection pays for the tool on Day 1.',
    roadmap: [
      'Generate printable classroom entry QR + student roll-number tag',
      'Send 1-line Hindi/English WhatsApp attendance & test score pings',
      'Attach 1-tap UPI payment link on the 5th of every month',
    ],
    targetAudience: 'Local tuition teachers, music/dance studios, coaching classes',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹699 Full Product Spec & Bot Flows',
    isPremium: true,
    unlockCredits: 5,
    authorId: 'author-pankaj',
    authorName: 'Pankaj Verma',
    authorRole: 'Tier-2 SaaS Builder',
    authorHandle: '@pankajed',
    createdAt: '2026-11-08T11:45:00Z',
    upvotes: 418,
    tags: ['qr', 'whatsapp', 'upi', 'tier2'],
  },
  {
    id: 'idea-pet-van-society-grooming',
    title: 'Weekend Society Driveway Pet Bath & Nail-Trim Van Booking',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Quiet electric doorstep grooming van clustered by apartment complex every weekend so dogs skip stressful 4-hour salon cages.',
    detailedDescription:
      'Urban pet parents hate leaving anxious dogs locked in noisy grooming parlours and happily pay ₹799–₹1,299 for 45-minute driveway convenience.',
    secretPitch:
      'Target one apartment pet WhatsApp group per Saturday (6–8 slots in the same basement)—eliminating fuel waste completely.',
    roadmap: [
      'Outfit compact cargo van with silent dryer & warm-water tank',
      'Launch society-by-society slot clustering calendar with ₹200 UPI token',
      'Partner with local vets for tick-check referrals',
    ],
    targetAudience: 'Gated-community pet parents, local vet clinics',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: 'Open Brief · ₹0 Unlock · 15% Franchise Share',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'author-simran',
    authorName: 'Simran Bedi',
    authorRole: 'Pet Care Entrepreneur',
    authorHandle: '@simranpets',
    createdAt: '2026-11-07T14:20:00Z',
    upvotes: 162,
    tags: ['hyperlocal', 'whatsapp', 'upi'],
  },
  {
    id: 'idea-society-basement-ev-qr',
    title: 'Prepaid QR-Unlocked Shared EV Scooter Charger Box for Flats',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Turns 2 shared apartment basement 16A sockets into UPI scan-to-charge bays that auto-reimburse the society maintenance account.',
    detailedDescription:
      'Thousands of Ola, Ather, and Chetak scooter buyers in rented flats are blocked from installing private basement charging points by RWA committees.',
    secretPitch:
      'Install ₹2,500 smart relay boxes at zero RWA cost—mark up ₹3/kWh over society commercial tariff and settle automatically via UPI.',
    roadmap: [
      'Deploy QR scan-to-power-on smart 16A socket controller',
      'Auto-cutoff on full charge + ₹20/hr overstay nudge on WhatsApp',
      'Generate monthly kWh settlement ledger for RWA treasurer',
    ],
    targetAudience: 'Apartment RWAs, EV two-wheeler riders, tenants',
    collaborationModel: CollaborationModel.CO_FOUNDER,
    askingTerms: '₹1,100 Hardware + Flow Spec · 20% Equity',
    isPremium: true,
    unlockCredits: 7,
    authorId: 'author-kiran',
    authorName: 'Kiran Hegde',
    authorRole: 'EV Systems Engineer',
    authorHandle: '@kiranev',
    createdAt: '2026-11-06T10:50:00Z',
    upvotes: 389,
    tags: ['qr', 'upi', 'hyperlocal'],
  },
  {
    id: 'idea-laundry-dhobi-whatsapp-tags',
    title: 'Lost-Cloth Prevention QR Tag & UPI Monthly Pass for Ironing & Dhobis',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Gives local press-wallahs and neighborhood dhobis reusable numbered laundry bags + 1-tap WhatsApp "Kapde Ready" & monthly ₹600 UPI billing.',
    detailedDescription:
      'Bachelors and busy families lose shirts constantly with chalk-marked cloth bundles and struggle settling messy paper notebooks at month-end.',
    secretPitch:
      'Charge neighborhood laundry stalls ₹199/month; earn referral bonus from bachelors moving into new flats.',
    roadmap: [
      'Print wash-proof QR bag tags linked to resident flat numbers',
      '1-tap WhatsApp message showing item count & ironed status',
      'Automate 1st-of-month ₹400–₹1,200 UPI bill settlement link',
    ],
    targetAudience: 'Local press-wallahs, laundromats, bachelor flats & PGs',
    collaborationModel: CollaborationModel.FIXED_BUYOUT,
    askingTerms: '₹399 Full Micro-SaaS Spec',
    isPremium: true,
    unlockCredits: 3,
    authorId: 'author-rohit-ops',
    authorName: 'Rohit Deshmukh',
    authorRole: 'Hyperlocal Systems Dev',
    authorHandle: '@rohitops',
    createdAt: '2026-11-05T13:15:00Z',
    upvotes: 277,
    tags: ['qr', 'whatsapp', 'upi', 'hyperlocal'],
  },
  {
    id: 'idea-gem-tender-msme-checklist',
    title: 'Hindi/English GeM Portal Tender Summary & Compliance Checker for MSMEs',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Scans lengthy GeM government tender PDFs in 60 seconds to highlight hidden turnover, EMD, and ISO eligibility traps in simple bullet points.',
    detailedDescription:
      'Small Indian manufacturers and local contractors miss lucrative ₹10L–₹50L government supply orders or lose EMD deposits due to buried fine-print clauses.',
    secretPitch:
      'Charge ₹499 per tender check via UPI with zero subscription lock-in—upsell ₹1,500 monthly packs to active GeM consultants.',
    roadmap: [
      'Extract MSE/Startup EMD exemptions, delivery timelines & penalty clauses',
      'Cross-verify bidder Udyam, GST & turnover docs automatically',
      'Generate clear Red/Green bid readiness summary in English or Hindi',
    ],
    targetAudience: 'Indian MSME vendors, GeM consultants, local contractors',
    collaborationModel: CollaborationModel.EQUITY_SPLIT,
    askingTerms: '₹1,499 Blueprint · 15% Equity',
    isPremium: true,
    unlockCredits: 10,
    authorId: 'author-meera-gem',
    authorName: 'Meera Deshmukh',
    authorRole: 'Public Procurement Advisor',
    authorHandle: '@meeragem',
    createdAt: '2026-11-04T08:40:00Z',
    upvotes: 334,
    tags: ['gst', 'hindi', 'tier2'],
  },
  {
    id: 'idea-solar-rooftop-cleaning-sub',
    title: 'PM Surya Ghar Rooftop Solar Dust-Alert & ₹499 Cleaning Subscription',
    category: IdeaCategory.LOCAL_SERVICES,
    summary:
      'Tracks residential inverter output drops caused by Indian city dust and dispatches local technician crews for soft-brush solar panel washes.',
    detailedDescription:
      'Lakhs of homeowners installing PM Surya Ghar rooftop solar lose 15–22% power generation within 6 weeks due to construction dust and bird droppings.',
    secretPitch:
      'Partner with city solar EPC installers—give them a free monitoring dashboard in exchange for bundling ₹499 quarterly wash plans at installation.',
    roadmap: [
      'Compare daily kWh output against sunny-day neighborhood benchmarks',
      'Trigger WhatsApp dust-loss alert showing estimated lost rupee savings',
      'Schedule ₹499 soft-water telescopic brush wash slot via UPI',
    ],
    targetAudience: 'Residential solar owners, Tier-2 solar EPC installers',
    collaborationModel: CollaborationModel.REVENUE_SHARE,
    askingTerms: 'Open Brief · ₹0 Unlock · 20% Rev Share',
    isPremium: false,
    unlockCredits: 0,
    authorId: 'author-aditya',
    authorName: 'Aditya Deshpande',
    authorRole: 'CleanTech Field Engineer',
    authorHandle: '@adityasolar',
    createdAt: '2026-11-01T10:15:00Z',
    upvotes: 205,
    tags: ['hyperlocal', 'tier2', 'whatsapp', 'upi'],
  },
];

export const SEED_IDEAS: IdeaItem[] = RAW_SEED_IDEAS.map(toIdeaItem);

export const SEED_PROPOSALS: CollaborationProposal[] = [
  {
    id: 'prop-1',
    ideaId: 'idea-kirana-whatsapp-order-bot',
    senderId: 'author-neeraj',
    senderName: 'Neeraj Kulkarni',
    senderEmail: 'neeraj.pay@gmail.com',
    roleOffering: 'WhatsApp Cloud API & UPI Engineer',
    proposedTerms: '20% Equity + Working OCR & Razorpay UPI Bridge',
    message:
      'Already built a Hindi/Marathi handwritten list parser and instant dynamic UPI QR generator. We can pilot across 15 Pune kirana stores this month.',
    createdAt: '2026-11-14T16:20:00Z',
    status: 'In Review',
  },
  {
    id: 'prop-2',
    ideaId: 'idea-desishorts-script-ai',
    senderId: 'author-ishaan',
    senderName: 'Ishaan Kapoor',
    senderEmail: 'ishaan.ctr@gmail.com',
    roleOffering: 'Creator Distribution & Shorts Packaging',
    proposedTerms: '20% Revenue Share + 35 Regional Creator Channels',
    message:
      'I manage growth for 35 Hindi and Punjabi Shorts channels pulling 80M+ monthly views. Happy to seed launch case studies and run our first 1,000 UPI trials.',
    createdAt: '2026-11-13T20:10:00Z',
    status: 'Accepted',
  },
  {
    id: 'prop-3',
    ideaId: 'idea-cbse-handwritten-notes-hub',
    senderId: 'author-prateek',
    senderName: 'Prateek Bansal',
    senderEmail: 'prateek.jee@gmail.com',
    roleOffering: 'Content Supply & Kota/CBSE Topper Network',
    proposedTerms: '20% Co-Founder Equity + 40 Toppers Onboarded',
    message:
      'Have direct WhatsApp access to 40+ 98% CBSE & JEE rankers ready to upload their clean color-coded NCERT notebooks right before pre-boards.',
    createdAt: '2026-11-14T09:45:00Z',
    status: 'Pending',
  },
  {
    id: 'prop-4',
    ideaId: 'idea-chai-tapri-qr-menu',
    senderId: 'author-harsh',
    senderName: 'Harshvardhan Patel',
    senderEmail: 'harsh.tally@gmail.com',
    roleOffering: 'City Field Onboarding & QR Print Ops',
    proposedTerms: '20% Equity + 50 Indore & Ahmedabad Cafes Ready',
    message:
      'Our local sales crew already visits 50+ student-area cafes and tapris every week for POS supplies. We can stick QR kits on tables on day one.',
    createdAt: '2026-11-12T18:30:00Z',
    status: 'In Review',
  },
  {
    id: 'prop-5',
    ideaId: 'idea-whatsapp-cod-to-upi-rto',
    senderId: 'author-riya',
    senderName: 'Riya Chatterjee',
    senderEmail: 'riya.growth@gmail.com',
    roleOffering: 'D2C Brand Partnerships & GTM',
    proposedTerms: '15% Equity + 18 Indian D2C Founders Waiting',
    message:
      'Run retention for 18 Indian skincare and apparel brands bleeding 24% RTO on Tier-2/3 COD orders. Can close our first 10 paid pilots in 10 days.',
    createdAt: '2026-11-13T14:15:00Z',
    status: 'Pending',
  },
];
