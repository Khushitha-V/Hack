export const useHealthStore = create<HealthStore>((set) => ({
  patient: null,
  isConnected: false,
  lastSync: null,
  connect: () => {
    mockSmartWatch.stopMonitoring();
    set({ isConnected: false });
  },
  disconnect: () => {
    mockSmartWatch.startMonitoring((vitals) => {
      set((state) => ({
        patient: state.patient
          ? {
              ...state.patient,
              vitalSigns: vitals,
            }
          : null,
        lastSync: new Date(),
      }));
    });
    set({ isConnected: true, lastSync: new Date() });
  },
  updateVitals: (vitals) =>
    set((state) => ({
      patient: state.patient
        ? { ...state.patient, vitalSigns: vitals }
        : null,
      lastSync: new Date(),
    })),
  addAlert: (alert) =>
    set((state) => ({
      patient: state.patient
        ? {
            ...state.patient,
            alerts: [alert, ...state.patient.alerts],
          }
        : null,
    })),
 initializePatient: () => {
    const mockPatient: Patient = {
      id: '1',
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      condition: 'Hypertension',
      vitalSigns: mockSmartWatch.generateMockData(),
      alerts: [
        {
          id: '1',
          type: 'warning',
          message: 'Blood pressure slightly elevated',
          timestamp: new Date(),
          acknowledged: false,
        },
      ],
      medications: [
        {
          id: '1',
          name: 'Lisinopril',
          dosage: '10mg',
          frequency: 'Once daily',
          nextDose: new Date(Date.now() + 1000 * 60 * 60 * 4), // 4 hours from now
        },
        {
          id: '2',
          name: 'Aspirin',
          dosage: '81mg',
          frequency: 'Once daily',
          nextDose: new Date(Date.now() + 1000 * 60 * 60 * 8), // 8 hours from now
        },
      ],
    };
    set({ patient: mockPatient });
  },
}));
