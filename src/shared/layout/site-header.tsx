import { Header, type HeaderProps } from "@/shared/layout/header";
import { MobileBottomTabBar } from "@/shared/layout/mobile-bottom-tab-bar.client";

export type SiteHeaderProps = HeaderProps;

export function SiteHeader(props: HeaderProps) {
  return (
    <>
      <Header {...props} />
      <MobileBottomTabBar locale={props.locale} messages={props.messages} />
    </>
  );
}
