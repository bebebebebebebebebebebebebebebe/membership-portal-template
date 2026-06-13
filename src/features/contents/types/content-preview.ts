/**
 * 認可前の gate 表示で扱えるコンテンツ概要。
 *
 * 本文セクションや添付 URL など、認可後にだけ扱う詳細データは含めない。
 */
export type ContentPreview = {
  id: string;
  introduction: string;
};
