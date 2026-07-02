/**
 * 城市景点地图数据（纯数据，无 React/Leaflet 依赖）。
 * 供 AttractionsMap 组件和 PDF 导出等模块安全导入。
 */

import type { CityKey } from "./china-geo";

export type AttractionCoord = {
  name: string;
  position: [number, number];
  image: string;
  desc: string;
};

export type CityMapData = {
  center: [number, number];
  zoom: number;
  attractions: AttractionCoord[];
};

export const CITY_MAPS: Record<CityKey, CityMapData> = {
  beijing: {
    center: [39.9042, 116.4074], zoom: 11,
    attractions: [
      { name: "The Forbidden City", position: [39.9163, 116.3972], image: "", desc: "World's largest palace complex — home to 24 Ming and Qing emperors." },
      { name: "Great Wall — Mutianyu", position: [40.4319, 116.5704], image: "", desc: "Best-restored, less-crowded section of the Great Wall." },
      { name: "Temple of Heaven", position: [39.8822, 116.4066], image: "", desc: "Ming-dynasty altar where emperors prayed for good harvest." },
      { name: "Summer Palace", position: [39.9999, 116.2755], image: "", desc: "Imperial garden with Kunming Lake and the Long Corridor." },
      { name: "Nanluoguxiang Hutongs", position: [39.9376, 116.4035], image: "", desc: "Narrow alleys of old Beijing — perfect for a rickshaw ride." },
      { name: "Tiananmen Square", position: [39.9055, 116.3976], image: "", desc: "World's largest public square — 44 hectares of history." },
      { name: "Jingshan Park", position: [39.9245, 116.3971], image: "", desc: "Best panoramic view of the Forbidden City's golden roofs." },
      { name: "Lama Temple", position: [39.9472, 116.4455], image: "", desc: "Beijing's most magnificent Tibetan Buddhist temple." },
      { name: "798 Art District", position: [39.9854, 116.4975], image: "", desc: "Avant-garde art hub in Soviet-era industrial buildings." },
      { name: "National Museum of China", position: [39.9053, 116.4012], image: "", desc: "World's second-largest museum with 1.7 million artifacts." },
      { name: "Olympic Park", position: [39.9929, 116.3965], image: "", desc: "Bird's Nest and Water Cube — 2008 Olympic legacy." },
    ],
  },
  nanjing: {
    center: [32.0603, 118.7969], zoom: 12,
    attractions: [
      { name: "Sun Yat-sen Mausoleum", position: [32.0606, 118.8520], image: "", desc: "Grand hillside tomb of modern China's founding father." },
      { name: "Ming City Wall — Zhonghua Gate", position: [32.0142, 118.7788], image: "", desc: "World's longest surviving city wall (35 km)." },
      { name: "Confucius Temple & Qinhuai River", position: [32.0212, 118.7861], image: "", desc: "Historic temple with glowing night boat rides." },
      { name: "Xuanwu Lake", position: [32.0723, 118.7944], image: "", desc: "Imperial lake park with five interconnected islands." },
      { name: "Nanjing Massacre Memorial", position: [32.0376, 118.7416], image: "", desc: "Powerful memorial — free entry, arrive early." },
      { name: "Ming Xiaoling Mausoleum", position: [32.0572, 118.8453], image: "", desc: "China's largest imperial tomb with 600m sacred way." },
      { name: "Presidential Palace", position: [32.0434, 118.7939], image: "", desc: "600-year-old complex blending Chinese gardens and Western architecture." },
      { name: "Jiming Temple", position: [32.0635, 118.7447], image: "", desc: "Nanjing's oldest Buddhist temple — famous for cherry blossoms." },
      { name: "Nanjing Museum", position: [32.0428, 118.8207], image: "", desc: "One of China's three greatest museums." },
      { name: "Niushou Mountain", position: [31.8897, 118.6843], image: "", desc: "Modern architectural marvel housing Buddha parietal bone relic." },
      { name: "Yuejiang Tower", position: [32.0867, 118.7410], image: "", desc: "One of China's ten famous historical towers." },
    ],
  },
  xian: {
    center: [34.3416, 108.9398], zoom: 10,
    attractions: [
      { name: "Terracotta Warriors", position: [34.3848, 109.2734], image: "", desc: "8,000 life-sized clay soldiers guarding Emperor Qin's tomb." },
      { name: "Xi'an City Wall", position: [34.2611, 108.9407], image: "", desc: "14 km of intact Ming-dynasty wall — rent a bike on top." },
      { name: "Muslim Quarter", position: [34.2658, 108.9395], image: "", desc: "Bustling alleys packed with Hui-Muslim food stalls." },
      { name: "Big Wild Goose Pagoda", position: [34.2225, 108.9594], image: "", desc: "Tang-dynasty Buddhist pagoda built in 652 AD." },
      { name: "Mount Hua", position: [34.483, 110.0865], image: "", desc: "One of China's Five Sacred Mountains — jaw-dropping cliff paths." },
      { name: "Bell & Drum Towers", position: [34.2608, 108.9423], image: "", desc: "Iconic twin towers at the city's heart." },
      { name: "Datang Everbright City", position: [34.2176, 108.9611], image: "", desc: "2.1km Tang-dynasty themed street with light shows and performers." },
      { name: "Shaanxi History Museum", position: [34.2257, 108.9465], image: "", desc: "370,000+ artifacts from 13 dynasties." },
      { name: "Huaqing Palace", position: [34.3635, 109.4112], image: "", desc: "3,000-year-old imperial hot spring palace." },
      { name: "Datang Furong Garden", position: [34.2209, 108.9684], image: "", desc: "Tang-dynasty themed garden with pavilions and lake." },
    ],
  },
  shanghai: {
    center: [31.2304, 121.4737], zoom: 11,
    attractions: [
      { name: "The Bund", position: [31.2397, 121.4900], image: "", desc: "Riverside promenade with 1920s European facades facing Lujiazui." },
      { name: "Yu Garden & Old City", position: [31.2272, 121.4920], image: "", desc: "Classical Ming garden ringed by teahouses and snack stalls." },
      { name: "French Concession", position: [31.2123, 121.4561], image: "", desc: "Tree-lined streets with art deco villas and the best cafés." },
      { name: "Shanghai Tower", position: [31.2336, 121.5054], image: "", desc: "World's 3rd tallest building — 118F observation deck." },
      { name: "Zhujiajiao Water Town", position: [31.1119, 121.0531], image: "", desc: "1,700-year-old canal town with stone bridges and boat rides." },
      { name: "Oriental Pearl TV Tower", position: [31.2397, 121.4998], image: "", desc: "Iconic TV tower with 15 observation decks." },
      { name: "Nanjing Road", position: [31.2356, 121.4737], image: "", desc: "China's most famous shopping street — 1.2 km of neon." },
      { name: "Xintiandi & Tianzifang", position: [31.2216, 121.4699], image: "", desc: "Two adjacent neighborhoods: sleek Xintiandi and maze-like Tianzifang." },
      { name: "Jade Buddha Temple", position: [31.2451, 121.4455], image: "", desc: "Shanghai's most famous Buddhist temple with jade Buddha statues." },
      { name: "Shanghai Disney Resort", position: [31.1413, 121.6599], image: "", desc: "Mainland China's first Disney park with six themed lands." },
      { name: "Maglev Train", position: [31.2044, 121.5049], image: "", desc: "World's fastest commercial train — 431 km/h." },
      { name: "Shanghai Museum", position: [31.2284, 121.4453], image: "", desc: "Bronze ding-shaped building with 120,000+ artifacts." },
    ],
  },
  suzhou: {
    center: [31.2990, 120.5853], zoom: 12,
    attractions: [
      { name: "Humble Administrator's Garden", position: [31.3260, 120.6240], image: "", desc: "Largest and most celebrated Suzhou classical garden — UNESCO World Heritage." },
      { name: "Tiger Hill", position: [31.3379, 120.5813], image: "", desc: "Suzhou's iconic landmark with the 1,000-year-old leaning Yunyan Pagoda." },
      { name: "Suzhou Museum", position: [31.3257, 120.6248], image: "", desc: "I.M. Pei's stunning museum blending classical Suzhou architecture with modernism." },
      { name: "Shantang Street", position: [31.3180, 120.5872], image: "", desc: "1,200-year-old canal street with Ming/Qing shops and red lanterns." },
      { name: "Pingjiang Road", position: [31.3106, 120.6355], image: "", desc: "Best-preserved historic street along a Song-dynasty canal." },
      { name: "Hanshan Temple", position: [31.3156, 120.5675], image: "", desc: "1,500-year-old temple immortalized by a famous Tang-dynasty poem." },
      { name: "Lingering Garden", position: [31.3193, 120.5986], image: "", desc: "One of China's four most famous gardens — masterful spatial layering." },
      { name: "Panmen Gate", position: [31.2960, 120.6144], image: "", desc: "Rare surviving water-and-land gate complex from 514 BC." },
      { name: "Lion Grove Garden", position: [31.3252, 120.6270], image: "", desc: "Yuan-dynasty garden famous for its labyrinthine limestone rockery." },
      { name: "Jinji Lake", position: [31.3150, 120.6776], image: "", desc: "Suzhou's modern district with skyline views and musical fountain shows." },
    ],
  },
  zhangjiajie: {
    center: [29.3456, 110.4388], zoom: 12,
    attractions: [
      { name: "Zhangjiajie National Forest Park", position: [29.3308, 110.4113], image: "", desc: "China's first national forest park — 3,000+ sandstone pillars rising from misty valleys." },
      { name: "Tianmen Mountain", position: [29.0527, 110.4763], image: "", desc: "Iconic 'Heaven's Gate' arch with 7.5 km cable car and glass cliff walkways." },
      { name: "Glass Bridge", position: [29.3903, 110.6883], image: "", desc: "World's longest & highest glass-bottomed bridge spanning 430m across a canyon." },
      { name: "Yuanjiajie — Hallelujah Mountain", position: [29.3442, 110.4464], image: "", desc: "The Avatar floating mountain viewpoint." },
      { name: "Baofeng Lake", position: [29.3224, 110.5246], image: "", desc: "Emerald lake amid sandstone peaks with Tujia folk-song boat rides." },
    ],
  },
  jiuzhaigou: {
    center: [33.2634, 103.8988], zoom: 13,
    attractions: [
      { name: "Jiuzhaigou Valley", position: [33.1630, 103.9200], image: "", desc: "UNESCO World Heritage — 114 turquoise lakes in a Y-shaped glacial valley." },
      { name: "Five Flower Lake", position: [33.1800, 103.9050], image: "", desc: "The crown jewel — crystal-clear water revealing ancient fallen trees below." },
      { name: "Nuorilang Waterfall", position: [33.1700, 103.9100], image: "", desc: "China's widest waterfall at 270m — the valley's thunderous heart." },
      { name: "Pearl Shoal", position: [33.1750, 103.9000], image: "", desc: "A vast travertine cascade where water tumbles like scattered pearls." },
      { name: "Shuzheng Lakes", position: [33.2000, 103.9100], image: "", desc: "19 terraced lakes in a staircase formation — the valley's entrance gallery." },
    ],
  },
  hangzhou: {
    center: [30.2741, 120.1551], zoom: 11,
    attractions: [
      { name: "West Lake (西湖)", position: [30.2419, 120.1489], image: "", desc: "UNESCO-listed lake with ancient causeways, pagodas, and weeping willows." },
      { name: "Lingyin Temple (灵隐寺)", position: [30.2433, 120.0980], image: "", desc: "1,700-year-old Buddhist temple nestled in forested hills." },
      { name: "Longjing Tea Village", position: [30.2209, 120.1278], image: "", desc: "Terraced tea plantations — try freshly roasted Dragon Well tea." },
      { name: "Hefang Street", position: [30.2410, 120.1687], image: "", desc: "Historic pedestrian street with traditional shops and snacks." },
      { name: "Xixi National Wetland", position: [30.2688, 120.0723], image: "", desc: "Vast wetland park with boat rides through lotus ponds and bamboo groves." },
    ],
  },
  guangzhou: {
    center: [23.1291, 113.2644], zoom: 11,
    attractions: [
      { name: "Canton Tower", position: [23.1097, 113.3246], image: "", desc: "600m iconic tower with a sky drop ride and panoramic city views." },
      { name: "Chen Clan Academy", position: [23.1313, 113.2474], image: "", desc: "Exquisite Qing-dynasty ancestral hall with intricate carvings." },
      { name: "Shamian Island", position: [23.1130, 113.2445], image: "", desc: "Tree-shaded colonial-era island with European architecture and cafés." },
      { name: "Yuexiu Park", position: [23.1408, 113.2678], image: "", desc: "Largest park in the city, home to the iconic Five Rams statue." },
      { name: "Baiyun Mountain", position: [23.1740, 113.2910], image: "", desc: "Scenic mountain ridge with hiking trails and a cable car to the peak." },
    ],
  },
  chengdu: {
    center: [30.5728, 104.0668], zoom: 11,
    attractions: [
      { name: "Panda Breeding Base", position: [30.7338, 104.1444], image: "", desc: "The best place to see giant pandas — go early for feeding time." },
      { name: "Jinli Ancient Street", position: [30.6460, 104.0473], image: "", desc: "Lantern-lit Ming/Qing-era street with Sichuan snacks and crafts." },
      { name: "Wuhou Shrine", position: [30.6460, 104.0486], image: "", desc: "Historic temple dedicated to Zhuge Liang of the Three Kingdoms era." },
      { name: "People's Park", position: [30.6590, 104.0553], image: "", desc: "Iconic park with matchmaking corner, teahouses, and ear-cleaning services." },
      { name: "Mount Qingcheng", position: [30.9728, 103.5133], image: "", desc: "Taoist holy mountain with ancient temples and misty forest trails." },
    ],
  },
  wuhan: {
    center: [30.5928, 114.3055], zoom: 11,
    attractions: [
      { name: "Yellow Crane Tower", position: [30.5474, 114.2973], image: "", desc: "Legendary 1,800-year-old pagoda overlooking the Yangtze River." },
      { name: "East Lake", position: [30.5512, 114.3780], image: "", desc: "China's largest urban lake — bike paths, plum blossoms, and cherry gardens." },
      { name: "Hubei Provincial Museum", position: [30.5573, 114.3615], image: "", desc: "Home to the 2,400-year-old Bianzhong bronze bell set and Sword of Goujian." },
      { name: "Jianghan Road", position: [30.5817, 114.2908], image: "", desc: "Century-old pedestrian boulevard with art deco buildings and hot-dry noodles." },
      { name: "Hubu Alley", position: [30.5470, 114.3010], image: "", desc: "Wuhan's breakfast alley — try 10 kinds of street food in one morning." },
    ],
  },
  changsha: {
    center: [28.2282, 112.9388], zoom: 11,
    attractions: [
      { name: "Orange Isle (橘子洲)", position: [28.1896, 112.9569], image: "", desc: "Long island park with a giant Mao Zedong Youth statue and river views." },
      { name: "Yuelu Mountain", position: [28.1874, 112.9304], image: "", desc: "Forested scenic area with the 1,000-year-old Yuelu Academy at its foot." },
      { name: "Hunan Museum", position: [28.2153, 112.9977], image: "", desc: "See the 2,100-year-old Mawangdui Han tomb artifacts and preserved mummy." },
      { name: "Taiping Street", position: [28.1986, 112.9717], image: "", desc: "Qing-dynasty stone alley packed with stinky tofu and milk tea shops." },
      { name: "Window of the World", position: [28.2380, 113.0560], image: "", desc: "Theme park with miniature landmarks and cultural performances." },
    ],
  },
  fuzhou: {
    center: [26.0745, 119.2965], zoom: 12,
    attractions: [
      { name: "Three Lanes & Seven Alleys", position: [26.0848, 119.2944], image: "", desc: "Ming/Qing-era pedestrian quarter with white-walled courtyard homes." },
      { name: "Drum Mountain (鼓山)", position: [26.0568, 119.3823], image: "", desc: "Fuzhou's iconic mountain with ancient Yongquan Temple at the summit." },
      { name: "West Lake Park", position: [26.0957, 119.2871], image: "", desc: "Classical garden lake with willow-lined paths and island pavilions." },
      { name: "Shangxiahang", position: [26.0522, 119.3086], image: "", desc: "Revitalized historic wharf district with Fuzhou fish ball shops and tea houses." },
      { name: "Gushan Scenic Area", position: [26.0548, 119.3900], image: "", desc: "Hiking trails through pine forests to panoramic city viewpoints." },
    ],
  },
  jinan: {
    center: [36.6512, 117.1201], zoom: 11,
    attractions: [
      { name: "Baotu Spring (趵突泉)", position: [36.6617, 117.0145], image: "", desc: "Famed artesian spring — the 'Number One Spring Under Heaven'." },
      { name: "Daming Lake", position: [36.6766, 117.0178], image: "", desc: "Scenic lake park with willow banks, lotus ponds, and pavilions." },
      { name: "Thousand Buddha Mountain", position: [36.6403, 117.0340], image: "", desc: "Hillside park with Sui-dynasty Buddha carvings and city panoramas." },
      { name: "Furong Street", position: [36.6670, 117.0248], image: "", desc: "Ancient food street famed for Shandong pancakes and oil-spun noodles." },
      { name: "Shandong Museum", position: [36.6624, 117.0882], image: "", desc: "Massive provincial museum with Neolithic to Han dynasty artifacts." },
    ],
  },
  hefei: {
    center: [31.8206, 117.2273], zoom: 11,
    attractions: [
      { name: "Lord Bao Park", position: [31.8533, 117.2896], image: "", desc: "Riverside park and temple dedicated to the legendary incorruptible judge Bao Zheng." },
      { name: "Swan Lake", position: [31.8251, 117.2233], image: "", desc: "Modern urban lake with light shows and waterfront promenades." },
      { name: "Li Hongzhang Residence", position: [31.8658, 117.2927], image: "", desc: "Well-preserved Qing official's mansion in the city center." },
      { name: "Huaihe Road Pedestrian Street", position: [31.8660, 117.2866], image: "", desc: "Bustling shopping street with Anhui cuisine restaurants and street food." },
      { name: "Anhui Museum", position: [31.8375, 117.2642], image: "", desc: "Showcases Huizhou culture, bronze artifacts, and the Four Treasures of Study." },
    ],
  },
  nanchang: {
    center: [28.6820, 115.8580], zoom: 11,
    attractions: [
      { name: "Tengwang Pavilion", position: [28.6829, 115.8770], image: "", desc: "Magnificent Tang-dynasty riverside pavilion immortalized in classic poetry." },
      { name: "Bayi Square", position: [28.6788, 115.8989], image: "", desc: "Central city square with the Nanchang Uprising monument." },
      { name: "Shengjin Pagoda", position: [28.6756, 115.8884], image: "", desc: "Ancient golden-roofed pagoda in the heart of the old city." },
      { name: "Shengjin Pagoda Street", position: [28.6750, 115.8871], image: "", desc: "Food street around the pagoda — try Nanchang rice noodles and clay-pot soup." },
      { name: "Meiling Scenic Area", position: [28.7500, 115.7500], image: "", desc: "Mountain resort with waterfalls, hiking trails, and terraced tea gardens." },
    ],
  },
  nanning: {
    center: [22.8170, 108.3665], zoom: 11,
    attractions: [
      { name: "Qingxiu Mountain", position: [22.7950, 108.3676], image: "", desc: "Lush 5A-rated mountain park with temples, pagodas, and tropical gardens." },
      { name: "Guangxi Museum", position: [22.8170, 108.3304], image: "", desc: "Excellent collection of Zhuang minority heritage and bronze drums." },
      { name: "Nanhu Lake Park", position: [22.8085, 108.3643], image: "", desc: "Palm-lined lake park perfect for evening strolls amid the Green City." },
      { name: "Zhongshan Road Night Market", position: [22.8141, 108.3238], image: "", desc: "Legendary night market with snail noodles, BBQ seafood, and tropical fruit." },
      { name: "Detian Waterfall", position: [22.8520, 106.7240], image: "", desc: "Asia's largest cross-border waterfall on the China-Vietnam border (day trip)." },
    ],
  },
  dalian: {
    center: [38.9140, 121.6147], zoom: 11,
    attractions: [
      { name: "Xinghai Square", position: [38.8863, 121.6004], image: "", desc: "Asia's largest public square overlooking the Bohai Sea — perfect for evening strolls." },
      { name: "Russian Street", position: [38.9235, 121.6393], image: "", desc: "Charming European-style street with Russian architecture and cozy cafés." },
      { name: "Tiger Beach Ocean Park", position: [38.8620, 121.6642], image: "", desc: "Massive marine park with dolphin shows, polar bears, and underwater tunnels." },
      { name: "Bangchuidao Scenic Area", position: [38.8569, 121.6805], image: "", desc: "Coastal park with unique rock formations, beaches, and sea-view pavilions." },
      { name: "Shengya Ocean World", position: [38.8543, 121.6598], image: "", desc: "One of China's largest aquariums with polar exhibits and whale shows." },
    ],
  },
  shenyang: {
    center: [41.8057, 123.4315], zoom: 11,
    attractions: [
      { name: "Shenyang Imperial Palace", position: [41.7964, 123.4504], image: "", desc: "Manchurian Qing-dynasty palace complex — smaller sibling of Beijing's Forbidden City." },
      { name: "North Tomb (Zhaoling)", position: [41.8386, 123.4249], image: "", desc: "UNESCO-listed imperial tomb of Huang Taiji with sacred pine avenues." },
      { name: "Zhongshan Square", position: [41.7987, 123.4255], image: "", desc: "Historic European-style square surrounded by 1920s colonial buildings." },
      { name: "9·18 Historical Museum", position: [41.8334, 123.4654], image: "", desc: "Powerful memorial documenting the Mukden Incident and Japanese invasion." },
      { name: "Shenyang Forest Zoo", position: [41.8707, 123.5919], image: "", desc: "Sprawling zoo with pandas, Siberian tigers, and a cable car ride." },
    ],
  },
  harbin: {
    center: [45.8038, 126.5340], zoom: 11,
    attractions: [
      { name: "Harbin Ice & Snow World", position: [45.7842, 126.5707], image: "", desc: "World's largest ice festival with illuminated sculptures and ice slides." },
      { name: "St. Sophia Cathedral", position: [45.7725, 126.6247], image: "", desc: "Beautiful Russian Orthodox church housing a photography exhibition." },
      { name: "Central Street (Zhongyang Dajie)", position: [45.7700, 126.6193], image: "", desc: "Historic cobblestone street with European architecture and Harbin sausages." },
      { name: "Sun Island Scenic Area", position: [45.7896, 126.5988], image: "", desc: "Riverside park with Russian villas, flower gardens, and winter snow sculptures." },
      { name: "Tiger Park", position: [45.8260, 126.5700], image: "", desc: "World's largest Siberian tiger breeding center with safari bus tours." },
    ],
  },
  daqing: {
    center: [46.5902, 125.1031], zoom: 12,
    attractions: [
      { name: "Daqing Oilfield Exhibition Hall", position: [46.5845, 125.1150], image: "", desc: "Learn about China's petroleum history and the 'Iron Man' Wang Jinxi." },
      { name: "Iron Man Memorial", position: [46.5860, 125.1040], image: "", desc: "Monument dedicated to the legendary oil worker Wang Jinxi, symbol of industrial spirit." },
      { name: "Daqing Forest Park", position: [46.5700, 125.0900], image: "", desc: "Green oasis in the oil city with lakes, walking trails, and recreational facilities." },
      { name: "Daqing Museum", position: [46.5800, 125.1100], image: "", desc: "Comprehensive museum showcasing the city's petroleum heritage and development." },
      { name: "Longfeng Wetland", position: [46.6000, 125.0800], image: "", desc: "Ecological wetland area providing habitat for migratory birds and natural scenery." },
    ],
  },
  changchun: {
    center: [43.8171, 125.3235], zoom: 11,
    attractions: [
      { name: "Puppet Emperor's Palace", position: [43.8880, 125.3267], image: "", desc: "Former residence of Puyi, China's last emperor, during the Japanese puppet regime." },
      { name: "Jingyuetan National Forest Park", position: [43.8000, 125.4500], image: "", desc: "Known as 'Taiwan of the North' — vast artificial forest with a scenic lake." },
      { name: "Changchun Film Studio", position: [43.8600, 125.3000], image: "", desc: "China's oldest film studio with exhibits on cinematic history and production." },
      { name: "World Sculpture Park", position: [43.8200, 125.2800], image: "", desc: "Open-air museum featuring sculptures from artists around the world." },
      { name: "Nanhu Park", position: [43.8500, 125.3200], image: "", desc: "Scenic urban park with a large lake, walking paths, and recreational facilities." },
    ],
  },
  jilin: {
    center: [43.8378, 126.5496], zoom: 11,
    attractions: [
      { name: "Songhua Lake", position: [43.7200, 126.6500], image: "", desc: "Beautiful reservoir lake surrounded by mountains — perfect for boating and hiking." },
      { name: "Beishan Park", position: [43.8500, 126.5700], image: "", desc: "Historic hilltop park with temples, pagodas, and panoramic city views." },
      { name: "Jilin Meteorite Museum", position: [43.8600, 126.5800], image: "", desc: "Unique museum displaying the world's largest meteorite collection." },
      { name: "Wusong Island", position: [43.7800, 126.6200], image: "", desc: "Scenic island on the Songhua River known for its winter rime ice scenery." },
      { name: "Longtan Mountain Park", position: [43.8800, 126.5900], image: "", desc: "Forest park with walking trails, temples, and natural landscapes." },
    ],
  },
  yanji: {
    center: [42.9047, 129.5136], zoom: 12,
    attractions: [
      { name: "Yanbian Korean Autonomous Prefecture Museum", position: [42.9100, 129.5200], image: "", desc: "Showcases the unique culture and history of China's Korean ethnic minority." },
      { name: "Maoershan National Forest Park", position: [42.9500, 129.5500], image: "", desc: "Mountain park with hiking trails, ski slopes, and beautiful autumn foliage." },
      { name: "Yanji People's Park", position: [42.9000, 129.5000], image: "", desc: "Central urban park featuring Korean-style pavilions and cultural performances." },
      { name: "Korean Folk Village", position: [42.9200, 129.5300], image: "", desc: "Experience traditional Korean architecture, food, and cultural activities." },
      { name: "Tumen River Border", position: [42.9600, 129.8400], image: "", desc: "Viewpoint overlooking the border with North Korea across the Tumen River." },
    ],
  },

  // ===== 青甘大环线 =====
  xining: {
    center: [36.6171, 101.7785], zoom: 12,
    attractions: [
      { name: "Ta'er Monastery", position: [36.4910, 101.5750], image: "", desc: "One of the six great Tibetan Buddhist monasteries — birthplace of Tsongkhapa." },
      { name: "Dongguan Grand Mosque", position: [36.6160, 101.7970], image: "", desc: "One of China's largest mosques dating to the Ming dynasty." },
      { name: "Qinghai Provincial Museum", position: [36.6270, 101.7810], image: "", desc: "Excellent introduction to Qinghai's diverse ethnic cultures and Silk Road history." },
      { name: "Mojia Street Night Market", position: [36.6200, 101.8050], image: "", desc: "Xining's legendary food street with lamb skewers and hand-pulled noodles." },
    ],
  },
  qinghaihu: {
    center: [36.8824, 100.1867], zoom: 10,
    attractions: [
      { name: "Erlangjian Scenic Area", position: [36.5750, 100.5020], image: "", desc: "Peninsula stretching into sapphire-blue Qinghai Lake — China's largest alpine lake." },
      { name: "Rapeseed Flower Fields", position: [36.7300, 99.7800], image: "", desc: "Golden rapeseed fields framing the blue lake from July to early August." },
      { name: "Heimahe Sunrise Viewpoint", position: [36.7700, 99.8020], image: "", desc: "Iconic sunrise spot where the lake mirrors the golden-pink sky." },
      { name: "Bird Island", position: [37.0470, 99.6010], image: "", desc: "Sanctuary for migratory birds on the western shore of Qinghai Lake." },
    ],
  },
  chaka: {
    center: [36.7920, 99.0850], zoom: 13,
    attractions: [
      { name: "Sky Mirror Salt Flat", position: [36.7910, 99.0950], image: "", desc: "Walk on a vast salt lake that creates perfect mirror reflections — China's 'Bolivia'." },
      { name: "Salt Sculpture Park", position: [36.7880, 99.0980], image: "", desc: "Impressive sculptures carved from the lake's own salt crystals." },
      { name: "Scenic Salt Train", position: [36.7930, 99.0920], image: "", desc: "Charming miniature train through the surreal white salt landscape." },
    ],
  },
  delingha: {
    center: [37.3740, 97.3700], zoom: 11,
    attractions: [
      { name: "Keluke & Tuosu Twin Lakes", position: [37.2850, 96.8640], image: "", desc: "'Lovers' Lakes' — freshwater Keluke with birds and saline Tuosu with alien shorelines." },
      { name: "Haizi Poetry Museum", position: [37.3740, 97.3670], image: "", desc: "Small museum dedicated to the poet who immortalized Delingha in verse." },
    ],
  },
  dachaidan: {
    center: [37.8550, 95.3600], zoom: 10,
    attractions: [
      { name: "Emerald Lake", position: [37.8550, 95.2550], image: "", desc: "Brilliant turquoise salt ponds against snow mountains — like scattered gemstones." },
      { name: "Nanbaxian Yardang Ghost City", position: [38.1210, 94.3190], image: "", desc: "Vast Martian-like wind-eroded rock formations in total silence." },
      { name: "Water Yardang", position: [38.1270, 93.7600], image: "", desc: "Rare yardang formations rising from a turquoise lake in the Qaidam Basin." },
    ],
  },
  dunhuang: {
    center: [40.1421, 94.6619], zoom: 11,
    attractions: [
      { name: "Mogao Caves", position: [40.0360, 94.8070], image: "", desc: "UNESCO site with 492 caves and 45,000 sqm of Buddhist murals spanning 1,000 years." },
      { name: "Mingsha Dunes & Crescent Spring", position: [40.0860, 94.6700], image: "", desc: "Towering golden sand dunes surrounding a moon-shaped oasis that has never dried." },
      { name: "Yumen Pass", position: [40.3540, 93.8780], image: "", desc: "Han dynasty frontier fortress in the vast Gobi — where Tang poets wrote of exile." },
      { name: "Shazhou Night Market", position: [40.1410, 94.6650], image: "", desc: "Dunhuang's bustling night bazaar with Silk Road food and crafts under red lanterns." },
    ],
  },
  jiayuguan: {
    center: [39.7725, 98.2892], zoom: 12,
    attractions: [
      { name: "Jiayuguan Fortress", position: [39.8010, 98.2180], image: "", desc: "The Ming Great Wall's westernmost garrison — 'Impregnable Pass Under Heaven.'" },
      { name: "Overhanging Great Wall", position: [39.8540, 98.2350], image: "", desc: "Steep Great Wall climbing dramatically up a cliff face with Gobi panoramas." },
      { name: "First Beacon Tower", position: [39.7400, 98.2890], image: "", desc: "Earthen beacon marking the Great Wall's true western starting point." },
    ],
  },
  zhangye: {
    center: [38.9318, 100.4553], zoom: 11,
    attractions: [
      { name: "Rainbow Danxia Landform", position: [38.9340, 99.9960], image: "", desc: "UNESCO site — rainbow-striped mountains created by 24 million years of mineral deposits." },
      { name: "Giant Buddha Temple", position: [38.9370, 100.4570], image: "", desc: "Home to China's largest indoor reclining Buddha — 34.5m from 1098 AD." },
      { name: "Mati Temple Grottoes", position: [38.4820, 100.4300], image: "", desc: "Cliffside Tibetan Buddhist cave complex carved into a mountain face." },
      { name: "Binggou Danxia", position: [38.9580, 99.9330], image: "", desc: "Castle-like sandstone pillars — a different, more sculptural type of Danxia." },
    ],
  },
  lanzhou: {
    center: [36.0611, 103.8343], zoom: 12,
    attractions: [
      { name: "Yellow River Iron Bridge", position: [36.0640, 103.8170], image: "", desc: "China's first iron bridge across the Yellow River — a 1907 landmark glowing at night." },
      { name: "White Pagoda Mountain Park", position: [36.0670, 103.8140], image: "", desc: "Hillside with a 15th-century pagoda offering panoramic Yellow River views." },
      { name: "Gansu Provincial Museum", position: [36.0630, 103.7730], image: "", desc: "Home to the iconic 'Galloping Horse' bronze — China's national tourism symbol." },
      { name: "Yellow River Mother Sculpture", position: [36.0660, 103.8020], image: "", desc: "Iconic riverside sculpture symbolizing the Yellow River as cradle of civilization." },
      { name: "Wuquan Mountain Park", position: [36.0460, 103.8300], image: "", desc: "Historic hillside park with natural springs and Ming-dynasty temples." },
      { name: "Waterwheel Garden", position: [36.0610, 103.8330], image: "", desc: "Open-air museum of giant wooden waterwheels showing irrigation heritage." },
      { name: "Zhengning Road Night Market", position: [36.0550, 103.8190], image: "", desc: "Lanzhou's legendary food street — spiritual home of authentic beef noodles." },
    ],
  },
};
