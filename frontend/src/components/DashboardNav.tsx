import { cn } from "@/lib/utils";
import { Link, useLocation } from "react-router-dom";
import { Icons } from "./icons";
import { SidebarNavItem } from "@/types";

interface DashboardNavProps {
  items: SidebarNavItem[]
}

export function DashboardNav({ items }: DashboardNavProps) {
  const { pathname: path } = useLocation();

  if (!items?.length) {
    return null;
  }

  return (
    <nav className="grid items-start gap-2">
      {items.map((item, index) => {
        const Icon:any = Icons[item.icon || "arrowRight"];
        return (
          item.href && (
            <Link key={index} to={item.disabled ? "/" : item.href}>
              <span
                className={cn(
                  "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                  path === item.href ? "bg-accent" : "transparent",
                  item.disabled && "cursor-not-allowed opacity-80"
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                <span>{item.title}</span>
              </span>
            </Link>
          )
        );
      })}
    </nav>
  );
}
