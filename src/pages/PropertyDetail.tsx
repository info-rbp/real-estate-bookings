import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BedDouble, Bath, Car, MapPin, ArrowLeft } from 'lucide-react';
import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';

const mockProperties = [
    {
        id: '1',
        title: 'Spacious Beachfront Villa',
        address: '123 Ocean View Drive, Sunnydale',
        images: [
            'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
            'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        ],
        details: {
            rooms: 3,
            bathrooms: 2,
            carSpaces: 2,
        },
        rentalType: 'whole_property',
        rooms: [],
    },
    {
        id: '2',
        title: 'Modern Downtown Loft',
        address: '789 Central Square, Metro City',
        images: [
          'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
        ],
        details: {
            rooms: 4,
            bathrooms: 3,
            carSpaces: 2,
        },
        rentalType: 'room_by_room',
        rooms: [
            { id: 'room1', roomLabel: 'Master Bedroom', weeklyRent: 300, furnishedStatus: 'Furnished' },
            { id: 'room2', roomLabel: 'Sunny Guest Room', weeklyRent: 250, furnishedStatus: 'Unfurnished' },
        ],
    },
];

export const PropertyDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [property, setProperty] = useState<any>(null);

    useEffect(() => {
        if (!id) {
            setProperty(mockProperties[0]);
            return;
        };
        const foundProperty = mockProperties.find(p => p.id === id);
        setProperty(foundProperty || mockProperties[0]);
    }, [id]);

    if (!property) return <div className="py-12 text-center text-slate-500">Loading...</div>;

    const showWholeProperty = property.rentalType === 'whole_property' || property.rentalType === 'mixed';
    const showRooms = property.rentalType === 'room_by_room' || property.rentalType === 'mixed';

    return (
      <>
        <PublicNav />
        <div className="max-w-6xl mx-auto py-12 px-6 space-y-8">
            <Link to="/properties" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mb-4">
                <ArrowLeft size={16} />
                Back to available properties
            </Link>
            <div>
                <h1 className="text-4xl font-extrabold text-slate-900 tracking-tighter mb-2">{property.title}</h1>
                <div className="flex items-center text-slate-600 gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    <p className="text-lg">{property.address}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="md:col-span-2 space-y-6">
                    <img src={property.images?.[0] && property.images[0].trim() !== '' ? property.images[0] : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1200'} alt={property.title} className="w-full h-96 object-cover rounded-3xl" />
                    {property.images && property.images.length > 1 && (
                        <div className="grid grid-cols-4 gap-4">
                            {property.images.slice(1, 5).map((img: string, idx: number) => (
                                <img key={idx} src={img || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=300'} alt={`${property.title} - ${idx + 2}`} className="w-full h-32 object-cover rounded-2xl" />
                            ))}
                        </div>
                    )}
                    
                    <div className="flex gap-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                        <div className="flex items-center gap-2 font-semibold text-lg"><BedDouble className="text-primary"/> {property.details?.rooms || 0} Beds</div>
                        <div className="flex items-center gap-2 font-semibold text-lg"><Bath className="text-primary"/> {property.details?.bathrooms || 0} Baths</div>
                        <div className="flex items-center gap-2 font-semibold text-lg"><Car className="text-primary"/> {property.details?.carSpaces || 0} Cars</div>
                    </div>

                    {showRooms && property.rooms && (
                      <div className="space-y-6">
                        <h2 className="text-2xl font-bold">Available Rooms</h2>
                        {property.rooms.map((room: any) => (
                          <div key={room.id} className="border border-slate-100 p-6 rounded-2xl flex justify-between items-center">
                            <div>
                              <h3 className="font-bold text-lg">{room.roomLabel}</h3>
                              <p className="text-slate-500">${room.weeklyRent}/week | {room.furnishedStatus}</p>
                            </div>
                            <div className="flex gap-2">
                              <Link to={`/book/inspection/${property.id}?roomId=${room.id}`} className="bg-slate-100 text-slate-900 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200">Inspect</Link>
                              <Link to="/engage-us" className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:opacity-90">Apply</Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>

                <div className="md:col-span-1">
                    {showWholeProperty && (
                      <div className="bg-white border border-slate-100 rounded-3xl p-8 sticky top-28 shadow-xl space-y-6 outline outline-1 outline-slate-100 z-40">
                          <h3 className="font-bold text-xl">Interested in the whole property?</h3>
                          <div className="flex flex-col gap-3">
                              <Link to={`/book/inspection/${property.id}`} className="w-full text-center bg-primary text-white font-semibold py-4 rounded-xl hover:opacity-90 transition">Inspect Property</Link>
                              <Link to="/engage-us" className="w-full text-center bg-white border border-outline-variant font-semibold py-4 rounded-xl hover:bg-slate-50 transition">Apply for Property</Link>
                          </div>
                      </div>
                    )}
                </div>
            </div>
        </div>
        <Footer />
      </>
    );
};