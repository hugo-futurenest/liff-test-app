// app/page.tsx

"use client";

import { useLiff } from "./liff/LiffProvider";
import { useEffect } from "react";
import Head from "next/head";
import styles from "@/styles/Home.module.css";

const Home = () => {
  const { liff, liffError, userId, isLoggedIn, login, logout } = useLiff();

  useEffect(() => {
    if (liff && isLoggedIn) {
      console.log("User is logged in");
    }
  }, [liff, isLoggedIn]);

  if (liffError) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>LIFF init failed.</h1>
          <p>
            <code>{liffError}</code>
          </p>
        </main>
      </div>
    );
  }

  if (!liff) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
          <h1>Loading LIFF...</h1>
        </main>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>LIFF App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1>LIFF APP</h1>
        <p>LIFF init succeeded.</p>
        <p>LIFF ID: {liff.id}</p>
        {isLoggedIn ? (
          <>
            <p>User ID: {userId}</p>
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <button onClick={login}>Login</button>
        )}
      </main>
    </div>
  );
};

export default Home;
