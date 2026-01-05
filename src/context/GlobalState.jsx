import React, { createContext, useContext, useState } from "react";
import { mockCrops, mockBids, mockFarmerStats } from "@/lib/mockData";



const GlobalStateContext = createContext(undefined);

export const GlobalStateProvider = ({ children }) => {
    const [crops, setCrops] = useState(mockCrops);
    const [bids, setBids] = useState(mockBids);
    const [farmerStats, setFarmerStats] = useState(mockFarmerStats);

    const addCrop = (newCropData) => {
        const newCrop = {
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

    const placeBid = (cropId, amount, buyerName) => {
        const newBid = {
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

    const extendAuction = (cropId, days) => {
        setCrops((prev) => prev.map(crop => {
            if (crop.id === cropId) {
                const currentEnd = new Date(crop.auctionEndsAt);
                const newEnd = new Date(currentEnd.setDate(currentEnd.getDate() + days));
                return { ...crop, auctionEndsAt: newEnd.toISOString() };
            }
            return crop;
        }));
    };

    const cancelListing = (cropId) => {
        setCrops((prev) => prev.filter(crop => crop.id !== cropId));
        setFarmerStats((prev) => ({
            ...prev,
            totalListings: prev.totalListings - 1
        }));
    };

    const acceptBid = (cropId, bidId) => {
        // Mark bid as won
        setBids(prev => prev.map(bid =>
            bid.id === bidId ? { ...bid, status: "won" } : bid
        ));

        // Update crop status
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "logistics_pending" } : crop
        ));
    };

    const confirmLogistics = (cropId) => {
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "payment_pending" } : crop
        ));
    };

    const confirmPayment = (cropId) => {
        setCrops(prev => prev.map(crop =>
            crop.id === cropId ? { ...crop, status: "completed" } : crop
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
