import { MongoClient } from "mongodb";

const uri=process.env.MONGODB_URI;
let client;
let clientPromise;
if(!process.env.MONGODB_URI){
 throw new Error("Lütfen .env.local dosyasını kontrol et")
}
if(process.env.NODE_ENV){
    if(!global._mongoClientPromise){
        client=new MongoClient(uri,{
            maxPoolSize: 50,
            useUnifiedTopology: true 
        })
        global._mongoClientPromise=client.connect()
    }
    clientPromise=global._mongoClientPromise
}else{
    client=new MongoClient(uri,{
        maxPoolSize: 50,
        useUnifiedTopology: true 
    })
    clientPromise=client.connect()
}
export default clientPromise;