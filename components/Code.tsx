import React, {useEffect, useState} from 'react';

interface GateInfo {
    gateType: string;
    qubitIndex: number;
    gateIndex: number;
}

interface Props {
    qubits: number;
    gates: GateInfo[];
}


const Code: React.FC<Props> = ({qubits, gates}) => {

    const [code, setCode] = useState<string>('');

    useEffect(() => {
        let Code: string =
            `
from qiskit import QuantumRegister, ClassicalRegister, QuantumCircuit
from numpy import pi
        
qreg_q = QuantumRegister(`;

        Code += qubits.toString();

        Code += `, 'q')

circuit = QuantumCircuit(qreg_q)`;

        const hGateCounts = new Array(qubits).fill(0);
        gates.forEach(gate => {
            if (gate.gateType === 'H') {
                hGateCounts[gate.qubitIndex] += 1;
            }
        });
        hGateCounts.forEach( (_, i) => {
            if (hGateCounts[i] > 0) {
                for (let j = 0; j < hGateCounts[i]; j++) {
                    Code += (`

circuit.h(qreg_q[` + i +`])`);
                }

            }
        });


        setCode(Code);
    }, [qubits, gates]);


    return (
        <div>
            <pre>
                {code}
            </pre>
        </div>
    )
}

export default Code;