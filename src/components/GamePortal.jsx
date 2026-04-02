import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase"
import { doc, onSnapShot } from "firebase/firestore"

import Leaderboard from "./LeaderBoard";

const GAME_URL = import.meta.env.VITE_GAME_URL || null;

export default function GamePortal({ user }) {

    const iframeRef = useRef(null);
    const [userData, setUserData] = useState(null);
    const [gameLoaded, setGameLoaded] = useState(false);
    const [activeTab, setActiveTab] = useState("game");

    useEffect(() => {
        const userRef = doc(db, "users", user.uid)
        //Snapshot: whenever something changes in the specified doc in the DB, the callback is triggered
        const unsubscribe = onSnapShot(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setUserData(snapshot.data());
            }
        });
        return () => unsubscribe();
    }, [user.uid]);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.log("sign out error", err);
        }
    }

    return (
        <>
            <div className="game-area">
                <iframe
                    ref={iframeRef}
                    src={GAME_URL}
                    title="Flappi Flaps"
                    className={"game-frame visible"}
                    allow="fullscreen" />
            </div>
            <div className="portal-container">
                <button onClick={handleSignOut} className="btn-signout">Sign Out</button>
                <Leaderboard />
            </div>
        </>
    )
}