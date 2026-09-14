'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  Car, 
  Shield, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Phone, 
  UserCheck, 
  X,
  Building,
  KeyRound
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface FamilyMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  isStaff?: boolean;
}

interface Vehicle {
  id: string;
  type: '4-Wheeler' | '2-Wheeler';
  vehicleNumber: string;
  model: string;
  parkingSlot: string;
}

export default function MyFlatPage() {
  // Multi-flat switcher state (e.g. an owner owning 2 flats)
  const [selectedFlat, setSelectedFlat] = useState<'A-101' | 'A-102'>('A-101');
  
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  // New member form
  const [memberName, setMemberName] = useState('');
  const [memberRole, setMemberRole] = useState('Spouse');
  const [memberPhone, setMemberPhone] = useState('');

  // New vehicle form
  const [vehicleType, setVehicleType] = useState<'4-Wheeler' | '2-Wheeler'>('4-Wheeler');
  const [vehicleNo, setVehicleNo] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');

  const [members, setMembers] = useState<FamilyMember[]>([
    { id: '1', name: 'Rajesh Sharma', role: 'Primary Owner', phone: '+91 98200 11223' },
    { id: '2', name: 'Pooja Sharma', role: 'Spouse / Co-owner', phone: '+91 98200 11224' },
    { id: '3', name: 'Aarav Sharma', role: 'Son', phone: '+91 98200 11225' },
    { id: '4', name: 'Lata Bai', role: 'Domestic Helper (Maid)', phone: '+91 98999 55443', isStaff: true },
  ]);

  const [vehicles, setVehicles] = useState<Vehicle[]>([
    { id: 'v1', type: '4-Wheeler', vehicleNumber: 'MH-43-AK-1234', model: 'Hyundai Creta', parkingSlot: 'P-12' },
    { id: 'v2', type: '2-Wheeler', vehicleNumber: 'MH-43-BN-5678', model: 'Honda Activa 6G', parkingSlot: 'P-12 (Bike)' },
  ]);

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName.trim()) return;

    setMembers((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        name: memberName,
        role: memberRole,
        phone: memberPhone,
        isStaff: memberRole.includes('Helper') || memberRole.includes('Driver'),
      },
    ]);

    setShowAddMemberModal(false);
    setMemberName('');
    setMemberPhone('');
  };

  const handleDeleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleAddVehicle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vehicleNo.trim()) return;

    setVehicles((prev) => [
      ...prev,
      {
        id: String(Date.now()),
        type: vehicleType,
        vehicleNumber: vehicleNo.toUpperCase(),
        model: vehicleModel,
        parkingSlot: 'P-12 (Allotted)',
      },
    ]);

    setShowAddVehicleModal(false);
    setVehicleNo('');
    setVehicleModel('');
  };

  const handleDeleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Multi-Flat Switcher */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b pb-5">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">My Flat & Household</h2>
          <p className="text-sm text-slate-500">Manage your flat profile, registered family, and vehicle passes</p>
        </div>

        {/* Multi-Flat Switcher */}
        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
          <Building className="h-4 w-4 text-blue-600 ml-2" />
          <span className="text-xs font-semibold text-slate-500">Active Flat:</span>
          <button
            onClick={() => setSelectedFlat('A-101')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              selectedFlat === 'A-101'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Flat A-101 (2BHK)
          </button>
          <button
            onClick={() => setSelectedFlat('A-102')}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
              selectedFlat === 'A-102'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Flat A-102 (2BHK)
          </button>
        </div>
      </div>

      {/* Flat Specifications Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <Home className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Unit {selectedFlat} • Emerald (Wing A)
              </h3>
              <p className="text-xs text-slate-500">Floor 1 • 850 sq.ft Built-up Area</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />
              Ownership: Verified Owner
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-400">Monthly Dues</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">{formatCurrency(2975)}</p>
          </div>
          <div>
            <span className="text-slate-400">Reserved Parking</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">Slot #P-12</p>
          </div>
          <div>
            <span className="text-slate-400">Electric Meter No</span>
            <p className="text-base font-bold text-slate-900 mt-0.5">MSEB-984210</p>
          </div>
          <div>
            <span className="text-slate-400">Digital Gate PIN</span>
            <p className="text-base font-bold text-blue-600 mt-0.5 tracking-wider">#4819</p>
          </div>
        </div>
      </div>

      {/* Two Columns: Family & Helpers vs Registered Vehicles */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Family & Domestic Helpers */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <h3 className="font-bold text-slate-900">Family & Domestic Helpers</h3>
            </div>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Member / Helper
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {members.map((m) => (
              <div key={m.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold ${
                      m.isStaff
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}
                  >
                    {m.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">{m.name}</h4>
                    <p className="text-xs text-slate-500">
                      {m.role} • {m.phone || 'No phone'}
                    </p>
                  </div>
                </div>

                {m.role !== 'Primary Owner' && (
                  <button
                    onClick={() => handleDeleteMember(m.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Registered Vehicles & Parking */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b pb-3">
            <div className="flex items-center gap-2">
              <Car className="h-5 w-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900">Registered Vehicles & Passes</h3>
            </div>
            <button
              onClick={() => setShowAddVehicleModal(true)}
              className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition"
            >
              <Plus className="h-3.5 w-3.5" />
              Register Vehicle
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {vehicles.map((v) => (
              <div key={v.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700">
                    <Car className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm tracking-wide">
                      {v.vehicleNumber}
                    </h4>
                    <p className="text-xs text-slate-500">
                      {v.model} • {v.parkingSlot}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteVehicle(v.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 transition rounded-lg hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs text-slate-500">
            <p className="font-medium text-slate-700 mb-0.5">RFID / Parking Tag Info</p>
            Stickers are issued by the society office. Park vehicles only in assigned slots to prevent penalties.
          </div>
        </div>
      </div>

      {/* MODAL: ADD MEMBER */}
      {showAddMemberModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Add Family Member or Helper</h3>
              <button onClick={() => setShowAddMemberModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suman Sharma"
                  value={memberName}
                  onChange={(e) => setMemberName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Relationship / Role
                </label>
                <select
                  value={memberRole}
                  onChange={(e) => setMemberRole(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Child / Dependent">Child / Dependent</option>
                  <option value="Parent">Parent</option>
                  <option value="Domestic Helper (Maid)">Domestic Helper (Maid)</option>
                  <option value="Personal Driver">Personal Driver</option>
                  <option value="Cook">Cook</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="+91 98200 00000"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMemberModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD VEHICLE */}
      {showAddVehicleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Register Vehicle</h3>
              <button onClick={() => setShowAddVehicleModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddVehicle} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setVehicleType('4-Wheeler')}
                    className={`rounded-lg p-2.5 font-semibold text-xs border text-center transition ${
                      vehicleType === '4-Wheeler'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    4-Wheeler (Car)
                  </button>
                  <button
                    type="button"
                    onClick={() => setVehicleType('2-Wheeler')}
                    className={`rounded-lg p-2.5 font-semibold text-xs border text-center transition ${
                      vehicleType === '2-Wheeler'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    2-Wheeler (Bike/Scooter)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Vehicle Registration Number
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MH-43-AB-1234"
                  value={vehicleNo}
                  onChange={(e) => setVehicleNo(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none uppercase font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Make & Model
                </label>
                <input
                  type="text"
                  placeholder="e.g. Honda City / Activa"
                  value={vehicleModel}
                  onChange={(e) => setVehicleModel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddVehicleModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

