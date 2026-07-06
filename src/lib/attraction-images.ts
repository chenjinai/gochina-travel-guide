/**
 * Attraction image assets – one image per city for now.
 * In production, each attraction would have its own AI-generated image.
 */

import beijingImg from "@/assets/beijing.jpg";
import nanjingImg from "@/assets/nanjing.jpg";
import xianImg from "@/assets/xian.jpg";
import shanghaiImg from "@/assets/shanghai.jpg";
import zhangjiajieImg from "@/assets/zhangjiajie.jpg";
import hangzhouImg from "@/assets/hangzhou.jpg";
import guangzhouImg from "@/assets/guangzhou.jpg";
import chengduImg from "@/assets/chengdu.jpg";
import wuhanImg from "@/assets/wuhan.jpg";
import changshaImg from "@/assets/changsha.jpg";
import fuzhouImg from "@/assets/fuzhou.jpg";
import jinanImg from "@/assets/jinan.jpg";
import hefeiImg from "@/assets/hefei.jpg";
import nanchangImg from "@/assets/nanchang.jpg";
import nanningImg from "@/assets/nanning.jpg";
import type { CityKey } from "@/lib/china-geo";

/** Maps each city to its representative image. */
export const CITY_IMAGES: Record<CityKey, string> = {
  beijing: beijingImg, nanjing: nanjingImg, xian: xianImg,
  shanghai: shanghaiImg, suzhou: hangzhouImg, zhangjiajie: zhangjiajieImg,
  hangzhou: hangzhouImg, guangzhou: guangzhouImg, chengdu: chengduImg,
  wuhan: wuhanImg, changsha: changshaImg,
  fuzhou: fuzhouImg, jinan: jinanImg, hefei: hefeiImg,
  nanchang: nanchangImg, nanning: nanningImg,
  wuxi: hangzhouImg, yangzhou: nanjingImg, yancheng: nanjingImg,
  shaoxing: hangzhouImg, xuzhou: nanjingImg,
  quanzhou: fuzhouImg, xiamen: fuzhouImg,
  jiuzhaigou: zhangjiajieImg,
  dalian: shanghaiImg, shenyang: beijingImg, harbin: xianImg,
  daqing: jinanImg, changchun: nanjingImg, jilin: hefeiImg, yanji: changshaImg,
  xining: xianImg, qinghaihu: zhangjiajieImg, chaka: zhangjiajieImg,
  delingha: xianImg, dachaidan: zhangjiajieImg,
  dunhuang: xianImg, jiayuguan: xianImg, zhangye: zhangjiajieImg, lanzhou: xianImg,
};

/**
 * AI Image generation prompts for each attraction.
 * These can be used with image generation services to create unique images.
 */
export const ATTRACTION_IMAGE_PROMPTS: Record<string, string> = {
  // Beijing
  "The Forbidden City": "The Forbidden City in Beijing, China, majestic golden-roofed palaces with red walls, wide courtyards, traditional Chinese imperial architecture, morning sunlight, ultra-detailed travel photography",
  "Great Wall — Mutianyu": "The Great Wall of China at Mutianyu, winding through misty mountain ridges, ancient stone fortifications, lush green hills, dramatic clouds, cinematic travel photography",
  "Temple of Heaven": "Temple of Heaven in Beijing, circular blue-roofed hall on marble platform, traditional Ming dynasty architecture, blue sky, symmetrical gardens, travel photography",
  "Summer Palace": "Summer Palace Beijing, Kunming Lake with traditional stone bridge, ornate Chinese pavilion on hillside, willow trees, golden sunset light, serene landscape photography",
  // Shanghai
  "The Bund": "The Bund in Shanghai at golden hour, historic European-style buildings along the waterfront, warm sunset light reflecting on the Huangpu River, Pudong skyline in the background, cinematic travel photography",
  "Yu Garden & Old City": "Yu Garden in Shanghai, classical Ming dynasty garden with traditional pavilion, rockery, koi pond, red lanterns, intricate wooden carvings, peaceful atmosphere, travel photography",
  // Xi'an
  "Terracotta Warriors": "Terracotta Army in Xi'an, China, rows of ancient clay soldiers in underground pit, dramatic museum lighting, archaeological wonder, detailed statues, historical photography",
  // Add more as needed
};

/** Get the best available image for an attraction. */
export function getAttractionImage(city: CityKey, attractionName: string): string {
  // In production, this would return AI-generated image URLs
  // For now, return the city image as a placeholder
  return CITY_IMAGES[city];
}

/** Get AI generation prompt for an attraction. */
export function getAttractionImagePrompt(attractionName: string): string | undefined {
  return ATTRACTION_IMAGE_PROMPTS[attractionName];
}
