import { cn } from "@/lib/utils";
import React from "react";
import { Icons } from "./icons";
import { siteConfig } from "@/config/site";
import { ModeToggle } from "./ModeToggle";

export function SiteFooter({className}: React.HTMLAttributes<HTMLElement>) {
    return (
        <footer className={cn(className)}>
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Icons.logo />
            <p className="text-center text-sm leading-loose md:text-left">
              Built by{" "}
              <a
                href={siteConfig.links.twitter}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                moonpatel
              </a>
              . The source code is available on{" "}
              <a
                href={siteConfig.links.github}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4"
              >
                GitHub
              </a>
              .
            </p>
          </div>
          <ModeToggle />
        </div>
      </footer>
  
    )
}