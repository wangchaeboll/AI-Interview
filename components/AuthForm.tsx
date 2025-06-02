"use client";

import { z } from "zod"
import Link from "next/link";
import Image from "next/image"
import {toast} from "sonner";
import {auth} from "@/firebase/client";
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod"

import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from "firebase/auth";

import { Form } from "@/components/ui/form"
import { Button } from "@/components/ui/button"

import { signIn, signUp } from "@/lib/actions/auth.action";
import FormField from "@/components/FormField";


import React from 'react'

const authFormSchema = (type : FormType) => {
    return z.object({
        name: type === 'sign-up' ? z.string().min(3) : z.string().optional(),
        email: z.string().email(),
        password: z.string().min(3)
    })
}


const AuthForm = ({ type }:{ type: FormType }) => {
    const router = useRouter();

    const formSchema = authFormSchema(type);
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password:""
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        // const auth = getAuth();
        try {
            if (type === 'sign-up') {
                // -------------------------------------------------------------------------------
                const { email, name, password } = values;

                const userCredentials = await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                )

                const result = await signUp({
                    uid: userCredentials.user.uid,
                    name: name!,
                    email,
                    password
                })

                if(!result?.success) { toast.error(result.message); return}

                // -------------------------------------------------------------------------------

                toast.success("Account created  successfully!");
                router.push('/sign-in');

            }else {

                // -------------------------------------------------------------------------------

                const { email, password } = values;

                const userCredentials = await signInWithEmailAndPassword(
                    auth,
                    email,
                    password
                )

                const idToken = await userCredentials.user.getIdToken()

                if(!idToken) {
                    toast.error("Sign in failed"); return
                }

                await signIn({ email, idToken })

                // -------------------------------------------------------------------------------

                toast.success("Signed In successfully!");
                router.push('/');
            }
        }catch (e) {
            console.log(e)
            toast.error(`There was an error: ${e}`);
        }
    }

    const isSignIn = type === "sign-in"

    return (
        <div className='card-border lg:min-w-[566px] '>
            <div className="flex flex-col gap-6 card py-14 px-10">
                <div className="flex flex-grow gap-2 justify-center">
                    <Image src='/logo.svg' alt='logo' height={32} width={38}/>
                    <h2 className="text-primary-100">PrepWise</h2>
                </div>
                <h3>Practice job interview with AI</h3>

                 <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full mt-4 form">
                    {!isSignIn && (
                        <FormField control={form.control} name='name' label='Name' placeholder='Your Name'/>
                    )}
                    <FormField control={form.control} name='email' label='Email' placeholder='Your Email address' type='email'/>
                    <FormField control={form.control} name='password' label='Password' placeholder='Enter your Password' type='password'/>
                    <Button type="submit" className='btn'>{isSignIn ? "Sign In" : "Create an Account"}</Button>
                </form>
            </Form>
                <p className="text-center">
                    {isSignIn ? 'No account yet?' : 'Have an account alraedy?'}
                    <Link href={!isSignIn ? '/sign-in' : '/sign-up'} className='font-bold text-user-primary ml-1'>{!isSignIn ? "Sign In" : "Sign Up"}</Link>
                </p>
        </div>
        </div>
    )
}
export default AuthForm
