import { hash } from 'bcryptjs';
import clientPromise from "@/lib/mongodb";

export async function POST(req) {
  try {
    const { name, email, password } = await req.json();
    console.log(name)

    if (!name || !email || !password) {
      return new Response(JSON.stringify({ message: "Eksik bilgi var" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("DataLinguaLab");

    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ message: "Bu email zaten kullanılıyor" }), { status: 400 });
    }

    const hashedPassword = await hash(password, 10);

    await db.collection("users").insertOne({
      name,
      email,
      password: hashedPassword,
    });

    return new Response(JSON.stringify({ message: "Kayıt başarılı" }), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: "Sunucu hatası" }), { status: 500 });
  }
}
