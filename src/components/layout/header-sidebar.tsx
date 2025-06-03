import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type HeaderSidebarProps = {
  menus: {
    title: string;
    link?: string;
  }[];
};

export const HeaderSidebar = ({ menus }: HeaderSidebarProps) => {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <Breadcrumb>
          <BreadcrumbList>
            {menus.map((menu, index) => {
              if (index === menus.length - 1) {
                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbPage>{menu.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                );
              } else {
                return (
                  <Fragment key={index}>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href={menu.link}>
                        {menu.title}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                  </Fragment>
                );
              }
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
};
