import React, {useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
const Logout = () => {

    const Navigate = useNavigate();
    useEffect(()=>{
        fetch('/logout',{
            method: "GET",
            headers:{
                Accept: "application/json",
                "Content-Type":"application/json"
            },
            credentials: "include"
        }).then((res)=>{
            Navigate("../",{replace:true});
            if(res.status !== 200){
                const error = new Error(res.error);
                throw error;
            }
        }).catch((err)=>{
            console.log(err);
        });
    });

  return(
      <>
      <section><h3>ONE MOMENT PLEASE!!!</h3></section>
      </>
  )
}

export default Logout