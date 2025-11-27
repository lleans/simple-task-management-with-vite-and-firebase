import {
    Tabs,
    TabsContent,
    TabsContents,
    TabsList,
    TabsTrigger,
} from '@/components/animate-ui/components/animate/tabs';
import { Alert } from '@/components/ui/alert';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { TypographyH1 } from '@/components/ui/typography/heading1';
import { TypographyMuted } from '@/components/ui/typography/muted';
import { zodResolver } from '@hookform/resolvers/zod';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { Button } from '../components/animate-ui/components/buttons/button';
import { auth } from '../lib/firebase';

const authSchema = z.object({
    email: z.string().email({ message: 'Invalid email' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type AuthForm = z.infer<typeof authSchema>;

function Auth() {
    const [tab, setTab] = useState<'login' | 'register'>('login');
    const [error, setError] = useState<string | null>(null);

    // Separate forms for login and register to avoid field name collisions in the DOM
    const loginForm = useForm<AuthForm>({ resolver: zodResolver(authSchema) });
    const registerForm = useForm<AuthForm>({ resolver: zodResolver(authSchema) });

    const onLogin = async (data: AuthForm) => {
        try {
            await signInWithEmailAndPassword(auth, data.email, data.password);
            setError(null);
        } catch (err) {
            setError(`Login failed: ${(err as Error).message}`);
        }
        finally {
            loginForm.reset();
        }
    };

    const onRegister = async (data: AuthForm) => {
        try {
            await createUserWithEmailAndPassword(auth, data.email, data.password);
            setError(null);
        } catch (err) {
            setError(`Registration failed: ${(err as Error).message}`);
        }
        finally {
            registerForm.reset();
        }
    };

    const handleTabChange = (value: string) => {
        setTab(value as 'login' | 'register');
        setError(null);
        loginForm.reset();
        registerForm.reset();
    };

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="flex w-full max-w-md flex-col gap-6">
                <TypographyH1>Welcome to Task Manager</TypographyH1>
                <TypographyMuted>First authenticate yourself.</TypographyMuted>
                <Tabs value={tab} onValueChange={handleTabChange}>
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>
                    <Card className="shadow-none py-0" about='login'>
                        <TabsContents className="py-6">
                            <TabsContent value="login">
                                <form onSubmit={loginForm.handleSubmit(onLogin)} className="flex flex-col gap-6">
                                    <CardHeader>
                                        <CardTitle>Login</CardTitle>
                                        <CardDescription>
                                            Enter your email and password to login.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="login-email">Email</Label>
                                            <Input id="login-email" {...loginForm.register('email')} placeholder="Email" />
                                            {loginForm.formState.errors.email && <p className="text-red-500">{loginForm.formState.errors.email.message}</p>}
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="login-password">Password</Label>
                                            <Input id="login-password" type="password" {...loginForm.register('password')} placeholder="Password" />
                                            {loginForm.formState.errors.password && <p className="text-red-500">{loginForm.formState.errors.password.message}</p>}
                                        </div>
                                        {error && tab === 'login' && <Alert variant="destructive">{error}</Alert>}
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        <Button disabled={loginForm.formState.isSubmitting} type="submit">Login</Button>
                                        <p className="text-center text-sm">Don't have an account? <Link to="#" className='underline' onClick={() => handleTabChange("register")}>Register</Link></p>
                                    </CardFooter>
                                </form>
                            </TabsContent>
                            <TabsContent value="register">
                                <form onSubmit={registerForm.handleSubmit(onRegister)} className="flex flex-col gap-6">
                                    <CardHeader>
                                        <CardTitle>Register</CardTitle>
                                        <CardDescription>
                                            Create a new account with your email and password.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="grid gap-6">
                                        <div className="grid gap-3">
                                            <Label htmlFor="register-email">Email</Label>
                                            <Input id="register-email" {...registerForm.register('email')} placeholder="Email" />
                                            {registerForm.formState.errors.email && <p className="text-red-500">{registerForm.formState.errors.email.message}</p>}
                                        </div>
                                        <div className="grid gap-3">
                                            <Label htmlFor="register-password">Password</Label>
                                            <Input id="register-password" type="password" {...registerForm.register('password')} placeholder="Password" />
                                            {registerForm.formState.errors.password && <p className="text-red-500">{registerForm.formState.errors.password.message}</p>}
                                        </div>
                                        {error && tab === 'register' && <Alert variant="destructive">{error}</Alert>}
                                    </CardContent>
                                    <CardFooter className="flex flex-col gap-2">
                                        <Button disabled={registerForm.formState.isSubmitting} type="submit">Register</Button>
                                        <p className="text-center text-sm">Already have an account? <Link to="#" className='underline' onClick={() => handleTabChange("login")}>Login</Link></p>
                                    </CardFooter>
                                </form>
                            </TabsContent>
                        </TabsContents>
                    </Card>
                </Tabs>
            </div>
        </div>
    );
}

export default Auth;
