/**
 * 認証基盤は未確定（README「未確定事項」）のため、サイドバー・ヘッダーで表示する
 * 会員情報はモックの固定値を用いる。実装が決まり次第セッション情報に差し替える。
 */
export type MemberUser = {
  name: string;
  email: string;
  avatar: string;
  /** アバター画像が読み込めない場合の Avatar フォールバック表示 */
  initials: string;
  /** 会員種別ラベル（ヘッダーのユーザー表示に使用） */
  membership: string;
};

export const currentUser: MemberUser = {
  name: "山田 太郎",
  email: "taro.yamada@example.com",
  avatar: "/images/avatars/avatar-06.jpg",
  initials: "山田",
  membership: "プレミアム会員",
};
