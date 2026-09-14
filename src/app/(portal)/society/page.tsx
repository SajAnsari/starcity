'use client';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Home, 
  Users, 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  UserPlus, 
  ShieldCheck, 
  Car, 
  X,
  History,
  Phone,
  Mail
} from 'lucide-react';
import { 
  getBuildings, 
  getFlats, 
  createBuilding, 
  createFlat, 
  BuildingItem, 
  FlatItem 
} from '@/lib/society-actions';

export default function SocietyManagementPage() {
  const [activeTab, setActiveTab] = useState<'flats' | 'residents' | 'history'>('flats');
  const [buildings, setBuildings] = useState<BuildingItem[]>([]);
  const [flats, setFlats] = useState<FlatItem[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showAddBuildingModal, setShowAddBuildingModal] = useState(false);
  const [showAddFlatModal, setShowAddFlatModal] = useState(false);
  const [showAssignResidentModal, setShowAssignResidentModal] = useState(false);
  const [selectedFlatForAssign, setSelectedFlatForAssign] = useState<FlatItem | null>(null);

  // Form states
  const [newBuildingName, setNewBuildingName] = useState('');
  const [newBuildingFloors, setNewBuildingFloors] = useState(7);

  const [newFlatBuildingId, setNewFlatBuildingId] = useState('');
  const [newFlatNumber, setNewFlatNumber] = useState('');
  const [newFlatFloor, setNewFlatFloor] = useState(1);
  const [newFlatArea, setNewFlatArea] = useState(850);
  const [newFlatType, setNewFlatType] = useState('2BHK');
  const [newFlatParking, setNewFlatParking] = useState(1);

  // Assign resident form state
  const [residentName, setResidentName] = useState('');
  const [residentEmail, setResidentEmail] = useState('');
  const [residentPhone, setResidentPhone] = useState('');
  const [occupancyType, setOccupancyType] = useState<'OWNER' | 'TENANT'>('OWNER');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const bData = await getBuildings();
    const fData = await getFlats();
    setBuildings(bData);
    setFlats(fData);
    if (bData.length > 0) {
      setNewFlatBuildingId(bData[0].id);
    }
    setLoading(false);
  };

  const handleAddBuilding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBuildingName.trim()) return;
    await createBuilding(newBuildingName, newBuildingFloors);
    setShowAddBuildingModal(false);
    setNewBuildingName('');
    await loadData();
  };

  const handleAddFlat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFlatNumber.trim() || !newFlatBuildingId) return;
    await createFlat({
      building_id: newFlatBuildingId,
      flat_number: newFlatNumber,
      floor: Number(newFlatFloor),
      area_sqft: Number(newFlatArea),
      flat_type: newFlatType,
      reserved_parking_slots: Number(newFlatParking),
    });
    setShowAddFlatModal(false);
    setNewFlatNumber('');
    await loadData();
  };

  const handleAssignResident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFlatForAssign) return;

    // Optimistic UI update
    setFlats((prev) =>
      prev.map((f) => {
        if (f.id === selectedFlatForAssign.id) {
          return {
            ...f,
            status: 'OCCUPIED',
            current_occupant: {
              user_id: 'u-' + Date.now(),
              full_name: residentName,
              email: residentEmail,
              phone: residentPhone,
              occupancy_type: occupancyType,
              start_date: new Date().toISOString().split('T')[0],
            },
          };
        }
        return f;
      })
    );

    setShowAssignResidentModal(false);
    setResidentName('');
    setResidentEmail('');
    setResidentPhone('');
    setSelectedFlatForAssign(null);
  };

  const filteredFlats = flats.filter((flat) => {
    const matchesBuilding = selectedBuilding === 'ALL' || flat.building_id === selectedBuilding;
    const matchesQuery =
      flat.flat_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (flat.current_occupant?.full_name &&
        flat.current_occupant.full_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesBuilding && matchesQuery;
  });

  return (
    <div className="space-y-6">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Society Directory & Flats</h2>
          <p className="text-sm text-slate-500">Manage towers, flats, owner & tenant occupancy records</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowAddBuildingModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <Building2 className="h-4 w-4 text-slate-500" />
            Add Wing / Tower
          </button>
          <button
            onClick={() => setShowAddFlatModal(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
          >
            <Plus className="h-4 w-4" />
            Add Flat
          </button>
        </div>
      </div>

      {/* Buildings Summary Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {buildings.map((b) => {
          const count = flats.filter((f) => f.building_id === b.id).length;
          const occupied = flats.filter((f) => f.building_id === b.id && f.status === 'OCCUPIED').length;
          return (
            <div
              key={b.id}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{b.name}</h4>
                  <p className="text-xs text-slate-500">{b.floors} Floors • {count || 24} Units</p>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                {occupied} Occupied
              </span>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('flats')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'flats'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Home className="h-4 w-4" />
          Units & Flats Directory ({flats.length})
        </button>
        <button
          onClick={() => setActiveTab('residents')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'residents'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          Resident Roster
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <History className="h-4 w-4" />
          Past Occupancy History
        </button>
      </div>

      {/* Filters & Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by flat or resident name..."
            className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-500">Filter Wing:</span>
          <select
            value={selectedBuilding}
            onChange={(e) => setSelectedBuilding(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="ALL">All Wings</option>
            {buildings.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: FLATS DIRECTORY */}
      {activeTab === 'flats' && (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="border-b bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Flat Number</th>
                  <th className="px-6 py-3.5">Wing / Tower</th>
                  <th className="px-6 py-3.5">Type & Area</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Current Occupant</th>
                  <th className="px-6 py-3.5">Parking</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredFlats.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-sm text-slate-400">
                      No flats found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredFlats.map((flat) => (
                    <tr key={flat.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        {flat.flat_number}
                        <span className="block text-xs font-normal text-slate-400">Floor {flat.floor}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{flat.building_name}</td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-slate-800">{flat.flat_type}</span>
                        <span className="block text-xs text-slate-400">{flat.area_sqft} sq.ft</span>
                      </td>
                      <td className="px-6 py-4">
                        {flat.status === 'OCCUPIED' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3" />
                            Occupied
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
                            <Clock className="h-3 w-3" />
                            Vacant
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {flat.current_occupant ? (
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-semibold text-slate-900">
                                {flat.current_occupant.full_name}
                              </span>
                              <span
                                className={`rounded px-1.5 py-0.2 text-[10px] font-bold uppercase tracking-wider ${
                                  flat.current_occupant.occupancy_type === 'OWNER'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-purple-100 text-purple-800'
                                }`}
                              >
                                {flat.current_occupant.occupancy_type}
                              </span>
                            </div>
                            <span className="block text-xs text-slate-400">
                              {flat.current_occupant.phone || flat.current_occupant.email}
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No resident assigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Car className="h-3.5 w-3.5 text-slate-400" />
                          <span>{flat.reserved_parking_slots} Slot(s)</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {flat.status === 'VACANT' ? (
                          <button
                            onClick={() => {
                              setSelectedFlatForAssign(flat);
                              setShowAssignResidentModal(true);
                            }}
                            className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition"
                          >
                            <UserPlus className="h-3.5 w-3.5" />
                            Assign Resident
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedFlatForAssign(flat);
                              setShowAssignResidentModal(true);
                            }}
                            className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition"
                          >
                            Edit Occupancy
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: RESIDENT ROSTER */}
      {activeTab === 'residents' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {flats
            .filter((f) => f.current_occupant)
            .map((f) => {
              const occ = f.current_occupant!;
              return (
                <div
                  key={f.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 text-base">{occ.full_name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        Flat {f.flat_number} • {f.building_name}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider ${
                        occ.occupancy_type === 'OWNER'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      {occ.occupancy_type}
                    </span>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-slate-400" />
                      <span>{occ.phone || '+91 98200 00000'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-400" />
                      <span>{occ.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <span>Living here since {occ.start_date}</span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* TAB 3: OCCUPANCY HISTORY AUDIT */}
      {activeTab === 'history' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 pb-4 border-b">
            <History className="h-5 w-5 text-blue-600" />
            <h3 className="font-bold text-slate-900">Immutable Past Occupancy Records</h3>
          </div>
          <p className="text-xs text-slate-500 mt-2 mb-4">
            Preserves permanent tenancy & ownership archives for legal compliance, audit records, and society dispute resolution.
          </p>

          <div className="divide-y divide-slate-100 text-sm">
            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Vikram Joshi (Tenant)</span>
                <p className="text-xs text-slate-500">Flat B-101 • Sapphire (B Wing)</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-600">Currently Active</span>
                <span className="block text-[11px] text-slate-400">Moved in Jun 01, 2024</span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Suresh Verma (Past Tenant)</span>
                <p className="text-xs text-slate-500">Flat B-101 • Sapphire (B Wing)</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-slate-500">Moved Out</span>
                <span className="block text-[11px] text-slate-400">Jan 2022 — May 2024</span>
              </div>
            </div>

            <div className="py-3 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-900">Rajesh Sharma (Owner)</span>
                <p className="text-xs text-slate-500">Flat A-101 • Emerald (A Wing)</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-emerald-600">Currently Active</span>
                <span className="block text-[11px] text-slate-400">Owner since Apr 01, 2022</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: ADD BUILDING */}
      {showAddBuildingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Add New Wing / Tower</h3>
              <button onClick={() => setShowAddBuildingModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddBuilding} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Wing / Building Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diamond (D Wing)"
                  value={newBuildingName}
                  onChange={(e) => setNewBuildingName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Total Floors
                </label>
                <input
                  type="number"
                  min={1}
                  max={50}
                  value={newBuildingFloors}
                  onChange={(e) => setNewBuildingFloors(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddBuildingModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Wing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD FLAT */}
      {showAddFlatModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-lg">Add New Flat / Unit</h3>
              <button onClick={() => setShowAddFlatModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddFlat} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Select Wing
                </label>
                <select
                  value={newFlatBuildingId}
                  onChange={(e) => setNewFlatBuildingId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                >
                  {buildings.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Flat Number
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. A-302"
                    value={newFlatNumber}
                    onChange={(e) => setNewFlatNumber(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Floor
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={newFlatFloor}
                    onChange={(e) => setNewFlatFloor(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Area (sq.ft)
                  </label>
                  <input
                    type="number"
                    min={100}
                    value={newFlatArea}
                    onChange={(e) => setNewFlatArea(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Flat Type
                  </label>
                  <select
                    value={newFlatType}
                    onChange={(e) => setNewFlatType(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                  >
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK">4 BHK</option>
                    <option value="VILLA">Villa / Penthouse</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Reserved Parking Slots
                </label>
                <input
                  type="number"
                  min={0}
                  max={5}
                  value={newFlatParking}
                  onChange={(e) => setNewFlatParking(Number(e.target.value))}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFlatModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Save Flat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ASSIGN RESIDENT */}
      {showAssignResidentModal && selectedFlatForAssign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-lg">
                  Assign Resident: Flat {selectedFlatForAssign.flat_number}
                </h3>
                <p className="text-xs text-slate-500">{selectedFlatForAssign.building_name}</p>
              </div>
              <button
                onClick={() => setShowAssignResidentModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAssignResident} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Occupancy Type
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setOccupancyType('OWNER')}
                    className={`rounded-lg p-2.5 font-semibold text-xs border text-center transition ${
                      occupancyType === 'OWNER'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Flat Owner
                  </button>
                  <button
                    type="button"
                    onClick={() => setOccupancyType('TENANT')}
                    className={`rounded-lg p-2.5 font-semibold text-xs border text-center transition ${
                      occupancyType === 'TENANT'
                        ? 'border-purple-600 bg-purple-50 text-purple-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    Tenant (Renter)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kulkarni"
                  value={residentName}
                  onChange={(e) => setResidentName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="ramesh@example.com"
                  value={residentEmail}
                  onChange={(e) => setResidentEmail(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98200 12345"
                  value={residentPhone}
                  onChange={(e) => setResidentPhone(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAssignResidentModal(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Confirm & Link Flat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

