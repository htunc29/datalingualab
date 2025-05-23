import NextAuth from "next-auth";
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from "@/lib/mongodb";  
import { compare } from "bcryptjs";
import GoogleProvider from 'next-auth/providers/google';
import { ObjectId } from "mongodb";
const handler=NextAuth({
    providers:[
        CredentialsProvider({
            name:"Credentials",
            credentials:{
                email:{label:"Email",type:"text"},
                password:{label:"Password",type:"password"},
            },
            async authorize(credentials){
                const client=await clientPromise;
                const db=client.db("DataLinguaLab")
                const user=await db.collection("users").findOne({email:credentials.email})
                if(!user) throw new Error("Kullanıcı Bulunamadı")
                const isValid=await compare(credentials.password,user.password)
                if(!isValid) throw new Error("Şifre Yanlış")
                return{
                    id:user._id.toString(),
                    email:user.email,
                    name:user.name
                }
            }
        }),
        // Add this to providers array
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        })
    ],
    pages:{
        signIn:"/auth/login",
    },
    session:{
        strategy:"jwt"
    },
    callbacks:{
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            session.user.id = token.id;
            return session;
        }, 
    },
    secret:process.env.NEXTAUTH_SECRET
})

export { handler as GET, handler as POST };