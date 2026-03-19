import styles from "../header/header.module.css";

export function Header(){
    return(
        <header className={styles.header}>
            <h1 className={styles.title}>Mini Trello</h1>
            <button className={styles.filter}>Filter</button>
            <button className={styles.sort}>Sort</button>
        </header>
    )
}