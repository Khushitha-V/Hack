import React, { useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Activity, Heart, Thermometer, Droplet, Power } from 'lucide-react';
import { useHealthStore } from '../store/healthStore';
import type { HealthAlert, Medication } from '../types/health';

const Dashboard: React.FC = () => {
  const { patient, isConnected, lastSync, connect, disconnect, initializePatient } = useHealthStore();

  useEffect(() => {
    // Initialize patient data when component mounts
    initializePatient();
  }, []); // Remove initializePatient from dependencies to avoid re-initialization

  if (!patient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl text-gray-600">No patient data available</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">
          Health Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`h-3 w-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className="text-sm text-gray-600">
              {isConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
          <button
            onClick={isConnected ? disconnect : connect}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              isConnected 
                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            <Power className="h-4 w-4" />
            {isConnected ? 'Connect' : 'Disconnect Device'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <VitalCard
          icon={<Heart className="h-6 w-6 text-red-500" />}
          title="Heart Rate"
          value={`${patient.vitalSigns.heartRate} BPM`}
        />
        <VitalCard
          icon={<Activity className="h-6 w-6 text-blue-500" />}
          title="Blood Pressure"
          value={`${patient.vitalSigns.bloodPressure.systolic}/${patient.vitalSigns.bloodPressure.diastolic}`}
        />
        <VitalCard
          icon={<Droplet className="h-6 w-6 text-purple-500" />}
          title="SpO2"
          value={`${patient.vitalSigns.spO2}%`}
        />
        <VitalCard
          icon={<Thermometer className="h-6 w-6 text-orange-500" />}
          title="Temperature"
          value={`${patient.vitalSigns.temperature.toFixed(1)}°C`}
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">ECG Monitor</h2>
        <div className="h-64">
          <Line
            data={{
              labels: Array.from({ length: patient.vitalSigns.ecg.length }, (_, i) => i),
              datasets: [{
                label: 'ECG',
                data: patient.vitalSigns.ecg,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                borderWidth: 1.5,
                pointRadius: 0
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              animation: {
                duration: 0
              },
              scales: {
                y: {
                  beginAtZero: true,
                  grid: {
                    color: 'rgba(0, 0, 0, 0.1)'
                  }
                },
                x: {
                  grid: {
                    display: false
                  },
                  ticks: {
                    display: false
                  }
                }
              },
              plugins: {
                legend: {
                  display: false
                }
              }
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsList alerts={patient.alerts} />
        <MedicationReminders medications={patient.medications} />
      </div>

      {lastSync && (
        <p className="text-sm text-gray-500 mt-4">
          Last synced: {lastSync.toLocaleString()}
        </p>
      )}
    </div>
  );
};

const VitalCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
}> = ({ icon, title, value }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center gap-4">
      {icon}
      <div>
        <h3 className="text-sm text-gray-600">{title}</h3>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  </div>
);

const AlertsList: React.FC<{ alerts: HealthAlert[] }> = ({ alerts }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">Recent Alerts</h2>
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          className={`p-4 rounded-lg ${
            alert.type === 'critical'
              ? 'bg-red-100 text-red-800'
              : alert.type === 'warning'
              ? 'bg-yellow-100 text-yellow-800'
              : 'bg-blue-100 text-blue-800'
          }`}
        >
          <p className="font-medium">{alert.message}</p>
          <p className="text-sm mt-1">
            {new Date(alert.timestamp).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const MedicationReminders: React.FC<{ medications: Medication[] }> = ({
  medications,
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <h2 className="text-xl font-semibold mb-4">Medication Reminders</h2>
    <div className="space-y-4">
      {medications.map((med) => (
        <div key={med.id} className="flex items-center justify-between">
          <div>
            <p className="font-medium">{med.name}</p>
            <p className="text-sm text-gray-600">
              {med.dosage} - {med.frequency}
            </p>
          </div>
          <p className="text-sm text-gray-600">
            Next: {new Date(med.nextDose).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  </div>
);

export default Dashboard;
