import type { ArticleComment } from "@/features/contents/types/content-detail";
import type { AuthUser } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

/** コメント 1 件（アバター・名前・日時・本文・返信）。 */
function CommentItem({ comment }: { comment: ArticleComment }) {
  return (
    <div className="flex gap-3">
      <Avatar className="size-9">
        <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
        <AvatarFallback>{comment.author.initials}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {comment.datetime}
          </span>
        </div>
        <p className="text-sm leading-relaxed">{comment.body}</p>
        <Button
          variant="link"
          size="sm"
          className="h-auto w-fit p-0 text-xs text-muted-foreground"
        >
          返信
        </Button>
      </div>
    </div>
  );
}

type CommentsSectionProps = {
  comments: ArticleComment[];
  currentUser: AuthUser;
};

/**
 * 全幅「コメント」セクション。
 *
 * コメント入力欄（Textarea＋投稿ボタン）とコメント一覧で構成する。
 * 静的 UI のため投稿処理は持たず、見た目と件数表示のみのモック。
 *
 * @param comments 表示するコメント一覧
 * @param currentUser コメント入力欄に表示する認証済みユーザー
 */
export function CommentsSection({
  comments,
  currentUser,
}: CommentsSectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-bold tracking-tight">
        コメント
        <span className="ml-1 text-muted-foreground tabular-nums">
          ({comments.length})
        </span>
      </h2>

      <Card>
        <CardContent className="flex gap-3">
          <Avatar className="size-9">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback>{currentUser.initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-1 flex-col items-end gap-2">
            <Textarea placeholder="コメントを入力..." aria-label="コメントを入力" />
            <Button>投稿する</Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-6">
        {comments.map((comment, index) => (
          <CommentItem key={index} comment={comment} />
        ))}
      </div>
    </section>
  );
}
