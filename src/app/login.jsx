import React from 'react';
import { LoginPage, useAuth } from '../state/DoneeProvider';
export default function Login() { const {sessionError}=useAuth(); return <LoginPage mode="Login" initialError={sessionError}/>; }
