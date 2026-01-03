import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const data = [
    { name: 'Mon', price: 2100 },
    { name: 'Tue', price: 2150 },
    { name: 'Wed', price: 2200 },
    { name: 'Thu', price: 2180 },
    { name: 'Fri', price: 2250 },
    { name: 'Sat', price: 2300 },
    { name: 'Sun', price: 2400 },
];

export default function PriceAnalytics() {
    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <TrendingUp className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Price Analytics</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Track market trends and analyze price movements for your crops
                    </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Market Trends</CardTitle>
                                    <CardDescription>Average market price over the last 7 days</CardDescription>
                                </div>
                                <Select defaultValue="wheat">
                                    <SelectTrigger className="w-[180px]">
                                        <SelectValue placeholder="Select crop" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="wheat">Wheat</SelectItem>
                                        <SelectItem value="rice">Rice</SelectItem>
                                        <SelectItem value="corn">Corn</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[300px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={data}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="price" stroke="#16a34a" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Market Sentinel</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold">₹2,400</span>
                                    <span className="text-sm text-green-600 flex items-center">
                                        <ArrowUpRight className="h-4 w-4" /> +12%
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">Current avg. price per quintal</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">Demand Index</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-bold">High</span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">85% active buyers looking for Wheat</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
