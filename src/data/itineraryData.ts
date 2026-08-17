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

/**
 * 특정 일정 아이템의 동선 목록을 반환합니다.
 * 명시적 routes가 등록되어 있다면 해당 routes를 반환하고,
 * 별도 등록이 없으면 다음 목적지(nextItem)로 향하는 기본 동선을 자동 생성합니다.
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

  // 마지막 일정 등 다음 일정이 없는 경우 현재 장소 안내
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
    {
      categoryName: '💬 프런트 요청 표현',
      items: [
        {
          id: 'vh-4',
          korean: '수건 2장 더 부탁드립니다.',
          japanese: 'タオルをあと2枚お願いします。',
          pronunciation: '타오루오 아토 니마이 오네가이시마스',
          category: 'service',
        },
        {
          id: 'vh-5',
          korean: '와이파이 비밀번호가 어떻게 되나요?',
          japanese: 'Wi-Fiのパスワードは何ですか？',
          pronunciation: '와이파이노 파스와-도와 난데스카?',
          category: 'service',
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
          korean: '새 상품으로 있나요?',
          japanese: '新しい在庫はありますか？',
          pronunciation: '아타라시이 자이코와 아리마스카?',
          category: 'shopping',
        },
        {
          id: 'vs-3',
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
          korean: '성인 2장 부탁드립니다.',
          japanese: '大人2枚お願いします。',
          pronunciation: '오토나 니마이 오네가이시마스',
          category: 'ticket',
          image: '/images/vocab/ticket.svg',
        },
        {
          id: 'vt-2',
          korean: '이 열차 난바역 가나요?',
          japanese: 'この電車は難波駅に行きますか？',
          pronunciation: '코노 덴샤와 난바에키니 이키마스카?',
          category: 'transport',
        },
        {
          id: 'vt-3',
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
  {
    dayNumber: 1,
    dateStr: "10/4",
    dayOfWeek: "토",
    title: "오사카 입성 & 유니버설 시티 도착",
    tagline: "설레는 오사카 여행의 시작! ✨",
    themeColor: "#3B82F6",
    gradient: "from-blue-500 to-cyan-500",
    badge: {
      text: "오사카 입국 & 호텔 체크인",
      type: "info"
    },
    summaryItems: ["한국 출발", "간사이 공항 도착", "라피트/공항버스", "유니버설 시티 호텔", "시티워크 저녁"],
    dayRouteQuery: "Kansai+Airport+to+Universal-City+Station",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Universal+City+Station+Osaka&t=&z=13&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d1-1",
        time: "오전/오후",
        title: "한국 출발 ✈️ 간사이 국제공항 도착",
        category: "transport",
        icon: "Plane",
        location: "간사이 국제공항 Terminal 1",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport",
        description: "인천/김포/부산 공항에서 출국 후 간사이 국제공항 도착 및 입국 수속 진행",
        recommendations: [
          "Visit Japan Web(입국/세관 신고 QR) 사전 캡처본 준비로 빠르고 편리한 입국",
          "공항 인포메이션 센터에서 주유패스, 라피트 티켓 교환 위치 확인"
        ],
        precautions: [
          "입국 심사 및 수하물 수령에 최소 45분~1시간 소요되므로 여유 있게 이동",
          "포켓 와이파이 또는 eSIM 정상 작동 여부 공항에서 미리 체크"
        ]
      },
      {
        id: "d1-2",
        time: "15:00 ~ 16:30",
        title: "간사이 공항 → 유니버설 시티 이동 🚆",
        category: "transport",
        icon: "Train",
        location: "JR 유니버설시티역",
        coordinates: { lat: 34.6678, lng: 135.4386 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Universal+City+Station+Osaka",
        description: "공항 리무진 버스 (직행) 또는 난카이 라피트(난바) → JR 환승으로 유니버설시티 이동",
        recommendations: [
          "짐이 많은 경우 공항 리무진 버스(유니버설 스튜디오 직행) 탑승이 가장 편리",
          "JR 꿈의 사쿠라지마선 환승 시 마리오/알록달록 테마 열차 탑승 가능"
        ],
        precautions: [
          "주말 간사이 공항 열차 티켓 창구 줄이 길 수 있으므로 클룩/티켓큐 사전 구매권 준비"
        ],
        routes: [
          {
            id: "r1-2-1",
            label: "🚌 공항 리무진 버스 직행 동선",
            badge: "직행 70분",
            originTitle: "간사이 국제공항 제1터미널",
            originLocation: "Kansai International Airport Terminal 1",
            destinationTitle: "유니버설 스튜디오 버스정류장",
            destinationLocation: "Universal Studios Japan Bus Stop",
            originQuery: "Kansai International Airport Terminal 1",
            destinationQuery: "Universal Studios Japan Bus Stop",
            transportMode: "transit",
            description: "환승 없이 가장 편리하게 유니버설 시티로 직행하는 공항 리무진 버스 경로입니다.",
            isPrimary: true,
          },
          {
            id: "r1-2-2",
            label: "🚅 라피트 + JR 환승 동선",
            badge: "환승 55분",
            originTitle: "간사이공항역 (난카이 라피트)",
            originLocation: "Kansai Airport Station",
            destinationTitle: "JR 유니버설시티역",
            destinationLocation: "Universal City Station Osaka",
            originQuery: "Kansai Airport Station",
            destinationQuery: "Universal City Station Osaka",
            transportMode: "transit",
            description: "난카이 라피트 특급을 타고 신이마미야역에서 JR 오사카 순환선/사쿠라지마선으로 환승하는 경로입니다.",
          },
        ]
      },
      {
        id: "d1-3",
        time: "16:30 ~ 17:30",
        title: "유니버설 시티 숙소 체크인 🏨",
        category: "hotel",
        icon: "Hotel",
        location: "유니버설 시티 인근 호텔",
        coordinates: { lat: 34.6675, lng: 135.4372 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Hotel+Kintetsu+Universal+City",
        description: "호텔 체크인 및 짐 정리, 내일 USJ & 가이유칸 동선 확인",
        recommendations: [
          "체크인 시 내일 USJ 오픈 시간 및 캡틴라인 선착장 위치 문의하기"
        ],
        precautions: [
          "여권 필수 제시 및 오사카 숙박세(1인당 100~300엔) 현금 준비"
        ]
      },
      {
        id: "d1-4",
        time: "18:00 ~ 21:00",
        title: "유니버설 시티워크 탐방 & 저녁 식사 🍜",
        category: "food",
        icon: "Utensils",
        location: "Universal Citywalk Osaka",
        coordinates: { lat: 34.668, lng: 135.4375 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Universal+Citywalk+Osaka",
        description: "화려한 유니버설 시티워크 거리 산책, 유명 타코야키 파크 맛집 비교 시식 및 저녁",
        recommendations: [
          "TAKOPA (TAKoyaki Park): 오사카 5대 유명 타코야키(쿠쿠루, 주하치반 등) 비교 시식",
          "풍월 (Fugestu) 오코노미야키 또는 Popcorn Papa 화려한 팝콘 숍 방문"
        ],
        precautions: [
          "시티워크 매장들은 USJ 마감 시간 직후(20:00 이후) 붐비므로 조금 일찍 저녁 식사 권장"
        ]
      }
    ],
    checklist: [
      { id: "c1-1", text: "여권 및 e-티켓 / 캡처본 확인", isImportant: true },
      { id: "c1-2", text: "Visit Japan Web QR 코드 사전 준비", isImportant: true },
      { id: "c1-3", text: "포켓 와이파이 / eSIM 세팅 확인" },
      { id: "c1-4", text: "엔화 현금 (숙박세, 교통카드 충전용) 지참" }
    ],
    generalTips: [
      "첫날은 무리하게 움직이기보다 시티워크 구경 후 일찍 취침하여 다음 날 가이유칸 & USJ 대비!",
      "유니버설 시티 편의점(세븐일레븐, 로손)에서 간식 및 음료 미리 사두기"
    ]
  },
  {
    dayNumber: 2,
    dateStr: "10/5",
    dayOfWeek: "월",
    title: "가이유칸 & 캡틴라인 & 곤충숍",
    tagline: "주유패스 NO! 캡틴라인은 별도 구매 ⭐",
    themeColor: "#0D9488",
    gradient: "from-teal-500 to-emerald-600",
    badge: {
      text: "캡틴라인 별도 구매 필수!",
      type: "warning"
    },
    summaryItems: ["캡틴라인 배 탑승", "가이유칸 수족관", "덴포잔 마켓", "곤충숍 KMY", "호텔 휴식", "시티워크 저녁"],
    dayRouteQuery: "Universal+Cityport+to+Kaiyukan+to+Tempozan+Marketplace",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Kaiyukan+Osaka&t=&z=15&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d2-1",
        time: "09:00",
        title: "기상 & 조식 🍳",
        category: "hotel",
        icon: "Coffee",
        location: "호텔 조식당 (유니버설 시티)",
        coordinates: { lat: 34.6675, lng: 135.4372 },
        description: "여유롭게 기상하여 든든한 조식 식사 및 외출 준비",
        recommendations: ["수족관 이동 전 카메라 & 폰 배터리 완충 확인"],
        precautions: ["배 탑승 시각(09:40) 10분 전까지 선착장 도착 준비"],
        routes: [
          {
            id: "r2-1-1",
            label: "🚢 캡틴라인 선착장 이동 동선 (추천)",
            badge: "도보 5분",
            originTitle: "유니버설 시티 호텔",
            originLocation: "Hotel Kintetsu Universal City",
            destinationTitle: "유니버설 시티포트 선착장 (캡틴라인 탑승)",
            destinationLocation: "Universal City Port Osaka",
            destinationJapanese: "キャプテンライン ユニバーサルシティポート (大阪市此花区桜島1-1)",
            originQuery: "Hotel Kintetsu Universal City Osaka",
            destinationQuery: "Captain Line Universal City Port Osaka",
            transportMode: "walking",
            description: "호텔에서 유니버설 시티포트 선착장까지 도보로 약 5분 이동하는 동선입니다.",
            offlineSteps: [
              "1단계: 호텔 로비 정문으로 나와 유니버설 시티워크 방면으로 직진 (약 1분)",
              "2단계: USJ 입구 방면 계단/에스컬레이터 옆 'Captain Line / 선착장' 안내 표지판 확인",
              "3단계: 강변(아지강) 테라스 산책로를 따라 우측으로 도보 3분 이동",
              "4단계: '유니버설 시티포트(Captain Line)' 매표소 부스 도착 후 승선권 구매 (09:40 출항 10분 전 대기)"
            ],
            isPrimary: true,
          },
          {
            id: "r2-1-2",
            label: "🚇 가이유칸 전철 대체 동선",
            badge: "전철 35분",
            originTitle: "JR 유니버설시티역",
            originLocation: "Universal City Station Osaka",
            destinationTitle: "오사카코역 / 가이유칸 수족관",
            destinationLocation: "Osaka Aquarium Kaiyukan",
            destinationJapanese: "海遊館 / 大阪港駅 (大阪市港区海岸通1-1-10)",
            originQuery: "Universal City Station Osaka",
            destinationQuery: "Osaka Aquarium Kaiyukan",
            transportMode: "transit",
            description: "기상 악화나 결항 시 JR 사쿠라지마선 → 니시쿠조 → 벤텐초 → 오사카메트로 주오선(오사카코역)으로 이동하는 전철 우회 동선입니다.",
            offlineSteps: [
              "1단계: 호텔에서 도보 2분 거리의 JR 유니버설시티역 승강장 이동",
              "2단계: JR 유메사키선(사쿠라지마선) 탑승 ➔ 2정거장 뒤 '니시쿠조역' 하차 (5분 소요)",
              "3단계: JR 오사카 순환선으로 환승 ➔ 1정거장 뒤 '벤텐초역' 하차 (3분 소요)",
              "4단계: 오사카 메트로 주오선(녹색 라인) 환승 ➔ '오사카코역' 하차 (5분 소요)",
              "5단계: 오사카코역 1번 또는 2번 출구로 나와 가이유칸 방면 직진 도보 5분 도착"
            ],
          },
        ]
      },
      {
        id: "d2-2",
        time: "09:30 ~ 10:00",
        title: "캡틴라인 탑승 🚢 (유니버설시티포트 → 덴포잔)",
        category: "transport",
        icon: "Ship",
        location: "유니버설 시티포트 선착장",
        coordinates: { lat: 34.6661, lng: 135.4367 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Captain+Line+Universal+City+Port",
        description: "유니버설시티에서 덴포잔(가이유칸)으로 바다를 건너가는 페리(약 10분 소요)",
        recommendations: [
          "야외 덱 좌석에서 오사카만 해안 풍경과 아지강 전경 촬영",
          "왕복 승선권을 함께 구매하면 할인 혜택 가능"
        ],
        precautions: [
          "★ 오사카 주유패스 적용 안 됨! 현장에서 별도 티켓 구매 필요 (성인 왕복 약 1,700엔)",
          "날씨/풍랑에 따라 출항 시각이 변동될 수 있으므로 운항 시간표 미리 확인"
        ],
        routes: [
          {
            id: "r2-2-1",
            label: "🐋 덴포잔 선착장 → 가이유칸 수족관 동선",
            badge: "도보 3분",
            originTitle: "덴포잔 캡틴라인 선착장",
            originLocation: "Captain Line Kaiyukan Port Osaka",
            destinationTitle: "가이유칸 (해유관 수족관)",
            destinationLocation: "Osaka Aquarium Kaiyukan",
            destinationJapanese: "海遊館 メインエントランス (大阪市港区海岸通1-1-10)",
            originQuery: "Captain Line Kaiyukan Port Osaka",
            destinationQuery: "Osaka Aquarium Kaiyukan",
            transportMode: "walking",
            description: "선착장 하선 후 가이유칸 정문 매표소까지 도보로 3분 이동하는 동선입니다.",
            offlineSteps: [
              "1단계: 캡틴라인 페리 하선 후 덴포잔 부두 광장으로 이동",
              "2단계: 바다를 등지고 우측의 거대한 가이유칸 수족관 건물(빨강/파랑 유리 외관) 방향 확인",
              "3단계: 광장 통로를 따라 도보 2분 직진 ➔ 가이유칸 메인 에스컬레이터 입구 도착"
            ],
            isPrimary: true,
          },
          {
            id: "r2-2-2",
            label: "🎡 덴포잔 마켓플레이스 & 대관람차 동선",
            badge: "도보 2분",
            originTitle: "덴포잔 캡틴라인 선착장",
            originLocation: "Captain Line Kaiyukan Port Osaka",
            destinationTitle: "덴포잔 마켓플레이스 & 관람차",
            destinationLocation: "Tempozan Marketplace Osaka",
            destinationJapanese: "天保山マーケットプレース / 大観覧車",
            originQuery: "Captain Line Kaiyukan Port Osaka",
            destinationQuery: "Tempozan Marketplace Osaka",
            transportMode: "walking",
            description: "선착장에서 바로 쇼핑몰 및 대관람차로 이동하는 동선입니다.",
            offlineSteps: [
              "1단계: 선착장 하선 후 좌측 정면에 보이는 쇼핑몰 덴포잔 마켓플레이스 입구로 진입 (도보 1분)",
              "2단계: 2층 푸드코트(나니와 쿠이신보 요코초) 또는 대관람차 탑승 게이트로 이동"
            ],
          },
        ],
        vocabCategories: [
          {
            categoryName: "🎟️ 캡틴라인 매표 & 승선 용어",
            items: [
              {
                id: "v2-2-1",
                korean: "대인 왕복 승선권 2장 주세요.",
                japanese: "大人 往復乗船券 2枚お願いします。",
                pronunciation: "오토나 오-후쿠 조-센켄 니마이 오네가이시마스",
                category: "ticket",
                image: "/images/vocab/ferry.svg",
                situationTip: "캡틴라인 매표소 창구에서 화면을 보여주며 구매하세요. (왕복 할인 적용)",
              },
              {
                id: "v2-2-2",
                korean: "다음 배는 몇 시에 출발하나요?",
                japanese: "次の便は何時に出発しますか？",
                pronunciation: "츠기노 벤와 난지니 슛파츠 시마스카?",
                category: "transport",
                situationTip: "출항 시간을 확인할 때 직원에게 물어보세요.",
              },
              {
                id: "v2-2-3",
                korean: "덴포잔(가이유칸)행 배가 맞나요?",
                japanese: "天保山（海遊館）行きで合っていますか？",
                pronunciation: "텐포-잔(카이유-칸) 유키데 앗테이마스카?",
                category: "transport",
                situationTip: "배에 탑승하기 전 승무원에게 확인하세요.",
              },
            ]
          },
        ]
      },
      {
        id: "d2-3",
        time: "10:00 ~ 12:30",
        title: "가이유칸 (해유관 수족관) 관람 🐋",
        category: "sightseeing",
        icon: "Fish",
        location: "가이유칸 (Osaka Aquarium Kaiyukan)",
        coordinates: { lat: 34.6545, lng: 135.429 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Osaka+Aquarium+Kaiyukan",
        description: "세계 최대 규모 태평양 수조의 고래상어와 다양한 해양 생물 관람",
        recommendations: [
          "거대 고래상어가 헤엄치는 메인 수조 앞에서 인생샷 촬영",
          "가이유칸 한정 시그니처 '미즈타마리 소다 소프트 아이스크림' 먹기"
        ],
        precautions: [
          "월요일이라도 관광객이 많아 입장이 지연될 수 있으니 모바일 웹 타임슬롯 사전예약 필수!",
          "내부 플래시 촬영 금지 구역 준수"
        ],
        vocabCategories: [
          {
            categoryName: "🎟️ 가이유칸 입장 & 시설 용어",
            items: [
              {
                id: "v2-3-1",
                korean: "모바일 예약 QR 티켓입니다.",
                japanese: "ウェブ予約のQRチケットです。",
                pronunciation: "웨부 요야쿠노 큐-아-루 치켓토데스",
                category: "ticket",
                image: "/images/vocab/whale.svg",
                situationTip: "입구 게이트 검표 직원에게 스마트폰 화면을 보여주세요.",
              },
              {
                id: "v2-3-2",
                korean: "한국어 안내 리플릿 있나요?",
                japanese: "韓国語のパンフレットはありますか？",
                pronunciation: "칸코쿠고노 판후렛토와 아리마스카?",
                category: "service",
              },
              {
                id: "v2-3-3",
                korean: "고래상어 수조는 어디인가요?",
                japanese: "ジンベエザメの水槽はどこですか？",
                pronunciation: "진베-자메노 스이소-와 도코데스카?",
                category: "general",
                image: "/images/vocab/whale.svg",
              },
            ]
          },
          {
            categoryName: "🍦 가이유칸 시그니처 디저트 & 굿즈",
            items: [
              {
                id: "v2-3-4",
                korean: "미즈타마리(물웅덩이) 소다 소프트 아이스크림 하나 주세요.",
                japanese: "ミズタマリソフト（ソーダ味）を1つお願いします。",
                pronunciation: "미즈타마리 소후토(소-다 아지)오 히토츠 오네가이시마스",
                category: "order",
                image: "/images/vocab/icecream.svg",
                situationTip: "수족관 4층 카페에서 가이유칸 시그니처 아이스크림 주문 시 사용하세요.",
              },
              {
                id: "v2-3-5",
                korean: "고래상어 봉제인형 선물용 포장 부탁드립니다.",
                japanese: "ジンベエザメのぬいぐるみをプレゼント包装でお願いします。",
                pronunciation: "진베-자메노 누이구루미오 푸레젠토 호-소-데 오네가이시마스",
                category: "shopping",
              },
            ]
          }
        ]
      },
      {
        id: "d2-4",
        time: "12:30 ~ 13:30",
        title: "점심 식사 🍴 (덴포잔 마켓플레이스)",
        category: "food",
        icon: "Utensils",
        location: "Tempozan Marketplace",
        coordinates: { lat: 34.6558, lng: 135.4308 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tempozan+Marketplace",
        description: "수족관 바로 옆 쇼핑몰 덴포잔 마켓플레이스 내 나니와 쿠이신보 요코초 미식 탐방",
        recommendations: [
          "레트로 골목 콘셉트의 '나니와 쿠이신보 요코초'에서 오코노미야키 & 꼬치튀김 식사",
          "세계 최대급 덴포잔 대관람차(시스루 곤돌라) 도전"
        ],
        precautions: ["점심 피크 타임에는 유명 식당 대기가 있을 수 있음"]
      },
      {
        id: "d2-5",
        time: "13:30 ~ 15:00",
        title: "INSECTSHOP KMY OSAKA 방문 🐞",
        category: "shopping",
        icon: "Bug",
        location: "INSECTSHOP KMY OSAKA",
        coordinates: { lat: 34.6565, lng: 135.433 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=INSECTSHOP+KMY+OSAKA",
        description: "덴포잔 인근의 유명 곤충 전문샵 KMY 방문 (희귀 장수풍뎅이, 사슴벌레, 표본, 표본용품 등)",
        recommendations: [
          "아이들과 함께 장수풍뎅이/사슴벌레 실물 관람 및 굿즈 구경",
          "점원에게 생체 수입/소장 관련 안내 문의 가능"
        ],
        precautions: [
          "국내 입국 시 살아있는 곤충 생체 반입은 검역법상 금지되어 있으므로 표본/피규어/용품 위주 구경!"
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
                situationTip: "직원에게 표본 진열 위치를 물어볼 때 사용하세요.",
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
                korean: "한국으로 가져갈 건데, 튼튼하게 포장해 주실 수 있나요?",
                japanese: "韓国に持って帰るので、厳重に包装してもらえますか？",
                pronunciation: "칸코쿠니 못테 카에루노데, 겐쥬-니 호-소- 시테 모라에마스카?",
                category: "service",
                situationTip: "표본 상자 파손을 방지하기 위해 에어캡 포장을 요청하세요.",
              },
            ]
          }
        ]
      },
      {
        id: "d2-6",
        time: "15:00 ~ 15:30",
        title: "캡틴라인 탑승 🚢 (덴포잔 → 유니버설시티)",
        category: "transport",
        icon: "Ship",
        location: "덴포잔 선착장",
        coordinates: { lat: 34.6548, lng: 135.4285 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Captain+Line+Tempozan+Port",
        description: "캡틴라인 복귀 편 탑승하여 유니버설 시티로 돌아오기",
        recommendations: ["오후 바닷바람을 맞으며 정박된 대형 선박 구경"],
        precautions: ["돌아오는 배 시각표(15:00 / 15:30) 엄수"]
      },
      {
        id: "d2-7",
        time: "15:30 ~ 17:30",
        title: "호텔 휴식 🛌",
        category: "hotel",
        icon: "Bed",
        location: "유니버설 시티 호텔",
        coordinates: { lat: 34.6675, lng: 135.4372 },
        description: "체력 충전 및 내일 USJ 올데이 일정을 위한 쉬어가기",
        recommendations: ["USJ 공식 앱 다운로드 및 회원가입, 내일 동선 최종 확인"],
        precautions: ["체력 안배를 위해 과도한 오후 이동 지양"]
      },
      {
        id: "d2-8",
        time: "18:00 ~ 20:00",
        title: "유니버설 시티워크 저녁 식사 🍕",
        category: "food",
        icon: "Utensils",
        location: "Universal Citywalk Osaka",
        coordinates: { lat: 34.668, lng: 135.4375 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Universal+Citywalk+Osaka",
        description: "시티워크 맛집에서 맛있게 저녁 식사 및 21:30 취침 준비",
        recommendations: ["모스버거, 하드락카페, 라멘가게 등 취향대로 저녁 선택"],
        precautions: ["내일 USJ 07:00 기상을 위해 21:30 취침 준수!"]
      }
    ],
    checklist: [
      { id: "c2-1", text: "캡틴라인 별도 티켓 현장 구매/확인", isImportant: true },
      { id: "c2-2", text: "가이유칸 타임슬롯 모바일 입장권 준비", isImportant: true },
      { id: "c2-3", text: "INSECTSHOP KMY 영업시간 체크" },
      { id: "c2-4", text: "USJ 공식 앱 스마트폰 설치 완료" }
    ],
    generalTips: [
      "★ 캡틴라인은 주유패스가 적용되지 않는 별도 노선이므로 현금 또는 신용카드로 매표하세요.",
      "가이유칸 내부 곤충 표본 및 덴포잔 마켓의 아기자기한 굿즈 샵을 둘러보는 꿀잼 동선입니다."
    ]
  },
  {
    dayNumber: 3,
    dateStr: "10/6",
    dayOfWeek: "화",
    title: "USJ 종일! (Universal Studios Japan)",
    tagline: "오늘은 신나게 놀자! ⭐",
    themeColor: "#EAB308",
    gradient: "from-amber-500 to-yellow-400",
    badge: {
      text: "USJ 종일 즐기기",
      type: "highlight"
    },
    summaryItems: ["07:00 기상", "USJ 오픈런", "슈퍼 닌텐도 월드", "해리포터", "미니언즈", "호텔 복귀"],
    dayRouteQuery: "Universal+Studios+Japan",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Universal+Studios+Japan&t=&z=16&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d3-1",
        time: "07:00",
        title: "기상 & 조식 ⏰",
        category: "hotel",
        icon: "AlarmClock",
        location: "호텔",
        coordinates: { lat: 34.6675, lng: 135.4372 },
        description: "일찍 기상하여 든든한 조식 식사 및 소지품 점검",
        recommendations: ["보조배터리 2개 이상 지참, 편한 운동화 착용"],
        precautions: ["외부 음식 반입 제한이 있으므로 미개봉 음료 1병 정도만 지참"]
      },
      {
        id: "d3-2",
        time: "08:00 전후",
        title: "호텔 출발 → USJ 게이트 입장 🎟️",
        category: "transport",
        icon: "Ticket",
        location: "USJ 메인 게이트",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Universal+Studios+Japan+Main+Gate",
        description: "유니버설 스튜디오 재팬 오픈런 대기 및 게이트 보안검색 후입장",
        recommendations: [
          "공식 개장 시각보다 보통 30분~1시간 일찍 조기 개장하므로 08:00 전후 도착 필수!",
          "QR코드 모바일 캡처본 화면 밝기 최대 설정"
        ],
        precautions: ["소지품 검사 시 셀카봉, 맹독성/위험물 반입 불가"]
      },
      {
        id: "d3-3",
        time: "08:30 ~ 20:00+",
        title: "🎪 USJ 종일 200% 즐기기!",
        category: "theme_park",
        icon: "Sparkles",
        location: "Universal Studios Japan",
        coordinates: { lat: 34.6654, lng: 135.4323 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Super+Nintendo+World+USJ",
        description: "슈퍼 닌텐도 월드, 위저딩 월드 오브 해리포터, 미니언 메이헴, 헐리우드 드림 타기",
        recommendations: [
          "★ 입장 직후 USJ 앱으로 '슈퍼 닌텐도 월드 e정리권(타임슬롯)' 즉시 발급!",
          "마리오 카트: 쿠파의 도전장, 해리포터 포비든 저니 어트랙션 필수 탑승",
          "키노피오 카페: 버섯 브로콜리 수프 & 피자 점심 식사",
          "해리포터 존 버터맥주(무알콜) 시식 & 미니언즈 팝콘통 구매"
        ],
        precautions: [
          "인기 어트랙션 대기시간이 60~120분에 달할 수 있으므로 싱글라이더 라인 활용 추천",
          "오후 늦게 닌텐도 월드 재입장이 불가할 수 있으니 수령한 타임슬롯 엄수"
        ],
        vocabCategories: [
          {
            categoryName: "🎟️ USJ 입장 & 어트랙션 표현",
            items: [
              {
                id: "v3-3-1",
                korean: "슈퍼 닌텐도 월드 e정리권(타임슬롯) 보여주기",
                japanese: "スーパー・ニンテンドー・ワールド エリア入場整理券です。",
                pronunciation: "스-파- 닌텐도- 와-루도 에리아 뉴-조- 세-리켄데스",
                category: "ticket",
                image: "/images/vocab/nintendo.svg",
                situationTip: "닌텐도 월드 입구 토관 앞에서 직원에게 앱 QR코드를 보여주세요.",
              },
              {
                id: "v3-3-2",
                korean: "싱글라이더(Single Rider) 이용 가능한가요?",
                japanese: "シングルライダーで乗れますか？",
                pronunciation: "신구루 라이다-데 노레마스카?",
                category: "service",
                situationTip: "혼자 타도 괜찮다면 대기시간을 절반 이하로 줄일 수 있습니다.",
              },
            ]
          },
          {
            categoryName: "🍺 USJ 테마 파크 푸드 & 굿즈",
            items: [
              {
                id: "v3-3-3",
                korean: "버터맥주(무알콜) 1잔 주세요 🍺",
                japanese: "バタービール（ノンアルコール）を1つお願いします。",
                pronunciation: "바타-비-루(논아루코-루)오 히토츠 오네가이시마스",
                category: "order",
                image: "/images/vocab/butterbeer.svg",
                situationTip: "해리포터 존 오크통 가판대에서 주문 시 사용하세요.",
              },
              {
                id: "v3-3-4",
                korean: "기념품 컵 포함 버터맥주로 주세요.",
                japanese: "プレミアムマグカップ付きでお願いします。",
                pronunciation: "푸레미아무 마구캇푸 츠키데 오네가이시마스",
                category: "order",
                image: "/images/vocab/butterbeer.svg",
              },
              {
                id: "v3-3-5",
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
        id: "d3-4",
        time: "20:00 이후",
        title: "호텔 복귀 & 휴식 🌙",
        category: "hotel",
        icon: "Home",
        location: "유니버설 시티 호텔",
        coordinates: { lat: 34.6675, lng: 135.4372 },
        description: "기념품 정리 및 지친 발을 휴식하며 21:30 취침",
        recommendations: ["휴식 시 발바닥에 휴식시간(휴족시간) 파스 붙이기"],
        precautions: ["내일 09:00 체크아웃 및 난바 이동 짐싸기 완료하기"]
      }
    ],
    checklist: [
      { id: "c3-1", text: "USJ 모바일 입장권 QR 바코드 캡처", isImportant: true },
      { id: "c3-2", text: "입장 직후 닌텐도 월드 e정리권 발급!", isImportant: true },
      { id: "c3-3", text: "보조배터리 완충 & 이동전화 준비", isImportant: true },
      { id: "c3-4", text: "편한 운동화 착용" }
    ],
    generalTips: [
      "닌텐도 월드 e정리권은 파크에 실제로 입장한 후 USJ 앱의 위치기반(GPS)으로 발급받을 수 있습니다.",
      "싱글라이더(Single Rider) 제도를 이용하면 대기시간을 대폭 단축할 수 있습니다."
    ]
  },
  {
    dayNumber: 4,
    dateStr: "10/7",
    dayOfWeek: "수",
    title: "오사카성 → 포켓몬 → 몬헌 → 크루즈 → 도톤보리",
    tagline: "오늘은 오사카 핵심 관광 DAY! 💕",
    themeColor: "#8B5CF6",
    gradient: "from-purple-500 to-pink-500",
    badge: {
      text: "오사카 핵심 관광 DAY",
      type: "highlight"
    },
    summaryItems: ["호텔 체크아웃", "난바 캐리어 보관", "오사카성 천수각", "포켓몬 DX", "몬헌 카페", "도톤보리 크루즈", "야경 & 저녁"],
    dayRouteQuery: "Osaka+Castle+to+Pokemon+Center+Osaka+DX+to+Dotonbori+River+Cruise",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Dotonbori+Osaka&t=&z=14&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d4-1",
        time: "09:00",
        title: "호텔 체크아웃 🧳",
        category: "hotel",
        icon: "LogOut",
        location: "유니버설 시티 호텔",
        coordinates: { lat: 34.6675, lng: 135.4372 },
        description: "유니버설 시티 숙소 체크아웃 및 이동 준비",
        recommendations: ["룸에 두고 가는 소지품이 없는지 이중 점검"],
        precautions: ["체크아웃 09:00 정시 완료"]
      },
      {
        id: "d4-2",
        time: "09:30 ~ 10:30",
        title: "유니버설시티 → 난바 이동 🚃",
        category: "transport",
        icon: "Subway",
        location: "JR / 오사카 메트로 난바역",
        coordinates: { lat: 34.6663, lng: 135.5015 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Namba+Station+Osaka",
        description: "JR 라인 및 지하철을 이용하여 난바 도심으로 이동",
        recommendations: ["ICOCA 교통카드 수시 충전"],
        precautions: ["출근/오전 지하철 승객 혼잡 주의"],
        routes: [
          {
            id: "r4-2-1",
            label: "🚃 JR + 한신선 환승 동선 (추천)",
            badge: "약 30분",
            originTitle: "JR 유니버설시티역",
            originLocation: "Universal City Station Osaka",
            destinationTitle: "오사카난바역 (난바 숙소)",
            destinationLocation: "Osaka-Namba Station",
            originQuery: "Universal City Station Osaka",
            destinationQuery: "Osaka-Namba Station",
            transportMode: "transit",
            description: "JR 유니버설시티역 → 니시쿠조역 환승 → 한신 난바선으로 오사카난바역까지 쾌적하게 이동하는 동선입니다.",
            isPrimary: true,
          },
          {
            id: "r4-2-2",
            label: "🚕 택시 / 다이렉트 이동 동선",
            badge: "약 20분",
            originTitle: "유니버설 시티 호텔",
            originLocation: "Hotel Kintetsu Universal City",
            destinationTitle: "난바 숙소",
            destinationLocation: "Namba Osaka Hotel",
            originQuery: "Hotel Kintetsu Universal City Osaka",
            destinationQuery: "Namba Station Osaka",
            transportMode: "driving",
            description: "캐리어가 많을 경우 택시로 한 번에 난바 숙소까지 직행하는 동선입니다 (예상 요금 약 3,500~4,500엔).",
          },
        ]
      },
      {
        id: "d4-3",
        time: "10:30",
        title: "난바 숙소 도착 & 캐리어 보관 🧳",
        category: "hotel",
        icon: "Briefcase",
        location: "난바 인근 새 숙소",
        coordinates: { lat: 34.667, lng: 135.501 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Namba+Hotel+Osaka",
        description: "새 숙소 짐 보관 서비스 이용 또는 난바역 코인라커에 캐리어 맡기기",
        recommendations: ["호텔 프런트에 체크인 전 luggage deposit 요청"],
        precautions: ["코인라커 이용 시 위치 보관함 번호와 층수 사진 찍어두기"]
      },
      {
        id: "d4-4",
        time: "11:00 ~ 13:00",
        title: "오사카성 & 공원 관람 🏯",
        category: "sightseeing",
        icon: "Castle",
        location: "오사카성 천수각 (Osaka Castle)",
        coordinates: { lat: 34.6873, lng: 135.5262 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Osaka+Castle",
        description: "오사카 랜드마크 오사카성 천수각 및 해자, 아름다운 공원 산책",
        recommendations: [
          "천수각 최상층 전망대에서 오사카 시내 조망",
          "오사카성 공원 내 녹차 아이스크림 시식"
        ],
        precautions: [
          "천수각 엘리베이터 대기 줄이 길면 계단 이용 고려",
          "지하철 다니마치욘초메역 또는 모리노미야역 이용"
        ]
      },
      {
        id: "d4-5",
        time: "13:00 ~ 14:00",
        title: "점심 식사 🍱",
        category: "food",
        icon: "Utensils",
        location: "오사카성 근처 / 신사이바시",
        coordinates: { lat: 34.6738, lng: 135.5006 },
        description: "오사카성 인근 식당가 또는 신사이바시 이동 후 점심 식사",
        recommendations: ["맛있는 라멘 또는 오야코동 식사"],
        precautions: ["다음 포켓몬 센터 이동 시각 고려"]
      },
      {
        id: "d4-6",
        time: "14:30 ~ 16:00",
        title: "포켓몬센터 오사카 DX & 카페 ⚡",
        category: "shopping",
        icon: "Gamepad2",
        location: "신사이바시 다이마루 백화점 본관 9층",
        coordinates: { lat: 34.6738, lng: 135.5006 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Pokemon+Center+Osaka+DX",
        description: "대형 포켓몬센터 DX 구경, 오사카 한정 피카츄 굿즈 및 대형 피카츄 동상 촬영",
        recommendations: [
          "오사카 한정판 승무원/만자 피카츄 인형 및 봉제인형 굿즈 쇼핑",
          "포켓몬 카페 스페셜 음료 및 디저트"
        ],
        precautions: ["주말/공휴일 및 오후 시간대 정리권(입장권)이 배부될 수 있음"]
      },
      {
        id: "d4-7",
        time: "16:30 ~ 18:00",
        title: "몬스터헌터 카페 (CAPCOM STORE) 🎮",
        category: "shopping",
        icon: "Swords",
        location: "Shinsaibashi PARCO 6층 CAPCOM STORE",
        coordinates: { lat: 34.6732, lng: 135.5008 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=CAPCOM+STORE+OSAKA",
        description: "캡콤 스토어 및 몬스터헌터 컬래버레이션 테마 공간 체험 & 굿즈",
        recommendations: [
          "몬헌 테마 한정 장비 굿즈, 아이루 피규어 구경",
          "파르코 6층 팝업스토어 캐릭터 골목 전체 탐방"
        ],
        precautions: ["인기 굿즈 조기 품절 가능성 체크"]
      },
      {
        id: "d4-8",
        time: "18:15 ~ 18:45",
        title: "도톤보리 리버크루즈 탑승 🛥️",
        category: "sightseeing",
        icon: "Ship",
        location: "도톤보리 돈키호테 앞 선착장",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tombori+River+Cruise",
        description: "도톤보리 강물 위에서 네온사인과 글리코상을 둘러보는 리버크루즈 (약 20분)",
        recommendations: [
          "선상 가이드의 재치 있는 안내와 글리코상 앞 포토타임!"
        ],
        precautions: [
          "★ 승선권 미리 exchange 필수! 낮에 매표소에서 시간 지정 실물표로 교환해야 탑승 가능",
          "18:15 탑승 10분 전 선착장 대기"
        ],
        vocabCategories: [
          {
            categoryName: "🛥️ 도톤보리 크루즈 & 글리코상 포토",
            items: [
              {
                id: "v4-8-1",
                korean: "18시 15분 편으로 시간 지정 교환 부탁드립니다.",
                japanese: "18時15分の便で時間指定の交換をお願いします。",
                pronunciation: "쥬-하치지 쥬-고훈노 벤데 지칸 시테-노 코-칸오 오네가이시마스",
                category: "ticket",
                image: "/images/vocab/ferry.svg",
                situationTip: "돈키호테 앞 매표소 창구에서 낮에 실물 탑승권으로 교환 시 보여주세요.",
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
        time: "18:45 ~ 20:30",
        title: "도톤보리 야경 & 저녁 식사 🍢",
        category: "food",
        icon: "Utensils",
        location: "도톤보리 거리",
        coordinates: { lat: 34.6687, lng: 135.5013 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dotonbori+Glico+Sign",
        description: "화려한 도톤보리 야경, 글리코상 인증샷 촬영, 쿠시카츠 다루마 / 미즈노 오코노미야키 저녁",
        recommendations: [
          "글리코상 전용 포토 스팟(에비스 다리 / 놋폰바시 방향) 사진 촬영",
          "쿠시카츠 다루마, 이치란 라멘, 킨류 라멘 중 선택 저녁"
        ],
        precautions: ["도톤보리 거리 보행자 인파 매우 많음, 소지품 유의"],
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
                situationTip: "소고기, 새우, 메추리알 등 인기 꼬치가 포함된 세트 주문 시 편리합니다.",
              },
              {
                id: "v4-9-2",
                korean: "소스는 1번만 찍어 먹겠습니다! (위생 규칙)",
                japanese: "ソースの二度づけはしません！（ルール確認）",
                pronunciation: "소-스노 니도즈케와 시마센! (루-루 카쿠닌)",
                category: "general",
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
              {
                id: "v4-9-4",
                korean: "양배추 리필 가능한가요?",
                japanese: "キャベツのおかわりできますか？",
                pronunciation: "캬베츠노 오카와리 데키마스카?",
                category: "order",
              },
            ]
          }
        ]
      },
      {
        id: "d4-10",
        time: "20:30 ~ 21:00",
        title: "난바 숙소 체크인 & 휴식 🛌",
        category: "hotel",
        icon: "Key",
        location: "난바 숙소",
        coordinates: { lat: 34.667, lng: 135.501 },
        description: "새 숙소 체크인, 캐리어 수령 및 휴식",
        recommendations: ["내일 쿠로몬 시장 & 쇼핑 일정 체크"],
        precautions: ["체크인 완료 및 룸 번호 확인"]
      }
    ],
    checklist: [
      { id: "c4-1", text: "유니버설 시티 호텔 체크아웃 & 난바 짐보관", isImportant: true },
      { id: "c4-2", text: "도톤보리 리버크루즈 낮 시간대 교환권 필수 수령", isImportant: true },
      { id: "c4-3", text: "포켓몬센터 DX / 캡콤스토어 위치 파악" },
      { id: "c4-4", text: "글리코상 야경 인증샷 카메라 폰 충전" }
    ],
    generalTips: [
      "도톤보리 리버크루즈는 주유패스 무료 혜택 또는 개별 예매권이 있더라도, '당일 지정 시간 실물 승선권'으로 낮에 미리 바꿔두어야 야경 타임에 탑승할 수 있습니다.",
      "신사이바시 다이마루 9층 포켓몬센터와 파르코 6층 캡콤스토어는 연결 통로로 바로 이동할 수 있습니다."
    ]
  },
  {
    dayNumber: 5,
    dateStr: "10/8",
    dayOfWeek: "목",
    title: "쿠로몬 → 난바/신사이바시 → 신세카이 → 돈키",
    tagline: "마지막 쇼핑도 알차게! 🛍️",
    themeColor: "#F97316",
    gradient: "from-orange-500 to-amber-600",
    badge: {
      text: "마지막 알찬 쇼핑 DAY",
      type: "highlight"
    },
    summaryItems: ["09:00 기상", "쿠로몬 시장", "난바&신사이바시 쇼핑", "점심", "신세카이 & 츠텐카쿠", "MEGA 돈키호테", "마지막 저녁"],
    dayRouteQuery: "Kuromon+Market+to+Shinsekai+Tsutenkaku+to+MEGA+Don+Quijote+Shinsekai",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Shinsekai+Osaka&t=&z=15&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d5-1",
        time: "09:00",
        title: "기상 & 아침 ☀️",
        category: "hotel",
        icon: "Sun",
        location: "난바 숙소",
        coordinates: { lat: 34.667, lng: 135.501 },
        description: "상쾌하게 기상 후 시장 먹거리 탐방 준비",
        recommendations: ["쇼핑백/에코백 준비"],
        precautions: ["돈키호테 할인쿠폰 스마트폰에 띄워두기"]
      },
      {
        id: "d5-2",
        time: "10:00 ~ 11:30",
        title: "쿠로몬 시장 (Kuromon Market) 🐙",
        category: "food",
        icon: "ShoppingBag",
        location: "쿠로몬 시장",
        coordinates: { lat: 34.6653, lng: 135.507 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kuromon+Market",
        description: "'오사카의 주방'이라 불리는 활기찬 전통시장, 가리비/성게/참치/와규 꼬치 구이 맛보기",
        recommendations: [
          "즉석에서 구워주는 대형 가리비 버터구이 & 와규 꼬치",
          "신선한 참치 덮밥(생참치회) 시식"
        ],
        precautions: [
          "일부 가게의 해산물 가격이 다소 높을 수 있으므로 가격표와 양을 먼저 비교 후 구매!"
        ]
      },
      {
        id: "d5-3",
        time: "11:30 ~ 14:00",
        title: "난바 & 신사이바시 쇼핑 🛒",
        category: "shopping",
        icon: "ShoppingBag",
        location: "신사이바시 스지와 난바 거리",
        coordinates: { lat: 34.671, lng: 135.501 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Shinsaibashi-suji+Shopping+Street",
        description: "신사이바시 아케이드 상가, 드럭스토어, 의류 매장 쇼핑",
        recommendations: ["빅카메라 난바점, 디즈니스토어, 아디다스/나이키 스토어 구경"],
        precautions: ["면세(Tax Free) 혜택을 받기 위해 여권 필수 소지!"]
      },
      {
        id: "d5-4",
        time: "14:00 ~ 15:00",
        title: "점심 식사 🍜",
        category: "food",
        icon: "Utensils",
        location: "난바 인근 맛집",
        coordinates: { lat: 34.667, lng: 135.501 },
        description: "난바 근처 텐동, 라멘 또는 오코노미야키 맛집 식사",
        recommendations: ["카츠동 또는 구로몬 근처 유명 우동가게"],
        precautions: ["다음 이동을 위해 15:00 전 식사 마침"]
      },
      {
        id: "d5-5",
        time: "15:00",
        title: "난바 → 도부츠엔마에 이동 🚃",
        category: "transport",
        icon: "Subway",
        location: "오사카 메트로 미도스지선",
        coordinates: { lat: 34.6525, lng: 135.506 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Dobutsuen-mae+Station",
        description: "지하철 미도스지선으로 도부츠엔마에역(신세카이)으로 2정거장 이동",
        recommendations: ["이동 거리 약 10분으로 매우 가까움"],
        precautions: ["지하철 승차권 또는 ICOCA 터치"]
      },
      {
        id: "d5-6",
        time: "15:10 ~ 17:00",
        title: "신세카이 & 츠텐카쿠 관람 🗼",
        category: "sightseeing",
        icon: "Tower",
        location: "신세카이 & 츠텐카쿠 (Tsutenkaku Tower)",
        coordinates: { lat: 34.6525, lng: 135.5063 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Tsutenkaku",
        description: "오사카 레트로 감성의 신세카이 거리와 상징탑 츠텐카쿠 관람",
        recommendations: [
          "츠텐카쿠 '타워 슬라이더(Tower Slider)' 60m 미끄럼틀 이색 체험!",
          "행운의 신 '빌리켄(Billiken)' 발바닥 문지르고 소원 빌기",
          "레트로 게임장 및 복고풍 간판 배경 사진 촬영"
        ],
        precautions: [
          "★ 신세카이 쿠시카츠 전문점 이용 시 '튀김 소스는 처음 1회만 찍기' 위생 규칙 엄수!"
        ]
      },
      {
        id: "d5-7",
        time: "17:00 ~ 19:00",
        title: "MEGA 돈키호테 신세카이점 🛍️",
        category: "shopping",
        icon: "Store",
        location: "MEGA Don Quijote Shinsekai",
        coordinates: { lat: 34.6508, lng: 135.505 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=MEGA+Don+Quijote+Shinsekai",
        description: "초대형 매장 MEGA 돈키호테에서 선물, 과자, 의약품, 화장품 면세 쇼핑",
        recommendations: [
          "도톤보리점보다 복잡하지 않고 통로가 넓어 훨씬 쾌적하게 쇼핑 가능!",
          "카베진, 동전파스, 샤론파스, 곤약젤리, 키캣 킷캣 매치, 젤리류 대량 구매"
        ],
        precautions: [
          "★ 카톡 플친 또는 웹 쿠폰(10% 면세 + 5% 추가 할인) 바코드를 캡처가 아닌 '모바일 웹 브라우저'로 띄워 제시해야 적용됨!"
        ],
        vocabCategories: [
          {
            categoryName: "🛍️ 돈키호테 면세(Tax Free) & 할인쿠폰",
            items: [
              {
                id: "v5-7-1",
                korean: "면세(Tax Free) 계산 부탁드립니다. (여권 제시)",
                japanese: "免税会計をお願いします。（パスポート提示）",
                pronunciation: "멘제- 카이케이오 오네가이시마스",
                category: "shopping",
                image: "/images/vocab/taxfree.svg",
                situationTip: "면세 전용 카운터에서 여권과 함께 물건을 올리며 말씀하세요.",
              },
              {
                id: "v5-7-2",
                korean: "모바일 웹 5% 추가 할인 쿠폰 바코드입니다.",
                japanese: "5％割引クーポンのバーコードです。",
                pronunciation: "고파-센토 와리비키 쿠-폰노 바-코-도데스",
                category: "shopping",
                image: "/images/vocab/taxfree.svg",
                situationTip: "캡처본이 아닌 스마트폰 브라우저 화면의 바코드를 스캔해달라고 하세요.",
              },
            ]
          },
          {
            categoryName: "💊 인기 의약품 & 과자 위치 묻기",
            items: [
              {
                id: "v5-7-3",
                korean: "카베진 (위장약) 어디에 있나요?",
                japanese: "キャベジン（胃腸薬）はどこですか？",
                pronunciation: "캬베진(이쵸-야쿠)와 도코데스카?",
                category: "shopping",
              },
              {
                id: "v5-7-4",
                korean: "로이히 츠보코(동전파스) 어디에 있나요?",
                japanese: "ロイヒつぼ膏（コインパス）はどこですか？",
                pronunciation: "로이히 츠보코-(코인파스)와 도코데스카?",
                category: "shopping",
              },
              {
                id: "v5-7-5",
                korean: "곤약젤리 어디 있나요? (기내반입 불가, 위탁용)",
                japanese: "蒟蒻ゼリーはどこにありますか？",
                pronunciation: "콘냐쿠 제리-와 도코니 아리마스카?",
                category: "shopping",
              },
            ]
          }
        ]
      },
      {
        id: "d5-8",
        time: "19:00 ~ 20:30",
        title: "마지막 오사카 저녁 식사 🍻",
        category: "food",
        icon: "Utensils",
        location: "신세카이 야에카츠 / 난바",
        coordinates: { lat: 34.6528, lng: 135.506 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Yaekatsu+Shinsekai",
        description: "신세카이 3대 쿠시카츠 '야에카츠(Yaekatsu)' 또는 난바 맛집에서 멋진 마지막 밤 식사",
        recommendations: [
          "야에카츠: 바삭한 소고기 꼬치, 새우 꼬치, 도테야키(미소 도가니 구이) 강추!",
          "시원한 생맥주(나마비루)와 함께 여행 뒷풀이"
        ],
        precautions: ["인기 매장 야에카츠는 재료 소진 시 일찍 마감될 수 있음"]
      },
      {
        id: "d5-9",
        time: "20:30 이후",
        title: "숙소 복귀 & 짐 정리 🧳",
        category: "hotel",
        icon: "PackageCheck",
        location: "난바 숙소",
        coordinates: { lat: 34.667, lng: 135.501 },
        description: "구매한 면세품 수하물 규정에 맞게 패킹 및 캐리어 정리, 22:00 취침",
        recommendations: ["액체류(곤약젤리 튜브, 화장품)는 반드시 기내 반입이 아닌 위탁 수하물로 넣기!"],
        precautions: ["수하물 무게 제한(보통 15kg/23kg) 초과하지 않는지 체크"]
      }
    ],
    checklist: [
      { id: "c5-1", text: "여권 소지 (쇼핑 면세 Tax Free 필수)", isImportant: true },
      { id: "c5-2", text: "돈키호테 모바일 할인 쿠폰 웹 링크 띄우기", isImportant: true },
      { id: "c5-3", text: "쿠시카츠 소스 1회만 찍기 준수" },
      { id: "c5-4", text: "액체류/젤리 위탁 수하물 패킹" }
    ],
    generalTips: [
      "돈키호테 쇼핑 시 도톤보리점은 계산 대기만 1시간 이상 소요될 수 있으므로, 신세카이 MEGA 돈키호테점을 이용하면 훨씬 편하고 빠르게 면세 쇼핑을 끝낼 수 있습니다.",
      "면세품 포장 봉투는 일본 출국 전까지 개봉하지 않는 것이 원칙입니다."
    ]
  },
  {
    dayNumber: 6,
    dateStr: "10/9",
    dayOfWeek: "금",
    title: "오사카 → 한국 귀국",
    tagline: "즐거운 추억 가득 안고 또 만나요, 오사카! 💕",
    themeColor: "#EC4899",
    gradient: "from-pink-500 to-rose-500",
    badge: {
      text: "귀국 & 라피트 탑승",
      type: "info"
    },
    summaryItems: ["여유롭게 기상", "체크아웃 & 짐 보관", "난바 마지막 쇼핑", "짐 찾기 & 난카이 난바역", "라피트 탑승", "간사이 공항", "귀국!"],
    dayRouteQuery: "Nankai-Namba+Station+to+Kansai+Airport",
    googleEmbedMapUrl: "https://maps.google.com/maps?q=Nankai-Namba+Station&t=&z=14&ie=UTF8&iwloc=&output=embed",
    schedule: [
      {
        id: "d6-1",
        time: "오전",
        title: "여유롭게 기상 & 아침 ☕",
        category: "hotel",
        icon: "Coffee",
        location: "난바 숙소",
        coordinates: { lat: 34.667, lng: 135.501 },
        description: "마지막 날 아침, 브런치 또는 카페 여유 즐기기",
        recommendations: ["숙소 주변 카페에서 에그샌드위치 & 아메리카노"],
        precautions: ["체크아웃 시각 오버되지 않게 준비"]
      },
      {
        id: "d6-2",
        time: "오전 중",
        title: "체크아웃 후 짐 보관 🧳",
        category: "hotel",
        icon: "Briefcase",
        location: "난바 숙소 / 난카이 난바역",
        coordinates: { lat: 34.666, lng: 135.502 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Nankai-Namba+Station",
        description: "호텔 짐 보관 또는 난카이 난바역 코인라커에 캐리어 맡기기",
        recommendations: ["라피트 탑승 장소인 난카이 난바역 코인라커 이용 시 동선 최고"],
        precautions: ["라피트 출발 시각 30분 전까지 짐 찾기"]
      },
      {
        id: "d6-3",
        time: "오전 ~ 점심",
        title: "난바 마지막 산책 & 쇼핑 🛍️",
        category: "shopping",
        icon: "ShoppingBag",
        location: "난바 파크스 / 타카시마야 백화점",
        coordinates: { lat: 34.664, lng: 135.502 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Namba+Parks",
        description: "난바 파크스 옥상 가든 산책 및 타카시마야 백화점 손수건/기념품 마지막 쇼핑",
        recommendations: [
          "타카시마야 백화점 1층 명품 브랜드 손수건(비비안웨스트우드, 비비안 등) 선물용 구매",
          "난바 파크스 그린 파크 산책"
        ],
        precautions: ["잔여 엔화 현금 알차게 사용하기"]
      },
      {
        id: "d6-4",
        time: "출발 1시간 전",
        title: "짐 찾기 → 난카이 난바역 이동 🚶",
        category: "transport",
        icon: "Footprints",
        location: "난카이 난바역 3층 승강장",
        coordinates: { lat: 34.6657, lng: 135.5023 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Nankai-Namba+Station",
        description: "보관한 캐리어 찾은 후 난카이 난바역 개찰구 이동",
        recommendations: ["라피트 티켓 승차권 실물 교환 확인"],
        precautions: ["난바역 내부가 넓으므로 안내표지판 'Nankai Line' 따라 이동"]
      },
      {
        id: "d6-5",
        time: "오후 13:00~15:00",
        title: "라피트(Rapi:t) 탑승 🚅 → 간사이 공항 도착",
        category: "transport",
        icon: "Train",
        location: "난카이 라피트 특급열차",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+Airport+Station",
        description: "동글동글 파란색 미래형 특급열차 라피트 타고 간사이 공항 직행 (약 38분 소요)",
        recommendations: ["넓은 라피트 좌석에서 편안하게 휴식 및 여행 사진 정리"],
        precautions: [
          "★ 라피트는 전좌석 지정석이므로 출발 시각과 호차/좌석 번호 꼭 확인!"
        ]
      },
      {
        id: "d6-6",
        time: "출국 3시간 전",
        title: "출국 수속 & 간사이 공항 면세점 🛍️ ✈️ 한국으로!",
        category: "shopping",
        icon: "PlaneTakeoff",
        location: "간사이 국제공항 면세 구역",
        coordinates: { lat: 34.432, lng: 135.2304 },
        googleMapsUrl: "https://www.google.com/maps/search/?api=1&query=Kansai+International+Airport+Duty+Free",
        description: "탑승 수속 및 보안검색 후 면세점에서 기념품 과자 구매 후 한국 귀국",
        recommendations: [
          "면세점 인기 과자: 로이스 생초콜릿, 도쿄 바나나, 시로이 코이비토, 이치란 라멘 밀키트",
          "남은 100엔/10엔 동선은 공항 자판기나 면세점 계산 시 현금+카드 조합으로 깔끔하게 소진!"
        ],
        precautions: [
          "★ 간사이 공항 국제선 출국장 보안검색대 대기줄이 매우 길 수 있으므로 3시간 전 공항 도착 필수!",
          "로이스 초콜릿 보냉백(약 100엔) 추가 권장"
        ]
      }
    ],
    checklist: [
      { id: "c6-1", text: "난카이 라피트 지정석 시각 재확인", isImportant: true },
      { id: "c6-2", text: "호텔 짐 보관표 및 코인라커 열쇠 챙기기", isImportant: true },
      { id: "c6-3", text: "비행기 출발 3시간 전 간사이 공항 도착", isImportant: true },
      { id: "c6-4", text: "로이스 초콜릿 보냉백 추가 구매" }
    ],
    generalTips: [
      "간사이 공항 출국 보안검색대 대기 줄이 길 수 있으니 라피트 시간표를 공항에 2.5~3시간 전 도착할 수 있도록 잡는 것이 안전합니다.",
      "잔여 엔화 동전은 면세점에서 물건 살 때 '동전 전액 결제 + 잔액 카드 결제'로 처리하면 깔끔하게 지울 수 있습니다."
    ]
  }
];
