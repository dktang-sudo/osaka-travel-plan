export interface RouteOption {
  id: string;
  label: string; // 버튼 표시 텍스트
  badge?: string; // 예: "도보 5분", "직행 10분", "지하철 35분"
  originTitle: string;
  originLocation: string;
  destinationTitle: string;
  destinationLocation: string;
  destinationJapanese?: string; // 현지인/택시 기사에게 보여줄 일본어 명칭
  originQuery?: string;
  destinationQuery?: string;
  transportMode?: 'walking' | 'transit' | 'driving';
  description?: string;
  offlineSteps?: string[]; // 오프라인에서도 볼 수 있는 턴바이턴 도보/환승 안내
  isPrimary?: boolean;
}

export interface VocabItem {
  id: string;
  korean: string;        // 한국어 뜻
  japanese: string;      // 일본어 한자/가나
  pronunciation: string; // 한국어 발음
  category: 'ticket' | 'order' | 'shopping' | 'transport' | 'service' | 'general';
  image?: string;        // 시각 자료 이미지 경로
  situationTip?: string; // 현지 사용 팁
}

export interface VocabularyCategory {
  categoryName: string; // 카테고리 명칭
  items: VocabItem[];
}

export interface FamilyMemberQR {
  id: string;
  name: string;      // 예: "PARK DAEKYU"
  role: string;      // 예: "👨 아빠 (내꺼)"
  image: string;     // 예: "/images/vouchers/vjw_dad_qr.jpg"
  description?: string;
}

export interface VoucherData {
  id: string;
  title: string;
  subtitle: string;
  bookingNo?: string;
  travelerName?: string;
  date?: string;
  time?: string;
  location?: string;
  image: string; // public 경로 (예: '/images/vouchers/innn_pickup_qr.jpg')
  badge: string;
  usageGuide: string;
  note?: string;
  familyMembers?: FamilyMemberQR[]; // 3인 가족 QR 전환 지원!
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  category: 'transport' | 'sightseeing' | 'food' | 'shopping' | 'hotel' | 'theme_park';
  icon: string;
  location: string;
  coordinates: { lat: number; lng: number };
  googleMapsUrl?: string;
  description: string;
  recommendations: string[];
  precautions: string[];
  routes?: RouteOption[];
  vocabCategories?: VocabularyCategory[];
  voucher?: VoucherData;
}

export interface DayChecklist {
  id: string;
  text: string;
  isImportant?: boolean;
}

export interface DayItinerary {
  dayNumber: number;
  dateStr: string;
  dayOfWeek: string;
  title: string;
  tagline: string;
  hotelInfo: string;
  themeColor: string;
  gradient: string;
  badge: {
    text: string;
    type: 'warning' | 'highlight' | 'info' | 'success';
  };
  summaryItems: string[];
  dayRouteQuery: string;
  googleEmbedMapUrl: string;
  schedule: ScheduleItem[];
  checklist: DayChecklist[];
  generalTips: string[];
}

export interface TripOverviewInfo {
  title: string;
  subtitle: string;
  dates: string;
  members: string;
  flights: {
    departure: string;
    return: string;
  };
  hotels: {
    hotel1: { name: string; period: string; note: string };
    hotel2: { name: string; period: string; note: string };
  };
  reservations: string[];
}

export const TRIP_INFO: TripOverviewInfo = {
  title: "OSAKA TRIP 2026",
  subtitle: "보고, 먹고, 즐기고, 함께하는 행복한 오사카의 추억 ❤️",
  dates: "2026. 10. 4 (일) ~ 10. 9 (금) 5박 6일",
  members: "엄마 + 아빠 + 아들 3명 가족 여행 👨‍👩‍👦",
  flights: {
    departure: "가는 편: 10/4 (일) 아시아나 OZ114 16:40 인천(T2) ➔ 18:30 간사이(KIX)",
    return: "오는 편: 10/9 (금) 아시아나 OZ111 10:30 간사이(KIX) ➔ 14:20 인천(ICN)",
  },
  hotels: {
    hotel1: {
      name: "더 싱귤러리 호텔 & 스카이스파 (The Singulari Hotel)",
      period: "10/4 ~ 10/7 (3박)",
      note: "USJ 도보 바로 앞! 6-2-25 Shimaya, Konohana-ku, Osaka",
    },
    hotel2: {
      name: "사쿠라가와 호텔 난바 (Sakuragawa Hotel Nanba)",
      period: "10/7 ~ 10/9 (2박)",
      note: "난바/신사이바시/도톤보리 인근 숙소 (체크인 15:00 / 체크아웃 10:00)",
    },
  },
  reservations: [
    "아시아나 항공권 (OZ114 / OZ111)",
    "공항 픽업 INNN (Agoda 52,844원 성인2+아동1)",
    "더 싱귤러리 호텔 3박 (10/4~10/7)",
    "사쿠라가와 호텔 난바 2박 (10/7~10/9)",
    "가이유칸 입장권 (10/5 10:30 예매 완료)",
    "캡틴라인 왕복권 (10/5 이용 확정)",
    "USJ 입장권 + 익스프레스 패스 (10/6 10:00미니언, 12:20닌텐도/마리오, 12:50동키콩)",
    "몬스터헌터 카페 West 런치 예약 (10/7 12:00)",
    "도톤보리 리버크루즈 예약 (10/7 20:00 하나투어패스)",
    "오사카성 입장권 / eSIM / Visit Japan Web QR",
  ],
};

/**
 * 특정 일정 아이템의 동선 목록을 반환합니다.
 */
export const getItemRoutes = (
  item: ScheduleItem,
  nextItem?: ScheduleItem | null,
  dayTitle?: string
): RouteOption[] => {
  if (item.routes && item.routes.length > 0) {
    return item.routes;
  }

  if (nextItem) {
    const cleanNextTitle = nextItem.title.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    return [
      {
        id: `${item.id}-to-${nextItem.id}`,
        label: `👉 다음 목적지(${cleanNextTitle}) 동선 보기`,
        badge: '다음 이동',
        originTitle: item.title,
        originLocation: item.location,
        destinationTitle: nextItem.title,
        destinationLocation: nextItem.location,
        originQuery: `${item.title} ${item.location} Osaka`,
        destinationQuery: `${nextItem.title} ${nextItem.location} Osaka`,
        transportMode: 'transit',
        description: `${item.title}에서 ${nextItem.title}로 이동하는 추천 동선입니다.`,
        offlineSteps: [
          `[출발] ${item.location}에서 출발 준비`,
          `[이동] ${nextItem.location} 방향 표지판 또는 내비게이션 경로 확인`,
          `[도착] ${nextItem.title} 도착 및 일정 진행`,
        ],
        isPrimary: true,
      },
    ];
  }

  return [
    {
      id: `${item.id}-location`,
      label: `📍 ${item.title} 위치 구글 지도 보기`,
      badge: '현재 위치',
      originTitle: item.title,
      originLocation: item.location,
      destinationTitle: item.title,
      destinationLocation: item.location,
      originQuery: `${item.title} ${item.location} Osaka`,
      destinationQuery: `${item.title} ${item.location} Osaka`,
      description: `${item.title}의 상세 위치 및 주변 지도입니다.`,
      offlineSteps: [`[위치] ${item.location}`, `[안내] ${item.description}`],
      isPrimary: true,
    },
  ];
};

/**
 * 기본 카테고리별 필수 일본어 용어 목록
 */
const DEFAULT_VOCABS_BY_CATEGORY: Record<string, VocabularyCategory[]> = {
  hotel: [
    {
      categoryName: '🏨 숙소 & 체크인 필수 표현',
      items: [
        {
          id: 'vh-1',
          korean: '체크인 부탁드립니다.',
          japanese: 'チェックインお願いします。',
          pronunciation: '첵쿠인 오네가이시마스',
          category: 'service',
          image: '/images/vocab/ticket.svg',
          situationTip: '호텔 프런트 데스크에서 여권과 함께 보여주세요.',
        },
        {
          id: 'vh-2',
          korean: '체크인 전에 짐을 맡길 수 있을까요?',
          japanese: 'チェックイン前に荷物を預けられますか？',
          pronunciation: '첵쿠인 마에니 니모츠오 아즈케라레마스카?',
          category: 'service',
          image: '/images/vocab/ticket.svg',
          situationTip: '호텔에 일찍 도착했을 때 캐리어를 맡길 때 유용합니다.',
        },
        {
          id: 'vh-3',
          korean: '체크아웃 부탁드립니다.',
          japanese: 'チェックアウトお願いします。',
          pronunciation: '첵쿠아우토 오네가이시마스',
          category: 'service',
          image: '/images/vocab/ticket.svg',
        },
      ],
    },
  ],
  food: [
    {
      categoryName: '🍽️ 식당 주문 & 요청',
      items: [
        {
          id: 'vf-1',
          korean: '저기요! (주문할 때 부르기)',
          japanese: 'すみません！',
          pronunciation: '스미마센!',
          category: 'order',
          situationTip: '식당 직원을 부를 때 가볍게 손을 들며 말씀하세요.',
        },
        {
          id: 'vf-2',
          korean: '이것 주세요. (손가락으로 가리키며)',
          japanese: 'これ、お願いします。',
          pronunciation: '코레, 오네가이시마스',
          category: 'order',
          image: '/images/vocab/takoyaki.svg',
        },
        {
          id: 'vf-3',
          korean: '물 좀 더 주실 수 있나요?',
          japanese: 'お冷（お水）おかわりお願いします。',
          pronunciation: '오히야(오미즈) 오카와리 오네가이시마스',
          category: 'order',
        },
        {
          id: 'vf-4',
          korean: '계산 부탁드립니다.',
          japanese: 'お会計お願いします。',
          pronunciation: '오카이케이 오네가이시마스',
          category: 'order',
          situationTip: '식사를 마치고 나갈 때 카운터에서 말씀하세요.',
        },
        {
          id: 'vf-5',
          korean: '생맥주 1잔 주세요 🍺',
          japanese: '生ビール一つお願いします。',
          pronunciation: '나마비-루 히토츠 오네가이시마스',
          category: 'order',
          image: '/images/vocab/beer.svg',
        },
      ],
    },
  ],
  shopping: [
    {
      categoryName: '🛍️ 쇼핑 & 면세(Tax Free)',
      items: [
        {
          id: 'vs-1',
          korean: '면세(Tax Free) 가능한가요?',
          japanese: '免税（Tax Free）できますか？',
          pronunciation: '멘제이(텍스 프리) 데키마스카?',
          category: 'shopping',
          image: '/images/vocab/taxfree.svg',
          situationTip: '여권을 보여주며 계산 전에 말씀하세요.',
        },
        {
          id: 'vs-2',
          korean: '카드 결제 가능한가요?',
          japanese: 'カード使えますか？',
          pronunciation: '카-도 츠카에마스카?',
          category: 'shopping',
        },
      ],
    },
  ],
  transport: [
    {
      categoryName: '🚆 교통 & 승차권 표현',
      items: [
        {
          id: 'vt-1',
          korean: '성인 2장, 어린이 1장 부탁드립니다.',
          japanese: '大人2枚、小人1枚お願いします。',
          pronunciation: '오토나 니마이, 코도모 이치마이 오네가이시마스',
          category: 'ticket',
          image: '/images/vocab/ticket.svg',
        },
        {
          id: 'vt-2',
          korean: '화장실은 어디인가요?',
          japanese: 'トイレはどこですか？',
          pronunciation: '토이레와 도코데스카?',
          category: 'general',
        },
      ],
    },
  ],
};

/**
 * 특정 일정 아이템의 일본어 용어 목록을 반환합니다.
 */
export const getItemVocabs = (item: ScheduleItem): VocabularyCategory[] => {
  if (item.vocabCategories && item.vocabCategories.length > 0) {
    return item.vocabCategories;
  }
  return DEFAULT_VOCABS_BY_CATEGORY[item.category] || DEFAULT_VOCABS_BY_CATEGORY.food;
};

export const ITINERARY_DATA: DayItinerary[] = [
  // =========================================================================
  // DAY 1 (10/4 일): 간사이공항 도착 ➔ USJ 이동 [설레는 첫날! 즐거운 오사카 여행 시작 ❤️]
  // =========================================================================
  {
    dayNumber: 1,
    dateStr: "10/4",
    dayOfWeek: "일",
    title: "간사이공항 도착 ➔ USJ 이동",
    tagline: "설레는 첫날! 즐거운 오사카 여행 시작 ❤️",
    hotelInfo: "더 싱귤러리 호텔 & 스카이스파 (USJ 앞)",
    themeColor: "#3B82F6",
    gradient: "from-blue-500 to-cyan-500",
    badge: {
      text: "OZ114 16:40 & INNN 픽업",
      type: "info"
    },
    summaryItems: [
      "13:30 인천공항 T2 도착 (수속 & 면세점)",
      "16:40 인천 출발 (OZ114 아시아나)",
      "18:30 간사이공항 도착 (입국수속 & QR)",
      "19:00 공항 픽업 (INNN 전용차량 40~50분)",
      "19:50 더 싱귤러리 호텔 체크인",
      "20:30 시티워크 저녁 식사 & 쇼핑",
      "22:00 호텔 복귀 & 스카이스파 휴식"
    ],
    dayRouteQuery: "Incheon+Airport+Terminal+2+to+Kansai+Airport+to+The+Singulari+Hotel+Osaka",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=The+Singulari+Hotel+and+Skyspa+at+Universal+Studios+Japan&t=&z=14&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d1-1",
        time: "13:30",
        title: "인천공항 제2터미널 도착 🧳",
        category: "transport",
        icon: "Plane",
        location: "인천국제공항 제2여객터미널 (ICN T2)",
        coordinates: { lat: 37.4602, lng: 126.4407 },
        description: "탑승 수속 및 수하물 위탁, 출국 심사 진행 후 면세점 쇼핑 여유롭게 즐기기",
        recommendations: [
          "아시아나항공 카운터에서 모바일 체크인 수하물 전용 라인 이용",
          "출국 전 포켓 와이파이 / eSIM 세팅 및 환전 수령"
        ],
        precautions: [
          "출국 2~3시간 전 도착 추천! 16:40 출발이므로 13:30 도착 완료"
        ]
      },
      {
        id: "d1-2",
        time: "16:40 ~ 18:30",
        title: "인천 출발 ✈️ (OZ114) ➔ 간사이공항 도착 (KIX)",
        category: "transport",
        icon: "Plane",
        location: "인천공항 T2 ➔ 간사이국제공항 T1",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport",
        description: "아시아나항공 OZ114편 탑승 (비행시간 약 1시간 50분), 18:30 간사이공항 도착 후 입국 수속 진행",
        recommendations: [
          "기내에서 착륙 전 Visit Japan Web QR코드(입국심사 + 세관신고) 화면 띄워두기",
          "착륙 직후 휴대폰 eSIM 데이터 로밍 켜기"
        ],
        precautions: [
          "입국 심사(QR) ➔ 수하물 수령 ➔ 세관 통과 후 1층 도착 로비 INNN 카운터로 이동"
        ],
        voucher: {
          id: "voucher-vjw-family",
          title: "Visit Japan Web 입국심사 & 세관 QR (3인 가족)",
          subtitle: "아빠(DAEKYU) · 엄마(JIIN) · 아들(MINJAE)",
          travelerName: "가족 3명 (PARK DAEKYU / SEO JIIN / PARK MINJAE)",
          date: "2026-10-04 (일)",
          time: "18:30 간사이공항 입국 심사",
          location: "간사이국제공항 T1 입국심사대 & 세관신고 게이트",
          image: "/images/vouchers/vjw_dad_qr.jpg",
          badge: "VJW QR 코드 3명분",
          usageGuide: "상단의 가족 이름 탭을 터치하여 각자의 QR 코드를 입국심사관 또는 키오스크에 스캔하세요.",
          note: "오프라인(비행기 모드)에서도 아빠, 엄마, 아들 3명의 QR 코드가 선명하게 표시됩니다.",
          familyMembers: [
            {
              id: "vjw-dad",
              name: "PARK DAEKYU",
              role: "👨 아빠 (내꺼)",
              image: "/images/vouchers/vjw_dad_qr.jpg"
            },
            {
              id: "vjw-mom",
              name: "SEO JIIN",
              role: "👩 엄마 (와이프)",
              image: "/images/vouchers/vjw_mom_qr.jpg"
            },
            {
              id: "vjw-son",
              name: "PARK MINJAE",
              role: "👦 아들 (민재)",
              image: "/images/vouchers/vjw_son_qr.jpg"
            }
          ]
        }
      },
      {
        id: "d1-3",
        time: "19:00 ~ 19:50",
        title: "공항 픽업 (INNN) 🚐 ➔ USJ 이동 (약 40~50분)",
        category: "transport",
        icon: "Car",
        location: "간사이공항 도착층 INNN 카운터 ➔ 더 싱귤러리 호텔",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Singulari+Hotel+and+Skyspa",
        description: "INNN 카운터에서 예약번호 제시 후 전용차량 탑승, 편안하게 더 싱귤러리 호텔로 직행 (Agoda 예약 52,844원 성인 2명+아동 1명 무료)",
        recommendations: [
          "★ 리무진 버스는 17:00 막차로 이용 불가하므로 사전 예약한 INNN 전용 픽업 차량으로 편안하게 이동!",
          "무거운 캐리어를 싣고 호텔 정문 로비 앞까지 바로 도착"
        ],
        precautions: [
          "INNN 카운터에서 예약 바우처 번호 확인 후 차량 안내받기"
        ],
        voucher: {
          id: "voucher-innn",
          title: "INNN 공항 픽업 바우처 & QR",
          subtitle: "간사이공항 KIX ➔ 더 싱귤러리 호텔 전용 합승차",
          bookingNo: "26KK261404511 (P2026090917400001)",
          travelerName: "JIIN SEO (대인 3명)",
          date: "2026-10-04 (일)",
          time: "18:30 도착 (운영 07:00~21:00)",
          location: "간사이 국제공항 T1 도착층 INNN 카운터",
          image: "/images/vouchers/innn_pickup_qr.jpg",
          badge: "Agoda 픽업 확정",
          usageGuide: "간사이공항 1층 도착층 INNN 카운터에서 이 QR코드와 예약번호를 제시하세요.",
          note: "하차 장소: THE SINGULARI HOTEL & SKYSPA AT UNIVERSAL STUDIOS JAPAN"
        }
      },
      {
        id: "d1-4",
        time: "19:50",
        title: "더 싱귤러리 호텔 체크인 🏨 (USJ 앞)",
        category: "hotel",
        icon: "Hotel",
        location: "더 싱귤러리 호텔 & 스카이스파 앳 유니버설 스튜디오 재팬",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Singulari+Hotel+and+Skyspa",
        description: "USJ 도보 바로 앞 특급 호텔 체크인! (주소: 6-2-25 Shimaya, Konohana-ku, Osaka 554-0024, 체크인 15:00 / 체크아웃 10/7 10:00)",
        recommendations: [
          "체크인 후 방에 짐 정리 및 잠시 휴식",
          "14층 스카이스파(전망 온천 대욕장/노천탕) 이용 안내 확인"
        ],
        precautions: [
          "여권 3명 전원 제시 및 객실 키 수령"
        ]
      },
      {
        id: "d1-5",
        time: "20:30 ~ 22:00",
        title: "유니버설 시티워크 저녁 식사 & 쇼핑 🍜",
        category: "food",
        icon: "Utensils",
        location: "유니버설 시티워크 오사카 (Universal Citywalk)",
        coordinates: { lat: 34.668, lng: 135.4375 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Universal+Citywalk+Osaka",
        description: "호텔 바로 앞 화려한 시티워크 레스토랑에서 맛있는 저녁 식사, 간단한 쇼핑, 내일 USJ를 위한 사전 분위기 즐기기!",
        recommendations: [
          "TAKOPA (타코야키 파크): 쿠쿠루, 주하치반 타코야키 비교 맛보기",
          "풍월(후게츠) 오코노미야키 또는 놀부/모스버거 등 다양한 맛집"
        ],
        precautions: [
          "내일 가이유칸 & 곤충샵 일정을 위해 가볍게 식사 후 조기 휴식"
        ]
      },
      {
        id: "d1-6",
        time: "22:00",
        title: "호텔 복귀 & 휴식 🛌 (내일부터는 USJ에서 신나게!)",
        category: "hotel",
        icon: "Home",
        location: "더 싱귤러리 호텔 객실 & 14층 스카이스파",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔 14층 스카이스파 대욕장에서 온천욕 후 충분히 휴식하기 ❤️",
        recommendations: ["온천으로 비행 피로 풀고 내일 09:30 출발 대비"],
        precautions: ["스카이스파 이용 시 객실 내 비치된 관내복 착용 가능"]
      }
    ],
    checklist: [
      { id: "c1-1", text: "여권, 항공권 (모바일 E-티켓)", isImportant: true },
      { id: "c1-2", text: "수하물, 충전기, 보조배터리", isImportant: true },
      { id: "c1-3", text: "Visit Japan Web QR코드 (입국/세관 캡처)", isImportant: true },
      { id: "c1-4", text: "INNN 공항 픽업 예약번호", isImportant: true },
      { id: "c1-5", text: "eSIM / 데이터 확인" },
      { id: "c1-6", text: "호텔 예약 확인서 (더 싱귤러리 3박)" },
      { id: "c1-7", text: "간단한 저녁 식사비, 교통카드(필요 시)" }
    ],
    generalTips: [
      "인천공항 제2터미널 아시아나항공 탑승 (출국 2~3시간 전 도착 추천)",
      "간사이공항 도착 후: 입국심사(QR) ➔ 수하물 수령 ➔ 세관 ➔ 1층 도착층 INNN 카운터 이동",
      "USJ 가는 날: 리무진 버스는 17:00 막차로 이용 불가하여 INNN 전용 픽업 차량으로 편안하게 이동합니다!"
    ]
  },

  // =========================================================================
  // DAY 2 (10/5 월): 가이유칸 & 곤충샵 탐방 DAY [바다를 보고, 신기한 곤충을 만나고, 여유롭게 즐기는 하루 ❤️]
  // =========================================================================
  {
    dayNumber: 2,
    dateStr: "10/5",
    dayOfWeek: "월",
    title: "가이유칸 & 곤충샵 탐방 DAY",
    tagline: "바다를 보고, 신기한 곤충을 만나고, 여유롭게 즐기는 하루 ❤️",
    hotelInfo: "더 싱귤러리 호텔 & 스카이스파 (USJ 앞)",
    themeColor: "#0D9488",
    gradient: "from-teal-500 to-emerald-600",
    badge: {
      text: "가이유칸 10:30 & 캡틴라인 왕복",
      type: "warning"
    },
    summaryItems: [
      "09:30 호텔 출발 (USJ 피어 도보 5~10분)",
      "10:00 캡틴라인 탑승 (USJ 피어 ➔ 덴포잔 10분)",
      "10:10 덴포잔 도착 ➔ 가이유칸 이동 (도보 5분)",
      "10:30 가이유칸 수족관 관람 (예매 완료)",
      "12:30 점심 식사 (덴포잔 마켓플레이스)",
      "13:30 INSECTSHOP KMY 곤충샵 (관찰&체험)",
      "15:30 캡틴라인 승선 (덴포잔 ➔ USJ 피어)",
      "15:45 USJ 피어 도착 ➔ 호텔 복귀 후 휴식",
      "저녁 저녁 식사 & 자유 시간 (시티워크)"
    ],
    dayRouteQuery: "The+Singulari+Hotel+to+Universal+Cityport+to+Osaka+Aquarium+Kaiyukan+to+INSECTSHOP+KMY",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Osaka+Aquarium+Kaiyukan&t=&z=15&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d2-1",
        time: "09:30",
        title: "호텔에서 출발 🚶 (USJ 피어로 이동)",
        category: "transport",
        icon: "Footprints",
        location: "더 싱귤러리 호텔 ➔ USJ 피어 선착장",
        coordinates: { lat: 34.6661, lng: 135.4367 },
        description: "더 싱귤러리 호텔에서 USJ 피어 선착장으로 도보 이동 (도보 약 5~10분), 캡틴라인 승선 준비",
        recommendations: ["호텔 로비에서 선착장 방향 표지판 확인 후 이동"],
        precautions: ["10:00 출발 캡틴라인 배를 타기 위해 09:45까지 선착장 도착"]
      },
      {
        id: "d2-2",
        time: "10:00",
        title: "캡틴라인 탑승 🚢 (USJ 피어 출발)",
        category: "transport",
        icon: "Ship",
        location: "유니버설 시티포트 (USJ 피어)",
        coordinates: { lat: 34.6661, lng: 135.4367 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Captain+Line+Universal+City+Port",
        description: "캡틴라인으로 바다를 가로질러 덴포잔(가이유칸 앞)까지 이동! 소요시간 약 10분 (왕복권 10/5 이용 확정)",
        recommendations: [
          "야외 2층 덱 좌석에서 시원한 바닷바람과 오사카만 전경 감상",
          "왕복 승선권은 돌아올 때(15:30)도 사용하므로 잘 보관!"
        ],
        precautions: ["승선 10분 전 게이트 대기"],
        voucher: {
          id: "voucher-captain-line",
          title: "캡틴라인 왕복 승선권 E-Ticket",
          subtitle: "USJ 피어 ➔ 덴포잔 왕복 (대인 2명 + 소인 1명)",
          bookingNo: "1201906464 (대인2) / 1201906469 (소인1)",
          travelerName: "성인 2명 + 아동 1명 (총 3명)",
          date: "2026-10-05 (월)",
          time: "10:00 출발 (돌아오는 배 15:30)",
          location: "유니버설 시티포트 (USJ 피어) & 덴포잔 선착장",
          image: "/images/vouchers/captain_line_adult_qr.jpg",
          badge: "JTRweb 공식 E-Ticket",
          usageGuide: "선착장 개찰구 또는 매표소 직원에게 대인/소인 탭을 눌러 QR 코드를 보여주세요.",
          note: "★ 왕복 승선권이므로 15:30 돌아올 때도 같은 QR 코드로 재탑승합니다!",
          familyMembers: [
            {
              id: "cl-adult",
              name: "대인 2명 (주문번호 1201906464)",
              role: "👨‍👩 대인 2명 왕복권",
              image: "/images/vouchers/captain_line_adult_qr.jpg"
            },
            {
              id: "cl-child",
              name: "소인 1명 (주문번호 1201906469)",
              role: "👦 소인 1명 왕복권",
              image: "/images/vouchers/captain_line_child_qr.jpg"
            }
          ]
        },
        vocabCategories: [
          {
            categoryName: "🎟️ 캡틴라인 티켓 & 탑승",
            items: [
              {
                id: "v2-2-1",
                korean: "대인 왕복 승선권 2장, 소인 1장입니다.",
                japanese: "大人往復2枚、小人往復1枚のチケットです。",
                pronunciation: "오토나 오-후쿠 니마이, 코도모 오-후쿠 이치마이노 치켓토데스",
                category: "ticket",
                image: "/images/vocab/ticket.svg",
              },
              {
                id: "v2-2-8",
                korean: "덴포잔(가이유칸)행 배가 맞나요?",
                japanese: "天保山（海遊館）行きで合っていますか？",
                pronunciation: "텐포-잔(카이유-칸) 유키데 앗테이마스카?",
                category: "transport",
                image: "/images/vocab/ferry.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d2-3",
        time: "10:10 ~ 10:30",
        title: "덴포잔 도착 ➔ 가이유칸 이동 (도보 약 5분) 🎡",
        category: "transport",
        icon: "Navigation",
        location: "덴포잔 선착장 ➔ 가이유칸 정문",
        coordinates: { lat: 34.6548, lng: 135.4285 },
        description: "하선 후 가이유칸 정문 광장으로 도보 약 5분 이동, 대관람차 배경 사진 촬영 및 10:30 입장 준비",
        recommendations: ["모바일 QR 입장권 화면 사전 준비"],
        precautions: ["10:30 지정 시간 정시 입장"]
      },
      {
        id: "d2-4",
        time: "10:30 ~ 12:30",
        title: "가이유칸 수족관 관람 🐋 (입장 10:30 예매 완료)",
        category: "sightseeing",
        icon: "Fish",
        location: "가이유칸 (Osaka Aquarium Kaiyukan)",
        coordinates: { lat: 34.6545, lng: 135.429 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Osaka+Aquarium+Kaiyukan",
        description: "신비로운 바다 속 세계! 세계 최대급 태평양 수조의 거대 고래상어, 물범, 펭귄, 해파리 관람 (약 1시간 30분~2시간)",
        recommendations: [
          "거대 고래상어 수조 앞에서 가족 인생샷 촬영",
          "가이유칸 시그니처 '미즈타마리 소다 소프트 아이스크림' 맛보기"
        ],
        precautions: ["수조 플래시 촬영 금지 구역 준수"],
        voucher: {
          id: "voucher-kaiyukan",
          title: "가이유칸 e-티켓 (대인 2 + 어린이 1)",
          subtitle: "2026-10-05(월) 10:45-11:00 입장 지정권",
          bookingNo: "00290-2026-0905-8100-3450-0005",
          travelerName: "대인 2명 + 어린이 1명 (총 3명)",
          date: "2026-10-05 (월)",
          time: "10:45 ~ 11:00 입장 (10:30 도착 권장)",
          location: "오사카 가이유칸 수족관 입구 개찰구",
          image: "/images/vouchers/kaiyukan_adult1_qr.jpg",
          badge: "Webket 공식 e-티켓",
          usageGuide: "좌우 화살표 버튼 또는 상단 탭을 눌러 3장의 QR 코드를 차례대로 개찰구에 스캔하세요.",
          note: "1인 1매 사용 / 개찰구에서 인원수만큼 QR 코드를 제시하여 입장합니다.",
          familyMembers: [
            {
              id: "ky-adult-1",
              name: "대인 1 (-0012)",
              role: "🧑 대인 1 (16세 이상)",
              image: "/images/vouchers/kaiyukan_adult1_qr.jpg"
            },
            {
              id: "ky-adult-2",
              name: "대인 2 (-0029)",
              role: "🧑 대인 2 (16세 이상)",
              image: "/images/vouchers/kaiyukan_adult2_qr.jpg"
            },
            {
              id: "ky-child",
              name: "어린이 (-0036)",
              role: "🧒 어린이 (초·중학생)",
              image: "/images/vouchers/kaiyukan_child_qr.jpg"
            }
          ]
        },
        vocabCategories: [
          {
            categoryName: "🎟️ 가이유칸 입장 & 굿즈",
            items: [
              {
                id: "v2-3-1",
                korean: "10시 30분 예매 QR 티켓입니다.",
                japanese: "10時30分予約のQRチケットです。",
                pronunciation: "쥬-지 산짓푼 요야쿠노 큐-아-루 치켓토데스",
                category: "ticket",
                image: "/images/vocab/whale.svg",
              },
              {
                id: "v2-3-7",
                korean: "미즈타마리 소다 소프트 아이스크림 하나 주세요 🍦",
                japanese: "ミズタマリソフト（ソーダ味）を1つお願いします。",
                pronunciation: "미즈타마리 소후토(소-다 아지)오 히토츠 오네가이시마스",
                category: "order",
                image: "/images/vocab/icecream.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d2-5",
        time: "12:30 ~ 13:30",
        title: "점심 식사 🍴 (덴포잔 마켓플레이스 또는 주변)",
        category: "food",
        icon: "Utensils",
        location: "덴포잔 마켓플레이스 (Tempozan Marketplace)",
        coordinates: { lat: 34.6558, lng: 135.4308 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tempozan+Marketplace",
        description: "맛집과 쇼핑이 가득한 덴포잔 마켓플레이스 또는 가이유칸 주변 맛집에서 자유롭게 식사 (나니와 쿠이신보 요코초 등)",
        recommendations: [
          "아이즈야 원조 타코야키 & 라디오야키",
          "자유켄 날계란 비빔 카레 또는 오코노미야키/라멘",
          "디저트: 스타벅스, 블루실 아이스크림"
        ],
        precautions: ["13:30 곤충샵 이동을 고려하여 여유롭게 식사"],
        vocabCategories: [
          {
            categoryName: "🐙 덴포잔 마켓플레이스 맛집 메뉴",
            items: [
              {
                id: "v2-4-1",
                korean: "원조 타코야키 (소스 없이 먹는 1935년 원조)",
                japanese: "元祖たこ焼き（ソースなし・出汁の旨味）",
                pronunciation: "간소 타코야키 (소-스 나시 · 다시노 우마미)",
                category: "order",
                image: "/images/vocab/takoyaki.svg",
              },
              {
                id: "v2-4-5",
                korean: "명물 카레 (날계란 비빔 카레)",
                japanese: "名物カレー（生卵入り・混ぜカレー）",
                pronunciation: "메-부츠 카레- (나마타마고 이리 · 마제 카레-)",
                category: "order",
                image: "/images/vocab/curry.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d2-6",
        time: "13:30 ~ 15:00",
        title: "INSECTSHOP KMY (곤충샵) 탐방 🐞 (신기한 곤충들의 세계!)",
        category: "shopping",
        icon: "Bug",
        location: "INSECTSHOP KMY OSAKA (현장 방문, 별도 예약 불필요)",
        coordinates: { lat: 34.6565, lng: 135.433 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=INSECTSHOP+KMY+OSAKA",
        description: "해외 희귀 곤충 전시 & 판매! 살아있는 장수풍뎅이/사슴벌레 관찰 및 만져보기 체험 (체험 시간 약 1시간~1시간 30분)",
        recommendations: [
          "아들이 가장 좋아하는 코스! 헤라클레스 장수풍뎅이와 멋진 사슴벌레 실물 관람",
          "표본 상자 및 곤충 피규어 굿즈 구매"
        ],
        precautions: [
          "★ 살아있는 생체 곤충은 한국 반입 불가이므로 표본 및 기념품 위주 구매!",
          "15:30 캡틴라인 배 시간을 위해 15:10에 매장에서 출발"
        ],
        vocabCategories: [
          {
            categoryName: "🐞 곤충샵 쇼핑 & 문의 표현",
            items: [
              {
                id: "v2-5-1",
                korean: "헤라클레스 장수풍뎅이 표본 있나요?",
                japanese: "ヘラクレスオオカブトの標本はありますか？",
                pronunciation: "헤라쿠레스 오오카부토노 효-혼와 아리마스카?",
                category: "shopping",
                image: "/images/vocab/beetle.svg",
              },
              {
                id: "v2-5-3",
                korean: "한국으로 가져갈 건데, 튼튼하게 에어캡 포장해 주세요.",
                japanese: "韓国に持って帰るので、厳重に包装してもらえますか？",
                pronunciation: "칸코쿠니 못테 카에루노데, 겐쥬-니 호-소- 시테 모라에마스카?",
                category: "service",
              },
            ]
          }
        ]
      },
      {
        id: "d2-7",
        time: "15:30",
        title: "캡틴라인 탑승 🚢 (덴포잔 출발 ➔ USJ 피어로 이동)",
        category: "transport",
        icon: "Ship",
        location: "덴포잔 선착장 ➔ USJ 피어",
        coordinates: { lat: 34.6548, lng: 135.4285 },
        description: "왕복 승선권을 이용하여 덴포잔에서 USJ 피어로 복귀 탑승 (약 10분 소요)",
        recommendations: ["하버 뷰를 감상하며 돌아오기"],
        precautions: ["15:30 출발 10분 전 선착장 도착 필수"],
        voucher: {
          id: "voucher-captain-line-return",
          title: "캡틴라인 복귀 승선권 E-Ticket",
          subtitle: "덴포잔 ➔ USJ 피어 복귀 (대인 2명 + 소인 1명)",
          bookingNo: "1201906464 (대인2) / 1201906469 (소인1)",
          travelerName: "성인 2명 + 아동 1명 (총 3명)",
          date: "2026-10-05 (월)",
          time: "15:30 출발",
          location: "덴포잔 선착장 (가이유칸 앞)",
          image: "/images/vouchers/captain_line_adult_qr.jpg",
          badge: "JTRweb 공식 E-Ticket",
          usageGuide: "덴포잔 선착장 개찰구 또는 직원에게 대인/소인 탭을 눌러 QR 코드를 보여주세요.",
          note: "★ 왕복 승선권으로 복귀 승선 시 사용합니다!",
          familyMembers: [
            {
              id: "cl-adult-ret",
              name: "대인 2명 (주문번호 1201906464)",
              role: "👨‍👩 대인 2명 왕복권",
              image: "/images/vouchers/captain_line_adult_qr.jpg"
            },
            {
              id: "cl-child-ret",
              name: "소인 1명 (주문번호 1201906469)",
              role: "👦 소인 1명 왕복권",
              image: "/images/vouchers/captain_line_child_qr.jpg"
            }
          ]
        }
      },
      {
        id: "d2-8",
        time: "15:45",
        title: "USJ 피어 도착 ➔ 호텔로 이동 (도보 약 5~10분) 🏨",
        category: "hotel",
        icon: "Hotel",
        location: "USJ 피어 ➔ 더 싱귤러리 호텔",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔로 도보 복귀 후 방에서 잠시 휴식 및 짐 정리",
        recommendations: ["호텔에서 다리 피로 풀고 저녁 일정 준비"],
        precautions: ["쇼핑한 곤충 굿즈 안전하게 보관"]
      },
      {
        id: "d2-9",
        time: "저녁",
        title: "저녁 식사 & 자유 시간 🍕 (다시 돌아오는 즐거운 길 ❤️)",
        category: "food",
        icon: "Utensils",
        location: "유니버설 시티워크 또는 호텔 주변",
        coordinates: { lat: 34.668, lng: 135.4375 },
        description: "시티워크 또는 호텔 주변에서 맛있는 저녁 식사, 간단한 쇼핑, 기념품 구경 후 호텔에서 휴식",
        recommendations: [
          "내일 USJ 올데이 일정을 위해 편의점 간식/음료 구비",
          "더 싱귤러리 스카이스파에서 따뜻한 온천욕"
        ],
        precautions: ["내일 USJ 08:30 출발을 위해 밤 10시 이전 취침"]
      }
    ],
    checklist: [
      { id: "c2-1", text: "가이유칸 티켓 (QR코드 10:30 예매 완료)", isImportant: true },
      { id: "c2-2", text: "캡틴라인 왕복권 (QR코드 / 10/5 이용)", isImportant: true },
      { id: "c2-3", text: "곤충카드 / 엔화 현금 (일부 매장용)" },
      { id: "c2-4", text: "휴대폰 & 보조배터리", isImportant: true },
      { id: "c2-5", text: "편한 신발, 카메라 or 스마트폰" },
      { id: "c2-6", text: "아들 체험용 여유 시간 & 즐길 마음! 😊", isImportant: true }
    ],
    generalTips: [
      "캡틴라인은 시간 맞춰 여유롭게 탑승!",
      "가이유칸 관람 시간이 넉넉하니 천천히 고래상어와 인생샷 찍기!",
      "곤충샵(KMY)은 아이가 정말 좋아하는 코스입니다.",
      "날씨에 따라 우산 또는 우비 준비!"
    ]
  },

  // =========================================================================
  // DAY 3 (10/6 화): USJ 종일! (익스프레스 패스) [기다림은 짧게, 즐거움은 크게! 오늘은 USJ에서 신나게 놀아요! ❤️]
  // =========================================================================
  {
    dayNumber: 3,
    dateStr: "10/6",
    dayOfWeek: "화",
    title: "USJ 종일! (익스프레스 패스)",
    tagline: "기다림은 짧게, 즐거움은 크게! 오늘은 USJ에서 신나게 놀아요! ❤️",
    hotelInfo: "더 싱귤러리 호텔 & 스카이스파 (USJ 앞)",
    themeColor: "#EF4444",
    gradient: "from-red-500 to-amber-500",
    badge: {
      text: "익스프레스 확정: 10:00미니언, 12:20마리오, 12:50동키콩",
      type: "highlight"
    },
    summaryItems: [
      "08:30 호텔에서 출발 (도보 약 5~10분)",
      "09:00 USJ 입장 & 에어리어 맵 체크",
      "10:00 [익스] 미니언 메이헴 (10:00~10:30)",
      "12:20 [익스] 슈퍼 닌텐도 월드 입장 (12:20~13:20)",
      "12:20 [익스] 마리오 카트: 쿠파의 도전장 (12:20~12:50)",
      "12:50 [익스] 동키콩의 크레이지 트램카 (12:50~13:20)",
      "13:30 워터월드 쇼 관람 (13:30 회차 추천)",
      "14:00 점심 식사 (자유 식사 - 버거, 피자, 키노피오 등)",
      "15:30 나머지 어트랙션 & 해리포터 존 & 쇼핑",
      "20:00 저녁 식사 & 쇼핑 (시티워크)",
      "21:00 호텔로 이동 & 휴식"
    ],
    dayRouteQuery: "The+Singulari+Hotel+to+Universal+Studios+Japan",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Universal+Studios+Japan&t=&z=15&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d3-1",
        time: "08:30",
        title: "호텔에서 출발 🚶 (도보 약 5~10분)",
        category: "hotel",
        icon: "AlarmClock",
        location: "더 싱귤러리 호텔 ➔ USJ 메인 게이트",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔 ➔ 유니버설 스튜디오 재팬 도보 약 5~10분 이동, 입장 준비 (QR코드, 익스프레스 패스 확인)",
        recommendations: ["호텔 정문 나서면 바로 USJ 파크 진입로!"],
        precautions: ["보조배터리 완충 및 편한 운동화, 모자 착용"]
      },
      {
        id: "d3-2",
        time: "09:00",
        title: "USJ 입장 & 입장 준비 🎟️ (Today is USJ!)",
        category: "theme_park",
        icon: "Ticket",
        location: "USJ 메인 게이트",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan+Main+Gate",
        description: "입장 게이트 통과, 익스프레스 패스 시간 재확인, 에어리어 맵 확인 및 첫 코스 미니언 파크로 이동",
        recommendations: ["입장 직후 지구본 앞에서 가족 인증샷 촬영!"],
        precautions: ["셀카봉 반입 금지 (보안검색 준수)"],
        voucher: {
          id: "voucher-usj-direct-in",
          title: "USJ 다이렉트 인 1 Day 스튜디오 패스 (총 3명)",
          subtitle: "2026-10-06(화) 당일 유효 공식 e-티켓",
          bookingNo: "USJ-P1X000000DDVZN",
          travelerName: "대인 2명(¥9,900×2) + 어린이 1명(¥6,200×1)",
          date: "2026-10-06 (화)",
          time: "09:00 파크 오픈 (08:30 대기 권장)",
          location: "유니버설 스튜디오 재팬 메인 게이트 입장 개찰기",
          image: "/images/vouchers/usj_direct_in_adult1_qr.jpg",
          badge: "USJ 공식 다이렉트 인 (Direct-In)",
          usageGuide: "좌우 화살표 버튼 또는 상단 탭을 눌러 3장의 QR 코드를 차례대로 입장 게이트 개찰기에 스캔하세요.",
          note: "1인 1매 소지 및 개찰구 스캔 / 퇴장 후 재입장 불가 / 슈퍼 닌텐도 월드 확정권 포함",
          familyMembers: [
            {
              id: "usj-adult-1",
              name: "대인 1 (-6328)",
              role: "🧑 대인 1 (12세 이상)",
              image: "/images/vouchers/usj_direct_in_adult1_qr.jpg"
            },
            {
              id: "usj-adult-2",
              name: "대인 2 (-6327)",
              role: "🧑 대인 2 (12세 이상)",
              image: "/images/vouchers/usj_direct_in_adult2_qr.jpg"
            },
            {
              id: "usj-child",
              name: "어린이 (-6329)",
              role: "🧒 어린이 (만 4~11세)",
              image: "/images/vouchers/usj_direct_in_child_qr.jpg"
            }
          ]
        }
      },
      {
        id: "d3-3",
        time: "10:00 ~ 10:30",
        title: "🍌 [익스프레스] 미니언 메이헴 (10:00~10:30)",
        category: "theme_park",
        icon: "Sparkles",
        location: "미니언 파크 (Minion Park)",
        coordinates: { lat: 34.666, lng: 135.431 },
        description: "귀여운 미니언들과 신나는 3D 어트랙션! 익스프레스 전용 라인으로 대기 없이 쾌적 탑승",
        recommendations: [
          "탑승 후 미니언 파크에서 귀여운 미니언즈와 사진 촬영",
          "미니언 팝콘통 구매"
        ],
        precautions: ["지정 시간 10:00~10:30 준수하여 익스프레스 라인 진입"],
        voucher: {
          id: "voucher-usj-express-pass-5",
          title: "USJ 익스프레스 패스 5 ~ 레이스 & 트램카 스페셜 ~ (3매)",
          subtitle: "2026-10-06(화) 지정 시간 패스트트랙 e-티켓",
          bookingNo: "USJ-P1X000000DDVZP",
          travelerName: "총 3매 (각 24,900엔 / 동일 시간대)",
          date: "2026-10-06 (화)",
          time: "10:00 미니언 / 12:20 닌텐도월드&마리오카트 / 12:50 동키콩",
          location: "각 어트랙션 익스프레스 전용 라인 입구",
          image: "/images/vouchers/usj_express_pass_1_qr.jpg",
          badge: "USJ 익스프레스 패스 5",
          usageGuide: "각 어트랙션 입구에서 좌우 화살표 버튼 또는 상단 탭을 눌러 3장의 QR 코드를 차례대로 직원에게 제시하세요.",
          note: "★ 지정 시간 준수 필수!\n• 10:00-10:30 미니언\n• 12:20-13:20 닌텐도 월드 입장\n• 12:20-12:50 마리오 카트\n• 12:50-13:20 동키콩 트램카\n• 플라잉 다이너소어 또는 해리포터 포비든 저니 (1개 선택)",
          familyMembers: [
            {
              id: "usj-exp-1",
              name: "패스 1 (-6332)",
              role: "🎫 익스프레스 1 (-6332)",
              image: "/images/vouchers/usj_express_pass_1_qr.jpg"
            },
            {
              id: "usj-exp-2",
              name: "패스 2 (-6333)",
              role: "🎫 익스프레스 2 (-6333)",
              image: "/images/vouchers/usj_express_pass_2_qr.jpg"
            },
            {
              id: "usj-exp-3",
              name: "패스 3 (-6334)",
              role: "🎫 익스프레스 3 (-6334)",
              image: "/images/vouchers/usj_express_pass_3_qr.jpg"
            }
          ]
        }
      },
      {
        id: "d3-4",
        time: "12:20 ~ 13:20",
        title: "🍄 [익스프레스] 슈퍼 닌텐도 월드 입장 (입장시간 12:20~13:20)",
        category: "theme_park",
        icon: "Sparkles",
        location: "슈퍼 닌텐도 월드 (Super Nintendo World)",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Super+Nintendo+World+USJ",
        description: "마리오의 세계로! 초록색 토관을 통과해 마리오 월드 자유 관람, 마리오 카트 & 동키콩 연속 이용",
        recommendations: [
          "물음표 블록을 터치하며 코인 소리 듣기",
          "마리오/루이지/피치공주 포토존"
        ],
        precautions: ["지정 입장시간 12:20 준수, 구역 밖으로 나가면 재입장 불가"],
        voucher: {
          id: "voucher-usj-express-pass-5",
          title: "USJ 익스프레스 패스 5 ~ 레이스 & 트램카 스페셜 ~ (3매)",
          subtitle: "2026-10-06(화) 지정 시간 패스트트랙 e-티켓",
          bookingNo: "USJ-P1X000000DDVZP",
          travelerName: "총 3매 (각 24,900엔 / 동일 시간대)",
          date: "2026-10-06 (화)",
          time: "10:00 미니언 / 12:20 닌텐도월드&마리오카트 / 12:50 동키콩",
          location: "슈퍼 닌텐도 월드 입장 게이트 & 각 어트랙션",
          image: "/images/vouchers/usj_express_pass_1_qr.jpg",
          badge: "USJ 익스프레스 패스 5",
          usageGuide: "닌텐도 월드 입장 게이트 및 어트랙션 입구에서 3장의 QR 코드를 제시하세요.",
          note: "★ 지정 시간 준수 필수!\n• 10:00-10:30 미니언\n• 12:20-13:20 닌텐도 월드 입장\n• 12:20-12:50 마리오 카트\n• 12:50-13:20 동키콩 트램카\n• 플라잉 다이너소어 또는 해리포터 포비든 저니 (1개 선택)",
          familyMembers: [
            {
              id: "usj-exp-1",
              name: "패스 1 (-6332)",
              role: "🎫 익스프레스 1 (-6332)",
              image: "/images/vouchers/usj_express_pass_1_qr.jpg"
            },
            {
              id: "usj-exp-2",
              name: "패스 2 (-6333)",
              role: "🎫 익스프레스 2 (-6333)",
              image: "/images/vouchers/usj_express_pass_2_qr.jpg"
            },
            {
              id: "usj-exp-3",
              name: "패스 3 (-6334)",
              role: "🎫 익스프레스 3 (-6334)",
              image: "/images/vouchers/usj_express_pass_3_qr.jpg"
            }
          ]
        },
        vocabCategories: [
          {
            categoryName: "🎟️ 닌텐도 월드 & 키노피오 카페",
            items: [
              {
                id: "v3-3-1",
                korean: "슈퍼 닌텐도 월드 익스프레스 입장권입니다 (12:20).",
                japanese: "スーパー・ニンテンドー・ワールド エリア入場時間です。",
                pronunciation: "스-파- 닌텐도- 와-루도 에리아 뉴-조- 지칸데스",
                category: "ticket",
                image: "/images/vocab/nintendo.svg",
              },
              {
                id: "v3-3-5",
                korean: "슈퍼버섯 피자볼 (인기 시그니처 메뉴)",
                japanese: "スーパーキノコ・ピッツァボウル",
                pronunciation: "스-파- 키노코 핏차 보-루",
                category: "order",
                image: "/images/vocab/nintendo.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d3-5",
        time: "12:20 ~ 12:50",
        title: "🏎️ [익스프레스] 마리오 카트: 쿠파의 도전장 (12:20~12:50)",
        category: "theme_park",
        icon: "Gamepad2",
        location: "쿠파 성",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        description: "실감나는 AR 레이싱 어트랙션! 등껍질을 던지며 쿠파 군단과의 레이스 대결",
        recommendations: ["쿠파 성 내부의 황금 트로피 포토존 구경"],
        precautions: ["지정 시간 12:20~12:50 익스프레스 라인 탑승"],
        voucher: {
          id: "voucher-usj-express-pass-5",
          title: "USJ 익스프레스 패스 5 ~ 레이스 & 트램카 스페셜 ~ (3매)",
          subtitle: "2026-10-06(화) 지정 시간 패스트트랙 e-티켓",
          bookingNo: "USJ-P1X000000DDVZP",
          travelerName: "총 3매 (각 24,900엔 / 동일 시간대)",
          date: "2026-10-06 (화)",
          time: "10:00 미니언 / 12:20 닌텐도월드&마리오카트 / 12:50 동키콩",
          location: "마리오 카트 어트랙션 익스프레스 라인",
          image: "/images/vouchers/usj_express_pass_1_qr.jpg",
          badge: "USJ 익스프레스 패스 5",
          usageGuide: "마리오 카트 입구에서 좌우 화살표나 상단 탭을 눌러 3장의 QR 코드를 차례대로 직원에게 제시하세요.",
          note: "★ 지정 시간: 12:20 ~ 12:50 준수 필수!",
          familyMembers: [
            {
              id: "usj-exp-1",
              name: "패스 1 (-6332)",
              role: "🎫 익스프레스 1 (-6332)",
              image: "/images/vouchers/usj_express_pass_1_qr.jpg"
            },
            {
              id: "usj-exp-2",
              name: "패스 2 (-6333)",
              role: "🎫 익스프레스 2 (-6333)",
              image: "/images/vouchers/usj_express_pass_2_qr.jpg"
            },
            {
              id: "usj-exp-3",
              name: "패스 3 (-6334)",
              role: "🎫 익스프레스 3 (-6334)",
              image: "/images/vouchers/usj_express_pass_3_qr.jpg"
            }
          ]
        }
      },
      {
        id: "d3-6",
        time: "12:50 ~ 13:20",
        title: "🦍 [익스프레스] 동키콩의 크레이지 트램카 (12:50~13:20)",
        category: "theme_park",
        icon: "Sparkles",
        location: "동키콩 컨트리 (신규 구역!)",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        description: "정글 속 스릴 넘치는 롤러코스터 어트랙션! 부서진 레일을 점프하며 달리는 짜릿함",
        recommendations: ["황금 바나나 신전 앞에서 동키콩 포즈 사진"],
        precautions: ["지정 시간 12:50~13:20 준수"],
        voucher: {
          id: "voucher-usj-express-pass-5",
          title: "USJ 익스프레스 패스 5 ~ 레이스 & 트램카 스페셜 ~ (3매)",
          subtitle: "2026-10-06(화) 지정 시간 패스트트랙 e-티켓",
          bookingNo: "USJ-P1X000000DDVZP",
          travelerName: "총 3매 (각 24,900엔 / 동일 시간대)",
          date: "2026-10-06 (화)",
          time: "10:00 미니언 / 12:20 닌텐도월드&마리오카트 / 12:50 동키콩",
          location: "동키콩 크레이지 트램카 익스프레스 라인",
          image: "/images/vouchers/usj_express_pass_1_qr.jpg",
          badge: "USJ 익스프레스 패스 5",
          usageGuide: "동키콩 트램카 입구에서 좌우 화살표나 상단 탭을 눌러 3장의 QR 코드를 차례대로 직원에게 제시하세요.",
          note: "★ 지정 시간: 12:50 ~ 13:20 준수 필수!",
          familyMembers: [
            {
              id: "usj-exp-1",
              name: "패스 1 (-6332)",
              role: "🎫 익스프레스 1 (-6332)",
              image: "/images/vouchers/usj_express_pass_1_qr.jpg"
            },
            {
              id: "usj-exp-2",
              name: "패스 2 (-6333)",
              role: "🎫 익스프레스 2 (-6333)",
              image: "/images/vouchers/usj_express_pass_2_qr.jpg"
            },
            {
              id: "usj-exp-3",
              name: "패스 3 (-6334)",
              role: "🎫 익스프레스 3 (-6334)",
              image: "/images/vouchers/usj_express_pass_3_qr.jpg"
            }
          ]
        },
        vocabCategories: [
          {
            categoryName: "🦍 동키콩 구역 표현",
            items: [
              {
                id: "v3-dk-1",
                korean: "동키콩 크레이지 트램카 익스프레스 탑승권입니다.",
                japanese: "ドンキーコングのクレイジー・トロッコです。",
                pronunciation: "돈키-콘구노 쿠레이지- 토록코데스",
                category: "ticket",
                image: "/images/vocab/donkeykong.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d3-7",
        time: "13:30",
        title: "🌊 워터월드 쇼 관람 (13:30 회차 추천!)",
        category: "sightseeing",
        icon: "Sparkles",
        location: "워터월드 스타디움",
        coordinates: { lat: 34.6665, lng: 135.4315 },
        description: "짜릿한 워터월드 쇼! 박진감 넘치는 라이브 스턴트와 대형 폭발! (※ 15:00 회차도 있으니 시간 여유 시 한 번 더!)",
        recommendations: ["젖지 않는 갈색 좌석에 앉아 편안하게 관람"],
        precautions: ["앞쪽 파란색 시트는 물이 튀므로 주의"]
      },
      {
        id: "d3-8",
        time: "14:00 ~ 15:30",
        title: "점심 식사 🍔 (혼잡 시간 피해 자유 식사)",
        category: "food",
        icon: "Utensils",
        location: "파크 내 레스토랑 (멜스 드라이브인 / 루이스 피자 등)",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        description: "파크 내 레스토랑 이용 (멜스 드라이브인 버거, 루이스 NY 피자, 키노피오 카페, 스리 브룸스틱스, 터키 레그, 츄러스 등)",
        recommendations: ["점심 피크(12~13시)를 지나 14:00에 여유롭게 식사"],
        precautions: ["가족 취향에 맞춰 버거 또는 피자 선택"]
      },
      {
        id: "d3-9",
        time: "15:30 ~ 20:00",
        title: "마법 같은 순간! 해리포터 존 & 나머지 어트랙션 & 쇼핑 🧙‍♂️",
        category: "theme_park",
        icon: "Sparkles",
        location: "위저딩 월드 오브 해리포터 & 할리우드 & 뉴욕 에어리어",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        description: "해리포터 존 포비든 저니, 쥬라기 공원, 할리우드 등 쇼, 거리 공연, 포토 스팟, 파크 내 기념품숍 굿즈 쇼핑",
        recommendations: [
          "해리포터 버터맥주(무알콜) 시식 & 컵 기념품 챙기기",
          "호그와트 성 앞 호수 반영 사진 촬영"
        ],
        precautions: ["중간중간 벤치에서 휴식"],
        voucher: {
          id: "voucher-usj-express-pass-5",
          title: "USJ 익스프레스 패스 5 ~ 레이스 & 트램카 스페셜 ~ (3매)",
          subtitle: "2026-10-06(화) 지정 시간 패스트트랙 e-티켓",
          bookingNo: "USJ-P1X000000DDVZP",
          travelerName: "총 3매 (각 24,900엔 / 동일 시간대)",
          date: "2026-10-06 (화)",
          time: "플라잉 다이너소어 또는 해리포터 포비든 저니 (1개 선택 이용)",
          location: "해리포터 포비든 저니 / 플라잉 다이너소어 입구",
          image: "/images/vouchers/usj_express_pass_1_qr.jpg",
          badge: "USJ 익스프레스 패스 5",
          usageGuide: "어트랙션 입구에서 좌우 화살표나 상단 탭을 눌러 3장의 QR 코드를 차례대로 직원에게 제시하세요.",
          note: "• 플라잉 다이너소어 또는 해리포터 포비든 저니 중 1개 선택하여 탑승 가능!",
          familyMembers: [
            {
              id: "usj-exp-1",
              name: "패스 1 (-6332)",
              role: "🎫 익스프레스 1 (-6332)",
              image: "/images/vouchers/usj_express_pass_1_qr.jpg"
            },
            {
              id: "usj-exp-2",
              name: "패스 2 (-6333)",
              role: "🎫 익스프레스 2 (-6333)",
              image: "/images/vouchers/usj_express_pass_2_qr.jpg"
            },
            {
              id: "usj-exp-3",
              name: "패스 3 (-6334)",
              role: "🎫 익스프레스 3 (-6334)",
              image: "/images/vouchers/usj_express_pass_3_qr.jpg"
            }
          ]
        },
        vocabCategories: [
          {
            categoryName: "🍺 해리포터 버터맥주 & 파크 스낵",
            items: [
              {
                id: "v3-3-8",
                korean: "버터맥주(무알콜) 1잔 주세요 🍺",
                japanese: "バタービール（ノンアルコール）を1つお願いします。",
                pronunciation: "바타-비-루(논아루코-루)오 히토츠 오네가이시마스",
                category: "order",
                image: "/images/vocab/butterbeer.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d3-10",
        time: "20:00 ~ 21:00",
        title: "저녁 식사 & 쇼핑 🛍️ (맛있는 저녁과 쇼핑까지!)",
        category: "food",
        icon: "Utensils",
        location: "유니버설 시티워크 (시티워크 숍 & 레스토랑)",
        coordinates: { lat: 34.668, lng: 135.4375 },
        description: "시티워크에서 맛있는 저녁 식사, 유니버설 스튜디오 스토어 기념품 쇼핑, 화려한 야경 즐기기!",
        recommendations: ["USJ 공식 스토어에서 마리오/미니언/해리포터 굿즈 쇼핑"],
        precautions: ["내일 체크아웃(07:30 짐정리)을 위해 밤 짐싸기"]
      },
      {
        id: "d3-11",
        time: "21:00",
        title: "호텔로 이동 & 휴식 🛌 (오늘 하루도 수고했어요! Today was a good day!)",
        category: "hotel",
        icon: "Home",
        location: "더 싱귤러리 호텔 객실 & 스카이스파",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔로 도보 이동 (약 5~10분), 스카이스파에서 피로 풀고 푹 쉬기 ❤️",
        recommendations: ["14층 전망 온천에서 야경 보며 힐링"],
        precautions: ["내일 아침 07:30 기상 및 08:30 난바 이동 준비"]
      }
    ],
    checklist: [
      { id: "c3-1", text: "USJ 입장권 & 익스프레스 패스 (QR코드 캡처)", isImportant: true },
      { id: "c3-2", text: "모바일 배터리 & 충전기", isImportant: true },
      { id: "c3-3", text: "편한 신발, 모자, 선크림" },
      { id: "c3-4", text: "우비 or 접이식 우산 (날씨 확인)" },
      { id: "c3-5", text: "물, 간식, 휴지" },
      { id: "c3-6", text: "가족 사진 많이 찍기! & 즐길 준비 완료! 😊", isImportant: true }
    ],
    generalTips: [
      "익스프레스 패스 시간에 맞춰 여유롭게 이동! (10:00 미니언, 12:20 마리오, 12:50 동키콩)",
      "USJ 공식 앱으로 실시간 대기시간 확인!",
      "점심은 혼잡 시간(12~13시)을 피해 14시에 여유롭게 식사!",
      "쇼 시간(워터월드 13:30)은 미리 도착해서 좋은 자리 확보!",
      "저녁에는 시티워크에서 여유롭게 식사 & 쇼핑하고 야경 즐기기!"
    ]
  },

  // =========================================================================
  // DAY 4 (10/7 수): USJ에서 난바로 이동하는 날 [몬스터헌터 카페에서 맛있는 점심! 오사카 도심에서 마지막 밤 즐겨요 ❤️]
  // =========================================================================
  {
    dayNumber: 4,
    dateStr: "10/7",
    dayOfWeek: "수",
    title: "USJ에서 난바로 이동하는 날",
    tagline: "몬스터헌터 카페에서 맛있는 점심! 오사카 도심에서 마지막 밤 즐겨요 ❤️",
    hotelInfo: "사쿠라가와 호텔 난바 (10/7~10/9 2박)",
    themeColor: "#8B5CF6",
    gradient: "from-purple-500 to-pink-500",
    badge: {
      text: "몬헌 카페 12:00 & 크루즈 20:00",
      type: "highlight"
    },
    summaryItems: [
      "07:30 더 싱귤러리 체크아웃 & 짐 정리 (캐리어 3개)",
      "08:30 USJ 출발 ➔ 난바로 이동 (JR+지하철 30~40분)",
      "10:00 난바 도착 & 사쿠라가와 호텔 짐 보관",
      "10:30 신사이바시 이동 & 자유시간 (도보 10~15분)",
      "12:00 몬스터헌터 카페(West) 예약 런치",
      "13:30 [각자이동] 남편+아들 오사카성 / 지인님 신사이바시 쇼핑",
      "17:30 다시 만나서 함께 도톤보리 이동",
      "20:00 도톤보리 리버크루즈 탑승 (예약 완료)",
      "20:30 저녁 식사 & 야경 산책",
      "22:30 난바 숙소 체크인 & 휴식"
    ],
    dayRouteQuery: "The+Singulari+Hotel+to+Sakuragawa+Hotel+Nanba+to+Shinsaibashi+to+Osaka+Castle+to+Dotonbori",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Dotonbori+Osaka&t=&z=14&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d4-1",
        time: "07:30",
        title: "호텔 체크아웃 & 짐 정리 🧳",
        category: "hotel",
        icon: "LogOut",
        location: "더 싱귤러리 호텔",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔 체크아웃, 짐 정리 후 캐리어 이동 (캐리어 26인치 2개, 16~18인치 1개)",
        recommendations: ["객실 내 충전기 및 소지품 잊지 않기"],
        precautions: ["08:30 출발을 위해 정시 체크아웃"]
      },
      {
        id: "d4-2",
        time: "08:30 ~ 09:10",
        title: "USJ 출발 ➔ 난바로 이동 🚃 (약 30~40분 소요)",
        category: "transport",
        icon: "Train",
        location: "유니버설시티역 ➔ 난바역 / 사쿠라가와역",
        coordinates: { lat: 34.6663, lng: 135.5015 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Namba+Station+Osaka",
        description: "유니버설시티역 ➔ JR 유메사키선(니시쿠조 환승) ➔ 오사카 메트로 / 한신선으로 난바역/사쿠라가와역 이동",
        recommendations: ["사쿠라가와역 하차 시 호텔까지 도보 3분 직결"],
        precautions: ["환승 시 엘리베이터 위치 확인하여 캐리어 편하게 이동"]
      },
      {
        id: "d4-3",
        time: "10:00",
        title: "난바 도착 & 짐 보관 🧳 (사쿠라가와 호텔 난바)",
        category: "hotel",
        icon: "Briefcase",
        location: "사쿠라가와 호텔 난바 (Sakuragawa Hotel Nanba)",
        coordinates: { lat: 34.666, lng: 135.492 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sakuragawa+Hotel+Nanba",
        description: "사쿠라가와 호텔 난바에 캐리어 사전 짐 보관 (체크인은 15:00부터이므로 먼저 짐 맡기고 가볍게 출발!)",
        recommendations: ["짐 보관 번호표 수령 및 신사이바시 이동 준비"],
        precautions: ["체크인 바우처 및 예약 확인"]
      },
      {
        id: "d4-4",
        time: "10:30 ~ 12:00",
        title: "신사이바시 이동 & 자유시간 🚶 (도보 약 10~15분)",
        category: "shopping",
        icon: "ShoppingBag",
        location: "신사이바시 상가 거리 (Shinsaibashi-suji)",
        coordinates: { lat: 34.6738, lng: 135.5006 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Shinsaibashi-suji+Shopping+Street",
        description: "도보 이동 (약 10~15분), 신사이바시 쇼핑 거리 구경, 카페, 드럭스토어 등 여유롭게 즐기기",
        recommendations: ["아케이드 상가에서 몬스터헌터 카페 위치 미리 파악"],
        precautions: ["12:00 몬헌 카페 예약 시간에 늦지 않도록 11:50 매장 앞 도착"]
      },
      {
        id: "d4-5",
        time: "12:00 ~ 13:30",
        title: "몬스터헌터 카페 (West) 예약 런치 🍖 🎮 (예약 완료!)",
        category: "food",
        icon: "Swords",
        location: "CAPCOM / 몬스터헌터 카페 (West)",
        coordinates: { lat: 34.6732, lng: 135.5008 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=CAPCOM+STORE+OSAKA",
        description: "예약 시간 12:00! 몬헌 테마 메뉴 & 굿즈 구경 (파세라리조츠 난바 도톤보리점 4F, 예약 ID: J5Z5NL)",
        recommendations: [
          "시그니처 고기 메뉴와 캐릭터 테마 드링크 주문",
          "아이루/가루크 굿즈 구경"
        ],
        precautions: ["12:00 예약 10분 전 도착 필수"],
        voucher: {
          id: "voucher-monhan",
          title: "MONHAN BAR WEST (몬헌주점) 예약 티켓",
          subtitle: "파세라리조츠 난바 도톤보리점 4F",
          bookingNo: "J5Z5NL",
          travelerName: "3명 예약 확정",
          date: "2026년 10월 7일 (수)",
          time: "12:00",
          location: "〒542-0071 大阪市中央区道頓堀1丁目4-27 4F (0120-718-759)",
          image: "/images/vouchers/monhan_bar_ticket.jpg",
          badge: "TableCheck 예약 확정",
          usageGuide: "12:00 매장 도착 후 카운터 직원에게 예약 화면(예약 ID: J5Z5NL)을 보여주세요.",
          note: "예약 시간 10분 전 매장 도착 필수!"
        },
        vocabCategories: [
          {
            categoryName: "🎮 몬스터헌터 카페 주문 & 문의",
            items: [
              {
                id: "v4-mh-1",
                korean: "12시 예약 확인 부탁드립니다.",
                japanese: "12時予約の確認をお願いします。",
                pronunciation: "쥬-니지 요야쿠노 카쿠닌오 오네가이시마스",
                category: "service",
                image: "/images/vocab/capcom.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d4-6",
        time: "13:30 ~ 17:30",
        title: "⚔️ 이후 일정 (각자 이동 - 약 4시간 자유 코스!)",
        category: "sightseeing",
        icon: "Users",
        location: "오사카성 천수각 & 신사이바시 상점가",
        coordinates: { lat: 34.6873, lng: 135.5262 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Osaka+Castle",
        description: "각자의 취향에 맞춘 자유 분리 일정!\n• [남편 + 아들]: 오사카성 관람 (천수각 1회 입장 QR 바우처)\n• [지인님]: 신사이바시 주변 쇼핑 & 카페 자유시간 (혼자 여유롭게!)",
        recommendations: [
          "남편+아들 팀: 오사카성 천수각 전망대 & 말차 소프트 아이스크림",
          "지인님 팀: 다이마루 백화점 & 트렌디한 잡화 쇼핑"
        ],
        precautions: ["17:30에 난바/도톤보리에서 다시 만나기! (카카오톡/라인 연락)"],
        voucher: {
          id: "voucher-osaka-castle",
          title: "오사카성 천수각 입장 QR 바우처",
          subtitle: "2026 大阪城天守閣 ＆ 豊臣石垣館 1회 입관권",
          bookingNo: "TRIPLE-20260915-KQYA",
          travelerName: "DAEKYU PARK (대인 x 1)",
          date: "2026-10-07 이용 (유효기한 ~10/14)",
          time: "09:00 ~ 17:30 (마지막 입장 17:00)",
          location: "오사카성 천수각 입구 게이트 (1-1 Osakajo, Chuo-ku)",
          image: "/images/vouchers/osaka_castle_qr.jpg",
          badge: "NOL UNIVERSE 확정 QR",
          usageGuide: "매표소 줄을 서지 않고 천수각 입장 게이트에서 이 QR 코드를 바로 스캔하고 입장하세요!",
          note: "천수각 1회 입관권 + 도요토미 석벽관 1회 입관권 포함 (중학생 이하 무료)"
        },
        vocabCategories: [
          {
            categoryName: "🎟️ 오사카성 티켓 & 디저트",
            items: [
              {
                id: "v4-4-1",
                korean: "천수각 입장권 어른 1장 (600엔 / 중학생 이하 무료)",
                japanese: "天守閣 入場券 大人1枚（600円 / 中学生以下 無料）",
                pronunciation: "텐슈카쿠 뉴-죠-켄 오토나 이치마이",
                category: "ticket",
                image: "/images/vocab/castle_ticket.svg",
              },
              {
                id: "v4-4-4",
                korean: "우지 말차 진한 소프트 아이스크림 🍦",
                japanese: "宇治抹茶 濃厚ソフトクリーム",
                pronunciation: "우지 맛챠 노-코- 소후토쿠리-무",
                category: "order",
                image: "/images/vocab/icecream.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d4-7",
        time: "17:30 ~ 19:45",
        title: "다시 만나서 함께 이동 ➔ 도톤보리 저녁 식사 🍢",
        category: "food",
        icon: "Utensils",
        location: "도톤보리 거리 (Dotonbori)",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dotonbori+Glico+Sign",
        description: "오사카성 관람 후 난바로 복귀하여 전원 합류! 도톤보리로 함께 이동하여 맛있는 쿠시카츠, 라멘 등 저녁 식사",
        recommendations: ["쿠시카츠 다루마 또는 이치란 라멘 저녁 식사"],
        precautions: ["20:00 리버크루즈 탑승 15분 전 선착장 도착 필수"],
        vocabCategories: [
          {
            categoryName: "🍢 쿠시카츠 맛집 주문",
            items: [
              {
                id: "v4-9-1",
                korean: "인기 쿠시카츠 모둠 세트 하나 주세요.",
                japanese: "人気串カツ盛り合わせセットを1つお願いします。",
                pronunciation: "닌키 쿠시카츠 모리아와세 셋토오 히토츠 오네가이시마스",
                category: "order",
                image: "/images/vocab/kushikatsu.svg",
              },
              {
                id: "v4-9-3",
                korean: "생맥주(나마비루) 2잔 주세요 🍻",
                japanese: "生ビールを2杯お願いします。",
                pronunciation: "나마비-루오 니하이 오네가이시마스",
                category: "order",
                image: "/images/vocab/beer.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d4-8",
        time: "20:00 ~ 20:20",
        title: "도톤보리 리버크루즈 탑승 🛥️ (예약 시간 20:00 확정!)",
        category: "sightseeing",
        icon: "Ship",
        location: "도톤보리 돈키호테 앞 선착장 (하나투어패스 구매완료)",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tombori+River+Cruise",
        description: "도톤보리의 화려한 네온사인과 글리코상을 둘러보는 환상 야경 크루즈 (탑승 시간 약 20분)",
        recommendations: [
          "배가 글리코상 앞에 멈출 때 글리코 만세 포즈로 가족사진 촬영!"
        ],
        precautions: ["19:45까지 선착장 승선 대기 (늦을 시 탑승 및 환불 불가)"],
        voucher: {
          id: "voucher-tombori-cruise",
          title: "톤보리 리버크루즈 승선 티켓 (총 3명)",
          subtitle: "2026-10-07(수) 20:00 출항 예약 승선권",
          bookingNo: "Tombori River Cruise (20:00発)",
          travelerName: "성인 2명(¥2,000×2) + 어린이 1명(¥500×1)",
          date: "2026-10-07 (수)",
          time: "20:00 출항 (19:45까지 선착장 대기)",
          location: "도톤보리 돈키호테 도톤보리점 앞 승선장",
          image: "/images/vouchers/tombori_cruise_adult1_qr.jpg",
          badge: "공식 모바일 승선 티켓",
          usageGuide: "좌우 화살표 버튼 또는 상단 탭을 눌러 3장의 QR 코드를 차례대로 승선 게이트에 제시하세요.",
          note: "구매 후 취소/변경/재발행 불가 / 승선 시간에 늦을 경우 환불이 불가하므로 19:45까지 반드시 도착하세요.",
          familyMembers: [
            {
              id: "tc-adult-1",
              name: "대인 1 (¥2,000)",
              role: "🧑 대인 1 (Adult)",
              image: "/images/vouchers/tombori_cruise_adult1_qr.jpg"
            },
            {
              id: "tc-adult-2",
              name: "대인 2 (¥2,000)",
              role: "🧑 대인 2 (Adult)",
              image: "/images/vouchers/tombori_cruise_adult2_qr.jpg"
            },
            {
              id: "tc-child",
              name: "어린이 (¥500)",
              role: "🧒 어린이 (Child)",
              image: "/images/vouchers/tombori_cruise_child_qr.jpg"
            }
          ]
        },
        vocabCategories: [
          {
            categoryName: "🛥️ 도톤보리 크루즈 & 글리코상 포토",
            items: [
              {
                id: "v4-8-1",
                korean: "20시 예약 크루즈 승선권입니다.",
                japanese: "20時予約のクルーズ乗船券です。",
                pronunciation: "니쥬-지 요야쿠노 쿠루-즈 조-센켄데스",
                category: "ticket",
                image: "/images/vocab/ferry.svg",
              },
              {
                id: "v4-8-2",
                korean: "글리코상 앞에서 사진 한 장 찍어주실 수 있나요? 📸",
                japanese: "グリコの前で写真を1枚撮っていただけますか？",
                pronunciation: "구리코노 마에데 샤신오 이치마이 톳테 이타다케마스카?",
                category: "general",
                image: "/images/vocab/glico.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d4-9",
        time: "20:30 ~ 22:30",
        title: "저녁 2차 & 도톤보리 야경 산책 🌃",
        category: "food",
        icon: "Utensils",
        location: "도톤보리 / 신사이바시 야경 거리",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        description: "도톤보리 맛집에서 타코야키/디저트 간식, 신사이바시 밤거리 구경 및 쇼핑",
        recommendations: ["야경이 아름다운 에비스 다리에서 사진 촬영"],
        precautions: ["밤 인파 속 소지품 주의"]
      },
      {
        id: "d4-10",
        time: "22:30",
        title: "난바 숙소로 이동 & 휴식 🛌 (즐거운 하루 마무리! 내일도 기대돼요 :)",
        category: "hotel",
        icon: "Home",
        location: "사쿠라가와 호텔 난바 (체크인 15:00부터 가능)",
        coordinates: { lat: 34.666, lng: 135.492 },
        description: "사쿠라가와 호텔 난바 체크인 완료 및 방에서 편안한 휴식 (10/7~10/9 2박 연박)",
        recommendations: ["내일 우메다 쇼핑 데이를 위해 푹 쉬기"],
        precautions: ["체크인 완료 및 객실 키 수령"]
      }
    ],
    checklist: [
      { id: "c4-1", text: "호텔 체크아웃 & 난바 숙소 짐 보관", isImportant: true },
      { id: "c4-2", text: "몬스터헌터 카페 예약 확인 (12:00)", isImportant: true },
      { id: "c4-3", text: "오사카성 티켓 (남편+아들)", isImportant: true },
      { id: "c4-4", text: "도톤보리 리버크루즈 예약 확인 (20:00)", isImportant: true },
      { id: "c4-5", text: "난바 숙소 체크인 (15:00부터)" },
      { id: "c4-6", text: "쇼핑 예산 & 면세 쇼핑 리스트" },
      { id: "c4-7", text: "편한 신발, 보조배터리, 우산(날씨 확인)" }
    ],
    generalTips: [
      "난바는 도보 이동이 편리해요!",
      "몬스터헌터 카페는 예약 시간 10분 전 도착 필수!",
      "도톤보리 리버크루즈는 미리 도착해서 탑승장 위치 확인하기!",
      "짐이 많을 땐 호텔 짐 보관 서비스를 적극 이용!",
      "오사카 도심에서 맛있는 음식과 쇼핑 즐기기!"
    ]
  },

  // =========================================================================
  // DAY 5 (10/8 목): 우메다 쇼핑 & 맛집 탐방 DAY [쇼핑도 여행의 추억! 오늘 하루, 오사카를 더 특별하게 ❤️]
  // =========================================================================
  {
    dayNumber: 5,
    dateStr: "10/8",
    dayOfWeek: "목",
    title: "우메다 쇼핑 & 맛집 탐방 DAY",
    tagline: "쇼핑도 여행의 추억! 오늘 하루, 오사카를 더 특별하게 ❤️",
    hotelInfo: "사쿠라가와 호텔 난바 (10/7~10/9)",
    themeColor: "#F97316",
    gradient: "from-orange-500 to-amber-600",
    badge: {
      text: "우메다 쇼핑 & 돈키호테 난바 미도스지점",
      type: "highlight"
    },
    summaryItems: [
      "09:30 난바 숙소 출발 (지하철 약 10~15분)",
      "10:00 포켓몬센터 오사카 (굿즈 & 포토존)",
      "11:30 CAPCOM STORE & CAFE UMEDA (몬헌 굿즈)",
      "13:00 점심 식사 (우메다 맛집 - 스시, 라멘, 카츠)",
      "14:30 우메다 쇼핑 타임 (루쿠아, 그랜드프론트, 한큐/한신)",
      "17:00 카페 & 휴식 (스카이빌딩 또는 쇼핑몰 카페)",
      "18:30 저녁 식사 (우메다 또는 난바 맛집)",
      "20:00 돈키호테 난바 미도스지점 (필수 쇼핑)",
      "21:30 난바 숙소 복귀 & 짐정리"
    ],
    dayRouteQuery: "Sakuragawa+Hotel+Nanba+to+Pokemon+Center+Osaka+to+LUCUA+Osaka+to+Hankyu+Umeda+to+Don+Quijote+Namba",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Daimaru+Umeda+Osaka&t=&z=15&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d5-1",
        time: "09:30",
        title: "난바 숙소 출발 🚶 ➔ 우메다로 이동 (오늘도 신나는 하루 출발! ❤️)",
        category: "transport",
        icon: "Subway",
        location: "사쿠라가와 호텔 난바 ➔ 우메다역",
        coordinates: { lat: 34.7025, lng: 135.496 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Umeda+Station+Osaka",
        description: "난바에서 우메다로 이동 (오사카 메트로 미도스지선 지하철 약 10~15분)",
        recommendations: [
          "여권(면세 쇼핑 필수) 및 에코백 챙기기",
          "ICOCA 교통카드 터치"
        ],
        precautions: ["우메다역 하차 후 다이마루 / JR 오사카역 방면 출구 확인"]
      },
      {
        id: "d5-2",
        time: "10:00 ~ 11:30",
        title: "포켓몬센터 오사카 ⚡ (포켓몬센터 오사카 ❤️)",
        category: "shopping",
        icon: "Gamepad2",
        location: "포켓몬센터 오사카 (그랜드 프론트 남관 / 다이마루 우메다 13F)",
        coordinates: { lat: 34.7018, lng: 135.4975 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pokemon+Center+Osaka",
        description: "포켓몬 굿즈 쇼핑, 대형 피카츄 포토존 & 오사카 한정 상품 구경! (인기 굿즈는 오전 방문 추천)",
        recommendations: [
          "오사카 한정판 피카츄 인형 및 카드 게임, 학용품 굿즈 구매",
          "대형 포켓몬 조형물 앞에서 가족사진 촬영"
        ],
        precautions: ["매장 내 계산 줄 대기 시간 고려"],
        vocabCategories: [
          {
            categoryName: "⚡ 포켓몬센터 & 캐릭터 쇼핑",
            items: [
              {
                id: "v5-pk-1",
                korean: "오사카 한정판 피카츄 인형은 어디에 있나요?",
                japanese: "大阪限定のピカチュウのぬいぐるみはどこですか？",
                pronunciation: "오오사카 겐테-노 피카츄-노 누이구루미와 도코데스카?",
                category: "shopping",
                image: "/images/vocab/pokemon.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d5-3",
        time: "11:30 ~ 13:00",
        title: "CAPCOM STORE & CAFE UMEDA 🎮 (CAPCOM STORE & CAFE UMEDA ❤️)",
        category: "shopping",
        icon: "Swords",
        location: "CAPCOM STORE & CAFE UMEDA (다이마루 13F)",
        coordinates: { lat: 34.7018, lng: 135.4975 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=CAPCOM+STORE+UMEDA",
        description: "몬스터헌터 등 게임 굿즈 쇼핑, CAPCOM 카페 구경, 한정 상품 & 콜라보 굿즈!",
        recommendations: [
          "몬스터헌터 대형 피규어 및 아이루 봉제인형 구경",
          "스트리트파이터, 바이오하자드 한정 굿즈 쇼핑"
        ],
        precautions: ["인기 한정 굿즈 품절 여부 체크"],
        vocabCategories: [
          {
            categoryName: "🎮 캡콤 스토어 쇼핑",
            items: [
              {
                id: "v5-cp-1",
                korean: "몬스터헌터 피규어 새 상품 재고 있나요?",
                japanese: "モンスターハンターのフィギュアの新品在庫はありますか？",
                pronunciation: "몬스타- 한타-노 피규아노 신핀 자이코와 아리마스카?",
                category: "shopping",
                image: "/images/vocab/capcom.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d5-4",
        time: "13:00 ~ 14:30",
        title: "점심 식사 🍜 (우메다 - 맛있는 점심시간! ❤️)",
        category: "food",
        icon: "Utensils",
        location: "우메다 지역 맛집 (루쿠아 지하 바르치카 또는 다이마루 16층 식당가)",
        coordinates: { lat: 34.7025, lng: 135.496 },
        description: "우메다 지역 맛집에서 맛있는 식사 (스시, 라멘, 카츠 등, 현장 분위기에 맞춰 선택)",
        recommendations: [
          "루쿠아 지하 바르치카 라멘/함바그 맛집",
          "다이마루 16층 일식 정식 또는 돈카츠"
        ],
        precautions: ["14:30부터 본격적인 쇼핑 타임 시작"]
      },
      {
        id: "d5-5",
        time: "14:30 ~ 17:00",
        title: "우메다 쇼핑 타임 🛍️ (LUCUA OSAKA ❤️)",
        category: "shopping",
        icon: "ShoppingBag",
        location: "LUCUA / GRAND FRONT OSAKA / 한큐백화점 / 한신백화점",
        coordinates: { lat: 34.7035, lng: 135.498 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=LUCUA+osaka",
        description: "우메다 핵심 쇼핑 스팟 완전 정복!\n• LUCUA / LUCUA 1100 (JR 오사카역 직결 트렌디 쇼핑)\n• GRAND FRONT OSAKA (다양한 브랜드, 라이프스타일)\n• 한큐백화점 (패션, 화장품, 식품 등)\n• 한신백화점 (식품관, 디저트, 기념품)\n• 의류, 잡화, 스포츠 브랜드 쇼핑",
        recommendations: [
          "한큐백화점 지하 고급 디저트 및 1층 손수건 쇼핑",
          "5,000엔 이상 구매 시 백화점 면세(Tax Free) 카운터에서 당일 즉시 환급!"
        ],
        precautions: ["면세 혜택을 위해 여권 원본 반드시 지참"],
        vocabCategories: [
          {
            categoryName: "🛍️ 백화점 면세 & 쇼핑",
            items: [
              {
                id: "v5-7-1",
                korean: "면세(Tax Free) 카운터는 몇 층인가요?",
                japanese: "免税カウンターは何階ですか？",
                pronunciation: "멘제- 카운타-와 난카이데스카?",
                category: "shopping",
                image: "/images/vocab/taxfree.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d5-6",
        time: "17:00 ~ 18:30",
        title: "카페 & 휴식 ☕ 🍰 (우메다 스카이 빌딩 & 쇼핑몰 카페)",
        category: "food",
        icon: "Coffee",
        location: "우메다 스카이빌딩 주변 또는 쇼핑몰 내 카페",
        coordinates: { lat: 34.7055, lng: 135.4905 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Umeda+Sky+Building",
        description: "우메다 스카이빌딩 주변 카페 또는 쇼핑몰 내 카페에서 휴식, 잠시 여유로운 티타임",
        recommendations: ["달콤한 디저트와 커피로 다리 피로 충전"],
        precautions: ["저녁 식사 전 30분간 휴식"]
      },
      {
        id: "d5-7",
        time: "18:30 ~ 20:00",
        title: "저녁 식사 🥩 (맛있는 저녁타임! ❤️ 오사카의 밤도 즐겨요)",
        category: "food",
        icon: "Utensils",
        location: "우메다 또는 난바 식당가",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        description: "우메다 또는 난바로 이동하여 맛있는 저녁 식사, 현지 분위기 즐기기 (야키니쿠, 스키야키 등)",
        recommendations: ["가족과 함께 오사카 마지막 저녁 만찬"],
        precautions: ["20:00 돈키호테 쇼핑을 위해 난바로 이동"]
      },
      {
        id: "d5-8",
        time: "20:00 ~ 21:30",
        title: "돈키호테 난바 미도스지점 🐧 🛒 (일본 여행 필수 쇼핑!)",
        category: "shopping",
        icon: "ShoppingBag",
        location: "DON QUIJOTE 난바 미도스지점 (Don Quijote Namba Midosuji)",
        coordinates: { lat: 34.6698, lng: 135.5005 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Don+Quijote+Namba+Midosuji",
        description: "일본 여행 필수 쇼핑! 간식, 과자, 화장품, 의약품(동전파스, 카베진), 기념품 쇼핑 (여권 제시 면세 10% + 할인쿠폰)",
        recommendations: [
          "녹차 킷캣, 곤약젤리, 이치란 라멘 밀키트 구매",
          "5,000엔 이상 면세 전용 카운터에서 결제"
        ],
        precautions: ["위탁 수하물로 보낼 액체류는 기내 반입 불가이므로 캐리어에 넣을 준비"]
      },
      {
        id: "d5-9",
        time: "21:30",
        title: "난바 숙소 복귀 🛌 🧳 (지하철로 난바 이동 약 10분, 오늘도 수고했어요! :)",
        category: "hotel",
        icon: "PackageCheck",
        location: "사쿠라가와 호텔 난바",
        coordinates: { lat: 34.666, lng: 135.492 },
        description: "지하철로 난바 숙소 복귀 (약 10분), 쇼핑한 물품 캐리어 최종 패킹 및 내일 귀국 준비",
        recommendations: [
          "좋은 순간이 모여 행복한 여행이 된다 ❤️",
          "내일 아침 06:30 기상 및 07:00 체크아웃 준비 완료"
        ],
        precautions: ["여권, 항공권 E-티켓, 지갑 최종 점검"]
      }
    ],
    checklist: [
      { id: "c5-1", text: "교통카드 / 현금 (일부 매장)", isImportant: true },
      { id: "c5-2", text: "쇼핑할 브랜드 & 리스트", isImportant: true },
      { id: "c5-3", text: "편한 신발, 보조배터리" },
      { id: "c5-4", text: "카메라 or 휴대폰 (사진 필수!)", isImportant: true },
      { id: "c5-5", text: "쇼핑백(에코백) 챙기기" },
      { id: "c5-6", text: "즐길 마음! 😊 (좋은 것들을 보고, 사고, 먹고 행복을 채우는 하루 ❤️)", isImportant: true }
    ],
    generalTips: [
      "우메다는 쇼핑몰이 연결되어 있어 실내 이동으로 편리해요!",
      "인기 굿즈는 오전 방문 추천!",
      "면세 가능한 매장도 많으니 여권 지참!",
      "저녁에는 난바로 돌아와 돈키호테에서 마지막 쇼핑까지!"
    ]
  },

  // =========================================================================
  // DAY 6 (10/9 금): 한국으로 돌아가는 날 [아쉬움은 잠시, 다음 여행을 기약하며... 좋은 추억 가득한 오사카 여행 또 가자! ❤️]
  // =========================================================================
  {
    dayNumber: 6,
    dateStr: "10/9",
    dayOfWeek: "금",
    title: "한국으로 돌아가는 날 (귀국)",
    tagline: "아쉬움은 잠시, 다음 여행을 기약하며... 좋은 추억 가득한 오사카 여행 또 가자! ❤️",
    hotelInfo: "체크아웃 완료",
    themeColor: "#EC4899",
    gradient: "from-pink-500 to-rose-500",
    badge: {
      text: "OZ111 10:30 간사이 출발 ➔ 14:20 인천 도착",
      type: "info"
    },
    summaryItems: [
      "06:30 기상 & 짐 정리 (마지막 날 짐 최종 정리)",
      "07:00 난바 숙소 출발 (체크아웃, 짐 보관 없이 바로 이동)",
      "07:10 난바역으로 이동 (도보 약 10분 내외)",
      "07:30 난카이 공항급행 탑승 (약 45~50분, 자유석 성인 약 970엔)",
      "08:20 간사이공항 도착 (비행기 출발 2시간 전 도착)",
      "08:30 체크인 & 수하물 위탁 (아시아나항공 카운터)",
      "09:00 출국 수속 (보안검색 & 출국심사 & 면세점)",
      "10:00 탑승 전 대기 (탑승구 이동 & 탑승 준비)",
      "10:30 오사카 출발 (OZ111) ➔ 14:20 인천공항 도착"
    ],
    dayRouteQuery: "Sakuragawa+Hotel+Nanba+to+Nankai-Namba+Station+to+Kansai+Airport",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Kansai+International+Airport&t=&z=13&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d6-1",
        time: "06:30",
        title: "기상 & 짐 정리 🧳 (마지막까지 꼼꼼하게!)",
        category: "hotel",
        icon: "AlarmClock",
        location: "사쿠라가와 호텔 난바",
        coordinates: { lat: 34.666, lng: 135.492 },
        description: "마지막 날 짐 최종 정리, 잊은 물건 없는지 체크, 사용한 충전기/어댑터 등 챙기기",
        recommendations: ["객실 서랍과 콘센트에 두고 가는 물건 없는지 이중 확인"],
        precautions: ["07:00 체크아웃 준비 완료"]
      },
      {
        id: "d6-2",
        time: "07:00",
        title: "난바 숙소 출발 (체크아웃) 🚪",
        category: "hotel",
        icon: "LogOut",
        location: "사쿠라가와 호텔 난바 로비",
        coordinates: { lat: 34.666, lng: 135.492 },
        description: "체크아웃 완료! 캐리어 26인치 2개, 16~18인치 1개 챙겨 숙소에 짐 보관 없이 바로 이동",
        recommendations: ["열쇠/카드키 반납"],
        precautions: ["07:10까지 난바역 방향으로 출발"]
      },
      {
        id: "d6-3",
        time: "07:10",
        title: "난바역으로 이동 🚶 (난바역에서 출발! ❤️)",
        category: "transport",
        icon: "Footprints",
        location: "사쿠라가와 호텔 ➔ 난카이 난바역",
        coordinates: { lat: 34.6657, lng: 135.5023 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Nankai-Namba+Station",
        description: "도보 이동 (약 10분 내외)하여 난카이 난바역 3층 승강장으로 이동",
        recommendations: ["지하철 또는 도보로 난카이 난바역 승강장 이동"],
        precautions: ["07:30 공항급행 열차 탑승을 위해 07:25까지 개찰구 통과"]
      },
      {
        id: "d6-4",
        time: "07:30 ~ 08:20",
        title: "난카이 공항급행 탑승 🚅 (난카이 공항급행으로 편하게! ❤️)",
        category: "transport",
        icon: "Train",
        location: "난카이 난바역 ➔ 간사이공항역",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+Airport+Station",
        description: "난카이 난바역 ➔ 간사이공항 (소요시간 약 45~50분, 성인 약 970엔 지정석 없이 자유석 탑승)",
        recommendations: [
          "교통카드(ICOCA) 터치 또는 일반 승차권으로 탑승 (지정석 불필요)",
          "종점 간사이공항역까지 환승 없이 직행"
        ],
        precautions: ["공항선 급행 열차 확인 후 탑승"],
        vocabCategories: [
          {
            categoryName: "🚅 공항 열차 승차",
            items: [
              {
                id: "v6-5-1",
                korean: "간사이공항행 공항급행 승강장이 어디인가요?",
                japanese: "関西空港行きの空港急行の乗り場はどこですか？",
                pronunciation: "칸사이쿠-코- 유키노 쿠-코-큐-코-노 노리바와 도코데스카?",
                category: "transport",
                image: "/images/vocab/rapit.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d6-5",
        time: "08:20",
        title: "간사이공항 도착 (KIX) ✈️ (간사이공항 도착! ❤️)",
        category: "transport",
        icon: "PlaneTakeoff",
        location: "간사이국제공항 제1터미널 4층 국제선 출발층",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport",
        description: "비행기 출발 2시간 전 도착! 터미널 도착 후 체크인 및 수하물 위탁 준비",
        recommendations: ["아시아나항공 체크인 카운터 위치 전광판 확인"],
        precautions: ["10:30 출발 항공편이므로 신속하게 카운터 줄 서기"]
      },
      {
        id: "d6-6",
        time: "08:30 ~ 09:00",
        title: "체크인 & 수하물 위탁 🧳 (체크인하고, 출국 수속까지!)",
        category: "transport",
        icon: "Luggage",
        location: "간사이공항 T1 아시아나항공 카운터",
        coordinates: { lat: 34.432, lng: 135.2304 },
        description: "아시아나항공 카운터에서 체크인, 수하물 위탁(캐리어 3개) 및 탑승권 수령",
        recommendations: ["수하물 무게 제한(23kg) 초과 여부 확인"],
        precautions: ["액체류와 라이터/보조배터리 규정 준수"]
      },
      {
        id: "d6-7",
        time: "09:00 ~ 10:00",
        title: "출국 수속 & 면세구역 쇼핑 🛍️ (DUTY FREE)",
        category: "shopping",
        icon: "ShoppingBag",
        location: "간사이공항 면세 구역",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+Airport+Duty+Free",
        description: "보안검색 및 출국심사 후 면세구역으로 이동, 로이스 생초콜릿, 도쿄 바나나, 시로이 코이비토 쇼핑",
        recommendations: [
          "로이스 생초콜릿 보냉백(100엔) 추가",
          "남은 엔화 동전 전액 결제 + 잔액 카드 결제 꿀팁 활용!"
        ],
        precautions: ["면세점 구경은 시간 여유 있게 하고 탑승구 위치 미리 확인"],
        vocabCategories: [
          {
            categoryName: "🍫 공항 면세점 인기 과자 & 결제",
            items: [
              {
                id: "v6-6-1",
                korean: "로이스 생초콜릿 오레(밀크맛) 1개 주세요 🍫",
                japanese: "ロイズ生チョコレート（オーレ味）を1つください。",
                pronunciation: "로이즈 나마쵸코레-토 (오-레 아지)오 히토츠 쿠다사이",
                category: "shopping",
                image: "/images/vocab/royce.svg",
              },
              {
                id: "v6-6-3",
                korean: "보냉백(아이스팩 포장) 추가해 주세요 (100엔)",
                japanese: "保冷バッグ（ドライアイス付き）を追加してください。",
                pronunciation: "호레- 박구 (도라이 아이스 츠키)오 츠이카 시테 쿠다사이",
                category: "shopping",
                image: "/images/vocab/royce.svg",
              },
              {
                id: "v6-6-4",
                korean: "남은 동전(현금) 다 쓰고, 나머지는 카드로 결제할게요!",
                japanese: "小銭（現金）を使い切って、残りをカードで払います！",
                pronunciation: "코제니(겐킨)오 츠카이킷테, 노코리오 카-도데 하라이마스!",
                category: "shopping",
                image: "/images/vocab/taxfree.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d6-8",
        time: "10:00 ~ 10:30",
        title: "탑승 전 대기 ✈️ (출발 전, 잠시 여유 시간! ❤️)",
        category: "transport",
        icon: "Clock",
        location: "간사이공항 OZ111 탑승구 게이트",
        coordinates: { lat: 34.432, lng: 135.2304 },
        description: "탑승구로 이동, 간단한 쇼핑 또는 휴식, 탑승 준비 (10:00 탑승 시작)",
        recommendations: ["탑승구와 출발 시간을 꼭 다시 확인!"],
        precautions: ["10:10까지 탑승 게이트 착석"]
      },
      {
        id: "d6-9",
        time: "10:30 ~ 14:20",
        title: "오사카 출발 ✈️ (OZ111) ➔ 인천공항 도착 (See you Korea! ❤️)",
        category: "transport",
        icon: "Plane",
        location: "간사이공항(10:30) ➔ 인천공항 T2(14:20 도착)",
        coordinates: { lat: 37.4602, lng: 126.4407 },
        description: "아시아나 OZ111편 출발 (비행시간 약 1시간 50분) ➔ 14:20 인천국제공항 안전하게 도착, 입국 수속 후 짐 찾기 및 귀국 완료! (좋은 사람들과, 행복한 추억을 가득 담은 오사카 여행 또 가자! ❤️)",
        recommendations: ["한국에서 다시 일상으로! 즐거웠던 오사카 5박 6일 추억 저장"],
        precautions: ["인천공항 수하물 수령 후 세관 통과"]
      }
    ],
    checklist: [
      { id: "c6-1", text: "여권 (가족 모두)", isImportant: true },
      { id: "c6-2", text: "항공권 (모바일 or 출력본 OZ111)", isImportant: true },
      { id: "c6-3", text: "수하물 (캐리어 3개)", isImportant: true },
      { id: "c6-4", text: "충전기, 어댑터, 전자기기" },
      { id: "c6-5", text: "구매한 쇼핑물품 빠짐없이 챙기기" },
      { id: "c6-6", text: "숙소 내 두고 가는 물건 확인" },
      { id: "c6-7", text: "교통카드 잔액 사용 또는 환불" },
      { id: "c6-8", text: "즐거웠던 여행, 좋은 추억 가득! ❤️", isImportant: true }
    ],
    generalTips: [
      "공항에는 비행기 출발 2시간 전 도착하기! (08:20 도착 완료)",
      "난카이 공항급행은 약 45~50분 소요됩니다.",
      "면세점 구경은 시간 여유 있게 즐기기!",
      "탑승구와 출발 시간을 꼭 다시 확인!",
      "마지막까지 안전하고 즐거운 여행 되세요! See you Korea! ❤️"
    ]
  }
];
