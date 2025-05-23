import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const surveyId = searchParams.get("surveyId");
    const client = await clientPromise;
    const db = client.db("DataLinguaLab");
    const survey = await db.collection("surveys").findOne({ _id: ObjectId(surveyId) });
    
    if (!survey) {
        return new Response(JSON.stringify({ message: "Survey not found" }), { status: 404 });
    }

    return new Response(JSON.stringify(survey), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
}