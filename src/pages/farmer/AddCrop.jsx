import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Leaf, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useGlobalState } from "@/context/GlobalState";
// import { Crop } from "@/lib/mockData";
import { useAuth } from "@/context/AuthContext";

export default function AddCrop() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const { addCrop } = useGlobalState();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    // Form state
    const [cropName, setCropName] = useState("");
    const [variety, setVariety] = useState("");
    const [quality, setQuality] = useState("A");
    const [quantity, setQuantity] = useState("");
    const [unit, setUnit] = useState("quintal");
    const [floorPrice, setFloorPrice] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        setTimeout(() => {
            addCrop({
                name: cropName,
                variety,
                quality,
                quantity: Number(quantity),
                unit,
                floorPrice: Number(floorPrice),
                harvestDate: new Date().toISOString(),
                location: "Karnal", // Mock location
                state: "Haryana", // Mock state
                farmerName: user?.name || "Farmer",
                imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400", // Placeholder
                auctionEndsAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days from now
            });

            setLoading(false);
            toast({
                title: "Crop Listed Successfully",
                description: "Your crop has been added to the marketplace.",
            });
            navigate("/farmer/dashboard");
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container px-4 py-8">
                <div className="mb-8 max-w-2xl mx-auto">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                            <Leaf className="h-5 w-5 text-primary-foreground" />
                        </div>
                        <h1 className="font-serif text-3xl font-bold text-foreground">List New Crop</h1>
                    </div>
                    <p className="text-muted-foreground">
                        Fill in the details below to list your products on the marketplace.
                    </p>
                </div>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Crop Details</CardTitle>
                        <CardDescription>Provide accurate information to attract better bids</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="cropName">Crop Name</Label>
                                <Select required value={cropName} onValueChange={setCropName}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select crop" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Wheat">Wheat</SelectItem>
                                        <SelectItem value="Rice">Rice</SelectItem>
                                        <SelectItem value="Corn">Corn</SelectItem>
                                        <SelectItem value="Potato">Potato</SelectItem>
                                        <SelectItem value="Tomato">Tomato</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="variety">Variety</Label>
                                    <Input
                                        id="variety"
                                        placeholder="e.g. Basmati, Sharbati"
                                        required
                                        value={variety}
                                        onChange={(e) => setVariety(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="quality">Quality Grade</Label>
                                    <Select required value={quality} onValueChange={(val) => setQuality(val)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select grade" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A">Grade A (Premium)</SelectItem>
                                            <SelectItem value="B">Grade B (Standard)</SelectItem>
                                            <SelectItem value="C">Grade C (Fair)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Quantity</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        placeholder="Enter amount"
                                        required
                                        value={quantity}
                                        onChange={(e) => setQuantity(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="unit">Unit</Label>
                                    <Select required value={unit} onValueChange={setUnit}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select unit" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="quintal">Quintal</SelectItem>
                                            <SelectItem value="kg">Kg</SelectItem>
                                            <SelectItem value="ton">Ton</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="price">Floor Price (₹ per unit)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Minimum price you accept"
                                    required
                                    value={floorPrice}
                                    onChange={(e) => setFloorPrice(e.target.value)}
                                />
                                <p className="text-xs text-muted-foreground">Bidding will start from this price.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Crop Images</Label>
                                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-accent/50 transition-colors">
                                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground">JPG, PNG up to 10MB</p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Additional Notes</Label>
                                <Textarea id="description" placeholder="Describe your crop condition, harvest date, location details etc." />
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button type="button" variant="outline" className="flex-1" onClick={() => navigate(-1)}>Cancel</Button>
                                <Button type="submit" className="flex-1" disabled={loading}>
                                    {loading ? "Listing..." : "List Crop"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </main>
            <Footer />
        </div>
    );
}
