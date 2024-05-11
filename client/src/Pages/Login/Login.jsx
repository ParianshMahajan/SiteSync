import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { motion } from "framer-motion";

import styles from "./Login.module.css";
import ccsLogo from "../../Assets/CCS_logo.png";
import Particles from "../../Layouts/ParticleBackground/Particles";
import config from "../../config";

const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookies, removeCookies] = useCookies();
  const [loader, setLoader] = useState(false);

  
  const CheckUrl=config.apiUrl+'/verify';
  useEffect(() => {
    let token = cookies.AdminLoggedIn ;
    
      const isSuperAdmin = async () => {
          const res = await axios.post(CheckUrl, {
            token: token,
          });
          if(res.data.status==true){
            navigate('/dashboard');
          }
      };

      if (token != "") {
        isSuperAdmin();
      }


    }, []);



    const createCookie = (name, value, days) => {
      const expires = new Date();
      expires.setDate(expires.getDate() + days);
    
      const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
      document.cookie = cookieString;
    };




  // SUBMIT
  const [showErr, setShowErr] = useState(false);  
  const [data, setData] = useState({
    UserName: "",
    Password: "",
  });


  const url = config.apiUrl + "/";
  const submit = (e) => {
    e.preventDefault();
    setLoader(true);
    axios.post(url, data).then((res) => {

      let data = res.data;
      setLoader(false);
      if (data.status === true) {
        createCookie("AdminLoggedIn", data.token, 7);
        navigate('/dashboard');
      } 
      else {
        setShowErr(true);
        setTimeout(()=>{
          setShowErr(false);
        },3000)
      }
    });
  };







  

  function handle(e) {
    const newdata = { ...data };
    newdata[e.target.id] = e.target.value;
    setData(newdata);
  }

  return (
    <>
    <Particles/>
    <div 
      className={styles.loginContainer}
      onClick={(e) => e.stopPropagation()}
    >
      <div className={styles.leftSide} style={{zIndex:"2000"}}>
        <img className={styles.logo} src={ccsLogo} alt="Logo" />
        <div className={styles.titleRecSys}>
          AUTO-DEPLOYER
          <br />
          SYSTEM
        </div>
      </div>
      <div className={styles.rightSide} style={{zIndex:"2000"}}>
        <div className={styles.rightTop}>
          <div className={styles.welcomeText}>Admin Login</div>
          <div className={styles.inputContainer}>
            

              
              <form onSubmit={(e) => submit(e)}>
              <input
                type="UserName"
                className={styles.passwordInput}
                placeholder="Username"
                id="UserName"
                value={data.UserName}
                name="UserName"
                required={true}
                onChange={(e) => handle(e)}
                />
              <input
                type="password"
                className={styles.passwordInput}
                placeholder="PASSWORD"
                id="Password"
                value={data.Password}
                name="Password"
                required={true}
                onChange={(e) => handle(e)}
              />
              <button className={styles.signinButton}>
                {loader && <span className={styles.loader}></span>}
                {!loader && <div>&#62;</div>}
              </button>
            </form>
            

          </div>

          {showErr && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.3 }}
              className={styles.err}
            >
              <h3>Incorrect Credentials !</h3>
            </motion.div>
          )}

        </div>
      </div>
    </div>
    </>
  );
};

export default Login;
