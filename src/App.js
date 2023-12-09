import React, {useEffect, useState} from 'react';
import './App.css';
import {Amplify} from 'aws-amplify';
import {fetchAuthSession, getCurrentUser} from 'aws-amplify/auth';
import {withAuthenticator} from '@aws-amplify/ui-react';
import awsconfig from './aws-exports';
import MyDevice from "./app/MyDevice";
import MySensor from "./app/MySensor";
import AddThings from "./app/AddThings";
import MyAutoRules from "./app/MyAutoRules";

Amplify.configure(awsconfig);

function App({signOut}) {

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
            const {idToken} = (await fetchAuthSession()).tokens ?? {};
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
            <MySensor jwtToken={jwtToken} updateState={updateState} updateSignal={updateSignal}/>
            <MyAutoRules jwtToken={jwtToken} updateState={updateState} updateSignal={updateSignal}/>
            <AddThings jwtToken={jwtToken} updateState={updateState} updateSignal={updateSignal}/>
        </div>
    );
}

export default withAuthenticator(App);