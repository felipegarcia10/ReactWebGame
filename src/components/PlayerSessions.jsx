import { useState, useEffect } from "react";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const PLAYER_SESSIONS_LIMIT = 20;

export default function PlayerSessions({ currentUserId }) {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "scores"), limit(PLAYER_SESSIONS_LIMIT));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map((doc) => ({
                id: doc.id, ...doc.data(),
            }));

            setLeaders(data)
            setLoading(false);

        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="leaderboard-card">
                <h2 className="card-title">Player session</h2>
                <div className="card-loading">
                    <div className="spinner" />
                </div>
            </div>
        )
    }

    return (
        <div className="leaderboard-card">
            <div className="card-header">
                <h2 className="card-title">Player sessions</h2>
                <div className="card-badge">Most recent {PLAYER_SESSIONS_LIMIT}</div>
            </div>

            {leaders.length === 0 ? (
                <p>No player sessions yet.</p>
            ) : (
                <div className="leaderboard-list">
                    {leaders.map((session, index) => {
                        const isCurrentUser = session.id === currentUserId;
                        const rankClass =
                            index === 0 ? "gold" : index === 1 ? "silver" : index === 2 ? "bronze" : "";
                        return (
                            <div key={session.id} className={`leaderboard-row ${isCurrentUser ? "is-you" : ""}`}>
                                <span className={`rank ${rankClass}`}>
                                    {index + 1}
                                </span>
                                <div className="leader-info">
                                    <span className="leader-name">
                                        {session.playerName || "Anonymous"}
                                        {isCurrentUser && <span className="you-tag">YOU</span>}
                                    </span>
                                </div>

                                <div className="leader-stats">
                                    <span className="leaderScore">{session.score ?? 0}</span>
                                    <span className="leader-games">{session.pipes ?? 0}</span>
                                    {/*<span className="leader-games">{session.timestamp ?? 0}</span>*/}
                                    <span className="leader-games">{session.duration ?? 0}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}