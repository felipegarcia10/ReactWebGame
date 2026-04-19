import React, { useState, useEffect } from 'react';
import PLOT_PY from './plot.py?raw';

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