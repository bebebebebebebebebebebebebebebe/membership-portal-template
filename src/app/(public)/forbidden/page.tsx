import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "アクセス権限がありません | Modular Member Portal",
  description: "このページを表示する権限がありません。",
};

/**
 * 権限不足で Admin Zone へ入れない場合の案内ページ。
 */
export default function ForbiddenPage() {
  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle>アクセス権限がありません</CardTitle>
        <CardDescription>
          このページは管理者権限を持つユーザーのみ利用できます。
        </CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        管理機能を利用する必要がある場合は、管理者アカウントでログインしてください。
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/contents">コンテンツカタログへ</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/dashboard">ダッシュボードへ</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
