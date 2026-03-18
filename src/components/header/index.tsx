import Link from "next/link";
import styles from "../header/header.module.css";

export function Header(){
    return(
        <header className={styles.header}>
            <h1 className={styles.title}>Mini Trello</h1>
        </header>
    )
}