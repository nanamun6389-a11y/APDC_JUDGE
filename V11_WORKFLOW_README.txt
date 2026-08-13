APDC JUDGE V11 WORKFLOW

운영 흐름
1. ENTRIES: 선수/이벤트 등록
2. TIMETABLE: 엔트리 기준 자동 생성, 합동/취소
3. JUDGING: 타임테이블 경기별 심사위원 배정
4. JUDGE SITE: 배정된 경기만 표시, 제출 즉시 Firebase 저장
5. RESULTS: Quarter/Semi recall 집계, Final 순위 계산 후 Firebase 저장
6. CERTIFICATE: FINAL 결과를 불러와 선택 출력

데이터는 새 대회의 competitions/{competitionId}/ 아래에 저장됩니다.
- entries
- timetableOverride
- eventSettings
- submissions
- results

Quarter는 12명, Semi는 6명을 기준으로 recall을 집계합니다. 커트라인 동점은 같은 recall 수까지 함께 진출시켜 임의 탈락을 막습니다.
Final은 각 저지의 1~N위 ballot을 이용해 과반수/누적 순위 기준으로 순위를 계산하고, 계산 당시 raw judge marks도 results에 함께 저장합니다.
