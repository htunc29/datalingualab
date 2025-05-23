import clientPromise from "@/lib/mongodb";

export async function GET(request) {
    const client = await clientPromise;
    const db = client.db("DataLinguaLab");
    const surveys = await db.collection("surveys").find({}).toArray();
    return new Response(JSON.stringify(surveys), {
        status: 200,
        headers: {
        "Content-Type": "application/json",
        },
    });
}