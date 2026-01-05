import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { motion, AnimatePresence } from "framer-motion";

const roles = [
    { id: 'farmer', label: 'Farmer' },
    { id: 'buyer', label: 'Buyer' },
    { id: 'logistics', label: 'Logistics' },
    { id: 'storage', label: 'Storage' }
];

const Login = () => {
    const [activeRole, setActiveRole] = useState('farmer');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Please fill in all fields");
            return;
        }

        setIsLoading(true);
        try {
            const user = await login(email, password);

            // Redirect based on the user's actual role from database
            switch (user.role) {
                case 'farmer':
                    navigate('/farmer/dashboard');
                    break;
                case 'buyer':
                    navigate('/buyer/marketplace');
                    break;
                case 'logistics':
                    navigate('/logistics');
                    break;
                case 'storage':
                    navigate('/storage');
                    break;
                default:
                    navigate('/');
            }
        } catch (error) {
            // Error is handled in AuthContext but we catch it here to stop loading state
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Welcome back to KisanBazaar
                    </p>
                </div>

                <Tabs defaultValue="farmer" value={activeRole} onValueChange={setActiveRole} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 p-1">
                        {roles.map((role) => (
                            <TabsTrigger
                                key={role.id}
                                value={role.id}
                                className="relative z-0 data-[state=active]:bg-transparent data-[state=active]:shadow-none transition-none"
                            >
                                {activeRole === role.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 z-[-1] bg-white rounded-sm shadow-sm"
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{role.label}</span>
                            </TabsTrigger>
                        ))}
                    </TabsList>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeRole}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Card className="mt-4">
                                <CardHeader>
                                    <CardTitle>Login as {roles.find(r => r.id === activeRole)?.label}</CardTitle>
                                    <CardDescription>
                                        Enter your credentials to access your dashboard.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email or Phone</Label>
                                            <Input
                                                id="email"
                                                type="text"
                                                placeholder="name@gmail.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Signing in..." : "Sign In"}
                                        </Button>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <p className="text-sm text-gray-600">
                                        Don't have an account?{" "}
                                        <Link to="/register" className="font-semibold text-primary hover:text-primary/80">
                                            Register
                                        </Link>
                                    </p>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </AnimatePresence>
                </Tabs>
            </div>
        </div>
    );
};

export default Login;
