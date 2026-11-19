// Single source of truth for all real content. Nothing here is invented: project text, technologies and
// links come from the project READMEs and the owner's supplied résumé text.

export const EMAIL = 'zy7765816@gmail.com'
export const GITHUB = 'https://github.com/qwer070591-arch'

export interface Project {
  id: string
  no: string
  title: string
  category: string
  lead: string
  desc: string
  tech: string[]
  demo: string
  repo: string
  image: string
  alt: string
  /** Bento span on desktop (12-col grid): 7 / 5 / 5 / 7 */
  span: 5 | 7
  /** TypeScript used? (README-verified) */
  ts: boolean
}

export const projects: Project[] = [
  {
    id: 'nexus', no: '01', title: 'NEXUS', category: 'Vue 3 · 電商展示',
    lead: '以編輯式視覺呈現電競裝備的展示網站。',
    desc: '商品探索、互動輪播，以及儲存在瀏覽器中的購物車與收藏。展示用途，不提供真實購物服務。',
    tech: ['Vue 3', 'Vite', 'GSAP', 'Embla Carousel'],
    demo: 'https://nexus-gaming-ecommerce.vercel.app/', repo: 'https://github.com/qwer070591-arch/nexus-gaming-ecommerce',
    image: '/assets/nexus.webp', alt: 'NEXUS 電競裝備展示網站的桌面首頁截圖', span: 7, ts: false,
  },
  {
    id: 'neurova', no: '02', title: 'NEUROVA', category: 'Vue 3 · AI 分析',
    lead: '用清楚的圖表與流程整理示範數據。',
    desc: '純前端 AI 分析管理平台，涵蓋模型分析、使用量與費用、活動紀錄及使用者管理。所有數值與帳號皆為示範資料。',
    tech: ['Vue 3', 'TypeScript', 'Pinia', 'ECharts'],
    demo: 'https://neurova-dashboard-six.vercel.app/', repo: 'https://github.com/qwer070591-arch/neurova-dashboard',
    image: '/assets/neurova.webp', alt: 'NEUROVA AI 分析管理平台的桌面總覽截圖', span: 5, ts: true,
  },
  {
    id: 'mellow', no: '03', title: 'mellow.', category: 'Vue 3 · 智慧家庭',
    lead: '以溫和的視覺語言控制居家情境。',
    desc: '單螢幕介面整合房間切換、燈光、窗簾、溫控與情境。設定保存在本機瀏覽器，不連接真實 IoT 設備。',
    tech: ['Vue 3', 'TypeScript', 'Pinia', 'SCSS'],
    demo: 'https://mellow-smart-home.vercel.app/', repo: 'https://github.com/qwer070591-arch/mellow-smart-home',
    image: '/assets/mellow-dark.webp', alt: 'mellow. 智慧家庭控制介面的深色模式桌面截圖', span: 5, ts: true,
  },
  {
    id: 'isle', no: '04', title: 'ISLE & WANDER', category: 'Vue 3 · 旅遊規劃',
    lead: '島嶼漫遊 — 台灣旅遊探索平台',
    desc: '以 Vue 3、TypeScript 開發的台灣旅遊探索平台，整合景點瀏覽、精選住宿、收藏與多日行程規劃，提供直覺的旅遊探索體驗。',
    tech: ['Vue 3', 'Vite', 'TypeScript', 'Vue Router', 'Pinia'],
    demo: 'https://isle-wander-ui.vercel.app/', repo: 'https://github.com/qwer070591-arch/isle-wander-ui',
    image: '/assets/isle-and-wander.webp', alt: 'ISLE & WANDER 台灣旅遊探索網站的桌面首頁截圖', span: 7, ts: true,
  },
]

/** Technology groups; "used in" values are README-verified. */
export const skills = [
  { group: '介面框架', items: ['Vue 3', 'Vite'], used: 'NEXUS · NEUROVA · mellow. · ISLE & WANDER' },
  { group: '型別與狀態', items: ['TypeScript', 'Pinia'], used: 'NEUROVA · mellow. · ISLE & WANDER' },
  { group: '圖表與互動', items: ['ECharts', 'GSAP', 'Embla Carousel'], used: 'NEUROVA · NEXUS' },
  { group: '樣式系統', items: ['SCSS', 'Tailwind CSS', 'CSS'], used: 'mellow. · NEUROVA · NEXUS' },
  { group: '開發流程', items: ['Git', 'GitHub', 'Vercel', 'Vitest', 'Playwright'], used: '版本控制、部署與測試' },
]

export const resumeFacts = [
  { k: '職稱', v: 'Junior Frontend Engineer' },
  { k: '學歷', v: '朝陽科技大學 · 企業管理系' },
  { k: '培訓', v: 'AI 輔助全端程式設計' },
  { k: '證照', v: 'iCAP' },
]

export const aboutText = [
  '我專注於前端網頁與互動介面開發，以 Vue 3、JavaScript 與 TypeScript 為主要技術，具備響應式網頁設計、元件化開發與狀態管理經驗，致力於打造兼具視覺美感與良好操作體驗的網站。',
  '畢業於朝陽科技大學企業管理系，曾從事機械相關實務工作，後跨領域完成「AI 輔助全端程式設計」職業訓練並取得 iCAP 證照。持續透過電商平台、AI 數據儀表板、智慧居家介面及其他個人專案累積前端開發經驗。',
  '熟悉 Git、GitHub 版本控制與 Vercel 部署，並具備 Vitest、Playwright 測試及 AI Coding Tools 輔助開發經驗。目前積極尋找 Junior 前端工程師機會。',
]

/** Project insights: each statement is taken from that project's own README (no invented articles or dates). */
export const insights = [
  {
    id: 'nexus-routing', project: 'NEXUS', projectId: 'nexus', topic: '路由與載入',
    title: '不靠 Vue Router，用 History API 處理路由',
    summary: '以 Browser History API 手動處理路徑與查詢參數，商品列表優先載入，其餘頁面以 Dynamic Import 載入，並提供載入及失敗後備畫面。',
    tags: ['History API', 'Dynamic Import'],
  },
  {
    id: 'nexus-perf', project: 'NEXUS', projectId: 'nexus', topic: '效能',
    title: '首屏圖片與字體載入的取捨',
    summary: '調整首屏商品圖載入優先度、Google Fonts 載入方式與 Code Splitting；專案維護者提供的單次 Lighthouse Mobile 紀錄為 Performance 81 → 93（分數隨環境波動）。',
    tags: ['Lighthouse', 'Code Splitting'],
  },
  {
    id: 'neurova-charts', project: 'NEUROVA', projectId: 'neurova', topic: '資料視覺化',
    title: 'ECharts 按需註冊與圖表路由懶載入',
    summary: '以 echarts/core 按需註冊折線與圓餅圖，圖表元件與六個路由皆懶載入；圖表路由首次開啟才下載共用 Chunk（約 530 KB minified／180 KB gzip）。',
    tags: ['ECharts', 'Lazy Loading'],
  },
  {
    id: 'isle-planner', project: 'ISLE & WANDER', projectId: 'isle', topic: '狀態與資料',
    title: '行程資料只存在瀏覽器，並提供 JSON 備份',
    summary: '以 Pinia 加 localStorage 保存收藏與 1–7 天行程；儲存被停用時僅保留於本次瀏覽，並可匯出／匯入 JSON 備份。',
    tags: ['Pinia', 'localStorage'],
  },
]

/** Explorations reuse the owner's own project screenshots (crops of real interfaces; no third-party art). */
export const explorations = [
  { id: 'x1', projectId: 'nexus', title: 'NEXUS · Obsidian Editorial', image: '/assets/nexus.webp', pos: '0% 0%', alt: 'NEXUS 首頁畫面' },
  { id: 'x2', projectId: 'neurova', title: 'NEUROVA · Analytics', image: '/assets/neurova.webp', pos: '100% 0%', alt: 'NEUROVA 總覽畫面' },
  { id: 'x3', projectId: 'mellow', title: 'mellow. · Living room', image: '/assets/mellow-dark.webp', pos: '0% 30%', alt: 'mellow. 智慧家庭畫面' },
  { id: 'x4', projectId: 'isle', title: 'ISLE & WANDER · Coast', image: '/assets/isle-and-wander.webp', pos: '100% 40%', alt: 'ISLE & WANDER 首頁畫面' },
]

const techSet = new Set<string>()
for (const p of projects) for (const t of p.tech) techSet.add(t)
export const stats = {
  projects: projects.length,
  technologies: techSet.size,
  typescriptProjects: projects.filter((p) => p.ts).length,
}
export const workflow = ['Git', 'GitHub', 'Vercel', 'Vitest', 'Playwright', 'AI Coding Tools']
