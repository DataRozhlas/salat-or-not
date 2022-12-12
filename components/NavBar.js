import React from "react";
import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import Image from "next/image";

const NavBar = () => {
  return (
    <>
      <nav className={styles["top-menu"]}>
        <Link
          href="https://irozhlas.cz/"
          style={{
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        >
          <Image
            alt="iROZHLAS.cz"
            src="https://data.irozhlas.cz/salat-or-not/img/irozhlas.svg"
            height={50}
            width={120}
          ></Image>
        </Link>
      </nav>
    </>
  );
};

export default NavBar;
