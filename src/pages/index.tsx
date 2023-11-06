import { useState, memo, useEffect, useCallback } from "react";
import ContainerView from "../components/container";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from 'antd'



const Home = () => {
  const { data: session } = useSession();

  useEffect(() => {
    console.log("init");
    return () => {
      console.log("destroy");
    };
  }, []);
  if (session) {
    return (
      <div>
        <ContainerView />
      </div>
    );
  }
  return <Button onClick={() => signIn()}>登录</Button>;
};

export default Home;