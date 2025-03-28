export interface VitalSigns {
  heartRate: number;
  bloodPressure: {
    systolic: number;
    diastolic: number;
  };
  spO2: number;
  temperature: number;
  ecg: number[];
}

export interface HealthAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  nextDose: Date;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  vitalSigns: VitalSigns;
  alerts: HealthAlert[];
  medications: Medication[];
}