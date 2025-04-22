import { cn } from "@/utils/helpers"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-default-700", className)}
      {...props}
    />
  )
}

export { Skeleton }
