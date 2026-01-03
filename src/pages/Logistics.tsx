import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useGlobalState } from "@/context/GlobalState";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Truck, MapPin, Calendar, CheckCircle, Package, Clock, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function Logistics() {
    const { toast } = useToast();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { confirmLogistics, crops } = useGlobalState();

    const cropId = searchParams.get("cropId");
    const selectedCrop = crops.find(c => c.id === cropId);

    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [trackingId, setTrackingId] = useState("");
    const [trackingStatus, setTrackingStatus] = useState<any>(null);

    // Auto-search if coming from crop accept
    useEffect(() => {
        if (cropId) {
            handleSearch();
        }
    }, [cropId]);

    const handleSearch = () => {
        setIsSearching(true);
        setSearchResults([]);

        // Simulate API search
        setTimeout(() => {
            setSearchResults([
                { id: 1, provider: "FastTrack Logistics", vehicle: "Tata Ace (Small)", capacity: "1 Ton", price: 1200, eta: "2 hours" },
                { id: 2, provider: "AgriMovers", vehicle: "Eicher Pro (Medium)", capacity: "3.5 Tons", price: 3500, eta: "4 hours" },
                { id: 3, provider: "Reliable Transports", vehicle: "Ashok Leyland (Large)", capacity: "10 Tons", price: 8000, eta: "Next Day" },
            ]);
            setIsSearching(false);
        }, 1500);
    };

    const handleBook = (id: number) => {
        if (cropId) {
            confirmLogistics(cropId);
            toast({
                title: "Logistics Arranged",
                description: `Transport booked for ${selectedCrop?.name}. Order moved to payment pending.`,
            });
            navigate("/farmer/dashboard");
        } else {
            toast({
                title: "Booking Confirmed",
                description: `Truck booking #${id} has been confirmed. Driver details sent via SMS.`,
            });
        }
    };

    const handleTrack = () => {
        if (!trackingId) return;

        // Simulate tracking lookup
        setTrackingStatus({
            id: trackingId,
            status: "In Transit",
            location: "Pune Highway, MH",
            eta: "Today, 6:00 PM",
            lastUpdate: "30 mins ago"
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <div className="mb-8 space-y-2">
                    <div className="flex items-center gap-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Truck className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">Logistics Services</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Reliable transportation for your agricultural produce
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Booking Card */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Book a Truck {selectedCrop && `- for ${selectedCrop.name}`}</CardTitle>
                            <CardDescription>Find available trucks nearby</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Pickup Location</label>
                                    <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <input type="text" placeholder="Enter pickup address" className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Date</label>
                                    <div className="flex items-center gap-2 rounded-md border border-input px-3 py-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <input type="date" className="flex-1 bg-transparent outline-none text-foreground" />
                                    </div>
                                </div>
                            </div>

                            <Button className="w-full md:w-auto" onClick={handleSearch} disabled={isSearching}>
                                {isSearching ? "Searching..." : "Search Trucks"}
                            </Button>

                            {/* Search Results */}
                            {searchResults.length > 0 && (
                                <div className="mt-6 space-y-4">
                                    <h3 className="font-medium text-sm text-muted-foreground">Available Vehicles</h3>
                                    {searchResults.map((truck) => (
                                        <div key={truck.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/10 transition-colors gap-4">
                                            <div className="flex w-full sm:w-auto items-center gap-4">
                                                <div className="h-12 w-12 rounded bg-muted flex items-center justify-center shrink-0">
                                                    <Truck className="h-6 w-6 text-muted-foreground" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold">{truck.vehicle}</p>
                                                    <p className="text-sm text-muted-foreground">{truck.provider} • Limit: {truck.capacity}</p>
                                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
                                                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> ETA: {truck.eta}</span>
                                                        <span className="flex items-center gap-1"><ShieldCheck className="h-3 w-3" /> Insured</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="text-right w-full sm:w-auto flex items-center justify-between sm:block">
                                                <p className="text-lg font-bold text-primary">₹{truck.price}</p>
                                                <Button size="sm" className="mt-0 sm:mt-1 w-auto sm:w-full" onClick={() => handleBook(truck.id)}>Book Now</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Sidebar Track + Why Choose Us */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Track Shipment</CardTitle>
                                <CardDescription>Real-time tracking for your goods</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <Input
                                        type="text"
                                        placeholder="Enter tracking ID (e.g., TRK123)"
                                        value={trackingId}
                                        onChange={(e) => setTrackingId(e.target.value)}
                                    />
                                    <Button variant="outline" className="w-full" onClick={handleTrack}>Track</Button>

                                    {trackingStatus && (
                                        <div className="mt-2 rounded-lg bg-muted p-4 space-y-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-semibold text-sm">Status</p>
                                                    <Badge variant="secondary" className="mt-1 bg-blue-100 text-blue-700 hover:bg-blue-100">{trackingStatus.status}</Badge>
                                                </div>
                                                <Package className="h-8 w-8 text-muted-foreground opacity-20" />
                                            </div>
                                            <div className="space-y-1 text-sm">
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Location:</span>
                                                    <span className="font-medium">{trackingStatus.location}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-muted-foreground">Est. Delivery:</span>
                                                    <span className="font-medium">{trackingStatus.eta}</span>
                                                </div>
                                            </div>
                                            <p className="text-xs text-center text-muted-foreground pt-2 border-t border-muted-foreground/10">
                                                Last updated: {trackingStatus.lastUpdate}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Why Choose Us?</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium">Verified Drivers</h4>
                                        <p className="text-sm text-muted-foreground">All our partners are verified and background checked.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium">Best Rates</h4>
                                        <p className="text-sm text-muted-foreground">Competitive pricing with no hidden charges.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                                    <div>
                                        <h4 className="font-medium">On-Time Delivery</h4>
                                        <p className="text-sm text-muted-foreground">We prioritize punctuality to ensure freshness.</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
