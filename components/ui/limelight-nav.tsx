"use client";

import React, { useState, useRef, useEffect, useLayoutEffect, cloneElement } from "react";
import Link from "next/link";

// Safe layout effect for SSR in Next.js
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// --- Internal Types and Defaults ---

const DefaultHomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
  </svg>
);

const DefaultCompassIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z" />
  </svg>
);

const DefaultBellIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
  </svg>
);

export type NavItem = {
  id: string | number;
  icon?: React.ReactElement<{ className?: string }>;
  label?: string;
  href?: string;
  onClick?: () => void;
};

const defaultNavItems: NavItem[] = [
  { id: "default-home", icon: <DefaultHomeIcon />, label: "Home" },
  { id: "default-explore", icon: <DefaultCompassIcon />, label: "Explore" },
  { id: "default-notifications", icon: <DefaultBellIcon />, label: "Notifications" },
];

export type LimelightNavProps = {
  items?: NavItem[];
  defaultActiveIndex?: number;
  activeIndex?: number;
  onTabChange?: (index: number) => void;
  className?: string;
  limelightClassName?: string;
  iconContainerClassName?: string;
  iconClassName?: string;
};

/**
 * An adaptive-width navigation bar with a "limelight" effect that highlights the active item.
 */
export const LimelightNav = ({
  items = defaultNavItems,
  defaultActiveIndex = 0,
  activeIndex: controlledActiveIndex,
  onTabChange,
  className = "",
  limelightClassName = "",
  iconContainerClassName = "",
  iconClassName = "",
}: LimelightNavProps) => {
  const [internalActiveIndex, setInternalActiveIndex] = useState(defaultActiveIndex);
  const activeIndex = controlledActiveIndex !== undefined ? controlledActiveIndex : internalActiveIndex;
  
  const [isReady, setIsReady] = useState(false);
  const navItemRefs = useRef<(HTMLAnchorElement | HTMLDivElement | null)[]>([]);
  const limelightRef = useRef<HTMLDivElement | null>(null);

  const updateLimelightPosition = () => {
    if (items.length === 0) return;

    const limelight = limelightRef.current;
    const activeItem = navItemRefs.current[activeIndex];

    if (limelight && activeItem) {
      const newLeft =
        activeItem.offsetLeft + activeItem.offsetWidth / 2 - limelight.offsetWidth / 2;
      limelight.style.left = `${newLeft}px`;

      if (!isReady) {
        setTimeout(() => setIsReady(true), 50);
      }
    }
  };

  useIsomorphicLayoutEffect(() => {
    updateLimelightPosition();
  }, [activeIndex, items]);

  // Recalcular posición al cambiar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => updateLimelightPosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeIndex, items]);

  if (items.length === 0) {
    return null;
  }

  const handleItemClick = (index: number, itemOnClick?: () => void) => {
    if (controlledActiveIndex === undefined) {
      setInternalActiveIndex(index);
    }
    onTabChange?.(index);
    itemOnClick?.();
  };

  return (
    <nav
      className={`limelight-nav-container relative inline-flex items-center h-16 rounded-2xl px-2 overflow-hidden backdrop-blur-md ${className}`}
    >
      {/* Luz Spotlight activa */}
      <div
        ref={limelightRef}
        className={`limelight-pill absolute top-0 z-10 w-12 h-[4px] rounded-full ${
          isReady ? "transition-[left] duration-300 ease-in-out" : ""
        } ${limelightClassName}`}
        style={{ left: "-999px" }}
      >
        {/* Cono de luz en forma de trapecio con gradiente adaptable a tema */}
        <div className="limelight-cone absolute left-1/2 -translate-x-1/2 top-[4px] w-20 h-14 pointer-events-none" />
      </div>

      {items.map(({ id, icon, label, href, onClick }, index) => {
        const isActive = activeIndex === index;
        const itemContent = (
          <>
            {icon &&
              cloneElement(icon as React.ReactElement<{ className?: string }>, {
                className: `w-5 h-5 transition-all duration-200 ease-in-out ${
                  isActive ? "limelight-active-icon" : "limelight-inactive-item"
                } ${icon.props?.className || ""} ${iconClassName}`,
              })}
            {label && (
              <span
                className={`text-sm font-medium transition-all duration-200 ${
                  icon ? "ml-2" : ""
                } ${
                  isActive ? "limelight-active-label" : "limelight-inactive-item"
                }`}
              >
                {label}
              </span>
            )}
          </>
        );

        const commonProps = {
          key: id,
          ref: (el: HTMLAnchorElement | null) => {
            navItemRefs.current[index] = el;
          },
          className: `relative z-20 flex h-full cursor-pointer items-center justify-center px-4 py-2 select-none transition-all ${iconContainerClassName}`,
          onClick: () => handleItemClick(index, onClick),
          "aria-label": label || `Nav item ${index + 1}`,
        };

        if (href) {
          return (
            <Link href={href} {...commonProps}>
              {itemContent}
            </Link>
          );
        }

        return (
          <a role="button" tabIndex={0} {...commonProps}>
            {itemContent}
          </a>
        );
      })}
    </nav>
  );
};
