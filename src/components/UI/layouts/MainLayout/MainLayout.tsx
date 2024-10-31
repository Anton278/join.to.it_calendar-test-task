import Aside from "@/components/Business/Aside/Aside";
import MainLayoutHead from "@/components/Business/MainLayoutHead/MainLayoutHead";

import s from "./MainLayout.module.scss";

type MainLayoutProps = {
  pageTitle?: string;
  children?: React.ReactNode;
};

function MainLayout({ pageTitle, children }: MainLayoutProps) {
  return (
    <main className={s.wrapper}>
      <Aside />
      <div className={s.main}>
        <MainLayoutHead />
        <div className={s.mainCalendarOutterWrapper}>
          <h1 className={s.pageTitle}>{pageTitle}</h1>
          <div>{children}</div>
        </div>
      </div>
    </main>
  );
}

export default MainLayout;
