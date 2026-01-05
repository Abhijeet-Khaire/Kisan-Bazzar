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

const Register = () => {
    const [activeRole, setActiveRole] = useState('farmer');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        companyName: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            await register(formData, activeRole);

            // Redirect based on role
            switch (activeRole) {
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
            // Error is handled in AuthContext
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Create an account</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Join KisanBazaar as a {activeRole}
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
                                    <CardTitle>Register as {roles.find(r => r.id === activeRole)?.label}</CardTitle>
                                    <CardDescription>
                                        Fill in your details to create a new account.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleRegister} className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name</Label>
                                            <Input
                                                id="name"
                                                name="name"
                                                type="text"
                                                placeholder="John Doe"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>

                                        {(activeRole === 'logistics' || activeRole === 'storage') && (
                                            <div className="space-y-2">
                                                <Label htmlFor="companyName">Company Name</Label>
                                                <Input
                                                    id="companyName"
                                                    name="companyName"
                                                    type="text"
                                                    placeholder="Your Company Pvt Ltd"
                                                    value={formData.companyName}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                        )}

                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email or Phone</Label>
                                            <Input
                                                id="email"
                                                name="email"
                                                type="text"
                                                placeholder="name@example.com"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="password">Password</Label>
                                            <Input
                                                id="password"
                                                name="password"
                                                type="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirmPassword">Confirm Password</Label>
                                            <Input
                                                id="confirmPassword"
                                                name="confirmPassword"
                                                type="password"
                                                value={formData.confirmPassword}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full" disabled={isLoading}>
                                            {isLoading ? "Creating Account..." : "Register"}
                                        </Button>
                                    </form>
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <p className="text-sm text-gray-600">
                                        Already have an account?{" "}
                                        <Link to="/login" className="font-semibold text-primary hover:text-primary/80">
                                            Sign In
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

export default Register;
