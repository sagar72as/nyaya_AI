import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  MapPin, 
  Star, 
  Phone, 
  Mail, 
  Globe, 
  Filter,
  CheckCircle,
  Award,
  Clock
} from 'lucide-react';

interface Lawyer {
  id: string;
  name: string;
  firm: string;
  specialties: string[];
  location: string;
  rating: number;
  reviewCount: number;
  experience: number;
  hourlyRate: string;
  availability: 'Available' | 'Busy' | 'Unavailable';
  verified: boolean;
  phone: string;
  email: string;
  website?: string;
  description: string;
  languages: string[];
}

const lawyers: Lawyer[] = [
  {
    id: '1',
    name: 'Priya Sharma',
    firm: 'Sharma Legal Services',
    specialties: ['Corporate Law', 'Startup Advisory', 'Contract Law'],
    location: 'Bangalore, Karnataka',
    rating: 4.9,
    reviewCount: 157,
    experience: 10,
    hourlyRate: '₹4,000-₹6,000',
    availability: 'Available',
    verified: true,
    phone: '+91 98765 43210',
    email: 'priya.sharma@sharmalegal.in',
    website: 'www.sharmalegal.in',
    description: 'Corporate lawyer with a decade of experience helping startups and SMEs with company formation, contracts, and compliance.',
    languages: ['English', 'Hindi', 'Kannada']
  },
  {
    id: '2',
    name: 'Arjun Verma',
    firm: 'Verma Law Chambers',
    specialties: ['Criminal Law', 'Bail Matters'],
    location: 'Delhi, Delhi',
    rating: 3.2,
    reviewCount: 18,
    experience: 6,
    hourlyRate: '₹2,500-₹3,500',
    availability: 'Busy',
    verified: true,
    phone: '+91 90001 12345',
    email: 'arjun.verma@vermalaw.in',
    description: 'Focused criminal lawyer representing clients in bail, defense, and FIR quash cases.',
    languages: ['Hindi', 'English']
  },
  {
    id: '3',
    name: 'Shweta Rao',
    firm: 'Rao & Partners',
    specialties: ['Family Law', 'Divorce', 'Child Custody'],
    location: 'Hyderabad, Telangana',
    rating: 4.7,
    reviewCount: 108,
    experience: 12,
    hourlyRate: '₹3,000-₹4,000',
    availability: 'Available',
    verified: true,
    phone: '+91 99887 11223',
    email: 'shweta.rao@raopartners.com',
    website: 'www.raopartners.com',
    description: 'Empathetic family lawyer with a strong record in divorce and custody cases. Fluent in Telugu.',
    languages: ['English', 'Telugu', 'Hindi']
  },
  {
    id: '4',
    name: 'Madhav Singh',
    firm: 'Singh & Co.',
    specialties: ['Property Law', 'Civil Litigation'],
    location: 'Lucknow, Uttar Pradesh',
    rating: 2.8,
    reviewCount: 8,
    experience: 7,
    hourlyRate: '₹1,500-₹2,500',
    availability: 'Unavailable',
    verified: false,
    phone: '+91 91234 56789',
    email: 'madhav.singh@singhco.com',
    description: 'General civil lawyer, handles land disputes, property partition, and title suits.',
    languages: ['Hindi']
  },
  {
    id: '5',
    name: 'Fatima Khan',
    firm: 'Khan Legal Associates',
    specialties: ['Labour Law', 'Employment Law'],
    location: 'Mumbai, Maharashtra',
    rating: 4.2,
    reviewCount: 41,
    experience: 9,
    hourlyRate: '₹2,000-₹3,000',
    availability: 'Available',
    verified: true,
    phone: '+91 90000 12345',
    email: 'fatima.khan@khanlegal.com',
    website: 'www.khanlegal.com',
    description: 'Specialist in labor and employment law for companies and workers in Mumbai.',
    languages: ['English', 'Hindi', 'Marathi']
  },
  {
    id: '6',
    name: 'Kiran Patil',
    firm: 'Patil Associates',
    specialties: ['Intellectual Property', 'Copyright', 'Trademark'],
    location: 'Pune, Maharashtra',
    rating: 4.8,
    reviewCount: 59,
    experience: 11,
    hourlyRate: '₹5,000-₹7,500',
    availability: 'Available',
    verified: true,
    phone: '+91 97654 33221',
    email: 'kiran.patil@patilassociates.in',
    website: 'www.patilassociates.in',
    description: 'IP lawyer with expertise in trademarks and copyrights for startups and artists.',
    languages: ['English', 'Marathi', 'Hindi']
  },
  {
    id: '7',
    name: 'Dinesh Nair',
    firm: 'Nair & Nair',
    specialties: ['Real Estate Law', 'Landlord-Tenant', 'Property Registration'],
    location: 'Kochi, Kerala',
    rating: 4.0,
    reviewCount: 34,
    experience: 14,
    hourlyRate: '₹2,200-₹3,800',
    availability: 'Busy',
    verified: false,
    phone: '+91 98456 67890',
    email: 'dinesh.nair@nairlaw.in',
    description: 'Handles all property-related legal work. Services for both NRIs and residents.',
    languages: ['English', 'Malayalam', 'Hindi']
  },
  {
    id: '8',
    name: 'Manisha Banerjee',
    firm: 'Banerjee Law Office',
    specialties: ['Consumer Disputes', 'Cheque Bounce', 'Debt Recovery'],
    location: 'Kolkata, West Bengal',
    rating: 2.9,
    reviewCount: 11,
    experience: 5,
    hourlyRate: '₹1,200-₹1,800',
    availability: 'Available',
    verified: true,
    phone: '+91 98321 12321',
    email: 'manisha.banerjee@banerjeelaw.in',
    description: 'Litigator for consumer cases, cheque bounce, and summary suits.',
    languages: ['Bengali', 'Hindi', 'English']
  },
  {
    id: '9',
    name: 'Rajiv Menon',
    firm: 'Menon Advocates',
    specialties: ['Taxation', 'Income Tax', 'GST'],
    location: 'Chennai, Tamil Nadu',
    rating: 4.6,
    reviewCount: 65,
    experience: 13,
    hourlyRate: '₹3,000-₹5,000',
    availability: 'Available',
    verified: true,
    phone: '+91 98840 55660',
    email: 'rajiv.menon@menonadv.in',
    website: 'www.menonadv.in',
    description: 'Specializes in tax disputes, GST, and regulatory filings for individuals and businesses.',
    languages: ['English', 'Tamil', 'Hindi']
  },
  {
    id: '10',
    name: 'Sunita Reddy',
    firm: 'Reddy Legal Solutions',
    specialties: ['Environmental Law', 'Public Interest Litigation'],
    location: 'Hyderabad, Telangana',
    rating: 3.6,
    reviewCount: 21,
    experience: 8,
    hourlyRate: '₹2,500-₹4,500',
    availability: 'Busy',
    verified: false,
    phone: '+91 80080 40040',
    email: 'sunita.reddy@reddylegal.in',
    description: 'Works on green initiatives, PILs, and environmental clearances.',
    languages: ['English', 'Telugu', 'Hindi']
  }
];

const Lawyers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  // Get unique values for filters
  const locations = [...new Set(lawyers.map(lawyer => lawyer.location))];
  const specialties = [...new Set(lawyers.flatMap(lawyer => lawyer.specialties))];

  // Filter lawyers based on search criteria
  const filteredLawyers = useMemo(() => {
    return lawyers.filter(lawyer => {
      const matchesSearch = searchTerm === '' || 
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.firm.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.specialties.some(specialty => specialty.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesLocation = locationFilter === '' || lawyer.location === locationFilter;
      const matchesSpecialty = specialtyFilter === '' || lawyer.specialties.includes(specialtyFilter);
      const matchesRating = ratingFilter === '' || lawyer.rating >= parseFloat(ratingFilter);
      const matchesAvailability = availabilityFilter === '' || lawyer.availability === availabilityFilter;

      return matchesSearch && matchesLocation && matchesSpecialty && matchesRating && matchesAvailability;
    });
  }, [searchTerm, locationFilter, specialtyFilter, ratingFilter, availabilityFilter]);

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setSpecialtyFilter('');
    setRatingFilter('');
    setAvailabilityFilter('');
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-100 text-green-800';
      case 'Busy': return 'bg-yellow-100 text-yellow-800';
      case 'Unavailable': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-extrabold text-teal-600 mb-1">Find Qualified Lawyers</h1>
        <p className="text-base text-slate-700">
          Connect with experienced Indian lawyers in your city and language
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8 legal-shadow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Filter className="h-5 w-5" />
            <span>Search & Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, firm, or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <select
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="">All Locations</option>
              {locations.map(location => (
                <option key={location} value={location}>{location}</option>
              ))}
            </select>

            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="">All Specialties</option>
              {specialties.map(specialty => (
                <option key={specialty} value={specialty}>{specialty}</option>
              ))}
            </select>

            <select
              value={ratingFilter}
              onChange={(e) => setRatingFilter(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>

            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              className="border rounded-md px-4 py-2"
            >
              <option value="">Any Availability</option>
              <option value="Available">Available</option>
              <option value="Busy">Busy</option>
              <option value="Unavailable">Unavailable</option>
            </select>

            <Button variant="outline" onClick={clearFilters} className="w-full">
              Clear Filters
            </Button>
          </div>
          
          <div className="text-sm text-muted-foreground">
            Showing {filteredLawyers.length} of {lawyers.length} lawyers
          </div>
        </CardContent>
      </Card>

      {/* Lawyers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredLawyers.map((lawyer) => (
          <Card key={lawyer.id} className="legal-hover-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <CardTitle className="text-lg">{lawyer.name}</CardTitle>
                    {lawyer.verified && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{lawyer.firm}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{lawyer.rating}</span>
                      <span className="text-sm text-muted-foreground">
                        ({lawyer.reviewCount} reviews)
                      </span>
                    </div>
                  </div>
                </div>
                <Badge className={getAvailabilityColor(lawyer.availability)}>
                  {lawyer.availability}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                {/* Specialties */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Practice Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {lawyer.specialties.map((specialty) => (
                      <Badge key={specialty} variant="secondary" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.experience} yrs exp.</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.hourlyRate}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span>{lawyer.languages.join(', ')}</span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {lawyer.description}
                </p>

                {/* Contact Actions */}
                <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t border-border">
                  <Button className="flex-1" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  {lawyer.website && (
                    <Button variant="outline" size="sm">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredLawyers.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="max-w-md mx-auto">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No lawyers found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or clearing the filters to see more results.
              </p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Lawyers;