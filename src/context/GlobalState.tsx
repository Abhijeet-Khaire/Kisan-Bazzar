import React, { createContext, useContext, useState, ReactNode } from "react";
import { mockCrops, mockBids, mockFarmerStats, Crop, Bid, FarmerStats } from "@/lib/mockData";

interface GlobalStateContextType {
    crops: Crop[];
    bids: Bid[];
    farmerStats: FarmerStats;
    addCrop: (crop: Omit<Crop, "id" | "currentBid" | "totalBids" | "status" | "farmerId">) => void;
    placeBid: (cropId: string, amount: number, buyerName: string) => void;
    extendAuction: (cropId: string, days: number) => void;
    cancelListing: (cropId: string) => void;
    acceptBid: (cropId: string, bidId: string) => void;
    confirmLogistics: (cropId: string) => void;
    confirmPayment: (cropId: string) => void;
}

const GlobalStateContext = createContext<GlobalStateContextType | undefined>(undefined);

export const GlobalStateProvider = ({ children }: { children: ReactNode }) => {
    const [crops, setCrops] = useState<Crop[]>(mockCrops);
    const [bids, setBids] = useState<Bid[]>(mockBids);
    const [farmerStats, setFarmerStats] = useState<FarmerStats>(mockFarmerStats);

    const addCrop = (newCropData: Omit<Crop, "id" | "currentBid" | "totalBids" | "status" | "farmerId">) => {
        const newCrop: Crop = {
            ...newCropData,
            id: Math.random().toString(36).substr(2, 9),
            currentBid: newCropData.floorPrice,
            totalBids: 0,
            status: "live",
            farmerId: "F001", // Simulating current user is always F001
        };
        setCrops((prev) => [newCrop, ...prev]);
        setFarmerStats((prev) => ({
            ...prev,
            totalListings: prev.totalListings + 1,
        }));
    };

    const placeBid = (cropId: string, amount: number, buyerName: string) => {
        const newBid: Bid = {
            id: Math.random().toString(36).substr(2, 9),
            cropId,
            buyerId: "BU_CURRENT",
            buyerName,
            amount,
            timestamp: new Date().toISOString(),
            status: "active",
        };

        setBids((prev) => [newBid, ...prev]);

        // Update crop current bid
        setCrops((prev) => prev.map(crop => {
            if (crop.id === cropId) {
                return {
                    ...crop,
                    currentBid: amount > crop.currentBid ? amount : crop.currentBid,
                    totalBids: crop.totalBids + 1
                };
            }
            return crop;
        }));
    };

    const extendAuction = (cropId: string, days: number) => {
        setCrops((prev) => prev.map(crop => {
            if (crop.id === cropId) {
                const currentEnd = new Date(crop.auctionEndsAt);
                const newEnd = new Date(currentEnd.setDate(currentEnd.getDate() + days));
                return { ...crop, auctionEndsAt: newEnd.toISOString() };
            }
            return crop;
        }));
    };

    const cancelListing = (cropId: string) => {
        setCrops((prev) => prev.filter(crop => crop.id !== cropId));
        setFarmerStats((prev) => ({
            ...prev,
            totalListings: prev.totalListings - 1
        }));
    };

    const acceptBid = (cropId: string, bidId: string) => {
        // Mark bid as won
        setBids(prev => prev.map(bid =>
            bid.id === bidId ? { ...bid, status: "won" as "won" } : bid
        ));

        // Update crop status
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "logistics_pending" as "logistics_pending" } : crop
        ));
    };

    const confirmLogistics = (cropId: string) => {
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "payment_pending" as "payment_pending" } : crop
        ));
    };

    const confirmPayment = (cropId: string) => {
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "completed" as "completed" } : crop
        ));

        // Add earnings (simulated based on current bid)
        const crop = crops.find(c => c.id === cropId);
        if (crop) {
            setFarmerStats(prev => ({
                ...prev,
                completedSales: prev.completedSales + 1,
                totalEarnings: prev.totalEarnings + (crop.currentBid * crop.quantity)
            }));
        }
    };

    return (
        <GlobalStateContext.Provider value={{
            crops, bids, farmerStats,
            addCrop, placeBid, extendAuction, cancelListing,
            acceptBid, confirmLogistics, confirmPayment
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
};

export const useGlobalState = () => {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error("useGlobalState must be used within a GlobalStateProvider");
    }
    return context;
};
