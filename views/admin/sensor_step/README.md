# history state를 활용한 사용자 선택 interaction 기억하기
## history state 관련 자료
- https://developer.mozilla.org/ko/docs/Web/API/History/replaceState
- https://iamawebdeveloper.tistory.com/42

## 사용 code 안내
- 사용 목적 : 사용자가 페이지에 들어와서 변경한 페이지내 상태값 저장
- ex) pagination, entries, 선택한 tab 등
- state 저장할때 : pagination 클릭시, entries 클릭시, tab 버튼 클릭시, tree 체크 클릭시
  - history.state 와 param으로 받는 object를 합쳐 history state를 갱신해준다
  - deep copy 함
``` setState({page:1}) // example ```
- state 적용할때 : 부분 ejs 안에서 ui 관련 함수 call 전후에 실행
  - maintainState 함수 정의시 상태값에 따라 달라져야하는 ui 코드 작성
``` ex) maintainState(); // example ```
- setState 함수


## 적용할 규칙 참조
- https://docs.google.com/spreadsheets/d/1tpeDvv-ygJABg3OfXJljEDTSlfKFxBlgNYL7J2ElleY/edit

## history state 구조
- admin/sensor
```{
  page: 1 // 현재 보고 있는 pagination num
  entries: 10 // 현재 보고 있는 table의 entries 수
  initCheckedDataIDs: {}// 현재 tree 에서 check된 folder, sensor
  sid: {}// 현재 tree 에서 check된 sensor의 sid
}```

- admin/sensor(tab이 추가 되면서 예상되는 history state 구조)
```
{
  selectedTab: 'SensorDevice', // 'EmbeddedSoftware', 'ClientSoftware'
  SensorDevice: {
    page: 1 // 현재 보고 있는 pagination num
    entries: 10 // 현재 보고 있는 table의 entries 수
  },
  EmbeddedSoftware: {
    page: 1 // 현재 보고 있는 pagination num
    entries: 10 // 현재 보고 있는 table의 entries 수
  },
  ClientSoftware: {
    page: 1 // 현재 보고 있는 pagination num
    entries: 10 // 현재 보고 있는 table의 entries 수
  },
  initCheckedDataIDs: {}// 현재 tree 에서 check된 folder, sensor
  sid: {}// 현재 tree 에서 check된 sensor의 sid
}
```
