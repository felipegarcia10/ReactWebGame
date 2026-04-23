import React, { useState, useEffect } from 'react';
import PLOT_PY from './plot.py?raw';

import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";

const PLAYER_SESSIONS_LIMIT = 10;
let pyodideReady = null;

function getPyodide() {
    if (!pyodideReady) {
        pyodideReady = (async () => {
            const pyodide = await globalThis.loadPyodide();
            await pyodide.loadPackage(['matplotlib']);
            return pyodide;
        })();
    }
    return pyodideReady;
}

export default function SimpleDashboard() {
    const [status, setStatus] = useState('Idle');

    useEffect(() => {
        const runPythonCode = async () => {
            try {
                setStatus('Loading Pyodide :)');
                const pyodide = await getPyodide();

                const sampleData = [
                    { name: 'Yeison', score: 5 },
                    { name: 'Yaison', score: 4 },
                    { name: 'Json', score: 3 },
                    { name: 'Noudad', score: 100 },
                ];
                window.__pyodideData = JSON.stringify(sampleData);

                //const q = query(collection(db, "scores"), limit(PLAYER_SESSIONS_LIMIT));
                //onSnapshot(q, (snapshot) => {
                //    const data = snapshot.docs.map((doc) => ({
                //        id: doc.id, ...doc.data(),
                //    }));

                //    console.log(JSON.stringify(data));
                //    window.__pyodideData = JSON.stringify(data);
                //});

                setStatus('Running Python :(');
                await pyodide.runPythonAsync(PLOT_PY);

                setStatus('Done');
            } catch (err) {
                console.error('Error, ', err);
                setStatus('Error, check console');
            }
        };

        runPythonCode();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Dashboard Example</h2>
            <p>{status}</p>
            <div id="pyodide-target" style={{ border: '1px solid #ccc' }}></div>
        </div>
    );
}