import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { Amplify } from 'aws-amplify';
import { fetchUserAttributes, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { withAuthenticator, Button, Heading } from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import baseAxios from "./config/AxiosConfig";
import MyDevice from "./app/myDevice";
import MySensor from "./app/mySensor";
Amplify.configure(awsconfig);
function App({ signOut }) {

    const [jwtToken, setJwtToken] = useState('');
    const [userName, setUserName] = useState('');
    const [updateState, setUpdateState] = useState(true);
    const updateSignal = () => {
        setUpdateState(!updateState)
    }



    useEffect(() => {
        getCurrentUser().then(
            (user) => setUserName(user.username),
            () => setUserName('err')
        )

        fetchJWT().then(
            () => console.log("Got JWT"),
            () => console.log("Err?")
        );
    }, []);


    const fetchJWT = async () => {
        try {
            const { idToken } = (await fetchAuthSession()).tokens ?? {};
            console.log(`idToken=${idToken}`)
            setJwtToken(idToken);
        } catch (error) { // 로그인 안 되어있는 상태
            console.log(error);
            //TODO 로그인 페이지로 리다이렉팅
        }

        // baseAxios.interceptors.request.use(
        //     (config) => {
        //         config.headers.Authorization = `Bearer ${jwtToken}`;
        //         return config;
        //     },
        //     (error) => {
        //         console.error('Interceptor Error:', error);
        //         return Promise.reject(error);
        //     }
        // );
    };



    return (
      <div>
        <h1>Logged in as: {userName}</h1>
        <h2>!!WA!!</h2>
        <button onClick={signOut}>Sign out</button>
          <hr/>
          <MyDevice jwtToken={jwtToken} updateState={updateState} updateSignal={updateSignal}/>
          <MySensor jwtToken={jwtToken} updateState={updateState} updateSignal={updateSignal} />
      </div>
  );
}
export default withAuthenticator(App);