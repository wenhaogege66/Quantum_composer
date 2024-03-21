interface ComplexNumber {
  real: number;
  imaginary: number;
}

interface QuantumState {
  state: string;
  probability: number;
  amplitude?: ComplexNumber;
}

interface QuantumBit {
  alpha: ComplexNumber;
  beta: ComplexNumber;
}

export type {ComplexNumber, QuantumState, QuantumBit};