import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CityKey } from "./china-geo";
import { ALL_CITIES, CITY_LABELS_EN, CITY_LABELS_ZH } from "./china-geo";

/* ------------------------------------------------------------------ */
/*  CITY_SEARCH_TERMS — 中英双语城市搜索匹配表                          */
/*  搜英文名/中文名/别名/简称均可命中对应 CityKey                          */
/* ------------------------------------------------------------------ */

export const CITY_SEARCH_TERMS: Record<string, CityKey> = {
  // ── 标准英文名 ──
  beijing: "beijing",
  nanjing: "nanjing",
  xian: "xian",
  "xi'an": "xian",
  "xi an": "xian",
  shanghai: "shanghai",
  zhangjiajie: "zhangjiajie",
  hangzhou: "hangzhou",
  guangzhou: "guangzhou",
  chengdu: "chengdu",
  wuhan: "wuhan",
  changsha: "changsha",
  fuzhou: "fuzhou",
  jinan: "jinan",
  hefei: "hefei",
  nanchang: "nanchang",
  nanning: "nanning",
  dalian: "dalian",
  shenyang: "shenyang",
  harbin: "harbin",
  daqing: "daqing",
  changchun: "changchun",
  jilin: "jilin",
  yanji: "yanji",

  // ── 青甘大环线英文名 ──
  xining: "xining",
  qinghaihu: "qinghaihu",
  "qinghai lake": "qinghaihu",
  "qinghai": "qinghaihu",
  chaka: "chaka",
  "chaka salt lake": "chaka",
  "salt lake": "chaka",
  delingha: "delingha",
  dachaidan: "dachaidan",
  "dachaidan lake": "dachaidan",
  dunhuang: "dunhuang",
  jiayuguan: "jiayuguan",
  "jiayu pass": "jiayuguan",
  zhangye: "zhangye",
  lanzhou: "lanzhou",

  // ── 标准中文名 ──
  "北京": "beijing",
  "南京": "nanjing",
  "西安": "xian",
  "上海": "shanghai",
  "张家界": "zhangjiajie",
  "杭州": "hangzhou",
  "广州": "guangzhou",
  "成都": "chengdu",
  "武汉": "wuhan",
  "长沙": "changsha",
  "福州": "fuzhou",
  "济南": "jinan",
  "合肥": "hefei",
  "南昌": "nanchang",
  "南宁": "nanning",
  "大连": "dalian",
  "沈阳": "shenyang",
  "哈尔滨": "harbin",
  "大庆": "daqing",
  "长春": "changchun",
  "吉林": "jilin",
  "延吉": "yanji",

  // ── 青甘大环线中文名 ──
  "西宁": "xining",
  "青海湖": "qinghaihu",
  "茶卡盐湖": "chaka",
  "茶卡": "chaka",
  "天空之镜": "chaka",
  "德令哈": "delingha",
  "大柴旦": "dachaidan",
  "翡翠湖": "dachaidan",
  "敦煌": "dunhuang",
  "嘉峪关": "jiayuguan",
  "张掖": "zhangye",
  "七彩丹霞": "zhangye",
  "丹霞": "zhangye",
  "兰州": "lanzhou",

  // ── 英文别名 / 简称 ──
  bj: "beijing",
  nj: "nanjing",
  sh: "shanghai",
  gz: "guangzhou",
  cd: "chengdu",
  wh: "wuhan",
  cs: "changsha",
  fz: "fuzhou",
  jn: "jinan",
  hf: "hefei",
  nc: "nanchang",
  nn: "nanning",
  peking: "beijing",
  nanking: "nanjing",
  canton: "guangzhou",
  sian: "xian",
  dl: "dalian",
  sy: "shenyang",
  hr: "harbin",
  dq: "daqing",
  cc: "changchun",
  jl: "jilin",
  yj: "yanji",
  "冰城": "harbin",
  "哈市": "harbin",
  "沈": "shenyang",
  "大连市": "dalian",
  "春城": "changchun",
  "长": "changchun",

  // ── 中文简称 / 别名 / 昵称 ──
  "京城": "beijing",
  "帝都": "beijing",
  "首都": "beijing",
  "燕京": "beijing",

  "金陵": "nanjing",
  "石头城": "nanjing",
  "建康": "nanjing",

  "长安": "xian",
  "西京": "xian",

  "魔都": "shanghai",
  "申城": "shanghai",

  "榕城": "fuzhou",

  "泉城": "jinan",

  "庐州": "hefei",

  "洪城": "nanchang",
  "洪都": "nanchang",
  "豫章": "nanchang",

  "绿城": "nanning",
  "邕城": "nanning",

  "星城": "changsha",

  "江城": "wuhan",

  "蓉城": "chengdu",
  "锦城": "chengdu",

  "花城": "guangzhou",
  "羊城": "guangzhou",

  "临安": "hangzhou",

  "武陵源": "zhangjiajie",

  // ── 青甘大环线别名 ──
  "夏都": "xining",
  "xn": "xining",
  "qh": "qinghaihu",
  "cl": "chaka",
  "dlh": "delingha",
  "dcd": "dachaidan",
  "dh": "dunhuang",
  "沙洲": "dunhuang",
  "丝路": "dunhuang",
  "jyg": "jiayuguan",
  "zy": "zhangye",
  "甘州": "zhangye",
  "lz": "lanzhou",
  "金城": "lanzhou",
  "牛肉面": "lanzhou",
  "青甘大环线": "xining",
  "青甘环线": "xining",
  "青海甘肃大环线": "xining",
};

/* ------------------------------------------------------------------ */
/*  搜索结果类型                                                         */
/* ------------------------------------------------------------------ */

export interface SearchResult {
  city: CityKey;
  labelEn: string;
  labelZh: string;
}

/* ------------------------------------------------------------------ */
/*  Context                                                           */
/* ------------------------------------------------------------------ */

type SearchCtx = {
  /** Current search input string */
  query: string;
  /** Update the search query */
  setQuery: (q: string) => void;
  /** Resolved city matches for the current query */
  results: SearchResult[];
  /** Reset query to empty */
  clearSearch: () => void;
};

const SearchContext = createContext<SearchCtx | null>(null);

/* ------------------------------------------------------------------ */
/*  Provider                                                          */
/* ------------------------------------------------------------------ */

export function SearchProvider({ children }: { children: ReactNode }) {
  const [query, setQuery] = useState("");

  const results = useMemo<SearchResult[]>(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const q = trimmed.toLowerCase();
    const matched = new Set<CityKey>();

    // 1. Exact match
    if (CITY_SEARCH_TERMS[q]) {
      matched.add(CITY_SEARCH_TERMS[q]);
      return Array.from(matched).map(toResult);
    }

    // 2. Fuzzy: term includes query OR query includes term
    for (const [term, city] of Object.entries(CITY_SEARCH_TERMS)) {
      if (term.includes(q) || q.includes(term)) {
        matched.add(city);
      }
    }

    // 3. Fallback: match against English & Chinese labels
    if (matched.size === 0) {
      for (const city of ALL_CITIES) {
        const en = CITY_LABELS_EN[city].toLowerCase();
        const zh = CITY_LABELS_ZH[city];
        if (en.includes(q) || zh.includes(q)) {
          matched.add(city as CityKey);
        }
      }
    }

    return Array.from(matched).map(toResult);
  }, [query]);

  const clearSearch = useCallback(() => setQuery(""), []);

  const value = useMemo<SearchCtx>(
    () => ({ query, setQuery, results, clearSearch }),
    [query, results, clearSearch],
  );

  return <SearchContext.Provider value={value}>{children}</SearchContext.Provider>;
}

/* ------------------------------------------------------------------ */
/*  Hook                                                              */
/* ------------------------------------------------------------------ */

export function useSearch(): SearchCtx {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch must be used within <SearchProvider>");
  return ctx;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function toResult(city: CityKey): SearchResult {
  return {
    city,
    labelEn: CITY_LABELS_EN[city],
    labelZh: CITY_LABELS_ZH[city],
  };
}
