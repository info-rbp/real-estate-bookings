
import React, { useState, useEffect } from 'react';
import { Room, RentalType } from '../types/property';

// Mock Data
const mockProperties = [
    { id: '1', title: '123 Ocean View Drive', description: 'A beautiful villa by the sea.', address: '123 Ocean View Drive, Sunnydale', details: { rooms: 4, bathrooms: 3, carSpaces: 2 }, rentalType: 'whole_property', rooms: [], propertyLevelRent: 4500, propertyLevelBond: 18000, images: [], features: [], availability: true, isFeatured: true, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: '2', title: '789 Central Square', description: 'A modern loft in the heart of the city.', address: '789 Central Square, Metro City', details: { rooms: 2, bathrooms: 2, carSpaces: 1 }, rentalType: 'room_by_room', rooms: [{id: 'r1', name:'Master', photo:'', rent:1200, bond:4800}], propertyLevelRent: 0, propertyLevelBond: 0, images: [], features: [], availability: true, isFeatured: false, updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() }
];

const mockApplications = [
    { id: 'app1', applicantDetails: { name: 'John Doe', email: 'john.doe@example.com' }, propertyId: '1', status: 'Pending' },
    { id: 'app2', applicantDetails: { name: 'Jane Smith', email: 'jane.smith@example.com' }, propertyId: '2', status: 'Approved' }
];

const mockInspectionSlots = [
    { id: 'slot1', propertyId: '1', dateTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString() },
    { id: 'slot2', propertyId: '1', dateTime: new Date(Date.now() + 48 * 3600 * 1000).toISOString() }
];

const mockLandlordSubmissions = [
    { id: 'sub1', landlord: { fullName: 'Peter Pan' }, property: { streetAddress: '10 Neverland Ave' }, status: 'new' }
];

const mockInspections = [
    { id: 'insp1', propertyTitle: '123 Ocean View Drive', startDateTime: new Date().toISOString(), registeredCount: 5, attendeeCap: 10, status: 'Scheduled' }
];


export const AdminDashboard = () => {
    const [properties, setProperties] = useState<any[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [slots, setSlots] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [inspections, setInspections] = useState<any[]>([]);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [address, setAddress] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>(['']);
    const [features, setFeatures] = useState<string[]>(['', '', '']);
    const [rooms, setRooms] = useState(0);
    const [bathrooms, setBathrooms] = useState(0);
    const [carSpaces, setCarSpaces] = useState(0);
    const [rentalType, setRentalType] = useState<RentalType>('whole_property');
    const [wholeRent, setWholeRent] = useState(0);
    const [wholeBond, setWholeBond] = useState(0);
    const [roomsForRent, setRoomsForRent] = useState<Room[]>([]);
    const [availability, setAvailability] = useState(true);
    const [isFeatured, setIsFeatured] = useState(false);
    const [selectedPropertySlot, setSelectedPropertySlot] = useState('');
    const [inspectionDateTime, setInspectionDateTime] = useState('');
    const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'add-edit-property' | 'applications' | 'inspections' | 'open-inspections' | 'landlord-submissions'>('dashboard');

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'properties', label: 'Properties' },
        { id: 'add-edit-property', label: 'Add/Edit Property' },
        { id: 'applications', label: 'Applications' },
        { id: 'inspections', label: 'Old Inspection Slots' },
        { id: 'open-inspections', label: 'Open Inspections' },
        { id: 'landlord-submissions', label: 'Landlord Submissions' },
    ] as const;

    function fetchAllData() {
        setProperties(mockProperties);
        setApplications(mockApplications);
        setSlots(mockInspectionSlots);
        setSubmissions(mockLandlordSubmissions);
        setInspections(mockInspections);
    }

    useEffect(() => {
        fetchAllData();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setDescription(''); setAddress(''); setImages(['']); setAvailability(true); setIsFeatured(false); setFeatures(['', '', '']);
        setRooms(0); setBathrooms(0); setCarSpaces(0); setRentalType('whole_property'); setWholeRent(0); setWholeBond(0); setRoomsForRent([]);
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const propertyData = {
            title: address, description, address, details: { rooms, bathrooms, carSpaces }, rentalType,
            rooms: rentalType === 'room_by_room' ? roomsForRent : [],
            propertyLevelRent: rentalType === 'whole_property' ? wholeRent : undefined,
            propertyLevelBond: rentalType === 'whole_property' ? wholeBond : undefined,
            images: images.filter(img => img.trim() !== ''),
            features: features.filter(f => f.trim() !== ''),
            availability, isFeatured, updatedAt: new Date().toISOString()
        };

        if (editingId) {
            setProperties(properties.map(p => p.id === editingId ? { ...p, ...propertyData } : p));
            alert('Property updated!');
        } else {
            const newProperty = { ...propertyData, id: String(Date.now()), createdAt: new Date().toISOString() };
            setProperties([...properties, newProperty]);
            alert('Property added!');
        }
        resetForm();
        setActiveTab('properties');
    };

    const startEdit = (property: any) => {
        setEditingId(property.id);
        setDescription(property.description || '');
        setAddress(property.address || '');
        setImages(property.images && property.images.length > 0 ? property.images : ['']);
        setFeatures(property.features && property.features.length > 0 ? property.features : ['', '', '']);
        setAvailability(property.availability);
        setIsFeatured(!!property.isFeatured);
        setRooms(property.details?.rooms || 0);
        setBathrooms(property.details?.bathrooms || 0);
        setCarSpaces(property.details?.carSpaces || 0);
        setRentalType(property.rentalType || 'whole_property');
        setWholeRent(property.propertyLevelRent || 0);
        setWholeBond(property.propertyLevelBond || 0);
        setRoomsForRent(property.rooms || []);
        setActiveTab('add-edit-property');
    };

    const deleteInspectionSlot = (slotId: string) => {
        setSlots(slots.filter(slot => slot.id !== slotId));
        alert('Slot deleted!');
    };

    const addInspectionSlot = () => {
        if (!selectedPropertySlot || !inspectionDateTime) {
            alert('Please select a property and date/time'); return;
        }
        const newSlot = { id: String(Date.now()), propertyId: selectedPropertySlot, dateTime: inspectionDateTime };
        setSlots([...slots, newSlot]);
        alert('Slot added!');
        setSelectedPropertySlot('');
        setInspectionDateTime('');
    };

    const updateApplicationStatus = (appId: string, status: string) => {
        setApplications(applications.map(app => app.id === appId ? { ...app, status } : app));
    };

    const updateSubmissionStatus = (subId: string, status: string) => {
        setSubmissions(submissions.map(sub => sub.id === subId ? { ...sub, status } : sub));
    };

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 p-6 space-y-8">
                <h1 className="text-xl font-bold text-slate-900">Admin Portal</h1>
                <div className="space-y-2">
                    {menuItems.map(item => (
                        <button 
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full text-left px-4 py-3 rounded-xl font-semibold transition ${activeTab === item.id ? 'bg-violet-100 text-violet-700' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            {item.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-10">
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        <h2 className="text-3xl font-extrabold text-slate-900">Dashboard</h2>
                        <div className="grid grid-cols-2 gap-6">
                            {menuItems.filter(i => i.id !== 'dashboard' && i.id !== 'add-edit-property').map(item => (
                                <button key={item.id} onClick={() => setActiveTab(item.id)} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition text-left space-y-2">
                                    <h3 className="text-xl font-bold text-slate-900">{item.label}</h3>
                                    <p className="text-slate-500">Manage {item.label.toLowerCase()}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'properties' && (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-3xl font-extrabold text-slate-900">Properties</h2>
                            <button onClick={() => { resetForm(); setActiveTab('add-edit-property'); }} className="bg-violet-600 text-white font-bold px-5 py-3 rounded-xl">+ Add New</button>
                        </div>
                        <div className="space-y-4">
                            {properties.map(p => (
                                <div key={p.id} className="bg-white border border-slate-100 p-6 rounded-xl flex justify-between items-center shadow-sm">
                                    <span className="font-semibold text-slate-800 truncate pr-4">{p.title}</span>
                                    <button onClick={() => startEdit(p)} className="text-violet-600 font-bold text-sm bg-violet-50 px-4 py-2 rounded-lg">Edit</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'add-edit-property' && (
                    <div className="max-w-4xl mx-auto space-y-8">
                        <h2 className="text-3xl font-extrabold text-slate-900">{editingId ? 'Edit Property' : 'Add Property'}</h2>
                        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                             <form onSubmit={handleSubmit} className="space-y-4">
                                <input type="text" placeholder="Address (used as title)" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-slate-200 p-4 rounded-xl" required />
                                <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-slate-200 p-4 rounded-xl h-32" required />
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Bedrooms</label>
                                        <input type="number" placeholder="Bedrooms" value={rooms} onChange={(e) => setRooms(parseInt(e.target.value))} className="w-full border border-slate-200 p-4 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Bathrooms</label>
                                        <input type="number" placeholder="Bathrooms" value={bathrooms} onChange={(e) => setBathrooms(parseInt(e.target.value))} className="w-full border border-slate-200 p-4 rounded-xl" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Car Spaces</label>
                                        <input type="number" placeholder="Car Spaces" value={carSpaces} onChange={(e) => setCarSpaces(parseInt(e.target.value))} className="w-full border border-slate-200 p-4 rounded-xl" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-slate-700">Property Photos (Up to 25)</label>
                                    {images.map((img, idx) => (
                                        <input key={idx} type="text" placeholder={`Photo URL ${idx + 1}`} value={img} onChange={(e) => { const newImgs = [...images]; newImgs[idx] = e.target.value; setImages(newImgs); }} className="w-full border border-slate-200 p-2 rounded-xl" />
                                    ))}
                                    {images.length < 25 && <button type="button" onClick={() => setImages([...images, ''])} className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-lg">+ Add Photo</button>}
                                </div>
                                
                                <div className="space-y-4">
                                    <label className="block text-sm font-semibold text-slate-700">Property Features (Highlight 3)</label>
                                    {features.map((feat, idx) => (
                                        <input key={idx} type="text" placeholder={`Feature ${idx + 1}`} value={feat} onChange={(e) => { const newFeats = [...features]; newFeats[idx] = e.target.value; setFeatures(newFeats); }} className="w-full border border-slate-200 p-2 rounded-xl" />
                                    ))}
                                </div>

                                <select value={rentalType} onChange={(e) => setRentalType(e.target.value as 'whole_property' | 'room_by_room')} className="w-full border border-slate-200 p-4 rounded-xl">
                                    <option value="whole_property">Whole Property Rental</option>
                                    <option value="room_by_room">Per Room Rental</option>
                                </select>

                                {rentalType === 'whole_property' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Weekly Rent</label>
                                            <input type="number" value={wholeRent} onChange={(e) => setWholeRent(parseInt(e.target.value))} className="w-full border border-slate-200 p-4 rounded-xl" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1">Bond</label>
                                            <input type="number" value={wholeBond} onChange={(e) => setWholeBond(parseInt(e.target.value))} className="w-full border border-slate-200 p-4 rounded-xl" />
                                        </div>
                                    </div>
                                )}
                                
                                {rentalType === 'room_by_room' && (
                                     <div className="space-y-4">
                                       <button type="button" onClick={() => setRoomsForRent([...roomsForRent, {name:'', photo:'', rent:0, bond:0, id: ''}])} className="text-sm bg-slate-900 text-white px-4 py-2 rounded-lg">+ Add Room</button>
                                       {roomsForRent.map((room, idx) => (
                                         <div key={idx} className="grid grid-cols-4 gap-2">
                                             <input placeholder="Name" value={room.name} onChange={(e)=>{const newRooms = [...roomsForRent]; newRooms[idx].name = e.target.value; setRoomsForRent(newRooms)}} className="border p-2 rounded"/>
                                             <input placeholder="Photo" value={room.photo} onChange={(e)=>{const newRooms = [...roomsForRent]; newRooms[idx].photo = e.target.value; setRoomsForRent(newRooms)}} className="border p-2 rounded"/>
                                             <input type="number" placeholder="Rent" value={room.rent} onChange={(e)=>{const newRooms = [...roomsForRent]; newRooms[idx].rent = parseInt(e.target.value); setRoomsForRent(newRooms)}} className="border p-2 rounded"/>
                                             <input type="number" placeholder="Bond" value={room.bond} onChange={(e)=>{const newRooms = [...roomsForRent]; newRooms[idx].bond = parseInt(e.target.value); setRoomsForRent(newRooms)}} className="border p-2 rounded"/>
                                         </div>
                                       ))}
                                     </div>
                                )}

                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input type="checkbox" checked={availability} onChange={(e) => setAvailability(e.target.checked)} className="h-5 w-5 rounded text-blue-600" />
                                    <span className="font-semibold text-slate-700">Available for rent</span>
                                </label>
                                <div className="flex gap-4 pt-4">
                                    <button type="submit" className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700">{editingId ? 'Update Property' : 'Add Property'}</button>
                                    {editingId && <button type="button" onClick={resetForm} className="bg-slate-100 text-slate-700 px-8 py-3 rounded-xl font-bold hover:bg-slate-200">Cancel</button>}
                                </div>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                     <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-5 w-5 rounded text-blue-600" />
                                     <span className="font-semibold text-slate-700">Feature this property</span>
                                 </label>
</form>
                        </div>
                    </div>
                )}

                {activeTab === 'applications' && (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Submitted Applications</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-slate-500 text-sm">
                                        <th className="pb-4">Applicant</th>
                                        <th className="pb-4">Property</th>
                                        <th className="pb-4">Status</th>
                                        <th className="pb-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {applications.map(app => (
                                        <tr key={app.id} className="border-t">
                                            <td className="py-4">{app.applicantDetails?.name} <br/> <span className="text-xs text-slate-500">{app.applicantDetails?.email}</span></td>
                                            <td className="py-4">{properties.find(p=>p.id===app.propertyId)?.title}</td>
                                            <td className="py-4 font-semibold">{app.status || 'Pending'}</td>
                                            <td className="py-4">
                                                <button onClick={() => updateApplicationStatus(app.id, 'Approved')} className="text-violet-600 font-bold mr-2 text-sm">Approve</button>
                                                <button onClick={() => updateApplicationStatus(app.id, 'Rejected')} className="text-red-600 font-bold text-sm">Reject</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'inspections' && (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Inspection Slots</h2>
                        <div className="flex gap-4 mb-6">
                            <select value={selectedPropertySlot} onChange={(e) => setSelectedPropertySlot(e.target.value)} className="w-full border border-slate-200 p-4 rounded-xl">
                                <option value="">Select Property</option>
                                {properties.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                            </select>
                            <input type="datetime-local" value={inspectionDateTime} onChange={(e) => setInspectionDateTime(e.target.value)} className="w-full border border-slate-200 p-4 rounded-xl" />
                            <button onClick={addInspectionSlot} className="bg-blue-600 text-white px-6 py-4 rounded-xl font-bold">Add Slot</button>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {slots.map(slot => (
                                <div key={slot.id} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                                     <p className="font-semibold">{new Date(slot.dateTime).toLocaleString()}</p>
                                     <p className="text-xs text-slate-500 mb-2">{properties.find(p=>p.id===slot.propertyId)?.title}</p>
                                     <button onClick={() => deleteInspectionSlot(slot.id)} className="text-red-500 font-bold text-xs">Delete</button>
                                </div>
                            ))}
                        </div>                
                    </div>
                )}

                {activeTab === 'open-inspections' && (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Open Inspections</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-slate-500 text-sm">
                                        <th className="pb-4">Property</th>
                                        <th className="pb-4">Start Time</th>
                                        <th className="pb-4">Attendees</th>
                                        <th className="pb-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inspections.map(i => (
                                        <tr key={i.id} className="border-t">
                                            <td className="py-4">{i.propertyTitle}</td>
                                            <td className="py-4">{new Date(i.startDateTime).toLocaleString()}</td>
                                            <td className="py-4">{i.registeredCount} / {i.attendeeCap}</td>
                                            <td className="py-4">{i.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'landlord-submissions' && (
                    <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                        <h2 className="text-2xl font-bold mb-6">Landlord Submissions</h2>
                        <div className="space-y-4">
                            {submissions.map(sub => (
                                <div key={sub.id} className="border p-4 rounded-xl flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{sub.landlord?.fullName}</p>
                                        <p className="text-sm">{sub.property?.streetAddress}</p>
                                        <p className={`text-xs font-semibold ${sub.status === 'new' ? 'text-red-600' : 'text-violet-600'}`}>Status: {sub.status}</p>
                                    </div>
                                    <button onClick={() => updateSubmissionStatus(sub.id, 'contacted')} className="text-sm bg-slate-100 px-4 py-2 rounded">Mark Contacted</button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
