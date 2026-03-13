import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, Eye, EyeOff, BookOpen, CheckCircle2, RotateCcw, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface WordEntry {
  id: number;
  english: string;
  uzbek: string;
  synonym?: string;
}

// --- Background Scene Components ---

const BackgroundGame = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowParticles = useRef<{ x: number, y: number, size: number, speed: number }[]>([]);
  const frameId = useRef(0);
  const shovelAngle = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Initialize snow - reduced for mobile performance
      const particleCount = window.innerWidth < 768 ? 80 : 150;
      snowParticles.current = Array.from({ length: particleCount }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 1 + 0.5
      }));
    };
    window.addEventListener('resize', resize);
    resize();

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw Dark Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Distant Hills (Darker)
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height * 0.75);
      ctx.quadraticCurveTo(canvas.width * 0.25, canvas.height * 0.65, canvas.width * 0.5, canvas.height * 0.75);
      ctx.quadraticCurveTo(canvas.width * 0.75, canvas.height * 0.85, canvas.width, canvas.height * 0.75);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.fill();

      // Draw Village Houses (Simplified for performance)
      const drawHouse = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        
        ctx.fillStyle = '#334155';
        ctx.fillRect(-25, -35, 50, 35);
        
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.moveTo(-35, -35);
        ctx.lineTo(0, -60);
        ctx.lineTo(35, -35);
        ctx.fill();
        
        ctx.fillStyle = '#fef08a'; // Glowing window
        ctx.fillRect(-10, -20, 8, 8);
        
        ctx.restore();
      };

      if (window.innerWidth > 768) {
        drawHouse(canvas.width * 0.2, canvas.height * 0.8, 0.8);
        drawHouse(canvas.width * 0.8, canvas.height * 0.85, 1);
      }
      drawHouse(canvas.width * 0.5, canvas.height * 0.7, 0.6);

      // Draw Trees
      const drawTree = (x: number, y: number, scale: number) => {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.fillStyle = '#020617';
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(0, -35);
        ctx.lineTo(15, 0);
        ctx.fill();
        ctx.restore();
      };

      drawTree(canvas.width * 0.15, canvas.height * 0.85, 1.2);
      drawTree(canvas.width * 0.85, canvas.height * 0.9, 1.5);

      // Draw Person Shoveling Snow
      const personX = canvas.width * 0.4;
      const personY = canvas.height * 0.88;
      shovelAngle.current = Math.sin(time * 0.003) * 0.5;

      ctx.save();
      ctx.translate(personX, personY);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(0, -25); // Torso
      ctx.moveTo(0, -25); ctx.lineTo(-8, -12); // Arm
      ctx.moveTo(0, -25); ctx.lineTo(12, -12); // Arm
      ctx.moveTo(0, 0); ctx.lineTo(-8, 12); // Leg
      ctx.moveTo(0, 0); ctx.lineTo(8, 12); // Leg
      ctx.stroke();
      
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath(); ctx.arc(0, -30, 5, 0, Math.PI * 2); ctx.fill();

      ctx.save();
      ctx.translate(12, -12);
      ctx.rotate(shovelAngle.current);
      ctx.strokeStyle = '#94a3b8';
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(15, 15); ctx.stroke();
      ctx.fillStyle = '#64748b';
      ctx.fillRect(12, 12, 12, 8);
      ctx.restore();
      ctx.restore();

      // Draw Snow Particles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      snowParticles.current.forEach(p => {
        p.y += p.speed;
        p.x += Math.sin(time * 0.001 + p.y * 0.01) * 0.3;
        if (p.y > canvas.height) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      frameId.current = requestAnimationFrame(animate);
    };

    frameId.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="game-container">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
};

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
  { id: 254, english: "serve", uzbek: "xizmat qiladi / bo‘ladi", synonym: "Act" },
  { id: 255, english: "children", uzbek: "bolalar" },
  { id: 256, english: "learn", uzbek: "o‘rganmoq" },
  { id: 257, english: "values", uzbek: "qadriyatlar" },
  { id: 258, english: "primarily", uzbek: "asosan" },
  { id: 259, english: "through", uzbek: "orqali" },
  { id: 260, english: "observation", uzbek: "kuzatish" },
  { id: 261, english: "when", uzbek: "qachon" },
  { id: 262, english: "they", uzbek: "ular" },
  { id: 263, english: "witness", uzbek: "guvoh bo‘lmoq / ko‘rmoq" },
  { id: 264, english: "adults", uzbek: "kattalar" },
  { id: 265, english: "treating", uzbek: "munosabatda bo‘lish" },
  { id: 266, english: "women", uzbek: "ayollar" },
  { id: 267, english: "with", uzbek: "bilan" },
  { id: 268, english: "kindness", uzbek: "mehribonlik" },
  { id: 269, english: "fairness", uzbek: "adolat" },
  { id: 270, english: "and", uzbek: "va" },
  { id: 271, english: "dignity", uzbek: "qadr-qimmat" },
  { id: 272, english: "those", uzbek: "o‘sha" },
  { id: 273, english: "behaviors", uzbek: "xatti-harakatlar" },
  { id: 274, english: "become", uzbek: "bo‘lib qoladi" },
  { id: 275, english: "normalized", uzbek: "odatiy holga aylanadi" },
  { id: 276, english: "this", uzbek: "bu" },
  { id: 277, english: "process", uzbek: "jarayon" },
  { id: 278, english: "demonstrates", uzbek: "ko‘rsatadi / namoyon qiladi" },
  { id: 279, english: "intergenerational", uzbek: "avlodlararo" },
  { id: 280, english: "value", uzbek: "qadriyat" },
  { id: 281, english: "transmission", uzbek: "uzatish / o‘tkazish" },
  { id: 282, english: "the", uzbek: "(artikl)" },
  { id: 283, english: "transfer", uzbek: "o‘tkazish" },
  { id: 284, english: "ethical", uzbek: "axloqiy" },
  { id: 285, english: "principles", uzbek: "tamoyillar" },
  { id: 286, english: "from", uzbek: "dan" },
  { id: 287, english: "one", uzbek: "bir" },
  { id: 288, english: "generation", uzbek: "avlod" },
  { id: 289, english: "to", uzbek: "ga" },
  { id: 290, english: "the", uzbek: "(artikl)" },
  { id: 291, english: "next", uzbek: "keyingi" },
  { id: 292, english: "schools", uzbek: "maktablar" },
  { id: 293, english: "families", uzbek: "oilalar" },
  { id: 294, english: "both", uzbek: "ikkalasi ham" },
  { id: 295, english: "play", uzbek: "rol o‘ynamoq" },
  { id: 296, english: "important", uzbek: "muhim" },
  { id: 297, english: "roles", uzbek: "rollar" },
  { id: 298, english: "in", uzbek: "da" },
  { id: 299, english: "this", uzbek: "bu" },
  { id: 300, english: "process", uzbek: "jarayon" },
  { id: 301, english: "teaching", uzbek: "o‘rgatish" },
  { id: 302, english: "boys", uzbek: "o‘g‘il bolalar" },
  { id: 303, english: "to", uzbek: "ga" },
  { id: 304, english: "respect", uzbek: "hurmat qilmoq" },
  { id: 305, english: "girls", uzbek: "qizlar" },
  { id: 306, english: "and", uzbek: "va" },
  { id: 307, english: "teaching", uzbek: "o‘rgatish" },
  { id: 308, english: "girls", uzbek: "qizlar" },
  { id: 309, english: "to", uzbek: "ga" },
  { id: 310, english: "value", uzbek: "qadrlamoq" },
  { id: 311, english: "their", uzbek: "ularning" },
  { id: 312, english: "own", uzbek: "o‘z" },
  { id: 313, english: "abilities", uzbek: "qobiliyatlar" },
  { id: 314, english: "creates", uzbek: "yaratadi" },
  { id: 315, english: "healthier", uzbek: "sog‘lomroq" },
  { id: 316, english: "societies", uzbek: "jamiyatlar" },
  { id: 317, english: "respect", uzbek: "hurmat" },
  { id: 318, english: "begins", uzbek: "boshlanadi" },
  { id: 319, english: "early", uzbek: "erta" },
  { id: 320, english: "cultural", uzbek: "madaniy" },
  { id: 321, english: "celebrations", uzbek: "bayramlar" },
  { id: 322, english: "and", uzbek: "va" },
  { id: 323, english: "appreciation", uzbek: "qadrlash" },
  { id: 324, english: "in", uzbek: "da" },
  { id: 325, english: "many", uzbek: "ko‘p" },
  { id: 326, english: "countries", uzbek: "davlatlar" },
  { id: 327, english: "march", uzbek: "mart" },
  { id: 328, english: "includes", uzbek: "o‘z ichiga oladi" },
  { id: 329, english: "traditions", uzbek: "an’analar" },
  { id: 330, english: "such", uzbek: "kabi" },
  { id: 331, english: "as", uzbek: "sifatida" },
  { id: 332, english: "giving", uzbek: "berish" },
  { id: 333, english: "flowers", uzbek: "gullar" },
  { id: 334, english: "organizing", uzbek: "tashkil qilish" },
  { id: 335, english: "community", uzbek: "jamiyat" },
  { id: 336, english: "events", uzbek: "tadbirlar" },
  { id: 337, english: "or", uzbek: "yoki" },
  { id: 338, english: "expressing", uzbek: "ifoda etish" },
  { id: 339, english: "gratitude", uzbek: "minnatdorchilik" },
  { id: 340, english: "through", uzbek: "orqali" },
  { id: 341, english: "messages", uzbek: "xabarlar" },
  { id: 342, english: "and", uzbek: "va" },
  { id: 343, english: "gatherings", uzbek: "yig‘ilishlar / uchrashuvlar" },
  { id: 344, english: "these", uzbek: "bu" },
  { id: 345, english: "practices", uzbek: "amaliyotlar" },
  { id: 346, english: "represent", uzbek: "ifodalaydi" },
  { id: 347, english: "symbolic", uzbek: "ramziy" },
  { id: 348, english: "cultural", uzbek: "madaniy" },
  { id: 349, english: "appreciation", uzbek: "qadrlash" },
  { id: 350, english: "rituals", uzbek: "marosimlar" },
  { id: 351, english: "that", uzbek: "ki" },
  { id: 352, english: "communicate", uzbek: "yetkazadi / bildiradi" },
  { id: 353, english: "respect", uzbek: "hurmat" },
  { id: 354, english: "and", uzbek: "va" },
  { id: 355, english: "gratitude", uzbek: "minnatdorchilik" },
  { id: 356, english: "while", uzbek: "garchi" },
  { id: 357, english: "symbolic", uzbek: "ramziy" },
  { id: 358, english: "gestures", uzbek: "ishoralar" },
  { id: 359, english: "alone", uzbek: "yolg‘iz / o‘zi" },
  { id: 360, english: "cannot", uzbek: "qila olmaydi" },
  { id: 361, english: "guarantee", uzbek: "kafolatlamoq" },
  { id: 362, english: "equality", uzbek: "tenglik" },
  { id: 363, english: "they", uzbek: "ular" },
  { id: 364, english: "serve", uzbek: "xizmat qiladi" },
  { id: 365, english: "as", uzbek: "sifatida" },
  { id: 366, english: "reminders", uzbek: "eslatmalar" },
  { id: 367, english: "they", uzbek: "ular" },
  { id: 368, english: "prompt", uzbek: "undamoq / sabab bo‘lmoq" },
  { id: 369, english: "reflection", uzbek: "o‘ylash / mulohaza" },
  { id: 370, english: "on", uzbek: "haqida" },
  { id: 371, english: "the", uzbek: "(artikl)" },
  { id: 372, english: "roles", uzbek: "rollar" },
  { id: 373, english: "women", uzbek: "ayollar" },
  { id: 374, english: "play", uzbek: "rol o‘ynamoq" },
  { id: 375, english: "in", uzbek: "da" },
  { id: 376, english: "everyday", uzbek: "kundalik" },
  { id: 377, english: "life", uzbek: "hayot" },
  { id: 378, english: "they", uzbek: "ular" },
  { id: 379, english: "encourage", uzbek: "rag‘batlantirmoq" },
  { id: 380, english: "people", uzbek: "odamlar" },
  { id: 381, english: "to", uzbek: "ga" },
  { id: 382, english: "pause", uzbek: "to‘xtamoq" },
  { id: 383, english: "and", uzbek: "va" },
  { id: 384, english: "say", uzbek: "aytmoq" },
  { id: 385, english: "something", uzbek: "nimadir" },
  { id: 386, english: "that", uzbek: "ki" },
  { id: 387, english: "should", uzbek: "kerak" },
  { id: 388, english: "perhaps", uzbek: "ehtimol" },
  { id: 389, english: "be", uzbek: "bo‘lishi" },
  { id: 390, english: "said", uzbek: "aytilgan" },
  { id: 391, english: "more", uzbek: "ko‘proq" },
  { id: 392, english: "often", uzbek: "tez-tez" },
  { id: 393, english: "thank", uzbek: "rahmat" },
  { id: 394, english: "you", uzbek: "siz" },
  { id: 395, english: "the", uzbek: "(artikl)" },
  { id: 396, english: "deeper", uzbek: "chuqurroq" },
  { id: 397, english: "meaning", uzbek: "ma’no" },
  { id: 398, english: "of", uzbek: "ning" },
  { id: 399, english: "celebration", uzbek: "bayram" },
  { id: 400, english: "celebration", uzbek: "bayram" },
  { id: 401, english: "does", uzbek: "qiladi" },
  { id: 402, english: "not", uzbek: "emas" },
  { id: 403, english: "mean", uzbek: "anglatadi" },
  { id: 404, english: "perfection", uzbek: "mukammallik" },
  { id: 405, english: "no", uzbek: "hech qaysi" },
  { id: 406, english: "society", uzbek: "jamiyat" },
  { id: 407, english: "has", uzbek: "ega" },
  { id: 408, english: "completely", uzbek: "butunlay" },
  { id: 409, english: "eliminated", uzbek: "yo‘q qilgan" },
  { id: 410, english: "injustice", uzbek: "adolatsizlik" },
  { id: 411, english: "or", uzbek: "yoki" },
  { id: 412, english: "inequality", uzbek: "tengsizlik" },
  { id: 413, english: "but", uzbek: "lekin" },
  { id: 414, english: "acknowledging", uzbek: "tan olish" },
  { id: 415, english: "progress", uzbek: "taraqqiyot" },
  { id: 416, english: "and", uzbek: "va" },
  { id: 417, english: "recognizing", uzbek: "tan olish" },
  { id: 418, english: "contributions", uzbek: "hissalar" },
  { id: 419, english: "creates", uzbek: "yaratadi" },
  { id: 420, english: "motivation", uzbek: "motivatsiya" },
  { id: 421, english: "for", uzbek: "uchun" },
  { id: 422, english: "continued", uzbek: "davom etadigan" },
  { id: 423, english: "improvement", uzbek: "yaxshilanish" },
  { id: 424, english: "march", uzbek: "mart" },
  { id: 425, english: "encourages", uzbek: "rag‘batlantiradi" },
  { id: 426, english: "reflection", uzbek: "o‘ylash" },
  { id: 427, english: "on", uzbek: "haqida" },
  { id: 428, english: "both", uzbek: "ikkalasi ham" },
  { id: 429, english: "achievements", uzbek: "yutuqlar" },
  { id: 430, english: "and", uzbek: "va" },
  { id: 431, english: "responsibilities", uzbek: "mas’uliyatlar" },
  { id: 432, english: "it", uzbek: "u" },
  { id: 433, english: "reminds", uzbek: "eslatadi" },
  { id: 434, english: "us", uzbek: "bizga" },
  { id: 435, english: "that", uzbek: "ki" },
  { id: 436, english: "respect", uzbek: "hurmat" },
  { id: 437, english: "should", uzbek: "kerak" },
  { id: 438, english: "not", uzbek: "emas" },
  { id: 439, english: "be", uzbek: "bo‘lishi" },
  { id: 440, english: "conditional", uzbek: "shartli" },
  { id: 441, english: "or", uzbek: "yoki" },
  { id: 442, english: "temporary", uzbek: "vaqtinchalik" },
  { id: 443, english: "it", uzbek: "u" },
  { id: 444, english: "should", uzbek: "kerak" },
  { id: 445, english: "be", uzbek: "bo‘lishi" },
  { id: 446, english: "consistent", uzbek: "doimiy / barqaror" }
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

  return (
    <div className="relative min-h-screen text-[#1a1a1a] font-sans selection:bg-emerald-100 overflow-x-hidden">
      {/* Background Game Layer */}
      <BackgroundGame />

      <div className="relative z-10">
        {/* Creator Credit */}
        <div className="bg-emerald-600/90 backdrop-blur-sm text-white py-2 px-4 text-center font-bold tracking-[0.2em] text-[10px] uppercase shadow-inner">
          YARATUVCHI: SODIQJON MUKHTOROV
        </div>

        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/10 backdrop-blur-xl border-b border-white/10 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-white drop-shadow-md">Leksika</h1>
              <p className="text-xs text-white/60 uppercase tracking-widest font-medium drop-shadow-sm">So'z yodlash yordamchisi</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHideTranslations(!hideTranslations)}
              className={`p-2 rounded-xl transition-all ${hideTranslations ? 'bg-emerald-600 text-white shadow-md' : 'bg-white/10 text-white/60 hover:bg-white/20'}`}
              title={hideTranslations ? "Tarjimalarni ko'rsatish" : "Tarjimalarni yashirish"}
            >
              {hideTranslations ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            <button
              onClick={resetProgress}
              className="p-2 rounded-xl bg-white/10 text-white/60 hover:bg-white/20 transition-all"
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
          <div className="glass-panel p-4 rounded-2xl border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Jami so'zlar</p>
            <p className="text-2xl font-light text-white">{WORD_DATA.length}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Yodlandi</p>
            <p className="text-2xl font-light text-emerald-400">{learnedIds.size}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Qoldi</p>
            <p className="text-2xl font-light text-orange-400">{WORD_DATA.length - learnedIds.size}</p>
          </div>
          <div className="glass-panel p-4 rounded-2xl border-white/10">
            <p className="text-xs text-white/40 uppercase tracking-wider font-bold mb-1">Progress</p>
            <p className="text-2xl font-light text-white">{Math.round((learnedIds.size / WORD_DATA.length) * 100)}%</p>
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
          <input
            type="text"
            placeholder="Qidirish (bosh harflar bo'yicha)..."
            className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-lg focus:ring-2 focus:ring-emerald-500 transition-all outline-none text-base text-white placeholder:text-white/20"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Word Table */}
        <div className="glass-panel rounded-3xl overflow-hidden border-white/10">
          <div className="grid grid-cols-[40px_1fr_1fr_60px] bg-white/5 border-b border-white/10 px-6 py-3">
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/30">#</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/30">Inglizcha</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/30">O'zbekcha</div>
            <div className="text-[10px] uppercase tracking-widest font-bold text-white/30 text-right">Holat</div>
          </div>

          <div className="divide-y divide-white/5">
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
                    className={`grid grid-cols-[40px_1fr_1fr_60px] items-center px-6 py-4 hover:bg-white/5 transition-colors group ${isLearned ? 'bg-emerald-500/10' : ''}`}
                  >
                    <div className="text-xs font-mono text-white/20">{word.id}</div>
                    <div className={`text-sm font-medium ${isLearned ? 'text-white/30 line-through' : 'text-white'}`}>
                      {word.english}
                      {word.synonym && (
                        <div className="text-[10px] text-white/30 font-normal italic mt-0.5">
                          Synonym: {word.synonym}
                        </div>
                      )}
                    </div>
                    <div 
                      className={`text-sm cursor-pointer transition-all duration-300 ${isHidden ? 'blur-md select-none opacity-30' : 'text-white/70'}`}
                      onClick={() => hideTranslations && toggleReveal(word.id)}
                    >
                      {word.uzbek}
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => toggleLearned(word.id)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isLearned ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-white/20 hover:bg-white/10 hover:text-white/40'}`}
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
                <p className="text-white/30 text-sm italic">Hech narsa topilmadi...</p>
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
