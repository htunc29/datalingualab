import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google"; // Google provider'ı ekliyoruz
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Giriş",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Şifre", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await axios.post(
            "http://localhost:5121/api/User/login",
            {
              email: credentials.email,
              password: credentials.password,
            },
            {
              headers: { "Content-Type": "application/json" },
            }
          );
      
          console.log("API Response Data: ", data);  // API'den gelen token'ı logla
      
          if (!data) {
            console.log("Token alınamadı");
            return null;
          }
      
          const token = data; // Token'ı alıyoruz
          const decoded = jwtDecode(token); // Token'ı decode et
      
          console.log("Decoded Token: ", decoded); // Decode edilmiş token'ı logla
      
          if (decoded && decoded.email === credentials.email) {
            return {
              id: decoded.sub,
              email: decoded.email,
              name: decoded.name || decoded.unique_name,
              role: decoded.role,
              token: token,
            };
          } else {
            console.log("Email veya token uyuşmuyor");
            return null;
          }
        } catch (error) {
          console.error("Giriş hatası:", error.response?.data || error.message);
          return null;
        }
      }
      
      
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Hata durumunda yönlendirme
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 gün
  },
  callbacks: {
    async jwt({ token, user }) {
      // Kullanıcı giriş yaptığında
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.accessToken = user.token; // API'den gelen token
      }
      return token;
    },
    async session({ session, token }) {
      // Session objesini özelleştiriyoruz
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      session.user.email = token.email;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  
});

export { handler as GET, handler as POST };