import { useState, useEffect } from "react";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp, onSnapshot } from "firebase/firestore";
import { auth, db } from "./firebase";
import LoginForm from "./components/LoginForm"
import GamePortal from "./components/GamePortal";
import AdminPortal from "./components/AdminPortal";
import NavigationBar from "./components/NavBar";
import { BrowserRouter, Routes, Route } from "react-router-dom";

async function createUserProfileIfNeeded(firebaseUser) {
    const userRef = doc(db, "users", firebaseUser.uid); //uid is the id that firebase creates for each record
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists) {
        await setDoc(userRef, {
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "Player",
            photoURL: firebaseUser.photoURL || null,
            createdAt: serverTimestamp(),
            highscore: 0,
            gamesPlayed: 0,
        })
        console.log(`User ${firebaseUser.email} created.`)
    }
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        let unsubscribeUserDoc = null;

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                await createUserProfileIfNeeded(firebaseUser);
                setUser(firebaseUser);

                const userRef = doc(
                    db, "adminUsers", firebaseUser.email
                );

                unsubscribeUserDoc = onSnapshot(userRef, (snapshot) => {

                    if (snapshot.exists()) {
                        setUserRole(snapshot.data().role);
                    }
                    else {
                        setUserRole("player");
                    }

                });
            } else {
                setUser(null);
            }
            setLoading(false);
        })
        return () => {
            unsubscribe();
            if (unsubscribeUserDoc) {
                unsubscribeUserDoc();
            }
        }
    }, []);

    if (loading) {
        return (
            <div>
                <p>Checking auth state...</p>
            </div>
        )
    }

    return (
        <div className="app">
            {user ? userRole === "admin" ? (
                <BrowserRouter>

                    <NavigationBar />

                    <Routes>
                        <Route path="/" element={<GamePortal user={user} />} />
                        <Route path="/admin" element={<AdminPortal user={user} />} />
                    </Routes>

                </BrowserRouter>
            ) : (<GamePortal user={user} />) : (            
                <LoginForm /> 
                )
            }
        </div>
    )
}