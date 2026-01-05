import { useParams, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useGlobalState } from "@/context/GlobalState";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, MapPin, Gavel, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function CropDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { crops, bids, acceptBid } = useGlobalState();
    const { user } = useAuth();

    const crop = crops.find(c => c.id === id);
    const cropBids = bids.filter(b => b.cropId === id);

    if (!crop) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="container py-8 text-center">
                    <h2 className="text-2xl font-bold">Crop not found</h2>
                    <Button onClick={() => navigate("/farmer/dashboard")} className="mt-4">Back to Dashboard</Button>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <main className="container py-8">
                <Button variant="ghost" className="mb-6 gap-2" onClick={() => navigate(-1)}>
                    <ArrowLeft className="h-4 w-4" /> Back
                </Button>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-xl border bg-card text-card-foreground shadow overflow-hidden">
                            <div className="h-64 w-full bg-muted">
                                <img src={crop.imageUrl} alt={crop.name} className="h-full w-full object-cover" />
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="text-3xl font-serif font-bold">{crop.name}</h1>
                                        <p className="text-muted-foreground">{crop.variety} • {crop.quantity} {crop.unit}</p>
                                    </div>
                                    <Badge variant="outline" className="text-lg px-3 py-1">Grade {crop.quality}</Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Auction Ends</p>
                                            <p className="text-sm text-muted-foreground">{formatDistanceToNow(new Date(crop.auctionEndsAt), { addSuffix: true })}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">Location</p>
                                            <p className="text-sm text-muted-foreground">{crop.location}, {crop.state}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle>Received Bids ({cropBids.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {cropBids.length === 0 ? (
                                        <p className="text-center text-muted-foreground py-8">No bids received yet.</p>
                                    ) : (
                                        cropBids.map(bid => (
                                            <div key={bid.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                                                        <User className="h-5 w-5 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{bid.buyerName}</p>
                                                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(bid.timestamp), { addSuffix: true })}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold flex items-center gap-1 justify-end">
                                                        ₹{bid.amount.toLocaleString()}
                                                    </div>
                                                    {bid.status === "active" && <Badge className="mt-1">Highest Bid</Badge>}
                                                    {user?.role === 'farmer' && bid.status === "active" && crop.status === "live" && (
                                                        <Button
                                                            size="sm"
                                                            className="ml-4"
                                                            onClick={() => {
                                                                acceptBid(crop.id, bid.id);
                                                                navigate(`/logistics?cropId=${crop.id}`);
                                                            }}
                                                        >
                                                            Accept Offer
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Price Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Floor Price</span>
                                    <span className="font-semibold">₹{crop.floorPrice.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-medium">Current Bid</span>
                                    <span className="font-bold text-primary">₹{crop.currentBid.toLocaleString()}</span>
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
