import React, { useState, useMemo } from 'react';
import { Search, Eye, EyeOff, BookOpen, CheckCircle2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WordEntry {
  id: number;
  english: string;
  uzbek: string;
  synonym?: string;
}

const WORD_DATA: WordEntry[] = [
  { id: 1, english: "A", uzbek: "bir", synonym: "One" },
  { id: 2, english: "Teacher", uzbek: "o‘qituvchi", synonym: "Educator" },
  { id: 3, english: "Teacher's", uzbek: "o‘qituvchining", synonym: "Educator's" },
  { id: 4, english: "Influence", uzbek: "ta’sir", synonym: "Impact" },
  { id: 5, english: "Consider", uzbek: "ko‘rib chiqmoq / o‘ylab ko‘rmoq", synonym: "Regard" },
  { id: 6, english: "the", uzbek: "(artikl, ko‘pincha tarjima qilinmaydi)" },
  { id: 7, english: "example", uzbek: "misol", synonym: "Instance" },
  { id: 8, english: "of", uzbek: "ning" },
  { id: 9, english: "a", uzbek: "bir", synonym: "One" },
  { id: 10, english: "schoolteacher", uzbek: "maktab o‘qituvchisi", synonym: "Instructor" },
  { id: 11, english: "who", uzbek: "kim / -gan", synonym: "That" },
  { id: 12, english: "devoted", uzbek: "bag‘ishlagan", synonym: "Dedicated" },
  { id: 13, english: "decades", uzbek: "o‘n yilliklar", synonym: "Periods" },
  { id: 14, english: "to", uzbek: "ga" },
  { id: 15, english: "educating", uzbek: "ta’lim berish / o‘qitish", synonym: "Teaching" },
  { id: 16, english: "young", uzbek: "yosh", synonym: "Youthful" },
  { id: 17, english: "students", uzbek: "talabalar / o‘quvchilar", synonym: "Pupils" },
  { id: 18, english: "Every", uzbek: "har", synonym: "Each" },
  { id: 19, english: "morning", uzbek: "ertalab", synonym: "Dawn" },
  { id: 20, english: "she", uzbek: "u (ayol)" },
  { id: 21, english: "arrived", uzbek: "yetib keldi", synonym: "Reached" },
  { id: 22, english: "early", uzbek: "erta", synonym: "Soon" },
  { id: 23, english: "prepare", uzbek: "tayyorlamoq", synonym: "Ready" },
  { id: 24, english: "lessons", uzbek: "darslar", synonym: "Classes" },
  { id: 25, english: "encouraged", uzbek: "ruhlantirdi / qo‘llab-quvvatladi", synonym: "Inspired" },
  { id: 26, english: "doubted", uzbek: "shubha qilgan", synonym: "Questioned" },
  { id: 27, english: "their", uzbek: "ularning" },
  { id: 28, english: "abilities", uzbek: "qobiliyatlar", synonym: "Capabilities" },
  { id: 29, english: "helped", uzbek: "yordam berdi", synonym: "Assisted" },
  { id: 30, english: "struggling", uzbek: "qiynalayotgan", synonym: "Toiling" },
  { id: 31, english: "learners", uzbek: "o‘rganuvchilar / o‘quvchilar", synonym: "Students" },
  { id: 32, english: "understand", uzbek: "tushunmoq", synonym: "Comprehend" },
  { id: 33, english: "difficult", uzbek: "qiyin", synonym: "Hard" },
  { id: 34, english: "subjects", uzbek: "fanlar", synonym: "Topics" },
  { id: 35, english: "often", uzbek: "ko‘pincha", synonym: "Frequently" },
  { id: 36, english: "spent", uzbek: "sarfladi", synonym: "Used" },
  { id: 37, english: "extra", uzbek: "qo‘shimcha", synonym: "Additional" },
  { id: 38, english: "hours", uzbek: "soatlar", synonym: "Time" },
  { id: 39, english: "providing", uzbek: "ta’minlash / berish", synonym: "Giving" },
  { id: 40, english: "guidance", uzbek: "yo‘l-yo‘riq", synonym: "Advice" },
  { id: 41, english: "after", uzbek: "keyin", synonym: "Following" },
  { id: 42, english: "class", uzbek: "dars", synonym: "Lesson" },
  { id: 43, english: "Many", uzbek: "ko‘p", synonym: "Numerous" },
  { id: 44, english: "later", uzbek: "keyinchalik", synonym: "Afterwards" },
  { id: 45, english: "pursued", uzbek: "davom ettirdi / erishishga harakat qildi", synonym: "Followed" },
  { id: 46, english: "successful", uzbek: "muvaffaqiyatli", synonym: "Prosperous" },
  { id: 47, english: "careers", uzbek: "kasblar / karyeralar", synonym: "Professions" },
  { id: 48, english: "Some", uzbek: "ba’zilar", synonym: "A few" },
  { id: 49, english: "became", uzbek: "bo‘ldi", synonym: "Turned into" },
  { id: 50, english: "engineers", uzbek: "muhandislar" },
  { id: 51, english: "doctors", uzbek: "shifokorlar", synonym: "Physicians" },
  { id: 52, english: "artists", uzbek: "san’atkorlar", synonym: "Creators" },
  { id: 53, english: "researchers", uzbek: "tadqiqotchilar", synonym: "Investigators" },
  { id: 54, english: "Years", uzbek: "yillar", synonym: "Periods" },
  { id: 55, english: "former", uzbek: "sobiq", synonym: "Previous" },
  { id: 56, english: "reflected", uzbek: "o‘ylab ko‘rdi / esladi", synonym: "Recalled" },
  { id: 57, english: "on", uzbek: "haqida" },
  { id: 58, english: "education", uzbek: "ta’lim", synonym: "Learning" },
  { id: 59, english: "they", uzbek: "ular" },
  { id: 60, english: "realized", uzbek: "anglab yetdi", synonym: "Understood" },
  { id: 61, english: "how", uzbek: "qanchalik" },
  { id: 62, english: "profoundly", uzbek: "chuqur tarzda", synonym: "Deeply" },
  { id: 63, english: "her", uzbek: "uning (ayol)" },
  { id: 64, english: "encouragement", uzbek: "rag‘bat / qo‘llab-quvvatlash", synonym: "Support" },
  { id: 65, english: "shaped", uzbek: "shakllantirdi", synonym: "Formed" },
  { id: 66, english: "confidence", uzbek: "ishonch", synonym: "Self-assurance" },
  { id: 67, english: "This", uzbek: "bu" },
  { id: 68, english: "experience", uzbek: "tajriba", synonym: "Knowledge" },
  { id: 69, english: "illustrates", uzbek: "ko‘rsatadi / tasvirlaydi", synonym: "Shows" },
  { id: 70, english: "educational", uzbek: "ta’limiy", synonym: "Academic" },
  { id: 71, english: "impact", uzbek: "ta’sir", synonym: "Effect" },
  { id: 72, english: "dynamics", uzbek: "jarayonlar / dinamikalar", synonym: "Forces" },
  { id: 73, english: "long-term", uzbek: "uzoq muddatli", synonym: "Enduring" },
  { id: 74, english: "exert", uzbek: "ko‘rsatmoq / ta’sir o‘tkazmoq", synonym: "Apply" },
  { id: 75, english: "intellectual", uzbek: "intellektual", synonym: "Mental" },
  { id: 76, english: "personal", uzbek: "shaxsiy", synonym: "Individual" },
  { id: 77, english: "development", uzbek: "rivojlanish", synonym: "Growth" },
  { id: 78, english: "may", uzbek: "mumkin", synonym: "Might" },
  { id: 79, english: "not", uzbek: "emas / yo‘q" },
  { id: 80, english: "have", uzbek: "ega bo‘lmoq", synonym: "Possess" },
  { id: 81, english: "appeared", uzbek: "paydo bo‘lgan", synonym: "Emerged" },
  { id: 82, english: "newspapers", uzbek: "gazetalar", synonym: "Press" },
  { id: 83, english: "public", uzbek: "ommaviy", synonym: "General" },
  { id: 84, english: "celebrations", uzbek: "bayramlar", synonym: "Festivities" },
  { id: 85, english: "But", uzbek: "lekin", synonym: "However" },
  { id: 86, english: "extended", uzbek: "kengaydi / davom etdi", synonym: "Prolonged" },
  { id: 87, english: "through", uzbek: "orqali", synonym: "Via" },
  { id: 88, english: "generations", uzbek: "avlodlar", synonym: "Ages" },
  { id: 89, english: "March", uzbek: "mart" },
  { id: 90, english: "provides", uzbek: "taqdim etadi / beradi", synonym: "Offers" },
  { id: 91, english: "opportunity", uzbek: "imkoniyat", synonym: "Chance" },
  { id: 92, english: "recognize", uzbek: "tan olish", synonym: "Acknowledge" },
  { id: 93, english: "such", uzbek: "bunday", synonym: "Similar" },
  { id: 94, english: "contributions", uzbek: "hissalar", synonym: "Donations" },
  { id: 95, english: "Importance", uzbek: "ahamiyat", synonym: "Significance" },
  { id: 96, english: "Equality", uzbek: "tenglik", synonym: "Parity" },
  { id: 97, english: "Opportunity", uzbek: "imkoniyat", synonym: "Chance" },
  { id: 98, english: "Another", uzbek: "yana bir", synonym: "Additional" },
  { id: 99, english: "reason", uzbek: "sabab", synonym: "Cause" },
  { id: 100, english: "remains", uzbek: "qoladi", synonym: "Stays" },
  { id: 101, english: "meaningful", uzbek: "muhim / mazmunli", synonym: "Significant" },
  { id: 102, english: "involves", uzbek: "o‘z ichiga oladi", synonym: "Includes" },
  { id: 103, english: "continuing", uzbek: "davom etayotgan", synonym: "Ongoing" },
  { id: 104, english: "efforts", uzbek: "harakatlar", synonym: "Attempts" },
  { id: 105, english: "ensure", uzbek: "ta’minlamoq", synonym: "Guarantee" },
  { id: 106, english: "fair", uzbek: "adolatli", synonym: "Just" },
  { id: 107, english: "opportunities", uzbek: "imkoniyatlar", synonym: "Chances" },
  { id: 108, english: "for", uzbek: "uchun" },
  { id: 109, english: "women", uzbek: "ayollar", synonym: "Females" },
  { id: 110, english: "Although", uzbek: "garchi / bo‘lsa ham", synonym: "Even though" },
  { id: 111, english: "significant", uzbek: "muhim / katta", synonym: "Important" },
  { id: 112, english: "progress", uzbek: "taraqqiyot / rivojlanish", synonym: "Advancement" },
  { id: 113, english: "has", uzbek: "ega / (yordamchi fe’l)" },
  { id: 114, english: "occurred", uzbek: "sodir bo‘lgan", synonym: "Happened" },
  { id: 115, english: "challenges", uzbek: "muammolar / qiyinchiliklar", synonym: "Difficulties" },
  { id: 116, english: "remain", uzbek: "qolmoqda", synonym: "Stay" },
  { id: 117, english: "in", uzbek: "da" },
  { id: 118, english: "many", uzbek: "ko‘p", synonym: "Numerous" },
  { id: 119, english: "societies", uzbek: "jamiyatlar", synonym: "Communities" },
  { id: 120, english: "Education", uzbek: "ta’lim", synonym: "Schooling" },
  { id: 121, english: "employment", uzbek: "ish bilan ta’minlash / bandlik", synonym: "Jobs" },
  { id: 122, english: "and", uzbek: "va" },
  { id: 123, english: "leadership", uzbek: "yetakchilik", synonym: "Guidance" },
  { id: 124, english: "opportunities", uzbek: "imkoniyatlar", synonym: "Chances" },
  { id: 125, english: "must", uzbek: "kerak / lozim", synonym: "Should" },
  { id: 126, english: "remain", uzbek: "qolishi kerak", synonym: "Stay" },
  { id: 127, english: "accessible", uzbek: "ochiq / kirish mumkin", synonym: "Available" },
  { id: 128, english: "to", uzbek: "ga" },
  { id: 129, english: "everyone", uzbek: "hamma / har kim", synonym: "Everybody" },
  { id: 130, english: "regardless", uzbek: "qat’i nazar", synonym: "Despite" },
  { id: 131, english: "of", uzbek: "ning" },
  { id: 132, english: "gender", uzbek: "jins", synonym: "Sex" },
  { id: 133, english: "This", uzbek: "bu" },
  { id: 134, english: "effort", uzbek: "harakat", synonym: "Attempt" },
  { id: 135, english: "reflects", uzbek: "aks ettiradi", synonym: "Shows" },
  { id: 136, english: "equal", uzbek: "teng", synonym: "Even" },
  { id: 137, english: "opportunity", uzbek: "imkoniyat", synonym: "Chance" },
  { id: 138, english: "framework", uzbek: "tizim / asos", synonym: "Structure" },
  { id: 139, english: "the", uzbek: "(artikl)" },
  { id: 140, english: "principle", uzbek: "tamoyil / prinsip", synonym: "Rule" },
  { id: 141, english: "that", uzbek: "ki / shu" },
  { id: 142, english: "individuals", uzbek: "shaxslar / odamlar", synonym: "People" },
  { id: 143, english: "should", uzbek: "kerak / lozim", synonym: "Must" },
  { id: 144, english: "have", uzbek: "ega bo‘lishi", synonym: "Possess" },
  { id: 145, english: "equal", uzbek: "teng", synonym: "Uniform" },
  { id: 146, english: "chances", uzbek: "imkoniyatlar", synonym: "Opportunities" },
  { id: 147, english: "to", uzbek: "ga" },
  { id: 148, english: "develop", uzbek: "rivojlantirmoq", synonym: "Grow" },
  { id: 149, english: "their", uzbek: "ularning" },
  { id: 150, english: "abilities", uzbek: "qobiliyatlar", synonym: "Skills" },
  { id: 151, english: "and", uzbek: "va" },
  { id: 152, english: "pursue", uzbek: "erishishga intilmoq", synonym: "Seek" },
  { id: 153, english: "their", uzbek: "ularning" },
  { id: 154, english: "ambitions", uzbek: "orzular / maqsadlar", synonym: "Goals" },
  { id: 155, english: "When", uzbek: "qachon / -ganda" },
  { id: 156, english: "girls", uzbek: "qizlar", synonym: "Young women" },
  { id: 157, english: "receive", uzbek: "oladi / qabul qiladi", synonym: "Get" },
  { id: 158, english: "quality", uzbek: "sifatli", synonym: "Excellent" },
  { id: 159, english: "education", uzbek: "ta’lim", synonym: "Instruction" },
  { id: 160, english: "entire", uzbek: "butun", synonym: "Whole" },
  { id: 161, english: "communities", uzbek: "jamiyatlar / jamoalar", synonym: "Societies" },
  { id: 162, english: "benefit", uzbek: "foyda ko‘radi", synonym: "Profit" },
  { id: 163, english: "Educated", uzbek: "ta’lim olgan / o‘qimishli", synonym: "Learned" },
  { id: 164, english: "women", uzbek: "ayollar", synonym: "Ladies" },
  { id: 165, english: "contribute", uzbek: "hissa qo‘shadi", synonym: "Donate" },
  { id: 166, english: "to", uzbek: "ga" },
  { id: 167, english: "economic", uzbek: "iqtisodiy", synonym: "Financial" },
  { id: 168, english: "growth", uzbek: "o‘sish", synonym: "Expansion" },
  { id: 169, english: "improved", uzbek: "yaxshilangan", synonym: "Enhanced" },
  { id: 170, english: "healthcare", uzbek: "sog‘liqni saqlash", synonym: "Medical care" },
  { id: 171, english: "and", uzbek: "va" },
  { id: 172, english: "stronger", uzbek: "kuchliroq", synonym: "Sturdier" },
  { id: 173, english: "social", uzbek: "ijtimoiy", synonym: "Communal" },
  { id: 174, english: "institutions", uzbek: "institutlar / tashkilotlar", synonym: "Organizations" },
  { id: 175, english: "Equality", uzbek: "tenglik", synonym: "Fairness" },
  { id: 176, english: "is", uzbek: "dir / hisoblanadi" },
  { id: 177, english: "not", uzbek: "emas" },
  { id: 178, english: "merely", uzbek: "shunchaki / faqatgina", synonym: "Only" },
  { id: 179, english: "a", uzbek: "bir" },
  { id: 180, english: "moral", uzbek: "axloqiy", synonym: "Ethical" },
  { id: 181, english: "principle", uzbek: "tamoyil", synonym: "Tenet" },
  { id: 182, english: "It", uzbek: "u" },
  { id: 183, english: "is", uzbek: "dir" },
  { id: 184, english: "also", uzbek: "ham", synonym: "Too" },
  { id: 185, english: "a", uzbek: "bir" },
  { id: 186, english: "practical", uzbek: "amaliy", synonym: "Functional" },
  { id: 187, english: "foundation", uzbek: "asos", synonym: "Basis" },
  { id: 188, english: "for", uzbek: "uchun" },
  { id: 189, english: "societal", uzbek: "jamiyatga oid", synonym: "Social" },
  { id: 190, english: "progress", uzbek: "taraqqiyot / rivojlanish", synonym: "Growth" },
  { id: 191, english: "Celebrating", uzbek: "nishonlash", synonym: "Honoring" },
  { id: 192, english: "Strength", uzbek: "kuch", synonym: "Power" },
  { id: 193, english: "and", uzbek: "va" },
  { id: 194, english: "Resilience", uzbek: "chidamlilik / bardoshlilik", synonym: "Durability" },
  { id: 195, english: "Women", uzbek: "ayollar", synonym: "Females" },
  { id: 196, english: "have", uzbek: "ega / (yordamchi fe’l)" },
  { id: 197, english: "demonstrated", uzbek: "ko‘rsatdi / namoyish etdi", synonym: "Shown" },
  { id: 198, english: "remarkable", uzbek: "ajoyib / juda katta", synonym: "Extraordinary" },
  { id: 199, english: "resilience", uzbek: "chidamlilik", synonym: "Toughness" },
  { id: 200, english: "throughout", uzbek: "davomida / butun davomida", synonym: "During" },
  { id: 201, english: "history", uzbek: "tarix", synonym: "Past" },
  { id: 202, english: "From", uzbek: "dan" },
  { id: 203, english: "historical", uzbek: "tarixiy", synonym: "Ancient" },
  { id: 204, english: "leaders", uzbek: "yetakchilar", synonym: "Heads" },
  { id: 205, english: "and", uzbek: "va" },
  { id: 206, english: "scientists", uzbek: "olimlar", synonym: "Researchers" },
  { id: 207, english: "to", uzbek: "gacha" },
  { id: 208, english: "mothers", uzbek: "onalar", synonym: "Moms" },
  { id: 209, english: "balancing", uzbek: "muvozanatlab / birga olib borib", synonym: "Equilibrating" },
  { id: 210, english: "work", uzbek: "ish", synonym: "Labor" },
  { id: 211, english: "and", uzbek: "va" },
  { id: 212, english: "family", uzbek: "oila", synonym: "Household" },
  { id: 213, english: "responsibilities", uzbek: "mas’uliyatlar", synonym: "Duties" },
  { id: 214, english: "women", uzbek: "ayollar", synonym: "Females" },
  { id: 215, english: "have", uzbek: "ega / (yordamchi fe’l)" },
  { id: 216, english: "continuously", uzbek: "doimiy ravishda", synonym: "Constantly" },
  { id: 217, english: "adapted", uzbek: "moslashdi", synonym: "Adjusted" },
  { id: 218, english: "to", uzbek: "ga" },
  { id: 219, english: "challenges", uzbek: "qiyinchiliklar", synonym: "Difficulties" },
  { id: 220, english: "while", uzbek: "shu bilan birga", synonym: "Whereas" },
  { id: 221, english: "supporting", uzbek: "qo‘llab-quvvatlab", synonym: "Helping" },
  { id: 222, english: "others", uzbek: "boshqalar", synonym: "People" },
  { id: 223, english: "This", uzbek: "bu" },
  { id: 224, english: "resilience", uzbek: "chidamlilik", synonym: "Endurance" },
  { id: 225, english: "represents", uzbek: "ifodalaydi / bildiradi", synonym: "Symbolizes" },
  { id: 226, english: "resilience-driven", uzbek: "chidamlilikka asoslangan", synonym: "Toughness-based" },
  { id: 227, english: "leadership", uzbek: "yetakchilik", synonym: "Management" },
  { id: 228, english: "the", uzbek: "(artikl)" },
  { id: 229, english: "ability", uzbek: "qobiliyat", synonym: "Capacity" },
  { id: 230, english: "to", uzbek: "ga" },
  { id: 231, english: "guide", uzbek: "boshqarmoq / yo‘l ko‘rsatmoq", synonym: "Lead" },
  { id: 232, english: "families", uzbek: "oilalar", synonym: "Homes" },
  { id: 233, english: "and", uzbek: "va" },
  { id: 234, english: "communities", uzbek: "jamoalar", synonym: "Societies" },
  { id: 235, english: "through", uzbek: "orqali", synonym: "By way of" },
  { id: 236, english: "adversity", uzbek: "qiyinchilik / musibat", synonym: "Hardship" },
  { id: 237, english: "with", uzbek: "bilan" },
  { id: 238, english: "determination", uzbek: "qat’iyat", synonym: "Resolve" },
  { id: 239, english: "and", uzbek: "va" },
  { id: 240, english: "compassion", uzbek: "mehr-shafqat", synonym: "Empathy" },
  { id: 241, english: "In", uzbek: "da" },
  { id: 242, english: "times", uzbek: "vaqtlar / davrlar", synonym: "Eras" },
  { id: 243, english: "of", uzbek: "ning" },
  { id: 244, english: "crisis", uzbek: "inqiroz", synonym: "Emergency" },
  { id: 245, english: "economic", uzbek: "iqtisodiy", synonym: "Financial" },
  { id: 246, english: "difficulties", uzbek: "qiyinchiliklar", synonym: "Hardships" },
  { id: 247, english: "health", uzbek: "sog‘liq", synonym: "Well-being" },
  { id: 248, english: "challenges", uzbek: "muammolar", synonym: "Issues" },
  { id: 249, english: "or", uzbek: "yoki" },
  { id: 250, english: "social", uzbek: "ijtimoiy", synonym: "Public" },
  { id: 251, english: "upheaval", uzbek: "beqarorlik / o‘zgarishlar", synonym: "Disturbance" },
  { id: 252, english: "women", uzbek: "ayollar", synonym: "Ladies" },
  { id: 253, english: "often", uzbek: "ko‘pincha", synonym: "Regularly" },
  { id: 254, english: "serve", uzbek: "xizmat qiladi / bo‘ladi", synonym: "Act" }
];

export default function App() {
  const [search, setSearch] = useState('');
  const [hideTranslations, setHideTranslations] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<number>>(new Set());
  const [learnedIds, setLearnedIds] = useState<Set<number>>(new Set());

  const filteredWords = useMemo(() => {
    return WORD_DATA.filter(w => 
      w.english.toLowerCase().startsWith(search.toLowerCase()) ||
      w.uzbek.toLowerCase().startsWith(search.toLowerCase())
    );
  }, [search]);

  const toggleReveal = (id: number) => {
    const next = new Set(revealedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setRevealedIds(next);
  };

  const toggleLearned = (id: number) => {
    const next = new Set(learnedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setLearnedIds(next);
  };

  const resetProgress = () => {
    if (confirm('Barcha natijalarni o\'chirib yubormoqchimisiz?')) {
      setLearnedIds(new Set());
      setRevealedIds(new Set());
    }
  };

  // Generate rain drops - optimized for mobile
  const rainDrops = useMemo(() => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const count = isMobile ? 40 : 120; // Fewer drops on mobile for performance
    
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${0.4 + Math.random() * 0.8}s`,
      delay: `${Math.random() * 2}s`,
      opacity: 0.2 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div className="relative min-h-screen text-[#1a1a1a] font-sans selection:bg-emerald-100 overflow-x-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 z-0 bg-cover bg-center bg-fixed transition-transform duration-1000 scale-105"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=3540&auto=format&fit=crop')`,
          filter: 'brightness(0.7) contrast(1.2) saturate(1.2)'
        }}
      />
      
      {/* Rain Effect */}
      <div className="rain-container">
        {rainDrops.map((drop) => (
          <div
            key={drop.id}
            className="rain-drop"
            style={{
              left: drop.left,
              animationDuration: drop.duration,
              animationDelay: drop.delay,
              opacity: drop.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        {/* Creator Credit */}
        <div className="bg-emerald-600/90 backdrop-blur-sm text-white py-2 px-4 text-center font-bold tracking-[0.2em] text-[10px] uppercase shadow-inner">
          YARATUVCHI: SODIQJON MUKHTOROV
        </div>

        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/40 backdrop-blur-xl border-b border-white/20 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight">Leksika</h1>
              <p className="text-xs text-black/40 uppercase tracking-widest font-medium">So'z yodlash yordamchisi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHideTranslations(!hideTranslations)}
              className={`p-2 rounded-xl transition-all ${hideTranslations ? 'bg-emerald-600 text-white shadow-md' : 'bg-black/5 text-black/60 hover:bg-black/10'}`}
              title={hideTranslations ? "Tarjimalarni ko'rsatish" : "Tarjimalarni yashirish"}
            >
              {hideTranslations ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={resetProgress}
              className="p-2 rounded-xl bg-black/5 text-black/60 hover:bg-black/10 transition-all"
              title="Progressni tiklash"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-xs text-black/40 uppercase tracking-wider font-bold mb-1">Jami so'zlar</p>
            <p className="text-2xl font-light">{WORD_DATA.length}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-xs text-black/40 uppercase tracking-wider font-bold mb-1">Yodlandi</p>
            <p className="text-2xl font-light text-emerald-700">{learnedIds.size}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-xs text-black/40 uppercase tracking-wider font-bold mb-1">Qoldi</p>
            <p className="text-2xl font-light text-orange-600">{WORD_DATA.length - learnedIds.size}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl">
            <p className="text-xs text-black/40 uppercase tracking-wider font-bold mb-1">Progress</p>
            <p className="text-2xl font-light">{Math.round((learnedIds.size / WORD_DATA.length) * 100)}%</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-black/30" size={20} />
          <input
            type="text"
            placeholder="Qidirish (bosh harflar bo'yicha)..."
            className="w-full pl-12 pr-4 py-3 bg-white/60 backdrop-blur-md border border-white/30 rounded-2xl shadow-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-base"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Word Table */}
        <div className="glass-panel rounded-3xl overflow-hidden">
          <div className="grid grid-cols-[40px_1fr_1fr_60px] bg-black/5 border-b border-white/20 px-6 py-3">
            <div className="text-[10px] uppercase tracking-widest font-bold text-black/30">#</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-black/30">Inglizcha</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-black/30">O'zbekcha</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-black/30 text-right">Holat</div>
          </div>

          <div className="divide-y divide-black/5">
            <AnimatePresence mode="popLayout">
              {filteredWords.map((word, index) => {
                const isHidden = hideTranslations && !revealedIds.has(word.id);
                const isLearned = learnedIds.has(word.id);
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

                return (
                  <motion.div
                    layout={!isMobile} // Disable layout transitions on mobile to save performance
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={word.id}
                    className={`grid grid-cols-[40px_1fr_1fr_60px] items-center px-6 py-4 hover:bg-black/[0.01] transition-colors group ${isLearned ? 'bg-emerald-50/30' : ''}`}
                  >
                    <div className="text-xs font-mono text-black/20">{word.id}</div>
                    <div className={`text-sm font-medium ${isLearned ? 'text-black/40 line-through' : 'text-black'}`}>
                      {word.english}
                      {word.synonym && (
                        <div className="text-[10px] text-black/40 font-normal italic mt-0.5">
                          Synonym: {word.synonym}
                        </div>
                      )}
                    </div>
                    <div 
                      className={`text-sm cursor-pointer transition-all duration-300 ${isHidden ? 'blur-md select-none opacity-30' : 'text-black/60'}`}
                      onClick={() => hideTranslations && toggleReveal(word.id)}
                    >
                      {word.uzbek}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => toggleLearned(word.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLearned ? 'bg-emerald-100 text-emerald-600' : 'bg-black/5 text-black/20 hover:bg-black/10 hover:text-black/40'}`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredWords.length === 0 && (
              <div className="p-12 text-center">
                <p className="text-black/40 text-sm italic">Hech narsa topilmadi...</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-4xl mx-auto p-6 text-center">
        <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold drop-shadow-md">
          Yaratuvchi: SODIQJON MUKHTOROV &bull; 2026
        </p>
      </footer>
      </div>
    </div>
  );
}
