"use client";
import { useSession } from "next-auth/react";

export default function AboutPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <p>Yükleniyor...</p>;

  if (!session) return <p>Yetkisiz erişim</p>;

  return (
    <div>
     <h1 className="text-2xl">{session.user.name}</h1>
     <h2 className="text-xl">{session.user.email}</h2>
     <img src={session.user.image} alt="" />
     <p>{session.user.accessToken}</p>
     <p>{session.user.id}</p>
    </div>
  );
}
