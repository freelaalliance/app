import { Skeleton } from "@/components/ui/skeleton"

export function VendaPlaceholder() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-60" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-44" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-52" />
        <Skeleton className="h-24 w-full" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  )
}
