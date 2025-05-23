import clientPromise from "@/lib/mongodb";

export async function POST(req) {
    try{
        const body= await req.json();
        console.log(body)
        const client=await clientPromise;
        const db=client.db("DataLinguaLab");
        const { bigData } = body; // Destructure bigData from the request body
        if (!bigData) {
            return new Response(JSON.stringify({ message: "Eksik bilgi var" }), { status: 400 });
        }
        // Check if bigData is an array and has at least one item
        await db.collection("surveys").insertOne({
            surveyTitle: body.surveyTitle,
            userId: body.userData,
            surveyDescription: body.surveyDescription,
            surveyCategory: body.surveyCategory,
            createdAt: Date(),
            updatedAt:  Date(),
            bigData: bigData,
        });
        return new Response(JSON.stringify({ message: "Survey created successfully" }), { status: 200 });
    }catch(err){
        console.error(err);
        return new Response(JSON.stringify({ message: "Sunucu hatası" }), { status: 500 });
    }
}