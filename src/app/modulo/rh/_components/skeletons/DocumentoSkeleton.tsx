import { Skeleton } from '@/components/ui/skeleton'
import { FileText } from 'lucide-react'

interface DocumentoSkeletonProps {
  count?: number
}

export function DocumentoSkeleton({ count = 3 }: DocumentoSkeletonProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div key={`skeleton-${Math.random()}`} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
