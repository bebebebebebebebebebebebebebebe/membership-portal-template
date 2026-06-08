import { describe, expect, it } from "vitest";

import type { Content } from "@/features/contents/types/content";
import type {
  Discoverability,
  PublicationStatus,
} from "@/features/contents/types/content-publication";
import { isListedPublishedContent } from "@/features/contents/utils/content-publication";

function makeContent(
  publicationStatus: PublicationStatus,
  discoverability: Discoverability
): Content {
  return {
    id: "test",
    category: "記事",
    title: "テスト記事",
    description: "公開判定の検証用データ。",
    thumbnail: "/images/contents/thumb-01.jpg",
    tags: ["確認用"],
    publicationStatus,
    discoverability,
    accessPolicy: { kind: "free" },
    author: { name: "管理者", avatar: "/images/avatars/avatar-02.jpg", initials: "管" },
    date: "2024/05/20",
    readMinutes: 5,
  };
}

describe("isListedPublishedContent", () => {
  it.each<[PublicationStatus, Discoverability, boolean]>([
    ["published", "listed", true],
    ["published", "unlisted", false],
    ["published", "hidden", false],
    ["draft", "listed", false],
    ["scheduled", "listed", false],
    ["archived", "listed", false],
  ])("%s + %s は %s", (status, discoverability, expected) => {
    expect(isListedPublishedContent(makeContent(status, discoverability))).toBe(
      expected
    );
  });
});
