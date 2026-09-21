import type { IPageHeadingProps } from "@/types/layout";

export const PageHeading = ({ title, description, children, className }: IPageHeadingProps) => (
  <div className={`sticky top-0 z-10 ${className ?? ''}`}>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description ? (
          <p className="text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {children}
    </div>
  </div>
);
