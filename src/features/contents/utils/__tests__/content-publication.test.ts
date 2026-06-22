import { describe, expect, it } from "vitest";

import type { Content } from "@/features/contents/types/content";
import type {
  Discoverability,
  PublicationStatus,
} from "@/features/contents/types/content-publication";
import {
  isListedPublishedContent,
  isPubliclyAccessibleContentMetadata,
} from "@/features/contents/utils/content-publication";

function makeContent(
  publicationStatus: PublicationStatus,
  discoverability: Discoverability
): Content {
  return {
    id: "test",
    title: "テストコンテンツ",
    description: "公開判定の検証用データ。",
    thumbnail: "/images/contents/thumb-01.jpg",
    tags: ["確認用"],
    publicationStatus,
    discoverability,
    routeAccessPolicy: { kind: "public" },
    accessPolicy: { kind: "free" },
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

describe("isPubliclyAccessibleContentMetadata", () => {
  it.each<[PublicationStatus, Discoverability, boolean]>([
    ["published", "listed", true],
    ["published", "unlisted", true],
    ["published", "hidden", false],
    ["draft", "listed", false],
    ["scheduled", "unlisted", false],
    ["archived", "listed", false],
  ])("%s + %s は %s", (status, discoverability, expected) => {
    expect(
      isPubliclyAccessibleContentMetadata(makeContent(status, discoverability))
    ).toBe(expected);
  });
});
