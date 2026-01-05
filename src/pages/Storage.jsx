import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Warehouse, MapPin, Thermometer, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Storage() {
    const { toast } = useToast();
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const handleSearch = () => {
        setIsSearching(true);
        setSearchResults([]);

        setTimeout(() => {
            setSearchResults([
                { id: 1, name: "City Cold Storage", location: "Mumbai, MH", type: "Cold Storage", price: "₹200/qt/mo" },
                { id: 2, name: "Rural Grain Silos", location: "Nashik, MH", type: "Grain Silo", price: "₹80/qt/mo" },
                { id: 3, name: "SafeKeep Dry Warehouse", location: "Pune, MH", type: "Dry Storage", price: "₹120/qt/mo" },
            ]);
            setIsSearching(false);
        }, 1500);
    };

    const handleBook = (name) => {
        toast({
            title: "Storage Request Sent",
            description: `A booking request for ${name} has been sent. The facility manager will contact you shortly.`,
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Warehouse className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Storage Solutions</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Secure and climate-controlled storage for your harvest
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Find Storage</CardTitle>
                            <CardDescription>Locate warehouses near you</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Location</label>
                                    <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <input type="text" placeholder="Enter city or zip code" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Storage Type</label>
                                    <select className="w-full rounded-md border border-input bg-background px-3 py-2">
                                        <option>Cold Storage</option>
                                        <option>Dry Storage</option>
                                        <option>Grain Silo</option>
                                    </select>
                                </div>
                                <Button className="w-full" onClick={handleSearch} disabled={isSearching}>
                                    {isSearching ? "Searching..." : "Search Warehouses"}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Available Facilities</CardTitle>
                            <CardDescription>Featured storage partners</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {searchResults.length > 0 ? (
                                    searchResults.map((facility) => (
                                        <div key={facility.id} className="flex flex-col gap-4 rounded-lg border p-4 bg-card hover:bg-accent/10 transition-colors">
                                            <div className="flex gap-4">
                                                <div className="h-16 w-16 rounded-md bg-muted flex items-center justify-center shrink-0">
                                                    <Warehouse className="h-8 w-8 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-semibold">{facility.name}</h4>
                                                    <p className="text-sm text-muted-foreground">{facility.location}</p>
                                                    <p className="text-sm font-medium text-primary mt-1">{facility.price}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 text-xs">
                                                <div className="flex items-center text-blue-600 bg-blue-50 px-2 py-1 rounded">
                                                    <Thermometer className="mr-1 h-3 w-3" />
                                                    {facility.type}
                                                </div>
                                                <div className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded">
                                                    <ShieldCheck className="mr-1 h-3 w-3" />
                                                    Verified
                                                </div>
                                            </div>
                                            <Button size="sm" variant="outline" className="w-full mt-auto" onClick={() => handleBook(facility.name)}>
                                                Request Quote
                                            </Button>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-12 text-center text-muted-foreground">
                                        <Warehouse className="mx-auto h-12 w-12 text-muted-foreground/30 mb-3" />
                                        <p>No storage facilities found. Try searching for a location.</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
            <Footer />
        </div>
    );
}
