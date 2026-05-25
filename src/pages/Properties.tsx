import PublicNav from '../components/PublicNav';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';
import { MapPin, BedDouble, Bath, Car, Search } from 'lucide-react';

const properties = [
    { id: 1, address: '123 Ocean View Drive, Sunnydale', price: '650', beds: 3, baths: 2, cars: 2, imageUrl: 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', status: 'For Rent' },
    { id: 2, address: '456 Park Avenue, Greenfield', price: '520', beds: 2, baths: 1, cars: 1, imageUrl: 'https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', status: 'For Rent' },
    { id: 3, address: '789 Central Square, Metro City', price: '800', beds: 4, baths: 3, cars: 2, imageUrl: 'https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', status: 'Rented' },
    { id: 4, address: '101 Maple Lane, Suburbia', price: '480', beds: 2, baths: 2, cars: 1, imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', status: 'For Rent' },
    { id: 5, address: '210 Hilltop Rd, Riverbend', price: '710', beds: 3, baths: 2, cars: 2, imageUrl: 'https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', status: 'For Rent' },
    { id: 6, address: '333 Downtown Loft, Unit 5B', price: '950', beds: 1, baths: 1, cars: 0, imageUrl: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2', status: 'Rented' },
];

export default function PropertiesPage() {
    return (
        <div className="bg-white">
            <PublicNav />
            <main className="isolate">
                <div className="relative pt-14">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
                        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
                    </div>
                    <div className="py-24 sm:py-32">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <div className="mx-auto max-w-2xl text-center">
                                <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Our Managed Properties</h1>
                                <p className="mt-6 text-lg leading-8 text-gray-600">Explore the portfolio of properties we support on behalf of our agency clients. This is a showcase of the quality homes we help manage.</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-12">
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Rental Listings</h2>
                            <div className="mt-6 md:mt-0 flex items-center gap-4">
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                    </div>
                                    <input type="text" placeholder="Search by address..." className="block w-full rounded-md border-0 bg-white py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm" />
                                </div>
                                <select className="rounded-md border-0 bg-white py-2 pl-3 pr-8 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm">
                                    <option>All Statuses</option>
                                    <option>For Rent</option>
                                    <option>Rented</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
                            {properties.map((property) => (
                                <div key={property.id} className="group relative">
                                    <Link to={`/properties/${property.id}`} className="block">
                                        <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg bg-gray-200 xl:aspect-h-8 xl:aspect-w-7">
                                            <img src={property.imageUrl} alt={property.address} className="h-full w-full object-cover object-center group-hover:opacity-75" />
                                        </div>
                                        <div className="mt-4 flex justify-between">
                                            <div>
                                                <h3 className="text-sm text-gray-700 flex items-center">
                                                    <MapPin className="inline h-4 w-4 mr-1 text-gray-500"/> {property.address}
                                                </h3>
                                                <div className="mt-2 flex items-center text-sm text-gray-500">
                                                    <span className="mr-4 flex items-center"><BedDouble className="h-4 w-4 mr-1"/> {property.beds}</span>
                                                    <span className="mr-4 flex items-center"><Bath className="h-4 w-4 mr-1"/> {property.baths}</span>
                                                    <span className="flex items-center"><Car className="h-4 w-4 mr-1"/> {property.cars}</span>
                                                </div>
                                            </div>
                                            <p className="text-lg font-medium text-gray-900">${property.price}<span className="text-sm font-normal text-gray-500">/wk</span></p>
                                        </div>
                                    </Link>
                                    <span className={`absolute top-2 left-2 rounded-full px-3 py-1 text-xs font-semibold ${property.status === 'For Rent' ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                                        {property.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="bg-white">
                    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
                        <div className="relative isolate overflow-hidden bg-primary px-6 py-24 text-center shadow-2xl sm:rounded-3xl sm:px-16">
                            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">Are You an Agency Looking for Support?</h2>
                            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-indigo-100">ProInspect provides the reliable field support you need to manage your portfolio efficiently. Let us handle the inspections, so you can focus on your clients.</p>
                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link to="/engage-us" className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-primary shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Book a Consultation</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
