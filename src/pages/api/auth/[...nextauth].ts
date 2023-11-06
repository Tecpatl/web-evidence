import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
//import prisma from "@/lib/prisma";
//import { PrismaAdapter } from "@next-auth/prisma-adapter";

export const authOptions: NextAuthOptions = {
  //debug: true,
  //adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      // 登录按钮显示 (e.g. "Sign in with Credentials")
      name: "Credentials",
      // credentials 用于配置登录页面的表单
      credentials: {
        email: {
          label: "邮箱",
          type: "text",
          placeholder: "请输入邮箱",
        },
        password: {
          label: "密码",
          type: "password",
          placeholder: "请输入密码",
        },
      },
      async authorize(credentials, req) {
        // TODO
        // const maybeUser= await prisma.user.findFirst({where:{
        //   email: credentials.email,
        //  }})

        // 根据 credentials 我们查询数据库中的信息
        const user = {
          id: "1",
          name: "xiaoma",
          email: "xiaoma@example.com",
        };

        const success = credentials.email == "admin" && credentials.password == "123"

        if (success) {
          // 返回的对象将保存才JWT 的用户属性中
          return user;
        } else {
          // 如果返回null，则会显示一个错误，建议用户检查其详细信息。
          return null;
          // 跳转到错误页面，并且携带错误信息 http://localhost:3000/api/auth/error?error=用户名或密码错误
          //throw new Error("用户名或密码错误");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: "test",
  },
  callbacks: {
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: async ({ session, token, user }) => {
      if (session?.user && token) {
        // session.user.id = token.id as string;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);

