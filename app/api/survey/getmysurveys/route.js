import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json(
                { error: "Kullanıcı ID'si gerekli" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db("DataLinguaLab");
        
        // Anketleri userId'ye göre filtrele ve createdAt'e göre sırala
        const surveys = await db.collection("surveys").find({"userId":userId}).toArray();

        return NextResponse.json(surveys);
    } catch (error) {
        console.error("Anketler getirilirken hata:", error);
        return NextResponse.json(
            { error: "Anketler getirilirken bir hata oluştu" },
            { status: 500 }
        );
    }
}