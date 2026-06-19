const INITIAL_RESTAURANTS = [
  {
    id: "res-1",
    name: "고른햇살",
    category: "한식/분식",
    area: "참살이길",
    distance: 120, // in meters
    rating: 4.8,
    reviewCount: 124,
    priceRange: "4,000원 ~ 6,000원",
    isSoloFriendly: true,
    hasGroupSeats: false,
    groupCapacity: 8,
    canReserve: false,
    tags: ["#가성비최고", "#혼밥성지", "#김밥맛집"],
    menus: [
      { name: "참치김밥", price: 4500 },
      { name: "라볶이", price: 5500 },
      { name: "순대", price: 4500 },
      { name: "치즈라면", price: 4000 }
    ],
    reviews: [
      {
        id: "rev-1-1",
        user: "고대호랑이",
        rating: 5,
        content: "참치김밥 크기가 몽둥이만합니다. 라볶이랑 같이 먹으면 2명이서 배 터져요. 최고의 가성비!",
        isReceiptCertified: true,
        date: "2026-06-15"
      },
      {
        id: "rev-1-2",
        user: "경영대18학번",
        rating: 4,
        content: "자리가 협소해서 웨이팅이 좀 있지만 회전율이 빨라요. 혼밥하기 아주 좋습니다.",
        isReceiptCertified: true,
        date: "2026-06-12"
      }
    ]
  },
  {
    id: "res-2",
    name: "어흥식당",
    category: "양식/스테이크",
    area: "개운사길",
    distance: 250,
    rating: 4.6,
    reviewCount: 88,
    priceRange: "9,800원 ~ 11,800원",
    isSoloFriendly: true,
    hasGroupSeats: false,
    groupCapacity: 12,
    canReserve: false,
    tags: ["#스테이크맛집", "#가성비함박", "#혼밥석완비"],
    menus: [
      { name: "어흥스테이크", price: 9800 },
      { name: "매콤치즈함박", price: 10800 },
      { name: "반반함박", price: 11800 }
    ],
    reviews: [
      {
        id: "rev-2-1",
        user: "아남동주민",
        rating: 5,
        content: "이 가격에 고품질 스테이크를 먹을 수 있다는건 축복입니다. 테이블마다 칸막이와 1인석이 잘 되어있어서 시험기간 혼밥 단골집입니다.",
        isReceiptCertified: true,
        date: "2026-06-18"
      }
    ]
  },
  {
    id: "res-3",
    name: "영철버거",
    category: "패스트푸드/버거",
    area: "안암역/정문",
    distance: 90,
    rating: 4.5,
    reviewCount: 72,
    priceRange: "4,500원 ~ 7,000원",
    isSoloFriendly: true,
    hasGroupSeats: true,
    groupCapacity: 30,
    canReserve: true,
    tags: ["#역사적인버거", "#단체의나라", "#수제버거"],
    menus: [
      { name: "스트리트버거", price: 4500 },
      { name: "치즈버거", price: 5500 },
      { name: "감자튀김", price: 3000 }
    ],
    reviews: [
      {
        id: "rev-3-1",
        user: "석탑러너",
        rating: 4,
        content: "고대생의 소울푸드 영철버거! 단체로 가기도 넓고, 단품 4500원이라 지갑 얇을 때 딱입니다.",
        isReceiptCertified: true,
        date: "2026-06-14"
      }
    ]
  },
  {
    id: "res-4",
    name: "매스플레이트",
    category: "이탈리안/양식",
    area: "참살이길",
    distance: 310,
    rating: 4.4,
    reviewCount: 52,
    priceRange: "13,500원 ~ 23,500원",
    isSoloFriendly: false,
    hasGroupSeats: true,
    groupCapacity: 40,
    canReserve: true,
    tags: ["#회식추천", "#파스타맛집", "#기념일추천"],
    menus: [
      { name: "목살필라프", price: 13500 },
      { name: "로제파스타", price: 14500 },
      { name: "목살스테이크샐러드", price: 23500 }
    ],
    reviews: [
      {
        id: "rev-4-1",
        user: "동아리회장",
        rating: 5,
        content: "동아리 뒤풀이나 소규모 회식할 때 미리 예약해서 가기 좋습니다. 양이 엄청 많고 맛있어요.",
        isReceiptCertified: true,
        date: "2026-06-10"
      }
    ]
  },
  {
    id: "res-5",
    name: "미소초밥",
    category: "일식/초밥",
    area: "개운사길",
    distance: 210,
    rating: 4.7,
    reviewCount: 46,
    priceRange: "12,000원 ~ 18,000원",
    isSoloFriendly: true,
    hasGroupSeats: false,
    groupCapacity: 10,
    canReserve: false,
    tags: ["#초밥정식", "#안암일식", "#깔끔한한끼"],
    menus: [
      { name: "모둠초밥", price: 12000 },
      { name: "특선초밥", price: 16000 },
      { name: "연어초밥", price: 18000 }
    ],
    reviews: [
      {
        id: "rev-5-1",
        user: "초밥킬러",
        rating: 5,
        content: "네타가 길고 밥 양도 적당해요. 닷지석이 있어서 조용하게 혼밥하고 오기 정말 편해요.",
        isReceiptCertified: true,
        date: "2026-06-16"
      }
    ]
  },
  {
    id: "res-6",
    name: "동우설렁탕",
    category: "한식/국밥",
    area: "제기동/정문",
    distance: 420,
    rating: 4.6,
    reviewCount: 94,
    priceRange: "10,000원 ~ 29,000원",
    isSoloFriendly: true,
    hasGroupSeats: true,
    groupCapacity: 24,
    canReserve: true,
    tags: ["#설렁탕맛집", "#수육맛집", "#노포감성"],
    menus: [
      { name: "설렁탕", price: 10000 },
      { name: "설렁탕특", price: 12000 },
      { name: "수육(소)", price: 29000 }
    ],
    reviews: [
      {
        id: "rev-6-1",
        user: "국밥러버",
        rating: 4,
        content: "진하고 깔끔한 설렁탕 맛입니다. 밥과 소면이 무한리필이라 대식가 대학생들에게 최고의 성지 중 하나입니다.",
        isReceiptCertified: true,
        date: "2026-06-17"
      }
    ]
  },
  {
    id: "res-7",
    name: "백소정 안암점",
    category: "일식/돈카츠",
    area: "참살이길",
    distance: 170,
    rating: 4.5,
    reviewCount: 68,
    priceRange: "9,500원 ~ 12,500원",
    isSoloFriendly: true,
    hasGroupSeats: false,
    groupCapacity: 16,
    canReserve: false,
    tags: ["#마제소바", "#돈카츠맛집", "#줄서는맛집"],
    menus: [
      { name: "마제소바", price: 9500 },
      { name: "돈카츠(등심)", price: 10500 },
      { name: "치즈카츠", price: 12500 }
    ],
    reviews: [
      {
        id: "rev-7-1",
        user: "미디어학부22",
        rating: 5,
        content: "마제소바 맛이 정말 일품입니다. 돈카츠도 겉바속촉 제대로네요! 가게 내부도 정말 깨끗해요.",
        isReceiptCertified: true,
        date: "2026-06-13"
      }
    ]
  },
  {
    id: "res-8",
    name: "형제한우곱창",
    category: "한식/구이",
    area: "기타", // 안암오거리 방면
    distance: 580,
    rating: 4.7,
    reviewCount: 112,
    priceRange: "22,000원 ~ 35,000원",
    isSoloFriendly: false,
    hasGroupSeats: true,
    groupCapacity: 50,
    canReserve: true,
    tags: ["#곱창대창", "#동아리회식", "#소주안주"],
    menus: [
      { name: "한우곱창", price: 23000 },
      { name: "대창구이", price: 22000 },
      { name: "곱창전골", price: 35000 }
    ],
    reviews: [
      {
        id: "rev-8-1",
        user: "과대표",
        rating: 5,
        content: "새내기 배움터 끝나고 동아리 단체 회식으로 예약해서 갔는데, 사장님 서비스도 엄청 주시고 가게가 50명 수용 가능할 정도로 진짜 넓어서 대만족이었습니다.",
        isReceiptCertified: true,
        date: "2026-06-11"
      }
    ]
  }
];
