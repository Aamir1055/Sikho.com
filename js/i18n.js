/* ===================================================================
   Sikho Market — Lightweight i18n (client-side)
   - Mark text with data-i18n="key"
   - Mark placeholders with data-i18n-ph="key"
   - Language choice persists in localStorage and applies on every page
   =================================================================== */
(function () {
  var STORAGE_KEY = "sikho_lang";
  document.documentElement.classList.add("i18n-loading");

  /* Supported languages (code -> bilingual label) */
  var LANGS = {
    en: "English",
    hi: "Hindi (हिंदी)",
    ta: "Tamil (தமிழ்)",
    te: "Telugu (తెలుగు)",
    kn: "Kannada (ಕನ್ನಡ)",
    gu: "Gujarati (ગુજરાતી)"
  };

  /* Right-to-nothing here; all are LTR. */
  var HTML_LANG = { en: "en", hi: "hi", ta: "ta", te: "te", kn: "kn", gu: "gu" };

  /* Translation dictionary: key -> { lang: text } */
  var T = {
    /* ---- Navbar ---- */
    "nav.home":     { en: "Home", hi: "होम", ta: "முகப்பு", te: "హోమ్", kn: "ಮುಖಪುಟ", gu: "હોમ" },
    "nav.about":    { en: "About Us", hi: "हमारे बारे में", ta: "எங்களைப் பற்றி", te: "మా గురించి", kn: "ನಮ್ಮ ಬಗ್ಗೆ", gu: "અમારા વિશે" },
    "nav.terms":    { en: "Terms & Conditions", hi: "नियम एवं शर्तें", ta: "விதிமுறைகள்", te: "నిబంధనలు", kn: "ನಿಯಮಗಳು", gu: "નિયમો અને શરતો" },
    "nav.privacy":  { en: "Privacy Policy", hi: "गोपनीयता नीति", ta: "தனியுரிமைக் கொள்கை", te: "గోప్యతా విధానం", kn: "ಗೌಪ್ಯತಾ ನೀತಿ", gu: "ગોપનીયતા નીતિ" },
    "nav.contact":  { en: "Contact Us", hi: "संपर्क करें", ta: "தொடர்பு கொள்ளவும்", te: "సంప్రదించండి", kn: "ಸಂಪರ್ಕಿಸಿ", gu: "સંપર્ક કરો" },
    "nav.language": { en: "Language", hi: "भाषा", ta: "மொழி", te: "భాష", kn: "ಭಾಷೆ", gu: "ભાષા" },

    /* ---- Hero (home) ---- */
    "hero.kicker":   { en: "Learn live. Learn free.", hi: "लाइव सीखें। मुफ़्त सीखें।", ta: "நேரடியாக கற்றுக்கொள்ளுங்கள். இலவசமாக கற்றுக்கொள்ளுங்கள்.", te: "లైవ్‌గా నేర్చుకోండి. ఉచితంగా నేర్చుకోండి.", kn: "ಲೈವ್ ಕಲಿಯಿರಿ. ಉಚಿತವಾಗಿ ಕಲಿಯಿರಿ.", gu: "લાઇવ શીખો. મફતમાં શીખો." },
    "hero.title1":   { en: "Learn the market", hi: "बाज़ार सीखें", ta: "சந்தையை கற்றுக்கொள்ளுங்கள்", te: "మార్కెట్‌ను నేర్చుకోండి", kn: "ಮಾರುಕಟ್ಟೆಯನ್ನು ಕಲಿಯಿರಿ", gu: "માર્કેટ શીખો" },
    "hero.title2":   { en: "in your language.", hi: "अपनी भाषा में।", ta: "உங்கள் மொழியில்.", te: "మీ భాషలో.", kn: "ನಿಮ್ಮ ಭಾಷೆಯಲ್ಲಿ.", gu: "તમારી ભાષામાં." },
    "hero.subtitle": { en: "Practical, expert-led webinars for every stage of your investing journey.", hi: "आपकी निवेश यात्रा के हर चरण के लिए विशेषज्ञों द्वारा व्यावहारिक वेबिनार।", ta: "உங்கள் முதலீட்டுப் பயணத்தின் ஒவ்வொரு கட்டத்திற்கும் நிபுணர்களால் நடத்தப்படும் நடைமுறை வெபினார்கள்.", te: "మీ పెట్టుబడి ప్రయాణంలోని ప్రతి దశకు నిపుణుల నేతృత్వంలో ఆచరణాత్మక వెబినార్లు.", kn: "ನಿಮ್ಮ ಹೂಡಿಕೆ ಪ್ರಯಾಣದ ಪ್ರತಿ ಹಂತಕ್ಕೂ ತಜ್ಞರ ನೇತೃತ್ವದ ಪ್ರಾಯೋಗಿಕ ವೆಬಿನಾರ್‌ಗಳು.", gu: "તમારી રોકાણ યાત્રાના દરેક તબક્કા માટે નિષ્ણાતો દ્વારા વ્યવહારુ વેબિનાર." },
    "hero.usp1.t":   { en: "100% Free", hi: "100% मुफ़्त", ta: "100% இலவசம்", te: "100% ఉచితం", kn: "100% ಉಚಿತ", gu: "100% મફત" },
    "hero.usp1.s":   { en: "No hidden fees", hi: "कोई छुपा शुल्क नहीं", ta: "மறைக்கப்பட்ட கட்டணம் இல்லை", te: "దాచిన ఛార్జీలు లేవు", kn: "ಗುಪ್ತ ಶುಲ್ಕವಿಲ್ಲ", gu: "કોઈ છુપા ફી નથી" },
    "hero.usp2.t":   { en: "6 Languages", hi: "6 भाषाएँ", ta: "6 மொழிகள்", te: "6 భాషలు", kn: "6 ಭಾಷೆಗಳು", gu: "6 ભાષાઓ" },
    "hero.usp2.s":   { en: "Learn comfortably", hi: "आराम से सीखें", ta: "வசதியாக கற்றுக்கொள்ளுங்கள்", te: "సౌకర్యంగా నేర్చుకోండి", kn: "ಆರಾಮವಾಗಿ ಕಲಿಯಿರಿ", gu: "આરામથી શીખો" },
    "hero.usp3.t":   { en: "Live Experts", hi: "लाइव विशेषज्ञ", ta: "நேரடி நிபுணர்கள்", te: "లైవ్ నిపుణులు", kn: "ಲೈವ್ ತಜ್ಞರು", gu: "લાઇવ નિષ્ણાતો" },
    "hero.usp3.s":   { en: "Ask questions live", hi: "लाइव सवाल पूछें", ta: "நேரடியாக கேள்விகள் கேளுங்கள்", te: "లైవ్‌లో ప్రశ్నలు అడగండి", kn: "ಲೈವ್ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ", gu: "લાઇવ પ્રશ્નો પૂછો" },
    "hero.chooseLang": { en: "Choose your preferred language", hi: "अपनी पसंदीदा भाषा चुनें", ta: "உங்கள் விருப்ப மொழியைத் தேர்ந்தெடுக்கவும்", te: "మీ ఇష్టమైన భాషను ఎంచుకోండి", kn: "ನಿಮ್ಮ ಇಷ್ಟದ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", gu: "તમારી પસંદગીની ભાષા પસંદ કરો" },

    /* ---- Learning levels ---- */
    "learn.kicker":  { en: "Structured Learning", hi: "संरचित शिक्षण", ta: "கட்டமைக்கப்பட்ட கற்றல்", te: "నిర్మాణాత్మక అభ్యాసం", kn: "ರಚನಾತ್ಮಕ ಕಲಿಕೆ", gu: "સંરચિત શિક્ષણ" },
    "learn.title":   { en: "Master the Stock Market, Step by Step", hi: "स्टॉक मार्केट में महारत हासिल करें, चरण दर चरण", ta: "பங்குச் சந்தையை படிப்படியாக கற்றுத் தேர்ச்சி பெறுங்கள்", te: "స్టాక్ మార్కెట్‌ను దశలవారీగా నేర్చుకోండి", kn: "ಷೇರು ಮಾರುಕಟ್ಟೆಯನ್ನು ಹಂತ ಹಂತವಾಗಿ ಕರಗತ ಮಾಡಿಕೊಳ್ಳಿ", gu: "સ્ટોક માર્કેટમાં પગલું-દર-પગલું નિપુણતા મેળવો" },
    "learn.desc":    { en: "Pick your level and open a complete, topic-wise guide with clear explanations and charts.", hi: "अपना स्तर चुनें और स्पष्ट व्याख्या और चार्ट के साथ एक संपूर्ण, विषय-वार गाइड खोलें।", ta: "உங்கள் நிலையைத் தேர்ந்தெடுத்து, தெளிவான விளக்கங்கள் மற்றும் விளக்கப்படங்களுடன் முழுமையான வழிகாட்டியைத் திறக்கவும்.", te: "మీ స్థాయిని ఎంచుకుని, స్పష్టమైన వివరణలు మరియు చార్ట్‌లతో పూర్తి గైడ్‌ను తెరవండి.", kn: "ನಿಮ್ಮ ಮಟ್ಟವನ್ನು ಆಯ್ಕೆಮಾಡಿ ಮತ್ತು ಸ್ಪಷ್ಟ ವಿವರಣೆಗಳೊಂದಿಗೆ ಸಂಪೂರ್ಣ ಮಾರ್ಗದರ್ಶಿಯನ್ನು ತೆರೆಯಿರಿ.", gu: "તમારું સ્તર પસંદ કરો અને સ્પષ્ટ સમજૂતી અને ચાર્ટ સાથે સંપૂર્ણ ગાઇડ ખોલો." },
    "level.beginner":     { en: "Beginner", hi: "शुरुआती", ta: "தொடக்கநிலை", te: "ప్రారంభకుడు", kn: "ಆರಂಭಿಕ", gu: "શરૂઆતી" },
    "level.intermediate": { en: "Intermediate", hi: "मध्यम", ta: "இடைநிலை", te: "మధ్యస్థ", kn: "ಮಧ್ಯಂತರ", gu: "મધ્યવર્તી" },
    "level.advanced":     { en: "Advanced", hi: "उन्नत", ta: "மேம்பட்ட", te: "అధునాతన", kn: "ಸುಧಾರಿತ", gu: "ઉન્નત" },
    "level.startLearning": { en: "Start learning", hi: "सीखना शुरू करें", ta: "கற்கத் தொடங்குங்கள்", te: "నేర్చుకోవడం ప్రారంభించండి", kn: "ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ", gu: "શીખવાનું શરૂ કરો" },

    /* ---- Common buttons ---- */
    "btn.bookFree":  { en: "Book Free Seat", hi: "मुफ़्त सीट बुक करें", ta: "இலவச இருக்கையை பதிவு செய்யுங்கள்", te: "ఉచిత సీటును బుక్ చేయండి", kn: "ಉಚಿತ ಆಸನ ಕಾಯ್ದಿರಿಸಿ", gu: "મફત સીટ બુક કરો" },
    "btn.bookNow":   { en: "Book Now", hi: "अभी बुक करें", ta: "இப்போது பதிவு செய்யுங்கள்", te: "ఇప్పుడే బుక్ చేయండి", kn: "ಈಗ ಕಾಯ್ದಿರಿಸಿ", gu: "હમણાં બુક કરો" },
    "common.free":   { en: "Free", hi: "मुफ़्त", ta: "இலவசம்", te: "ఉచితం", kn: "ಉಚಿತ", gu: "મફત" },

    /* ---- Learning access form ---- */
    "gate.freeAccess": { en: "Free access — tell us about yourself.", hi: "मुफ़्त एक्सेस — अपने बारे में बताएं।", ta: "இலவச அணுகல் — உங்களைப் பற்றி எங்களிடம் கூறுங்கள்.", te: "ఉచిత యాక్సెస్ — మీ గురించి మాకు చెప్పండి.", kn: "ಉಚಿತ ಪ್ರವೇಶ — ನಿಮ್ಮ ಬಗ್ಗೆ ನಮಗೆ ತಿಳಿಸಿ.", gu: "મફત ઍક્સેસ — તમારા વિશે જણાવો." },
    "gate.fullName": { en: "Full Name", hi: "पूरा नाम", ta: "முழுப் பெயர்", te: "పూర్తి పేరు", kn: "ಪೂರ್ಣ ಹೆಸರು", gu: "પૂરું નામ" },
    "gate.fullNamePh": { en: "Your full name", hi: "अपना पूरा नाम", ta: "உங்கள் முழுப் பெயர்", te: "మీ పూర్తి పేరు", kn: "ನಿಮ್ಮ ಪೂರ್ಣ ಹೆಸರು", gu: "તમારું પૂરું નામ" },
    "gate.phone": { en: "Phone Number", hi: "फ़ोन नंबर", ta: "தொலைபேசி எண்", te: "ఫోన్ నంబర్", kn: "ಫೋನ್ ಸಂಖ್ಯೆ", gu: "ફોન નંબર" },
    "gate.phonePh": { en: "10-digit mobile number", hi: "10 अंकों का मोबाइल नंबर", ta: "10 இலக்க மொபைல் எண்", te: "10 అంకెల మొబైల్ నంబర్", kn: "10 ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ", gu: "10 અંકનો મોબાઇલ નંબર" },
    "gate.state": { en: "State", hi: "राज्य", ta: "மாநிலம்", te: "రాష్ట్రం", kn: "ರಾಜ್ಯ", gu: "રાજ્ય" },
    "gate.statePh": { en: "e.g. Maharashtra", hi: "उदाहरण: महाराष्ट्र", ta: "எ.கா. மகாராஷ்டிரா", te: "ఉదా. మహారాష్ట్ర", kn: "ಉದಾ. ಮಹಾರಾಷ್ಟ್ರ", gu: "દા.ત. મહારાષ્ટ્ર" },
    "gate.experience": { en: "Trading Experience", hi: "ट्रेडिंग अनुभव", ta: "வர்த்தக அனுபவம்", te: "ట్రేడింగ్ అనుభవం", kn: "ವ್ಯಾಪಾರ ಅನುಭವ", gu: "ટ્રેડિંગ અનુભવ" },
    "gate.selectExperience": { en: "Select your experience", hi: "अपना अनुभव चुनें", ta: "உங்கள் அனுபவத்தைத் தேர்ந்தெடுக்கவும்", te: "మీ అనుభవాన్ని ఎంచుకోండి", kn: "ನಿಮ್ಮ ಅನುಭವವನ್ನು ಆಯ್ಕೆಮಾಡಿ", gu: "તમારો અનુભવ પસંદ કરો" },
    "gate.beginner": { en: "Beginner", hi: "शुरुआती", ta: "தொடக்கநிலை", te: "ప్రారంభకుడు", kn: "ಆರಂಭಿಕ", gu: "શરૂઆતી" },
    "gate.intermediate": { en: "Intermediate", hi: "मध्यम", ta: "இடைநிலை", te: "మధ్యస్థ", kn: "ಮಧ್ಯಂತರ", gu: "મધ્યવર્તી" },
    "gate.advanced": { en: "Advanced", hi: "उन्नत", ta: "மேம்பட்ட", te: "అధునాతన", kn: "ಸುಧಾರಿತ", gu: "ઉન્નત" },
    "gate.platform": { en: "Trading Platform", hi: "ट्रेडिंग प्लेटफ़ॉर्म", ta: "வர்த்தக தளம்", te: "ట్రేడింగ్ ప్లాట్‌ఫారమ్", kn: "ವ್ಯಾಪಾರ ವೇದಿಕೆ", gu: "ટ્રેડિંગ પ્લેટફોર્મ" },
    "gate.platformPh": { en: "e.g. Zerodha, Groww, or none yet", hi: "उदाहरण: ज़ेरोधा, ग्रो या अभी कोई नहीं", ta: "எ.கா. Zerodha, Groww அல்லது இன்னும் எதுவுமில்லை", te: "ఉదా. Zerodha, Groww లేదా ఇంకా ఏదీ లేదు", kn: "ಉದಾ. Zerodha, Groww, ಅಥವಾ ಇನ್ನೂ ಯಾವುದೂ ಇಲ್ಲ", gu: "દા.ત. Zerodha, Groww અથવા હજુ કંઈ નથી" },
    "gate.submit": { en: "Unlock & Start Learning", hi: "अनलॉक करें और सीखना शुरू करें", ta: "திறக்கவும் & கற்றலைத் தொடங்கவும்", te: "అన్‌లాక్ చేసి నేర్చుకోవడం ప్రారంభించండి", kn: "ಅನ್‌ಲಾಕ್ ಮಾಡಿ ಮತ್ತು ಕಲಿಯಲು ಪ್ರಾರಂಭಿಸಿ", gu: "અનલૉક કરો અને શીખવાનું શરૂ કરો" },
    "gate.unlockCourse": { en: "Unlock learning", hi: "सीखना अनलॉक करें", ta: "கற்றலைத் திறக்கவும்", te: "అభ్యాసాన్ని అన్‌లాక్ చేయండి", kn: "ಕಲಿಕೆಯನ್ನು ಅನ್‌ಲಾಕ್ ಮಾಡಿ", gu: "શીખવાનું અનલૉક કરો" },
    "gate.registerContinue": { en: "Register free to continue learning.", hi: "सीखना जारी रखने के लिए निःशुल्क पंजीकरण करें।", ta: "கற்றலைத் தொடர இலவசமாக பதிவு செய்யுங்கள்.", te: "నేర్చుకోవడం కొనసాగించడానికి ఉచితంగా నమోదు చేసుకోండి.", kn: "ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಲು ಉಚಿತವಾಗಿ ನೋಂದಾಯಿಸಿ.", gu: "શીખવાનું ચાલુ રાખવા મફતમાં નોંધણી કરો." },
    "gate.preferredLanguage": { en: "Preferred language", hi: "पसंदीदा भाषा", ta: "விருப்பமான மொழி", te: "ఇష్టమైన భాష", kn: "ಆದ್ಯತೆಯ ಭಾಷೆ", gu: "પસંદગીની ભાષા" },
    "gate.selectLanguage": { en: "Select your language", hi: "अपनी भाषा चुनें", ta: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்", te: "మీ భాషను ఎంచుకోండి", kn: "ನಿಮ್ಮ ಭಾಷೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", gu: "તમારી ભાષા પસંદ કરો" },
    "gate.selectMarket": { en: "Select your market", hi: "अपना बाज़ार चुनें", ta: "உங்கள் சந்தையைத் தேர்ந்தெடுக்கவும்", te: "మీ మార్కెట్‌ను ఎంచుకోండి", kn: "ನಿಮ್ಮ ಮಾರುಕಟ್ಟೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ", gu: "તમારું બજાર પસંદ કરો" },
    "gate.marketPreference": { en: "Market preference", hi: "बाज़ार की पसंद", ta: "சந்தை விருப்பம்", te: "మార్కెట్ ప్రాధాన్యత", kn: "ಮಾರುಕಟ್ಟೆ ಆದ್ಯತೆ", gu: "બજારની પસંદગી" },
    "gate.continueLearning": { en: "Continue learning", hi: "सीखना जारी रखें", ta: "கற்றலைத் தொடரவும்", te: "నేర్చుకోవడం కొనసాగించండి", kn: "ಕಲಿಕೆಯನ್ನು ಮುಂದುವರಿಸಿ", gu: "શીખવાનું ચાલુ રાખો" },

    /* ---- Footer ---- */
    "footer.tagline":  { en: "Free live webinars and structured courses to help you learn the market with confidence.", hi: "आत्मविश्वास से बाज़ार सीखने में मदद करने के लिए मुफ़्त लाइव वेबिनार और संरचित पाठ्यक्रम।", ta: "நம்பிக்கையுடன் சந்தையைக் கற்க உதவும் இலவச நேரடி வெபினார்கள் மற்றும் கட்டமைக்கப்பட்ட படிப்புகள்.", te: "నమ్మకంతో మార్కెట్‌ను నేర్చుకోవడానికి ఉచిత లైవ్ వెబినార్లు మరియు నిర్మాణాత్మక కోర్సులు.", kn: "ವಿಶ್ವಾಸದಿಂದ ಮಾರುಕಟ್ಟೆ ಕಲಿಯಲು ಉಚಿತ ಲೈವ್ ವೆಬಿನಾರ್‌ಗಳು ಮತ್ತು ರಚನಾತ್ಮಕ ಕೋರ್ಸ್‌ಗಳು.", gu: "આત્મવિશ્વાસથી માર્કેટ શીખવામાં મદદ કરવા મફત લાઇવ વેબિનાર અને સંરચિત કોર્સ." },
    "footer.learn":    { en: "Learn", hi: "सीखें", ta: "கற்க", te: "నేర్చుకోండి", kn: "ಕಲಿಯಿರಿ", gu: "શીખો" },
    "footer.legal":    { en: "Legal", hi: "कानूनी", ta: "சட்டம்", te: "చట్టపరమైన", kn: "ಕಾನೂನು", gu: "કાનૂની" },
    "footer.support":  { en: "Support", hi: "सहायता", ta: "ஆதரவு", te: "మద్దతు", kn: "ಬೆಂಬಲ", gu: "સપોર્ટ" },
    "footer.help":     { en: "Help Center", hi: "सहायता केंद्र", ta: "உதவி மையம்", te: "సహాయ కేంద్రం", kn: "ಸಹಾಯ ಕೇಂದ್ರ", gu: "સહાય કેન્દ્ર" },
    "footer.trainer":  { en: "Become a Trainer", hi: "ट्रेनर बनें", ta: "பயிற்சியாளராகுங்கள்", te: "ట్రైనర్ అవ్వండి", kn: "ತರಬೇತುದಾರರಾಗಿ", gu: "ટ્રેનર બનો" },
    "footer.rights":   { en: "All rights reserved.", hi: "सर्वाधिकार सुरक्षित।", ta: "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.", te: "సర్వ హక్కులు ప్రత్యేకించబడ్డాయి.", kn: "ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.", gu: "બધા હક અનામત." },
    "footer.educationDisclaimer": { en: "Educational content only. Not investment advice.", hi: "केवल शैक्षिक सामग्री। निवेश सलाह नहीं।", ta: "கல்வி உள்ளடக்கம் மட்டுமே. முதலீட்டு ஆலோசனை அல்ல.", te: "విద్యా సమాచారం మాత్రమే. పెట్టుబడి సలహా కాదు.", kn: "ಶೈಕ್ಷಣಿಕ ವಿಷಯ ಮಾತ್ರ. ಹೂಡಿಕೆ ಸಲಹೆಯಲ್ಲ.", gu: "માત્ર શૈક્ષણિક માહિતી. રોકાણ સલાહ નથી." },
    "footer.riskDisclaimer": { en: "Market investments carry risk and returns are not guaranteed. Do your own research before investing.", hi: "बाजार में निवेश जोखिम भरा होता है और रिटर्न की गारंटी नहीं है। निवेश से पहले अपना शोध करें।", ta: "சந்தை முதலீடுகளில் ஆபத்து உள்ளது; வருமானம் உத்தரவாதமல்ல. முதலீடு செய்வதற்கு முன் சொந்தமாக ஆய்வு செய்யுங்கள்.", te: "మార్కెట్ పెట్టుబడుల్లో ప్రమాదం ఉంటుంది మరియు రాబడికి హామీ లేదు. పెట్టుబడి పెట్టే ముందు మీ స్వంత పరిశోధన చేయండి.", kn: "ಮಾರುಕಟ್ಟೆ ಹೂಡಿಕೆಗಳಲ್ಲಿ ಅಪಾಯವಿದೆ ಮತ್ತು ಆದಾಯ ಖಾತರಿಯಲ್ಲ. ಹೂಡಿಕೆ ಮಾಡುವ ಮೊದಲು ಸ್ವಂತ ಸಂಶೋಧನೆ ಮಾಡಿ.", gu: "બજારના રોકાણમાં જોખમ હોય છે અને વળતરની ખાતરી નથી. રોકાણ કરતા પહેલાં પોતાનું સંશોધન કરો." },
    "footer.educationalDisclaimer": { en: "Educational content only. Nothing here is financial, investment, legal, or tax advice. Markets involve risk, and you are responsible for your own decisions. Consult a qualified professional before investing.", hi: "केवल शैक्षिक सामग्री। यहां दी गई जानकारी वित्तीय, निवेश, कानूनी या कर संबंधी सलाह नहीं है। बाजार में जोखिम होता है और अपने निर्णयों की जिम्मेदारी आपकी है। निवेश से पहले योग्य विशेषज्ञ से सलाह लें।", ta: "கல்வி நோக்கத்திற்கான உள்ளடக்கம் மட்டுமே. இங்குள்ள எதுவும் நிதி, முதலீடு, சட்ட அல்லது வரி ஆலோசனை அல்ல. சந்தைகளில் ஆபத்து உள்ளது; உங்கள் முடிவுகளுக்கு நீங்களே பொறுப்பு. முதலீடு செய்வதற்கு முன் தகுதியான நிபுணரை அணுகுங்கள்.", te: "ఇది విద్యా సమాచారం మాత్రమే. ఇక్కడ ఉన్నది ఆర్థిక, పెట్టుబడి, చట్టపరమైన లేదా పన్ను సలహా కాదు. మార్కెట్లలో ప్రమాదం ఉంటుంది, మీ నిర్ణయాలకు మీరే బాధ్యత వహించాలి. పెట్టుబడి పెట్టే ముందు అర్హత కలిగిన నిపుణుడిని సంప్రదించండి.", kn: "ಇದು ಶೈಕ್ಷಣಿಕ ವಿಷಯ ಮಾತ್ರ. ಇಲ್ಲಿ ಯಾವುದೂ ಹಣಕಾಸು, ಹೂಡಿಕೆ, ಕಾನೂನು ಅಥವಾ ತೆರಿಗೆ ಸಲಹೆಯಲ್ಲ. ಮಾರುಕಟ್ಟೆಗಳಲ್ಲಿ ಅಪಾಯವಿದೆ ಮತ್ತು ನಿಮ್ಮ ನಿರ್ಧಾರಗಳಿಗೆ ನೀವೇ ಜವಾಬ್ದಾರರು. ಹೂಡಿಕೆ ಮಾಡುವ ಮೊದಲು ಅರ್ಹ ತಜ್ಞರನ್ನು ಸಂಪರ್ಕಿಸಿ.", gu: "આ માત્ર શૈક્ષણિક માહિતી છે. અહીંની કોઈપણ માહિતી નાણાકીય, રોકાણ, કાનૂની અથવા કર સલાહ નથી. બજારોમાં જોખમ હોય છે અને તમારા નિર્ણયોની જવાબદારી તમારી પોતાની છે. રોકાણ કરતા પહેલાં યોગ્ય નિષ્ણાતની સલાહ લો." },

    /* ---- Page banners ---- */
    "about.title":   { en: "Learn without a", hi: "बिना किसी बाधा के सीखें", ta: "தடையின்றி கற்றுக்கொள்ளுங்கள்", te: "అడ్డంకి లేకుండా నేర్చుకోండి", kn: "ತಡೆಯಿಲ್ಲದೆ ಕಲಿಯಿರಿ", gu: "અવરોધ વિના શીખો" },
    "about.title2":  { en: "language barrier.", hi: "भाषा की बाधा।", ta: "மொழித் தடை.", te: "భాషా అడ్డంకి.", kn: "ಭಾಷಾ ತಡೆ.", gu: "ભાષા અવરોધ." }
  };

  function t(key, lang) {
    var entry = T[key];
    if (!entry) return null;
    return entry[lang] || entry.en || null;
  }

  function currentLang() {
    try {
      var l = localStorage.getItem(STORAGE_KEY);
      if (l && LANGS[l]) return l;
    } catch (e) {}
    return "en";
  }

  function translationCache(lang) {
    var key = "sikho_translation_" + lang;
    try { return JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) { return {}; }
  }

  function saveTranslationCache(lang, cache) {
    try { localStorage.setItem("sikho_translation_" + lang, JSON.stringify(cache)); } catch (e) {}
  }

  function setGoogleLanguage(lang) {
    var value = lang === "en" ? "/en/en" : "/en/" + lang;
    document.cookie = "googtrans=" + value + ";path=/";
    document.cookie = "googtrans=" + value + ";path=/;domain=" + window.location.hostname;
  }

  function loadGoogleTranslator(lang) {
    if (lang === "en") return;
    var mount = document.getElementById("google_translate_element");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "google_translate_element";
      mount.style.cssText = "position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden;";
      document.body.appendChild(mount);
    }
    window.googleTranslateElementInit = function () {
      var TranslateElement = window.google && window.google.translate && window.google.translate.TranslateElement;
      if (mount.dataset.initialized || typeof TranslateElement !== "function") {
        var attempts = Number(mount.dataset.attempts || 0);
        if (!mount.dataset.initialized && attempts < 20) {
          mount.dataset.attempts = String(attempts + 1);
          window.setTimeout(window.googleTranslateElementInit, 250);
        }
        return;
      }
      try {
        new TranslateElement({
          pageLanguage: "en",
          includedLanguages: "hi,ta,te,kn,gu",
          autoDisplay: false
        }, "google_translate_element");
        mount.dataset.initialized = "true";
        selectGoogleLanguage(lang, 0);
      } catch (e) {
        mount.dataset.attempts = "20";
      }
    };
    if (!document.querySelector('script[src*="translate.google.com/translate_a/element.js"]')) {
      var script = document.createElement("script");
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onload = function () {
        window.setTimeout(window.googleTranslateElementInit, 0);
      };
      document.head.appendChild(script);
    } else {
      window.googleTranslateElementInit();
    }
  }

  function selectGoogleLanguage(lang, attempt) {
    if (lang === "en") return;
    var select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
      return;
    }
    if (attempt < 20) {
      window.setTimeout(function () { selectGoogleLanguage(lang, attempt + 1); }, 250);
    }
  }

  function translateText(text, lang, cache) {
    if (!text || !/[A-Za-z]/.test(text)) return Promise.resolve(text);
    if (cache[text]) return Promise.resolve(cache[text]);
    var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=" +
      encodeURIComponent(lang) + "&dt=t&q=" + encodeURIComponent(text);
    return fetch(url).then(function (response) { return response.json(); }).then(function (data) {
      var translated = data && data[0] ? data[0].map(function (part) { return part[0] || ""; }).join("") : text;
      cache[text] = translated;
      return translated;
    }).catch(function () { return text; });
  }

  function translatePage(lang, root) {
    if (lang === "en") return Promise.resolve();
    root = root || document.body;
    var cache = translationCache(lang);
    var nodes = [];
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var node;
    while ((node = walker.nextNode())) {
      var parent = node.parentElement;
      var value = (node.nodeValue || "").trim();
      if (!parent || !value || value.length < 2 || !/[A-Za-z]/.test(value)) continue;
      if (parent.closest("script, style, svg, .notranslate, [data-i18n], #google_translate_element")) continue;
      nodes.push({ node: node, value: value });
    }

    root.querySelectorAll("input[placeholder], textarea[placeholder]").forEach(function (field) {
      var value = field.getAttribute("placeholder");
      if (value && /[A-Za-z]/.test(value)) {
        nodes.push({ field: field, value: value });
      }
    });

    root.querySelectorAll("[title], [aria-label], img[alt]").forEach(function (element) {
      ["title", "aria-label", "alt"].forEach(function (attribute) {
        var value = element.getAttribute(attribute);
        if (value && /[A-Za-z]/.test(value)) {
          nodes.push({ element: element, attribute: attribute, value: value });
        }
      });
    });

    if (document.title && /[A-Za-z]/.test(document.title)) {
      nodes.push({ title: true, value: document.title });
    }

    var cursor = 0;
    var workerCount = Math.min(24, nodes.length);
    function worker() {
      var item = nodes[cursor++];
      if (!item) return Promise.resolve();
      return translateText(item.value, lang, cache).then(function (translated) {
        if (item.node) item.node.nodeValue = item.node.nodeValue.replace(item.value, translated);
        if (item.field) item.field.setAttribute("placeholder", translated);
        if (item.element) item.element.setAttribute(item.attribute, translated);
        if (item.title) document.title = translated;
        return worker();
      });
    }
    return Promise.all(Array.from({ length: workerCount }, worker)).then(function () {
      saveTranslationCache(lang, cache);
    });
  }

  function applyLang(lang) {
    if (!LANGS[lang]) lang = "en";

    /* text content */
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n"), lang);
      if (val !== null) {
        el.textContent = val;
        el.setAttribute("translate", "no");
      }
    });
    /* placeholders */
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var val = t(el.getAttribute("data-i18n-ph"), lang);
      if (val !== null) el.setAttribute("placeholder", val);
    });

    document.documentElement.setAttribute("lang", HTML_LANG[lang] || "en");

    /* update the switcher label + active state */
    document.querySelectorAll("[data-lang-current]").forEach(function (el) {
      el.textContent = LANGS[lang];
    });
    document.querySelectorAll(".lang-switch-menu [data-set-lang]").forEach(function (el) {
      el.classList.toggle("active", el.getAttribute("data-set-lang") === lang);
    });

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
  }

  /* Expose for the switcher */
  window.SikhoI18n = { apply: applyLang, current: currentLang, langs: LANGS };

  document.addEventListener("DOMContentLoaded", function () {
    var translateStyle = document.createElement("style");
    translateStyle.id = "sikho-internal-translate-style";
    translateStyle.textContent =
      ".goog-te-banner-frame,.goog-te-banner-frame.skiptranslate,body > .skiptranslate," +
      "body > .skiptranslate iframe,.goog-te-balloon-frame,.goog-te-gadget{display:none!important;}" +
      "html body{top:0!important;position:static!important;}";
    document.head.appendChild(translateStyle);

    var lang = currentLang();
    setGoogleLanguage(lang);
    applyLang(lang);
    loadGoogleTranslator(lang);
    document.documentElement.classList.remove("i18n-loading");

    /* Course gates and other widgets can add copy after this event. */
    var observer = new MutationObserver(function (records) {
      records.forEach(function (record) {
        Array.prototype.forEach.call(record.addedNodes, function (added) {
          if (added.nodeType === 1) {
            applyLang(currentLang());
            loadGoogleTranslator(currentLang());
          }
        });
      });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    /* Wire up any language switcher options */
    document.querySelectorAll("[data-set-lang]").forEach(function (el) {
      el.addEventListener("click", function (e) {
        e.preventDefault();
        var selectedLang = el.getAttribute("data-set-lang");
        applyLang(selectedLang);
        setGoogleLanguage(selectedLang);
        /* close dropdown */
        var menu = el.closest(".lang-switch");
        if (menu) menu.classList.remove("open");
        window.location.reload();
      });
    });

    /* Toggle dropdown open/close */
    document.querySelectorAll(".lang-switch-toggle").forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var sw = btn.closest(".lang-switch");
        if (sw) sw.classList.toggle("open");
      });
    });
    document.addEventListener("click", function () {
      document.querySelectorAll(".lang-switch.open").forEach(function (sw) { sw.classList.remove("open"); });
    });
  });
})();
