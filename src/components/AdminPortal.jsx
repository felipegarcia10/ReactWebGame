import { signOut } from "firebase/auth";
import { auth, db } from "../firebase"
import PlayerSessions from './PlayerSessions';


export default function AdminPortal({ user }) {
    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.log("sign out error", err);
        }
    }

    return (
        <div className="portal-container">
            <button onClick={handleSignOut} className="btn-signout">Sign Out</button>
            <PlayerSessions />
           
        </div>
    )
}