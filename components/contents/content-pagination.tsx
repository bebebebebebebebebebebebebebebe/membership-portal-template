import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/** アクティブページをティール塗りにするための上書きクラス。 */
const activePageClass =
  "data-[active=true]:bg-primary data-[active=true]:text-primary-foreground data-[active=true]:border-primary";

/**
 * コンテンツ一覧下部のページネーション。
 * 左に「前へ 1 … 8 次へ」、右に「表示件数」Select を全幅で両端配置する静的モック。
 */
export function ContentPagination() {
  return (
    <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
      <Pagination className="mx-0 w-auto justify-start">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" text="前へ" aria-label="前のページ" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive className={activePageClass}>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">4</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">8</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" text="次へ" aria-label="次のページ" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>表示件数</span>
        <Select defaultValue="12">
          <SelectTrigger className="w-[90px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="12">12件</SelectItem>
              <SelectItem value="24">24件</SelectItem>
              <SelectItem value="48">48件</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
