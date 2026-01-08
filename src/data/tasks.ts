export type TaskCard = {
  id: string;
  preview: string;
  full: string;
  intensity: "soft" | "deep";
};

export const taskDeck: TaskCard[] = [
  {
    id: "soft-1",
    preview: "耳元で甘く...",
    full: "耳元で甘く『今日の相手は素敵』と囁く",
    intensity: "soft"
  },
  {
    id: "soft-2",
    preview: "相手の●●に...",
    full: "相手の手を取り、10秒見つめてからハグ",
    intensity: "soft"
  },
  {
    id: "soft-3",
    preview: "後ろから優しく...",
    full: "後ろから優しく肩に触れ、深呼吸を合わせる",
    intensity: "soft"
  },
  {
    id: "soft-4",
    preview: "見えないところで...",
    full: "目を閉じたまま、指先で相手の手の甲をなぞる",
    intensity: "soft"
  },
  {
    id: "soft-5",
    preview: "近づいて...",
    full: "距離を5cmまで近づけて、3カウント静止",
    intensity: "soft"
  },
  {
    id: "deep-1",
    preview: "相手の●●を...",
    full: "相手の肩を包み、ゆっくりと頬にキスの空気",
    intensity: "deep"
  },
  {
    id: "deep-2",
    preview: "胸元で...",
    full: "胸元で相手の名前を呼び、指先で心拍を数える",
    intensity: "deep"
  },
  {
    id: "deep-3",
    preview: "愛の囁き...",
    full: "愛の囁きを1フレーズ、相手の目を見て伝える",
    intensity: "deep"
  },
  {
    id: "deep-4",
    preview: "触れ合う...",
    full: "手と手を重ね、呼吸を合わせて10秒間見つめる",
    intensity: "deep"
  }
];
