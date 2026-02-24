/** 아파트 실거래가 단건 */
export interface ApartmentTrade {
  dealAmount: string        // 거래금액 (만원)
  buildYear: string         // 건축연도
  dealYear: string          // 거래연도
  dong: string              // 법정동
  bonbun: string            // 번지
  bubun: string             // 부번
  sigunguCode: string       // 시군구코드
  eubmyundong: string       // 읍면동
  floor: string             // 층
  dealMonth: string         // 거래월
  dealDay: string           // 거래일
  apartmentName: string     // 아파트명
  exclusiveArea: string     // 전용면적 (㎡)
  jibun: string             // 지번
  regionalCode: string      // 지역코드
  roadName: string          // 도로명
  roadNameBonbun: string    // 도로명건물본번호
  roadNameBubun: string     // 도로명건물부번호
  roadNameSeq: string       // 도로명일련번호코드
  roadNameBasementCode: string // 도로명지상지하코드
  roadNameCode: string      // 도로명코드
  dealType: string          // 거래유형
  dealerAddress: string     // 중개사소재지
  registrationDate: string  // 등기일자
  cancelDealType: string    // 해제사유발생일
}

/** 아파트 전월세 단건 */
export interface ApartmentRent {
  buildYear: string
  dealYear: string
  dong: string
  bonbun: string
  bubun: string
  monthlyRent: string       // 월세금액 (만원), 전세면 0
  sigunguCode: string
  floor: string
  dealMonth: string
  dealDay: string
  apartmentName: string
  depositAmount: string     // 보증금 (만원)
  exclusiveArea: string
  jibun: string
  regionalCode: string
  contractPeriod: string    // 계약기간
  renewalRightUsed: string  // 갱신요구권사용
  previousDeposit: string   // 종전계약보증금
  previousMonthlyRent: string // 종전계약월세
}

/** 아파트 시세 분석 결과 */
export interface ApartmentPriceAnalysis {
  regionCode: string
  regionName: string
  yearMonth: string
  averageDealAmount: number
  minDealAmount: number
  maxDealAmount: number
  dealCount: number
  priceChangeRate: number   // 전월 대비 변동률 (%)
  aiSummary: string
}
