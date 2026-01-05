import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { auth, db } from '@/lib/firebase';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ROLE_TO_DOC_ID = {
    'farmer': 'Farmers',
    'buyer': 'Buyers',
    'logistics': 'Logistics owners',
    'storage': 'Storage Owners'
};

const findUserProfile = async (uid) => {
    // We don't know the role, so we check all possible locations.
    // This is a trade-off for the specific storage structure requested.
    const checks = Object.values(ROLE_TO_DOC_ID).map(async (docTimeout) => {
        const docRef = doc(db, "Users", docTimeout, "accounts", uid);
        const snapshot = await getDoc(docRef);
        return { snapshot, exists: snapshot.exists() };
    });

    const results = await Promise.all(checks);
    const found = results.find(r => r.exists);

    return found ? found.snapshot.data() : null;
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                try {
                    const userData = await findUserProfile(firebaseUser.uid);
                    if (userData) {
                        setUser({ ...firebaseUser, ...userData });
                    } else {
                        // If not found in new structure, maybe check old 'users' collection or just set auth user
                        // For now, assume migration is for new users
                        setUser(firebaseUser);
                    }
                } catch (error) {
                    console.error("Error fetching user profile:", error);
                    setUser(firebaseUser);
                }
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            const userData = await findUserProfile(userCredential.user.uid);
            const mergedUser = { ...userCredential.user, ...(userData || {}) };

            setUser(mergedUser);
            toast.success(`Welcome back, ${mergedUser.name || 'User'}!`);
            return mergedUser;

        } catch (error) {
            console.error("Login Error:", error);
            toast.error(error.message || "Failed to login");
            throw error;
        }
    };

    const register = async (details, role) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, details.email, details.password);
            const user = userCredential.user;

            const userData = {
                name: details.name,
                email: details.email,
                role: role,
                createdAt: new Date().toISOString(),
                id: user.uid, // Store UID in the doc as well
                ...(details.companyName && { companyName: details.companyName })
            };

            // Construct path: Users -> [Role Doc] -> accounts -> [UID]
            // Note: 'Users' is the collection. 'Farmers' is the Doc. 'accounts' is the subcollection.
            const roleDocId = ROLE_TO_DOC_ID[role];
            if (!roleDocId) throw new Error("Invalid role mapping");

            const path = `Users/${roleDocId}/accounts/${user.uid}`;
            console.log("Attempting to write user profile to:", path);

            await setDoc(doc(db, "Users", roleDocId, "accounts", user.uid), userData);

            const mergedUser = { ...user, ...userData };
            setUser(mergedUser);
            toast.success("Account created successfully!");
            return mergedUser;
        } catch (error) {
            console.error("Registration Error:", error);

            let message = error.message || "Failed to register";
            if (error.code === 'auth/email-already-in-use') {
                message = "This email is already registered.";
            } else if (error.code === 'auth/weak-password') {
                message = "Password should be at least 6 characters.";
            } else if (error.code === 'permission-denied') {
                message = "Database permission denied. Check your Firestore rules.";
            } else if (error.code === 'auth/operation-not-allowed') {
                message = "Email/Password login is not enabled in Firebase Console.";
            } else if (error.message.includes("configuration")) {
                message = "Firebase config error. Check console.";
            }

            toast.error(message);
            throw error;
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            toast.info("Logged out successfully");
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Failed to logout");
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading }}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
