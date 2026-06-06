"use client";

import styled from "@emotion/styled";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { theme } from "@/styles/theme";

const NAV_ITEMS = [
  { id: "home", label: "홈", icon: "/images/홈.svg", href: "/" },
  { id: "community", label: "커뮤니티", icon: "/images/커뮤니티.svg", href: "/community" },
  { id: "messages", label: "쪽지", icon: "/images/쪽지.svg", href: "/messages" },
  { id: "profile", label: "프로필", icon: "/images/프로필.svg", href: "/profile" },
] as const;

const NavRoot = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: ${theme.layout.bottomNavHeight}px;
  display: flex;
  align-items: stretch;
  justify-content: space-around;
  padding-bottom: env(safe-area-inset-bottom, 0);
  background: ${theme.colors.white};
  border-top: 1px solid ${theme.colors.borderLight};
`;

const NavItem = styled(Link)`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  color: ${theme.colors.navInactive};

  &[data-active="true"] {
    color: ${theme.colors.black};
  }

  .nav-icon {
    width: 24px;
    height: 24px;
    background: currentColor;
    mask: var(--icon-url) center / contain no-repeat;
    -webkit-mask: var(--icon-url) center / contain no-repeat;
  }

  span {
    font-size: 10px;
    font-weight: 400;
  }

  &[data-active="true"] span {
    font-weight: 600;
  }
`;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <NavRoot aria-label="하단 메뉴">
      {NAV_ITEMS.map(({ id, label, icon, href }) => {
        const active = href === "/" ? pathname === href : pathname.startsWith(href);

        return (
        <NavItem
          key={id}
          href={href}
          data-active={active ? "true" : undefined}
          aria-current={active ? "page" : undefined}
        >
          <span
            className="nav-icon"
            style={{ "--icon-url": `url("${icon}")` } as React.CSSProperties}
            aria-hidden
          />
          <span>{label}</span>
        </NavItem>
        );
      })}
    </NavRoot>
  );
}
