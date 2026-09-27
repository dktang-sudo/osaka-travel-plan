export interface RouteOption {
  id: string;
  label: string; // 버튼 표시 텍스트 (예: "캡틴라인 선착장 동선 (도보 5분)")
  badge?: string; // 예: "도보 5분", "직행 70분", "지하철 35분"
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
  korean: string;        // 한국어 뜻 (예: "성인 왕복 승선권")
  japanese: string;      // 일본어 한자/가나 (예: "大人 往復乗船券")
  pronunciation: string; // 한국어 발음 (예: "오토나 오-후쿠 조-센켄")
  category: 'ticket' | 'order' | 'shopping' | 'transport' | 'service' | 'general';
  image?: string;        // 시각 자료 이미지 경로 (예: "/images/vocab/ticket.svg")
  situationTip?: string; // 현지 사용 팁 (예: "매표소 직원에게 손가락 2개와 함께 화면을 보여주세요")
}

export interface VocabularyCategory {
  categoryName: string; // 카테고리 명칭 (예: "🎟️ 매표 & 입장권 용어", "🍜 메뉴 주문 & 요청")
  items: VocabItem[];
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
    departure: "가는 편: 10/4 (일) OZ114 16:40 인천 출발 ➔ 18:30 간사이공항 도착",
    return: "오는 편: 10/9 (금) OZ111 10:30 간사이공항 출발 ➔ 12:30 인천 도착",
  },
  hotels: {
    hotel1: {
      name: "더 싱귤러리 호텔 & 스카이스파 (The Singulari Hotel)",
      period: "10/4 ~ 10/7 (3박)",
      note: "USJ 바로 앞! JR 유니버설시티역 직결 & 전망 온천 대욕장",
    },
    hotel2: {
      name: "사쿠라가와 호텔 난바 (Hotel Sakura River Namba)",
      period: "10/7 ~ 10/9 (2박)",
      note: "난바/신사이바시/도톤보리 인근 쾌적한 도심 숙소",
    },
  },
  reservations: [
    "항공권 (아시아나 OZ114 / OZ111)",
    "숙소 2곳 (더 싱귤러리 3박 + 사쿠라가와 난바 2박)",
    "USJ 입장권 + 익스프레스 패스 (10/6 확정)",
    "가이유칸 (10/5 10:30 입장) & 캡틴라인 왕복",
    "몬스터헌터 카페 웨스트 런치 (10/7 12:00)",
    "도톤보리 리버크루즈 (10/7 20:00 예약 완료)",
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
  // ==========================================
  // DAY 1 (10/4 일): 간사이공항 도착 ➔ USJ 이동
  // ==========================================
  {
    dayNumber: 1,
    dateStr: "10/4",
    dayOfWeek: "일",
    title: "간사이공항 도착 ➔ USJ 이동",
    tagline: "설레는 오사카 3명 가족 여행의 시작! ✨",
    hotelInfo: "더 싱귤러리 호텔 (USJ 앞)",
    themeColor: "#3B82F6",
    gradient: "from-blue-500 to-cyan-500",
    badge: {
      text: "OZ114 항공편 & 공항 픽업",
      type: "info"
    },
    summaryItems: [
      "16:40 인천 출발 (OZ114)",
      "18:30 간사이공항 도착",
      "19:00 공항 픽업 (INNN)",
      "20:00 더 싱귤러리 호텔 체크인",
      "20:30 시티워크 저녁 & 쇼핑",
      "22:00 호텔 복귀 & 휴식"
    ],
    dayRouteQuery: "Kansai+Airport+to+The+Singulari+Hotel+Osaka",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=The+Singulari+Hotel+and+Skyspa+at+Universal+Studios+Japan&t=&z=14&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d1-1",
        time: "16:40 ~ 18:30",
        title: "인천공항 출발 ✈️ 간사이공항 도착 (OZ114)",
        category: "transport",
        icon: "Plane",
        location: "인천국제공항 ➔ 간사이국제공항 T1",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport",
        description: "아시아나 OZ114편으로 16:40 인천 출발 후 18:30 간사이공항 도착, 입국 수속 진행",
        recommendations: [
          "Visit Japan Web QR코드(입국/세관) 사전 캡처본 미리 열어두기",
          "비행기 착륙 직후 eSIM 데이터 로밍 켜기"
        ],
        precautions: [
          "입국 심사 및 수하물 수령 후 19:00 픽업 기사님 미팅 포인트로 이동"
        ]
      },
      {
        id: "d1-2",
        time: "19:00 ~ 20:00",
        title: "공항 픽업(INNN) 🚗 ➔ USJ 이동 (약 40~50분)",
        category: "transport",
        icon: "Car",
        location: "간사이공항 ➔ 더 싱귤러리 호텔",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Singulari+Hotel+and+Skyspa",
        description: "사전 예약된 공항 픽업 차량(INNN)을 타고 편안하게 USJ 앞 더 싱귤러리 호텔로 직행",
        recommendations: [
          "무거운 캐리어를 들고 환승할 필요 없이 호텔 로비 앞까지 바로 도착!",
          "차량 이동 중 창밖으로 오사카만 야경 감상"
        ],
        precautions: [
          "픽업 기사님 연락(카톡/라인) 확인 및 미팅 장소 엄수"
        ]
      },
      {
        id: "d1-3",
        time: "20:00",
        title: "더 싱귤러리 호텔 체크인 🏨 (USJ 앞)",
        category: "hotel",
        icon: "Hotel",
        location: "더 싱귤러리 호텔 & 스카이스파 (The Singulari Hotel)",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=The+Singulari+Hotel+and+Skyspa",
        description: "USJ 및 유니버설시티역 바로 앞 특급 호텔 체크인 (10/4~10/7 3박 연박)",
        recommendations: [
          "14층 전망 스카이스파(대욕장/노천탕) 운영 시간(15:00~익일 11:00) 확인",
          "내일 아침 조식 뷔페 시간 및 캡틴라인 선착장 동선 확인"
        ],
        precautions: [
          "여권 3명 전원 제시 및 룸 키 수령"
        ]
      },
      {
        id: "d1-4",
        time: "20:30 ~ 22:00",
        title: "유니버설 시티워크 저녁 식사 & 쇼핑 🍜",
        category: "food",
        icon: "Utensils",
        location: "유니버설 시티워크 오사카 (Universal Citywalk)",
        coordinates: { lat: 34.668, lng: 135.4375 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Universal+Citywalk+Osaka",
        description: "호텔 바로 앞 화려한 시티워크 거리에서 타코야키 파크(TAKOPA) 또는 맛있는 저녁 식사 및 간식 쇼핑",
        recommendations: [
          "TAKOPA (타코야키 파크): 5대 유명 타코야키(쿠쿠루, 주하치반) 맛 비교",
          "풍월(후게츠) 오코노미야키 또는 놀부/모스버거 등 다양한 맛집"
        ],
        precautions: [
          "내일 가이유칸 일정을 위해 무리하지 않고 편안하게 식사"
        ]
      },
      {
        id: "d1-5",
        time: "22:00",
        title: "호텔 복귀 & 휴식 🌙",
        category: "hotel",
        icon: "Home",
        location: "더 싱귤러리 호텔 객실 & 스카이스파",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔 14층 스카이스파 온천욕 후 편안한 취침",
        recommendations: ["온천 대욕장에서 비행 피로 풀고 내일 09:00 출발 대비"],
        precautions: ["스카이스파 이용 시 객실 가운 및 전용 슬리퍼 착용 가능"]
      }
    ],
    checklist: [
      { id: "c1-1", text: "여권 3인분 & 항공권 E-티켓 (OZ114)", isImportant: true },
      { id: "c1-2", text: "Visit Japan Web 입국/세관 QR코드 캡처", isImportant: true },
      { id: "c1-3", text: "공항 픽업 (INNN) 예약 바우처 & 기사님 연락처", isImportant: true },
      { id: "c1-4", text: "더 싱귤러리 호텔 예약 확인서 (3박)" }
    ],
    generalTips: [
      "첫날은 공항 픽업 차로 호텔에 도착 후 시티워크에서 맛있는 저녁을 먹고 스카이스파에서 푹 쉬는 힐링 코스입니다!",
      "호텔 1층 편의점(세븐일레븐)에서 생수와 간식을 미리 구매해두면 편리합니다."
    ]
  },

  // ==========================================
  // DAY 2 (10/5 월): 가이유칸 & 곤충샵
  // ==========================================
  {
    dayNumber: 2,
    dateStr: "10/5",
    dayOfWeek: "월",
    title: "가이유칸 & 곤충샵",
    tagline: "바다를 건너 고래상어와 희귀 곤충을 만나러 가는 날! 🚢",
    hotelInfo: "더 싱귤러리 호텔 (USJ 앞)",
    themeColor: "#0D9488",
    gradient: "from-teal-500 to-emerald-600",
    badge: {
      text: "가이유칸 10:30 입장 예약",
      type: "warning"
    },
    summaryItems: [
      "09:00 호텔 조식 후 출발",
      "09:30 캡틴라인 승선 (USJ ➔ 덴포잔 10분)",
      "10:00 덴포잔 도착",
      "10:30 가이유칸 수족관 관람",
      "12:30 점심 식사 (덴포잔 주변)",
      "13:30 INSECTSHOP KMY 곤충샵",
      "16:00 덴포잔 선착장 이동",
      "16:30 캡틴라인 복귀 승선",
      "17:00 USJ 시티워크 자유시간 & 저녁"
    ],
    dayRouteQuery: "Universal+Cityport+to+Kaiyukan+to+Tempozan+Marketplace",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Osaka+Aquarium+Kaiyukan&t=&z=15&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d2-1",
        time: "09:00",
        title: "호텔 조식 후 출발 🥞",
        category: "hotel",
        icon: "Utensils",
        location: "더 싱귤러리 호텔 조식당",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "호텔에서 든든한 조식 식사 후 캡틴라인 선착장으로 이동 준비",
        recommendations: ["호텔 바로 앞 유니버설 시티포트 선착장까지 도보 3분"],
        precautions: ["09:30 캡틴라인 출발 시각 10분 전 선착장 도착"]
      },
      {
        id: "d2-2",
        time: "09:30 ~ 10:00",
        title: "캡틴라인 승선 🚢 (USJ → 덴포잔, 약 10분)",
        category: "transport",
        icon: "Ship",
        location: "유니버설 시티포트 선착장",
        coordinates: { lat: 34.6661, lng: 135.4367 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Captain+Line+Universal+City+Port",
        description: "유니버설시티에서 덴포잔(가이유칸)으로 바다를 건너 직행하는 쾌속선 페리",
        recommendations: [
          "야외 2층 덱 좌석에서 시원한 바닷바람과 오사카만 풍경 촬영",
          "왕복 승선권 구매 (돌아오는 16:30 티켓 확보)"
        ],
        precautions: ["출항 10분 전 승선 게이트 대기"],
        vocabCategories: [
          {
            categoryName: "🎟️ 캡틴라인 티켓 종류 & 매표",
            items: [
              {
                id: "v2-2-1",
                korean: "대인(중학생 이상) 왕복 승선권 (1,700엔)",
                japanese: "大人（中学生以上） 往復乗船券 1枚",
                pronunciation: "오토나(츄-갓쿠세- 이죠-) 오-후쿠 조-센켄 이치마이",
                category: "ticket",
                image: "/images/vocab/ticket.svg",
              },
              {
                id: "v2-2-3",
                korean: "소인(초등학생) 왕복 승선권 (850엔)",
                japanese: "小人（小学生） 往復乗船券 1枚",
                pronunciation: "쇼-닌(쇼-갓쿠세-) 오-후쿠 조-센켄 이치마이",
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
        time: "10:00 ~ 10:30",
        title: "덴포잔 도착 & 가이유칸 광장 산책 🎡",
        category: "sightseeing",
        icon: "MapPin",
        location: "덴포잔 하버빌리지 광장",
        coordinates: { lat: 34.6548, lng: 135.4285 },
        description: "덴포잔 선착장 하선 후 가이유칸 정문 광장 이동, 대관람차 배경 사진 촬영",
        recommendations: ["10:30 예약 입장 시간 전 여유롭게 포토존 즐기기"],
        precautions: ["모바일 QR 입장권 화면 사전 준비"]
      },
      {
        id: "d2-4",
        time: "10:30 ~ 12:30",
        title: "가이유칸 수족관 관람 🐋 (입장 10:30)",
        category: "sightseeing",
        icon: "Fish",
        location: "가이유칸 (Osaka Aquarium Kaiyukan)",
        coordinates: { lat: 34.6545, lng: 135.429 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Osaka+Aquarium+Kaiyukan",
        description: "세계 최대 규모 태평양 수조의 거대 고래상어, 펭귄, 물범, 해파리 환상 관람",
        recommendations: [
          "거대 고래상어가 지나갈 때 메인 수조 앞에서 가족 인생샷 촬영",
          "가이유칸 한정 '미즈타마리 소다 소프트 아이스크림' 맛보기"
        ],
        precautions: ["수조 플래시 촬영 금지 구역 준수"],
        vocabCategories: [
          {
            categoryName: "🎟️ 가이유칸 티켓 & 시설 용어",
            items: [
              {
                id: "v2-3-1",
                korean: "모바일 예약 QR 티켓입니다 (10:30 입장).",
                japanese: "ウェブ予約のQRチケットです（10:30入場）。",
                pronunciation: "웨부 요야쿠노 큐-아-루 치켓토데스",
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
              {
                id: "v2-3-9",
                korean: "고래상어 봉제인형 선물 포장 부탁드립니다 🎁",
                japanese: "ジンベエザメのぬいぐるみをプレゼント包装でお願いします。",
                pronunciation: "진베-자메노 누이구루미오 푸레젠토 호-소-데 오네가이시마스",
                category: "shopping",
                image: "/images/vocab/whale.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d2-5",
        time: "12:30 ~ 13:30",
        title: "점심 식사 🍴 (덴포잔 주변 / 나니와 쿠이신보 요코초)",
        category: "food",
        icon: "Utensils",
        location: "덴포잔 마켓플레이스 2층 푸드코트",
        coordinates: { lat: 34.6558, lng: 135.4308 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tempozan+Marketplace",
        description: "레트로 먹거리 골목 '나니와 쿠이신보 요코초'에서 원조 타코야키(아이즈야), 자유켄 카레, 오코노미야키 식사",
        recommendations: [
          "아이즈야: 1935년 원조 타코야키 & 라디오야키",
          "자유켄: 날계란 비빔 명물 카레"
        ],
        precautions: ["점심 피크 타임 대기 고려하여 식사 진행"],
        vocabCategories: [
          {
            categoryName: "🐙 덴포잔 마켓플레이스 맛집 메뉴",
            items: [
              {
                id: "v2-4-1",
                korean: "원조 타코야키 (소스 없이 먹는 원조 국물맛)",
                japanese: "元祖たこ焼き（ソースなし・出汁の旨味）",
                pronunciation: "간소 타코야키 (소-스 나시 · 다시노 우마미)",
                category: "order",
                image: "/images/vocab/takoyaki.svg",
              },
              {
                id: "v2-4-5",
                korean: "명물 카레 (날계란 비빔 카레, 우스터 소스 뿌려먹기)",
                japanese: "名物カレー（生卵入り・混ぜカレー）",
                pronunciation: "메-부츠 카레- (나마타마고 이리 · 마제 카레-)",
                category: "order",
                image: "/images/vocab/curry.svg",
              },
              {
                id: "v2-4-8",
                korean: "부타타마 (돼지고기 오코노미야키)",
                japanese: "豚玉 お好み焼き（定番人気）",
                pronunciation: "부타타마 오코노미야키 (테-반 닌키)",
                category: "order",
                image: "/images/vocab/okonomiyaki.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d2-6",
        time: "13:30 ~ 15:30",
        title: "INSECTSHOP KMY (곤충샵) 방문 🐞",
        category: "shopping",
        icon: "Bug",
        location: "INSECTSHOP KMY OSAKA",
        coordinates: { lat: 34.6565, lng: 135.433 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=INSECTSHOP+KMY+OSAKA",
        description: "덴포잔 인근의 유명 곤충 전문샵 KMY 방문! 희귀 장수풍뎅이, 사슴벌레, 표본, 피규어 구경",
        recommendations: [
          "아들과 함께 살아있는 헤라클레스 장수풍뎅이 실물 관람",
          "소장용 표본 상자 및 곤충 피규어 굿즈 쇼핑"
        ],
        precautions: [
          "★ 살아있는 생체 곤충은 검역법상 한국 반입이 불가하므로 표본/피규어 위주 구매!"
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
                id: "v2-5-2",
                korean: "사슴벌레 피규어 / 굿즈 어디 있나요?",
                japanese: "クワガタのフィギュアやグッズはどこですか？",
                pronunciation: "쿠와가타노 피규아야 굿즈와 도코데스카?",
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
        time: "16:00 ~ 16:30",
        title: "덴포잔 선착장 이동 🚶",
        category: "transport",
        icon: "Navigation",
        location: "덴포잔 캡틴라인 선착장",
        coordinates: { lat: 34.6548, lng: 135.4285 },
        description: "곤충샵에서 덴포잔 선착장으로 이동하여 16:30 복귀 페리 탑승 준비",
        recommendations: ["선착장 앞 기념품 숍 또는 대관람차 배경 가족사진"],
        precautions: ["16:30 배 놓치지 않도록 16:15까지 선착장 도착"]
      },
      {
        id: "d2-8",
        time: "16:30 ~ 17:00",
        title: "캡틴라인 승선 🚢 (덴포잔 → USJ, 약 10분)",
        category: "transport",
        icon: "Ship",
        location: "덴포잔 선착장 ➔ 유니버설 시티포트",
        coordinates: { lat: 34.6661, lng: 135.4367 },
        description: "캡틴라인 복귀 편 탑승하여 유니버설 시티로 귀환",
        recommendations: ["석양빛으로 물드는 오사카만 해안 뷰 감상"],
        precautions: ["하선 시 소지품(쇼핑백, 곤충 표본) 잘 챙기기"]
      },
      {
        id: "d2-9",
        time: "17:00 ~ 저녁",
        title: "USJ 도착 후 자유시간 (시티워크, 쇼핑 등) 🛍️",
        category: "sightseeing",
        icon: "ShoppingBag",
        location: "유니버설 시티워크 & 호텔 주변",
        coordinates: { lat: 34.668, lng: 135.4375 },
        description: "호텔에 짐을 두고 시티워크에서 저녁 식사 및 쇼핑, 내일 USJ 대비",
        recommendations: [
          "내일 USJ 올데이 일정을 위해 편의점에서 간식 및 음료 미리 구비",
          "USJ 공식 앱에 입장권 등록 및 위치 권한 확인"
        ],
        precautions: ["내일 USJ 오픈런을 위해 밤 10시 이전 조기 취침"]
      },
      {
        id: "d2-10",
        time: "저녁 이후",
        title: "호텔 복귀 후 휴식 🛌",
        category: "hotel",
        icon: "Home",
        location: "더 싱귤러리 호텔 객실 & 스카이스파",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔 스카이스파에서 온천욕 후 취침",
        recommendations: ["발바닥에 휴족시간 붙이고 편안하게 휴식"],
        precautions: ["내일 아침 08:30 조식 후 입장 준비"]
      }
    ],
    checklist: [
      { id: "c2-1", text: "가이유칸 모바일 예약 QR 티켓 (10:30)", isImportant: true },
      { id: "c2-2", text: "캡틴라인 왕복 승선권 (09:30 / 16:30)", isImportant: true },
      { id: "c2-3", text: "INSECTSHOP KMY 곤충샵 위치 지도 확인" },
      { id: "c2-4", text: "내일 USJ 입장권 + 익스프레스 패스 바코드 사전 점검", isImportant: true }
    ],
    generalTips: [
      "캡틴라인 배를 타면 USJ에서 가이유칸까지 전철 환승 없이 10분 만에 시원하게 바다를 건넙니다.",
      "가이유칸 관람 후 덴포잔 마켓플레이스에서 맛있는 점심을 먹고 KMY 곤충샵까지 도보로 쾌적하게 이동할 수 있습니다."
    ]
  },

  // ==========================================
  // DAY 3 (10/6 화): USJ 종일! (익스프레스 확정)
  // ==========================================
  {
    dayNumber: 3,
    dateStr: "10/6",
    dayOfWeek: "화",
    title: "USJ 종일!",
    tagline: "슈퍼 닌텐도 월드 & 동키콩 & 미니언즈 완전 정복! 🎪",
    hotelInfo: "더 싱귤러리 호텔 (USJ 앞)",
    themeColor: "#EF4444",
    gradient: "from-red-500 to-amber-500",
    badge: {
      text: "익스프레스 패스 시간표 확정!",
      type: "highlight"
    },
    summaryItems: [
      "08:30 조식 후 입장 준비",
      "09:00 USJ 입장 (익스프레스)",
      "10:00 미니언 메이헴 (익스)",
      "12:20 닌텐도 월드 입장 (12:20~13:20)",
      "12:20 마리오카트 (12:20~12:50)",
      "12:50 동키콩 (12:50~13:20)",
      "13:30 워터월드 쇼 (또는 15:00)",
      "오후 자유 어트랙션 & 쇼핑",
      "20:00 파크 퇴장 및 저녁 식사",
      "21:00 호텔 복귀 & 휴식"
    ],
    dayRouteQuery: "Universal+Studios+Japan",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Universal+Studios+Japan&t=&z=15&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d3-1",
        time: "08:30",
        title: "호텔 조식 후 입장 준비 ⏰",
        category: "hotel",
        icon: "AlarmClock",
        location: "더 싱귤러리 호텔",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "호텔에서 든든하게 조식을 먹고 보조배터리와 QR 티켓 준비 후 출발",
        recommendations: ["호텔에서 USJ 파크 정문까지 도보 3분 초근접!"],
        precautions: ["보조배터리 완충 및 편한 운동화 착용"]
      },
      {
        id: "d3-2",
        time: "09:00",
        title: "USJ 파크 입장 🎟️ (익스프레스 패스 지참)",
        category: "theme_park",
        icon: "Ticket",
        location: "USJ 메인 게이트",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan+Main+Gate",
        description: "파크 입장 후 첫 번째 익스프레스 일정인 미니언 파크로 이동",
        recommendations: ["파크 입장 직후 USJ 공식 앱에서 쇼 공연 시간표 확인"],
        precautions: ["셀카봉 및 위험물 반입 불가 (게이트 보안검색)"]
      },
      {
        id: "d3-3",
        time: "10:00",
        title: "⚡ [익스프레스] 미니언 메이헴 탑승 🍌",
        category: "theme_park",
        icon: "Sparkles",
        location: "미니언 파크 (Minion Park)",
        coordinates: { lat: 34.666, lng: 135.431 },
        description: "익스프레스 전용 라인으로 대기 없이 짜릿한 미니언 메이헴 탑승!",
        recommendations: [
          "탑승 후 미니언 파크 가판대에서 미니언 팝콘통 구매",
          "귀여운 미니언즈들과 기념사진 촬영"
        ],
        precautions: ["익스프레스 패스 QR코드 제시"]
      },
      {
        id: "d3-4",
        time: "12:20 ~ 13:20",
        title: "⭐ [익스프레스] 슈퍼 닌텐도 월드 에어리어 입장 🍄",
        category: "theme_park",
        icon: "Sparkles",
        location: "슈퍼 닌텐도 월드 (Super Nintendo World)",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Super+Nintendo+World+USJ",
        description: "초록색 거대 토관을 통과하여 꿈의 마리오 세상 슈퍼 닌텐도 월드 진입! (지정 입장시간 12:20 ~ 13:20)",
        recommendations: [
          "파워업 밴드 착용 후 물음표 블록을 치며 코인 모으기",
          "키노피오 카페에서 슈퍼버섯 피자볼 & 마리오 버거 점심 식사"
        ],
        precautions: ["지정된 입장 시간(12:20) 엄수! 퇴장 후 재입장 불가"],
        vocabCategories: [
          {
            categoryName: "🎟️ 닌텐도 월드 & 키노피오 카페",
            items: [
              {
                id: "v3-3-1",
                korean: "슈퍼 닌텐도 월드 익스프레스 입장 시간입니다 (12:20).",
                japanese: "スーパー・ニンテンドー・ワールド エリア入場時間です。",
                pronunciation: "스-파- 닌텐도- 와-루도 에리아 뉴-조- 지칸데스",
                category: "ticket",
                image: "/images/vocab/nintendo.svg",
              },
              {
                id: "v3-3-5",
                korean: "슈퍼버섯 피자볼 (베이컨&토마토 소스 들어간 바삭한 빵)",
                japanese: "大人気！スーパーキノコ・ピッツァボウル",
                pronunciation: "다이닌키! 스-파- 키노코 핏차 보-루",
                category: "order",
                image: "/images/vocab/nintendo.svg",
              },
              {
                id: "v3-3-6",
                korean: "마리오 베이컨 치즈 버거",
                japanese: "マリオ・バーガー（ベーコン＆チーズ）",
                pronunciation: "마리오 바-가- (베-콘 앤도 치-즈)",
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
        title: "🏎️ [익스프레스] 마리오 카트: 쿠파의 도전장",
        category: "theme_park",
        icon: "Gamepad2",
        location: "쿠파 성 (Bowser's Castle)",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        description: "AR 안경을 쓰고 실제로 카트를 운전하며 등껍질을 던지는 최첨단 어트랙션!",
        recommendations: ["쿠파 성 내부의 정교한 트로피와 연출 구경"],
        precautions: ["익스프레스 패스 전용 게이트로 입장 (지정시간 12:20~12:50)"]
      },
      {
        id: "d3-6",
        time: "12:50 ~ 13:20",
        title: "🦍 [익스프레스] 동키콩의 크레이지 트램 (신규 구역!)",
        category: "theme_park",
        icon: "Sparkles",
        location: "동키콩 컨트리 (Donkey Kong Country)",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        description: "2024 신규 오픈 동키콩 구역에서 레일을 점프해 달리는 스릴 넘치는 롤러코스터!",
        recommendations: [
          "황금 바나나 신전 배경 기념사진",
          "동키콩 시그니처 굿즈 및 배럴 스낵 맛보기"
        ],
        precautions: ["지정시간 12:50~13:20 준수하여 익스프레스 라인 탑승"],
        vocabCategories: [
          {
            categoryName: "🦍 동키콩 구역 표현",
            items: [
              {
                id: "v3-dk-1",
                korean: "동키콩 크레이지 트램 익스프레스 탑승권입니다.",
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
        time: "13:30 (또는 15:00)",
        title: "🌊 워터월드 라이브 스턴트 쇼 관람",
        category: "sightseeing",
        icon: "Sparkles",
        location: "워터월드 스타디움",
        coordinates: { lat: 34.6665, lng: 135.4315 },
        description: "영화 워터월드를 배경으로 펼쳐지는 초대형 수상 폭발 & 비행기 불시착 스턴트 쇼!",
        recommendations: [
          "젖지 않는 뒤쪽 좌석(갈색 시트)에 착석",
          "압도적인 물 폭탄과 박진감 넘치는 액션 감상"
        ],
        precautions: ["앞쪽 파란색 좌석(Wet Zone)은 물이 많이 튀므로 주의"]
      },
      {
        id: "d3-8",
        time: "오후 ~ 20:00",
        title: "해리포터 존 & 자유 어트랙션 & 쇼핑 🧙‍♂️",
        category: "theme_park",
        icon: "Sparkles",
        location: "해리포터 존 & 할리우드 & 뉴욕 에어리어",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        description: "호그와트 성 포비든 저니, 버터맥주(무알콜) 시식, 기념품 쇼핑 및 야경 감상",
        recommendations: [
          "해리포터 버터맥주(무알콜) 마시고 입술에 거품 수염 인증샷!",
          "호그와트 성 앞 연못에 비치는 반영 사진 촬영"
        ],
        precautions: ["지친 아들을 위해 중간중간 벤치와 카페에서 수분 보충"],
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
              {
                id: "v3-3-9",
                korean: "기념품 컵 포함 버터맥주로 주세요.",
                japanese: "プレミアムマグカップ付きでお願いします。",
                pronunciation: "푸레미아무 마구캇푸 츠키데 오네가이시마스",
                category: "order",
                image: "/images/vocab/butterbeer.svg",
              },
              {
                id: "v3-3-10",
                korean: "미니언즈 팝콘통 하나 주세요 🍿",
                japanese: "ミニオンのポップコーンバケツを1つください。",
                pronunciation: "미니온노 폿푸코-누 바케츠오 히토츠 쿠다사이",
                category: "order",
                image: "/images/vocab/takoyaki.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d3-9",
        time: "20:00 ~ 21:00",
        title: "파크 퇴장 & 시티워크 저녁 식사 🍕",
        category: "food",
        icon: "Utensils",
        location: "유니버설 시티워크",
        coordinates: { lat: 34.668, lng: 135.4375 },
        description: "종일 신나게 즐긴 후 시티워크에서 맛있는 피자/파스타 또는 라멘으로 든든한 저녁 식사",
        recommendations: ["식사 후 시티워크 기념품 숍에서 추가 굿즈 구경"],
        precautions: ["내일 체크아웃(08:30) 및 난바 이동을 위해 짐 정리"]
      },
      {
        id: "d3-10",
        time: "21:00",
        title: "호텔 복귀 & 스카이스파 온천 휴식 🛌",
        category: "hotel",
        icon: "Home",
        location: "더 싱귤러리 호텔",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔 마지막 밤, 대욕장에서 피로를 싹 풀고 숙면",
        recommendations: ["스카이스파 노천탕에서 USJ 야경 내려다보기"],
        precautions: ["내일 08:30 체크아웃 준비 완료"]
      }
    ],
    checklist: [
      { id: "c3-1", text: "USJ 입장권 QR 바코드 3명분 확인", isImportant: true },
      { id: "c3-2", text: "익스프레스 패스 시간표 (10:00 미니언 / 12:20 닌텐도&마리오 / 12:50 동키콩)", isImportant: true },
      { id: "c3-3", text: "보조배터리 2개 완충 지참", isImportant: true },
      { id: "c3-4", text: "편한 운동화 & 모자" }
    ],
    generalTips: [
      "익스프레스 패스에 지정된 시간(10:00, 12:20, 12:50)에 맞춰 5분 전 해당 어트랙션 게이트에 도착하면 줄 서지 않고 바로 탑승합니다.",
      "닌텐도 월드 안에는 동키콩 신규 구역과 키노피오 카페가 함께 있어 12:20~14:30 동안 집중적으로 즐기시면 완벽합니다!"
    ]
  },

  // ==========================================
  // DAY 4 (10/7 수): 몬스터헌터 카페 & 오사카성 & 도톤보리
  // ==========================================
  {
    dayNumber: 4,
    dateStr: "10/7",
    dayOfWeek: "수",
    title: "몬스터헌터 카페 & 오사카성 & 도톤보리",
    tagline: "난바 새 숙소 체크인 & 몬헌 카페 & 오사카성 & 리버크루즈! 🏯",
    hotelInfo: "사쿠라가와 호텔 난바 (10/7~10/9)",
    themeColor: "#8B5CF6",
    gradient: "from-purple-500 to-pink-500",
    badge: {
      text: "몬헌 카페 12:00 & 크루즈 20:00",
      type: "highlight"
    },
    summaryItems: [
      "08:30 더 싱귤러리 체크아웃 (짐 보관)",
      "09:00 USJ ➔ 난바 이동 (30분)",
      "12:00 몬스터헌터 카페(웨스트) 런치",
      "13:30 [남편+아들] 오사카성 천수각 (2시간)",
      "13:30 [지인님] 신사이바시 쇼핑 자유시간",
      "15:00 난바 숙소 체크인 (사쿠라가와 호텔)",
      "16:30 가족 합류 (쇼핑, 휴식)",
      "17:00 저녁 식사 (신사이바시/도톤보리)",
      "20:00 도톤보리 리버크루즈 (예약 완료)",
      "21:00 숙소 복귀 & 휴식"
    ],
    dayRouteQuery: "The+Singulari+Hotel+to+Hotel+Sakura+River+Namba+to+Osaka+Castle+to+Dotonbori",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Dotonbori+Osaka&t=&z=14&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d4-1",
        time: "08:30 ~ 09:00",
        title: "호텔 체크아웃 (짐 보관 후 출발) 🧳",
        category: "hotel",
        icon: "LogOut",
        location: "더 싱귤러리 호텔 로비",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        description: "더 싱귤러리 호텔 체크아웃 완료 후 짐을 챙겨 난바로 이동 출발",
        recommendations: ["객실에 두고 가는 소지품(충전기 등) 없는지 최종 확인"],
        precautions: ["08:30 정시 체크아웃"]
      },
      {
        id: "d4-2",
        time: "09:00 ~ 09:30",
        title: "USJ → 난바 이동 🚃 (약 30분 소요)",
        category: "transport",
        icon: "Train",
        location: "JR 유니버설시티역 ➔ 한신 오사카난바역 / 사쿠라가와역",
        coordinates: { lat: 34.6663, lng: 135.5015 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Namba+Station+Osaka",
        description: "JR 유메사키선(니시쿠조 환승) ➔ 한신 난바선 탑승하여 사쿠라가와역/난바역으로 이동",
        recommendations: [
          "사쿠라가와역에 하차하면 사쿠라가와 호텔 난바까지 도보 3분 직결!",
          "체크인 전 호텔 프런트에 캐리어 사전 보관"
        ],
        precautions: ["출근 시간대 이후 09:00 이동으로 쾌적"],
        routes: [
          {
            id: "r4-2-1",
            label: "🚃 JR + 한신선 환승 동선 (사쿠라가와역 직결)",
            badge: "약 25분",
            originTitle: "JR 유니버설시티역",
            originLocation: "Universal City Station Osaka",
            destinationTitle: "사쿠라가와역 / 사쿠라가와 호텔 난바",
            destinationLocation: "Sakuragawa Station Osaka",
            originQuery: "Universal City Station Osaka",
            destinationQuery: "Sakuragawa Station Osaka",
            transportMode: "transit",
            description: "JR 유니버설시티역 ➔ 니시쿠조역 환승 ➔ 한신 난바선 사쿠라가와역 하차 (호텔 바로 앞)",
            isPrimary: true,
          },
        ]
      },
      {
        id: "d4-3",
        time: "12:00 ~ 13:30",
        title: "몬스터헌터 카페 (웨스트) 런치 🎮 🍖 (예약 확정)",
        category: "food",
        icon: "Swords",
        location: "CAPCOM / 몬스터헌터 테마 카페",
        coordinates: { lat: 34.6732, lng: 135.5008 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=CAPCOM+STORE+OSAKA",
        description: "사전 예약 완료된 12:00 몬스터헌터 카페에서 테마 런치 식사 & 한정 굿즈 체험!",
        recommendations: [
          "몬헌 시그니처 대형 고기 구이(잘 익은 고기!) & 테마 음료 주문",
          "아이루/가루크 캐릭터 포토존에서 가족사진 촬영"
        ],
        precautions: ["12:00 예약 시간 10분 전 매장 도착 필수"],
        vocabCategories: [
          {
            categoryName: "🎮 몬스터헌터 카페 예약 & 주문",
            items: [
              {
                id: "v4-mh-1",
                korean: "12시 예약자 확인 부탁드립니다.",
                japanese: "12時予約の確認をお願いします。",
                pronunciation: "쥬-니지 요야쿠노 카쿠닌오 오네가이시마스",
                category: "service",
                image: "/images/vocab/capcom.svg",
              },
              {
                id: "v4-mh-2",
                korean: "몬스터헌터 한정 굿즈는 어디에 있나요?",
                japanese: "モンスターハンターの限定グッズはどこですか？",
                pronunciation: "몬스타- 한타-노 겐테- 굿즈와 도코데스카?",
                category: "shopping",
                image: "/images/vocab/capcom.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d4-4",
        time: "13:30 ~ 15:30",
        title: "⚔️ [일정 분리] 남편+아들 오사카성 천수각 / 지인님 신사이바시 쇼핑",
        category: "sightseeing",
        icon: "Castle",
        location: "오사카성 천수각 & 신사이바시 거리",
        coordinates: { lat: 34.6873, lng: 135.5262 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Osaka+Castle",
        description: "각자의 취향에 맞춘 자유로운 2시간 분리 일정! (15:30 사쿠라가와 호텔 집결)",
        recommendations: [
          "남편+아들 팀: 오사카성 천수각 최상층 전망대 관람 & 말차 아이스크림",
          "지인님 팀: 다이마루 백화점 & 신사이바시 아케이드 쾌적한 쇼핑"
        ],
        precautions: ["15:00~15:30 사이 사쿠라가와 호텔에서 만나 체크인"],
        vocabCategories: [
          {
            categoryName: "🎟️ 오사카성 티켓 & 매표",
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
        id: "d4-5",
        time: "15:00 ~ 16:30",
        title: "난바 숙소 체크인 (사쿠라가와 호텔) & 휴식 🏨",
        category: "hotel",
        icon: "Hotel",
        location: "사쿠라가와 호텔 난바 (Hotel Sakura River Namba)",
        coordinates: { lat: 34.666, lng: 135.492 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Sakuragawa+Station+Osaka",
        description: "새 숙소 체크인 완료, 보관했던 캐리어 수령 및 방에서 잠시 재충전",
        recommendations: ["호텔 주변 편의시설 및 도톤보리 도보 동선 확인"],
        precautions: ["체크인 시 여권 제시 및 객실 키 수령"]
      },
      {
        id: "d4-6",
        time: "16:30 ~ 17:00",
        title: "가족 전원 합류 & 도톤보리 이동 🚶",
        category: "sightseeing",
        icon: "Users",
        location: "난바 / 신사이바시",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        description: "가족 모두 모여 활기찬 도톤보리 거리로 이동",
        recommendations: ["글리코상 앞에서 가족 단체 사진 촬영"],
        precautions: ["도톤보리 인파 유의하여 손잡고 이동"]
      },
      {
        id: "d4-7",
        time: "17:00 ~ 19:30",
        title: "도톤보리 저녁 식사 🍢 (쿠시카츠 / 라멘 / 오코노미야키)",
        category: "food",
        icon: "Utensils",
        location: "도톤보리 먹자골목",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dotonbori+Glico+Sign",
        description: "화려한 네온사인 아래 쿠시카츠 다루마 또는 이치란 라멘 등 맛있는 오사카 만찬",
        recommendations: [
          "쿠시카츠 다루마: 바삭한 꼬치튀김 모둠 세트 & 시원한 생맥주",
          "소스는 처음 1번만 듬뿍 찍기!"
        ],
        precautions: ["20:00 리버크루즈 탑승 15분 전 선착장 도착 필수"],
        vocabCategories: [
          {
            categoryName: "🍢 쿠시카츠 & 도톤보리 맛집 주문",
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
        time: "20:00 ~ 20:30",
        title: "도톤보리 리버크루즈 탑승 🛥️ (예약 완료!)",
        category: "sightseeing",
        icon: "Ship",
        location: "도톤보리 돈키호테 앞 선착장",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tombori+River+Cruise",
        description: "예약 완료된 20:00 편 탑승! 도톤보리 강물 위에서 네온사인과 글리코상을 둘러보는 환상 야경 크루즈",
        recommendations: [
          "배가 글리코상 앞에 멈출 때 양팔을 벌리고 가족 단체 포즈 인증샷!"
        ],
        precautions: ["19:45까지 선착장 승선 라인 대기"],
        vocabCategories: [
          {
            categoryName: "🛥️ 도톤보리 크루즈 & 글리코상 포토",
            items: [
              {
                id: "v4-8-1",
                korean: "20시 예약 크루즈 탑승권입니다.",
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
        time: "21:00",
        title: "숙소 복귀 & 휴식 🌙",
        category: "hotel",
        icon: "Home",
        location: "사쿠라가와 호텔 난바",
        coordinates: { lat: 34.666, lng: 135.492 },
        description: "도톤보리에서 숙소로 복귀하여 편안한 휴식 및 내일 우메다 쇼핑 데이 준비",
        recommendations: ["호텔 주변 한적한 거리 산책"],
        precautions: ["내일 우메다 백화점 쇼핑을 위해 체력 안배"]
      }
    ],
    checklist: [
      { id: "c4-1", text: "더 싱귤러리 체크아웃 & 난바 숙소 이동", isImportant: true },
      { id: "c4-2", text: "몬스터헌터 카페 12:00 예약 확인서", isImportant: true },
      { id: "c4-3", text: "도톤보리 리버크루즈 20:00 예약 티켓", isImportant: true },
      { id: "c4-4", text: "사쿠라가와 호텔 난바 체크인 바우처", isImportant: true }
    ],
    generalTips: [
      "낮 13:30에는 오사카성을 보고 싶은 아빠+아들과 쇼핑을 즐기고 싶은 지인님의 자유 일정을 나눈 뒤 15:30 새 숙소에서 만나면 모두가 만족하는 일정이 됩니다!",
      "저녁 20:00 도톤보리 리버크루즈는 예약이 확정되어 있으므로 19:45까지 여유 있게 선착장에 도착하세요."
    ]
  },

  // ==========================================
  // DAY 5 (10/8 목): 우메다 쇼핑 데이!
  // ==========================================
  {
    dayNumber: 5,
    dateStr: "10/8",
    dayOfWeek: "목",
    title: "우메다 쇼핑 데이",
    tagline: "포켓몬센터 & 캡콤스토어 & 루쿠아 & 한큐백화점 완전 정복! 🛍️",
    hotelInfo: "사쿠라가와 호텔 난바 (10/7~10/9)",
    themeColor: "#F97316",
    gradient: "from-orange-500 to-amber-600",
    badge: {
      text: "포켓몬 & 캡콤 & 백화점 쇼핑",
      type: "highlight"
    },
    summaryItems: [
      "09:00 호텔 조식 후 출발",
      "10:00 우메다 이동 (지하철 15분)",
      "10:30 포켓몬센터 오사카 (다이마루 13F)",
      "11:30 CAPCOM STORE & CAFE UMEDA",
      "12:30 점심 식사 (우메다 맛집)",
      "13:30 우메다 쇼핑 타임 (LUCUA, 그랜드프론트, 한큐)",
      "16:30 카페 타임 & 휴식",
      "17:00 저녁 식사 (우메다 맛집)",
      "19:00 이후 난바 복귀 (자유시간) & 호텔 휴식"
    ],
    dayRouteQuery: "Hotel+Sakura+River+Namba+to+Daimaru+Umeda+to+LUCUA+Osaka+to+Hankyu+Umeda",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Daimaru+Umeda+Osaka&t=&z=15&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d5-1",
        time: "09:00",
        title: "호텔 조식 후 출발 ☀️",
        category: "hotel",
        icon: "Sun",
        location: "사쿠라가와 호텔 난바",
        coordinates: { lat: 34.666, lng: 135.492 },
        description: "상쾌하게 기상 후 든든하게 아침 식사를 마치고 우메다로 출발",
        recommendations: ["여권(면세 쇼핑 필수) 및 에코백 챙기기"],
        precautions: ["신용카드 및 엔화 현금 확인"]
      },
      {
        id: "d5-2",
        time: "10:00",
        title: "난바 → 우메다 이동 🚃 (지하철 약 15분)",
        category: "transport",
        icon: "Subway",
        location: "오사카 메트로 미도스지선 난바역 ➔ 우메다역",
        coordinates: { lat: 34.7025, lng: 135.496 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Umeda+Station+Osaka",
        description: "빨간색 미도스지선 지하철로 환승 없이 4정거장(약 10분) 이동",
        recommendations: ["ICOCA 교통카드 터치"],
        precautions: ["우메다역 하차 후 '다이마루 백화점 / JR 오사카역' 방향 출구 확인"]
      },
      {
        id: "d5-3",
        time: "10:30 ~ 11:30",
        title: "포켓몬센터 오사카 ⚡ (다이마루 백화점 우메다점 13층)",
        category: "shopping",
        icon: "Gamepad2",
        location: "DAIMARU Umeda 13층 포켓몬센터",
        coordinates: { lat: 34.7018, lng: 135.4975 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pokemon+Center+Osaka+Daimaru+Umeda",
        description: "서일본 최대 규모 포켓몬센터! 대형 전설의 포켓몬 조형물과 오사카 한정판 굿즈 쇼핑",
        recommendations: [
          "오사카 한정 피카츄 인형 및 카드 게임, 학용품 굿즈 구매",
          "가챠(캡슐 토이) 머신 뽑기 체험"
        ],
        precautions: ["다이마루 백화점 13층에 캡콤 스토어와 함께 위치해 이동 편리"],
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
              {
                id: "v5-pk-2",
                korean: "선물용 쇼핑백 하나 더 주실 수 있나요?",
                japanese: "お土産用の小分け袋をもう1枚もらえますか？",
                pronunciation: "오미야게요-노 코와케부쿠로오 모- 이치마이 모라에마스카?",
                category: "service",
                image: "/images/vocab/pokemon.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d5-4",
        time: "11:30 ~ 12:30",
        title: "CAPCOM STORE & CAFE UMEDA 🎮 (다이마루 13층)",
        category: "shopping",
        icon: "Swords",
        location: "DAIMARU Umeda 13층 CAPCOM STORE",
        coordinates: { lat: 34.7018, lng: 135.4975 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=CAPCOM+STORE+UMEDA",
        description: "포켓몬센터 바로 옆! 몬스터헌터, 바이오하자드, 스트리트파이터 공식 캡콤 직영 스토어",
        recommendations: [
          "몬스터헌터 대형 피규어 및 아이루/가루크 봉제인형 구경",
          "캡콤 한정 굿즈 및 티셔츠 쇼핑"
        ],
        precautions: ["인기 한정판 굿즈 품절 여부 체크"],
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
        id: "d5-5",
        time: "12:30 ~ 13:30",
        title: "점심 식사 🍜 (우메다 주변 맛집)",
        category: "food",
        icon: "Utensils",
        location: "다이마루 16층 식당가 또는 LUCUA 지하 다이닝",
        coordinates: { lat: 34.7025, lng: 135.496 },
        description: "우메다 백화점 식당가에서 맛있는 돈카츠, 텐동 또는 스시 런치",
        recommendations: [
          "루쿠아 지하 바르치카(Barchica): 유명 라멘/함바그 맛집",
          "다이마루 16층 우마이모노 플라자: 깔끔한 일식 정식"
        ],
        precautions: ["13:30부터 본격적인 쇼핑 타임 진행"]
      },
      {
        id: "d5-6",
        time: "13:30 ~ 16:30",
        title: "우메다 쇼핑 타임 🛍️ (LUCUA / 그랜드 프론트 / 한큐백화점)",
        category: "shopping",
        icon: "ShoppingBag",
        location: "LUCUA osaka & GRAND FRONT OSAKA & 한큐백화점 본점",
        coordinates: { lat: 34.7035, lng: 135.498 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=LUCUA+osaka",
        description: "오사카 최대 쇼핑 메카 우메다의 핵심 백화점과 쇼핑몰 집중 쇼핑",
        recommendations: [
          "한큐백화점 본점: 지하 디저트 매장(바토ンド르 고급 포키, 슈가버터샌드) & 1층 명품 손수건",
          "LUCUA & LUCUA 1100: 트렌디한 패션, 잡화, 캐릭터 숍",
          "그랜드 프론트 오사카: 넓고 쾌적한 라이프스타일 숍 및 키즈 매장"
        ],
        precautions: [
          "★ 5,000엔 이상 구매 시 백화점 면세(Tax Free) 카운터에서 당일 환급 필수! (여권 제시)"
        ],
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
              {
                id: "v5-7-2",
                korean: "선물용으로 포장해 주세요 🎁",
                japanese: "プレゼント用にラッピングをお願いします。",
                pronunciation: "푸레젠토요-니 랍핀구오 오네가이시마스",
                category: "service",
                image: "/images/vocab/taxfree.svg",
              },
            ]
          }
        ]
      },
      {
        id: "d5-7",
        time: "16:30 ~ 17:00",
        title: "카페 타임 & 휴식 ☕ 🍰",
        category: "food",
        icon: "Coffee",
        location: "우메다 그랜드 프론트 / 루쿠아 카페",
        coordinates: { lat: 34.7035, lng: 135.498 },
        description: "쇼핑 후 달콤한 팬케이크, 파르페 또는 커피를 마시며 다리 휴식",
        recommendations: ["하브스(HARBS) 밀크 크레이프 케이크 또는 스타벅스 리저브"],
        precautions: ["저녁 식사 전 30분간 체력 충전"]
      },
      {
        id: "d5-8",
        time: "17:00 ~ 19:00",
        title: "저녁 식사 🥩 (우메다 맛집)",
        category: "food",
        icon: "Utensils",
        location: "우메다 스카이빌딩 인근 또는 한큐 32번가",
        coordinates: { lat: 34.7025, lng: 135.496 },
        description: "오사카 마지막 밤을 기념하는 우메다 최고급 와규 야키니쿠 또는 스키야키 저녁 식사",
        recommendations: [
          "야키니쿠 만노 또는 규카츠 모토무라",
          "시원한 생맥주와 함께 가족 여행 완주 축하 건배!"
        ],
        precautions: ["19:00 이후 숙소 난바로 복귀"]
      },
      {
        id: "d5-9",
        time: "19:00 이후",
        title: "난바 복귀 (자유시간) ➔ 호텔 복귀 & 짐 패킹 🧳",
        category: "hotel",
        icon: "PackageCheck",
        location: "사쿠라가와 호텔 난바",
        coordinates: { lat: 34.666, lng: 135.492 },
        description: "지하철로 난바 복귀 후 숙소에서 쇼핑한 물품 캐리어 패킹 및 내일 귀국 준비",
        recommendations: [
          "액체류(화장품, 젤리류)는 반드시 위탁 수하물 캐리어에 넣기",
          "기내 수하물 무게 및 여권 재확인"
        ],
        precautions: ["내일 아침 07:30 기상 및 08:00 체크아웃 준비"]
      }
    ],
    checklist: [
      { id: "c5-1", text: "여권 지참 (백화점 면세 Tax Free 필수)", isImportant: true },
      { id: "c5-2", text: "다이마루 13층 (포켓몬센터 & 캡콤스토어)", isImportant: true },
      { id: "c5-3", text: "쇼핑백 및 접이식 보조가방 준비" },
      { id: "c5-4", text: "귀국 짐싸기: 액체류 위탁 수하물 패킹", isImportant: true }
    ],
    generalTips: [
      "다이마루 백화점 우메다점 13층에 포켓몬센터와 캡콤스토어가 나란히 붙어있어 아들과 함께 캐릭터 쇼핑하기에 최고의 동선입니다.",
      "한큐백화점과 루쿠아에서 쇼핑 후 여권을 제시하고 영수증을 모아 1층/지하 면세 카운터에서 세금을 즉시 환급받으세요."
    ]
  },

  // ==========================================
  // DAY 6 (10/9 금): 오사카 출발 ➔ 한국 귀국
  // ==========================================
  {
    dayNumber: 6,
    dateStr: "10/9",
    dayOfWeek: "금",
    title: "오사카 출발 ➔ 한국 귀국",
    tagline: "즐거운 추억 가득 안고 안전하게 집으로! 다음에 또 만나요 ❤️",
    hotelInfo: "체크아웃 완료",
    themeColor: "#EC4899",
    gradient: "from-pink-500 to-rose-500",
    badge: {
      text: "OZ111 10:30 간사이 출발",
      type: "info"
    },
    summaryItems: [
      "07:30 기상 & 짐 정리 (체크아웃)",
      "08:00 호텔 체크아웃 & 출발",
      "08:20 난바역 이동",
      "08:40 난카이 공항급행/라피트 탑승 (40~45분)",
      "09:30 간사이공항 도착 (여유롭게 수속)",
      "10:30 간사이공항 출발 (OZ111)",
      "12:30 인천공항 도착 (귀국 완료 ❤️)"
    ],
    dayRouteQuery: "Hotel+Sakura+River+Namba+to+Nankai-Namba+Station+to+Kansai+Airport",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Kansai+International+Airport&t=&z=13&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d6-1",
        time: "07:30",
        title: "기상 & 짐 정리 (체크아웃 준비) ⏰",
        category: "hotel",
        icon: "AlarmClock",
        location: "사쿠라가와 호텔 난바",
        coordinates: { lat: 34.666, lng: 135.492 },
        description: "마지막 짐 점검 및 여권, 항공권 확인",
        recommendations: ["호텔 룸 키 반납 준비 및 빠진 소지품 없는지 확인"],
        precautions: ["08:00 정시 체크아웃"]
      },
      {
        id: "d6-2",
        time: "08:00 ~ 08:20",
        title: "호텔 체크아웃 🧳 ➔ 난바역 이동",
        category: "hotel",
        icon: "LogOut",
        location: "사쿠라가와 호텔 ➔ 난카이 난바역",
        coordinates: { lat: 34.6657, lng: 135.5023 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Nankai-Namba+Station",
        description: "체크아웃 완료 후 난카이 난바역 3층 승강장으로 이동 (도보 또는 지하철 1정거장)",
        recommendations: ["캐리어가 많을 경우 택시 이용 시 난카이 난바역까지 5분 (기본요금)"],
        precautions: ["08:40 공항급행 열차 탑승을 위해 08:30까지 개찰구 도착"]
      },
      {
        id: "d6-3",
        time: "08:40 ~ 09:25",
        title: "난카이 공항급행 / 라피트 탑승 🚅 (약 40~45분)",
        category: "transport",
        icon: "Train",
        location: "난카이 난바역 3층 승강장 ➔ 간사이공항역",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+Airport+Station",
        description: "난카이 공항선 급행 열차를 타고 간사이 국제공항으로 직행 이동",
        recommendations: ["창밖으로 오사카만 뷰를 보며 여행 추억 나누기"],
        precautions: ["공항선 전철 종점 '간사이공항역' 확인 하선"],
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
        id: "d6-4",
        time: "09:30",
        title: "간사이공항 도착 ✈️ (여유롭게 출국 수속 준비)",
        category: "transport",
        icon: "PlaneTakeoff",
        location: "간사이국제공항 제1터미널 4층 국제선 출발 로비",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport",
        description: "아시아나항공 카운터에서 위탁 수하물 부치고 탑승권 발권 및 보안검색 진행",
        recommendations: [
          "OZ111 체크인 카운터 위치 전광판 확인",
          "출국 심사 후 면세점에서 로이스 초콜릿, 도쿄 바나나 마지막 쇼핑"
        ],
        precautions: ["10:30 출발 항공편이므로 10:00 탑승 게이트 도착 필수"],
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
                korean: "남은 엔화 동전 다 쓰고, 나머지는 카드로 결제할게요!",
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
        id: "d6-5",
        time: "10:30 ~ 12:30",
        title: "간사이공항 출발 ✈️ ➔ 인천공항 도착 (OZ111)",
        category: "transport",
        icon: "Plane",
        location: "간사이공항 ➔ 인천국제공항",
        coordinates: { lat: 37.4602, lng: 126.4407 },
        description: "10:30 아시아나 OZ111편 탑승 후 12:30 인천국제공항 안전하게 도착 및 귀국 완료 ❤️",
        recommendations: [
          "즐거웠던 오사카 5박 6일 가족 여행 사진 정리",
          "다음에 또 만나요, 오사카! 🎉"
        ],
        precautions: ["인천공항 수하물 수령 후 세관 통과"]
      }
    ],
    checklist: [
      { id: "c6-1", text: "항공권 E-티켓 (OZ111 10:30 출발)", isImportant: true },
      { id: "c6-2", text: "호텔 체크아웃 08:00 완료", isImportant: true },
      { id: "c6-3", text: "08:40 난카이 공항급행 열차 탑승", isImportant: true },
      { id: "c6-4", text: "여권 3인분 및 소지품 최종 확인", isImportant: true }
    ],
    generalTips: [
      "마지막 날은 08:00에 체크아웃하고 난바역에서 08:40 공항급행을 타면 09:30에 간사이공항에 도착하여 OZ111(10:30)을 아주 여유롭게 수속할 수 있습니다.",
      "면세점에서 로이스 초콜릿을 살 때 보냉백을 추가하면 한국 집에 도착할 때까지 신선하게 보관됩니다."
    ]
  }
];
