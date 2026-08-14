# 🇯🇵 오사카 5박 6일 여행 계획표 웹 애플리케이션 (10/4 ~ 10/9)

> **손그림 스크랩북 감성의 오사카 5박 6일 여행 가이드 & 시간대별 동선 지도 웹 앱**

---

## 📌 주요 특징
- 🗓️ **6일간의 시간대별 상세 일정**: 10/4(토) 입국부터 10/9(금) 귀국까지 완벽 가이드
- 🗺️ **구글 지도 연동**: 일자별 전체 동선 & 개별 장소 1클릭 구글 지도 길찾기 모달
- 💡 **조사 기반 추천(꿀팁) & ⚠️ 주의사항**: 캡틴라인 주유패스 불가, USJ 닌텐도 e정리권, 리버크루즈 티켓 교환, 돈키호테 면세 쿠폰 등
- 🎨 **따뜻한 손그림 스크랩북 디자인**: 아이보리/베이지 종이 질감 + 아기자기 스티커 배지
- 📱 **100% 반응형 웹 (Responsive)**: 모바일 스와이프 탭, 태블릿, PC 완벽 지원
- 🛍️ **체크리스트 & 필수 일본어**: 준비물 체크(`localStorage` 저장) & 유용한 여행 단어 카드

---

## 🚀 빠른 시작 (Quick Start)

### 1. 개발 서버 실행
```bash
# 패키지 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```
접속 주소: [http://localhost:3000/](http://localhost:3000/)

### 2. 프로덕션 빌드
```bash
npm run build
```
빌드 결과물은 `dist/` 폴더에 생성됩니다.

---

## 🌐 무료 배포 방법 (아내분과 공유)

### Netlify Drop 이용 (추천 ⭐)
1. `npm run build` 실행 후 생성된 `dist` 폴더를 [Netlify Drop](https://app.netlify.com/drop)에 드래그 앤 드롭합니다.
2. 몇 초 만에 영구 무료 주소(`https://xxxx.netlify.app`)가 생성되어 모바일 카톡으로 쉽게 공유할 수 있습니다.

---

## 📁 프로젝트 구조 (Project Structure)
```
osaka-travel-plan/
├── index.html                  # HTML 메인 & Tailwind CDN & 폰트 세팅
├── package.json                # 의존성 패키지 및 빌드 스크립트
├── vite.config.ts              # Vite 설정
├── src/
│   ├── main.tsx                # 엔트리 포인트
│   ├── App.tsx                 # 탭 전환, 모달 상태 관리 메인 컴포넌트
│   ├── index.css               # 스크랩북 테마 CSS 및 반응형 유틸리티
│   ├── data/
│   │   └── itineraryData.ts    # 6일간의 일정, 시간, 지도, 꿀팁, 주의사항 데이터셋
│   └── components/
│       ├── Header.tsx          # 스크랩북 헤더 & 모바일 스와이프 탭 바
│       ├── OverviewGrid.tsx    # 6일간의 포스터 카드 오버뷰
│       ├── DayDetailView.tsx   # 일자별 타임라인 & 꿀팁/주의사항 스티커 박스
│       ├── RouteMapModal.tsx   # 구글 지도 길찾기 모달
│       └── TipsAndChecklist.tsx# 대화형 체크리스트 & 여행 일본어
├── AI_WORK_LOG.md              # 대화 및 작업 기록 (집에서 이어서 작업용)
└── README.md                   # 프로젝트 사용 설명서
```
