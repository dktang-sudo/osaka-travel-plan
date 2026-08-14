# 📝 오사카 여행 웹 앱 AI 작업 & 대화 기록 (AI_WORK_LOG.md)

이 문서는 집이나 다른 PC에서 작업을 이어서 진행할 수 있도록 지금까지의 **사용자 요청사항, 디자인 결정, 조사 내용, 트러블슈팅 및 작업 내역 전체**를 기록한 파일입니다.

---

## 📅 여행 개요 (User Requirements)
- **여행지**: 일본 오사카 (Osaka, Japan)
- **일정**: 2026년 10월 4일 (토) ~ 10월 9일 (금) [5박 6일]
- **요구사항**:
  1. 메인 페이지: 전체 일정이 한눈에 보이는 6일간의 오버뷰 페이지
  2. 일자별 상세 페이지: 시간대별 상세 일정과 내용을 보여주고, 클릭 시 이동 동선 구글 지도가 보일 것
  3. 꿀팁 & 주의사항: 각 계획별 주요 꿀팁(💡) 및 해야 할 것/주의사항(⚠️) 명시
  4. 아내분 공유용 무료 배포(Netlify) & 모바일/태블릿 반응형 UI 적용

---

## 🎨 디자인 선택 및 테마 결정 (Design Aesthetic)
- **선택된 테마**: **[안 2: 따뜻한 손그림 스크랩북 & 스티커 스타일]**
- **디자인 요소**:
  - 아이보리/베이지 종이 질감 배경 (`#f7f3e9` + 미세 그리드 패턴)
  - 마스킹 테이프(Washi Tape) 포스트잇 상단 배지
  - 손글씨 폰트 (`Gowun Dodum`, `Noto Sans KR`)
  - 일자별 컬러 배지 (`DAY 1`~`DAY 6` 귀여운 라운드 스티커)
  - 볼드한 테두리와 종이 그림자 효과 (`border-2 border-slate-900 shadow-[4px_4px_0px_#1e293b]`)

---

## 🗓️ 6일간의 일정 상세 내역 (Complete Schedule & Tips)

### **DAY 1: 10/4 (토) - 오사카 입성 & 유니버설 시티 도착**
- **동선**: 간사이 공항 $\rightarrow$ 유니버설 시티 이동 $\rightarrow$ 호텔 체크인 $\rightarrow$ 유니버설 시티워크 저녁
- **💡 꿀팁**: 시티워크 'TAKOPA' 5대 타코야키 비교 시식, 풍월 오코노미야키
- **⚠️ 주의사항**: 입국 수속 대기시간 감안, 라피트/버스 티켓 교환 위치 파악

### **DAY 2: 10/5 (월) - 가이유칸 & 캡틴라인 & 곤충숍**
- **동선**: 09:40 캡틴라인 (유니버설시티포트 $\rightarrow$ 덴포잔) $\rightarrow$ 가이유칸 수족관 $\rightarrow$ 덴포잔 마켓 점심 $\rightarrow$ INSECTSHOP KMY OSAKA 곤충숍 $\rightarrow$ 15:00 캡틴라인 복귀 $\rightarrow$ 호텔 휴식 $\rightarrow$ 시티워크 저녁
- **💡 꿀팁**: 가이유칸 고래상어 & 미즈타마리 아이스크림, 덴포잔 대관람차 시스루 곤돌라, 곤충 표본 및 굿즈 구경
- **⚠️ 주의사항**: **★ 캡틴라인은 주유패스 무료 혜택 불가 (왕복 티켓 별도 구매 필수!)**, 가이유칸 모바일 타임슬롯 예약

### **DAY 3: 10/6 (화) - USJ (유니버설 스튜디오 재팬) 종일!**
- **동선**: 07:00 기상 $\rightarrow$ 08:00 오픈런 입장 $\rightarrow$ USJ 종일 (닌텐도 월드, 해리포터, 미니언즈) $\rightarrow$ 20:00 복귀
- **💡 꿀팁**: 마리오 카트, 버터맥주, 키노피오 카페 버섯 수프
- **⚠️ 주의사항**: **★ USJ 게이트 입장 직후 USJ 앱에서 '닌텐도 월드 e정리권' 즉시 신청**, 편한 운동화 & 보조배터리 필수

### **DAY 4: 10/7 (수) - 오사카성 $\rightarrow$ 포켓몬 $\rightarrow$ 몬헌 $\rightarrow$ 크루즈 $\rightarrow$ 도톤보리**
- **동선**: 난바 숙소 짐보관 $\rightarrow$ 오사카성 천수각 $\rightarrow$ 포켓몬센터 DX (다이마루 9층) $\rightarrow$ 몬스터헌터 카페 (파르코 6층) $\rightarrow$ 18:15 도톤보리 리버크루즈 $\rightarrow$ 도톤보리 야경 & 저녁
- **💡 꿀팁**: 포켓몬 오사카 한정 피카츄 굿즈, 도톤보리 글리코상 포토스팟, 야에카츠/미즈노 저녁
- **⚠️ 주의사항**: **★ 도톤보리 리버크루즈는 낮 시간에 매표소에서 시간 지정 실물 승선권으로 미리 교환해야 야간 탑승 가능**

### **DAY 5: 10/8 (목) - 쿠로몬 시장 $\rightarrow$ 난바/신사이바시 $\rightarrow$ 신세카이 $\rightarrow$ 돈키**
- **동선**: 쿠로몬 시장 $\rightarrow$ 난바/신사이바시 쇼핑 $\rightarrow$ 신세카이 & 츠텐카쿠 타워 슬라이더 $\rightarrow$ MEGA 돈키호테 신세카이점 $\rightarrow$ 마지막 저녁
- **💡 꿀팁**: 츠텐카쿠 60m 타워 슬라이더 체험, MEGA 돈키호테 신세카이점이 도톤보리점보다 훨씬 넓고 쾌적함
- **⚠️ 주의사항**: **★ 신세카이 쿠시카츠 소스는 위생상 '처음 1회만 찍기' 규칙**, **★ 돈키호테 면세 5%+10% 할인 쿠폰은 모바일 웹 화면으로 제시해야 인정**

### **DAY 6: 10/9 (금) - 난바 산책 & 귀국**
- **동선**: 체크아웃 & 짐보관 $\rightarrow$ 난바 파크스/타카시마야 손수건 쇼핑 $\rightarrow$ 난카이 라피트 탑승 $\rightarrow$ 간사이 공항 면세점 $\rightarrow$ 귀국
- **💡 꿀팁**: 타카시마야 백화점 1층 명품 손수건 선물, 공항 면세점 로이스 생초콜릿/도쿄 바나나
- **⚠️ 주의사항**: 라피트 특급열차 지정좌석 시각 재확인, 간사이 공항 출국 수속 대기 줄 감안 3시간 전 공항 도착

---

## 🛠️ 기술 스택 및 구조 (Tech Stack)
- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS (CDN & custom typography in `index.html`), Vanilla CSS (`index.css`)
- **Icons**: Lucide React (`lucide-react`)
- **Maps**: Google Maps Embed Iframe + Google Maps Directions Direct API Links

---

## ⚙️ 집에서 작업 이어받는 방법 (Home Setup Guide)

```bash
# 1. 깃허브 저장소 클론
git clone https://github.com/dktang-sudo/osaka-travel-plan.git

# 2. 프로젝트 디렉토리 이동
cd osaka-travel-plan

# 3. 의존성 패키지 설치
npm install

# 4. 개발 서버 시작
npm run dev

# 5. 빌드 테스트
npm run build
```

---

## 📜 커밋 및 푸시 기록
- Initial Commit: 6-Day Itinerary Data, Modern Responsive Design, Map Modals, Tips & Checklist
- Remote: `https://github.com/dktang-sudo/osaka-travel-plan.git` (Branch: `main`)
- Created at: 2026-08-14
