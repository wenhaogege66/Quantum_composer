import QuantumCircuitOutputBar from "@/components/QuantumCircuitOutputBar";
import QuantumCircuitOutputBlochSphere from "@/components/QuantumCircuitOutputBlochSphere";
const quantumStates = [
  {state: '0011', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '0111', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '1110', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '1101', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '1111', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '0101', probability: 0.1, amplitude: {real: -0.1 ,imaginary: -0.1}},
  {state: '0001', probability: 0.5, amplitude: {real: 0.5 ,imaginary: 0.5}},
  {state: '1111', probability: 0.5, amplitude: {real: 0.2 ,imaginary: 0.8}}
];

export default function Home() {
  const data = [{ state: "19", probability: 0.1},{ state: "1215", probability: 0.4 },{ state: "00", probability: 0.5 }, { state: "10", probability: 0.5 }];
  return (
    <div>
      <h1>Quantum Circuit Simulator</h1>
      <QuantumCircuitOutputBar data={data} />

      <QuantumCircuitOutputBlochSphere data={quantumStates} />
    </div>
  );
}
