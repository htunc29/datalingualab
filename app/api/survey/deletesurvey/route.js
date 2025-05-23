import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const surveyId = searchParams.get('surveyId');

        if (!surveyId) {
            return NextResponse.json(
                { error: "Anket ID'si gerekli" },
                { status: 400 }
            );
        }

        const client = await clientPromise;
        const db = client.db();
        
        const result = await db
            .collection("surveys")
            .deleteOne({ _id: new ObjectId(surveyId) });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Anket bulunamadı" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Anket başarıyla silindi" });
    } catch (error) {
        console.error("Anket silinirken hata:", error);
        return NextResponse.json(
            { error: "Anket silinirken bir hata oluştu" },
            { status: 500 }
        );
    }
} 