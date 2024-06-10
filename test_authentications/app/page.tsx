'use client'
import { Provider } from "react-redux";
import CustomCard from "./Components/Card";
import styles from "./page.module.css";
import { store } from "./redux/store";
import PlatformCont from "./Components/PlatformContainer";
import Link from "next/link";

export default function page() {


  type platformsType = {
    title: string;
    route: string;
    status: "completed" | "pending" | "ongoing";
  }

  const platforms: platformsType[] = [
    {
      title: "Facebook",
      route: "/Facebook",
      status: "ongoing",
    },
    {
      title: "Google",
      route: "/Google",
      status: "completed"
    },
    {
      title: "Instagram",
      route: "/Instagram",
      status: "pending"
    },
    {
      title: "YouTube",
      route: "/YouTube",
      status: "completed"
    },
    {
      title: "LinkedIn",
      route: "/YouTube",
      status: "pending"
    },
    {
      title: "Skype",
      route: "/YouTube",
      status: "pending"
    },
    {
      title: "Twitter",
      route: "/Twitter",
      status: "completed"
    },
    {
      title: "Amazon",
      route: "/YouTube",
      status: "pending"

    },
    {
      title: "Twitch",
      route: "/YouTube",
      status: "pending"

    },
    {
      title: "GitHub",
      route: "/YouTube",
      status: "pending"

    },
    {
      title: "WhatsApp",
      route: "/YouTube",
      status: "pending"

    },
    {
      title: "Discord",
      route: "/Discord",
      status: "completed"

    },
  ]

  return (
    <Provider store={store}>
      <main className={styles.main}>
        <CustomCard >
          <div className={styles.platformsCont}>
            {
              platforms.map((platform, index) => <PlatformCont title={platform.title} route={platform.route} status={platform.status} key={index} />)
            }
          </div>
        </CustomCard>
      </main>
    </Provider>
  );
}
