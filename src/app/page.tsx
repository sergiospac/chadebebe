import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.homeContainer}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Bem-vindo ao Enxoval Solidário GAP</h1>
        <p className={styles.heroSubtitle}>
          Gerencie eventos, enxovais e doações com carinho.
        </p>
        <div className={styles.actions}>
          <Link href="/login" className={`${styles.action} ${styles.primary}`}>
            Fazer Login
          </Link>
          <a
            href="https://enxoval.org/"
            target="_blank"
            rel="noreferrer"
            className={`${styles.action} ${styles.secondary}`}
          >
            Conheça o GAP
          </a>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Eventos Mensais</h3>
          <p className={styles.cardText}>
            Organize os encontros e deixe tudo pronto para receber as doações.
          </p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Enxovais completos</h3>
          <p className={styles.cardText}>
            Monte listas de itens personalizados para cada enxoval.
          </p>
        </div>
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Doações transparentes</h3>
          <p className={styles.cardText}>
            Acompanhe doadores, itens disponíveis e quantidades em tempo real.
          </p>
        </div>
      </section>
    </main>
  );
}
