import { ReactComponent as WebIcon } from "@/assets/icons/web.svg";
import { ReactComponent as ArrowDownIcon } from "@/assets/icons/arrow-down.svg";
import johnDoeImage from "@/assets/images/john_doe.png";

import s from "./MainLayoutHead.module.scss";

function MainLayoutHead() {
  return (
    <div className={s.mainHeader}>
      <div>
        <input
          type="text"
          placeholder="Search transactions, invoices or help"
        />
      </div>
      <div className={s.mainHeaderRight}>
        <a href="#">
          <WebIcon />
        </a>
        <a href="#">*Chat icon*</a>
        <a href="#">*Bell icon*</a>

        <span className={s.mainHeaderRightDivider} />

        <button className={s.mainHeaderRightProfileButton}>
          John Doe <ArrowDownIcon />
        </button>
        <div className={s.mainHeaderRightAvatar}>
          <img src={johnDoeImage} alt="" />
        </div>
      </div>
    </div>
  );
}

export default MainLayoutHead;
