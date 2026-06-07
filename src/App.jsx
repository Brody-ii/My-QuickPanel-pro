/**
 * QuickPanel Pro – v8
 * تطبيق تعديل الكويك بانيل لهواتف سامسونج
 */

import { useState, useRef, useCallback, useEffect, useMemo } from "react";
import localforage from "localforage";


// ── أيقونات SVG — كل أيقونة دالة مستقلة ترجع SVG جاهز للاستخدام ─────────────
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
};

// ── قائمة أسماء ملفات الأيقونات — كلها موجودة في مجلد /icons ─────────────────
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

// ── الترتيب الافتراضي للكبسولات عند فتح مشروع جديد ──────────────────────────
const INITIAL_LAYOUT = [
  { id:"1",  col:1, colSpan:2, row:1, rowSpan:1, icon:"wifi.png",           label:"Wi-Fi" },
  { id:"2",  col:3, colSpan:2, row:1, rowSpan:1, icon:"bluetooth.png",       label:"البلوتوث" },
  { id:"3",  col:1, colSpan:4, row:2, rowSpan:2, icon:null,                  label:"" },
  { id:"4",  col:1, colSpan:4, row:4, rowSpan:1, icon:null,                  label:"" },
  { id:"5",  col:1, colSpan:4, row:5, rowSpan:1, icon:null,                  label:"" },
  { id:"6",  col:1, colSpan:4, row:6, rowSpan:1, icon:null,                  label:"تشغيل الأغنية الأخيرة" },
  { id:"7",  col:1, colSpan:2, row:7, rowSpan:1, icon:"smart_view.png",      label:"Smart View" },
  { id:"8",  col:3, colSpan:2, row:7, rowSpan:1, icon:"modes.png",           label:"الأوضاع" },
  { id:"9",  col:1, colSpan:2, row:8, rowSpan:1, icon:"nearby_devices.png",  label:"الأجهزة المجاورة" },
  { id:"10", col:3, colSpan:2, row:8, rowSpan:1, icon:"smart_things.png",    label:"SmartThings" },
];

// ── ثوابت الشبكة — عدد الأعمدة وحجم كل خلية والمسافة بينها ──────────────────
const COLS            = 4;
const CELL_EX         = 100;
const GAP_EX          = 12;
const LONG_PRESS_MS   = 400;   // مدة الضغط الطويل بالمليثانية
const LONG_PRESS_MOVE = 8;     // أقصى حركة مسموحة قبل إلغاء الضغط الطويل

// ── دالة مساعدة — تحول اسم الملف إلى نص قابل للقراءة ────────────────────────
const iconLabel = (n) => (n ? n.replace(/\.png$/i, "").replace(/_/g, " ") : "");

// ── ألوان وأنماط الثيمات الداكن والفاتح ──────────────────────────────────────
const THEMES = {
  dark: {
    bg: "linear-gradient(145deg, #0e0c0a 0%, #17110e 40%, #1a1208 70%, #0f0e14 100%)",
    bgSolid: "#0f0d0b",
    surface: "rgba(35,27,22,0.72)",
    accent: "#d97736",
    accentGlow: "rgba(217,119,54,0.18)",
    accentGlow2: "rgba(217,119,54,0.08)",
    text: "#ffffff",
    textMuted: "rgba(255,255,255,0.55)",
    danger: "#e74c3c",
    border: "rgba(255,255,255,0.07)",
    borderHover: "rgba(255,255,255,0.18)",
    modalBg: "rgba(22,17,14,0.92)",
    modalGlow: "rgba(217,119,54,0.12)",
    gradOrb1: "rgba(217,119,54,0.07)",
    gradOrb2: "rgba(180,80,30,0.05)",
    gradOrb3: "rgba(255,160,60,0.04)",
    navBg: "rgba(22,17,14,0.88)",
  },
  light: {
    bg: "linear-gradient(145deg, #f0e8e0 0%, #f8f0e8 40%, #ede6d8 70%, #f5eee5 100%)",
    bgSolid: "#f0e8df",
    surface: "rgba(255,248,242,0.78)",
    accent: "#c46221",
    accentGlow: "rgba(196,98,33,0.14)",
    accentGlow2: "rgba(196,98,33,0.06)",
    text: "#2b221d",
    textMuted: "rgba(0,0,0,0.5)",
    danger: "#c0392b",
    border: "rgba(0,0,0,0.08)",
    borderHover: "rgba(0,0,0,0.2)",
    modalBg: "rgba(255,250,245,0.95)",
    modalGlow: "rgba(196,98,33,0.10)",
    gradOrb1: "rgba(196,98,33,0.06)",
    gradOrb2: "rgba(220,130,60,0.04)",
    gradOrb3: "rgba(180,80,30,0.03)",
    navBg: "rgba(255,248,242,0.92)",
  },
};

// ── نصوص الواجهة — عربي وإنجليزي ────────────────────────────────────────────
const TEXTS = {
  ar: {
    title:"مُعـدّل الكويك بانيل", desc:"صُمم خصيصاً لقص وتنسيق صورك لِتتطابق مع واجهة اللوحة السريعة",
    uploadReady:"تم الرفع — ابدأ التعديل", uploadPrompt:"اضغط هنا لبدء مشروع جديد",
    editOn:"إنهاء التعديل", editOff:"تعديل الكبسولات", undo:"تراجع",
    hint:"اضغط مطولاً لتحريك الكبسولات — اسحب الزاوية للتكبير",
    exportBtn:"تصدير وتحميل الصور (ZIP)", exporting:"جاري المعالجة...",
    exportWarn:"أقفل وضع التعديل لتمكين التصدير",
    tabHome:"الرئيسية", tabSettings:"الإعدادات", settings:"الإعدادات",
    lang:"اللغة (Language)", themeMode:"المظهر (Theme)", dark:"داكن", light:"فاتح",
    devCredit:"تطوير: إبراهيم (براودي)", rights:"جميع الحقوق محفوظة ©Ibrahim AL-adwani 2026",
    modalTitle:"تعديل الزر", searchIcon:"ابحث عن أيقونة...", chooseIcon:"اختر أيقونة:",
    noIcon:"بدون أيقونة", noResult:"لا توجد نتائج", labelOpt:"النص (اختياري):",
    labelEx:"مثال: Wi-Fi", saveBtn:"حفظ التعديلات", cancelBtn:"إلغاء",
    toastSaved:"تم الحفظ!", toastExport:"بدأ التحميل!", toastFail:"فشل التصدير: ",
    styleTrans:"شفاف", styleBlur:"ضبابي",
    projectNamePrompt:"أدخل اسماً للمشروع:", defaultProjectName:"مشروع غير مسمى",
    savedDashboard:"مشاريعك المحفوظة", viewAll:" عدد مشاريعك", noSaved:"لا توجد مشاريع محفوظة.",
    continueBtn:"متابعة واختيار صورة", backBtn:"رجوع للقائمة",
    projMenuEdit:"تعديل المشروع", projMenuDelete:"حذف المشروع", projMenuCancel:"إلغاء",
    deleteConfirm:"تم الحذف",
    cropBtn:"قص الصورة", cropTitle:"اقتصاص الصورة", cropApply:"اعتماد القص",
    Email:":ايميل التواصل" , Twetter:":تويتر او (اكس)" , Instagram:":انستقرام" , contact:":للتواصل او الابلاغ",
    telgram:":قروب التيليجرام", 
  },
  en: {
    title:"QuickPanel Editor", desc:"Designed to crop and arrange your images to perfectly match the Quick Panel",
    uploadReady:"Image ready — Start editing", uploadPrompt:"Tap to start a new project",
    editOn:"Done Editing", editOff:"Edit Layout", undo:"Undo",
    hint:"Hold to drag items — Drag corner to resize",
    exportBtn:"Download All as ZIP", exporting:"Processing...",
    exportWarn:"Close Edit Mode to Export",
    tabHome:"Home", tabSettings:"Settings", settings:"Settings",
    lang:"Language", themeMode:"Theme", dark:"Dark", light:"Light",
    devCredit:"Developed by: Ibrahim (Brody)", rights:"All rights reserved ©Ibrahim AL-adwani 2026",
    modalTitle:"Edit Button", searchIcon:"Search icon...", chooseIcon:"Choose icon:",
    noIcon:"No icon", noResult:"No results", labelOpt:"Label (optional):",
    labelEx:"e.g. Wi-Fi", saveBtn:"Save Changes", cancelBtn:"Cancel",
    toastSaved:"Saved!", toastExport:"Download started!", toastFail:"Export failed: ",
    styleTrans:"Clear", styleBlur:"Blurred",
    projectNamePrompt:"Enter a project name:", defaultProjectName:"Untitled Project",
    savedDashboard:"Saved Projects", viewAll:"Number of projects", noSaved:"No saved projects.",
    continueBtn:"Continue & Pick Image", backBtn:"Back to Home",
    projMenuEdit:"Edit Project", projMenuDelete:"Delete Project", projMenuCancel:"Cancel",
    deleteConfirm:"Deleted",
    cropBtn:"Crop Image", cropTitle:"Crop Image", cropApply:"Apply Crop",
    Email:"Contact Email:" , Twetter:"Twitter or (X):" , Instagram:"Instagram:" , contact:"For contact or reporting:",
    telgram:"Telegram Group:",
  },
};

// ── دالة حل التداخل بين الكبسولات — تشتغل كل ما يتحرك عنصر ─────────────────
// تمشي على كل زوج من العناصر وإذا تداخلوا تحرك الأخف لتحت
function resolveCollisions(layout, activeId) {
  const lay = layout.map((i) => ({ ...i }));
  let changed = true, guard = 0;
  while (changed && guard++ < 40) {
    changed = false;
    for (let i = 0; i < lay.length; i++) {
      for (let j = 0; j < lay.length; j++) {
        if (i === j) continue;
        const a = lay[i], b = lay[j];
        const overlap =
          a.col < b.col + b.colSpan && a.col + a.colSpan > b.col &&
          a.row < b.row + b.rowSpan && a.row + a.rowSpan > b.row;
        if (overlap) {
          let mover, pivot;
          if (a.id === activeId)       { mover = b; pivot = a; }
          else if (b.id === activeId)  { mover = a; pivot = b; }
          else if (a.row > b.row)      { mover = a; pivot = b; }
          else if (b.row > a.row)      { mover = b; pivot = a; }
          else { mover = a.id > b.id ? a : b; pivot = a.id > b.id ? b : a; }
          const newRow = pivot.row + pivot.rowSpan;
          if (mover.row !== newRow) { mover.row = newRow; changed = true; }
        }
      }
    }
  }
  return lay;
}

// ── دوال حساب حجم الشبكة الكلي ──────────────────────────────────────────────
const getMaxRow = (layout) => layout.reduce((m, i) => Math.max(m, i.row + i.rowSpan - 1), 1);
const calcSize  = (layout) => {
  const maxRow = getMaxRow(layout);
  return { totalW: COLS * CELL_EX + (COLS + 1) * GAP_EX, totalH: maxRow * CELL_EX + (maxRow + 1) * GAP_EX, maxRow };
};

// ── تحميل صورة الأيقونة من المجلد المحلي — ترجع Promise بالصورة ──────────────
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

// ── تصغير الصورة عند الرفع إذا كانت أكبر من 2400 بكسل — يخفف الثقل ──────────
function resizeImageIfNeeded(dataUrl, maxSize = 2400) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      if (img.width <= maxSize && img.height <= maxSize) {
        resolve(dataUrl);
        return;
      }
      const scale = maxSize / Math.max(img.width, img.height);
      const canvas = document.createElement("canvas");
      canvas.width  = Math.round(img.width  * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.92));
    };
    img.src = dataUrl;
  });
}

// ── رسم كبسولة واحدة على Canvas جاهز للتصدير — يرجع canvas element ──────────
async function renderItemCanvas(item, bgImg, totalW, totalH, visualStyle) {
  const SCALE = 3; // دقة التصدير — 3x للحصول على صورة واضحة
  const x = GAP_EX + (item.col - 1) * (CELL_EX + GAP_EX);
  const y = GAP_EX + (item.row - 1) * (CELL_EX + GAP_EX);
  const w = item.colSpan * CELL_EX + (item.colSpan - 1) * GAP_EX;
  const h = item.rowSpan * CELL_EX + (item.rowSpan - 1) * GAP_EX;

  const cv = document.createElement("canvas");
  cv.width = w * SCALE; cv.height = h * SCALE;
  const ctx = cv.getContext("2d");
  ctx.scale(SCALE, SCALE);

  // تحديد شكل الكبسولة — دائرة أو حبة دواء أو مربع
  const isCircle = item.colSpan === 1 && item.rowSpan === 1;
  const isPill   = (item.colSpan >= 2 && item.rowSpan === 1) || (item.colSpan === 1 && item.rowSpan >= 2);
  const radius   = isCircle ? w / 2 : isPill ? Math.min(w, h) / 2 : 22;

  ctx.save();
  ctx.beginPath();
  if (isCircle) ctx.arc(w / 2, h / 2, w / 2, 0, Math.PI * 2);
  else ctx.roundRect(0, 0, w, h, radius);
  ctx.clip();

  if (visualStyle === "blurred") ctx.filter = "blur(15px)";

  // قص الجزء الصح من الصورة الخلفية حسب موضع الكبسولة
  const ir = bgImg.width / bgImg.height, pr = totalW / totalH;
  let dw = bgImg.width, dh = bgImg.height, ox = 0, oy = 0;
  if (ir > pr) { dw = bgImg.height * pr; ox = (bgImg.width - dw) / 2; }
  else         { dh = bgImg.width / pr;  oy = (bgImg.height - dh) / 2; }
  const sx = dw / totalW, sy = dh / totalH;
  const offset = visualStyle === "blurred" ? 15 : 0;
  ctx.drawImage(bgImg, ox + x * sx, oy + y * sy, w * sx, h * sy, -offset, -offset, w + offset * 2, h + offset * 2);
  ctx.filter = "none";

  // إضافة طبقة شفافية فوق الصورة حسب النمط المختار
  if (visualStyle === "blurred") {
    ctx.fillStyle = "rgba(22,20,18,0.50)"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(0,0,0,0.12)";   ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1; ctx.stroke();
  } else {
    ctx.fillStyle = "rgba(15,12,10,0.21)"; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = "rgba(255,255,255,0.11)"; ctx.lineWidth = 2; ctx.stroke();
  }

  const iconImg = item.icon ? await loadIconImage(item.icon) : null;
  const setShadow = () => { ctx.shadowColor = "rgba(0,0,0,0.85)"; ctx.shadowBlur = 7; };

  // رسم الأيقونة والنص حسب نوع الكبسولة
  if (item.colSpan >= 2 && item.rowSpan >= 2) {
    const s = w * 0.25, cx = w / 2, cy = h / 2;
    if (iconImg) { const iy = item.label ? cy - s / 2 - 10 : cy - s / 2; ctx.drawImage(iconImg, cx - s / 2, iy, s, s); }
    if (item.label) { setShadow(); ctx.font = "600 16px 'Segoe UI',sans-serif"; ctx.fillStyle = "white"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(item.label, cx, iconImg ? cy + s / 2 + 12 : cy); }
  } else if (item.colSpan >= 2 && item.rowSpan === 1) {
    const bs = h * 0.72, circleX = w - bs - h * 0.14, circleY = (h - bs) / 2;
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.arc(circleX + bs / 2, circleY + bs / 2, bs / 2, 0, Math.PI * 2); ctx.fill();
    if (iconImg) ctx.drawImage(iconImg, circleX + bs * 0.2, circleY + bs * 0.2, bs * 0.6, bs * 0.6);
    if (item.label) { setShadow(); ctx.font = "600 16px 'Segoe UI',sans-serif"; ctx.fillStyle = "white"; ctx.textAlign = "right"; ctx.textBaseline = "middle"; ctx.fillText(item.label, w - bs - h * 0.14 - 10, h / 2); }
  } else if (isCircle && iconImg) {
    const d = w * 0.46; ctx.drawImage(iconImg, (w - d) / 2, (h - d) / 2, d, d);
  } else if (item.colSpan === 1 && item.rowSpan >= 2 && iconImg) {
    const bs = w * 0.72, ix = (w - bs) / 2;
    const iy = item.iconPos === "top" ? w * 0.1 : (h - bs) / 2;
    ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.arc(ix + bs / 2, iy + bs / 2, bs / 2, 0, Math.PI * 2); ctx.fill();
    ctx.drawImage(iconImg, ix + bs * 0.2, iy + bs * 0.2, bs * 0.6, bs * 0.6);
  }
  ctx.restore();

  // إضافة حد أبيض للكبسولات الشفافة
  if (visualStyle === "transparent") {
    ctx.save(); ctx.beginPath();
    if (isCircle) ctx.arc(w / 2, h / 2, w / 2 - 1.5, 0, Math.PI * 2);
    else ctx.roundRect(1.5, 1.5, w - 3, h - 3, radius);
    ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 2; ctx.stroke(); ctx.restore();
  }
  return cv;
}

// ── تصدير كل الكبسولات داخل ملف ZIP واحد ────────────────────────────────────
async function exportAllAsZip(layout, bgImg, visualStyle) {
  let JSZip;
  try { JSZip = (await import("jszip")).default; }
  catch { throw new Error("JSZip unavailable"); }
  const { totalW, totalH } = calcSize(layout);
  const zip = new JSZip();
  for (const item of layout) {
    const cv  = await renderItemCanvas(item, bgImg, totalW, totalH, visualStyle);
    const b64 = cv.toDataURL("image/png").replace(/^data:image\/png;base64,/, "");
    const name = item.label ? `btn-${item.label}.png` : `btn-id-${item.id}.png`;
    zip.file(name, b64, { base64: true });
  }
  const b64zip = await zip.generateAsync({ type: "base64" });
  // محاولة استخدام Capacitor للحفظ على الجهاز — يشتغل فقط داخل APK
  try {
    const { Filesystem, Directory } = await import("@capacitor/filesystem");
    const { Share } = await import("@capacitor/share");
    await Filesystem.writeFile({ path: "QuickPanel-Widgets.zip", data: b64zip, directory: Directory.Cache });
    const fileUri = await Filesystem.getUri({ path: "QuickPanel-Widgets.zip", directory: Directory.Cache });
    await Share.share({ title: "QuickPanel Widgets", url: fileUri.uri, dialogTitle: "Save ZIP" });
    return;
  } catch (_) {}
  // fallback للمتصفح العادي إذا ما كان Capacitor موجود
  const byteChars = atob(b64zip), bytes = new Uint8Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) bytes[i] = byteChars.charCodeAt(i);
  const blob = new Blob([bytes], { type: "application/zip" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "QuickPanel-Widgets.zip";
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 3000);
}

// ── محتوى الكبسولة — يعرض الأيقونة والنص حسب شكلها ─────────────────────────
function ItemContent({ item, visualStyle }) {
  const isCircle = item.colSpan === 1 && item.rowSpan === 1;
  const isWide   = item.colSpan >= 2  && item.rowSpan === 1;
  const isSquare = item.colSpan >= 2  && item.rowSpan >= 2;
  const isTall   = item.colSpan === 1 && item.rowSpan >= 2;

  const dropShadow = visualStyle === "transparent" ? "drop-shadow(0px 2px 5px rgba(0,0,0,0.9))" : "none";
  const textShadow = visualStyle === "transparent" ? "0 2px 5px rgba(0,0,0,0.9)" : "none";

  if (isSquare) return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:8, padding:10, pointerEvents:"none" }}>
      {item.icon && <img src={`/icons/${item.icon}`} width={40} height={40} style={{ objectFit:"contain", filter:dropShadow }} alt="" />}
      {item.label && <span style={{ color:"white", fontSize:13, fontWeight:600, textAlign:"center", textShadow }}>{item.label}</span>}
    </div>
  );

  if (isWide) return (
    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", padding:"0 10px", gap:8, pointerEvents:"none" }}>
      <div style={{ width:36, height:36, borderRadius:"50%", background:visualStyle==="transparent"?"rgba(0,0,0,0.25)":"rgba(255,255,255,0.14)", flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
        {item.icon && <img src={`/icons/${item.icon}`} width={20} height={20} style={{ objectFit:"contain" }} alt="" />}
      </div>
      {item.label && <span style={{ color:"white", fontSize:13, fontWeight:600, flex:1, textAlign:"right", textShadow }}>{item.label}</span>}
    </div>
  );

  if (isCircle) return (
    <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
      {item.icon && <img src={`/icons/${item.icon}`} width={30} height={30} style={{ objectFit:"contain", filter:dropShadow }} alt="" />}
    </div>
  );

  if (isTall && item.icon) return (
    <div style={{ position:"absolute", top:item.iconPos==="top"?8:"50%", left:"50%",
      transform:item.iconPos==="top"?"translateX(-50%)":"translate(-50%,-50%)",
      width:38, height:38, borderRadius:"50%",
      background:visualStyle==="transparent"?"rgba(0,0,0,0.25)":"rgba(255,255,255,0.14)",
      display:"flex", alignItems:"center", justifyContent:"center", pointerEvents:"none" }}>
      <img src={`/icons/${item.icon}`} width={22} height={22} style={{ objectFit:"contain" }} alt="" />
    </div>
  );
  return null;
}

// ── شاشة اقتصاص الصورة — تدعم السحب بإصبع والتكبير بإصبعين ─────────────────
function ImageCropper({ imgData, targetRatio, onCrop, onCancel, t, th, lang }) {
  const scaleRef        = useRef(1);
  const committedPosRef = useRef({ x: 0, y: 0 });
  const dragRef         = useRef(null);
  const pinchRef        = useRef(null);
  const rafRef          = useRef(null);
  const imgRef          = useRef(null);
  const containerRef    = useRef(null);
  const areaRef         = useRef(null);
  const [scaleDisplay, setScaleDisplay] = useState(1);
  const isRtl = lang === "ar";

  // تطبيق التحويل على الصورة مباشرة عبر الـ ref بدون re-render
  const applyTransform = useCallback(() => {
    if (!imgRef.current) return;
    const px = dragRef.current ? dragRef.current.currentX : committedPosRef.current.x;
    const py = dragRef.current ? dragRef.current.currentY : committedPosRef.current.y;
    imgRef.current.style.transform =
      `translate(calc(-50% + ${px}px), calc(-50% + ${py}px)) scale(${scaleRef.current})`;
  }, []);

  // جدولة التحديث في requestAnimationFrame لأداء أفضل
  const scheduleRaf = useCallback(() => {
    if (!rafRef.current) {
      rafRef.current = requestAnimationFrame(() => {
        applyTransform();
        rafRef.current = null;
      });
    }
  }, [applyTransform]);

  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      dragRef.current = {
        startClientX: e.touches[0].clientX,
        startClientY: e.touches[0].clientY,
        startPosX: committedPosRef.current.x,
        startPosY: committedPosRef.current.y,
        currentX: committedPosRef.current.x,
        currentY: committedPosRef.current.y,
      };
      pinchRef.current = null;
    } else if (e.touches.length === 2) {
      dragRef.current = null;
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      pinchRef.current = { startDist: Math.hypot(dx, dy), startScale: scaleRef.current };
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchRef.current) {
      const dx = e.touches[1].clientX - e.touches[0].clientX;
      const dy = e.touches[1].clientY - e.touches[0].clientY;
      const dist = Math.hypot(dx, dy);
      const newScale = Math.min(8, Math.max(0.5, pinchRef.current.startScale * (dist / pinchRef.current.startDist)));
      scaleRef.current = newScale;
      setScaleDisplay(newScale);
      scheduleRaf();
      return;
    }
    if (!dragRef.current || e.touches.length > 1) return;
    dragRef.current.currentX = dragRef.current.startPosX + (e.touches[0].clientX - dragRef.current.startClientX);
    dragRef.current.currentY = dragRef.current.startPosY + (e.touches[0].clientY - dragRef.current.startClientY);
    scheduleRaf();
  };

  const handleTouchEnd = () => {
    if (dragRef.current) {
      committedPosRef.current = { x: dragRef.current.currentX, y: dragRef.current.currentY };
      dragRef.current = null;
    }
    pinchRef.current = null;
  };

  const handleScaleChange = (e) => {
    scaleRef.current = parseFloat(e.target.value);
    setScaleDisplay(scaleRef.current);
    scheduleRaf();
  };

  // تطبيق القص الفعلي — يرسم الجزء المرئي داخل إطار القص على canvas ويرجعه
  const applyCrop = useCallback(() => {
    if (!containerRef.current || !imgRef.current) return;

    const cropRect = containerRef.current.getBoundingClientRect();
    const imgRect  = imgRef.current.getBoundingClientRect();

    const pr = Math.min(window.devicePixelRatio || 2, 3);
    const canvas = document.createElement("canvas");
    canvas.width  = Math.round(cropRect.width  * pr);
    canvas.height = Math.round(cropRect.height * pr);
    const ctx = canvas.getContext("2d");
    ctx.scale(pr, pr);

    const tempImg = new Image();
    tempImg.onload = () => {
      ctx.fillStyle = "#0a0a0a";
      ctx.fillRect(0, 0, cropRect.width, cropRect.height);

      const offsetX = imgRect.left - cropRect.left;
      const offsetY = imgRect.top  - cropRect.top;
      const ratio = tempImg.naturalWidth / imgRect.width;

      const sx = Math.max(0, -offsetX * ratio);
      const sy = Math.max(0, -offsetY * ratio);
      const sw = Math.min(cropRect.width  * ratio, tempImg.naturalWidth  - sx);
      const sh = Math.min(cropRect.height * ratio, tempImg.naturalHeight - sy);

      const dx = offsetX > 0 ? offsetX : 0;
      const dy = offsetY > 0 ? offsetY : 0;
      const dw = sw / ratio;
      const dh = sh / ratio;

      if (sw > 0 && sh > 0) {
        ctx.drawImage(tempImg, sx, sy, sw, sh, dx, dy, dw, dh);
      }

      onCrop(canvas.toDataURL("image/jpeg", 0.93));
    };
    tempImg.src = imgData;
  }, [imgData, onCrop]);

  return (
    <div style={{ position:"fixed", inset:0, zIndex:9999, display:"flex", flexDirection:"column", background:"linear-gradient(180deg,#0f1115 0%,#161a22 100%)" }}>
      <div style={{ padding:"10px 20px", display:"flex", justifyContent:"space-between", alignItems:"center", flexDirection:isRtl ? "row-reverse" : "row", background:"rgba(20,22,28,0.78)", backdropFilter:"blur(24px)", WebkitBackdropFilter:"blur(24px)", borderBottom:"1px solid rgba(255,255,255,0.06)", flexShrink:0 }}>
        <button onClick={onCancel} style={{ background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", color:"#fff", fontSize:13, fontWeight:600, padding:"10px 18px", borderRadius:999, cursor:"pointer", backdropFilter:"blur(10px)" }}>
          {t.cancelBtn}
        </button>
        <h3 style={{ margin:0, fontSize:18, fontWeight:700, color:"#fff", letterSpacing:"0.2px" }}>
          {t.cropTitle}
        </h3>
        <button onClick={applyCrop} style={{ background:th.accent, border:"none", color:"#000000", fontSize:15, fontWeight:700, padding:"10px 50px", minWidth:90, borderRadius:999, cursor:"pointer", transition:"all .2s ease", boxShadow:`0 6px 20px ${th.accentGlow}` }}>
          {t.cropApply}
        </button>
      </div>

      {/* منطقة السحب والتكبير */}
      <div ref={areaRef} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ flex:1, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", touchAction:"none" }}>
        <img ref={imgRef} src={imgData} alt="" draggable={false} style={{ position:"absolute", left:"50%", top:"50%", transform:"translate(-50%, -50%) scale(1)", maxWidth:"100%", maxHeight:"100%", width:"auto", height:"auto", transformOrigin:"center center", willChange:"transform", userSelect:"none", WebkitUserSelect:"none", pointerEvents:"none" }} />

        {/* إطار القص مع خطوط الشبكة وأركان ملونة */}
        <div ref={containerRef} style={{ position:"relative", width:"100%", maxWidth:"400px", maxHeight:"70vh", aspectRatio:String(targetRatio), pointerEvents:"none", zIndex:2, borderRadius:18, overflow:"hidden", boxShadow:"0 0 0 9999px rgba(0,0,0,0.72)" }}>
          <div style={{ position:"absolute", inset:0, border:"1px solid rgba(255,255,255,0.12)", borderRadius:18 }} />
          <div style={{ position:"absolute", top:0, left:0, width:38, height:38, borderTop:`3px solid ${th.accent}`, borderLeft:`3px solid ${th.accent}`, borderRadius:"18px 0 0 0", filter:`drop-shadow(0 0 8px ${th.accent})` }}/>
          <div style={{ position:"absolute", top:0, right:0, width:38, height:38, borderTop:`3px solid ${th.accent}`, borderRight:`3px solid ${th.accent}`, borderRadius:"0 18px 0 0", filter:`drop-shadow(0 0 8px ${th.accent})` }}/>
          <div style={{ position:"absolute", bottom:0, left:0, width:38, height:38, borderBottom:`3px solid ${th.accent}`, borderLeft:`3px solid ${th.accent}`, borderRadius:"0 0 0 18px", filter:`drop-shadow(0 0 8px ${th.accent})` }}/>
          <div style={{ position:"absolute", bottom:0, right:0, width:38, height:38, borderBottom:`3px solid ${th.accent}`, borderRight:`3px solid ${th.accent}`, borderRadius:"0 0 18px 0", filter:`drop-shadow(0 0 8px ${th.accent})` }}/>
          <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", justifyContent:"space-evenly" }}>
            <div style={{ height:1, background:"rgba(255,255,255,0.15)" }} />
            <div style={{ height:1, background:"rgba(255,255,255,0.15)" }} />
          </div>
          <div style={{ position:"absolute", inset:0, display:"flex", justifyContent:"space-evenly" }}>
            <div style={{ width:1, background:"rgba(255,255,255,0.15)" }} />
            <div style={{ width:1, background:"rgba(255,255,255,0.15)" }} />
          </div>
        </div>
      </div>

      {/* شريط التحكم بالتكبير */}
      <div style={{ padding:"18px 24px 30px", background:"rgba(20,22,28,0.82)", backdropFilter:"blur(30px)", WebkitBackdropFilter:"blur(30px)", borderTop:"1px solid rgba(255,255,255,0.06)", display:"flex", flexDirection:"column", gap:14, flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:14, flexDirection:isRtl ? "row-reverse" : "row" }}>
          <span style={{ background:"rgba(255,255,255,0.08)", color:"#fff", padding:"6px 10px", borderRadius:999, fontSize:12, fontWeight:700, minWidth:58, textAlign:"center" }}>
            {Math.round(scaleDisplay * 100)}%
          </span>
          <span style={{ color:"rgba(255,255,255,0.5)", fontSize:18, fontWeight:700 }}>−</span>
          <input type="range" min="0.5" max="8" step="0.01" defaultValue="1" onChange={handleScaleChange} style={{ flex:1, accentColor:th.accent, cursor:"pointer" }} />
          <span style={{ color:"rgba(255,255,255,0.8)", fontSize:18, fontWeight:700 }}>+</span>
        </div>
        <div style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:"10px 14px" }}>
          <p style={{ margin:0, textAlign:"center", fontSize:13, color:"rgba(255,255,255,0.72)", direction:isRtl ? "rtl" : "ltr" }}>
            {isRtl ? "اسحب الصورة بإصبع واحد واستخدم إصبعين للتكبير أو التصغير" : "Drag with one finger and use two fingers to zoom"}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── مودال تعديل الكبسولة — اختيار الأيقونة وتغيير النص ─────────────────────
function ConfigModal({ item, onSave, onClose, t, th, lang }) {
  const [cfg, setCfg]               = useState({ ...item });
  const [search, setSearch]         = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [mounted, setMounted]       = useState(false);
  const searchRef = useRef(null);
  const isRtl = lang === "ar";

  useEffect(() => { setCfg({ ...item }); }, [item?.id]);
  useEffect(() => { if (showSearch) searchRef.current?.focus(); }, [showSearch]);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);

  const filtered = ICONS.filter(ic => iconLabel(ic).toLowerCase().includes(search.toLowerCase()));

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0,
        background: mounted ? "rgba(0,0,0,0.72)" : "rgba(0,0,0,0)",
        backdropFilter: mounted ? "blur(12px)" : "blur(0px)",
        display:"flex", justifyContent:"center", alignItems:"flex-end", zIndex:9000,
        paddingBottom:"env(safe-area-inset-bottom,0px)",
        transition:"background 0.3s ease, backdrop-filter 0.3s ease" }}>
      <div style={{ background:th.modalBg, backdropFilter:"blur(28px) saturate(1.4)",
        WebkitBackdropFilter:"blur(28px) saturate(1.4)",
        width:"100%", maxWidth:480, borderRadius:"28px 28px 0 0",
        padding:"16px 18px 28px", border:`1px solid ${th.borderHover}`, borderBottom:"none",
        boxShadow:`0 -24px 60px rgba(0,0,0,0.6), 0 -4px 30px ${th.modalGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        transform: mounted ? "translateY(0)" : "translateY(100%)",
        transition:"transform 0.38s cubic-bezier(0.16,1,0.3,1)",
        maxHeight:"82vh", display:"flex", flexDirection:"column", direction: isRtl ? "rtl" : "ltr" }}>

        <div style={{ width:44, height:5, background:`linear-gradient(90deg,transparent,${th.accent}80,transparent)`, borderRadius:3, margin:"0 auto 16px" }}/>

        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
          <h2 style={{ margin:0, fontSize:17, fontWeight:700, color:th.text, display:"flex", alignItems:"center", gap:8 }}>
            <SVGIcons.Edit /> {t.modalTitle}
          </h2>
          <div style={{ display:"flex", alignItems:"center", gap:6, background:showSearch?th.border:"transparent", borderRadius:20, padding:"5px 10px", transition:"all .25s" }}>
            <span onClick={() => { setShowSearch(s => !s); if (showSearch) setSearch(""); }}
              style={{ cursor:"pointer", color:th.text, display:"flex" }}><SVGIcons.Search /></span>
            <input ref={searchRef} type="text" placeholder={t.searchIcon} value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width:showSearch?130:0, opacity:showSearch?1:0, background:"transparent", border:"none",
                color:th.text, outline:"none", fontSize:13, transition:"width .25s,opacity .25s",
                pointerEvents:showSearch?"auto":"none" }}/>
          </div>
        </div>

        <p style={{ color:th.textMuted, fontSize:12, margin:"0 0 8px" }}>{t.chooseIcon}</p>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:6, overflowY:"auto", flex:1, paddingBottom:4 }}>
          <div onClick={() => setCfg(c => ({ ...c, icon:"" }))}
            style={{ background:!cfg.icon?th.accentGlow:"transparent",
              border:`1px solid ${!cfg.icon?th.accent:th.border}`,
              borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", gap:8, cursor:"pointer", transition:"all 0.2s ease" }}>
            <div style={{ width:22, height:22, borderRadius:"50%", background:th.border, flexShrink:0 }}/>
            <span style={{ fontSize:12, color:th.text }}>{t.noIcon}</span>
          </div>
          {filtered.map(ic => (
            <div key={ic} onClick={() => setCfg(c => ({ ...c, icon:ic }))}
              style={{ background:cfg.icon===ic?th.accentGlow:"transparent",
                border:`1px solid ${cfg.icon===ic?th.accent:th.border}`,
                borderRadius:10, padding:"10px 12px", display:"flex", alignItems:"center", gap:8, cursor:"pointer", transition:"all 0.2s ease" }}>
              <img src={`/icons/${ic}`} width={22} height={22} style={{ objectFit:"contain", flexShrink:0 }} alt=""/>
              <span style={{ fontSize:12, color:th.text, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{iconLabel(ic)}</span>
            </div>
          ))}
          {filtered.length === 0 && <div style={{ gridColumn:"1/3", textAlign:"center", color:th.textMuted, padding:"20px 0", fontSize:12 }}>{t.noResult}</div>}
        </div>

        <div style={{ marginTop:14 }}>
          <p style={{ color:th.textMuted, fontSize:12, margin:"0 0 8px" }}>{t.labelOpt}</p>
          <input type="text" value={cfg.label || ""} onChange={e => setCfg(c => ({ ...c, label:e.target.value }))}
            style={{ width:"100%", boxSizing:"border-box", padding:"11px 14px",
              background:"rgba(255,255,255,0.04)", color:th.text,
              border:`1px solid ${th.border}`, borderRadius:12, outline:"none", fontSize:14, transition:"border-color 0.2s ease" }}
            onFocus={e => e.target.style.borderColor = th.accent}
            onBlur={e  => e.target.style.borderColor = th.border}
            placeholder={t.labelEx}/>
        </div>

        <div style={{ display:"flex", gap:10, marginTop:18 }}>
          <button onClick={() => onSave(cfg)}
            style={{ flex:2, padding:13, background:th.accent, color:"white", border:"none", borderRadius:14,
              fontWeight:700, fontSize:14, cursor:"pointer", display:"flex", justifyContent:"center", alignItems:"center", gap:6,
              boxShadow:`0 4px 16px ${th.accentGlow}`, transition:"transform 0.15s ease" }}
            onTouchStart={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onTouchEnd={e   => { e.currentTarget.style.transform = "scale(1)"; }}>
            <SVGIcons.Check /> {t.saveBtn}
          </button>
          <button onClick={onClose}
            style={{ flex:1, padding:13, background:"transparent", color:th.text,
              border:`1px solid ${th.border}`, borderRadius:14, fontSize:14, cursor:"pointer", transition:"border-color 0.2s ease" }}
            onMouseOver={e => { e.currentTarget.style.borderColor = th.borderHover; }}
            onMouseOut={e  => { e.currentTarget.style.borderColor = th.border; }}>
            {t.cancelBtn}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── قائمة خيارات المشروع المحفوظ — تعديل أو حذف ─────────────────────────────
function ProjectMenu({ proj, onEdit, onDelete, onClose, t, th, lang }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { requestAnimationFrame(() => setMounted(true)); }, []);
  const isRtl = lang === "ar";

  return (
    <div onClick={e => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0,
        background: mounted ? "rgba(0,0,0,0.65)" : "rgba(0,0,0,0)",
        backdropFilter: mounted ? "blur(10px)" : "blur(0px)",
        display:"flex", justifyContent:"center", alignItems:"flex-end", zIndex:9500,
        paddingBottom:"env(safe-area-inset-bottom,0px)",
        transition:"background 0.3s ease, backdrop-filter 0.3s ease" }}>
      <div style={{ background:th.modalBg, backdropFilter:"blur(28px) saturate(1.4)",
        WebkitBackdropFilter:"blur(28px) saturate(1.4)",
        width:"100%", maxWidth:480, borderRadius:"28px 28px 0 0",
        padding:"20px 18px 28px", border:`1px solid ${th.borderHover}`, borderBottom:"none",
        boxShadow:`0 -24px 60px rgba(0,0,0,0.6), 0 -4px 30px ${th.modalGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
        transform: mounted ? "translateY(0)" : "translateY(100%)",
        transition:"transform 0.38s cubic-bezier(0.16,1,0.3,1)",
        direction: isRtl ? "rtl" : "ltr" }}>
        <div style={{ width:44, height:5, background:`linear-gradient(90deg,transparent,${th.accent}80,transparent)`, borderRadius:3, margin:"0 auto 16px" }}/>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20, padding:"0 4px",
          flexDirection: isRtl ? "row-reverse" : "row" }}>
          <div style={{ width:52, height:72, borderRadius:10, overflow:"hidden", flexShrink:0,
            border:`1px solid ${th.border}`, boxShadow:"0 4px 12px rgba(0,0,0,0.3)" }}>
            <img src={proj.bg} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt=""/>
          </div>
          <span style={{ fontSize:15, fontWeight:700, color:th.text }}>{proj.name}</span>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          <button onClick={onEdit}
            style={{ width:"100%", padding:14, background:th.accent, color:"white", border:"none",
              borderRadius:14, fontWeight:700, fontSize:14, cursor:"pointer",
              display:"flex", justifyContent:"center", alignItems:"center", gap:8,
              boxShadow:`0 4px 16px ${th.accentGlow}`, transition:"transform 0.15s ease" }}
            onTouchStart={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onTouchEnd={e   => { e.currentTarget.style.transform = "scale(1)"; }}>
            <SVGIcons.Edit /> {t.projMenuEdit}
          </button>
          <button onClick={onDelete}
            style={{ width:"100%", padding:14, background:"rgba(231,76,60,0.12)",
              color:"#e74c3c", border:"1px solid rgba(231,76,60,0.25)",
              borderRadius:14, fontWeight:700, fontSize:14, cursor:"pointer",
              display:"flex", justifyContent:"center", alignItems:"center", gap:8,
              transition:"transform 0.15s ease" }}
            onTouchStart={e => { e.currentTarget.style.transform = "scale(0.97)"; }}
            onTouchEnd={e   => { e.currentTarget.style.transform = "scale(1)"; }}>
            <SVGIcons.Delete /> {t.projMenuDelete}
          </button>
          <button onClick={onClose}
            style={{ width:"100%", padding:14, background:"transparent", color:th.textMuted,
              border:`1px solid ${th.border}`, borderRadius:14, fontSize:14, cursor:"pointer", textAlign:"center" }}>
            {t.projMenuCancel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// الكومبوننت الرئيسي للتطبيق
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  // ── الـ States الرئيسية ──────────────────────────────────────────────────────
  const [activeTab,      setActiveTab]      = useState("home");
  const [lang,           setLang]           = useState("ar");
  const [themeMode,      setThemeMode]      = useState("dark");
  const [bg,             setBg]             = useState(null);
  const [bgImg,          setBgImg]          = useState(null);
  const [projectName,    setProjectName]    = useState("");
  const [layout,         setLayout]         = useState(INITIAL_LAYOUT);
  const [visualStyle,    setVisualStyle]    = useState("blurred");
  const [editMode,       setEditMode]       = useState(false);
  const [modalItem,      setModalItem]      = useState(null);
  const [showProjModal,  setShowProjModal]  = useState(false);
  const [history,        setHistory]        = useState([]);
  const [generating,     setGenerating]     = useState(false);
  const [toast,          setToast]          = useState(null);
  const [projMenuTarget, setProjMenuTarget] = useState(null);
  const [pendingCropImg, setPendingCropImg] = useState(null);
  const [savedProjects,  setSavedProjects]  = useState([]);
  const [contentVisible, setContentVisible] = useState(true);
  const [dragging,       setDragging]       = useState(null);
  const [resizing,       setResizing]       = useState(null);
  const [longPressActive,setLongPressActive]= useState(null);

  // ── الـ Refs — قيم تتغير بدون ما تسبب re-render ──────────────────────────────
  const dragRef         = useRef(null);
  const resizeRef       = useRef(null);
  const longPressTimer  = useRef(null);
  const longPressStart  = useRef(null);
  const gridRef         = useRef(null);
  const fileRef         = useRef(null);
  const tempNameRef     = useRef("");

  // ── ref خاص لزر الرجوع — يحفظ آخر قيمة للـ states بدون ما يعيد تسجيل الـ listener ──
  const backStateRef = useRef({});
  useEffect(() => {
    backStateRef.current = {
      pendingCropImg,
      modalItem,
      projMenuTarget,
      showProjModal,
      bg,
      editMode,
      activeTab,
    };
  });

  const { totalW, totalH } = useMemo(() => calcSize(layout), [layout]);
  const t   = TEXTS[lang];
  const th  = THEMES[themeMode];
  const isRtl   = lang === "ar";
  const inProject = !!bg;

  // ── تحميل المشاريع المحفوظة من الذاكرة المحلية عند فتح التطبيق ──────────────
  useEffect(() => {
    (async () => {
      try {
        const v = await localforage.getItem("qp_pro_projects");
        if (v) setSavedProjects(v);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const saveProjectsToStorage = useCallback(async (projects) => {
    try { await localforage.setItem("qp_pro_projects", projects); }
    catch (e) { console.warn(e); }
  }, []);

  // ── حفظ تلقائي عند كل تغيير في الـ layout أو الصورة ─────────────────────────
  useEffect(() => {
    if (!bg || !projectName) return;
    setSavedProjects(prev => {
      const idx  = prev.findIndex(p => p.name === projectName);
      const proj = { name:projectName, layout, bg, visualStyle };
      const next = [...prev];
      if (idx > -1) next[idx] = proj; else next.unshift(proj);
      saveProjectsToStorage(next);
      return next;
    });
  }, [layout, bg, projectName, visualStyle, saveProjectsToStorage]);

  // ── زر الرجوع في الهاتف (Android Hardware Back Button) ─────────────────────
  useEffect(() => {
    let capacitorListener = null;
    let removePopState = null;

    // معالج موحد عشان إجراءات زر الرجوع يحدد وش سيتم إغلاقه/الرجوع 
    const processBackAction = () => {
      const s = backStateRef.current;
      let handled = true;

      if (s.pendingCropImg) {
        setPendingCropImg(null);
      } else if (s.modalItem) {
        setModalItem(null);
      } else if (s.projMenuTarget) {
        setProjMenuTarget(null);
      } else if (s.showProjModal) {
        setShowProjModal(false);
      } else if (s.bg && s.editMode) {
        setEditMode(false);
      } else if (s.bg) {
        setContentVisible(false);
        setTimeout(() => {
          setBg(null); setBgImg(null); setProjectName(""); setLayout(INITIAL_LAYOUT);
          setEditMode(false); setHistory([]);
          setContentVisible(true);
        }, 180);
      } else if (s.activeTab === "settings") {
        setContentVisible(false);
        setTimeout(() => {
          setActiveTab("home");
          setContentVisible(true);
        }, 180);
      } else {
        handled = false;
      }

      return handled;
    };

    const setupBackHandler = async () => {
      try {
        // محاولة استخدام إضافة Capacitor لمعالجة زر الرجوع بشكل أصلي ومباشر مع الاندرويد
        const { App } = await import("@capacitor/app");
        capacitorListener = await App.addListener("backButton", () => {
          const handled = processBackAction();
          // إذا لم يتم التقاط الحدث في التطبيق، نأمر التطبيق بالخروج
          if (!handled) {
            App.exitApp();
          }
        });
      } catch (e) {
        // إذا لم تكن الإضافة موجودة، نستخدم نظام History API المدمج مع حلول لمنع الـ Infinite Loop
        window.history.pushState({ qp_internal: true }, "");
        const handlePopState = () => {
          const handled = processBackAction();
          if (handled) {
            // دفع حالة جديدة للبقاء داخل التطبيق لالتقاط الضغطة القادمة لزر الرجوع
            window.history.pushState({ qp_internal: true }, "");
          }
        };
        window.addEventListener("popstate", handlePopState);
        removePopState = () => window.removeEventListener("popstate", handlePopState);
      }
    };

    setupBackHandler();

    return () => {
      if (capacitorListener) capacitorListener.remove();
      if (removePopState) removePopState();
    };
  }, []);

  const showToast = useCallback((msg, ms = 2200) => {
    setToast(msg);
    setTimeout(() => setToast(null), ms);
  }, []);

  // ── حفظ لقطة من الـ layout للـ undo ─────────────────────────────────────────
  const snapshot = useCallback(() => setHistory(h => [...h.slice(-29), layout]), [layout]);
  const undo = () => setHistory(h => {
    if (!h.length) return h;
    setLayout(h[h.length - 1]);
    return h.slice(0, -1);
  });

  // ── تبديل التبويب مع animation ───────────────────────────────────────────────
  const switchTab = useCallback((newTab) => {
    if (newTab === activeTab) return;
    setContentVisible(false);
    setTimeout(() => { setActiveTab(newTab); setContentVisible(true); }, 180);
  }, [activeTab]);

  // ── معالجة رفع الصورة من المعرض ─────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    if (showProjModal) {
      const name = tempNameRef.current.trim() || t.defaultProjectName;
      setProjectName(name);
      setLayout(INITIAL_LAYOUT);
      setShowProjModal(false);
    }
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const resized = await resizeImageIfNeeded(ev.target.result);
      setPendingCropImg(resized);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  // ── بعد اعتماد القص — ينتظر اكتمال تحميل الصورة قبل عرضها ──────────────────
  const handleCropComplete = useCallback((croppedDataUrl) => {
    const img = new Image();
    img.onload = () => {
      setBgImg(img);
      setBg(croppedDataUrl);
      setPendingCropImg(null);
      showToast(t.uploadReady);
    };
    img.onerror = () => {
      setPendingCropImg(null);
      showToast("فشل تحميل الصورة، حاول مرة أخرى");
    };
    img.src = croppedDataUrl;
  }, [showToast, t.uploadReady]);

  // ── الرجوع للقائمة الرئيسية مع تصفير البيانات ───────────────────────────────
  const handleBack = () => {
    setContentVisible(false);
    setTimeout(() => {
      setBg(null); setBgImg(null); setProjectName(""); setLayout(INITIAL_LAYOUT);
      setEditMode(false); setHistory([]);
      setContentVisible(true);
    }, 180);
  };

  // ── تحميل مشروع محفوظ من القائمة ────────────────────────────────────────────
  const loadSavedProject = (proj) => {
    setProjectName(proj.name); setBg(proj.bg); setLayout(proj.layout);
    setVisualStyle(proj.visualStyle || "blurred");
    const img = new Image();
    img.onload = () => setBgImg(img);
    img.src = proj.bg;
    showToast(proj.name);
    setProjMenuTarget(null);
  };

  // ── حذف مشروع محفوظ ──────────────────────────────────────────────────────────
  const deleteProject = (projName) => {
    setSavedProjects(prev => {
      const next = prev.filter(p => p.name !== projName);
      saveProjectsToStorage(next);
      return next;
    });
    setProjMenuTarget(null);
    showToast(t.deleteConfirm);
  };

  // ── حساب حجم خطوة واحدة في الشبكة بالبكسل — يُستخدم في السحب والتكبير ───────
  const getStride = useCallback(() => {
    if (!gridRef.current) return 1;
    return (gridRef.current.getBoundingClientRect().width / totalW) * (CELL_EX + GAP_EX);
  }, [totalW]);

  // ── إلغاء الضغط الطويل إذا تحرك الإصبع قبل الوقت المحدد ────────────────────
  const cancelLongPress = useCallback(() => {
    if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; }
    longPressStart.current = null;
    setLongPressActive(null);
  }, []);

  // ── بداية لمس الكبسولة — ينتظر الضغط الطويل لبدء السحب ──────────────────────
  const onItemTouchStart = useCallback((e, item) => {
    if (!editMode || resizeRef.current || dragRef.current) return;
    if (e.target.closest("[data-edit-control]")) return;
    const touch = e.touches[0];
    longPressStart.current = { x:touch.clientX, y:touch.clientY, item, layout };
    setLongPressActive(item.id);
    longPressTimer.current = setTimeout(() => {
      if (!longPressStart.current) return;
      if (navigator.vibrate) navigator.vibrate([30]);
      const st = longPressStart.current;
      dragRef.current = {
        id:st.item.id, startX:st.x, startY:st.y,
        origCol:st.item.col, origRow:st.item.row, origColSpan:st.item.colSpan,
        currentCol:st.item.col, currentRow:st.item.row, startLayout:st.layout,
      };
      snapshot();
      setDragging(st.item.id);
      setLongPressActive(null);
      longPressStart.current = null;
    }, LONG_PRESS_MS);
  }, [editMode, snapshot]);

  // ── تحريك الإصبع — يحدث موضع الكبسولة أو حجمها ─────────────────────────────
  const onItemTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    if (longPressStart.current && !dragRef.current) {
      const dx = touch.clientX - longPressStart.current.x;
      const dy = touch.clientY - longPressStart.current.y;
      if (Math.abs(dx) > LONG_PRESS_MOVE || Math.abs(dy) > LONG_PRESS_MOVE) cancelLongPress();
      return;
    }
    const dr = dragRef.current, rr = resizeRef.current;
    if (!dr && !rr) return;
    if (e.cancelable) e.preventDefault();
    const stride = getStride();
    if (dr) {
      const dx = touch.clientX - dr.startX, dy = touch.clientY - dr.startY;
      const newCol = Math.max(1, Math.min(COLS - dr.origColSpan + 1, dr.origCol + Math.round(dx / stride)));
      const newRow = Math.max(1, dr.origRow + Math.round(dy / stride));
      if (newCol === dr.currentCol && newRow === dr.currentRow) return;
      dr.currentCol = newCol; dr.currentRow = newRow;
      setLayout(() => {
        const upd = dr.startLayout.map(i => i.id === dr.id ? { ...i, col:newCol, row:newRow } : { ...i });
        return resolveCollisions(upd, dr.id);
      });
    } else if (rr) {
      const dx = touch.clientX - rr.startX, dy = touch.clientY - rr.startY;
      const colDiff = Math.round(dx / stride), rowDiff = Math.round(dy / stride);
      if (colDiff === rr.colDiff && rowDiff === rr.rowDiff) return;
      rr.colDiff = colDiff; rr.rowDiff = rowDiff;
      setLayout(() => {
        const upd = rr.startLayout.map(item => {
          if (item.id !== rr.id) return { ...item };
          let cs = Math.max(1, rr.origCS + colDiff), rs = Math.max(1, rr.origRS + rowDiff);
          if (rr.origCol + cs - 1 > COLS) cs = COLS - rr.origCol + 1;
          return { ...item, colSpan:cs, rowSpan:rs };
        });
        return resolveCollisions(upd, rr.id);
      });
    }
  }, [getStride, cancelLongPress]);

  // ── رفع الإصبع — يوقف السحب أو التكبير ──────────────────────────────────────
  const onItemTouchEnd = useCallback(() => {
    cancelLongPress();
    if (dragRef.current)   { dragRef.current = null;   setDragging(null); }
    if (resizeRef.current) { resizeRef.current = null; setResizing(null); }
  }, [cancelLongPress]);

  // ── بدء تغيير حجم الكبسولة بالماوس أو اللمس ────────────────────────────────
  const onResizePointerDown = useCallback((e, item) => {
    e.stopPropagation(); e.preventDefault();
    snapshot();
    resizeRef.current = {
      id:item.id, startX:e.clientX, startY:e.clientY,
      origCS:item.colSpan, origRS:item.rowSpan, origCol:item.col,
      startLayout:layout, colDiff:0, rowDiff:0,
    };
    setResizing(item.id);
  }, [snapshot, layout]);

  // ── تسجيل أحداث اللمس على مستوى الـ window ──────────────────────────────────
  useEffect(() => {
    const opts = { passive: false };
    window.addEventListener("touchmove", onItemTouchMove, opts);
    window.addEventListener("touchend",  onItemTouchEnd);
    window.addEventListener("touchcancel", onItemTouchEnd);
    return () => {
      window.removeEventListener("touchmove", onItemTouchMove);
      window.removeEventListener("touchend",  onItemTouchEnd);
      window.removeEventListener("touchcancel", onItemTouchEnd);
    };
  }, [onItemTouchMove, onItemTouchEnd]);

  // ── تسجيل أحداث الماوس على مستوى الـ window — للتكبير بالسحب ────────────────
  useEffect(() => {
    const onMouseMove = (e) => {
      const rr = resizeRef.current; if (!rr) return;
      const stride   = getStride();
      const colDiff  = Math.round((e.clientX - rr.startX) / stride);
      const rowDiff  = Math.round((e.clientY - rr.startY) / stride);
      if (colDiff === rr.colDiff && rowDiff === rr.rowDiff) return;
      rr.colDiff = colDiff; rr.rowDiff = rowDiff;
      setLayout(() => {
        const upd = rr.startLayout.map(item => {
          if (item.id !== rr.id) return { ...item };
          let cs = Math.max(1, rr.origCS + colDiff), rs = Math.max(1, rr.origRS + rowDiff);
          if (rr.origCol + cs - 1 > COLS) cs = COLS - rr.origCol + 1;
          return { ...item, colSpan:cs, rowSpan:rs };
        });
        return resolveCollisions(upd, rr.id);
      });
    };
    const onMouseUp = () => { if (resizeRef.current) { resizeRef.current = null; setResizing(null); } };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
    return () => { window.removeEventListener("mousemove", onMouseMove); window.removeEventListener("mouseup", onMouseUp); };
  }, [getStride]);

  // ── تصدير الصور ZIP ──────────────────────────────────────────────────────────
  const handleExport = async () => {
    if (!bgImg || editMode || generating) return;
    setGenerating(true);
    try { await exportAllAsZip(layout, bgImg, visualStyle); showToast(t.toastExport); }
    catch (err) { showToast(t.toastFail + err.message); }
    setGenerating(false);
  };

  // ── حساب style الـ wrapper للكبسولة — الموضع والحجم والانيميشن ───────────────
  const wrapperStyle = useCallback((item) => {
    const isDragging  = item.id === dragging;
    const isResizing  = item.id === resizing;
    const isPending   = item.id === longPressActive;
    const isCircle = item.colSpan === 1 && item.rowSpan === 1;
    const isPill   = (item.colSpan >= 2 && item.rowSpan === 1) || (item.colSpan === 1 && item.rowSpan >= 2);
    const radius   = isCircle ? "50%" : isPill ? "9999px" : "22px";
    const leftPct  = ((GAP_EX + (item.col - 1) * (CELL_EX + GAP_EX)) / totalW) * 100;
    const topPct   = ((GAP_EX + (item.row - 1) * (CELL_EX + GAP_EX)) / totalH) * 100;
    const widthPct = ((item.colSpan * CELL_EX + (item.colSpan - 1) * GAP_EX) / totalW) * 100;
    const heightPct= ((item.rowSpan * CELL_EX + (item.rowSpan - 1) * GAP_EX) / totalH) * 100;
    const transitionVal = isDragging || isResizing
      ? isResizing
        ? "width 0.06s linear, height 0.06s linear, border-radius 0.2s ease"
        : "left 0.28s cubic-bezier(0.16,1,0.3,1), top 0.28s cubic-bezier(0.16,1,0.3,1), width 0.28s cubic-bezier(0.16,1,0.3,1), height 0.28s cubic-bezier(0.16,1,0.3,1), transform 0.15s ease"
      : "left 0.38s cubic-bezier(0.34,1.56,0.64,1), top 0.38s cubic-bezier(0.34,1.56,0.64,1), width 0.38s cubic-bezier(0.34,1.56,0.64,1), height 0.38s cubic-bezier(0.34,1.56,0.64,1), transform 0.15s ease";
    return {
      position:"absolute", left:`${leftPct}%`, top:`${topPct}%`,
      width:`${widthPct}%`, height:`${heightPct}%`,
      borderRadius:radius, display:"flex", alignItems:"center", justifyContent:"center",
      userSelect:"none", WebkitUserSelect:"none",
      cursor: editMode ? (isDragging ? "grabbing" : "grab") : "default",
      transform: isDragging ? "scale(1.07)" : isPending ? "scale(0.96)" : "scale(1)",
      zIndex: isDragging ? 20 : isResizing ? 15 : 1,
      transition: transitionVal,
      WebkitTapHighlightColor:"transparent",
      willChange: (isDragging || isResizing) ? "transform, width, height" : "auto",
    };
  }, [editMode, dragging, resizing, longPressActive, totalW, totalH]);

  // ── حساب style الجزء الداخلي للكبسولة — الخلفية الضبابية والحدود ────────────
  const innerStyle = useCallback((item) => {
    const isDragging = item.id === dragging, isResizing = item.id === resizing;
    const isCircle = item.colSpan === 1 && item.rowSpan === 1;
    const isPill   = (item.colSpan >= 2 && item.rowSpan === 1) || (item.colSpan === 1 && item.rowSpan >= 2);
    const radius   = isCircle ? "50%" : isPill ? "9999px" : "22px";
    return {
      position:"absolute", inset:0, borderRadius:radius, overflow:"hidden",
      background: visualStyle === "transparent"
        ? (isDragging ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.0)")
        : (isDragging ? "rgba(255,255,255,0.10)" : "rgba(22,20,18,0.50)"),
      backdropFilter:    visualStyle === "transparent" ? "none" : "blur(18px) saturate(1.2)",
      WebkitBackdropFilter: visualStyle === "transparent" ? "none" : "blur(18px) saturate(1.2)",
      border: editMode
        ? `2px solid ${isDragging ? th.accent : "rgba(255,255,255,0.5)"}`
        : visualStyle === "transparent" ? "1.5px solid rgba(255,255,255,0.45)" : "1px solid rgba(255,255,255,0.07)",
      boxShadow: isDragging ? `0 14px 40px rgba(0,0,0,0.55), 0 0 0 3px ${th.accent}4D` : isResizing ? "0 8px 28px rgba(0,0,0,0.45)" : "none",
      transition: isDragging ? "box-shadow .12s" : "border-radius .28s, background .2s, border .2s",
    };
  }, [editMode, dragging, resizing, th, visualStyle]);

  // ─────────────────────────────────────────────────────────────────────────────
  // الـ JSX — هيكل التطبيق الكامل
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100dvh", background:th.bg, color:th.text,
      fontFamily:"'Segoe UI', system-ui, sans-serif",
      display:"flex", flexDirection:"column", alignItems:"center",
      padding:`24px 14px calc(${inProject ? 24 : 100}px + env(safe-area-inset-bottom,0px))`,
      direction:"ltr", overflowX:"hidden",
      transition:"background 0.4s ease, color 0.3s ease", position:"relative" }}>

      {/* كرات الضوء المتحركة في الخلفية */}
      <div style={{ position:"fixed", inset:0, pointerEvents:"none", overflow:"hidden", zIndex:0 }}>
        <div style={{ position:"absolute", width:600, height:600, borderRadius:"50%",
          background:`radial-gradient(circle, ${th.gradOrb1} 0%, transparent 70%)`,
          top:"-20%", right:"-10%", animation:"orbFloat1 18s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", width:400, height:400, borderRadius:"50%",
          background:`radial-gradient(circle, ${th.gradOrb2} 0%, transparent 70%)`,
          bottom:"10%", left:"-5%", animation:"orbFloat2 22s ease-in-out infinite" }}/>
        <div style={{ position:"absolute", width:300, height:300, borderRadius:"50%",
          background:`radial-gradient(circle, ${th.gradOrb3} 0%, transparent 70%)`,
          top:"40%", left:"30%", animation:"orbFloat3 15s ease-in-out infinite" }}/>
      </div>

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
        .hover-halo:hover { box-shadow:0 0 28px ${th.accent}55, 0 8px 24px rgba(0,0,0,0.3); border-color:${th.accent} !important; background:${th.accent}12 !important; transform:translateY(-2px); }
        .hover-halo:active { transform:scale(0.97) !important; }
        .dash-card { transition:all 0.3s cubic-bezier(0.34,1.2,0.64,1); border:1px solid rgba(255,255,255,0.05); }
        .dash-card:hover { border-color:${th.accent}80; box-shadow:0 6px 24px rgba(0,0,0,0.4), 0 0 16px ${th.accentGlow}; transform:translateY(-4px) scale(1.02); }
        .dash-card:active { transform:scale(0.96) !important; }
        .tap-btn { transition:transform 0.15s cubic-bezier(0.34,1.56,0.64,1), opacity 0.15s ease, box-shadow 0.2s ease; -webkit-tap-highlight-color:transparent; }
        .tap-btn:active { transform:scale(0.94) !important; opacity:0.82; }
        .style-btn { transition:all 0.25s cubic-bezier(0.34,1.2,0.64,1); }
        .style-btn:active { transform:scale(0.93); }
        * { -webkit-tap-highlight-color:transparent; box-sizing:border-box; }
        ::-webkit-scrollbar{width:3px} ::-webkit-scrollbar-thumb{background:rgba(255,255,255,0.15);border-radius:3px}
      `}</style>

      {/* إشعار Toast — يظهر أسفل الشاشة لفترة قصيرة */}
      {toast && (
        <div style={{ position:"fixed", bottom:100, left:"50%", transform:"translateX(-50%)",
          background: themeMode==="dark" ? "rgba(255,255,255,0.95)" : "rgba(30,24,20,0.92)",
          color: themeMode==="dark" ? th.bgSolid : th.text,
          padding:"11px 22px", borderRadius:50, display:"flex", alignItems:"center", gap:8,
          fontSize:13, fontWeight:600, boxShadow:`0 8px 32px rgba(0,0,0,0.45), 0 0 16px ${th.accentGlow}`,
          zIndex:99999, whiteSpace:"nowrap", animation:"toastIn .3s cubic-bezier(0.34,1.56,0.64,1)",
          backdropFilter:"blur(12px)" }}>
          {toast.includes("فشل") ? <SVGIcons.Delete /> : <SVGIcons.Check />}
          {toast.replace(/✅|❌|📂/g, "")}
        </div>
      )}

      {/* شاشة القص — تظهر فقط لما يكون في صورة منتظرة */}
      {pendingCropImg && (
        <ImageCropper
          imgData={pendingCropImg}
          targetRatio={totalW / totalH}
          onCrop={handleCropComplete}
          onCancel={() => setPendingCropImg(null)}
          t={t} th={th} lang={lang}
        />
      )}

      {/* المحتوى الرئيسي مع الدخول والخروج */}
      <div style={{ width:"100%", display:"flex", justifyContent:"center",
        opacity: contentVisible ? 1 : 0,
        transform: contentVisible ? "translateY(0) scale(1)" : "translateY(10px) scale(0.98)",
        transition:"opacity 0.22s ease, transform 0.22s cubic-bezier(0.16,1,0.3,1)",
        position:"relative", zIndex:1 }}>

        {activeTab === "home" ? (
          <div style={{ width:"100%", maxWidth:430 }}>

            {/* زر الرجوع للقائمة — يظهر فقط داخل المشروع */}
            {inProject && (
              <button onClick={handleBack} className="tap-btn"
                style={{ marginBottom:12, padding:"9px 16px", borderRadius:14,
                  border:`1px solid ${th.border}`, background:th.surface,
                  backdropFilter:"blur(16px)", color:th.textMuted, fontSize:13, fontWeight:600,
                  cursor:"pointer", display:"flex", alignItems:"center", gap:6,
                  boxShadow:"0 2px 12px rgba(0,0,0,0.15)",
                  flexDirection: isRtl ? "row-reverse" : "row" }}>
                <span style={{ transform: isRtl ? "rotate(180deg)" : "none", display:"flex" }}><SVGIcons.Undo /></span>
                {t.backBtn}
              </button>
            )}

            {/* هيدر التطبيق */}
            {!inProject && (
            <div style={{ background:th.surface, backdropFilter:"blur(24px)",
              borderRadius:24, padding:"20px 22px", border:`1px solid ${th.border}`, marginBottom:14,
              textAlign:"center", boxShadow:`0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)`,
              animation:"fdIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
              <h1 style={{ fontSize:20, margin:"0 0 6px", fontWeight:500, direction: isRtl ? "rtl" : "ltr" }}>
                {t.title} <span style={{ color:th.accent }}>Pro</span>
              </h1>
              <p style={{ color:th.textMuted, fontSize:12, lineHeight:1.65, margin:0, direction: isRtl ? "rtl" : "ltr" }}>
                {t.desc} <b style={{ color:th.text }}>One UI 8.5</b>
              </p>
            </div>
            )}

            {!bg ? (
              <>
                {/* زر بدء مشروع جديد */}
                <div className="hover-halo" onClick={() => setShowProjModal(true)}
                  style={{ padding:"24px 0", borderRadius:20, border:`2px dashed ${th.border}`,
                    background:th.surface, backdropFilter:"blur(20px)",
                    display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                    cursor:"pointer", marginBottom:14, boxShadow:"0 2px 16px rgba(0,0,0,0.12)",
                    animation:"fdIn 0.45s cubic-bezier(0.16,1,0.3,1)" }}>
                  <span style={{ color:th.text, display:"flex" }}><SVGIcons.Folder /></span>
                  <span style={{ color:th.text, fontWeight:700, fontSize:13.5, direction: isRtl ? "rtl" : "ltr" }}>{t.uploadPrompt}</span>
                </div>

                {/* قائمة المشاريع المحفوظة */}
                <div style={{ background:`linear-gradient(135deg,${th.surface},${th.accentGlow2})`,
                  backdropFilter:"blur(24px)", borderRadius:24, padding:"18px 20px",
                  border:`1px solid ${th.border}`, marginBottom:14,
                  boxShadow:`0 4px 24px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.05)`,
                  animation:"fdIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14,
                    flexDirection: isRtl ? "row-reverse" : "row" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:th.text, display:"flex", alignItems:"center", gap:6 }}>
                      <SVGIcons.Projects /> {t.savedDashboard}
                    </span>
                    <span style={{ fontSize:12, color:th.accent, fontWeight:600 }}>{t.viewAll} ({savedProjects.length})</span>
                  </div>
                  {savedProjects.length > 0 ? (
                    <div style={{ display:"flex", gap:12, overflowX:"auto", paddingBottom:6, flexDirection: isRtl ? "row-reverse" : "row" }}>
                      {savedProjects.slice(0, 5).map((proj, idx) => (
                        <div key={idx} onClick={() => setProjMenuTarget(proj)} className="dash-card"
                          style={{ flexShrink:0, width:110, background:"rgba(0,0,0,0.2)", backdropFilter:"blur(8px)",
                            padding:8, borderRadius:14, cursor:"pointer", textAlign:"center",
                            animation:`popIn 0.4s cubic-bezier(0.34,1.56,0.64,1) ${idx * 0.05}s both` }}>
                          <div style={{ width:"100%", aspectRatio:"1/1.5", borderRadius:10, overflow:"hidden",
                            marginBottom:6, border:`1px solid ${th.border}`, boxShadow:"0 4px 12px rgba(0,0,0,0.25)" }}>
                            <img src={proj.bg} style={{ width:"100%", height:"100%", objectFit:"cover" }} alt=""/>
                          </div>
                          <div style={{ fontSize:11, fontWeight:600, color:th.text,
                            overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{proj.name}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color:th.textMuted, fontSize:12, textAlign:"center", padding:"10px 0", direction: isRtl ? "rtl" : "ltr" }}>{t.noSaved}</div>
                  )}
                </div>
              </>
            ) : (
              /* شريط اسم المشروع الحالي */
              <div className="hover-halo" onClick={() => !editMode && setShowProjModal(true)}
                style={{ padding:"16px 0", borderRadius:20, border:`2px dashed ${th.accent}`,
                  background:`${th.accent}15`, backdropFilter:"blur(20px)",
                  display:"flex", flexDirection:"column", alignItems:"center", gap:8,
                  cursor: editMode ? "default" : "pointer", marginBottom:14,
                  boxShadow:`0 4px 20px ${th.accentGlow}`,
                  animation:"fdIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                <span style={{ color:th.accent, fontWeight:700, fontSize:13.5, display:"flex", alignItems:"center", gap:6, direction: isRtl ? "rtl" : "ltr" }}>
                  {projectName} — {t.uploadReady}
                </span>
              </div>
            )}

            {bg && (
              <div style={{ animation:"fdIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
                {/* شريط القص ونمط العرض */}
                <div style={{ background:th.surface, backdropFilter:"blur(20px)", borderRadius:16,
                  padding:"10px 14px", border:`1px solid ${th.border}`, marginBottom:12,
                  display:"flex", justifyContent:"space-between", alignItems:"center",
                  boxShadow:"0 2px 14px rgba(0,0,0,0.12)", flexDirection: isRtl ? "row-reverse" : "row" }}>
                  <button  className="tap-btn" onClick={() => fileRef.current?.click()}
                    style={{ background: th.accent, border: `1px solid ${th.border}`, borderRadius: 24, padding: 20, color: th.text,
                      display:"flex", alignItems:"center", gap:6, fontSize:13, fontWeight:600,
                      cursor:"pointer", padding:"5px 10px", borderRadius:10 }}>
                    <SVGIcons.Crop /> {t.cropBtn}
                  </button>
                  <div style={{ display:"flex", gap:6 }}>
                    <button className="style-btn" onClick={() => setVisualStyle("transparent")}
                      style={{ padding:"6px 14px", borderRadius:10, border:"none", fontSize:11.5, fontWeight:700, cursor:"pointer",
                        background: visualStyle==="transparent" ? th.accent : "rgba(0,0,0,0.2)", color:"white",
                        boxShadow: visualStyle==="transparent" ? `0 3px 12px ${th.accentGlow}` : "none" }}>
                      {t.styleTrans}
                    </button>
                    <button className="style-btn" onClick={() => setVisualStyle("blurred")}
                      style={{ padding:"6px 14px", borderRadius:10, border:"none", fontSize:11.5, fontWeight:700, cursor:"pointer",
                        background: visualStyle==="blurred" ? th.accent : "rgba(0,0,0,0.2)", color:"white",
                        boxShadow: visualStyle==="blurred" ? `0 3px 12px ${th.accentGlow}` : "none" }}>
                      {t.styleBlur}
                    </button>
                  </div>
                </div>

                {/* شريط التعديل والـ undo */}
                <div style={{ display:"flex", gap:8, marginBottom:14 }}>
                  <button className="tap-btn" onClick={() => setEditMode(m => !m)}
                    style={{ flex:1, padding:"12px 0", borderRadius:14,
                      display:"flex", justifyContent:"center", alignItems:"center", gap:6,
                      border:`1px solid ${editMode ? th.accent : th.border}`,
                      background: editMode ? `${th.accent}28` : th.surface,
                      backdropFilter:"blur(10px)",
                      color: editMode ? th.accent : th.text, fontSize:13, fontWeight:700, cursor:"pointer",
                      boxShadow: editMode ? `0 4px 18px ${th.accentGlow}` : "none" }}>
                    {editMode ? <><SVGIcons.Check /> {t.editOn}</> : <><SVGIcons.Edit size={16}/> {t.editOff}</>}
                  </button>
                  {editMode && history.length > 0 && (
                    <button className="tap-btn" onClick={undo}
                      style={{ padding:"12px 16px", borderRadius:14, border:`1px solid ${th.border}`,
                        display:"flex", justifyContent:"center", alignItems:"center", gap:6,
                        background:th.surface, backdropFilter:"blur(10px)", color:th.text,
                        fontSize:13, cursor:"pointer", fontWeight:600,
                        animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                      <SVGIcons.Undo /> {t.undo}
                    </button>
                  )}
                </div>

                {/* تلميح السحب والتكبير — يظهر فقط في وضع التعديل */}
                {editMode && (
                  <div style={{ textAlign:"center", color:th.accent, fontSize:11, fontWeight:600,
                    display:"flex", justifyContent:"center", alignItems:"center", gap:6,
                    marginBottom:10, background:`${th.accent}18`, padding:"8px 10px",
                    borderRadius:12, animation:"fdIn .25s ease", border:`1px solid ${th.accent}30`,
                    direction: isRtl ? "rtl" : "ltr" }}>
                    <SVGIcons.Sparkle /> {t.hint}
                  </div>
                )}

                {/* الشبكة الرئيسية — الصورة + الكبسولات */}
                <div ref={gridRef}
                  style={{ position:"relative", width:"100%", aspectRatio:`${totalW}/${totalH}`,
                    borderRadius:28, background:"#111",
                    boxShadow:`0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)`,
                    direction:"rtl", touchAction:"pan-y", overflow:"hidden" }}>

                  {/* الصورة الخلفية — تبهت في وضع التعديل */}
                  <img src={bg} alt=""
                    style={{ position:"absolute", inset:0, width:"100%", height:"100%",
                      objectFit:"cover", objectPosition:"center",
                      opacity: editMode ? 0.28 : 1, transition:"opacity .4s ease",
                      pointerEvents:"none", userSelect:"none" }}/>

                  {editMode && <div style={{ position:"absolute", inset:0, background:"rgba(10,10,20,0.18)", pointerEvents:"none", zIndex:0 }}/>}

                  {/* رسم كل كبسولة */}
                  {layout.map(item => (
                    <div key={item.id} style={wrapperStyle(item)} onTouchStart={e => onItemTouchStart(e, item)}>
                      <div style={innerStyle(item)}>
                        <ItemContent item={item} visualStyle={visualStyle}/>
                      </div>
                      {/* أزرار التحكم — تظهر فقط في وضع التعديل */}
                      {editMode && (
                        <>
                          {/* زر الحذف — أحمر أعلى اليسار */}
                          <div data-edit-control="true"
                            style={{ position:"absolute", top:-1, left:-1, width:24, height:24,
                              borderRadius:"50%", background:th.danger,
                              display:"flex", alignItems:"center", justifyContent:"center",
                              cursor:"pointer", zIndex:30, boxShadow:"0 2px 10px rgba(0,0,0,0.5)",
                              animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
                            onTouchStart={e => e.stopPropagation()}
                            onClick={e => { e.stopPropagation(); snapshot(); setLayout(p => p.filter(i => i.id !== item.id)); }}>
                            <div style={{ width:10, height:2, background:"white", borderRadius:1 }}/>
                          </div>
                          {/* زر التعديل — رمادي أعلى اليمين */}
                          <div data-edit-control="true"
                            style={{ position:"absolute", top:-1, right:-1, width:26, height:26,
                              borderRadius:"50%", background:"rgba(40,40,50,0.95)",
                              border:"1px solid rgba(255,255,255,0.3)",
                              display:"flex", alignItems:"center", justifyContent:"center", color:"white",
                              cursor:"pointer", zIndex:30, boxShadow:"0 2px 10px rgba(0,0,0,0.5)",
                              animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.05s both" }}
                            onTouchStart={e => e.stopPropagation()}
                            onClick={e => { e.stopPropagation(); setModalItem(item); }}>
                            <SVGIcons.Edit size={12}/>
                          </div>
                          {/* زر التكبير — برتقالي أسفل اليمين */}
                          <div data-edit-control="true"
                            style={{ position:"absolute", bottom:-4, right:-4, width:34, height:34,
                              background:th.accent, borderRadius:"50%",
                              display:"flex", alignItems:"center", justifyContent:"center",
                              zIndex:30, cursor:"se-resize",
                              boxShadow:`0 3px 10px rgba(0,0,0,0.5), 0 0 8px ${th.accentGlow}`,
                              animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1) 0.1s both" }}
                            onTouchStart={e => { e.stopPropagation(); onResizePointerDown({ clientX:e.touches[0].clientX, clientY:e.touches[0].clientY, stopPropagation:()=>{}, preventDefault:()=>{} }, item); }}
                            onMouseDown={e => onResizePointerDown(e, item)}>
                            <div style={{ width:12, height:12, borderRight:"3px solid white", borderBottom:"3px solid white", transform:"translate(-2px,-2px)" }}/>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>

                {/* زر إضافة كبسولة جديدة — يظهر فقط في وضع التعديل */}
                {editMode && (
                  <div style={{ display:"flex", justifyContent:"center", marginTop:14, animation:"popIn .3s cubic-bezier(0.34,1.56,0.64,1)" }}>
                    <button className="tap-btn"
                      onClick={() => { snapshot(); setLayout(p => [...p, { id:Date.now().toString(), col:1, colSpan:1, row:getMaxRow(layout)+1, rowSpan:1, icon:"", label:"" }]); }}
                      style={{ width:52, height:52, borderRadius:"50%", background:th.accent,
                        color:"#fff", border:"none", cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:`0 6px 24px ${th.accentGlow}, 0 0 0 1px ${th.accent}40` }}>
                      <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </button>
                  </div>
                )}

                {/* زر التصدير */}
                <button className="tap-btn" onClick={handleExport} disabled={generating || editMode || !bgImg}
                  style={{ marginTop: editMode ? 14 : 22, width:"100%", padding:16, borderRadius:18,
                    display:"flex", justifyContent:"center", alignItems:"center", gap:10,
                    border:"none", fontSize:15, fontWeight:800,
                    background: (!bgImg || editMode) ? th.surface : th.text,
                    color: (!bgImg || editMode) ? th.textMuted : th.bgSolid,
                    cursor: (generating || editMode || !bgImg) ? "not-allowed" : "pointer",
                    boxShadow: (!bgImg || editMode) ? "none" : `0 6px 24px rgba(0,0,0,0.25), 0 0 16px ${th.accentGlow}` }}>
                  {generating
                    ? <span style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ width:16, height:16, borderRadius:"50%", border:"2px solid rgba(0,0,0,0.2)", borderTopColor:th.bgSolid, animation:"spin .7s linear infinite" }}/>
                        {t.exporting}
                      </span>
                    : <>{!editMode && <SVGIcons.Export />} {editMode ? t.exportWarn : t.exportBtn}</>
                  }
                </button>
              </div>
            )}
          </div>
        ) : (
          // ── صفحة الإعدادات ──────────────────────────────────────────────────
          <div style={{ width:"100%", maxWidth:430, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ background:th.surface, backdropFilter:"blur(24px)", borderRadius:24, padding:"24px",
              border:`1px solid ${th.border}`,
              boxShadow:`0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.06)`,
              animation:"fdIn 0.4s cubic-bezier(0.16,1,0.3,1)" }}>
              <h2 style={{ margin:"0 0 20px", fontSize:22, color:th.text,
                display:"flex", justifyContent:"center", alignItems:"center", gap:8, direction: isRtl ? "rtl" : "ltr" }}>
                <SVGIcons.Settings /> {t.settings}
              </h2>
              <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
                {/* إعداد اللغة */}
                <div>
                  <label style={{ fontSize:13, color:th.textMuted, marginBottom:8, display:"block", textAlign: isRtl ? "right" : "left" }}>{t.lang}</label>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="tap-btn" onClick={() => setLang("ar")}
                      style={{ flex:1, padding:13, borderRadius:13, cursor:"pointer",
                        border:`1px solid ${lang==="ar" ? th.accent : th.border}`,
                        background: lang==="ar" ? th.accentGlow : "transparent", color:th.text, fontWeight:600, fontSize:14,
                        boxShadow: lang==="ar" ? `0 3px 12px ${th.accentGlow}` : "none" }}>
                      العربية
                    </button>
                    <button className="tap-btn" onClick={() => setLang("en")}
                      style={{ flex:1, padding:13, borderRadius:13, cursor:"pointer",
                        border:`1px solid ${lang==="en" ? th.accent : th.border}`,
                        background: lang==="en" ? th.accentGlow : "transparent", color:th.text, fontWeight:600, fontSize:14,
                        boxShadow: lang==="en" ? `0 3px 12px ${th.accentGlow}` : "none" }}>
                      English
                    </button>
                  </div>
                </div>
                {/* إعداد الثيم */}
                <div>
                  <label style={{ fontSize:13, color:th.textMuted, marginBottom:8, display:"block", textAlign: isRtl ? "right" : "left" }}>{t.themeMode}</label>
                  <div style={{ display:"flex", gap:8 }}>
                    <button className="tap-btn" onClick={() => setThemeMode("dark")}
                      style={{ flex:1, padding:13, borderRadius:13, cursor:"pointer",
                        display:"flex", justifyContent:"center", alignItems:"center", gap:6,
                        border:`1px solid ${themeMode==="dark" ? th.accent : th.border}`,
                        background: themeMode==="dark" ? th.accentGlow : "transparent", color:th.text, fontWeight:600,
                        boxShadow: themeMode==="dark" ? `0 3px 12px ${th.accentGlow}` : "none" }}>
                      <SVGIcons.Moon /> {t.dark}
                    </button>
                    <button className="tap-btn" onClick={() => setThemeMode("light")}
                      style={{ flex:1, padding:13, borderRadius:13, cursor:"pointer",
                        display:"flex", justifyContent:"center", alignItems:"center", gap:6,
                        border:`1px solid ${themeMode==="light" ? th.accent : th.border}`,
                        background: themeMode==="light" ? th.accentGlow : "transparent", color:th.text, fontWeight:600,
                        boxShadow: themeMode==="light" ? `0 3px 12px ${th.accentGlow}` : "none" }}>
                      <SVGIcons.Sun /> {t.light}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* قسم التواصل */}
            <div style={{background: th.surface, border: `1px solid ${th.border}`, borderRadius: 24, padding: 20, color: th.text }}>
              <h3 style={{ marginTop: 0, marginBottom: 20, textAlign: "center" }}>
                 {t.contact}
              </h3>
              <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
                <div>
                  <div style={{ fontSize:14, color:th.textMuted }}>{t.Email}</div>
                  <a href="mailto:ibrah.aladwani@gmail.com" style={{ fontSize:15, color:th.accent, textDecoration:"underline" }}>
                    ibrah.aladwani@gmail.com
                  </a>
                </div>
                <div>
                  <div style={{ fontSize:14, color:th.textMuted }}>{t.Twetter}</div>
                  <a href="https://x.com/Ibrahim_312i" target="_blank" rel="noopener noreferrer" style={{ fontSize:15, color:th.accent, textDecoration:"none" }}>
                    @Ibrahim_312i
                  </a>
                </div>
                <div>
                  <div style={{ fontSize:14, color:th.textMuted }}>{t.Instagram}</div>
                  <a href="https://www.instagram.com/ibrah_hi_m" target="_blank" rel="noopener noreferrer" style={{ fontSize:15, color:th.accent, textDecoration:"none" }}>
                    @ibrah_hi_m
                  </a>
                </div>
                <div>
                  <div style={{ fontSize:14, color:th.textMuted }}>{t.telgram}</div>
                  <a href="https://t.me/+oxm3eU42ja44ZDBk" target="_blank" rel="noopener noreferrer" style={{ fontSize:15, color:th.accent, textDecoration:"none" }}>
                    My quick panel & more
                  </a>
                </div>
              </div>
            </div>

            {/* معلومات المطور */}
            <div style={{ textAlign:"center", marginTop:16, opacity:0.55, animation:"fdIn 0.5s cubic-bezier(0.16,1,0.3,1)" }}>
              <p style={{ margin:5, fontSize:14, color:th.text }}>{t.devCredit}</p>
              <p style={{ margin:5, fontSize:12, color:th.textMuted }}>{t.rights}</p>
            </div>
          </div>
        )}
      </div>

      {/* الـ Bottom Navigation — يختفي داخل المشروع */}
      {!inProject && (
        <div style={{ position:"fixed", bottom:24, display:"flex",
          background:th.navBg, backdropFilter:"blur(28px) saturate(1.5)",
          WebkitBackdropFilter:"blur(28px) saturate(1.5)",
          border:`1px solid ${th.border}`, borderRadius:36,
          width:"90%", maxWidth:380, padding:6,
          boxShadow:`0 12px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)`,
          zIndex:100 }}>
          {[
            { id:"home",     icon:<SVGIcons.Home />,     label:t.tabHome },
            { id:"settings", icon:<SVGIcons.Settings />, label:t.tabSettings },
          ].map(tab => (
            <button key={tab.id} onClick={() => switchTab(tab.id)}
              style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4,
                padding:"10px 0", border:"none", borderRadius:30, cursor:"pointer",
                transition:"all 0.3s cubic-bezier(0.34,1.2,0.64,1)",
                background: activeTab===tab.id ? th.accentGlow : "transparent",
                color: activeTab===tab.id ? th.accent : th.textMuted,
                transform: activeTab===tab.id ? "scale(1.05)" : "scale(1)",
                boxShadow: activeTab===tab.id ? `0 0 16px ${th.accentGlow}` : "none" }}>
              <span style={{ display:"flex", transition:"transform 0.3s cubic-bezier(0.34,1.56,0.64,1)",
                transform: activeTab===tab.id ? "scale(1.15)" : "scale(1)" }}>
                {tab.icon}
              </span>
              <span style={{ fontSize:12, fontWeight:700 }}>{tab.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* مودال إدخال اسم المشروع */}
      {showProjModal && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.72)", zIndex:9999,
          display:"flex", alignItems:"center", justifyContent:"center", padding:20,
          backdropFilter:"blur(12px)", animation:"fdIn .25s ease" }}>
          <div style={{ background:th.modalBg, backdropFilter:"blur(28px) saturate(1.4)",
            padding:24, borderRadius:26, width:"100%", maxWidth:360,
            border:`1px solid ${th.borderHover}`,
            boxShadow:`0 24px 60px rgba(0,0,0,0.55), 0 0 40px ${th.modalGlow}, inset 0 1px 0 rgba(255,255,255,0.08)`,
            animation:"popIn .35s cubic-bezier(0.34,1.56,0.64,1)" }}>
            <h3 style={{ margin:"0 0 16px", color:th.text, textAlign: isRtl ? "right" : "left" }}>
              {t.projectNamePrompt}
            </h3>
            <input type="text" placeholder={t.defaultProjectName}
              onChange={e => tempNameRef.current = e.target.value}
              style={{ width:"100%", boxSizing:"border-box", padding:14, borderRadius:14,
                border:`1px solid ${th.border}`, background:"rgba(255,255,255,0.04)",
                color:th.text, fontSize:14, outline:"none", marginBottom:20,
                textAlign: isRtl ? "right" : "left", transition:"border-color 0.2s ease" }}
              onFocus={e => e.target.style.borderColor = th.accent}
              onBlur={e  => e.target.style.borderColor = th.border}/>
            <div style={{ display:"flex", gap:10 }}>
              <button className="tap-btn" onClick={() => fileRef.current?.click()}
                style={{ flex:2, padding:14, background:th.accent, color:"white",
                  border:"none", borderRadius:14, fontWeight:"bold", cursor:"pointer",
                  boxShadow:`0 4px 16px ${th.accentGlow}` }}>
                {t.continueBtn}
              </button>
              <button className="tap-btn" onClick={() => setShowProjModal(false)}
                style={{ flex:1, padding:14, background:"transparent", color:th.text,
                  border:`1px solid ${th.border}`, borderRadius:14, cursor:"pointer" }}>
                {t.cancelBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* input الملف المخفي — يُفعَّل برمجياً */}
      <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={handleFileChange}/>

      {/* قائمة خيارات المشروع المحفوظ */}
      {projMenuTarget && (
        <ProjectMenu
          proj={projMenuTarget}
          onEdit={() => loadSavedProject(projMenuTarget)}
          onDelete={() => deleteProject(projMenuTarget.name)}
          onClose={() => setProjMenuTarget(null)}
          t={t} th={th} lang={lang}
        />
      )}

      {/* مودال تعديل الكبسولة */}
      {modalItem && (
        <ConfigModal item={modalItem}
          onSave={cfg => { setLayout(p => p.map(i => i.id === cfg.id ? cfg : i)); setModalItem(null); showToast(t.toastSaved); }}
          onClose={() => setModalItem(null)}
          t={t} th={th} lang={lang}
        />
      )}
    </div>
  );
}