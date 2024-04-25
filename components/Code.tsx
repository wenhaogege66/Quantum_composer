import React from 'react';

const quantumCode = `
from qiskit import QuantumCircuit
qc1 = QuantumCircuit(3)
qc2 = QuantumCircuit(2)
print("First Quantum Circuit:")
print(qc1)
print("\nSecond Quantum Circuit:")
print(qc2)
`;

const Code: React.FC = () => {
    return (
        <div>
            <code>
                {quantumCode}
            </code>
        </div>
    )
}

export default Code;