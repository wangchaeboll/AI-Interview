"use server";

import {db, auth} from "@/firebase/admin";
import {cookies} from "next/headers";

const oneWeek = 60*60*24*7*1000

export async function signUp(params: SignUpParams){
    const { uid , name, email, } = params;
    
    try {
        // check if user exists in db
        const userRecord = await db.collection("users").doc(uid).get();
        if (userRecord.exists)
            return {
                success: false,
                message: 'User already exists, please sign in instead'
            }


        await db.collection('users').doc(uid).set({
            name,
            email
        });

        return {
            success: true,
            message: 'Account created successfully, please sign in'
        }
    } catch(e:any) {
        console.error('Error creating a user' , e)

        if(e.code === 'auth/email-already-exists')
            return {
                success: false,
                message: "This email is already in use",
            };

        return {
            success: false,
            message: "Failed to create account. Please try again.",
        };
    }
}

export async function signIn(params: SignInParams){
    const {email, idToken} = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if(!userRecord)
            return {
                success: false,
                message: 'User doesnt not exist, create an account instead.',
            }


        await setSessionCookies(idToken)
    } catch(e){
        console.error(e);

        return {
            success: false,
            message: 'Failed to log into an account'
        }
    }
}

export async function setSessionCookies(idToken : string ){
    const cookieStore = await cookies()

    const sessionCookies = await auth.createSessionCookie(idToken , {
        expiresIn: oneWeek,

    })

    cookieStore.set('session', sessionCookies, {
        maxAge: oneWeek,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser():Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if(!sessionCookie) return null;

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);

        // get user info from db
        const userRecord = await db
            .collection("users")
            .doc(decodedClaims.uid)
            .get();
        if (!userRecord.exists) return null;


        return {
            ...userRecord.data(),
            id:userRecord.id,
        } as User;
    }catch (e) {
        console.error(e);
        return null;
    }
}

export async function isAuthenticated(){
    const user = await getCurrentUser();

    return !!user;
}