/**
 * QuickPanel Pro – v13
 * تطبيق تعديل الكويك بانيل لهواتف سامسونج
 * التحديثات: مشاريع بدون خلفية، خلفيات كبسولات متقدمة، ألوان نصوص وأيقونات، معاينة حية
 */

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import localforage from "localforage";
import { createPortal } from "react-dom";

// ── أيقونات SVG ─────────────────────────────
const SVGIcons = {
  Home: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Settings: () => <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Edit: ({ size = 14 }) => <svg viewBox="0 0 24 24" width={size} height={size} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Delete: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>,
  Folder: () => <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>,
  Projects: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Search: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Check: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  Undo: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>,
  Export: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Moon: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Sun: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
  Crop: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M6.13 1L6 16a2 2 0 0 0 2 2h15"/><path d="M1 6.13L16 6a2 2 0 0 1 2 2v15"/></svg>,
  Sparkle: () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Info: () => <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Image: () => <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
  Trash: () => <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>,
  Palette: () => <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>,
  Toggle: ({ on }) => (<svg viewBox="0 0 44 24" width="36" height="20"> <rect x="0" y="0" width="44" height="24" rx="12" fill={on ? "#d97736" : "rgba(255,255,255,0.15)"}/> <circle cx={on ? 32 : 12}cy="12"r="9"fill="white"style={{ transition: "cx 0.25s ease" }}/> </svg>),
  Close: () => <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Upload: () => <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
};

// ── TooltipButton ──────────────────────────
function TooltipButton({ text, top, right, bottom, left }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [isOpen]);
  const rect = containerRef.current?.getBoundingClientRect();
  return (
    <div ref={containerRef} style={{ position:"absolute", top, right, bottom, left, zIndex:9000 }}>
      <button onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
        style={{ width:26, height:26, borderRadius:"50%", background:"rgba(255,255,255,0.08)", border:"1px solid rgba(255,255,255,0.15)", backdropFilter:"blur(12px)", WebkitBackdropFilter:"blur(12px)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", boxShadow:"0 4px 12px rgba(0,0,0,0.2)", transition:"all 0.2s ease" }}>
        <SVGIcons.Info />
      </button>
      {isOpen && rect && createPortal(
        <div style={{ position:"fixed", top:Math.min(Math.max(rect.top+30,20),window.innerHeight-150), left:Math.min(Math.max(rect.left-120,20),window.innerWidth-300), background:"rgba(20,22,28,0.95)", backdropFilter:"blur(24px) saturate(1.5)", WebkitBackdropFilter:"blur(24px) saturate(1.5)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:16, padding:"12px 18px", color:"#fff", fontSize:13, fontWeight:500, width:"240px", textAlign:"center", boxShadow:"0 15px 40px rgba(0,0,0,0.5)", animation:"popIn 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275)", zIndex:99999 }}>
          {text}
        </div>,
        document.body
      )}
    </div>
  );
}

// ── ثوابت ──────────────────────────────────
const ICONS = [
  "Always_On_Display.png","Audio_broadcast.png","Battery_protection.png",
  "Bluetooth_hearing_aids.png","bluetooth.png","Call_and_text_on_other_devices.png",
  "Camera_access.png","Color_correction.png","Color_filter.png","Color_inversion.png",
  "Create_note.png","Diagnostics.png","Do_not_disturb.png","Dolby_Atmos.png",
  "Edge_touch.png","Emergency_shearing.png","Extra_dim.png","Eye_comfort_shield.png",
  "Finder.png","flash.png","flight_mode.png","high_contrast_font.png","hotspot.png",
  "Interpreter.png","Keep_screen_on.png","Kids.png","Link_to_windows.png",
  "Live_caption.png","Live_transcribe.png","Location.png","microphone_access.png",
  "mobile_data.png","modes.png","Multi_control.png","Music_share.png",
  "nearby_devices.png","NFC.png","One_hand_options.png","Performance_profile.png",
  "Portrait.png","Power_saving.png","quick_share.png","smart_view.png",
  "Scan_QR_code.png","Screen_curtain.png","Screen_recording.png","Secure_folder.png",
  "Song_search.png","Sound_navigation.png","Spen_air_actions.png","Sync.png",
  "Take_screenshot.png","wallet.png","Wi-Fi_Calling.png","wifi.png",
  "Wireless_DeX.png","Wireless_power_sharing.png","smart_things.png",
];

const getInitialLayout = (t) => [
  { id:"1",  col:1, colSpan:2, row:1, rowSpan:1, icon:"wifi.png",            label:t.wificap },
  { id:"2",  col:3, colSpan:2, row:1, rowSpan:1, icon:"bluetooth.png",       label:t.bluetoothcap },
  { id:"3",  col:1, colSpan:4, row:2, rowSpan:2, icon:null,                  label:"" },
  { id:"4",  col:1, colSpan:4, row:4, rowSpan:1, icon:null,                  label:"" },
  { id:"5",  col:1, colSpan:4, row:5, rowSpan:1, icon:null,                  label:"" },
  { id:"6",  col:1, colSpan:4, row:6, rowSpan:1, icon:null,                  label:t.musiccap },
  { id:"7",  col:1, colSpan:2, row:7, rowSpan:1, icon:"smart_view.png",      label:"Smart View" },
  { id:"8",  col:3, colSpan:2, row:7, rowSpan:1, icon:"modes.png",           label:t.rootencap },
  { id:"9",  col:1, colSpan:2, row:8, rowSpan:1, icon:"nearby_devices.png",  label:t.nearbycap },
  { id:"10", col:3, colSpan:2, row:8, rowSpan:1, icon:"smart_things.png",    label:"SmartThings" },
];

// الخلفية الافتراضية للكبسولة
const DEFAULT_CAPSULE_STYLE = {
  bgType: "global",        // "global" | "solid" | "gradient" | "frosted" | "clear" | "image"
  bgColor1: "#ffffff",
  bgColor2: "#888888",
  bgGradientDir: "135deg",
  bgImage: null,
  bgOpacity: 0.18,
  iconColor: "#ffffff",
  iconColorType: "solid",  // "solid" | "gradient"
  iconColor2: "#f0a060",
  iconOpacity: 1,
  textColor: "#ffffff",
  textColorType: "solid",
  textColor2: "#f0a060",
  textOpacity: 1,
  showIconBg: true,
  iconBgColor: "#ffffff",
  iconBgColorType: "solid",
  iconBgColor2: "#f0a060",
  iconBgOpacity: 0.18,
};

const COLS    = 4;
const CELL_W  = 109; 
const CELL_H  = 100;
const GAP_EX  = 12;
const CELL_EX = CELL_H;
const LONG_PRESS_MS = 400;
const LONG_PRESS_MOVE = 8;
const iconLabel = (n) => (n ? n.replace(/\.png$/i,"").replace(/_/g," ") : "");

const THEMES = {
  dark: {
    bg:"linear-gradient(145deg,#0e0c0a 0%,#17110e 40%,#1a1208 70%,#0f0e14 100%)",
    bgSolid:"#0f0d0b", surface:"rgba(35,27,22,0.72)", accent:"#d97736",
    accentGlow:"rgba(217,119,54,0.18)", accentGlow2:"rgba(217,119,54,0.08)",
    text:"#ffffff", textMuted:"rgba(255,255,255,0.55)", danger:"#e74c3c",
    border:"rgba(255,255,255,0.07)", borderHover:"rgba(255,255,255,0.18)",
    modalBg:"rgba(22,17,14,0.92)", modalGlow:"rgba(217,119,54,0.12)",
    gradOrb1:"rgba(217,119,54,0.07)", gradOrb2:"rgba(180,80,30,0.05)",
    gradOrb3:"rgba(255,160,60,0.04)", navBg:"rgba(22,17,14,0.88)",
  },
  light: {
    bg:"linear-gradient(145deg,#f0e8e0 0%,#f8f0e8 40%,#ede6d8 70%,#f5eee5 100%)",
    bgSolid:"#f0e8df", surface:"rgba(255,248,242,0.78)", accent:"#c46221",
    accentGlow:"rgba(196,98,33,0.14)", accentGlow2:"rgba(196,98,33,0.06)",
    text:"#2b221d", textMuted:"rgba(0,0,0,0.5)", danger:"#c0392b",
    border:"rgba(0,0,0,0.08)", borderHover:"rgba(0,0,0,0.2)",
    modalBg:"rgba(255,250,245,0.95)", modalGlow:"rgba(196,98,33,0.10)",
    gradOrb1:"rgba(196,98,33,0.06)", gradOrb2:"rgba(220,130,60,0.04)",
    gradOrb3:"rgba(180,80,30,0.03)", navBg:"rgba(255,248,242,0.92)",
  },
};

const TEXTS = {
  ar: {
    title:"مُعـدّل الكويك بانيل", desc:"صُمم خصيصاً لقص وتنسيق صورك لِتتطابق مع واجهة اللوحة السريعة",
    uploadReady:"تم الرفع — ابدأ التعديل", uploadPrompt:"اضغط هنا لبدء مشروع جديد",
    editOn:"إنهاء التعديل", editOff:"تعديل الكبسولات", undo:"تراجع",
    hint:"اضغط مطولاً لتحريك الكبسولات — اسحب الزاوية للتكبير",
    exportBtn:"تصدير وتحميل الصور (ZIP)", exporting:"جاري المعالجة...",
    exportWarn:"أقفل وضع التعديل لتمكين التصدير",
    tabHome:"الرئيسية", tabSettings:"الإعدادات", settings:"الإعدادات",
    lang:"(Language) اللغة", themeMode:"المظهر", dark:"داكن", light:"فاتح",
    devCredit:"تطوير: إبراهيم (براودي)", rights:"جميع الحقوق محفوظة ©Ibrahim AL-adwani 2026",
    modalTitle:"تعديل الزر", searchIcon:"ابحث عن أيقونة...", chooseIcon:"اختر أيقونة:",
    noIcon:"بدون أيقونة", noResult:"لا توجد نتائج", labelOpt:"النص (اختياري):",
    labelEx:"مثال: Wi-Fi", saveBtn:"حفظ التعديلات", cancelBtn:"إلغاء",
    toastSaved:"تم الحفظ!", toastExport:"بدأ التحميل!", toastFail:"فشل التصدير: ",
    styleTrans:"شفاف", styleBlur:"ضبابي",
    projectNamePrompt:"أدخل اسماً للمشروع:", defaultProjectName:"مشروع غير مسمى",
    savedDashboard:"مشاريعك المحفوظة", viewAll:" عدد مشاريعك", noSaved:"لا توجد مشاريع محفوظة.",
    continueBtn:"إنشاء المشروع", backBtn:"رجوع للقائمة",
    projMenuEdit:"تعديل المشروع", projMenuDelete:"حذف المشروع", projMenuCancel:"إلغاء",
    deleteConfirm:"تم الحذف",
    cropBtn:"تغيير الصورة", cropTitle:"اقتصاص الصورة", cropApply:"اعتماد القص",
    removeImg:"إزالة الصورة",
    Email:":ايميل التواصل", Twetter:":تويتر او (اكس)", Instagram:":انستقرام", contact:":للتواصل او الابلاغ",
    telgram:":قروب التيليجرام", langinfo:"اختر لغة التطبيق", themeinfo:"اختر مظهر التطبيق",
    uploadinfo:"ارفع صورة خلفيتك لبدئ مشروع جديد", brojectinfo:"اختر من مشاريعك السابقة لتقوم بتعديله او اعادة استرياده",
    resizeImage:"اختر صورة جديدة أو قم بإزالتها من المشروع",
    editInfo:"اضغط لتبديل وضع التعديل — في هذا الوضع يمكنك تحريك وتغيير حجم الكبسولات",
    capBgType:"نوع خلفية الكبسولة", capBgGlobal:"الخلفية العامة", capBgSolid:"لون صلب",
    capBgGradient:"تدرج لوني", capBgFrosted:"زجاج مثلج", capBgClear:"زجاج شفاف", capBgImage:"صورة خاصة",
    capBgColor1:"اللون الأول", capBgColor2:"اللون الثاني", capBgOpacity:"الشفافية",
    iconColor:"لون الأيقونة", textColor:"لون النص", solidColor:"لون صلب", gradColor:"تدرج لوني",
    iconBgToggle:"خلفية دائرية للأيقونة", opacity:"الشفافية",
    uploadCapImg:"رفع صورة للكبسولة", gradDir:"اتجاه التدرج",
    editCapsule:"تخصيص الكبسولة", livePreview:"معاينة مباشرة",
    iconTab:"الأيقونة والنص", bgTab:"الخلفية", colorTab:"الألوان",
    capBgType:"نوع خلفية الكبسولة", capBgGlobal:"الخلفية العامة", capBgSolid:"لون صلب",
    capBgGradient:"تدرج لوني", capBgGlass:"زجاج 3D", glassBlur:"ضبابية الزجاج", capBgImage:"صورة خاصة",
    bluetoothcap:"بلوتوث", wificap:"واي فاي", musiccap:"تشغيل الأغنية الأخيرة", rootencap:"الاوضاع", 
    nearbycap:"الاجهزة المجاورة", hapticMode:"اهتزاز اللمس",
    hapticinfo:"تشغيل أو إيقاف الاهتزاز الخفيف عند التفاعل مع الأزرار والقوائم",
  },
  en: {
    title:"QuickPanel Editor", desc:"Designed to crop and arrange your images to perfectly match the Quick Panel",
    uploadReady:"Image ready — Start editing", uploadPrompt:"Tap to start a new project",
    editOn:"Done Editing", editOff:"Edit Layout", undo:"Undo",
    hint:"Hold to drag items — Drag corner to resize",
    exportBtn:"Download All as ZIP", exporting:"Processing...",
    exportWarn:"Close Edit Mode to Export",
    tabHome:"Home", tabSettings:"Settings", settings:"Settings",
    lang:"Language (اللغة)", themeMode:"Theme", dark:"Dark", light:"Light",
    devCredit:"Developed by: Ibrahim (Brody)", rights:"All rights reserved ©Ibrahim AL-adwani 2026",
    modalTitle:"Edit Button", searchIcon:"Search icon...", chooseIcon:"Choose icon:",
    noIcon:"No icon", noResult:"No results", labelOpt:"Label (optional):",
    labelEx:"e.g. Wi-Fi", saveBtn:"Save Changes", cancelBtn:"Cancel",
    toastSaved:"Saved!", toastExport:"Download started!", toastFail:"Export failed: ",
    styleTrans:"Clear", styleBlur:"Blurred",
    projectNamePrompt:"Enter a project name:", defaultProjectName:"Untitled Project",
    savedDashboard:"Saved Projects", viewAll:"Number of projects", noSaved:"No saved projects.",
    continueBtn:"Create Project", backBtn:"Back to Home",
    projMenuEdit:"Edit Project", projMenuDelete:"Delete Project", projMenuCancel:"Cancel",
    deleteConfirm:"Deleted",
    cropBtn:"Change Image", cropTitle:"Crop Image", cropApply:"Apply Crop",
    removeImg:"Remove Image",
    Email:"Contact Email:", Twetter:"Twitter or (X):", Instagram:"Instagram:", contact:"For contact or reporting:",
    telgram:"Telegram Group:", langinfo:"Choose the application language", themeinfo:"Choose the application theme",
    uploadinfo:"Upload your background image to start a new project", brojectinfo:"Select from your previous projects to edit or re-export",
    resizeImage:"Pick a new image or remove it from the project",
    editInfo:"Press to toggle edit mode — move and resize capsules",
    capBgType:"Capsule Background", capBgGlobal:"Global BG", capBgSolid:"Solid Color",
    capBgGradient:"Gradient", capBgFrosted:"Frosted Glass", capBgClear:"Clear Glass", capBgImage:"Custom Image",
    capBgColor1:"Color 1", capBgColor2:"Color 2", capBgOpacity:"Opacity",
    iconColor:"Icon Color", textColor:"Text Color", solidColor:"Solid", gradColor:"Gradient",
    iconBgToggle:"Icon Circle Background", opacity:"Opacity",
    uploadCapImg:"Upload Capsule Image", gradDir:"Gradient Direction",
    editCapsule:"Customize Capsule", livePreview:"Live Preview",
    iconTab:"Icon & Text", bgTab:"Background", colorTab:"Colors",
    gradDirs: ["to right","to bottom","135deg","45deg"],
    capBgType:"Capsule Background", capBgGlobal:"Global BG", capBgSolid:"Solid Color",
    capBgGradient:"Gradient", capBgGlass:"3D Glass", glassBlur:"Glass Blur", capBgImage:"Custom Image",
    bluetoothcap: "Bluetooth", wificap:"Wi-Fi", musiccap:"Play the last song", rootencap:"Modes", 
    nearbycap:"nearby devices", hapticMode:"Haptic Feedback",
    hapticinfo:"Toggle light vibrations when interacting with buttons and menus",
  },
};

// تحويل لون hex لـ CSS filter (يخلي الأيقونة البيضاء تاخذ أي لون)
function hexToFilter(hex) {
  const r = parseInt(hex.slice(1,3),16)/255;
  const g = parseInt(hex.slice(3,5),16)/255;
  const b = parseInt(hex.slice(5,7),16)/255;
  // نحوّل لـ HSL
  const max=Math.max(r,g,b), min=Math.min(r,g,b);
  const l=(max+min)/2;
  let h=0,s=0;
  if(max!==min){
    const d=max-min;
    s=l>0.5?d/(2-max-min):d/(max+min);
    switch(max){ case r:h=(g-b)/d+(g<b?6:0);break; case g:h=(b-r)/d+2;break; case b:h=(r-g)/d+4;break; }
    h/=6;
  }
  return `brightness(0) saturate(100%) invert(1) sepia(1) saturate(5) hue-rotate(${Math.round(h*360-60)}deg) brightness(${Math.round(l*1.5*100)}%)`;
}

// ── مساعدات ─────────────────────────────────
function resolveCollisions(layout, activeId) {
  const lay = layout.map(i => ({ ...i }));
  let changed = true, guard = 0;
  while (changed && guard++ < 40) {
    changed = false;
    for (let i = 0; i < lay.length; i++) {
      for (let j = 0; j < lay.length; j++) {
        if (i === j) continue;
        const a = lay[i], b = lay[j];
        const overlap = a.col < b.col+b.colSpan && a.col+a.colSpan > b.col && a.row < b.row+b.rowSpan && a.row+a.rowSpan > b.row;
        if (overlap) {
          let mover, pivot;
          if (a.id===activeId) { mover=b; pivot=a; }
          else if (b.id===activeId) { mover=a; pivot=b; }
          else if (a.row>b.row) { mover=a; pivot=b; }
          else if (b.row>a.row) { mover=b; pivot=a; }
          else { mover=a.id>b.id?a:b; pivot=a.id>b.id?b:a; }
          const newRow = pivot.row+pivot.rowSpan;
          if (mover.row!==newRow) { mover.row=newRow; changed=true; }
        }
      }
    }
  }
  return lay;
}

const getMaxRow = (layout) => layout.reduce((m,i) => Math.max(m, i.row+i.rowSpan-1), 1);
const calcSize = (layout) => {
  const maxRow = getMaxRow(layout);
  return {
    totalW: COLS * CELL_W + (COLS + 1) * GAP_EX,
    totalH: maxRow * CELL_H + (maxRow + 1) * GAP_EX,
    maxRow
  };
};

function hexToRgba(hex, alpha = 1) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function getIconBgFillStyle(ctx, cs, cx, cy, r) {
  const opacity = cs.iconBgOpacity ?? 0.18;
  if (cs.iconBgColorType === "gradient") {
    const grad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    grad.addColorStop(0, hexToRgba(cs.iconBgColor || "#ffffff", opacity));
    grad.addColorStop(1, hexToRgba(cs.iconBgColor2 || "#f0a060", opacity));
    return grad;
  }
  return hexToRgba(cs.iconBgColor || "#ffffff", opacity);
}

// دالة رسم صورة بمنطق object-fit: cover مع scale و offset
function drawCoverImage(ctx, img, x, y, w, h, scale=1, offsetX=0, offsetY=0) {
  const imgRatio = img.naturalWidth / img.naturalHeight;
  const boxRatio = w / h;
  let baseW, baseH;
  if (imgRatio > boxRatio) { baseH = h; baseW = h * imgRatio; }
  else                      { baseW = w; baseH = w / imgRatio; }
  const finalW = baseW * scale;
  const finalH = baseH * scale;
  const dx = x + (w - finalW) / 2 + offsetX;
  const dy = y + (h - finalH) / 2 + offsetY;
  ctx.drawImage(img, dx, dy, finalW, finalH);
}

function loadIconImage(src) {
  return new Promise((res) => {
    if (!src) return res(null);
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload  = () => res(img);
    img.onerror = () => res(null);
    img.src = `/icons/${src}`;
  });
}

function resizeImageIfNeeded(dataUrl, maxSize=2400) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width<=maxSize && img.height<=maxSize) { resolve(dataUrl); return; }
      const scale = maxSize/Math.max(img.width,img.height);
      const canvas = document.createElement("canvas");
      canvas.width=Math.round(img.width*scale); canvas.height=Math.round(img.height*scale);
      canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);
      resolve(canvas.toDataURL("image/jpeg",0.92));
    };
    img.src = dataUrl;
  });
}

// ── دالة رسم خلفية الأيقونة ثلاثية الأبعاد (التحديد الأخضر والأزرق) ──
function draw3DIconBackground(ctx, cx, cy, r, cs) {
  // 1. الظل الخارجي للخلفية (العمق والبروز - التحديد الأزرق)
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 6;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 3;
  ctx.fillStyle = getIconBgFillStyle(ctx, cs, cx, cy, r);
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // 2. الظل الداخلي لخلفية الأيقونة (الانحناء - التحديد الأخضر)
  ctx.save();
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.clip();
  const innerGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
  innerGrad.addColorStop(0, "rgba(0,0,0,0.35)"); // ظل داكن من أعلى اليسار
  innerGrad.addColorStop(0.3, "rgba(0,0,0,0)");
  innerGrad.addColorStop(0.7, "rgba(255,255,255,0)");
  innerGrad.addColorStop(1, "rgba(255,255,255,0.15)"); // انعكاس فاتح من أسفل اليمين
  ctx.fillStyle = innerGrad;
  ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
  ctx.restore();
}

// ── دالة تلوين الأيقونة مع تأثير العمق الداخلي (التحديد الأحمر) ──
async function drawColoredIcon(ctx, iconImg, x, y, w, h, cs) {
  const tmp = document.createElement("canvas");
  tmp.width = Math.ceil(w);
  tmp.height = Math.ceil(h);
  const tmpCtx = tmp.getContext("2d");
  
  // 1. رسم الأيقونة الأصلية
  tmpCtx.drawImage(iconImg, 0, 0, w, h);
  
  // 2. تلوين الأيقونة
  tmpCtx.globalCompositeOperation = "source-in";
  if (cs.iconColorType === "gradient") {
    const grad = tmpCtx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, hexToRgba(cs.iconColor || "#ffffff", cs.iconOpacity ?? 1));
    grad.addColorStop(1, hexToRgba(cs.iconColor2 || "#f0a060", cs.iconOpacity ?? 1));
    tmpCtx.fillStyle = grad;
  } else {
    tmpCtx.fillStyle = hexToRgba(cs.iconColor || "#ffffff", cs.iconOpacity ?? 1);
  }
  tmpCtx.fillRect(0, 0, w, h);

  // 3. إضافة تأثير العمق الداخلي للأيقونة (التحديد الأحمر)
  tmpCtx.globalCompositeOperation = "source-atop";
  const depthGrad = tmpCtx.createLinearGradient(0, 0, w, h);
  depthGrad.addColorStop(0, "rgba(0,0,0,0.45)"); // ظل داكن داخل الأيقونة من أعلى اليسار
  depthGrad.addColorStop(0.4, "rgba(0,0,0,0)");
  depthGrad.addColorStop(0.6, "rgba(255,255,255,0)");
  depthGrad.addColorStop(1, "rgba(255,255,255,0.2)"); // لمعة خفيفة داخل الأيقونة أسفل اليمين
  tmpCtx.fillStyle = depthGrad;
  tmpCtx.fillRect(0, 0, w, h);

  // 4. رسمها على الكانفس الرئيسي مع ظل بسيط
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 4;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 2;
  ctx.drawImage(tmp, x, y);
  ctx.restore();
}

// ── رسم الكبسولة على canvas للتصدير ──────────
// ── رسم الكبسولة على canvas للتصدير (تم تحديثه للتأثير ثلاثي الأبعاد) ──────────
async function renderItemCanvas(item, bgImg, totalW, totalH, visualStyle) {
  const SCALE = 3;
  const cs = item.capsuleStyle || DEFAULT_CAPSULE_STYLE;
  const bgType = cs.bgType || "global";

  const x = GAP_EX + (item.col - 1) * (CELL_W + GAP_EX);
  const y = GAP_EX + (item.row - 1) * (CELL_H + GAP_EX);
  const w = item.colSpan * CELL_W + (item.colSpan - 1) * GAP_EX;
  const h = item.rowSpan * CELL_H + (item.rowSpan - 1) * GAP_EX;

  const cv = document.createElement("canvas");
  cv.width  = w * SCALE;
  cv.height = h * SCALE;
  const ctx = cv.getContext("2d");
  ctx.scale(SCALE, SCALE);

  const isCircle = item.colSpan === 1 && item.rowSpan === 1;
  const isPill   = (item.colSpan >= 2 && item.rowSpan === 1) || (item.colSpan === 1 && item.rowSpan >= 2);
  const radius   = isCircle ? Math.min(w, h) / 2 : isPill ? Math.min(w, h) / 2 : 28;

  // ── رسم الشكل والـ clip ──
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(1, 1, w-2, h-2, radius);
  ctx.clip();

  // ══════════════════════════════════════════
  // ── رسم خلفية الكبسولة حسب النوع ──
  // ══════════════════════════════════════════

  // [القسم الأصلي للخلفيات سيبقى كما هو، سأقتطعه هنا للاختصار، لكن لا تحذفه من كودك]
  if (bgType === "global") {
    if (bgImg) {
      if (visualStyle === "blurred") ctx.filter = "blur(15px)";
      const ir = bgImg.width / bgImg.height, pr = totalW / totalH;
      let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
      if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
      else          { dh = bgImg.width / pr;  oy = (bgImg.height - dh) / 2; }
      const sx = dw / totalW, sy = dh / totalH;
      const offset = visualStyle === "blurred" ? 15 : 0;
      ctx.drawImage(bgImg, ox + x * sx, oy + y * sy, w * sx, h * sy, -offset, -offset, w + offset * 2, h + offset * 2);
      ctx.filter = "none";
      if (visualStyle === "blurred") {
        ctx.fillStyle = "rgba(22,20,18,0.50)"; ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "rgba(0,0,0,0.12)";    ctx.fillRect(0, 0, w, h);
      } else {
        ctx.fillStyle = "rgba(15,12,10,0.21)"; ctx.fillRect(0, 0, w, h);
      }
    } else { ctx.clearRect(0, 0, w, h); }
  } else if (bgType === "solid") {
    if (bgImg) {
      const ir = bgImg.width / bgImg.height, pr = totalW / totalH;
      let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
      if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
      else          { dh = bgImg.width / pr;  oy = (bgImg.height - dh) / 2; }
      const sxS = dw / totalW, syS = dh / totalH;
      ctx.drawImage(bgImg, ox + x * sxS, oy + y * syS, w * sxS, h * syS, 0, 0, w, h);
    }
    ctx.fillStyle = hexToRgba(cs.bgColor1 || "#ffffff", cs.bgOpacity ?? 0.85);
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === "gradient") {
    if (bgImg) {
      const ir = bgImg.width / bgImg.height, pr = totalW / totalH;
      let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
      if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
      else          { dh = bgImg.width / pr;  oy = (bgImg.height - dh) / 2; }
      const sxGr = dw / totalW, syGr = dh / totalH;
      ctx.drawImage(bgImg, ox + x * sxGr, oy + y * syGr, w * sxGr, h * syGr, 0, 0, w, h);
    }
    const dir = cs.bgGradientDir || "135deg";
    let x0 = 0, y0 = 0, x1 = w, y1 = h;
    if (dir === "to right")        { x0=0; y0=h/2; x1=w; y1=h/2; }
    else if (dir === "to bottom")  { x0=w/2; y0=0; x1=w/2; y1=h; }
    else if (dir === "to right bottom" || dir === "135deg") { x0=0; y0=0; x1=w; y1=h; }
    else if (dir === "to left bottom" || dir === "45deg")   { x0=w; y0=0; x1=0; y1=h; }
    const grad = ctx.createLinearGradient(x0, y0, x1, y1);
    grad.addColorStop(0, hexToRgba(cs.bgColor1 || "#ffffff", cs.bgOpacity ?? 0.85));
    grad.addColorStop(1, hexToRgba(cs.bgColor2 || "#888888", cs.bgOpacity ?? 0.85));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === "frosted") {
    if (bgImg) {
      const ir = bgImg.width / bgImg.height, pr = totalW / totalH;
      let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
      if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
      else          { dh = bgImg.width / pr;  oy = (bgImg.height - dh) / 2; }
      const sx = dw / totalW, sy = dh / totalH;
      ctx.filter = "blur(18px)";
      ctx.drawImage(bgImg, ox + x * sx, oy + y * sy, w * sx, h * sy, -20, -20, w + 40, h + 40);
      ctx.filter = "none";
    }
    const op = cs.bgOpacity ?? 0.25;
    const g1 = ctx.createLinearGradient(0, 0, w, h);
    g1.addColorStop(0, hexToRgba(cs.bgColor1 || "#ffffff", op));
    g1.addColorStop(1, hexToRgba(cs.bgColor2 || "#aaaaaa", op * 0.5));
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === "clear") {
    if (bgImg) {
      const ir = bgImg.width / bgImg.height, pr = totalW / totalH;
      let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
      if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
      else          { dh = bgImg.width / pr;  oy = (bgImg.height - dh) / 2; }
      const sx = dw / totalW, sy = dh / totalH;
      ctx.filter = "blur(4px)";
      ctx.drawImage(bgImg, ox + x * sx, oy + y * sy, w * sx, h * sy, -8, -8, w + 16, h + 16);
      ctx.filter = "none";
    }
    const op = cs.bgOpacity ?? 0.10;
    const g2 = ctx.createLinearGradient(0, 0, w, h);
    g2.addColorStop(0, hexToRgba(cs.bgColor1 || "#ffffff", op));
    g2.addColorStop(1, hexToRgba(cs.bgColor2 || "#aaaaaa", op * 0.5));
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === "liquid") {
    if (bgImg) {
      const ir = bgImg.width / bgImg.height, pr = totalW / totalH;
      let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
      if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
      else { dh = bgImg.width / pr; oy = (bgImg.height - dh) / 2; }
      const sx = dw / totalW, sy = dh / totalH;
      const blurPx = Math.max(1, Math.round((cs.bgGlassBlur ?? 0.5) * 20));
      const extra = 20; 
      ctx.filter = `blur(${blurPx}px) saturate(160%)`;
      ctx.drawImage(bgImg, ox + (x - extra) * sx, oy + (y - extra) * sy, (w + extra * 2) * sx, (h + extra * 2) * sy, -extra, -extra, w + extra * 2, h + extra * 2);
      ctx.filter = "none";
    } else { ctx.clearRect(0, 0, w, h); } // مسح الخلفية لتكون شفافة بالكامل
    if (bgImg) { applyLiquidRefraction(ctx, ctx.canvas.width, ctx.canvas.height, { refraction: 0.28, chromAberration: 0.016, edgeWidth: 0.3, }); }
    ctx.fillStyle = "rgba(255,255,255,0.06)"; ctx.fillRect(0, 0, w, h);
  } else if (bgType === "glass") {
    if (bgImg) {
      const ir = bgImg.width / bgImg.height, pr = totalW / totalH;
      let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
      if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
      else { dh = bgImg.width / pr; oy = (bgImg.height - dh) / 2; }
      const sxG = dw / totalW, syG = dh / totalH;
      const blurPxG = Math.max(1, Math.round((cs.bgGlassBlur ?? 0.5) * 16));
      const saturationG = 100 + (cs.bgGlassBlur ?? 0.5) * 80;
      ctx.filter = `blur(${blurPxG}px) saturate(${saturationG}%)`;
      ctx.drawImage(bgImg, ox + (x - blurPxG) * sxG, oy + (y - blurPxG) * syG, (w + blurPxG * 2) * sxG, (h + blurPxG * 2) * syG, -blurPxG, -blurPxG, w + blurPxG * 2, h + blurPxG * 2);
      ctx.filter = "none";
    } else { ctx.clearRect(0, 0, w, h); } // مسح الخلفية لتكون شفافة بالكامل
    const op = cs.bgOpacity ?? 0.15;
    const gGlassGrad = ctx.createLinearGradient(0, 0, w, h);
    gGlassGrad.addColorStop(0, hexToRgba(cs.bgColor1 || "#ffffff", op));
    gGlassGrad.addColorStop(1, hexToRgba(cs.bgColor2 || "#aaaaaa", op * 0.5));
    ctx.fillStyle = gGlassGrad;
    ctx.fillRect(0, 0, w, h);
  } else if (bgType === "image" && cs.bgImage) {
    await new Promise(res => {
      const im = new Image(); im.crossOrigin = "anonymous";
      im.onload = () => {
        const previewW = isCircle ? 80 : item.colSpan >= 2 ? 160 : 80;
        const previewH = isCircle ? 80 : item.rowSpan >= 2 ? 160 : 80;
        const mapX = w / previewW; const mapY = h / previewH;
        drawCoverImage(ctx, im, 0, 0, w, h, cs.bgImageScale ?? 1, (cs.bgImageOffsetX ?? 0) * mapX, (cs.bgImageOffsetY ?? 0) * mapY );
        res();
      };
      im.onerror = res; im.src = cs.bgImage;
    });
  } else { ctx.fillStyle = "rgba(22,20,18,0.45)"; ctx.fillRect(0, 0, w, h); }
  // [نهاية قسم الخلفيات الأصلي]

  // ============================================================
  // ✅ القسم الجديد (1): تطبيق الظل الجانبي العميق (التحديد الأخضر/الأزرق)
  // ============================================================
  
  // 1. ظل سفلي ناعم جداً للعمق
  const botGlow = ctx.createLinearGradient(0, h * 0.7, 0, h);
  botGlow.addColorStop(0, "rgba(0,0,0,0)");
  botGlow.addColorStop(1, "rgba(0,0,0,0.15)"); // ظل ناعم بالأسفل
  ctx.fillStyle = botGlow;
  ctx.fillRect(0, 0, w, h);

  // 2. تدرج مائل قوي (من أعلى اليسار إلى أسفل اليمين) لإعطاء انحناء مائل للسطح
  const surfaceGrad = ctx.createLinearGradient(0, 0, w, h);
  surfaceGrad.addColorStop(0, "rgba(255,255,255,0.08)"); // إضاءة خفيفة علوية
  surfaceGrad.addColorStop(0.5, "rgba(0,0,0,0)");
  surfaceGrad.addColorStop(1, "rgba(0,0,0,0.22)");     // ظل مائل سفلي
  ctx.fillStyle = surfaceGrad;
  ctx.fillRect(0, 0, w, h);

  // ============================================================

  // [باقي أكواد رسم التصميم الزجاجي الفخم القديم ستبقى هنا، لا تحذفها]
  if (bgType === "liquid" || bgType === "glass") {
    drawNew3DGlassLighting(ctx, w, h, isCircle, radius, 0.85);
  } else if (bgType === "frosted" || bgType === "clear") {
    drawGlassHighlightRealistic(ctx, w, h, isCircle, 0.42, bgType);
    drawBottomShadowRealistic(ctx, w, h, isCircle);
  }

  // ══════════════════════════════════════════
  // ── رسم الأيقونة والنص (تم تحديثه للتأثير ثلاثي الأبعاد) ──
  // ══════════════════════════════════════════
  // ══════════════════════════════════════════
  // ── رسم الأيقونة والنص ──
  // ══════════════════════════════════════════
  const iconImg = item.icon ? await loadIconImage(item.icon) : null;
  const setShadow = () => { ctx.shadowColor = "rgba(0,0,0,0.85)"; ctx.shadowBlur = 7; };
  const clearShadow = () => { ctx.shadowColor = "transparent"; ctx.shadowBlur = 0; };

  const textColorVal = cs.textColorType === "gradient"
    ? (() => { const g = ctx.createLinearGradient(0,0,w,h); g.addColorStop(0, hexToRgba(cs.textColor||"#fff", cs.textOpacity??1)); g.addColorStop(1, hexToRgba(cs.textColor2||"#f0a060", cs.textOpacity??1)); return g; })()
    : hexToRgba(cs.textColor || "#ffffff", cs.textOpacity ?? 1);

  if (item.colSpan >= 2 && item.rowSpan >= 2) {
    const s = w * 0.25, cx = w / 2, cy = h / 2;
    if (iconImg) {
      const iy2 = item.label ? cy - s / 2 - 10 : cy - s / 2;
      if (cs.showIconBg !== false) {
        draw3DIconBackground(ctx, cx, iy2 + s / 2, s * 0.7, cs);
      }
      await drawColoredIcon(ctx, iconImg, cx - s / 2, iy2, s, s, cs);
    }
    if (item.label) {
      setShadow();
      ctx.font = "600 16px 'Segoe UI',sans-serif";
      ctx.fillStyle = textColorVal;
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(item.label, cx, iconImg ? cy + s / 2 + 12 : cy);
      clearShadow();
    }
  } else if (item.colSpan >= 2 && item.rowSpan === 1) {
    const bs = h * 0.72;
    const align = item.iconAlign || "right";
    let circleX;
    if (align === "left") circleX = h * 0.14;
    else if (align === "center") circleX = (w - bs) / 2;
    else circleX = w - bs - h * 0.14;
    const circleY = (h - bs) / 2;

    if (cs.showIconBg !== false) {
      draw3DIconBackground(ctx, circleX + bs / 2, circleY + bs / 2, bs / 2, cs);
    }

    if (iconImg) await drawColoredIcon(ctx, iconImg, circleX + bs * 0.2, circleY + bs * 0.2, bs * 0.6, bs * 0.6, cs);
    if (item.label && align !== "center") {
      setShadow();
      ctx.font = "600 16px 'Segoe UI',sans-serif";
      ctx.fillStyle = textColorVal;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      if (align === "left") {
        const textX = (h * 0.18 + bs + w) / 2;
        ctx.fillText(item.label, textX, h / 2);
      } else {
        const textX = (w - bs - h * 0.18) / 2;
        ctx.fillText(item.label, textX, h / 2);
      }
      clearShadow();
    }
  } else if (isCircle && iconImg) {
    const d = w * 0.46;
    if (cs.showIconBg !== false) {
      draw3DIconBackground(ctx, w / 2, h / 2, d * 0.7, cs);
    }
    await drawColoredIcon(ctx, iconImg, (w - d) / 2, (h - d) / 2, d, d, cs);
  } else if (item.colSpan === 1 && item.rowSpan >= 2 && iconImg) {
    const bs = w * 0.72, ix = (w - bs) / 2;
    const iy = item.iconPos === "top" ? w * 0.1 : (h - bs) / 2;
    if (cs.showIconBg !== false) {
      draw3DIconBackground(ctx, ix + bs / 2, iy + bs / 2, bs / 2, cs);
    }
    await drawColoredIcon(ctx, iconImg, ix + bs * 0.2, iy + bs * 0.2, bs * 0.6, bs * 0.6, cs);
  }
  
  ctx.restore();

  // ── الحلقة الخارجية ──

  // ── الحلقة الخارجية ──
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(1, 1, w - 2, h - 2, radius);
  if (bgType === "clear" || bgType === "liquid" || bgType === "glass") {
    ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.5;
  } else if (bgType === "frosted") {
    ctx.strokeStyle = "rgba(255,255,255,0.40)"; ctx.lineWidth = 1.5;
  } else {
    ctx.strokeStyle = "rgba(255,255,255,0.15)"; ctx.lineWidth = 1;
  }
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.roundRect(1, 1, w - 2, h - 2, radius);
  ctx.fillStyle = "#fff";
  ctx.fill();
  ctx.restore();

  return cv;
}

// ── دوال مساعدة للرسم على Canvas ────────────

// تأثير الزجاج الفخم الجديد (المائل مع نقطتين وإطار غير متماثل)
// تأثير الزجاج الفخم
function drawNew3DGlassLighting(ctx, w, h, isCircle, radius, opacity = 1) {
  ctx.save();

  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, radius);
  ctx.clip();

  // 1. الإضاءة العلوية الناعمة (المحددة بالأخضر في صورتك)
  const topGlow = ctx.createLinearGradient(0, 0, 0, h * 0.35);
  topGlow.addColorStop(0, `rgba(255,255,255,${0.45 * opacity})`);
  topGlow.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = topGlow;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, radius);
  ctx.fill();

  // 2. الانعكاس المائل (الكبير)
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(w, 0);
  ctx.lineTo(w, h * 0.20); 
  ctx.quadraticCurveTo(w * 0.4, h * 0.35, 0, h * 0.60); 
  ctx.closePath();
  const glossGrad = ctx.createLinearGradient(0, 0, w * 0.5, h * 0.6);
  glossGrad.addColorStop(0, `rgba(255,255,255,${0.35 * opacity})`);
  glossGrad.addColorStop(1, `rgba(255,255,255,0)`);
  ctx.fillStyle = glossGrad;
  ctx.fill();

  // 2.5
  // 1. حساب نصف سُمك الإطار لتصحيح التموضع داخل منطقة القص
const strokeWidth = 2;
ctx.lineWidth = strokeWidth;

// 2. إنشاء تدرج لوني واقعي (إضاءة من أعلى اليسار، وتلاشي وظل نحو أسفل اليمين)
const borderGrad = ctx.createLinearGradient(0, 0, w, h);
borderGrad.addColorStop(0.35, `rgba(255,255,255,${0.15 * opacity})`); // إضاءة ناعمة تتلاشى
borderGrad.addColorStop(0.75, `rgba(0,0,0,${0.25 * opacity})`);       // ظل ناعم يبدأ قبل النهاية
borderGrad.addColorStop(1, `rgba(0,0,0,${0.4 * opacity})`);          // أغمق نقطة أسفل اليمين لتندمج مع ظلك المائل

ctx.strokeStyle = borderGrad;

// 3. رسم الإطار مزاحاً للداخل بمقدار بكسلين لكي لا تقصه دالة الـ clip
ctx.beginPath();
ctx.roundRect(
  strokeWidth / 2, 
  strokeWidth / 2, 
  w - strokeWidth, 
  h - strokeWidth, 
  Math.max(0, radius - strokeWidth / 2) // تعديل انحناء الزاوية ليتناسب مع الإزاحة للداخل
);
ctx.stroke();


  // 3. الظل السفلي الداخلي العميق (المحدد بالأزرق في صورتك)
  const botShadow = ctx.createLinearGradient(0, h * 0.85, 0, h);
  botShadow.addColorStop(0, "rgba(0,0,0,0)");
  botShadow.addColorStop(0.7, `rgba(0,0,0,${0.35 * opacity})`);
  botShadow.addColorStop(1, `rgba(0,0,0,${0.75 * opacity})`);
  ctx.fillStyle = botShadow;
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, radius);
  ctx.fill();

  // 3.5 فكرتك العبقرية: الظل الجانبي الأيمن المائل 
  // يبدأ من أقصى اليمين في الأسفل ويتجه للأعلى مائلاً لليسار (مع عقارب الساعة)
// 1. تحديد مسار الكبسولة الأساسي وحفظه كمنطقة قص (Clip) - الأبعاد الأصلية الصحيحة
ctx.save(); 
ctx.beginPath();
ctx.roundRect(0, 0, w, h, radius);
ctx.clip(); // هذا يضمن عدم خروج أي شيء عن جدار الكبسولة

// 2. نقل نقطة الارتكاز وتدوير السياق بمقدار 3 درجات
ctx.translate(w, h * 0.5);
ctx.rotate((3 * Math.PI) / 180); 
ctx.translate(-w, -h * 0.5); 

// 3. إنشاء التدرج الخطي النحيف
// جعلنا بداية التدرج تمتد خارج الحافة قليلاً (w + 40) لضمان تغطية الفراغ الناتج عن الميلان
const shadowWidth = 30; // يمكنك التحكم بسُمك الظل بالبكسل من هنا مباشرة
const rightShadow = ctx.createLinearGradient(w + 40, 0, w - shadowWidth, 0); 
rightShadow.addColorStop(0, `rgba(0,0,0,${0.45 * opacity})`); 
rightShadow.addColorStop(1, "rgba(0,0,0,0)");                  

// 4. رسم مستطيل الظل بأبعاد أكبر (تنزلق تحت جدار الكبسولة الأصلي)
ctx.fillStyle = rightShadow;
ctx.beginPath();
// أضفنا -20 للارتفاع والـ Y، و +40 للعرض ليتجاوز المستطيل حدود الكبسولة أثناء ميله
ctx.roundRect(-20, -20, w + 60, h + 40, radius);
ctx.fill();

ctx.restore(); // العودة للوضع الطبيعي بأمان


// 4. رسم الظل داخل منطقة القص المائلة
ctx.fillStyle = rightShadow;
ctx.beginPath();
ctx.roundRect(0, 0, w, h, radius);
ctx.fill();

ctx.restore(); // استعادة الحالة الأصلية للـ Canvas لإلغاء التدوير والقص وبدء الرسم التالي بأمان

  // ----------------------------------------

  // 4. خط نحيف جداً حول الكبسولة للحدود الخارجية فقط
  ctx.beginPath();
  ctx.roundRect(0, 0, w, h, radius);
  ctx.strokeStyle = `rgba(255,255,255,${0.15 * opacity})`;
  ctx.lineWidth = 1;
  ctx.stroke();

  // 5. اللمعة أعلى اليسار (البيضاوية)
  ctx.save();
  const tlX = isCircle ? w * 0.18 : Math.min(w, h) * 0.21; 
  const tlY = isCircle ? h * 0.11 : Math.min(w, h) * 0.15; 
  const tlR = Math.min(w, h) * 0.2; 
  ctx.translate(tlX, tlY);
  ctx.rotate(-Math.PI / 8); 
  ctx.scale(1.2, 0.8); 
  const tlGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, tlR);
  tlGrad.addColorStop(0, `rgba(255,255,255,${0.9 * opacity})`);
  tlGrad.addColorStop(0.3, `rgba(255,255,255,${0.25 * opacity})`);
  tlGrad.addColorStop(1, `rgba(255,255,255,0)`);
  ctx.fillStyle = tlGrad;
  ctx.beginPath(); ctx.arc(0, 0, tlR, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  // 6. اللمعة أسفل اليمين (البيضاوية)
  ctx.save();
  const brX = w - (isCircle ? w * 0.18 : Math.min(w, h) * 0.21); 
  const brY = h - (isCircle ? h * 0.11 : Math.min(w, h) * 0.15); 
  const brR = Math.min(w, h) * 0.15; 
  ctx.translate(brX, brY);
  ctx.rotate(-Math.PI / 8); 
  ctx.scale(1.2, 0.8); 
  const brGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, brR);
  brGrad.addColorStop(0, `rgba(255,255,255,${0.7 * opacity})`);
  brGrad.addColorStop(0.3, `rgba(255,255,255,${0.15 * opacity})`);
  brGrad.addColorStop(1, `rgba(255,255,255,0)`);
  ctx.fillStyle = brGrad;
  ctx.beginPath(); ctx.arc(0, 0, brR, 0, Math.PI * 2); ctx.fill();
  ctx.restore();

  ctx.restore();
}

// رسم اللمعة العلوية المنحنية (مشتركة بين glass/3d/liquid)
// لمعة علوية واقعية معدلة (حل مشكلة التلاشي والبريق)
function drawGlassHighlightRealistic(ctx, w, h, isCircle, opacity = 0.72, bgType = "glass") {
  ctx.save();

  // ── اللمعة الرئيسية: نصف دائرة مقعرة علوية تتلاشى بسلاسة ──
  ctx.save();
ctx.beginPath();
if (isCircle) {
  ctx.arc(w / 2, h / 2, w / 2 * 0.88, Math.PI, 0);
  ctx.lineTo(w * 0.88, h * 0.45);
  ctx.ellipse(w / 2, h * 0.42, w * 0.38, h * 0.22, 0, 0, Math.PI, true);
} else {
  ctx.ellipse(w/2, h*0.25, w*0.47, h*0.32, 0, Math.PI, 0);
  ctx.lineTo(w * 0.95, h * 0.47);
  ctx.ellipse(w/2, h*0.40, w*0.47, h*0.18, 0, 0, Math.PI, true);
}
ctx.closePath();

// التعديل هنا: جعل مركز الإضاءة متناسب عمودياً وأفقياً مع نصف القطر
const centerX = w * 0.5;
// إذا كان دائرياً ننزله ليتطابق مع القوس الدائري، وإذا كان بيضاوياً نرفعه للأعلى
const centerY = isCircle ? h * 0.35 : h * 0.20; 
// تكبير نصف قطر التدرج ليغطي المساحة ويتلاشى خارج حدود الشكل تماماً فلا تظهر حواف حادة
const maxRadius = isCircle ? w * 0.70 : w * 0.80; 

const hlGrad = ctx.createRadialGradient(
  centerX, centerY, 0,          // الدائرة الداخلية (نقطة البداية)
  centerX, centerY, maxRadius    // الدائرة الخارجية (نقطة التلاشي التام)
);

// توزيع شفافية فائق النعومة
hlGrad.addColorStop(0,    `rgba(255,255,255,${opacity * 0.85})`); // تقليل السطوع بالمركز لمنع البقع الفاقعة
hlGrad.addColorStop(0.25, `rgba(255,255,255,${opacity * 0.40})`);
hlGrad.addColorStop(0.60, `rgba(255,255,255,${opacity * 0.10})`);
hlGrad.addColorStop(1,    `rgba(255,255,255,0)`); // تلاشي مطلق

ctx.fillStyle = hlGrad;
ctx.fill();
ctx.restore();


  // ── البريق النقطي الصغير (لحل مشكلة السهم الأزرق - للسائل فقط) ──
  if (bgType === "liquid") {
    // 1. حساب الموضع الأصلي مع إضافة التزحيق (15 بكسل لليمين، و10 بكسل للأسفل)
    const spotX = (isCircle ? w * 0.32 : w * 0.20);
    const spotY = (isCircle ? h * 0.18 : h * 0.08);
    
    // 2. تحديد نصف القطر (الحجم المصغّر الجديد)
    // قمنا بتقليص الحجم ليكون أصغر (مثلاً 10% إلى 12% من عرض اللوحة بدلاً من 20%)
    const spotRadius = isCircle ? w * 0.10 : w * 0.12;

    // 3. إنشاء التدرج الشعاعي متناسق مع الحجم الجديد المصغّر
    const spotGrad = ctx.createRadialGradient(
      spotX, spotY, 0,
      spotX, spotY, spotRadius
    );
    
    // تدرج ناعم جداً للبريق
    spotGrad.addColorStop(0,   `rgba(255,255,255,${opacity * 0.7})`);
    spotGrad.addColorStop(0.5, `rgba(255,255,255,${opacity * 0.2})`);
    spotGrad.addColorStop(1,   `rgba(255,255,255,0)`);
    ctx.fillStyle = spotGrad;
    
    ctx.beginPath();
    
    // 4. رسم نصف الدائرة المقعرة للأسفل باستخدام arc بدلاً من ellipse
    // Math.PI إلى 0 (مع القيمة true) ترسم قوساً علوياً ينحني أطرافه للأسفل
    ctx.arc(spotX, spotY, spotRadius, Math.PI, 0, false);
    
    // إغلاق الشكل ليعود خط مستقيم بين طرفي نصف الدائرة لتعبئتها بشكل صحيح
    ctx.closePath(); 
    
    ctx.fill();
}

ctx.restore();
}


// ظل سفلي واقعي مقعر يتبع شكل الكبسولة
function drawBottomShadowRealistic(ctx, w, h, isCircle) {
  ctx.save();
  // ظل سفلي تدريجي يعطي عمق ثلاثي الأبعاد
  const shadowGrad = ctx.createLinearGradient(0, h * 0.60, 0, h);
  shadowGrad.addColorStop(0, "rgba(0,0,0,0)");
  shadowGrad.addColorStop(0.5, "rgba(0,0,0,0.15)");
  shadowGrad.addColorStop(1, "rgba(0,0,0,0.40)");
  ctx.fillStyle = shadowGrad;
  
  ctx.beginPath();
  if (isCircle) {
    ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
  } else {
    // رسم قوس مقعر من الأسفل بدل الخط المستقيم
    ctx.moveTo(0, h * 0.65);
    ctx.quadraticCurveTo(w / 2, h * 0.4, w, h * 0.65);
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
  }
  ctx.fill();

  // انعكاس ضوئي خفيف يتبع نفس الانحناء
  const reflectGrad = ctx.createLinearGradient(0, h * 0.80, 0, h);
  reflectGrad.addColorStop(0, "rgba(255,255,255,0)");
  reflectGrad.addColorStop(1, "rgba(255,255,255,0.15)");
  ctx.fillStyle = reflectGrad;
  
  ctx.beginPath();
  if (isCircle) {
    ctx.ellipse(w / 2, h * 0.88, w * 0.35, h * 0.10, 0, 0, Math.PI * 2);
  } else {
    ctx.moveTo(w * 0.1, h);
    ctx.quadraticCurveTo(w / 2, h * 0.85, w * 0.9, h);
  }
  ctx.fill();
  
  ctx.restore();
}

// ════════════════════════════════════════════════════════════
// تحسينات خوارزمية تصدير الزجاج السائل (Liquid Glass Export)
// نفس الطابع الحالي + 3 طبقات فيزيائية إضافية:
// 1) Edge Refraction (تشويه حواف حقيقي على بيانات البكسل)
// 2) Chromatic Aberration (تفريق لوني خفيف عند الحواف)
// 3) Fresnel Rim (حافة مضيئة تتقوى عند محيط الشكل)
// ════════════════════════════════════════════════════════════

/**
 * يطبّق انكسار + تفريق لوني على بيانات canvas موجودة فعلياً
 * (نفس فكرة الـ refraction الموجودة عندك في "clear" لكن مطوّرة
 * بإضافة قناة لونية منفصلة لكل من R/G/B = تفريق لوني واقعي)
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {object} opts
 *   - refraction: قوة الانكسار (0 - 1.2), افتراضي 0.45
 *   - chromAberration: قوة التفريق اللوني (0 - 0.05), افتراضي 0.018
 *   - edgeWidth: نسبة عرض منطقة الانكسار من نصف القطر (0-1), افتراضي 0.55
 */
/**
 * يطبّق انكسار + تفريق لوني على بيانات canvas
 * (تم التحديث باستخدام خوارزمية SDF لتطابق التشوه مع شكل الكبسولة بدقة)
 */
function applyLiquidRefraction(ctx, w, h, opts = {}) {
  const refraction = opts.refraction ?? 0.45;
  const chrom = opts.chromAberration ?? 0.018;
  const edgeWidth = opts.edgeWidth ?? 0.55;

  const imgData = ctx.getImageData(0, 0, w, h);
  const src = new Uint8ClampedArray(imgData.data);
  const dst = imgData.data;

  const cx = w / 2, cy = h / 2;
  const r = Math.min(w, h) / 2; // نصف القطر لزوايا الكبسولة

  // حساب أبعاد "اللب الداخلي" للكبسولة
  // (للدائرة يكون اللب نقطة 0، وللكبسولة العريضة يكون خط أفقي، للطويلة خط عمودي)
  const coreW = Math.max(0, cx - r);
  const coreH = Math.max(0, cy - r);

  const Rstart = r * (1 - edgeWidth);

  const sample = (x, y) => {
    const xi = Math.min(w - 1, Math.max(0, Math.round(x)));
    const yi = Math.min(h - 1, Math.max(0, Math.round(y)));
    return (yi * w + xi) * 4;
  };

  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const nx = i - cx, ny = j - cy;

      // ── رياضيات SDF (Signed Distance Field) ──
      // تحسب المسافة الدقيقة بين البكسل الحالي وأقرب حافة للكبسولة (بدل الدائرة الوهمية)
      const qx = Math.max(0, Math.abs(nx) - coreW);
      const qy = Math.max(0, Math.abs(ny) - coreH);
      const distToCore = Math.sqrt(qx * qx + qy * qy);

      const di = (j * w + i) * 4;

      if (distToCore <= Rstart) {
        // المركز: بدون تشويه (ينقل كما هو)
        dst[di] = src[di]; dst[di + 1] = src[di + 1]; dst[di + 2] = src[di + 2]; dst[di + 3] = src[di + 3];
        continue;
      }

      // معامل القرب من الحافة (0 عند بداية منطقة الانكسار -> 1 عند الحافة الخارجية)
      const edgeT = Math.min(1, (distToCore - Rstart) / (r - Rstart || 1));
      const bend = Math.pow(edgeT, 2) * refraction;
      
      // اتجاه الانكسار (المتجه العمودي نحو أقرب حافة)
      const dirX = distToCore > 0 ? (Math.sign(nx) * qx) / distToCore : 0;
      const dirY = distToCore > 0 ? (Math.sign(ny) * qy) / distToCore : 0;

      // ── القنوات اللونية ──
      const gSrcIdx = sample(i - dirX * bend * r, j - dirY * bend * r);
      
      const rBend = bend * (1 + chrom);
      const rSrcIdx = sample(i - dirX * rBend * r, j - dirY * rBend * r);
      
      const bBend = bend * (1 - chrom);
      const bSrcIdx = sample(i - dirX * bBend * r, j - dirY * bBend * r);

      dst[di]     = src[rSrcIdx];     // Red
      dst[di + 1] = src[gSrcIdx + 1]; // Green
      dst[di + 2] = src[bSrcIdx + 2]; // Blue
      dst[di + 3] = src[gSrcIdx + 3]; // Alpha
    }
  }

  ctx.putImageData(imgData, 0, 0);
}

/**
 * يرسم حافة Fresnel — خط ضوئي يلتف حول محيط الشكل بالكامل
 * ويزداد سطوعاً عند الزوايا (محاكاة زاوية انعكاس الضوء عند حواف الزجاج)
 *
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} w
 * @param {number} h
 * @param {boolean} isCircle
 * @param {number} radius - نصف قطر الزوايا (roundRect) المستخدم في رسم الشكل
 * @param {number} intensity - شدة التأثير (0-1), افتراضي 0.5
 */
function drawFresnelRim(ctx, w, h, isCircle, radius, intensity = 0.5) {
  ctx.save();

  // مسار المحيط نفسه (نفس الشكل المستخدم أصلاً في roundRect/circle)
  ctx.beginPath();
  if (isCircle) {
    ctx.arc(w / 2, h / 2, Math.min(w, h) / 2 - 1, 0, Math.PI * 2);
  } else {
    ctx.roundRect(1, 1, w - 2, h - 2, radius);
  }

  // تدرّج شعاعي إضافي يحصر الإضاءة عند آخر ٪ صغيرة قرب الحافة فقط
  const grad = ctx.createRadialGradient(
    w / 2, h / 2, Math.min(w, h) / 2 * 0.78,
    w / 2, h / 2, Math.min(w, h) / 2
  );
  grad.addColorStop(0,   "rgba(255,255,255,0)");
  grad.addColorStop(0.7, `rgba(255,255,255,${intensity * 0.25})`);
  grad.addColorStop(1,   `rgba(255,255,255,${intensity * 0.85})`);

  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.max(2, Math.min(w, h) * 0.045);
  ctx.lineJoin = "round";
  ctx.stroke();

  // خط رفيع داخلي إضافي لزيادة حدة اللمعان عند أقصى الحافة (محاكاة Fresnel عند 90°)
  ctx.lineWidth = 1.1;
  ctx.strokeStyle = `rgba(255,255,255,${intensity * 0.9})`;
  ctx.stroke();

  ctx.restore();
}

// حواف الزجاج السائل محسّنة
function drawLiquidEdgesRealistic(ctx, w, h, isCircle) {
  ctx.save();

  // حافة علوية لامعة رفيعة
  const topEdge = ctx.createLinearGradient(0, 0, 0, h * 0.08);
  topEdge.addColorStop(0, "rgba(255,255,255,0.65)");
  topEdge.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = topEdge;
  if (isCircle) {
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.03, w * 0.42, h * 0.09, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(0, 0, w, h * 0.06);
  }

  // حافة سفلية انعكاس خفيف
  const botEdge = ctx.createLinearGradient(0, h * 0.92, 0, h);
  botEdge.addColorStop(0, "rgba(255,255,255,0)");
  botEdge.addColorStop(1, "rgba(255,255,255,0.22)");
  ctx.fillStyle = botEdge;
  if (isCircle) {
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.97, w * 0.42, h * 0.08, 0, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(0, h * 0.94, w, h * 0.06);
  }

  // خط حد علوي لامع شفاف (1px)
  ctx.strokeStyle = "rgba(255,255,255,0.55)";
  ctx.lineWidth = 1.2;
  if (isCircle) {
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, w / 2 - 1, 0, Math.PI * 2);
    ctx.stroke();
  } else {
    const r = Math.min(w, h) / 2;
    ctx.beginPath();
    ctx.roundRect(1, 1, w - 2, h - 2, r);
    ctx.stroke();
  }

  ctx.restore();
}

// تطبيق ضبابية (blur) على Canvas باستخدام filter مؤقت
function applyBlurToCanvas(ctx, w, h, blurPx) {
  if (blurPx <= 0) return;
  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = w;
  tempCanvas.height = h;
  const tempCtx = tempCanvas.getContext("2d");
  tempCtx.drawImage(ctx.canvas, 0, 0);
  tempCtx.filter = `blur(${blurPx}px)`;
  tempCtx.drawImage(tempCtx.canvas, 0, 0);
  ctx.clearRect(0, 0, w, h);
  ctx.drawImage(tempCtx.canvas, 0, 0);
}

async function exportAllAsZip(layout, bgImg, visualStyle) {
  let JSZip;
  try { JSZip = (await import("jszip")).default; } catch { throw new Error("JSZip unavailable"); }
  const { totalW, totalH } = calcSize(layout);
  const zip = new JSZip();
  for (const item of layout) {
    const cv  = await renderItemCanvas(item, bgImg, totalW, totalH, visualStyle);
    const cs  = item.capsuleStyle || DEFAULT_CAPSULE_STYLE;
   // PNG: كل ما يحتاج شفافية أو بدون خلفية صورة
// JPEG: فقط عندما الخلفية هي صورة المستخدم (global مع bgImg)
const bt = (item.capsuleStyle || DEFAULT_CAPSULE_STYLE).bgType || "global";
const hasBgImg = !!bgImg;
// JPEG فقط إذا الخلفية العامة موجودة وNوع الكبسولة global
const isPng = !hasBgImg || bt !== "global";
    const fmt  = isPng ? "image/png" : "image/jpeg";
    const ext  = isPng ? "png" : "jpg";
    const b64  = cv.toDataURL(fmt).replace(/^data:image\/(png|jpeg);base64,/, "");
    const name = item.label ? `btn-${item.label}.${ext}` : `btn-id-${item.id}.${ext}`;
    zip.file(name, b64, { base64: true });
  }
  const b64zip = await zip.generateAsync({ type:"base64" });
  try {
    const { Filesystem, Directory } = await import("@capacitor/filesystem");
    const { Share } = await import("@capacitor/share");
    await Filesystem.writeFile({ path:"QuickPanel-Widgets.zip", data:b64zip, directory:Directory.Cache });
    const fileUri = await Filesystem.getUri({ path:"QuickPanel-Widgets.zip", directory:Directory.Cache });
    await Share.share({ title:"QuickPanel Widgets", url:fileUri.uri, dialogTitle:"Save ZIP" });
    return;
  } catch(_) {}
  const byteChars=atob(b64zip), bytes=new Uint8Array(byteChars.length);
  for (let i=0;i<byteChars.length;i++) bytes[i]=byteChars.charCodeAt(i);
  const blob=new Blob([bytes],{type:"application/zip"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url; a.download="QuickPanel-Widgets.zip";
  document.body.appendChild(a); a.click();
  setTimeout(()=>{ document.body.removeChild(a); URL.revokeObjectURL(url); },3000);
}

// ── مساعد بناء خلفية CSS للكبسولة ──────────
// ── مساعد بناء خلفية CSS للكبسولة (تم تحديثه للتأثير ثلاثي الأبعاد) ──────────
function buildCapsuleBg(item, visualStyle, isDragging) {
  const cs = item.capsuleStyle || DEFAULT_CAPSULE_STYLE;
  const bt = cs.bgType || "global";

  // تدرج السطح ثلاثي الأبعاد (مشترك لجميع الخلفيات الصلبة والتدرجات)
  const surface3D = "inset 4px 4px 10px rgba(255,255,255,0.06), inset -5px -5px 12px rgba(0,0,0,0.18)";

  if (bt === "solid") {
    return { 
      background: hexToRgba(cs.bgColor1 || "#fff", cs.bgOpacity ?? 0.85), 
      backdropFilter: "none", WebkitBackdropFilter: "none",
      boxShadow: surface3D // ✅ تطبيق تأثير السطح
    };
  }
  if (bt === "gradient") {
    return { 
      background: `linear-gradient(${cs.bgGradientDir || "135deg"}, ${hexToRgba(cs.bgColor1 || "#fff", cs.bgOpacity ?? 0.85)}, ${hexToRgba(cs.bgColor2 || "#888", cs.bgOpacity ?? 0.85)})`, 
      backdropFilter: "none", WebkitBackdropFilter: "none",
      boxShadow: surface3D // ✅ تطبيق تأثير السطح
    };
  }
  if (bt === "frosted") {
    return {
      background: `linear-gradient(135deg, ${hexToRgba(cs.bgColor1 || "#fff", cs.bgOpacity ?? 0.25)}, ${hexToRgba(cs.bgColor2 || "#aaa", (cs.bgOpacity ?? 0.25) * 0.5)})`,
      backdropFilter: "blur(24px) saturate(1.8)", WebkitBackdropFilter: "blur(24px) saturate(1.8)",
      // ✅ دمج تأثير السطح مع الظل الأصلي المثلج
      boxShadow: `inset 0 2px 3px rgba(255,255,255,0.5), inset 0 -2px 4px rgba(0,0,0,0.2), 0 12px 40px rgba(0,0,0,0.35), ${surface3D}`,
    };
  }
  if (bt === "glass") {
    const blurVal = (cs.bgGlassBlur ?? 0.5) * 24;
    return {
      background: `linear-gradient(135deg, ${hexToRgba(cs.bgColor1 || "#fff", cs.bgOpacity ?? 0.15)}, ${hexToRgba(cs.bgColor2 || "#aaa", (cs.bgOpacity ?? 0.15) * 0.5)})`,
      backdropFilter: `blur(${blurVal}px) saturate(${1 + (cs.bgGlassBlur ?? 0.5)})`,
      WebkitBackdropFilter: `blur(${blurVal}px) saturate(${1 + (cs.bgGlassBlur ?? 0.5)})`,
      boxShadow: surface3D // ✅ تطبيق تأثير السطح
    };
  }
  if (bt === "liquid") {
    return {
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "none",
      WebkitBackdropFilter: "none",
      boxShadow: surface3D // ✅ تطبيق تأثير السطح
    };
  }
  if (bt === "image" && cs.bgImage) {
    return { 
      background: "#111", backdropFilter: "none", WebkitBackdropFilter: "none",
      boxShadow: surface3D // ✅ تطبيق تأثير السطح
    };
  }
  // global fallback
  return {
    background: visualStyle === "transparent"
      ? (isDragging ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.0)")
      : (isDragging ? "rgba(255,255,255,0.10)" : "rgba(22,20,18,0.50)"),
    backdropFilter: visualStyle === "transparent" ? "none" : "blur(18px) saturate(1.2)",
    WebkitBackdropFilter: visualStyle === "transparent" ? "none" : "blur(18px) saturate(1.2)",
    boxShadow: visualStyle === "blurred" ? surface3D : "none" // ✅ تطبيق تأثير السطح فقط في الوضع الضبابي العام
  };
}

// ── طبقة Liquid Glass الحقيقية (تعتمد على Canvas مثل التصدير) ──
function LiquidGlassLayer({ item, blurAmount = 0.5, bgImg, totalW, totalH }) {
  const canvasRef = useRef(null);
  const isCircle = item.colSpan === 1 && item.rowSpan === 1;
  const isPill = (item.colSpan >= 2 && item.rowSpan === 1) || (item.colSpan === 1 && item.rowSpan >= 2);
  const borderRadius = isCircle ? "50%" : isPill ? "9999px" : "28px";

  const x = GAP_EX + (item.col - 1) * (CELL_W + GAP_EX);
  const y = GAP_EX + (item.row - 1) * (CELL_H + GAP_EX);
  const w = item.colSpan * CELL_W + (item.colSpan - 1) * GAP_EX;
  const h = item.rowSpan * CELL_H + (item.rowSpan - 1) * GAP_EX;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !bgImg || !bgImg.width) return;

    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");

    // ── 1. اقتطع منطقة الخلفية خلف الكبسولة ──
    const ir = bgImg.width / bgImg.height;
    const pr = totalW / totalH;
    let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
    if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
    else         { dh = bgImg.width / pr;  oy = (bgImg.height - dh) / 2; }
    const sx = dw / totalW, sy = dh / totalH;
    const extra = 12;
    ctx.drawImage(bgImg,
      ox + (x - extra) * sx, oy + (y - extra) * sy,
      (w + extra * 2) * sx, (h + extra * 2) * sy,
      -extra, -extra, w + extra * 2, h + extra * 2
    );

    // ── 2. blur حقيقي عبر canvas مؤقت ──
    const blurPx = Math.round(blurAmount * 18);
    if (blurPx > 0) {
      // نرسم على canvas مؤقت مع filter
      const tmp = document.createElement("canvas");
      tmp.width = w; tmp.height = h;
      const tmpCtx = tmp.getContext("2d");
      tmpCtx.filter = `blur(${blurPx}px)`;
      tmpCtx.drawImage(canvas, -extra, -extra, w + extra * 2, h + extra * 2);
      tmpCtx.filter = "none";
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(tmp, 0, 0);
    }

    // ── 3. خوارزمية الانكسار على الحواف (مثل الموقع) ──
    const imgData = ctx.getImageData(0, 0, w, h);
    const src = new Uint8ClampedArray(imgData.data);
    const dst = imgData.data;
    const R = Math.min(w, h) * 0.42; // نصف قطر منطقة الانكسار
    const strength = 0.32;           // قوة الانكسار

    for (let j = 0; j < h; j++) {
      for (let i = 0; i < w; i++) {
        // المسافة من المركز (0 = مركز، 1 = حافة)
        const nx = (i - w / 2) / (w / 2);
        const ny = (j - h / 2) / (h / 2);
        const dist = Math.sqrt(nx * nx + ny * ny);

        let srcX = i, srcY = j;
        if (dist > 0.01) {
          // انكسار يزداد كلما اقتربنا من الحافة
          const edgeFactor = Math.max(0, dist - (R / (Math.min(w, h) / 2))) / (1 - (R / (Math.min(w, h) / 2)));
          const refract = Math.pow(Math.max(0, edgeFactor), 2) * strength;
          srcX = i + (nx / dist) * refract * w * 0.5;
          srcY = j + (ny / dist) * refract * h * 0.5;
        }

        srcX = Math.min(w - 1, Math.max(0, Math.round(srcX)));
        srcY = Math.min(h - 1, Math.max(0, Math.round(srcY)));
        const si = (srcY * w + srcX) * 4;
        const di = (j * w + i) * 4;
        dst[di]     = src[si];
        dst[di + 1] = src[si + 1];
        dst[di + 2] = src[si + 2];
        dst[di + 3] = 255;
      }
    }
    ctx.putImageData(imgData, 0, 0);

    // ── 4. طبقة تلوين شفافة خفيفة جداً ──
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    ctx.fillRect(0, 0, w, h);

  }, [item.id, item.col, item.row, item.colSpan, item.rowSpan, blurAmount, bgImg, totalW, totalH, w, h, x, y, isCircle]);

  return (
    <canvas ref={canvasRef}
      style={{
        position: "absolute", inset: 0,
        width: "100%", height: "100%",
        borderRadius, pointerEvents: "none", zIndex: 0,
      }}
    />
  );
}

// محتوى عرض الكبسولة (تم تحديثه للتأثير ثلاثي الأبعاد واللون الصح) 
// ── محتوى عرض الكبسولة (تم تحديثه للتأثير ثلاثي الأبعاد والنسب المتطابقة مع التصدير) ──────────────────────
function ItemContent({ item, visualStyle }) {
  const cs = item.capsuleStyle || DEFAULT_CAPSULE_STYLE;
  const isCircle = item.colSpan===1 && item.rowSpan===1;
  const isWide   = item.colSpan>=2  && item.rowSpan===1;
  const isSquare = item.colSpan>=2  && item.rowSpan>=2;
  const isTall   = item.colSpan===1 && item.rowSpan>=2;

  const bt = cs.bgType || "global";
  const dropShadow = (bt==="global" && visualStyle==="transparent") ? "drop-shadow(0px 1px 3px rgba(0,0,0,0.8))" : "none";
  const textShadow = (bt==="global" && visualStyle==="transparent") ? "0 1px 3px rgba(0,0,0,0.8)" : "none";

  const isGrad = cs.iconColorType === "gradient";
  const baseBg = isGrad 
    ? `linear-gradient(135deg, ${cs.iconColor||"#ffffff"}, ${cs.iconColor2||"#f0a060"})`
    : (cs.iconColor || "#ffffff");

  const depthOverlay = `linear-gradient(135deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 35%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.3) 100%)`;

  const getIconElement = (size) => (
    <div style={{
      width: size, height: size, // نستخدم النسبة المئوية هنا
      WebkitMaskImage: `url(/icons/${item.icon})`,
      WebkitMaskSize: "contain",
      WebkitMaskRepeat: "no-repeat",
      WebkitMaskPosition: "center",
      background: isGrad ? `${depthOverlay}, ${baseBg}` : `${depthOverlay}, linear-gradient(${baseBg}, ${baseBg})`,
      filter: dropShadow !== "none" ? dropShadow : "drop-shadow(1px 2px 2px rgba(0,0,0,0.3))",
      opacity: cs.iconOpacity ?? 1,
      transition: "background 0.2s ease"
    }} />
  );

  const makeTextStyle = () => {
    const isGrad = cs.textColorType==="gradient";
    return {
      color: isGrad ? "transparent" : hexToRgba(cs.textColor||"#fff", cs.textOpacity??1),
      backgroundImage: isGrad ? `linear-gradient(135deg, ${cs.textColor||"#fff"}, ${cs.textColor2||"#f0a060"})` : "none",
      backgroundSize: isGrad ? "100%" : "auto",
      WebkitBackgroundClip: isGrad ? "text" : "unset",
      WebkitTextFillColor: isGrad ? "transparent" : "unset",
      backgroundClip: isGrad ? "text" : "unset",
      display: "inline-block",
      fontSize: "clamp(12px, 3.5vw, 15px)", // خط ديناميكي يتجاوب مع الشاشة
      fontWeight: 600,
      textShadow: isGrad ? "none" : textShadow,
      opacity: cs.textOpacity ?? 1,
    };
  };

  const iconBgStyle = cs.showIconBg!==false
    ? { 
        background: cs.iconBgColorType==="gradient"
          ? `linear-gradient(135deg, ${hexToRgba(cs.iconBgColor||"#ffffff", cs.iconBgOpacity??0.18)}, ${hexToRgba(cs.iconBgColor2||"#f0a060", cs.iconBgOpacity??0.18)})`
          : hexToRgba(cs.iconBgColor||"#ffffff", cs.iconBgOpacity??0.18),
        boxShadow: "2px 3px 6px rgba(0,0,0,0.3), inset 2px 2px 5px rgba(0,0,0,0.35), inset -2px -2px 5px rgba(255,255,255,0.15)"
      }
    : { background:"transparent" };

  // النسب أدناه مطابقة 100% لمعادلات الـ Canvas لتصدير الصورة
  if (isSquare) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", width:"100%", height:"100%", pointerEvents:"none", zIndex: 10 }}>
      {item.icon && (
        <div style={{ width:"38%", aspectRatio:"1/1", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:"6%", ...iconBgStyle }}>
          {getIconElement("71%")}
        </div>
      )}
      {item.label && <span style={{...makeTextStyle(), display:"inline"}}>{item.label}</span>}
    </div>
  );

  if (isWide) {
    const align = item.iconAlign || "right";
    const circlePos = { position:"absolute", top:"50%", height:"72%", aspectRatio:"1/1", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", ...iconBgStyle };
    if (align === "left")   { circlePos.left = "6%";  circlePos.transform = "translateY(-50%)"; }
    if (align === "right")  { circlePos.right = "6%"; circlePos.transform = "translateY(-50%)"; }
    if (align === "center") { circlePos.left = "50%"; circlePos.transform = "translate(-50%,-50%)"; }
    return (
      <div style={{ position:"absolute", inset:0, pointerEvents:"none", zIndex:10 }}>
        <div style={circlePos}>
          {item.icon && getIconElement("60%")}
        </div>
        {align !== "center" && item.label && (
          <span style={{ 
            position:"absolute", 
            left: align === "left" ? "38%" : "5%",
            right: align === "right" ? "38%" : "5%",
            top:"50%", transform:"translateY(-50%)", 
            textAlign:"center", 
            ...makeTextStyle()
          }}>
            {item.label}
          </span>
        )}
      </div>
    );
  }

  if (isCircle) return (
    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex: 10 }}>
      <div style={{ width:"65%", aspectRatio:"1/1", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", ...iconBgStyle }}>
        {item.icon && getIconElement("71%")}
      </div>
    </div>
  );

  if (isTall && item.icon) return (
    <div style={{ position:"absolute", top:item.iconPos==="top"?"5%":"50%", left:"50%",
      transform:item.iconPos==="top"?"translateX(-50%)":"translate(-50%,-50%)",
      width:"72%", aspectRatio:"1/1", borderRadius:"50%", ...iconBgStyle,
      display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none", zIndex: 10 }}>
      {getIconElement("60%")}
    </div>
  );
  return null;
}

// ── اختيار اللون المتقدم ─────────────────────
// ── اختيار اللون المتقدم (محدث مع انيميشن الانزلاق والفقاعة) ─────────────────────
// ── اختيار اللون المتقدم (محدث مع انيميشن الانزلاق والفقاعة ودعم اللغتين) ─────────────────────
function ColorSection({ label, colorType, setColorType, color1, setColor1, color2, setColor2, opacity, setOpacity, t, th, triggerHaptic, setPickerOpen, isRtl }) {
  return (
    <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:14, padding:"12px 14px", border:`1px solid ${th.border}` }}>
      
      {/* العنوان وأزرار نوع اللون (فقاعة عائمة) */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:12, color:th.textMuted, fontWeight:600 }}>{label}</span>
        <div style={{ display:"flex", position:"relative", background:"rgba(0,0,0,0.2)", borderRadius:10, padding:3, width:130 }}>
          
          {/* الفقاعة العائمة لخيارات الألوان (تم حل مشكلة الاتجاه) */}
          <div style={{
            position:"absolute", top:3, bottom:3, width:"calc(50% - 3px)",
            background:th.accentGlow, borderRadius:8, border:`1px solid ${th.accent}`,
            // ✅ التعديل هنا: نستخدم right للعربي و left للإنجليزي
            ...(isRtl 
              ? { right: colorType==="solid" ? "3px" : "calc(50%)" } 
              : { left: colorType==="solid" ? "3px" : "calc(50%)" }
            ),
            transition:"all 0.3s cubic-bezier(0.25, 1, 0.5, 1)", pointerEvents:"none", zIndex:1
          }}/>

          {["solid","gradient"].map(type => (
            <button key={type} onClick={() => { triggerHaptic("light"); setColorType(type); }}
              style={{ flex:1, padding:"4px 0", border:"none", background:"transparent",
                color:colorType===type?th.accent:th.textMuted, fontSize:11, fontWeight:700, cursor:"pointer",
                transition:"color 0.3s ease", zIndex:2 }}>
              {type==="solid" ? t.solidColor : t.gradColor}
            </button>
          ))}
        </div>
      </div>

      {/* خيارات الألوان (مع انيميشن سلس للظهور) */}
      <div style={{ display:"flex", gap:12, alignItems:"flex-end", marginBottom:12 }}>
        
        {/* اللون الأول */}
        <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
          <label style={{ fontSize:11, color:th.textMuted, minWidth:40 }}>{t.capBgColor1}</label>
          <ColorPicker value={color1} onChange={setColor1} th={th} setOpenState={setPickerOpen} triggerHaptic={triggerHaptic}
            style={{ width:36, height:28, border:`1px solid ${th.border}`, borderRadius:8, cursor:"pointer" }}/>
        </div>

        {/* اللون الثاني (يظهر ويختفي بنعومة) */}
        <div style={{ 
          display:"flex", flexDirection:"column", gap:6, overflow:"hidden",
          transition:"all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
          maxWidth: colorType==="gradient" ? "100px" : "0px",
          opacity: colorType==="gradient" ? 1 : 0,
          transform: colorType==="gradient" ? "translateX(0)" : "translateX(10px)"
        }}>
          <label style={{ fontSize:11, color:th.textMuted, minWidth:40, whiteSpace:"nowrap" }}>{t.capBgColor2}</label>
          <ColorPicker value={color2||"#888888"} onChange={setColor2} th={th} setOpenState={setPickerOpen} triggerHaptic={triggerHaptic}
            style={{ width:36, height:28, border:`1px solid ${th.border}`, borderRadius:8, cursor:"pointer" }}/>
        </div>
      </div>

      {/* الشفافية */}
      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
        <label style={{ fontSize:11, color:th.textMuted, minWidth:60 }}>{t.opacity}</label>
        <input type="range" min="0" max="1" step="0.01" value={opacity??1}
          onChange={e=>setOpacity(parseFloat(e.target.value))}
          style={{ flex:1, accentColor:th.accent }}/>
        <span style={{ fontSize:11, color:th.textMuted, minWidth:32 }}>{Math.round((opacity??1)*100)}%</span>
      </div>
    </div>
  );
}

// ── بانيل تعديل الكبسولة المتقدم (يظهر من الأسفل) ──
function CapsuleEditPanel({ item, onSave, onClose, globalBgImg, visualStyle, totalW, totalH, t, th, lang, triggerHaptic }) {
  const [cfg, setCfg] = useState({ ...item, capsuleStyle: { ...DEFAULT_CAPSULE_STYLE, ...(item.capsuleStyle||{}) } });
  const [activeTab, setActiveTab] = useState("icon");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [capImgPending, setCapImgPending] = useState(null);
  const [imgEditing, setImgEditing] = useState(false);
  const [previewZoomed, setPreviewZoomed] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const capImgRef    = useRef(null);
  const previewImgRef = useRef(null);
  const imgDragRef   = useRef(null);
  const pinchImgRef  = useRef(null);
  const imgOffsetRef = useRef({ x: (item.capsuleStyle?.bgImageOffsetX??0), y: (item.capsuleStyle?.bgImageOffsetY??0) });
  const imgScaleRef  = useRef(item.capsuleStyle?.bgImageScale??1);
  const isRtl = lang === "ar";

  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const cs = cfg.capsuleStyle;
  const updateCS = (patch) => setCfg(c => ({ ...c, capsuleStyle: { ...c.capsuleStyle, ...patch } }));

  const filtered = ICONS.filter(ic => iconLabel(ic).toLowerCase().includes(search.toLowerCase()));

  const BG_TYPES = [
    { id:"global",  label:t.capBgGlobal },
    { id:"solid",   label:t.capBgSolid },
    { id:"gradient",label:t.capBgGradient },
    { id:"glass",   label:t.capBgGlass },
    { id:"liquid",  label: lang==="ar" ? "زجاج سائل" : "Liquid Glass" },
    { id:"image",   label:t.capBgImage },
  ];

  const GRAD_DIRS = ["to right","to bottom","135deg","45deg","to right bottom","to left bottom"];

  // معاينة نمط الكبسولة
  const previewBg = (() => {
    const bt = cs.bgType||"global";
    if (bt==="solid") return { background: hexToRgba(cs.bgColor1||"#fff", cs.bgOpacity??0.85) };
    if (bt==="gradient") return { background: `linear-gradient(${cs.bgGradientDir||"135deg"}, ${hexToRgba(cs.bgColor1||"#fff",cs.bgOpacity??0.85)}, ${hexToRgba(cs.bgColor2||"#888",cs.bgOpacity??0.85)})` };
    if (bt==="frosted") return {
      background: `linear-gradient(135deg, ${hexToRgba(cs.bgColor1||"#fff",cs.bgOpacity??0.22)}, ${hexToRgba(cs.bgColor2||"#aaa",cs.bgOpacity??0.12)})`,
      backdropFilter:"blur(22px) saturate(1.8)", WebkitBackdropFilter:"blur(22px) saturate(1.8)",
      boxShadow:`inset 0 1.5px 0 rgba(255,255,255,0.4), 0 8px 32px rgba(0,0,0,0.22)`
    };
    if (bt==="clear") return {
      background: `linear-gradient(135deg, ${hexToRgba(cs.bgColor1||"#fff",cs.bgOpacity??0.10)}, ${hexToRgba(cs.bgColor2||"#aaa",cs.bgOpacity??0.05)})`,
      backdropFilter:"blur(8px) saturate(1.4)", WebkitBackdropFilter:"blur(8px) saturate(1.4)",
      boxShadow:`inset 0 1px 0 rgba(255,255,255,0.5)`
    };

    if (bt==="glass") {
      const blurPx = (cs.bgGlassBlur ?? 0.5) * 24;
      const saturation = 1 + (cs.bgGlassBlur ?? 0.5) * 1.5;
      return {
        background: `linear-gradient(135deg, ${hexToRgba(cs.bgColor1||"#fff", cs.bgOpacity??0.15)}, ${hexToRgba(cs.bgColor2||"#aaa", (cs.bgOpacity??0.15)*0.5)})`,
        backdropFilter: `blur(${blurPx}px) saturate(${saturation})`,
        WebkitBackdropFilter: `blur(${blurPx}px) saturate(${saturation})`,
        boxShadow: `inset 0 1.5px 0 rgba(255,255,255,0.6), inset 0 -1px 0 rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.25)`,
      };
    }
    if (bt==="liquid") {
      const blurPx = (cs.bgGlassBlur ?? 0.5) * 20;
      return {
        background: "rgba(255,255,255,0.08)",
        backdropFilter: `blur(${blurPx}px)`,
        WebkitBackdropFilter: `blur(${blurPx}px)`,
      };
    }
    if (bt==="image" && cs.bgImage) return { background:`url(${cs.bgImage}) center/cover no-repeat` };
    // global
    return visualStyle==="blurred"
      ? { background:"rgba(22,20,18,0.50)", backdropFilter:"blur(18px)", WebkitBackdropFilter:"blur(18px)" }
      : { background:"rgba(255,255,255,0.04)", border:"1.5px solid rgba(255,255,255,0.45)" };
  })();

  const isCircle = cfg.colSpan===1 && cfg.rowSpan===1;
  const isWide   = cfg.colSpan>=2  && cfg.rowSpan===1;
  const isPill   = isWide || (cfg.colSpan===1 && cfg.rowSpan>=2);
  const previewRadius = isCircle ? "50%" : isPill ? "9999px" : "22px";
  const previewW = isCircle ? 80 : isWide ? 160 : cfg.colSpan>=2 ? 160 : 80;
  const previewH = isCircle ? 80 : isWide ? 80 : cfg.rowSpan>=2 ? 160 : 80;
  const zoomRatioX = Math.min(previewW * 2.2, 300) / previewW;
  const zoomRatioY = Math.min(previewH * 2.2, 300) / previewH;

  const applyImgTransform = useCallback(() => {
    if (!previewImgRef.current) return;
    const ox = imgOffsetRef.current.x;
    const oy = imgOffsetRef.current.y;
    const sc = imgScaleRef.current;
    previewImgRef.current.style.transform = `translate(${ox}px, ${oy}px) scale(${sc})`;
  }, []);

  const onImgTouchStart = useCallback((e) => {
    if (!imgEditing) return;
    e.stopPropagation();
    if (e.touches.length === 1) {
      imgDragRef.current = {
        startX: e.touches[0].clientX, startY: e.touches[0].clientY,
        startOX: imgOffsetRef.current.x, startOY: imgOffsetRef.current.y,
      };
      pinchImgRef.current = null;
    } else if (e.touches.length === 2) {
      imgDragRef.current = null;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      pinchImgRef.current = { startDist: Math.hypot(dx,dy), startScale: imgScaleRef.current };
    }
  }, [imgEditing]);

  const onImgTouchMove = useCallback((e) => {
    if (!imgEditing) return;
    e.stopPropagation();
    if (e.cancelable) e.preventDefault();

    // حالة الإصبعين — تكبير/تصغير
    if (e.touches.length === 2 && pinchImgRef.current) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const newScale = Math.min(5, Math.max(0.3,
        pinchImgRef.current.startScale * (Math.hypot(dx, dy) / pinchImgRef.current.startDist)
      ));
      imgScaleRef.current = newScale;
      applyImgTransform();
      return;
    }

    // حالة إصبع واحد — تحريك
    if (!imgDragRef.current || e.touches.length > 1) return;

    const dx = e.touches[0].clientX - imgDragRef.current.startX;
    const dy = e.touches[0].clientY - imgDragRef.current.startY;

    imgOffsetRef.current = {
      x: imgDragRef.current.startOX + dx,
      y: imgDragRef.current.startOY + dy,
    };
    applyImgTransform();
  }, [imgEditing, applyImgTransform]);

  const onImgTouchEnd = useCallback(() => {
  if (!imgEditing) return;
  imgDragRef.current = null;
  pinchImgRef.current = null;
  updateCS({
    bgImageOffsetX: imgOffsetRef.current.x / zoomRatioX,
    bgImageOffsetY: imgOffsetRef.current.y / zoomRatioY,
    bgImageScale: imgScaleRef.current,
  });
}, [imgEditing, updateCS, zoomRatioX, zoomRatioY]);

const handleCapImgChange = async (e) => {
  const file = e.target.files[0]; if (!file) return;
  const reader = new FileReader();
  reader.onload = async (ev) => {
    const resized = await resizeImageIfNeeded(ev.target.result, 800);
    updateCS({ bgImage: resized, bgType:"image" });
  };
  reader.readAsDataURL(file);
  e.target.value="";
};

  const iconColorStyle = cs.iconColorType==="gradient"
    ? { background:`linear-gradient(135deg,${cs.iconColor||"#fff"},${cs.iconColor2||"#f0a060"})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }
    : { color: hexToRgba(cs.iconColor||"#fff", cs.iconOpacity??1) };

  const textColorStyle = cs.textColorType==="gradient"
    ? { background:`linear-gradient(135deg,${cs.textColor||"#fff"},${cs.textColor2||"#f0a060"})`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }
    : { color: hexToRgba(cs.textColor||"#fff", cs.textOpacity??1) };

  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0,
  background: previewZoomed
    ? "rgba(0,0,0,0.96)"
    : mounted ? "rgba(0,0,0,0.82)" : "rgba(0,0,0,0)",
  backdropFilter: previewZoomed ? "blur(28px)" : mounted ? "blur(14px)" : "blur(0px)",
        display:"flex", flexDirection:"column",
        justifyContent:"flex-end", zIndex:9200, transition:"background 0.3s, backdrop-filter 0.3s",
        paddingBottom:"env(safe-area-inset-bottom,0px)" }}>

      <div style={{ background: `linear-gradient(165deg, ${th.navBg} 0%, ${th.surface} 60%, ${hexToRgba(th.accent, 0.04)} 100%)`, backdropFilter:"blur(28px) saturate(1.4)", WebkitBackdropFilter:"blur(28px) saturate(1.4)",
        width:"100%", maxWidth:480, margin:"0 auto", borderRadius:"28px 28px 0 0",
        border:`1px solid ${th.borderHover}`, borderBottom:"none",
        boxShadow:`0 -24px 60px rgba(0,0,0,0.7), 0 -4px 30px ${th.modalGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        transform:mounted?"translateY(0)":"translateY(100%)",
        transition:"transform 0.42s cubic-bezier(0.16,1,0.3,1)",
        maxHeight:"90vh", display:"flex", flexDirection:"column", direction:isRtl?"rtl":"ltr",
        overflow:"hidden" }}>

        {/* شريط السحب */}
        <div style={{ width:44, height:5, background:`linear-gradient(90deg,transparent,${th.accent}80,transparent)`, borderRadius:3, margin:"12px auto 0" }}/>

        {/* ── المعاينة المباشرة ── */}
        <div style={{ padding:"18px 18px 0", display:"flex", flexDirection:"column", alignItems:"center", gap:12, flexShrink:0 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", width:"100%" }}>
            <span style={{ fontSize:13, fontWeight:700, color:th.text, opacity:0.7 }}>{t.livePreview}</span>
            <button onClick={onClose} style={{ background:"transparent", border:"none", color:th.textMuted, cursor:"pointer", padding:4, display:"flex" }}><SVGIcons.Close /></button>
          </div>

          {/* الكبسولة المعاينة */}
          <div style={{
            position:"relative",
            width: previewZoomed ? Math.min(previewW * 2.2, 300) : previewW,
            height: previewZoomed ? Math.min(previewH * 2.2, 300) : previewH,
            marginBottom: previewZoomed ? 40 : 10, // هذا السطر يمنع التداخل مع القوائم السفلية
            transition: "width 0.45s cubic-bezier(0.34,1.56,0.64,1), height 0.45s cubic-bezier(0.34,1.56,0.64,1), margin 0.45s ease",
            }}>
            {/* صورة الخلفية خلف الزجاج */}
            {globalBgImg && cs.bgType !== "image" && (
  <div style={{
    position: "absolute", inset: -20,
    backgroundImage: `url(${globalBgImg.src})`,
    backgroundSize: "cover", backgroundPosition: "center",
    borderRadius: previewRadius,
    zIndex: 0,
    opacity: (cs.bgType === "solid" || cs.bgType === "gradient" || cs.bgType === "glass") ? 0.9 : 1,
  }} />
)}
              <div
            onTouchStart={cs.bgType==="image" && cs.bgImage && imgEditing ? onImgTouchStart : undefined}
            onTouchMove={cs.bgType==="image"  && cs.bgImage && imgEditing ? onImgTouchMove  : undefined}
            onTouchEnd={cs.bgType==="image"   && cs.bgImage && imgEditing ? onImgTouchEnd   : undefined}
            style={{
              position:"absolute", inset:0,
              borderRadius:previewRadius, overflow:"hidden",
              ...(cs.bgType==="image" && cs.bgImage ? { background:"#111" } : previewBg),
              border:`1.5px solid rgba(255,255,255,${(cs.bgType==="clear"||cs.bgType==="frosted")?"0.4":"0.12"})`,
              boxShadow:`0 10px 36px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.06)`,
              cursor: cs.bgType==="image" && cs.bgImage && imgEditing ? "grab" : "default",
              touchAction: imgEditing ? "none" : "auto",
              transition:"all 0.25s ease",
              display:"flex", alignItems:"center", justifyContent:"center",
              zIndex:1
          }}>
            {/* صورة الكبسولة مع دعم التحريك */}
            {cs.bgType==="image" && cs.bgImage && (
              <img
                ref={previewImgRef}
                src={cs.bgImage}
                alt=""
                draggable={false}
                style={{
                  position:"absolute",
                  left: 0, top: 0,
                  width: "100%", height: "100%",
                  objectFit: "cover",
                  transformOrigin: "center",
                  transform: `translate(${(cs.bgImageOffsetX??0) * (previewZoomed ? zoomRatioX : 1)}px, ${(cs.bgImageOffsetY??0) * (previewZoomed ? zoomRatioY : 1)}px) scale(${cs.bgImageScale??1})`,
                  pointerEvents:"none",
                  userSelect:"none",
                  WebkitUserSelect:"none",
                }}
              />
            )}
            {/* ✅ Liquid Glass في المعاينة */}
{cfg.capsuleStyle?.bgType==="liquid" && (
  <LiquidGlassLayer 
  item={cfg} 
  blurAmount={cfg.capsuleStyle?.bgGlassBlur ?? 0.5} 
  bgImg={globalBgImg}
  totalW={totalW}
  totalH={totalH}
  visualStyle={visualStyle}
/>
)}

{/* حلقة داخلية إضافية للزجاج السائل */}
{cfg.capsuleStyle?.bgType === "liquid" && (
  <div style={{
    position: "absolute",
    inset: 4,
    borderRadius: "inherit",
    border: "1px solid rgba(255,255,255,0.20)",
    pointerEvents: "none",
    zIndex: 3,
  }}/>
)}

                {/* التصميم الزجاجي الفخم الجديد للمعاينة (Liquid & 3D Glass) */}
                {(cfg.capsuleStyle?.bgType==="liquid" || cfg.capsuleStyle?.bgType==="glass") && (() => {
                  const isGlass = item.capsuleStyle?.bgType === "glass";
                  const isCir = item.colSpan === 1 && item.rowSpan === 1;
                  const op = isGlass ? 1 : 0.85;
                  return (
                    <>
                      {/* الإطار المتدرج والانعكاس المائل الكبير */}
                      <div style={{
                        position: "absolute", inset: 0,
                        borderRadius: "inherit",
                        boxShadow: `inset 3px 3px 6px rgba(255,255,255,${0.4 * op}), inset -2px -2px 5px rgba(0,0,0,${0.4 * op}), inset 0 0 0 1px rgba(255,255,255,${0.15 * op})`,
                        background: `linear-gradient(155deg, rgba(255,255,255,${0.35 * op}) 0%, rgba(255,255,255,${0.05 * op}) 35%, rgba(255,255,255,0) 40%)`,
                        pointerEvents: "none", zIndex: 2,
                      }}/>
                      {/* اللمعة أعلى اليسار */}
                      <div style={{
                        position: "absolute",
                        top: isCir ? "15%" : "12%", left: isCir ? "15%" : "6%",
                        width: isCir ? "25%" : "15%", aspectRatio: "1/1",
                        background: `radial-gradient(circle, rgba(255,255,255,${0.9 * op}) 0%, rgba(255,255,255,${0.25 * op}) 40%, rgba(255,255,255,0) 70%)`,
                        borderRadius: "50%", pointerEvents: "none", zIndex: 2,
                      }}/>
                      {/* اللمعة أسفل اليمين */}
                      <div style={{
                        position: "absolute",
                        bottom: isCir ? "15%" : "12%", right: isCir ? "15%" : "6%",
                        width: isCir ? "20%" : "12%", aspectRatio: "1/1",
                        background: `radial-gradient(circle, rgba(255,255,255,${0.8 * op}) 0%, rgba(255,255,255,${0.2 * op}) 40%, rgba(255,255,255,0) 70%)`,
                        borderRadius: "50%", pointerEvents: "none", zIndex: 2,
                      }}/>
                    </>
                  );
                })()}

                  <ItemContent item={cfg} visualStyle={visualStyle}/>
                  </div>
                  </div>
                  </div>

       {/* ── تابات ── */}
        <div style={{ padding:"14px 18px 0", flexShrink:0 }}>
          <div style={{ display:"flex", position:"relative", background:"rgba(0,0,0,0.2)", borderRadius:14, padding:4 }}>
            {/* الفقاعة العائمة */}
            {/* الفقاعة العائمة للتابات (تم حل مشكلة الاتجاه) */}
            <div style={{
              position:"absolute", top:4, bottom:4, width:"calc(33.333% - 2.6px)",
              background:th.accentGlow, borderRadius:10, border:`1px solid ${th.accent}`,
              // ✅ التعديل هنا لدعم اللغتين
              ...(isRtl
                ? { right: activeTab==="icon" ? "4px" : activeTab==="bg" ? "calc(33.333% + 1.3px)" : "calc(66.666% - 1px)" }
                : { left:  activeTab==="icon" ? "4px" : activeTab==="bg" ? "calc(33.333% + 1.3px)" : "calc(66.666% - 1px)" }
              ),
              transition:"all 0.35s cubic-bezier(0.25, 1, 0.5, 1)", pointerEvents:"none", zIndex:1
            }}/>
            
            {/* الأزرار */}
            {[
              { id:"icon", label:t.iconTab },
              { id:"bg",   label:t.bgTab },
              { id:"color",label:t.colorTab },
            ].map(tab => (
              <button key={tab.id} onClick={() => { triggerHaptic("light"); setActiveTab(tab.id); }}
                style={{ flex:1, padding:"9px 0", borderRadius:10, border:"none", background:"transparent",
                  color:activeTab===tab.id?th.accent:th.textMuted, fontSize:12, fontWeight:700, cursor:"pointer",
                  transition:"color 0.3s ease", zIndex:2 }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── محتوى التابات ── */}
<div style={{ flex:1, overflowY:"auto", padding:"14px 18px 24px", position:"relative", minHeight:320 }}>

  {/* ── تاب الأيقونة ── */}
  <div style={{
    display:"flex", flexDirection:"column", gap:12,
    opacity: activeTab==="icon" ? 1 : 0,
    pointerEvents: activeTab==="icon" ? "auto" : "none",
    transform: activeTab==="icon" ? "translateY(0px)" : "translateY(10px)",
    transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)",
    position: activeTab==="icon" ? "relative" : "absolute",
    top:0, left:0, right:0,
  }}>
    {/* ✅ التعديل: إضافة مستطيل زجاجي عائم لتجميع الأدوات (التحديد الأخضر/الأصفر) */}
    <div style={{ display:"flex", flexDirection:"column", gap:16, background: "rgba(31, 20, 14, 0.25)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderRadius:24, border:`1px solid ${th.borderHover}`, padding: "20px 18px", boxShadow: `0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 14px ${th.accentGlow}`, marginTop: 10 }}>
    
    {/* اختيار الأيقونة */}
    <div>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
        <p style={{ color:th.textMuted, fontSize:12, margin:0 }}>{t.chooseIcon}</p>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:showSearch?th.border:"transparent", borderRadius:20, padding:"4px 10px", transition:"all .25s" }}>
          <span onClick={()=>{setShowSearch(s=>!s); if(showSearch)setSearch("");}} style={{ cursor:"pointer", color:th.text, display:"flex" }}><SVGIcons.Search /></span>
          <input type="text" placeholder={t.searchIcon} value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:showSearch?110:0, opacity:showSearch?1:0, background:"transparent", border:"none", color:th.text, outline:"none", fontSize:12, transition:"width .25s,opacity .25s", pointerEvents:showSearch?"auto":"none" }}/>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:5, maxHeight:180, overflowY:"auto" }}>
        <div onClick={()=>setCfg(c=>({...c,icon:""}))}
          style={{ background:!cfg.icon?th.accentGlow:"transparent", border:`1px solid ${!cfg.icon?th.accent:th.border}`, borderRadius:10, padding:'3.5% 1.5%', display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
          <div style={{ width:20, height:20, borderRadius:"50%", background:th.border }}/><span style={{ fontSize:11, color:th.text }}>{t.noIcon}</span>
        </div>
        {filtered.map(ic => (
          <div key={ic} onClick={()=>setCfg(c=>({...c,icon:ic}))}
            style={{ background:cfg.icon===ic?th.accentGlow:"transparent", border:`1px solid ${cfg.icon===ic?th.accent:th.border}`, borderRadius:10, padding: '3.5% 1.5%', display:"flex", alignItems:"center", gap:6, cursor:"pointer" }}>
            <img src={`/icons/${ic}`} width={20} height={20} style={{ objectFit:"contain" }} alt=""/>
            <span style={{ fontSize:11, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{iconLabel(ic)}</span>
          </div>
        ))}
      </div>
    </div>
    {/* النص */}
    <div>
      <p style={{ color:th.textMuted, fontSize:12, margin:"0 0 6px" }}>{t.labelOpt}</p>
      <input type="text" value={cfg.label||""} onChange={e=>setCfg(c=>({...c,label:e.target.value}))}
        style={{ width:"50%", boxSizing:"border-box", padding:"10px 12px", background:"rgba(255,255,255,0.04)", color:th.text, border:`1px solid ${th.border}`, borderRadius:10, outline:"none", fontSize:13 }}
        placeholder={t.labelEx}/>
    </div>
    {/* تبديل خلفية الأيقونة */}
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", background:"rgba(255,255,255,0.03)", borderRadius:12, padding:"10px 14px", border:`1px solid ${th.border}` }}>
      <span style={{ fontSize:12, color:th.text, fontWeight:600 }}>{t.iconBgToggle}</span>
      <div onClick={()=>updateCS({showIconBg:!cs.showIconBg})} style={{ cursor:"pointer" }}>
        <SVGIcons.Toggle on={cs.showIconBg!==false}/>
      </div>
    </div>
    {(() => {
      // ✅ ترتيب الأزرار يتغير حسب اللغة (العربي يبدأ باليمين، الإنجليزي يبدأ باليسار)
      const posOptions = lang === "ar"
        ? [ { id:"right", label:"يمين" }, { id:"center", label:"وسط" }, { id:"left", label:"يسار" } ]
        : [ { id:"left", label:"Left" }, { id:"center", label:"Center" }, { id:"right", label:"Right" } ];

      // تحديد رقم مكان الزر المفعل حالياً
      const activePos = cfg.iconAlign || "right";
      const activeIndex = posOptions.findIndex(o => o.id === activePos);
      const bubblePos = activeIndex === 0 ? "4px" : activeIndex === 1 ? "calc(33.333% + 1.3px)" : "calc(66.666% - 1px)";

      return (
        <div>
          <p style={{ color:th.textMuted, fontSize:12, margin:"0 0 8px" }}>
            {lang==="ar" ? "موضع الأيقونة" : "Icon Position"}
          </p>
          <div style={{ display:"flex", position:"relative", background:"rgba(0,0,0,0.2)", borderRadius:12, padding:4 }}>
            {/* الفقاعة العائمة لموضع الأيقونة (تمت برمجتها بذكاء) */}
            <div style={{
              position:"absolute", top:4, bottom:4, width:"calc(33.333% - 2.6px)",
              background:th.accentGlow, borderRadius:8, border:`1px solid ${th.accent}`,
              // توجيه الفقاعة يعتمد على اللغة
              ...(isRtl ? { right: bubblePos } : { left: bubblePos }),
              transition:"all 0.35s cubic-bezier(0.25, 1, 0.5, 1)", pointerEvents:"none", zIndex:1
            }}/>

            {posOptions.map(opt => {
              const active = activePos === opt.id;
              return (
                <button key={opt.id} onClick={()=>{ triggerHaptic("light"); setCfg(c=>({...c, iconAlign: opt.id})); }}
                style={{ flex:1, padding:"8px 0", border:"none", background:"transparent",
                  color:active?th.accent:th.textMuted, fontSize:12, fontWeight:700, cursor:"pointer",
                  transition:"color 0.3s ease", zIndex:2 }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
          {cfg.iconAlign==="center" && (
            <p style={{ fontSize:11, color:th.textMuted, marginTop:6 }}>
              {lang==="ar" ? "عند اختيار الوسط سيتم إخفاء النص تلقائياً" : "Selecting center auto-hides the label"}
            </p>
          )}
        </div>
      );
    })()}
</div>
  </div>

  {/* ── تاب الخلفية ── */}
  <div style={{
    display:"flex", flexDirection:"column", gap:12,
    opacity: activeTab==="bg" ? 1 : 0,
    pointerEvents: activeTab==="bg" ? "auto" : "none",
    transform: activeTab==="bg" ? "translateY(0px)" : "translateY(10px)",
    transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)",
    position: activeTab==="bg" ? "relative" : "absolute",
    top:0, left:0, right:0,
  }}>
    {/* ✅ التعديل: إضافة مستطيل زجاجي عائم لتجميع الأدوات (التحديد الأخضر/الأصفر) */}
    <div style={{ display:"flex", flexDirection:"column", gap:16, background: "rgba(31, 20, 14, 0.25)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderRadius:24, border:`1px solid ${th.borderHover}`, padding: "20px 18px", boxShadow: `0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 14px ${th.accentGlow}`, marginTop: 10 }}>

    {/* اختيار النوع */}
    <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:5 }}>
      {BG_TYPES.map(bt => (
        <button key={bt.id} className="tap-btn" onClick={()=>{ triggerHaptic("light"); updateCS({bgType:bt.id}); }}
          style={{ padding:"8px 4px", borderRadius:10, border:`1px solid ${cs.bgType===bt.id?th.accent:th.border}`,
            background:cs.bgType===bt.id?th.accentGlow:"transparent", color:cs.bgType===bt.id?th.accent:th.textMuted,
            fontSize:10.5, fontWeight:700, cursor:"pointer", transition:"all 0.2s" }}>
          {bt.label}
        </button>
      ))}
    </div>
    {/* ── الحاوية المتحركة لخيارات الخلفية (انيميشن سلس) ── */}
      <div style={{ display: "flex", flexDirection: "column" }}>

        {/* خيارات الألوان (صلب، تدرج، زجاج 3D) */}
        <div style={{
          overflow: "hidden",
          transition: "all 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
          maxHeight: (cs.bgType==="solid"||cs.bgType==="gradient"||cs.bgType==="glass") ? "350px" : "0px",
          opacity: (cs.bgType==="solid"||cs.bgType==="gradient"||cs.bgType==="glass") ? 1 : 0,
          marginTop: (cs.bgType==="solid"||cs.bgType==="gradient"||cs.bgType==="glass") ? 16 : 0,
        }}>
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
            {/* الألوان الرئيسية والشفافية */}
            <div style={{ display:"flex", gap:14, alignItems:"center", flexWrap:"wrap" }}>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                <label style={{ fontSize:11, color:th.textMuted }}>{t.capBgColor1}</label>
                <ColorPicker value={cs.bgColor1||"#ffffff"} onChange={v=>updateCS({bgColor1:v})} th={th} triggerHaptic={triggerHaptic} setPickerOpen={setColorPickerOpen} />
              </div>

              {/* اللون الثاني (يظهر بانيميشن أيضاً داخل التدرج والزجاج) */}
              <div style={{
                display:"flex", flexDirection:"column", gap:4, overflow:"hidden",
                transition:"all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                maxWidth: (cs.bgType==="gradient"||cs.bgType==="glass") ? "100px" : "0px",
                opacity: (cs.bgType==="gradient"||cs.bgType==="glass") ? 1 : 0,
              }}>
                <label style={{ fontSize:11, color:th.textMuted, whiteSpace:"nowrap" }}>{t.capBgColor2}</label>
                <ColorPicker value={cs.bgColor2||"#888888"} onChange={v=>updateCS({bgColor2:v})} th={th} triggerHaptic={triggerHaptic} setPickerOpen={setColorPickerOpen} />
              </div>

              <div style={{ flex:1, minWidth:120 }}>
                <label style={{ fontSize:11, color:th.textMuted, display:"block", marginBottom:4 }}>{t.capBgOpacity}</label>
                <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                  <input type="range" min="0" max="1" step="0.01" value={cs.bgOpacity??0.18}
                    onChange={e=>updateCS({bgOpacity:parseFloat(e.target.value)})} style={{ flex:1, accentColor:th.accent }}/>
                  <span style={{ fontSize:10, color:th.textMuted, minWidth:32 }}>{Math.round((cs.bgOpacity??0.18)*100)}%</span>
                </div>
              </div>
            </div>

            {/* سلايدر ضبابية الزجاج (يظهر بانيميشن فقط في وضع الزجاج) */}
            <div style={{
              display:"flex", alignItems:"center", gap:8, overflow:"hidden",
              transition:"all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              maxHeight: cs.bgType==="glass" ? "50px" : "0px",
              opacity: cs.bgType==="glass" ? 1 : 0,
              marginTop: cs.bgType==="glass" ? -4 : 0,
            }}>
              <label style={{ fontSize:11, color:th.textMuted, minWidth:80 }}>{t.glassBlur}</label>
              <input type="range" min="0" max="1" step="0.01" value={cs.bgGlassBlur ?? 0.5}
                onChange={e=>updateCS({bgGlassBlur:parseFloat(e.target.value)})}
                style={{ flex:1, accentColor:th.accent }}/>
              <span style={{ fontSize:10, color:th.textMuted, minWidth:32 }}>{Math.round((cs.bgGlassBlur ?? 0.5)*100)}%</span>
            </div>

            {/* اتجاه التدرج (يظهر بانيميشن فقط في التدرج) */}
            <div style={{
              overflow:"hidden",
              transition:"all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
              maxHeight: cs.bgType==="gradient" ? "80px" : "0px",
              opacity: cs.bgType==="gradient" ? 1 : 0,
            }}>
              <label style={{ fontSize:11, color:th.textMuted, marginBottom:6, display:"block" }}>{t.gradDir}</label>
              <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>
                {GRAD_DIRS.map(dir => (
                  <button key={dir} onClick={()=>{ triggerHaptic("light"); updateCS({bgGradientDir:dir}); }}
                    style={{ padding:"5px 10px", borderRadius:8, border:`1px solid ${cs.bgGradientDir===dir?th.accent:th.border}`,
                      background:cs.bgGradientDir===dir?th.accentGlow:"transparent",
                      color:cs.bgGradientDir===dir?th.accent:th.textMuted, fontSize:10, cursor:"pointer", transition:"all 0.2s" }}>
                    {dir}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

        {/* خيارات Liquid Glass */}
        <div style={{
          display:"flex", flexDirection:"column", gap:8, overflow:"hidden",
          transition:"all 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
          maxHeight: cs.bgType==="liquid" ? "150px" : "0px",
          opacity: cs.bgType==="liquid" ? 1 : 0,
          marginTop: cs.bgType==="liquid" ? 16 : 0,
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <label style={{ fontSize:11, color:th.textMuted, minWidth:80 }}>
              {lang==="ar" ? "الضبابية" : "Blur Amount"}
            </label>
            <input type="range" min="0" max="1" step="0.01"
              value={cs.bgGlassBlur ?? 0.5}
              onChange={e=>updateCS({bgGlassBlur:parseFloat(e.target.value)})}
              style={{ flex:1, accentColor:th.accent }}/>
            <span style={{ fontSize:10, color:th.textMuted, minWidth:32 }}>
              {Math.round((cs.bgGlassBlur ?? 0.5)*100)}%
            </span>
          </div>
          <div style={{
            background:"rgba(97, 2, 2, 0.2)", borderRadius:10, border:`1px solid rgba(255,50,50,0.15)`,
            padding:"8px 12px", fontSize:11, color:th.textMuted, textAlign:"center"
          }}>
            {lang==="ar"
              ? " ❗يعرض تأثير الزجاج السائل مع تشويه الحواف وضبابية قابلة للتخصيص لذا يجب استخدام خلفية عامة للمشروع ليعمل التأثير"
              : "❗ The liquid glass effect with edge distortion and customizable blur, And you should used a general image for the project for the effect to work"}
          </div>
        </div>

        {/* خيار الصورة المخصصة */}
        <div style={{
          display:"flex", flexDirection:"column", gap:8, overflow:"hidden",
          transition:"all 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
          maxHeight: cs.bgType==="image" ? "200px" : "0px",
          opacity: cs.bgType==="image" ? 1 : 0,
          marginTop: cs.bgType==="image" ? 16 : 0,
        }}>
          <button onClick={()=>{ triggerHaptic("light"); capImgRef.current?.click(); }}
            style={{ padding:"11px 0", borderRadius:12, border:`1px dashed ${th.accent}`, background:`${th.accent}12`,
              color:th.accent, fontSize:13, fontWeight:700, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all 0.2s" }}>
            <SVGIcons.Upload/> {t.uploadCapImg}
          </button>
          {cs.bgImage && (
            <>
              <button
                onClick={() => {
                  triggerHaptic("medium");
                  const next = !imgEditing;
                  if (next) {
                    imgOffsetRef.current = { x: (cs.bgImageOffsetX ?? 0) * zoomRatioX, y: (cs.bgImageOffsetY ?? 0) * zoomRatioY };
                    imgScaleRef.current = cs.bgImageScale ?? 1;
                  }
                  setImgEditing(next);
                  setPreviewZoomed(next);
                }}
                style={{ padding:"10px 0", borderRadius:12,
                  border:`1px solid ${imgEditing ? th.accent : th.border}`,
                  background: imgEditing ? th.accentGlow : "transparent",
                  color: imgEditing ? th.accent : th.textMuted,
                  fontSize:12, fontWeight:700, cursor:"pointer",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6, transition:"all 0.3s" }}>
                <SVGIcons.Crop/>
                {imgEditing
                  ? (isRtl ? "✓ اضغط حفظ لتأكيد الموضع" : "✓ Press Save to confirm")
                  : (isRtl ? "تحريك وتكبير الصورة 👆" : "Move & Zoom Image 👆")}
              </button>
              {imgEditing && (
                <div style={{ background:`${th.accent}15`, border:`1px solid ${th.accent}30`,
                  borderRadius:10, padding:"8px 12px", fontSize:11,
                  color:th.accent, textAlign:"center", direction:isRtl?"rtl":"ltr", animation:"fdIn 0.3s ease" }}>
                  {isRtl ? "اذهب للمعاينة أعلاه — اسحب بإصبع لتحريك، وإصبعين للتكبير" : "Go to preview above — drag to move, pinch to zoom"}
                </div>
              )}
              <div style={{ display:"flex", alignItems:"center", gap:8,
                background:"rgba(255,255,255,0.03)", borderRadius:10,
                padding:"8px 10px", border:`1px solid ${th.border}` }}>
                <img src={cs.bgImage} style={{ width:40, height:40, borderRadius:8, objectFit:"cover" }} alt=""/>
                <span style={{ flex:1, fontSize:11, color:th.textMuted }}>✓ تم الرفع</span>
                <button onClick={()=>{ triggerHaptic("heavy"); updateCS({bgImage:null, bgImageOffsetX:0, bgImageOffsetY:0, bgImageScale:1}); setImgEditing(false); }}
                  style={{ background:"transparent", border:"none", color:th.danger, cursor:"pointer", display:"flex", transition:"transform 0.2s" }} onTouchStart={e=>e.currentTarget.style.transform="scale(0.85)"} onTouchEnd={e=>e.currentTarget.style.transform="scale(1)"}>
                  <SVGIcons.Trash />
                </button>
              </div>
            </>
          )}
          <input ref={capImgRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleCapImgChange}/>
        </div>

      </div>
  </div>

  {/* ── تاب الألوان ── */}
  <div style={{
    display:"flex", flexDirection:"column", gap:12,
    opacity: activeTab==="color" ? 1 : 0,
    pointerEvents: activeTab==="color" ? "auto" : "none",
    transform: activeTab==="color" ? "translateY(0px)" : "translateY(10px)",
    transition: "opacity 0.28s ease, transform 0.28s cubic-bezier(0.16,1,0.3,1)",
    position: activeTab==="color" ? "relative" : "absolute",
    top:0, left:0, right:0,
  }}>
    {/* ✅ التعديل: إضافة مستطيل زجاجي عائم لتجميع الأدوات (التحديد الأخضر/الأصفر) */}
    <div style={{ display:"flex", flexDirection:"column", gap:16, background: "rgba(31, 20, 14, 0.25)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)", borderRadius:24, border:`1px solid ${th.borderHover}`, padding: "20px 18px", boxShadow: `0 8px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06), 0 0 14px ${th.accentGlow}`, marginTop: 10 }}>

    <ColorSection
      label={t.iconColor}
      colorType={cs.iconColorType||"solid"} setColorType={v=>updateCS({iconColorType:v})}
      color1={cs.iconColor||"#ffffff"} setColor1={v=>updateCS({iconColor:v})}
      color2={cs.iconColor2||"#f0a060"} setColor2={v=>updateCS({iconColor2:v})}
      opacity={cs.iconOpacity??1} setOpacity={v=>updateCS({iconOpacity:v})}
      t={t} th={th} triggerHaptic={triggerHaptic} setPickerOpen={setColorPickerOpen} // ✅ مررنا الدالة هنا
      isRtl={isRtl}
    />
    <ColorSection
      label={t.textColor}
      colorType={cs.textColorType||"solid"} setColorType={v=>updateCS({textColorType:v})}
      color1={cs.textColor||"#ffffff"} setColor1={v=>updateCS({textColor:v})}
      color2={cs.textColor2||"#f0a060"} setColor2={v=>updateCS({textColor2:v})}
      opacity={cs.textOpacity??1} setOpacity={v=>updateCS({textOpacity:v})}
      t={t} th={th} triggerHaptic={triggerHaptic} setPickerOpen={setColorPickerOpen} // ✅ وهنا
      isRtl={isRtl}
    />
    <ColorSection
      label={lang==="ar" ? "لون خلفية الأيقونة" : "Icon Background"}
      colorType={cs.iconBgColorType||"solid"} setColorType={v=>updateCS({iconBgColorType:v})}
      color1={cs.iconBgColor||"#ffffff"} setColor1={v=>updateCS({iconBgColor:v})}
      color2={cs.iconBgColor2||"#f0a060"} setColor2={v=>updateCS({iconBgColor2:v})}
      opacity={cs.iconBgOpacity??0.18} setOpacity={v=>updateCS({iconBgOpacity:v})}
      t={t} th={th} triggerHaptic={triggerHaptic} setPickerOpen={setColorPickerOpen} // ✅ وهنا
      isRtl={isRtl}
    />
    {/* ✅ وتأكد من تمريرها لخلفية الكبسولة أيضاً إذا كانت موجودة في تاب "الخلفية" */}
  </div>
 </div>
</div>

        {/* أزرار الحفظ */}
        <div style={{ display:"flex", gap:10, padding:"0 18px 20px", flexShrink:0, borderTop:`1px solid ${th.border}`, paddingTop:14 }}>
          <button onClick={()=>{ setPreviewZoomed(false); setImgEditing(false); onSave(cfg); }}
            style={{ flex:2, padding:13, background:th.accent, color:"white", border:"none", borderRadius:14,
              fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", justifyContent:"center", alignItems:"center", gap:6,
              boxShadow:`0 4px 16px ${th.accentGlow}` }}>
            <SVGIcons.Check/> {t.saveBtn}
          </button>
          <button onClick={onClose}
            style={{ flex:1, padding:13, background:"transparent", color:th.text, border:`1px solid ${th.border}`, borderRadius:14, fontSize:14, cursor:"pointer" }}>
            {t.cancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── ImageCropper ─────────────────────────────
function ImageCropper({ imgData, targetRatio, onCrop, onCancel, t, th, lang }) {
  const scaleRef        = useRef(1);
  const committedPosRef = useRef({ x:0, y:0 });
  const dragRef         = useRef(null);
  const pinchRef        = useRef(null);
  const rafRef          = useRef(null);
  const imgRef          = useRef(null);
  const containerRef    = useRef(null);
  const areaRef         = useRef(null);
  const [scaleDisplay, setScaleDisplay] = useState(1);
  const isRtl = lang === "ar";

  const applyTransform = useCallback(() => {
    if (!imgRef.current) return;
    const px = dragRef.current ? dragRef.current.currentX : committedPosRef.current.x;
    const py = dragRef.current ? dragRef.current.currentY : committedPosRef.current.y;
    imgRef.current.style.transform = `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${scaleRef.current})`;
  }, []);

  const scheduleRaf = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => { applyTransform(); rafRef.current=null; });
    }
  }, [applyTransform]);

  const handleTouchStart = (e) => {
    if (e.touches.length===1) {
      dragRef.current = { startClientX:e.touches[0].clientX, startClientY:e.touches[0].clientY, startPosX:committedPosRef.current.x, startPosY:committedPosRef.current.y, currentX:committedPosRef.current.x, currentY:committedPosRef.current.y };
      pinchRef.current = null;
    } else if (e.touches.length===2) {
      dragRef.current = null;
      const dx=e.touches[1].clientX-e.touches[0].clientX, dy=e.touches[1].clientY-e.touches[0].clientY;
      pinchRef.current = { startDist:Math.hypot(dx,dy), startScale:scaleRef.current };
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length===2 && pinchRef.current) {
      const dx=e.touches[1].clientX-e.touches[0].clientX, dy=e.touches[1].clientY-e.touches[0].clientY;
      const dist=Math.hypot(dx,dy);
      const newScale=Math.min(8,Math.max(0.5,pinchRef.current.startScale*(dist/pinchRef.current.startDist)));
      scaleRef.current=newScale; setScaleDisplay(newScale); scheduleRaf(); return;
    }
    if (!dragRef.current||e.touches.length>1) return;
    dragRef.current.currentX=dragRef.current.startPosX+(e.touches[0].clientX-dragRef.current.startClientX);
    dragRef.current.currentY=dragRef.current.startPosY+(e.touches[0].clientY-dragRef.current.startClientY);
    scheduleRaf();
  };

  const handleTouchEnd = () => {
    if (dragRef.current) { committedPosRef.current={x:dragRef.current.currentX,y:dragRef.current.currentY}; dragRef.current=null; }
    pinchRef.current=null;
  };

  const handleScaleChange = (e) => {
    scaleRef.current=parseFloat(e.target.value); setScaleDisplay(scaleRef.current); scheduleRaf();
  };

  const applyCrop = useCallback(() => {
    if (!containerRef.current||!imgRef.current) return;
    const cropRect=containerRef.current.getBoundingClientRect(), imgRect=imgRef.current.getBoundingClientRect();
    const pr=Math.min(window.devicePixelRatio||2,3);
    const canvas=document.createElement("canvas");
    canvas.width=Math.round(cropRect.width*pr); canvas.height=Math.round(cropRect.height*pr);
    const ctx=canvas.getContext("2d"); ctx.scale(pr,pr);
    const tempImg=new Image();
    tempImg.onload=()=>{
      ctx.fillStyle="#0a0a0a"; ctx.fillRect(0,0,cropRect.width,cropRect.height);
      const offsetX=imgRect.left-cropRect.left, offsetY=imgRect.top-cropRect.top;
      const ratio=tempImg.naturalWidth/imgRect.width;
      const sx=Math.max(0,-offsetX*ratio), sy=Math.max(0,-offsetY*ratio);
      const sw=Math.min(cropRect.width*ratio,tempImg.naturalWidth-sx), sh=Math.min(cropRect.height*ratio,tempImg.naturalHeight-sy);
      const dx=offsetX>0?offsetX:0, dy=offsetY>0?offsetY:0, dw=sw/ratio, dh=sh/ratio;
      if (sw>0&&sh>0) ctx.drawImage(tempImg,sx,sy,sw,sh,dx,dy,dw,dh);
      onCrop(canvas.toDataURL("image/jpeg",0.93));
    };
    tempImg.src=imgData;
  }, [imgData, onCrop]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", flexDirection:"column", background:"linear-gradient(180deg,#0f1115 0%,#161a22 100%)" }}>
      <div style={{ padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexDirection:isRtl?"row-reverse":"row", background:"rgba(20,22,28,0.78)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <button onClick={onCancel} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"#fff", fontSize:13, fontWeight:600, padding:"10px 18px", borderRadius:999, cursor:"pointer" }}>{t.cancelBtn}</button>
        <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:"#fff" }}>{t.cropTitle}</h3>
        <button onClick={applyCrop} style={{ background:th.accent, border:"none", color:"#000", fontSize:15, fontWeight:700, padding:"10px 50px", borderRadius:999, cursor:"pointer", boxShadow:`0 6px 20px ${th.accentGlow}` }}>{t.cropApply}</button>
      </div>
      <div ref={areaRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ flex:1, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", touchAction:"none" }}>
        <img ref={imgRef} src={imgData} alt="" draggable={false} style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%,-50%) scale(1)", maxWidth:"100%", maxHeight:"100%", width:"auto", height:"auto", transformOrigin:"center center", willChange:"transform", userSelect:"none", WebkitUserSelect:"none", pointerEvents:"none" }}/>
        <div ref={containerRef} style={{ position:"relative", width:"100%", maxWidth:"400px", maxHeight:"70vh", aspectRatio:String(targetRatio), pointerEvents:"none", zIndex:2, borderRadius:18, overflow:"hidden", boxShadow:"0 0 0 9999px rgba(0,0,0,0.72)" }}>
          <div style={{ position:"absolute", inset:0, border:"1px solid rgba(255,255,255,0.12)", borderRadius:18 }}/>
          <div style={{ position:"absolute", top:0, left:0, width:38, height:38, borderTop:`3px solid ${th.accent}`, borderLeft:`3px solid ${th.accent}`, borderRadius:"18px 0 0 0", filter:`drop-shadow(0 0 8px ${th.accent})` }}/>
          <div style={{ position:"absolute", top:0, right:0, width:38, height:38, borderTop:`3px solid ${th.accent}`, borderRight:`3px solid ${th.accent}`, borderRadius:"0 18px 0 0", filter:`drop-shadow(0 0 8px ${th.accent})` }}/>
          <div style={{ position:"absolute", bottom:0, left:0, width:38, height:38, borderBottom:`3px solid ${th.accent}`, borderLeft:`3px solid ${th.accent}`, borderRadius:"0 0 0 18px", filter:`drop-shadow(0 0 8px ${th.accent})` }}/>
          <div style={{ position:"absolute", bottom:0, right:0, width:38, height:38, borderBottom:`3px solid ${th.accent}`, borderRight:`3px solid ${th.accent}`, borderRadius:"0 0 18px 0", filter:`drop-shadow(0 0 8px ${th.accent})` }}/>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"space-evenly" }}>
            <div style={{ height:1, background:"rgba(255,255,255,0.15)" }}/><div style={{ height:1, background:"rgba(255,255,255,0.15)" }}/>
          </div>
          <div style={{ position:"absolute", inset:0, display:"flex", justifyContent:"space-evenly" }}>
            <div style={{ width:1, background:"rgba(255,255,255,0.15)" }}/><div style={{ width:1, background:"rgba(255,255,255,0.15)" }}/>
          </div>
        </div>
      </div>
      <div style={{ padding:"18px 24px 30px", background:"rgba(20,22,28,0.82)", backdropFilter:"blur(30px)", WebkitBackdropFilter:"blur(30px)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", gap:14, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, flexDirection:isRtl?"row-reverse":"row" }}>
          <span style={{ background:"rgba(255,255,255,0.08)", color:"#fff", padding:"6px 10px", borderRadius:999, fontSize:12, fontWeight:700, minWidth:58, textAlign:"center" }}>{Math.round(scaleDisplay*100)}%</span>
          <span style={{ color:"rgba(255,255,255,0.5)", fontSize:18, fontWeight:700 }}>−</span>
          <input type="range" min="0.5" max="8" step="0.01" defaultValue="1" onChange={handleScaleChange} style={{ flex:1, accentColor:th.accent, cursor:"pointer" }}/>
          <span style={{ color:"rgba(255,255,255,0.8)", fontSize:18, fontWeight:700 }}>+</span>
        </div>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:"10px 14px" }}>
          <p style={{ margin:0, textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.72)", direction:isRtl?"rtl":"ltr" }}>
            {isRtl?"اسحب الصورة بإصبع واحد واستخدم إصبعين للتكبير أو التصغير":"Drag with one finger and use two fingers to zoom"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── ConfigModal (تعديل الأيقونة بدون بانيل الكبسولة المتقدم) ── (غير مستخدم الآن)
// الآن يُستخدم CapsuleEditPanel مباشرة

// ── ProjectMenu ──────────────────────────────
function ProjectMenu({ proj, onEdit, onDelete, onClose, t, th, lang, triggerHaptic}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);
  const isRtl = lang==="ar";
  return (
    <div onClick={e=>e.target===e.currentTarget&&onClose()}
      style={{ position:"fixed", inset:0, background:mounted?"rgba(0,0,0,0.65)":"rgba(0,0,0,0)", backdropFilter:mounted?"blur(10px)":"blur(0px)", display:"flex", justifyContent:"center", alignItems:"flex-end", zIndex:9500, paddingBottom:"env(safe-area-inset-bottom,0px)", transition:"background 0.3s, backdrop-filter 0.3s" }}>
      <div style={{ background:th.modalBg, backdropFilter:"blur(28px) saturate(1.4)", WebkitBackdropFilter:"blur(28px) saturate(1.4)", width:"100%", maxWidth:480, borderRadius:"28px 28px 0 0", padding:"20px 18px 28px", border:`1px solid ${th.borderHover}`, borderBottom:"none", boxShadow:`0 -24px 60px rgba(0,0,0,0.6), 0 -4px 30px ${th.modalGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`, transform:mounted?"translateY(0)":"translateY(100%)", transition:"transform 0.38s cubic-bezier(0.16,1,0.3,1)", direction:isRtl?"rtl":"ltr" }}>
        <div style={{ width:44, height:5, background:`linear-gradient(90deg,transparent,${th.accent}80,transparent)`, borderRadius:3, margin:"0 auto 16px" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, padding:"0 4px", flexDirection:isRtl?"row-reverse":"row" }}>
          <div style={{ width:52, height:72, borderRadius:10, overflow:"hidden", flexShrink:0, border:`1px solid ${th.border}`, boxShadow:"0 4px 12px rgba(0,0,0,0.3)", background:"#111" }}>
            {proj.bg && <img src={proj.bg} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt=""/>}
          </div>
          <span style={{ fontSize:15, fontWeight:700, color:th.text }}>{proj.name}</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={onEdit}
            style={{ width:"100%", padding:14, background:th.accent, color:"white", border:"none", borderRadius:14, fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", justifyContent:"center", alignItems:"center", gap:8, boxShadow:`0 4px 16px ${th.accentGlow}` }}
            onTouchStart={e=>{e.currentTarget.style.transform="scale(0.97)"}} onTouchEnd={e=>{e.currentTarget.style.transform="scale(1)"}}>
            <SVGIcons.Edit/> {t.projMenuEdit}
          </button>
          <button onClick={onDelete}
            style={{ width:"100%", padding:14, background:"rgba(231,76,60,0.12)", color:"#e74c3c", border:"1px solid rgba(231,76,60,0.25)", borderRadius:14, fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", justifyContent:"center", alignItems:"center", gap:8 }}
            onTouchStart={e=>{e.currentTarget.style.transform="scale(0.97)"}} onTouchEnd={e=>{e.currentTarget.style.transform="scale(1)", triggerHaptic("heavy");}}>
            <SVGIcons.Delete/> {t.projMenuDelete}
          </button>
          <button onClick={onClose}
            style={{ width:"100%", padding:14, background:"transparent", color:th.textMuted, border:`1px solid ${th.border}`, borderRadius:14, fontSize:14, cursor:"pointer", textAlign:"center" }}>
            {t.projMenuCancel}
          </button>
        </div>
      </div>
    </div>
  );
}

function ColorPicker({ value, onChange, th, setOpenState, triggerHaptic }) {
  const [open, setOpen] = useState(false);
  const [hue, setHue] = useState(0);
  const [sat, setSat] = useState(100);
  const [lit, setLit] = useState(50);
  const [hexInput, setHexInput] = useState(value || "#ffffff");
  const [savedColors, setSavedColors] = useState(() => {
    try { return JSON.parse(localStorage.getItem("qp_saved_colors") || "[]"); } catch { return []; }
  });

  const isValidHex = (h) => /^#[0-9a-fA-F]{6}$/.test(h);

  // ✅ عندما تتغير حالة 'open'، أبلغ الكومبوننت الأب
  useEffect(() => {
    if(setOpenState) setOpenState(open);
  }, [open, setOpenState]);

  // تحويل HSL لـ hex عند التغيير
  useEffect(() => {
    const h=hue, s=sat/100, l=lit/100;
    const a=s*Math.min(l,1-l);
    const f=n=>{ const k=(n+h/30)%12; const c=l-a*Math.max(Math.min(k-3,9-k,1),-1); return Math.round(255*c).toString(16).padStart(2,"0"); };
    const hex = `#${f(0)}${f(8)}${f(4)}`;
    onChange(hex);
    setHexInput(hex);
  }, [hue, sat, lit]);

  // تحميل قيمة hex الحالية للـ HSL
  useEffect(() => {
    if(!value) return;
    setHexInput(value);
    const r=parseInt(value.slice(1,3),16)/255, g=parseInt(value.slice(3,5),16)/255, b=parseInt(value.slice(5,7),16)/255;
    const max=Math.max(r,g,b), min=Math.min(r,g,b);
    const l=(max+min)/2;
    let h=0, s=0;
    if(max!==min){
      const d=max-min;
      s=l>0.5?d/(2-max-min):d/(max+min);
      switch(max){ case r:h=(g-b)/d+(g<b?6:0);break; case g:h=(b-r)/d+2;break; case b:h=(r-g)/d+4;break; }
      h=Math.round(h*60);
    }
    setHue(h<0?h+360:h);
    setSat(Math.round(s*100));
    setLit(Math.round(l*100));
  }, []);

  const saveCurrentColor = () => {
    if (!isValidHex(value)) return;
    setSavedColors(prev => {
      const filtered = prev.filter(c => c !== value);
      const next = [value, ...filtered].slice(0, 16); // احفظ آخر 16 لون
      localStorage.setItem("qp_saved_colors", JSON.stringify(next));
      return next;
    });
  };

  const handleHexInput = (e) => {
    let val = e.target.value;
    if (!val.startsWith("#")) val = "#" + val;
    setHexInput(val);
    if (isValidHex(val)) {
      onChange(val);
      // حدّث sliders
      const r=parseInt(val.slice(1,3),16)/255, g=parseInt(val.slice(3,5),16)/255, b=parseInt(val.slice(5,7),16)/255;
      const max=Math.max(r,g,b), min=Math.min(r,g,b);
      const lv=(max+min)/2;
      let hv=0, sv=0;
      if(max!==min){ const d=max-min; sv=lv>0.5?d/(2-max-min):d/(max+min); switch(max){ case r:hv=(g-b)/d+(g<b?6:0);break; case g:hv=(b-r)/d+2;break; case b:hv=(r-g)/d+4;break; } hv=Math.round(hv*60); }
      setHue(hv<0?hv+360:hv); setSat(Math.round(sv*100)); setLit(Math.round(lv*100));
    }
  };

  const copyHex = () => {
    navigator.clipboard?.writeText(value || "").catch(()=>{});
  };

  const PRESETS = ["#ffffff","#000000","#ff4444","#ff8800","#ffdd00","#44dd44","#44aaff","#aa44ff","#ff44aa","#d97736"];

  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <div onClick={()=>{ if(triggerHaptic) triggerHaptic("light"); setOpen(o=>!o); }}
        style={{ width:44, height:32, borderRadius:8, background:value||"#fff", border:`2px solid ${open?"#d97736":"rgba(255,255,255,0.2)"}`, cursor:"pointer", boxShadow:`0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)`, transition:"border-color 0.2s ease" }}/>

      {open && createPortal(
        <div id="qp-color-picker-overlay" style={{ position:"fixed", inset:0, zIndex:99999, display:"flex", alignItems:"flex-end", justifyContent:"center", background:"rgba(0,0,0,0.6)", backdropFilter:"blur(8px)" }}
          onClick={()=>{ if(triggerHaptic) triggerHaptic("light"); setOpen(false); }}>
          <div onClick={e=>e.stopPropagation()}
            style={{ background:"rgba(18,16,14,0.97)", backdropFilter:"blur(28px)", borderRadius:"24px 24px 0 0", padding:"20px 20px 32px", width:"100%", maxWidth:380, border:"1px solid rgba(255,255,255,0.1)", boxShadow:"0 -20px 50px rgba(0,0,0,0.6)", animation:"slideUp 0.3s cubic-bezier(0.16,1,0.3,1)" }}>

            <div style={{ width:40,height:4,background:"rgba(255,255,255,0.2)",borderRadius:2,margin:"0 auto 16px" }}/>

            {/* معاينة + خانة HEX */}
            <div style={{ display:"flex", gap:10, alignItems:"center", marginBottom:16 }}>
              <div style={{ flex:1, height:48, borderRadius:14, background:value, border:"1px solid rgba(255,255,255,0.12)", boxShadow:`0 4px 20px ${value}66` }}/>
              <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                {/* خانة إدخال HEX */}
                <div style={{ display:"flex", alignItems:"center", background:"rgba(255,255,255,0.07)", borderRadius:10, overflow:"hidden", border:"1px solid rgba(255,255,255,0.12)" }}>
                  <input
                    value={hexInput}
                    onChange={handleHexInput}
                    maxLength={7}
                    style={{ width:90, padding:"6px 8px", background:"transparent", border:"none", color:"#fff", fontSize:13, fontWeight:700, outline:"none", fontFamily:"monospace" }}
                  />
                  <button onClick={copyHex}
                    style={{ padding:"6px 8px", background:"transparent", border:"none", color:"rgba(255,255,255,0.6)", cursor:"pointer", fontSize:11 }}>
                    نسخ
                  </button>
                </div>
                {/* زر حفظ اللون */}
                <button onClick={saveCurrentColor}
                  style={{ padding:"5px 10px", borderRadius:8, background:"rgba(217,119,54,0.2)", border:"1px solid rgba(217,119,54,0.4)", color:"#d97736", fontSize:11, fontWeight:700, cursor:"pointer" }}>
                  + حفظ اللون
                </button>
              </div>
            </div>

            {/* Hue */}
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                <span style={{ fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600 }}>HUE</span>
                <span style={{ fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:700 }}>{hue}°</span>
              </div>
              <div style={{ position:"relative", height:18, borderRadius:9, background:"linear-gradient(to right,#ff0000,#ffff00,#00ff00,#00ffff,#0000ff,#ff00ff,#ff0000)", boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>
                <input type="range" min="0" max="360" value={hue} onChange={e=>setHue(Number(e.target.value))}
                  style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer",margin:0 }}/>
                <div style={{ position:"absolute", top:"50%", left:`${(hue/360)*100}%`, transform:"translate(-50%,-50%)", width:20,height:20,borderRadius:"50%",background:value,border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,0.5)",pointerEvents:"none" }}/>
              </div>
            </div>

            {/* Saturation */}
            <div style={{ marginBottom:12 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                <span style={{ fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600 }}>SATURATION</span>
                <span style={{ fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:700 }}>{sat}%</span>
              </div>
              <div style={{ position:"relative",height:18,borderRadius:9,background:`linear-gradient(to right,hsl(${hue},0%,${lit}%),hsl(${hue},100%,${lit}%))`,boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>
                <input type="range" min="0" max="100" value={sat} onChange={e=>setSat(Number(e.target.value))}
                  style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer",margin:0 }}/>
                <div style={{ position:"absolute",top:"50%",left:`${sat}%`,transform:"translate(-50%,-50%)",width:20,height:20,borderRadius:"50%",background:value,border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,0.5)",pointerEvents:"none" }}/>
              </div>
            </div>

            {/* Lightness */}
            <div style={{ marginBottom:16 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6 }}>
                <span style={{ fontSize:11,color:"rgba(255,255,255,0.5)",fontWeight:600 }}>LIGHTNESS</span>
                <span style={{ fontSize:11,color:"rgba(255,255,255,0.7)",fontWeight:700 }}>{lit}%</span>
              </div>
              <div style={{ position:"relative",height:18,borderRadius:9,background:`linear-gradient(to right,#000,hsl(${hue},${sat}%,50%),#fff)`,boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}>
                <input type="range" min="0" max="100" value={lit} onChange={e=>setLit(Number(e.target.value))}
                  style={{ position:"absolute",inset:0,width:"100%",height:"100%",opacity:0,cursor:"pointer",margin:0 }}/>
                <div style={{ position:"absolute",top:"50%",left:`${lit}%`,transform:"translate(-50%,-50%)",width:20,height:20,borderRadius:"50%",background:value,border:"3px solid white",boxShadow:"0 2px 8px rgba(0,0,0,0.5)",pointerEvents:"none" }}/>
              </div>
            </div>

            {/* ألوان جاهزة */}
            <div style={{ marginBottom: savedColors.length > 0 ? 12 : 0 }}>
              <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:"0 0 8px" }}>ألوان افتراضية</p>
              <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                {PRESETS.map(c=>(
                  <div key={c} onClick={()=>onChange(c)}
                    style={{ width:30,height:30,borderRadius:"50%",background:c,border:`2px solid ${value===c?"white":"transparent"}`,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.3)",transition:"transform 0.15s ease" }}/>
                ))}
              </div>
            </div>

            {/* الألوان المحفوظة */}
            {savedColors.length > 0 && (
              <div>
                <p style={{ fontSize:11, color:"rgba(255,255,255,0.4)", margin:"0 0 8px" }}>ألوانك المحفوظة</p>
                <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
                  {savedColors.map((c,i)=>(
                    <div key={i} onClick={()=>onChange(c)}
                      style={{ width:30,height:30,borderRadius:"50%",background:c,border:`2px solid ${value===c?"white":"transparent"}`,cursor:"pointer",boxShadow:"0 2px 8px rgba(0,0,0,0.3)" }}/>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// الكومبوننت الرئيسي
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [activeTab,       setActiveTab]       = useState("home");
  const [lang,            setLang]            = useState("ar");
  const [themeMode,       setThemeMode]       = useState("dark");
  const [bg,              setBg]              = useState(null);
  const [bgImg,           setBgImg]           = useState(null);
  const [projectName,     setProjectName]     = useState("");
  const [layout,          setLayout]          = useState(() => getInitialLayout(TEXTS[lang]));
  const [visualStyle,     setVisualStyle]     = useState("blurred");
  const [editMode,        setEditMode]        = useState(false);
  const [capsuleEditItem, setCapsuleEditItem] = useState(null);
  const [history,         setHistory]         = useState([]);
  const [generating,      setGenerating]      = useState(false);
  const [toast,           setToast]           = useState(null);
  const [projMenuTarget,  setProjMenuTarget]  = useState(null);
  const [pendingCropImg,  setPendingCropImg]  = useState(null);
  const [savedProjects,   setSavedProjects]   = useState([]);
  const [contentVisible,  setContentVisible]  = useState(true);
  const [dragging,        setDragging]        = useState(null);
  const [resizing,        setResizing]        = useState(null);
  const [longPressActive, setLongPressActive] = useState(null);
  const [showProjModal,   setShowProjModal]   = useState(false);
  const [cropForItem,     setCropForItem]     = useState(null); // "global" | null

  const dragRef        = useRef(null);
  const resizeRef      = useRef(null);
  const longPressTimer = useRef(null);
  const longPressStart = useRef(null);
  const gridRef        = useRef(null);
  const fileRef        = useRef(null);
  const tempNameRef    = useRef("");
  const backStateRef   = useRef({});

 useEffect(() => {
    // ✅ أضفنا projectName هنا لكي يتعرف عليه نظام الرجوع
    backStateRef.current = { pendingCropImg, capsuleEditItem, projMenuTarget, showProjModal, bg, editMode, activeTab, projectName };
  });

  const { totalW, totalH } = useMemo(() => calcSize(layout), [layout]);
  const t   = TEXTS[lang];
  const th  = THEMES[themeMode];
  const isRtl   = lang==="ar";
  const inProject = !!projectName && (!!bg || layout.length>0);

  // تحميل المشاريع
  useEffect(() => {
    (async () => {
      try { const v=await localforage.getItem("qp_pro_projects"); if(v) setSavedProjects(v); } catch(e){}
    })();
  }, []);

  // State للتحكم في الاهتزاز مع جلب القيمة المحفوظة تلقائياً
  const [hapticEnabled, setHapticEnabled] = useState(() => {
    return localStorage.getItem("qp_haptic_enabled") !== "false";
  });

  // حفظ التغيير تلقائياً في الذاكرة المحلية
  useEffect(() => {
    localStorage.setItem("qp_haptic_enabled", hapticEnabled);
  }, [hapticEnabled]);

  // ── نظام الاهتزاز المتطور (Haptic Feedback Patterns) ──
  const triggerHaptic = useCallback((pattern = "light") => {
    if (!hapticEnabled || typeof navigator === "undefined" || !navigator.vibrate) return;

    const patterns = {
      // نقرة خفيفة جداً (مثل تغيير زر أو تفعيل خيار) - Tic
      light: [10], 
      
      // نقرة متوسطة (للأزرار الرئيسية مثل حفظ، تراجع) - Click
      medium: [20], 
      
      // نقرة قوية (للإجراءات الحاسمة مثل الحذف) - Heavy Click
      heavy: [40], 
      
      // اهتزاز مزدوج سريع (ممتاز عند التنقل بين التابات أو الإكمال) - Success
      success: [15, 30, 25], 
      
      // نبضة تصاعدية (ممتاز عند مسك الكبسولة للتحريك) - Pick Up
      pickup: [10, 15, 20, 25, 30], 
      
      // اهتزازة طويلة متصلة (تصلح للعمليات الطويلة أو الأخطاء) - Warning
      error: [50, 30, 50]
    };

    // إذا تم تمرير رقم (للتوافق مع الكود السابق) يتم تحويله، وإلا نستخدم النمط المطلوب
    if (typeof pattern === "number") {
      navigator.vibrate([pattern]);
    } else if (patterns[pattern]) {
      navigator.vibrate(patterns[pattern]);
    } else {
      navigator.vibrate(patterns.light); // الوضع الافتراضي
    }
  }, [hapticEnabled]);

  const saveProjectsToStorage = useCallback(async (projects) => {
    try { await localforage.setItem("qp_pro_projects", projects); } catch(e){}
  }, []);

  // حفظ تلقائي
  useEffect(() => {
    if (!projectName) return;
    setSavedProjects(prev => {
      const idx=prev.findIndex(p=>p.name===projectName);
      const proj={ name:projectName, layout, bg:bg||null, visualStyle };
      const next=[...prev];
      if(idx>-1) next[idx]=proj; else next.unshift(proj);
      saveProjectsToStorage(next);
      return next;
    });
  }, [layout, bg, projectName, visualStyle, saveProjectsToStorage]);

 // زر الرجوع
  useEffect(() => {
    let capacitorListener=null, removePopState=null;
    const processBackAction=()=>{
      
      // 1. أول شيء نشيك عليه: هل نافذة الألوان مفتوحة؟
      // نبحث عن الـ ID اللي حطيناه في الخطوة السابقة
      const openColorPicker = document.querySelector('#qp-color-picker-overlay');
      if (openColorPicker) {
         openColorPicker.click(); // نحاكي ضغطة المستخدم على الخلفية الشفافة عشان تتقفل
         return true; // نوقف عملية الرجوع هنا عشان ما يقفل أشياء ثانية
      }

      const s=backStateRef.current;
      
      // 2. هل نافذة قص الصورة مفتوحة؟
      if(s.pendingCropImg){ setPendingCropImg(null); return true; }
      
      // 3. هل نافذة تخصيص الكبسولة (اللي تطلع من تحت) مفتوحة؟ قفلها
      if(s.capsuleEditItem){ setCapsuleEditItem(null); return true; }
      
      // 4. هل قائمة خيارات المشروع (تعديل/حذف) مفتوحة؟
      if(s.projMenuTarget){ setProjMenuTarget(null); return true; }
      
      // 5. هل نافذة إدخال اسم المشروع الجديد مفتوحة؟
      if(s.showProjModal){ setShowProjModal(false); return true; }
      
      // 6. هل وضع التعديل (تحريك الكبسولات) شغال؟ طفه
      if(s.editMode){ setEditMode(false); return true; } 
      
      // 7. إذا ما بقى شيء مفتوح، وأنت داخل مشروع: ارجع للصفحة الرئيسية
      if(s.bg || s.projectName){ setContentVisible(false); setTimeout(()=>{ setBg(null); setBgImg(null); setProjectName(""); setLayout(getInitialLayout(t)); setEditMode(false); setHistory([]); setContentVisible(true); },180); return true; }
      
      // 8. إذا كنت في الإعدادات، ارجع للرئيسية
      if(s.activeTab==="settings"){ setContentVisible(false); setTimeout(()=>{ setActiveTab("home"); setContentVisible(true); },180); return true; }
      
      // إذا ما في شيء من اللي فوق، بيقفل التطبيق بالكامل (الوضع الطبيعي للأندرويد)
      return false;
    };
    const setupBackHandler=async()=>{
      try {
        const{App}=await import("@capacitor/app");
        capacitorListener=await App.addListener("backButton",()=>{ if(!processBackAction()) App.exitApp(); });
      } catch(e){
        window.history.pushState({qp_internal:true},"");
        const handlePopState=()=>{ if(processBackAction()) window.history.pushState({qp_internal:true},""); };
        window.addEventListener("popstate",handlePopState);
        removePopState=()=>window.removeEventListener("popstate",handlePopState);
      }
    };
    setupBackHandler();
    return ()=>{ if(capacitorListener) capacitorListener.remove(); if(removePopState) removePopState(); };
  }, []);

  const showToast = useCallback((msg,ms=2200)=>{ setToast(msg); setTimeout(()=>setToast(null),ms); },[]);
  const snapshot  = useCallback(()=>setHistory(h=>[...h.slice(-29),layout]),[layout]);
  const undo      = ()=>setHistory(h=>{ if(!h.length)return h; setLayout(h[h.length-1]); return h.slice(0,-1); });

  const switchTab = useCallback((newTab)=>{
  triggerHaptic("light"); // نقرتين سريعتين للإحساس بالانتقال
  if(newTab===activeTab) return;
    setContentVisible(false);
    setTimeout(()=>{ setActiveTab(newTab); setContentVisible(true); },180);
  },[activeTab]);

  // معالجة رفع الصورة العامة
  const handleFileChange = (e) => {
    const file=e.target.files[0];
    if(!file||!file.type.startsWith("image/")) return;
    const reader=new FileReader();
    reader.onload=async(ev)=>{
      const resized=await resizeImageIfNeeded(ev.target.result);
      setPendingCropImg(resized);
      setCropForItem("global");
    };
    reader.readAsDataURL(file);
    e.target.value="";
  };

  const handleCropComplete = useCallback((croppedDataUrl)=>{
    const img=new Image();
    img.onload=()=>{ setBgImg(img); setBg(croppedDataUrl); setPendingCropImg(null); setCropForItem(null); showToast(t.uploadReady); };
    img.onerror=()=>{ setPendingCropImg(null); setCropForItem(null); showToast("فشل تحميل الصورة"); };
    img.src=croppedDataUrl;
  },[showToast,t.uploadReady]);

  const handleBack = ()=>{
    setContentVisible(false);
    setTimeout(()=>{ setBg(null); setBgImg(null); setProjectName(""); setLayout(getInitialLayout(t)); setEditMode(false); setHistory([]); setContentVisible(true); },180);
  };

  const loadSavedProject=(proj)=>{
    setProjectName(proj.name); setBg(proj.bg||null); setLayout(proj.layout);
    setVisualStyle(proj.visualStyle||"blurred");
    if(proj.bg){ const img=new Image(); img.onload=()=>setBgImg(img); img.src=proj.bg; } else setBgImg(null);
    showToast(proj.name); setProjMenuTarget(null);
  };

  const deleteProject=(projName)=>{
    setSavedProjects(prev=>{ const next=prev.filter(p=>p.name!==projName); saveProjectsToStorage(next); return next; });
    setProjMenuTarget(null); showToast(t.deleteConfirm);
  };

  const getStride=useCallback(()=>{
    if(!gridRef.current) return 1;
    return (gridRef.current.getBoundingClientRect().width/totalW)*(CELL_EX+GAP_EX);
  },[totalW]);

  const cancelLongPress=useCallback(()=>{
    if(longPressTimer.current){clearTimeout(longPressTimer.current);longPressTimer.current=null;}
    longPressStart.current=null; setLongPressActive(null);
  },[]);

  const onItemTouchStart=useCallback((e,item)=>{
    if(!editMode||resizeRef.current||dragRef.current) return;
    if(e.target.closest("[data-edit-control]")) return;
    const touch=e.touches[0];
    longPressStart.current={x:touch.clientX,y:touch.clientY,item,layout};
    setLongPressActive(item.id);
    longPressTimer.current=setTimeout(()=>{
      if(!longPressStart.current) return;
      triggerHaptic("pickup"); // نبضة تصاعدية فخمة
      const st=longPressStart.current;
      dragRef.current={id:st.item.id,startX:st.x,startY:st.y,origCol:st.item.col,origRow:st.item.row,origColSpan:st.item.colSpan,currentCol:st.item.col,currentRow:st.item.row,startLayout:st.layout};
      snapshot(); setDragging(st.item.id); setLongPressActive(null); longPressStart.current=null;
    },LONG_PRESS_MS);
  },[editMode,snapshot]);

  const onItemTouchMove=useCallback((e)=>{
    const touch=e.touches[0];
    if(longPressStart.current&&!dragRef.current){
      const dx=touch.clientX-longPressStart.current.x, dy=touch.clientY-longPressStart.current.y;
      if(Math.abs(dx)>LONG_PRESS_MOVE||Math.abs(dy)>LONG_PRESS_MOVE) cancelLongPress(); return;
    }
    const dr=dragRef.current,rr=resizeRef.current;
    if(!dr&&!rr) return;
    if(e.cancelable) e.preventDefault();
    const stride=getStride();
    if(dr){
      const dx=touch.clientX-dr.startX, dy=touch.clientY-dr.startY;
      const newCol=Math.max(1,Math.min(COLS-dr.origColSpan+1,dr.origCol+Math.round(dx/stride)));
      const newRow=Math.max(1,dr.origRow+Math.round(dy/stride));
      if(newCol===dr.currentCol&&newRow===dr.currentRow) return;
      dr.currentCol=newCol; dr.currentRow=newRow;
      setLayout(()=>{ const upd=dr.startLayout.map(i=>i.id===dr.id?{...i,col:newCol,row:newRow}:{...i}); return resolveCollisions(upd,dr.id); });
    } else if(rr){
      const dx=touch.clientX-rr.startX, dy=touch.clientY-rr.startY;
      const colDiff=Math.round(dx/stride), rowDiff=Math.round(dy/stride);
      if(colDiff===rr.colDiff&&rowDiff===rr.rowDiff) return;
      rr.colDiff=colDiff; rr.rowDiff=rowDiff;
      setLayout(()=>{ const upd=rr.startLayout.map(item=>{ if(item.id!==rr.id)return{...item}; let cs=Math.max(1,rr.origCS+colDiff),rs=Math.max(1,rr.origRS+rowDiff); if(rr.origCol+cs-1>COLS)cs=COLS-rr.origCol+1; return{...item,colSpan:cs,rowSpan:rs}; }); return resolveCollisions(upd,rr.id); });
    }
  },[getStride,cancelLongPress]);

  const onItemTouchEnd=useCallback(()=>{
    cancelLongPress();
    if(dragRef.current){dragRef.current=null;setDragging(null);}
    if(resizeRef.current){resizeRef.current=null;setResizing(null);}
  },[cancelLongPress]);

  const onResizePointerDown=useCallback((e,item)=>{
    e.stopPropagation(); e.preventDefault(); snapshot();
    resizeRef.current={id:item.id,startX:e.clientX,startY:e.clientY,origCS:item.colSpan,origRS:item.rowSpan,origCol:item.col,startLayout:layout,colDiff:0,rowDiff:0};
    setResizing(item.id);
  },[snapshot,layout]);

  useEffect(()=>{
    const opts={passive:false};
    window.addEventListener("touchmove",onItemTouchMove,opts);
    window.addEventListener("touchend",onItemTouchEnd);
    window.addEventListener("touchcancel",onItemTouchEnd);
    return()=>{ window.removeEventListener("touchmove",onItemTouchMove); window.removeEventListener("touchend",onItemTouchEnd); window.removeEventListener("touchcancel",onItemTouchEnd); };
  },[onItemTouchMove,onItemTouchEnd]);

  useEffect(()=>{
    const onMouseMove=(e)=>{ const rr=resizeRef.current; if(!rr)return; const stride=getStride(); const colDiff=Math.round((e.clientX-rr.startX)/stride),rowDiff=Math.round((e.clientY-rr.startY)/stride); if(colDiff===rr.colDiff&&rowDiff===rr.rowDiff)return; rr.colDiff=colDiff;rr.rowDiff=rowDiff; setLayout(()=>{ const upd=rr.startLayout.map(item=>{ if(item.id!==rr.id)return{...item}; let cs=Math.max(1,rr.origCS+colDiff),rs=Math.max(1,rr.origRS+rowDiff); if(rr.origCol+cs-1>COLS)cs=COLS-rr.origCol+1; return{...item,colSpan:cs,rowSpan:rs}; }); return resolveCollisions(upd,rr.id); }); };
    const onMouseUp=()=>{ if(resizeRef.current){resizeRef.current=null;setResizing(null);} };
    window.addEventListener("mousemove",onMouseMove); window.addEventListener("mouseup",onMouseUp);
    return()=>{ window.removeEventListener("mousemove",onMouseMove); window.removeEventListener("mouseup",onMouseUp); };
  },[getStride]);

  const handleExport=async()=>{
  if(generating||editMode) return;
  triggerHaptic("success"); // الإحساس بالإنجاز
  setGenerating(true)
    try { await exportAllAsZip(layout,bgImg,visualStyle); showToast(t.toastExport); }
    catch(err){ showToast(t.toastFail+err.message); }
    setGenerating(false);
  };

  const wrapperStyle=useCallback((item)=>{
    const isDragging=item.id===dragging, isResizing=item.id===resizing, isPending=item.id===longPressActive;
    const isCircle=item.colSpan===1&&item.rowSpan===1, isPill=(item.colSpan>=2&&item.rowSpan===1)||(item.colSpan===1&&item.rowSpan>=2);
    const radius=isCircle?"50%":isPill?"9999px":"28px";
const leftPct  = ((GAP_EX + (item.col-1)*(CELL_W+GAP_EX)) / totalW) * 100;
const topPct   = ((GAP_EX + (item.row-1)*(CELL_H+GAP_EX)) / totalH) * 100;
const widthPct = ((item.colSpan*CELL_W + (item.colSpan-1)*GAP_EX) / totalW) * 100;
const heightPct= ((item.rowSpan*CELL_H + (item.rowSpan-1)*GAP_EX) / totalH) * 100;
    const transitionVal=isDragging||isResizing
      ? isResizing?"width 0.06s linear,height 0.06s linear,border-radius 0.2s ease"
        :"left 0.28s cubic-bezier(0.16,1,0.3,1),top 0.28s cubic-bezier(0.16,1,0.3,1),width 0.28s cubic-bezier(0.16,1,0.3,1),height 0.28s cubic-bezier(0.16,1,0.3,1),transform 0.15s ease"
      :"left 0.38s cubic-bezier(0.34,1.56,0.64,1),top 0.38s cubic-bezier(0.34,1.56,0.64,1),width 0.38s cubic-bezier(0.34,1.56,0.64,1),height 0.38s cubic-bezier(0.34,1.56,0.64,1),transform 0.15s ease";
    return { position:"absolute", left:`${leftPct}%`, top:`${topPct}%`, width:`${widthPct}%`, height:`${heightPct}%`, borderRadius:radius, display:"flex", alignItems:"center", justifyContent:"center", userSelect:"none", WebkitUserSelect:"none", cursor:editMode?(isDragging?"grabbing":"grab"):"default", transform:isDragging?"scale(1.07)":isPending?"scale(0.96)":"scale(1)", zIndex:isDragging?20:isResizing?15:1, transition:transitionVal, WebkitTapHighlightColor:"transparent", willChange:(isDragging||isResizing)?"transform,width,height":"auto" };
  },[editMode,dragging,resizing,longPressActive,totalW,totalH]);

  const innerStyle=useCallback((item)=>{
    const isDragging=item.id===dragging, isResizing=item.id===resizing;
    const isCircle=item.colSpan===1&&item.rowSpan===1, isPill=(item.colSpan>=2&&item.rowSpan===1)||(item.colSpan===1&&item.rowSpan>=2);
    const radius=isCircle?"50%":isPill?"9999px":"28px";
    const capBg=buildCapsuleBg(item,visualStyle,isDragging);
    return {
      position:"absolute", inset:0, borderRadius:radius, overflow:"hidden",
      ...capBg,
      border:editMode?`2px solid ${isDragging?th.accent:"rgba(255,255,255,0.5)"}`:
        (item.capsuleStyle?.bgType==="clear" || item.capsuleStyle?.bgType==="frosted" || (!item.capsuleStyle||item.capsuleStyle.bgType==="global")&&visualStyle==="transparent")
        ? "1.5px solid rgba(255,255,255,0.4)" // يمكنك تغيير السماكة (1.5px) من هنا متى شئت
        : "1px solid rgba(255,255,255,0.15)", // البوردر للخلفيات العادية كالألوان السادة
      boxShadow:isDragging?`0 14px 40px rgba(0,0,0,0.55),0 0 0 3px ${th.accent}4D`:isResizing?"0 8px 28px rgba(0,0,0,0.45)":"none",
      transition:isDragging?"box-shadow .12s":"border-radius .28s,background .2s,border .2s",
    };
  },[editMode,dragging,resizing,th,visualStyle]);

  // ── الشاشة الرئيسية ──────────────────────────
  return (
    <div style={{ minHeight:"100dvh", background:th.bg, color:th.text, fontFamily:"'Segoe UI',system-ui,sans-serif", display:"flex", flexDirection:"column", alignItems:"center", padding:`24px 14px calc(${inProject?24:100}px + env(safe-area-inset-bottom,0px))`, direction:"ltr", overflowX:"hidden", transition:"background 0.4s ease,color 0.3s ease", position:"relative" }}>

      {/* أوربز الزخرفية */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%", background:`radial-gradient(circle,${th.gradOrb1} 0%,transparent 70%)`, top:"-20%", right:"-10%", animation:"orbFloat1 18s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%", background:`radial-gradient(circle,${th.gradOrb2} 0%,transparent 70%)`, bottom:"10%", left:"-5%", animation:"orbFloat2 22s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%", background:`radial-gradient(circle,${th.gradOrb3} 0%,transparent 70%)`, top:"40%", left:"30%", animation:"orbFloat3 15s ease-in-out infinite" }}/>
      </div>

      {/* SVG Filter للـ Liquid Glass */}
<svg style={{ display:"none", position:"absolute" }}>
  <defs>
    <filter id="liquid-glass-distortion">
      <feTurbulence
        type="turbulence"
        baseFrequency="0.012 0.08"
        numOctaves="2"
        result="turbulence"
        seed="2"
      />
      <feDisplacementMap
        in2="turbulence"
        in="SourceGraphic"
        scale="6"
        xChannelSelector="R"
        yChannelSelector="G"
        result="displaced"
      />
    </filter>
  </defs>
</svg>

      <style>{`
        @keyframes fdIn    { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(14px) scale(0.92)} to{opacity:1;transform:translateX(-50%) translateY(0) scale(1)} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes popIn   { 0%{opacity:0;transform:scale(0.88)} 70%{transform:scale(1.03)} 100%{opacity:1;transform:scale(1)} }
        @keyframes orbFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-30px,20px) scale(1.08)} }
        @keyframes orbFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(20px,-30px) scale(1.05)} }
        @keyframes orbFloat3 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-15px,15px) scale(0.95)} }
        .hover-halo { transition:all 0.3s cubic-bezier(0.34,1.2,0.64,1); }
        .hover-halo:hover { box-shadow:0 0 28px ${th.accent}55,0 8px 24px rgba(0,0,0,0.3); border-color:${th.accent} !important; background:${th.accent}12 !important; transform:translateY(-2px); }
        .hover-halo:active { transform:scale(0.97) !important; }
        .dash-card { transition:all 0.3s cubic-bezier(0.34,1.2,0.64,1); border:1px solid rgba(255,255,255,0.05); }
        .dash-card:hover { border-color:${th.accent}80; box-shadow:0 6px 24px rgba(0,0,0,0.4),0 0 16px ${th.accentGlow}; transform:translateY(-4px) scale(1.02); }
        .dash-card:active { transform:scale(0.96) !important; }
        .tap-btn { transition:transform 0.15s cubic-bezier(0.34,1.56,0.64,1),opacity 0.15s ease,box-shadow 0.2s ease; -webkit-tap-highlight-color:transparent; }
        .tap-btn:active { transform:scale(0.94) !important; opacity:0.82; }
        .style-btn { transition:all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .style-btn:active { transform:scale(0.93); }
        * { -webkit-tap-highlight-color:transparent; box-sizing:border-box; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{ position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)", background:themeMode==="dark"?"rgba(255,255,255,0.95)":"rgba(30,24,20,0.92)", color:themeMode==="dark"?th.bgSolid:th.text, padding:"11px 22px", borderRadius:50, display:"flex", alignItems:"center", gap:8, fontSize:13, fontWeight:600, boxShadow:`0 8px 32px rgba(0,0,0,0.45),0 0 16px ${th.accentGlow}`, zIndex:99999, whiteSpace:"nowrap", animation:"toastIn .3s cubic-bezier(0.34,1.56,0.64,1)", backdropFilter:"blur(12px)" }}>
          {toast.includes("فشل")?<SVGIcons.Delete/>:<SVGIcons.Check/>}
          {toast.replace(/✅|❌|📂/g,"")}
        </div>
      )}

      {/* اقتصاص الصورة */}
      {pendingCropImg && (
        <ImageCropper imgData={pendingCropImg} targetRatio={totalW/totalH}
          onCrop={handleCropComplete} onCancel={()=>{setPendingCropImg(null);setCropForItem(null);}}
          t={t} th={th} lang={lang}/>
      )}

      {/* بانيل تعديل الكبسولة */}
      {capsuleEditItem && (
        <CapsuleEditPanel
          item={capsuleEditItem}
          globalBgImg={bgImg}
          visualStyle={visualStyle}
          totalW={totalW}
          totalH={totalH}
          onSave={item=>{ triggerHaptic(20); setLayout(p=>p.map(i=>i.id===item.id?item:i)); setCapsuleEditItem(null); showToast(t.toastSaved); triggerHaptic("medium");}}
          onClose={()=>{ triggerHaptic(20); setCapsuleEditItem(null); }}
          t={t} th={th} lang={lang}
          triggerHaptic={triggerHaptic} // <-- تمرير الدالة هنا
        />
      )}

      {/* المحتوى الرئيسي */}
      <div style={{ width:"100%", display:"flex", justifyContent:"center", opacity:contentVisible?1:0, transform:contentVisible?"translateY(0) scale(1)":"translateY(10px) scale(0.98)", transition:"opacity 0.22s ease,transform 0.22s cubic-bezier(0.16,1,0.3,1)", position:"relative", zIndex:1 }}>

        {activeTab==="home" ? (
          <div style={{ width:"100%", maxWidth:430 }}>

            {/* زر الرجوع */}
            {inProject && (
              <button onClick={handleBack} className="tap-btn"
                style={{ marginBottom:12, padding:"9px 16px", borderRadius:14, border:`1px solid ${th.border}`, background:th.surface, backdropFilter:"blur(16px)", color:th.textMuted, fontSize:13, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6, boxShadow:"0 2px 12px rgba(0,0,0,0.15)", flexDirection:isRtl?"row-reverse":"row" }}>
                <span style={{ transform:isRtl?"rotate(180deg)":"none", display:"flex" }}><SVGIcons.Undo/></span>
                {t.backBtn}
              </button>
            )}

            {/* هيدر */}
            {!inProject && (
              <div style={{ background:th.surface, backdropFilter:"blur(24px)", borderRadius:24, padding:"20px 22px", border:`1px solid ${th.border}`, marginBottom:14, textAlign:"center", boxShadow:`0 4px 24px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.06)`, animation:"fdIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                <h1 style={{ fontSize:20, margin:"0 0 6px", fontWeight:500, direction:isRtl?"rtl":"ltr" }}>
                  {t.title} <span style={{ color:th.accent }}>Pro</span>
                </h1>
                <p style={{ color:th.textMuted, fontSize:12, lineHeight:1.65, margin:0, direction:isRtl?"rtl":"ltr" }}>
                  {t.desc} <b style={{ color:th.text }}>One UI 8.5</b>
                </p>
              </div>
            )}

            {/* ── شاشة اختيار المشروع ── */}
            {!inProject ? (
              <>
                {/* بدء مشروع جديد */}
                <div className="hover-halo" onClick={()=>setShowProjModal(true)}
                  style={{ position:"relative", padding:"24px 0", borderRadius:20, border:`2px dashed ${th.border}`, background:th.surface, backdropFilter:"blur(20px)", display:"flex", flexDirection:"column", alignItems:"center", gap:8, cursor:"pointer", marginBottom:14, boxShadow:"0 2px 16px rgba(0,0,0,0.12)", animation:"fdIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
                  <TooltipButton text={t.uploadinfo} top={12} left={isRtl?12:undefined} right={isRtl?undefined:12}/>
                  <span style={{ color:th.text, display:"flex" }}><SVGIcons.Folder/></span>
                  <span style={{ color:th.text, fontWeight:700, fontSize:13.5, direction:isRtl?"rtl":"ltr" }}>{t.uploadPrompt}</span>
                </div>

                {/* المشاريع المحفوظة */}
                <div style={{ background:`linear-gradient(135deg,${th.surface},${th.accentGlow2})`, backdropFilter:"blur(24px)", borderRadius:24, padding:"18px 20px", border:`1px solid ${th.border}`, marginBottom:14, boxShadow:`0 4px 24px rgba(0,0,0,0.15),inset 0 1px 0 rgba(255,255,255,0.05)`, animation:"fdIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, flexDirection:isRtl?"row-reverse":"row" }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:14, fontWeight:700, color:th.text, display:"flex", alignItems:"center", gap:6 }}>
                        <SVGIcons.Projects/> {t.savedDashboard}
                      </span>
                      <div style={{ position:"relative", width:22, height:22 }}><TooltipButton text={t.brojectinfo} top={0} left={0}/></div>
                    </div>
                    <span style={{ fontSize:12, color:th.accent, fontWeight:600 }}>{t.viewAll} ({savedProjects.length})</span>
                  </div>
                  {savedProjects.length>0?(
                    <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:6, flexDirection:isRtl?"row-reverse":"row" }}>
                      {savedProjects.slice(0,5).map((proj,idx)=>(
                        <div key={idx} onClick={()=>setProjMenuTarget(proj)} className="dash-card"
                          style={{ flexShrink:0, width:110, background:"rgba(0,0,0,0.2)", backdropFilter:"blur(8px)", padding:8, borderRadius:14, cursor:"pointer", textAlign:"center", animation:`popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${idx*0.05}s both` }}>
                          <div style={{ width:"100%", aspectRatio:"1/1.5", borderRadius:10, overflow:"hidden", marginBottom:6, border:`1px solid ${th.border}`, boxShadow:"0 4px 12px rgba(0,0,0,0.25)", background:"#111" }}>
                            {proj.bg && <img src={proj.bg} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt=""/>}
                          </div>
                          <div style={{ fontSize:11, fontWeight:600, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{proj.name}</div>
                        </div>
                      ))}
                    </div>
                  ):(
                    <div style={{ color:th.textMuted, fontSize:12, textAlign:"center", padding:"10px 0", direction:isRtl?"rtl":"ltr" }}>{t.noSaved}</div>
                  )}
                </div>
              </>
            ) : (
              /* ── بيئة العمل (داخل المشروع) ── */
              <div style={{ animation:"fdIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>

                {/* اسم المشروع */}
                <div style={{ padding:"12px 16px", borderRadius:16, border:`1px solid ${th.border}`, background:th.surface, backdropFilter:"blur(20px)", marginBottom:12, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 2px 14px rgba(0,0,0,0.12)", flexDirection:isRtl?"row-reverse":"row" }}>
                  <span style={{ fontSize:14, fontWeight:700, color:th.accent }}>
                    {projectName}
                  </span>
                  {/* ── أزرار إدارة الصورة ── */}
                  <div style={{ display:"flex", gap:6, alignItems:"center" }}>
                    <div style={{ position:"relative" }}>
                      <button className="tap-btn" onClick={()=>fileRef.current?.click()}
                        style={{ background:th.accent, border:"none", borderRadius:10, padding:"8px 12px", color:"white", display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                        <SVGIcons.Crop/> {t.cropBtn}
                      </button>
                      <TooltipButton text={t.resizeImage} top={-8} right={isRtl?undefined:-8} left={isRtl?-8:undefined}/>
                    </div>
                    {bg && (
                      <button className="tap-btn" onClick={()=>{ setBg(null); setBgImg(null); showToast(t.removeImg); }}
                        style={{ background:"rgba(231,76,60,0.12)", border:"1px solid rgba(231,76,60,0.25)", borderRadius:10, padding:"8px 10px", color:"#e74c3c", display:"flex", alignItems:"center", gap:4, fontSize:12, fontWeight:700, cursor:"pointer" }}>
                        <SVGIcons.Trash/>
                      </button>
                    )}
                  </div>
                </div>

                {/* أزرار الأسلوب البصري */}
                {(() => {
                  // التحقق: هل هناك كبسولة واحدة على الأقل تستخدم "الخلفية العامة"؟
                  const hasGlobal = layout.some(i => !i.capsuleStyle || !i.capsuleStyle.bgType || i.capsuleStyle.bgType === "global");
                  
                  return (
                    <div style={{
                      overflow: "hidden",
                      transition: "all 0.45s cubic-bezier(0.25, 1, 0.5, 1)",
                      maxHeight: hasGlobal ? "80px" : "0px",
                      opacity: hasGlobal ? 1 : 0,
                      marginBottom: hasGlobal ? 12 : 0,
                    }}>
                      <div style={{ background:th.surface, backdropFilter:"blur(20px)", borderRadius:16, padding:"10px 14px", border:`1px solid ${th.border}`, display:"flex", justifyContent:"space-between", alignItems:"center", boxShadow:"0 2px 14px rgba(0,0,0,0.12)", flexDirection:isRtl?"row-reverse":"row" }}>
                        <span style={{ fontSize:12, color:th.textMuted, fontWeight:600 }}>{isRtl?"النمط العام":"Global Style"}</span>
                        <div style={{ display:"flex", gap:6 }}>
                          <button className="style-btn" onClick={()=>{ setVisualStyle("transparent"); }}
                            style={{ padding:"6px 14px", borderRadius:10, border:"none", fontSize:11.5, fontWeight:700, cursor:"pointer", background:visualStyle==="transparent"?th.accent:"rgba(0,0,0,0.2)", color:"white", boxShadow:visualStyle==="transparent"?`0 3px 12px ${th.accentGlow}`:"none" }}>
                            {t.styleTrans}
                          </button>
                          <button className="style-btn" onClick={()=>{ setVisualStyle("blurred"); }}
                            style={{ padding:"6px 14px", borderRadius:10, border:"none", fontSize:11.5, fontWeight:700, cursor:"pointer", background:visualStyle==="blurred"?th.accent:"rgba(0,0,0,0.2)", color:"white", boxShadow:visualStyle==="blurred"?`0 3px 12px ${th.accentGlow}`:"none" }}>
                            {t.styleBlur}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* أزرار التعديل والتراجع */}
                <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                  <div style={{ flex:1, position:"relative" }}>
                    <button className="tap-btn" onClick={()=>{ triggerHaptic(25); setEditMode(m=>!m); }}
                      style={{ width:"100%", padding:"12px 0", borderRadius:14, display:"flex", justifyContent:"center", alignItems:"center", gap:6, border:`1px solid ${editMode?th.accent:th.border}`, background:editMode?`${th.accent}28`:th.surface, backdropFilter:"blur(10px)", color:editMode?th.accent:th.text, fontSize:13, fontWeight:700, cursor:"pointer", boxShadow:editMode?`0 4px 18px ${th.accentGlow}`:"none" }}>
                      {editMode?<><SVGIcons.Check/> {t.editOn}</>:<><SVGIcons.Edit size={16}/> {t.editOff}</>}
                    </button>
                    <TooltipButton text={t.editInfo} top={-8} right={isRtl?undefined:-8} left={isRtl?-8:undefined}/>
                  </div>
                  {editMode && history.length>0 && (
                    <button className="tap-btn" onClick={()=>{ triggerHaptic(25); undo(); }}
                      style={{ padding:"12px 16px", borderRadius:14, border:`1px solid ${th.border}`, display:"flex", justifyContent:"center", alignItems:"center", gap:6, background:th.surface, backdropFilter:"blur(10px)", color:th.text, fontSize:13, cursor:"pointer", fontWeight:600, animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                      <SVGIcons.Undo/> {t.undo}
                    </button>
                  )}
                </div>

                {/* تلميح وضع التعديل */}
                {editMode && (
                  <div style={{ textAlign:"center", color:th.accent, fontSize:11, fontWeight:600, display:"flex", justifyContent:"center", alignItems:"center", gap:6, marginBottom:10, background:`${th.accent}18`, padding:"8px 10px", borderRadius:12, animation:"fdIn .25s ease", border:`1px solid ${th.accent}30`, direction:isRtl?"rtl":"ltr" }}>
                    <SVGIcons.Sparkle/> {t.hint}
                  </div>
                )}

                {/* ── شبكة الكبسولات ── */}
                <div ref={gridRef}
                style={{ position:"relative", width:"100%", aspectRatio:`${totalW}/${totalH}`,
                borderRadius:28,
                background: bg ? "#111" : `linear-gradient(145deg, #6b6ba0 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)`,
                boxShadow:`0 20px 60px rgba(0,0,0,0.5),0 0 0 1px rgba(255,255,255,0.06)`,
                direction:"rtl", touchAction:"pan-y", overflow:"hidden" }}>

                  {/* صورة الخلفية */}
                  {bg && (
                    <img src={bg} alt="" style={{ position:"absolute", inset:0, width:"100%", height:"100%", objectFit:"cover", objectPosition:"center", opacity:editMode?0.28:1, transition:"opacity .4s ease", pointerEvents:"none", userSelect:"none" }}/>
                  )}
                  {/* غطاء التعديل */}
                  {editMode && <div style={{ position:"absolute", inset:0, background:"rgba(10,10,20,0.18)", pointerEvents:"none", zIndex:0 }}/>}

                  {layout.map(item=>(
                    <div key={item.id} style={wrapperStyle(item)} onTouchStart={e=>onItemTouchStart(e,item)}>
                     <div style={innerStyle(item)}>
  {/* ✅ طبقة Liquid Glass */}
  {item.capsuleStyle?.bgType==="liquid" && (
    <LiquidGlassLayer 
  item={item} 
  blurAmount={item.capsuleStyle?.bgGlassBlur ?? 0.5} 
  bgImg={bgImg}
  totalW={totalW}
  totalH={totalH}
  visualStyle={visualStyle}
/>
  )}
  {/* حلقة داخلية إضافية للزجاج السائل */}
{item.capsuleStyle?.bgType === "liquid" && (
  <div style={{
    position: "absolute",
    inset: 4,
    borderRadius: "inherit",
    border: "1px solid rgba(255,255,255,0.20)",
    pointerEvents: "none",
    zIndex: 3,
  }}/>
)}

  {/* إضافة الصورة بإحداثياتها هنا */}
  {item.capsuleStyle?.bgType==="image" && item.capsuleStyle?.bgImage && (
      <img 
        src={item.capsuleStyle.bgImage} 
        draggable={false}
        style={{ 
          position:"absolute", left:0, top:0, width:"100%", height:"100%", 
          objectFit:"cover", transformOrigin:"center", 
          transform:`translate(${item.capsuleStyle.bgImageOffsetX ?? 0}px, ${item.capsuleStyle.bgImageOffsetY ?? 0}px) scale(${item.capsuleStyle.bgImageScale ?? 1})`, 
          pointerEvents:"none", userSelect:"none", zIndex:0 
        }} 
        alt="" 
      />
  )}
  {/* باقي أكواد اللمعة هنا... */}
 {/* التصميم الزجاجي الفخم الجديد للمعاينة (Liquid & 3D Glass) */}
                {(item.capsuleStyle?.bgType==="liquid" || item.capsuleStyle?.bgType==="glass") && (() => {
                  const isGlass = item.capsuleStyle?.bgType === "glass";
                  const isCir = item.colSpan === 1 && item.rowSpan === 1;
                  const op = isGlass ? 1 : 0.85;
                  return (
                    <>
                      {/* الإطار المتدرج والانعكاس المائل الكبير */}
                      <div style={{
                        position: "absolute", inset: 0,
                        borderRadius: "inherit",
                        boxShadow: `inset 3px 3px 6px rgba(255,255,255,${0.4 * op}), inset -2px -2px 5px rgba(0,0,0,${0.4 * op}), inset 0 0 0 1px rgba(255,255,255,${0.15 * op})`,
                        background: `linear-gradient(155deg, rgba(255,255,255,${0.35 * op}) 0%, rgba(255,255,255,${0.05 * op}) 35%, rgba(255,255,255,0) 40%)`,
                        pointerEvents: "none", zIndex: 2,
                      }}/>
                      {/* اللمعة أعلى اليسار */}
                      <div style={{
                        position: "absolute",
                        top: isCir ? "15%" : "12%", left: isCir ? "15%" : "6%",
                        width: isCir ? "25%" : "15%", aspectRatio: "1/1",
                        background: `radial-gradient(circle, rgba(255,255,255,${0.9 * op}) 0%, rgba(255,255,255,${0.25 * op}) 40%, rgba(255,255,255,0) 70%)`,
                        borderRadius: "50%", pointerEvents: "none", zIndex: 2,
                      }}/>
                      {/* اللمعة أسفل اليمين */}
                      <div style={{
                        position: "absolute",
                        bottom: isCir ? "15%" : "12%", right: isCir ? "15%" : "6%",
                        width: isCir ? "20%" : "12%", aspectRatio: "1/1",
                        background: `radial-gradient(circle, rgba(255,255,255,${0.8 * op}) 0%, rgba(255,255,255,${0.2 * op}) 40%, rgba(255,255,255,0) 70%)`,
                        borderRadius: "50%", pointerEvents: "none", zIndex: 2,
                      }}/>
                    </>
                  );
                })()}
{/* طبقة اللمعة للزجاج — منحنية مع شكل الكبسولة */}
{(item.capsuleStyle?.bgType==="frosted"||item.capsuleStyle?.bgType==="clear") && (() => {
  const isClear = item.capsuleStyle?.bgType==="clear";
  const isCir = item.colSpan===1&&item.rowSpan===1;
  return (
    <>
      {/* لمعة علوية منحنية — تتبع شكل الكبسولة */}
      <div style={{
        position:"absolute", top:2, left:"8%", right:"8%", height:"42%",
        background: isClear
          ? "linear-gradient(180deg,rgba(255,255,255,0.55) 0%,rgba(255,255,255,0.15) 60%,rgba(255,255,255,0) 100%)"
          : "linear-gradient(180deg,rgba(255,255,255,0.42) 0%,rgba(255,255,255,0.10) 60%,rgba(255,255,255,0) 100%)",
        borderRadius: isCir ? "50% 50% 40% 40% / 60% 60% 40% 40%" : "50% 50% 40% 40% / 80% 80% 20% 20%",
        pointerEvents:"none", zIndex:2,
        filter: "blur(1px)",
      }}/>
      {/* لمعة صغيرة — بريق نقطي */}
      {!isCir && (
        <div style={{
          position:"absolute", top:"8%", left:"18%", width:"22%", height:"12%",
          background:"rgba(255,255,255,0.5)",
          borderRadius:"50%",
          filter:"blur(5px)",
          transform:"rotate(-8deg)",
          pointerEvents:"none", zIndex:2,
          opacity: isClear ? 0.9 : 0.6,
        }}/>
      )}
      {/* ظل داخلي سفلي لعمق ثلاثي الأبعاد */}
      <div style={{
        position:"absolute", bottom:0, left:0, right:0, height:"30%",
        background:"linear-gradient(0deg,rgba(0,0,0,0.18) 0%,rgba(0,0,0,0) 100%)",
        borderRadius: isCir ? "0 0 50% 50%" : "0 0 28px 28px",
        pointerEvents:"none", zIndex:2,
      }}/>
      {/* حواف لامعة للزجاج الشفاف */}
      {isClear && (
        <div style={{
          position:"absolute", inset:1,
          borderRadius:"inherit",
          border:"1px solid rgba(255,255,255,0.55)",
          boxShadow:"inset 0 0 6px rgba(255,255,255,0.2)",
          pointerEvents:"none", zIndex:3,
        }}/>
      )}
    </>
  );
})()}
                        <ItemContent item={item} visualStyle={visualStyle}/>
                      </div>

                      {/* ── أدوات وضع التعديل ── */}
                      {editMode && (
                        <>
                          {/* حذف */}
                          <div data-edit-control="true"
                            style={{ position:"absolute", top:-1, left:-1, width:24, height:24, borderRadius:"50%", background:th.danger, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", zIndex:30, boxShadow:"0 2px 10px rgba(0,0,0,0.5)", animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
                            onTouchStart={e=>e.stopPropagation()}
                            onClick={e=>{ e.stopPropagation(); snapshot(); setLayout(p=>p.filter(i=>i.id!==item.id)); triggerHaptic("heavy");}}>
                            <div style={{ width:10, height:2, background:"white", borderRadius:1 }}/>
                          </div>
                          {/* تخصيص الكبسولة (يفتح البانيل المتقدم) */}
                          <div data-edit-control="true"
                            style={{ position:"absolute", top:-1, right:-1, width:26, height:26, borderRadius:"50%", background:"rgba(40,40,50,0.95)", border:"1px solid rgba(255,255,255,0.3)", display:"flex", alignItems:"center", justifyContent:"center", color:"white", cursor:"pointer", zIndex:30, boxShadow:"0 2px 10px rgba(0,0,0,0.5)", animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.05s both" }}
                            onTouchStart={e=>e.stopPropagation()}
                            onClick={e=>{ e.stopPropagation(); setCapsuleEditItem(item); }}>
                            <SVGIcons.Edit size={12}/>
                          </div>
                          {/* تغيير الحجم */}
                          <div data-edit-control="true"
                            style={{ position:"absolute", bottom:-4, right:-4, width:34, height:34, background:th.accent, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", zIndex:30, cursor:"se-resize", boxShadow:`0 3px 10px rgba(0,0,0,0.5),0 0 8px ${th.accentGlow}`, animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}
                            onTouchStart={e=>{ e.stopPropagation(); onResizePointerDown({clientX:e.touches[0].clientX,clientY:e.touches[0].clientY,stopPropagation:()=>{},preventDefault:()=>{}},item); }}
                            onMouseDown={e=>onResizePointerDown(e,item)}>
                            <div style={{ width:14, height:14, borderRadius:"30%", borderRight:"5px solid white", borderBottom:"5px solid white", transform:"translate(-2px,-2px)" }}/>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* زر إضافة كبسولة */}
                {editMode && (
                  <div style={{ display:"flex", justifyContent:"center", marginTop:14, animation:"popIn .3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    <button className="tap-btn"
                      onClick={()=>{ snapshot(); setLayout(p=>[...p,{id:Date.now().toString(),col:1,colSpan:1,row:getMaxRow(layout)+1,rowSpan:1,icon:"",label:"",capsuleStyle:{...DEFAULT_CAPSULE_STYLE}}]); }}
                      style={{ width:52, height:52, borderRadius:"50%", background:th.accent, color:"#fff", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:`0 6px 24px ${th.accentGlow},0 0 0 1px ${th.accent}40` }}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                )}

                {/* زر التصدير */}
                <button className="tap-btn" onClick={handleExport} disabled={generating||editMode}
                  style={{ marginTop:editMode?14:22, width:"100%", padding:16, borderRadius:18, display:"flex", justifyContent:"center", alignItems:"center", gap:10, border:"none", fontSize:15, fontWeight:800, background:editMode?th.surface:th.text, color:editMode?th.textMuted:th.bgSolid, cursor:(generating||editMode)?"not-allowed":"pointer", boxShadow:editMode?"none":`0 6px 24px rgba(0,0,0,0.25),0 0 16px ${th.accentGlow}` }}>
                  {generating
                    ?<span style={{ display:"flex",alignItems:"center",gap:8 }}><div style={{ width:16,height:16,borderRadius:"50%",border:"2px solid rgba(0,0,0,0.2)",borderTopColor:th.bgSolid,animation:"spin .7s linear infinite" }}/>{t.exporting}</span>
                    :<>{!editMode&&<SVGIcons.Export/>}{editMode?t.exportWarn:t.exportBtn}</>
                  }
                </button>
              </div>
            )}
          </div>
        ) : (
          /* ── تبويب الإعدادات ── */
          <div style={{ width:"100%", maxWidth:430, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background:th.surface, backdropFilter:"blur(24px)", borderRadius:24, padding:"24px", border:`1px solid ${th.border}`, boxShadow:`0 4px 24px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.06)`, animation:"fdIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
              <h2 style={{ margin:"0 0 20px", fontSize:22, color:th.text, display:"flex", justifyContent:"center", alignItems:"center", gap:8, direction:isRtl?"rtl":"ltr" }}>{t.settings}</h2>
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexDirection:isRtl?"row-reverse":"row" }}>
                    <label style={{ fontSize:13, color:th.textMuted, margin:0 }}>{t.lang}</label>
                    <div style={{ position:"relative", width:26, height:26 }}><TooltipButton text={t.langinfo} top={0} left={0}/></div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    {["ar","en"].map(l=>(
                      <button key={l} className="tap-btn" onClick={()=>setLang(l)}
                        style={{ flex:1, padding:13, borderRadius:13, cursor:"pointer", border:`1px solid ${lang===l?th.accent:th.border}`, background:lang===l?th.accentGlow:"transparent", color:th.text, fontWeight:600, fontSize:14, boxShadow:lang===l?`0 3px 12px ${th.accentGlow}`:"none" }}>
                        {l==="ar"?"العربية":"English"}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8, flexDirection:isRtl?"row-reverse":"row" }}>
                    <label style={{ fontSize:13, color:th.textMuted, margin:0 }}>{t.themeMode}</label>
                    <div style={{ position:"relative", width:26, height:26 }}><TooltipButton text={t.themeinfo} top={0} left={0}/></div>
                  </div>
                  <div style={{ display:"flex", gap:8 }}>
                    {["dark","light"].map(m=>(
                      <button key={m} className="tap-btn" onClick={()=>setThemeMode(m)}
                        style={{ flex:1, padding:13, borderRadius:13, cursor:"pointer", display:"flex", justifyContent:"center", alignItems:"center", gap:6, border:`1px solid ${themeMode===m?th.accent:th.border}`, background:themeMode===m?th.accentGlow:"transparent", color:th.text, fontWeight:600, boxShadow:themeMode===m?`0 3px 12px ${th.accentGlow}`:"none" }}>
                        {m==="dark"?<><SVGIcons.Moon/>{t.dark}</>:<><SVGIcons.Sun/>{t.light}</>}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* خيار اهتزاز اللمس */}
                <div style={{ marginTop: 14 }}>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", background:"rgba(255,255,255,0.03)", borderRadius:14, padding:"12px 14px", border:`1px solid ${th.border}` }}>
                    <div style={{ display:"flex", alignItems:"center", gap:8, flexDirection:isRtl?"row-reverse":"row" }}>
                      <label style={{ fontSize:13, color:th.textMuted, margin:0 }}>{t.hapticMode}</label>
                      <div style={{ position:"relative", width:26, height:26 }}><TooltipButton text={t.hapticinfo} top={0} left={0}/></div>
                    </div>
                    <div onClick={() => { setHapticEnabled(!hapticEnabled); if(!hapticEnabled) { if(navigator.vibrate) navigator.vibrate(15); } }} style={{ cursor:"pointer", display:"flex" }}>
                      <SVGIcons.Toggle on={hapticEnabled}/>
                    </div>
                  </div>
                </div>
            </div>
            <div style={{ background:th.surface, border:`1px solid ${th.border}`, borderRadius:24, padding:20, color:th.text }}>
              <h3 style={{ marginTop:0, marginBottom:20, textAlign:"center" }}>{t.contact}</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                {[
                  {label:t.Email, href:"mailto:ibrah.aladwani@gmail.com", text:"ibrah.aladwani@gmail.com"},
                  {label:t.Twetter, href:"https://x.com/Ibrahim_312i", text:"@Ibrahim_312i"},
                  {label:t.Instagram, href:"https://www.instagram.com/ibrah_hi_m", text:"@ibrah_hi_m"},
                  {label:t.telgram, href:"https://t.me/+oxm3eU42ja44ZDBk", text:"My quick panel & more"},
                ].map((item,i)=>(
                  <div key={i}>
                    <div style={{ fontSize:14, color:th.textMuted }}>{item.label}</div>
                    <a href={item.href} target="_blank" rel="noopener noreferrer" style={{ fontSize:15, color:th.accent, textDecoration:"underline" }}>{item.text}</a>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ textAlign:"center", marginTop:16, opacity:0.55, animation:"fdIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
              <p style={{ margin:5, fontSize:14, color:th.text }}>{t.devCredit}</p>
              <p style={{ margin:5, fontSize:12, color:th.textMuted }}>{t.rights}</p>
            </div>
          </div>
        )}
      </div>

      {/* شريط التنقل السفلي */}
      {!inProject && (
        <div style={{ position:"fixed", bottom:24, display:"flex", background:th.navBg, backdropFilter:"blur(28px) saturate(1.5)", WebkitBackdropFilter:"blur(28px) saturate(1.5)", border:`1px solid ${th.border}`, borderRadius:36, width:"90%", maxWidth:380, padding:6, boxShadow:`0 12px 40px rgba(0,0,0,0.35),0 0 0 1px rgba(255,255,255,0.04),inset 0 1px 0 rgba(255,255,255,0.06)`, zIndex:100 }}>
          {[{id:"home",icon:<SVGIcons.Home/>,label:t.tabHome},{id:"settings",icon:<SVGIcons.Settings/>,label:t.tabSettings}].map(tab=>(
            <button key={tab.id} onClick={()=>switchTab(tab.id)}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, padding:"10px 0", border:"none", borderRadius:30, cursor:"pointer", transition:"all 0.3s cubic-bezier(0.34,1.2,0.64,1)", background:activeTab===tab.id?th.accentGlow:"transparent", color:activeTab===tab.id?th.accent:th.textMuted, transform:activeTab===tab.id?"scale(1.05)":"scale(1)", boxShadow:activeTab===tab.id?`0 0 16px ${th.accentGlow}`:"none" }}>
              <span style={{ display:"flex", transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)", transform:activeTab===tab.id?"scale(1.15)":"scale(1)" }}>{tab.icon}</span>
              <span style={{ fontSize:12, fontWeight:700 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* مودال اسم المشروع (بدون صورة إجبارية) */}
      {showProjModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:9999, display:"flex", alignItems:"center", justifyContent:"center", padding:20, backdropFilter:"blur(12px)", animation:"fdIn .25s ease" }}>
          <div style={{ background:th.modalBg, backdropFilter:"blur(28px) saturate(1.4)", padding:24, borderRadius:26, width:"100%", maxWidth:360, border:`1px solid ${th.borderHover}`, boxShadow:`0 24px 60px rgba(0,0,0,0.55),0 0 40px ${th.modalGlow},inset 0 1px 0 rgba(255,255,255,0.08)`, animation:"popIn .35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <h3 style={{ margin:"0 0 16px", color:th.text, textAlign:isRtl?"right":"left" }}>{t.projectNamePrompt}</h3>
            <input type="text" placeholder={t.defaultProjectName}
              onChange={e=>tempNameRef.current=e.target.value}
              style={{ width:"100%", boxSizing:"border-box", padding:14, borderRadius:14, border:`1px solid ${th.border}`, background:"rgba(255,255,255,0.04)", color:th.text, fontSize:14, outline:"none", marginBottom:20, textAlign:isRtl?"right":"left" }}
              onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>

            {/* خيار رفع صورة (اختياري) */}
            <p style={{ fontSize:12, color:th.textMuted, textAlign:"center", margin:"0 0 14px", direction:isRtl?"rtl":"ltr" }}>
              {isRtl?"يمكنك رفع صورة الآن أو لاحقاً داخل المشروع":"You can upload an image now or later inside the project"}
            </p>

            <div style={{ display:"flex", gap:10, flexDirection:"column" }}>
              {/* إنشاء بدون صورة */}
              <button className="tap-btn"
                onClick={()=>{
                  const name=tempNameRef.current.trim()||t.defaultProjectName;
                  setProjectName(name); setLayout(getInitialLayout(t)); setShowProjModal(false);
                }}
                style={{ width:"100%", padding:14, background:th.accent, color:"white", border:"none", borderRadius:14, fontWeight:"bold", cursor:"pointer", boxShadow:`0 4px 16px ${th.accentGlow}` }}>
                {t.continueBtn}
              </button>
              {/* إنشاء مع صورة */}
              <button className="tap-btn"
                onClick={()=>{ const name=tempNameRef.current.trim()||t.defaultProjectName; setProjectName(name); setLayout(getInitialLayout(t)); setShowProjModal(false); fileRef.current?.click(); }}
                style={{ width:"100%", padding:13, background:"transparent", color:th.accent, border:`1px solid ${th.accent}`, borderRadius:14, fontWeight:700, cursor:"pointer", display:"flex", justifyContent:"center", alignItems:"center", gap:6, fontSize:13 }}>
                <SVGIcons.Upload/> {isRtl?"إنشاء ورفع صورة":"Create & Upload Image"}
              </button>
              <button className="tap-btn" onClick={()=>setShowProjModal(false)}
                style={{ width:"100%", padding:12, background:"transparent", color:th.textMuted, border:`1px solid ${th.border}`, borderRadius:14, cursor:"pointer", fontSize:13 }}>
                {t.cancelBtn}
              </button>
            </div>
          </div>
        </div>
        
      )}

      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileChange}/>

      {projMenuTarget && (
        <ProjectMenu proj={projMenuTarget} onEdit={()=>loadSavedProject(projMenuTarget)} onDelete={()=>deleteProject(projMenuTarget.name)} onClose={()=>setProjMenuTarget(null)} t={t} th={th} lang={lang}/>
        
      )}
      
    </div>
  );
}