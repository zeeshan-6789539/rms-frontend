"use client";

import { useTranslations } from "next-intl";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrentUser } from "@/features/auth/hooks/use-current-user";
import { useLogout } from "@/features/auth/hooks/use-logout";
import { getInitials } from "@/utils/string";

export const UserMenu = () => {
  const t = useTranslations("account");
  const tRoles = useTranslations("account.roles");
  const { data: user, isPending } = useCurrentUser();
  const { mutate: signOut, isPending: isSigningOut } = useLogout();

  if (isPending || !user) return <Skeleton className="h-12" />;

  return (
    <div className="flex items-center gap-3">
      <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-soft-foreground">
        {getInitials(...user.name.split(" "))}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {user.name}
        </p>
        <p className="truncate text-xs text-muted-foreground">{tRoles(user.role)}</p>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={() => signOut()}
        isLoading={isSigningOut}
        aria-label={t("signOut")}
        title={t("signOut")}
      >
        {!isSigningOut ? <LogOut className="h-4 w-4" aria-hidden /> : null}
      </Button>
    </div>
  );
};
