import React from "react";
import "./Footer.css";
import Wave from "../../img/wave.png";
import Insta from "@iconscout/react-unicons/icons/uil-instagram";
import Gitub from "@iconscout/react-unicons/icons/uil-github";

const Footer = () => {
  return (
    <div className="footer">
      <img src={Wave} alt="" style={{ width: "100%" }} />
      <div className="f-content">
        <span>hardikvatukiya0014@gmail.com</span>
        <div className="f-icons">
          <a
            href="https://www.instagram.com/hardik_vatukiya_07/"
            target="_black"
          >
            <Insta color="white" size={"3rem"} />
          </a>

          <a href="https://github.com/hardik0018" target="_black">
            <Gitub color="white" size={"3rem"} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
