import { ReactComponent as HomeIcon } from "@/assets/icons/home.svg";
import { ReactComponent as MailIcon } from "@/assets/icons/mail.svg";
import { ReactComponent as InvoicesIcon } from "@/assets/icons/invoices.svg";
import { ReactComponent as HelpCenterIcon } from "@/assets/icons/help-center.svg";
import { ReactComponent as GearIcon } from "@/assets/icons/gear.svg";

import s from "./Aside.module.scss";

function Aside() {
  return (
    <aside className={s.aside}>
      <h2 className={s.asideHeader}>Impekable</h2>
      <ul className={s.navLinksList}>
        <li className={s.navLinkItem}>
          <a href="#">
            <HomeIcon /> Home
          </a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">Dashboard</a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">
            <MailIcon /> MailIcon
          </a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">Products</a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">
            <InvoicesIcon /> Invoices
          </a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">Customers</a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">Chat Room</a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">Calendar</a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">
            <HelpCenterIcon /> Help Center
          </a>
        </li>
        <li className={s.navLinkItem}>
          <a href="#">
            <GearIcon /> Settings
          </a>
        </li>
      </ul>
    </aside>
  );
}

export default Aside;
