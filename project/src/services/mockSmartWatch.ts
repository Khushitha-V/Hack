import { VitalSigns } from '../types/health';

class MockSmartWatchService {
  private interval: number | null = null;
  private callback: ((data: VitalSigns) => void) | null = null;

  generateMockData(): VitalSigns {
    // Simulate realistic vital signs
    const heartRate = Math.floor(60 + Math.random() * 40); // 60-100 BPM
    const systolic = Math.floor(110 + Math.random() * 30); // 110-140 mmHg
    const diastolic = Math.floor(70 + Math.random() * 20); // 70-90 mmHg
    const spO2 = Math.floor(95 + Math.random() * 5); // 95-100%
    const temperature = 36.5 + Math.random() * 1; // 36.5-37.5°C

    // Generate mock ECG data (simple sine wave)
    const ecg = Array.from({ length: 100 }, (_, i) => 
      Math.sin(i * 0.2) * 0.5 + Math.random() * 0.1
    );

    return {
      heartRate,
      bloodPressure: {
        systolic,
        diastolic
      },
      spO2,
      temperature,
      ecg
    };
  }

  startMonitoring(callback: (data: VitalSigns) => void) {
    this.callback = callback;
    // Update every 2 seconds
    this.interval = setInterval(() => {
      const data = this.generateMockData();
      this.callback?.(data);
    }, 2000);
  }

  stopMonitoring() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export const mockSmartWatch = new MockSmartWatchService();