/**
 * Trip Planner Service
 * Handles external API integrations for flight, hotel, and activity data
 * Currently uses mock data, but can be easily extended to use real APIs
 */

class TripPlannerService {
    constructor() {
        this.apiKeys = {
            skyscanner: process.env.SKYSCANNER_API_KEY,
            booking: process.env.BOOKING_API_KEY,
            amadeus: process.env.AMADEUS_API_KEY,
            viator: process.env.VIATOR_API_KEY
        };
    }

    /**
     * Get flight prices from multiple sources
     * In production, this would call real APIs like Skyscanner, Amadeus, etc.
     */
    async getFlightPrices(origin, destination, departDate, returnDate, passengers = 1) {
        try {
            // Mock implementation - replace with real API calls
            const mockData = await this.mockFlightAPI(origin, destination, departDate, returnDate, passengers);
            
            // In production, you would call multiple APIs and compare prices:
            // const skyscannerData = await this.callSkyscannerAPI(...);
            // const amadeusData = await this.callAmadeusAPI(...);
            // return this.comparePrices([skyscannerData, amadeusData]);
            
            return mockData;
        } catch (error) {
            console.error('Flight API error:', error);
            throw new Error('Failed to fetch flight prices');
        }
    }

    /**
     * Get hotel prices and availability
     * In production, this would call Booking.com, Hotels.com, etc.
     */
    async getHotelPrices(destination, checkIn, checkOut, guests, roomType = 'standard') {
        try {
            // Mock implementation
            const mockData = await this.mockHotelAPI(destination, checkIn, checkOut, guests, roomType);
            
            // In production:
            // const bookingData = await this.callBookingAPI(...);
            // const hotelsData = await this.callHotelsAPI(...);
            // return this.compareHotelPrices([bookingData, hotelsData]);
            
            return mockData;
        } catch (error) {
            console.error('Hotel API error:', error);
            throw new Error('Failed to fetch hotel prices');
        }
    }

    /**
     * Get activity and tour prices
     * In production, this would call GetYourGuide, Viator, etc.
     */
    async getActivityPrices(destination, duration, travelers, interests = []) {
        try {
            // Mock implementation
            const mockData = await this.mockActivityAPI(destination, duration, travelers, interests);
            
            // In production:
            // const viatorData = await this.callViatorAPI(...);
            // const getYourGuideData = await this.callGetYourGuideAPI(...);
            // return this.compareActivityPrices([viatorData, getYourGuideData]);
            
            return mockData;
        } catch (error) {
            console.error('Activity API error:', error);
            throw new Error('Failed to fetch activity prices');
        }
    }

    /**
     * Get currency exchange rates
     * In production, use exchangerate-api.com or similar
     */
    async getExchangeRates(baseCurrency = 'USD') {
        try {
            // Mock rates - replace with real API
            const mockRates = {
                'USD': { 'EUR': 0.85, 'GBP': 0.73, 'INR': 83.12, 'JPY': 149.50 },
                'EUR': { 'USD': 1.18, 'GBP': 0.86, 'INR': 97.89, 'JPY': 176.19 },
                'GBP': { 'USD': 1.37, 'EUR': 1.16, 'INR': 113.87, 'JPY': 204.93 },
                'INR': { 'USD': 0.012, 'EUR': 0.010, 'GBP': 0.0088, 'JPY': 1.80 }
            };

            return mockRates[baseCurrency] || mockRates['USD'];
        } catch (error) {
            console.error('Exchange rate API error:', error);
            return { 'USD': 1 }; // Fallback
        }
    }

    // Mock API implementations (replace with real API calls in production)
    
   


    async mockFlightAPI(origin, destination, departDate, returnDate, passengers) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Normalize city names to lowercase for consistent lookups
    const lowerOrigin = origin.trim().toLowerCase();
    const lowerDestination = destination.trim().toLowerCase();

    // Expanded routes with Indian cities and realistic pricing - using lowercase keys
    const routes = {
        // International routes from major cities
        'new york': { 'paris': 450, 'tokyo': 800, 'london': 400, 'dubai': 600, 'mumbai': 900, 'delhi': 850 },
        'london': { 'paris': 150, 'tokyo': 700, 'new york': 400, 'dubai': 350, 'mumbai': 500, 'delhi': 480 },
        'mumbai': { 'dubai': 200, 'london': 500, 'paris': 550, 'tokyo': 400, 'new york': 900, 'delhi': 80, 'kolkata': 120, 'goa': 150, 'bangalore': 100, 'chennai': 110, 'hyderabad': 90 },
        'delhi': { 'dubai': 180, 'london': 480, 'paris': 520, 'tokyo': 380, 'new york': 850, 'mumbai': 80, 'kolkata': 100, 'goa': 130, 'bangalore': 120, 'chennai': 130, 'hyderabad': 70 },
        'kolkata': { 'mumbai': 120, 'delhi': 100, 'goa': 180, 'bangalore': 140, 'chennai': 150, 'hyderabad': 120, 'dubai': 250, 'singapore': 300, 'imphal': 100 },
        'goa': { 'mumbai': 150, 'delhi': 130, 'kolkata': 180, 'bangalore': 160, 'chennai': 170, 'hyderabad': 140 },
        'bangalore': { 'mumbai': 100, 'delhi': 120, 'kolkata': 140, 'goa': 160, 'chennai': 50, 'hyderabad': 60, 'dubai': 220 },
        'chennai': { 'mumbai': 110, 'delhi': 130, 'kolkata': 150, 'goa': 170, 'bangalore': 50, 'hyderabad': 80 },
        'hyderabad': { 'mumbai': 90, 'delhi': 70, 'kolkata': 120, 'goa': 140, 'bangalore': 60, 'chennai': 80 },
        'paris': { 'london': 150, 'new york': 450, 'tokyo': 650, 'dubai': 400 },
        'tokyo': { 'new york': 800, 'london': 700, 'paris': 650, 'dubai': 550 },
        'dubai': { 'london': 350, 'paris': 400, 'new york': 600, 'tokyo': 550, 'mumbai': 200, 'delhi': 180 }
    };

    const basePrice = routes[lowerOrigin]?.[lowerDestination] || 500;
    const variation = Math.random() * 0.5 - 0.25; // ±25% variation
    const seasonalMultiplier = this.getSeasonalMultiplier(new Date(departDate).getMonth());

    // Determine if route is domestic (both cities in India)
    const indianCities = ['Mumbai', 'Delhi', 'Kolkata', 'Goa', 'Bangalore', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Jaipur', 'Pune', 'Imphal', 'Guwahati', 'Shillong', 'Agartala', 'Aizawl', 'Dibrugarh', 'Silchar'];
    const isDomestic = indianCities.some(city => city.toLowerCase() === lowerOrigin) &&
                      indianCities.some(city => city.toLowerCase() === lowerDestination);

    // Select appropriate airline based on route type
    let airlines;
    if (isDomestic) {
        airlines = ['Indigo', 'Air India', 'SpiceJet', 'Vistara', 'GoAir'];
    } else {
        airlines = ['Emirates', 'British Airways', 'Lufthansa', 'Air India', 'Qatar Airways', 'Singapore Airlines', 'Thai Airways'];
    }

    // Get realistic duration and stops based on route
    const flightDetails = this.getFlightDetails(lowerOrigin, lowerDestination, isDomestic);

    return {
        price: Math.round(basePrice * (1 + variation) * seasonalMultiplier),
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        duration: flightDetails.duration,
        stops: flightDetails.stops,
        availability: Math.random() > 0.2,
        bookingClass: ['Economy', 'Premium Economy', 'Business'][Math.floor(Math.random() * 3)],
        baggage: '20kg included',
        refundable: Math.random() > 0.5
    };
}


    async mockHotelAPI(destination, checkIn, checkOut, guests, roomType) {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        const hotelTypes = {
            'budget': { 
                name: 'Budget Inn', 
                rating: 2.5, 
                amenities: ['WiFi', 'Breakfast'],
                basePrice: 60
            },
            'standard': { 
                name: 'Comfort Hotel', 
                rating: 4.0, 
                amenities: ['WiFi', 'Pool', 'Gym', 'Restaurant'],
                basePrice: 120
            },
            'luxury': { 
                name: 'Grand Resort', 
                rating: 4.8, 
                amenities: ['WiFi', 'Spa', 'Pool', 'Concierge', 'Fine Dining'],
                basePrice: 280
            }
        };
        
        const hotel = hotelTypes[roomType] || hotelTypes['standard'];
        const variation = Math.random() * 0.3 - 0.15;
        const destinationMultiplier = this.getDestinationMultiplier(destination);
        
        return {
            pricePerNight: Math.round(hotel.basePrice * (1 + variation) * destinationMultiplier),
            hotelName: hotel.name,
            rating: hotel.rating,
            amenities: hotel.amenities,
            availability: Math.random() > 0.15,
            cancellation: roomType !== 'budget',
            breakfast: hotel.amenities.includes('Breakfast'),
            wifi: true,
            location: 'City Center'
        };
    }



    

    async mockActivityAPI(destination, duration, travelers, interests) {
        await new Promise(resolve => setTimeout(resolve, 400));
        
        const activities = {
            'cultural': ['Museum Tour', 'Historical Walk', 'Art Gallery Visit', 'Cultural Show'],
            'adventure': ['Hiking Tour', 'Water Sports', 'Rock Climbing', 'Zip Lining'],
            'food': ['Food Tour', 'Cooking Class', 'Wine Tasting', 'Street Food Walk'],
            'nature': ['Nature Walk', 'Wildlife Safari', 'Botanical Garden', 'Beach Day'],
            'default': ['City Tour', 'Sightseeing', 'Local Experience', 'Photography Walk']
        };
        
        const activityType = interests.length > 0 ? interests[0] : 'default';
        const availableActivities = activities[activityType] || activities['default'];
        
        return {
            averagePrice: Math.round(25 + Math.random() * 75), // $25-100 per activity
            recommendedActivities: availableActivities.slice(0, Math.min(duration, 4)),
            totalActivities: Math.min(duration * 2, 10),
            bookingRequired: Math.random() > 0.3,
            groupDiscount: travelers > 4,
            cancellationPolicy: '24 hours free cancellation'
        };
    }

    getSeasonalMultiplier(month) {
        // Peak season months (summer and winter holidays)
        const peakMonths = [5, 6, 7, 8, 11]; // Jun-Sep, Dec
        return peakMonths.includes(month) ? 1.3 : 0.9;
    }

    getDestinationMultiplier(destination) {
        const multipliers = {
            'Tokyo': 1.4,
            'Paris': 1.3,
            'London': 1.2,
            'Dubai': 1.1,
            'New York': 1.2,
            'Mumbai': 0.6,
            'Delhi': 0.5,
            'Bangkok': 0.7,
            'Singapore': 1.1
        };

        return multipliers[destination] || 1.0;
    }

    /**
     * Get realistic flight duration and stops based on route
     */
    getFlightDetails(origin, destination, isDomestic) {
        // Domestic Indian flight durations (in hours) - using lowercase keys
        const domesticDurations = {
            'mumbai-delhi': 2.5, 'delhi-mumbai': 2.5,
            'mumbai-kolkata': 3.0, 'kolkata-mumbai': 3.0,
            'delhi-kolkata': 2.0, 'kolkata-delhi': 2.0,
            'mumbai-goa': 1.5, 'goa-mumbai': 1.5,
            'delhi-goa': 2.5, 'goa-delhi': 2.5,
            'kolkata-goa': 2.5, 'goa-kolkata': 2.5,
            'kolkata-imphal': 1.5, 'imphal-kolkata': 1.5,
            'mumbai-bangalore': 2.0, 'bangalore-mumbai': 2.0,
            'delhi-bangalore': 2.5, 'bangalore-delhi': 2.5,
            'mumbai-chennai': 2.5, 'chennai-mumbai': 2.5,
            'delhi-chennai': 2.5, 'chennai-delhi': 2.5,
            'bangalore-chennai': 1.0, 'chennai-bangalore': 1.0,
            'mumbai-hyderabad': 1.5, 'hyderabad-mumbai': 1.5,
            'delhi-hyderabad': 2.0, 'hyderabad-delhi': 2.0,
            'bangalore-hyderabad': 1.0, 'hyderabad-bangalore': 1.0,
            'chennai-hyderabad': 1.5, 'hyderabad-chennai': 1.5
        };

        // International flight durations (in hours) - using lowercase keys
        const internationalDurations = {
            'mumbai-dubai': 3.5, 'dubai-mumbai': 3.5,
            'delhi-dubai': 3.5, 'dubai-delhi': 3.5,
            'mumbai-london': 9.0, 'london-mumbai': 9.0,
            'delhi-london': 8.5, 'london-delhi': 8.5,
            'mumbai-paris': 9.5, 'paris-mumbai': 9.5,
            'delhi-paris': 9.0, 'paris-delhi': 9.0,
            'mumbai-new york': 15.0, 'new york-mumbai': 15.0,
            'delhi-new york': 14.5, 'new york-delhi': 14.5,
            'london-new york': 8.0, 'new york-london': 8.0,
            'paris-new york': 8.5, 'new york-paris': 8.5,
            'london-paris': 1.5, 'paris-london': 1.5,
            'dubai-london': 7.0, 'london-dubai': 7.0,
            'dubai-paris': 7.5, 'paris-dubai': 7.5
        };

        // Create case-insensitive route key
        const routeKey = `${origin.toLowerCase()}-${destination.toLowerCase()}`;
        const reverseRouteKey = `${destination.toLowerCase()}-${origin.toLowerCase()}`;

        let duration;

        if (isDomestic) {
            // Check both directions for domestic routes
            duration = domesticDurations[routeKey] || domesticDurations[reverseRouteKey] || 2.0; // Default 2 hours for domestic
        } else {
            // Check both directions for international routes
            duration = internationalDurations[routeKey] || internationalDurations[reverseRouteKey] || 8.0; // Default 8 hours for international
        }

        // Add some variation (±30 minutes)
        const variation = (Math.random() - 0.5) * 0.5;
        duration += variation;

        // Determine stops based on duration and route type
        let stops;
        if (isDomestic) {
            stops = Math.random() > 0.8 ? 1 : 0; // 80% direct domestic flights
        } else {
            if (duration < 5) {
                stops = Math.random() > 0.7 ? 0 : 1; // Short international might have stops
            } else if (duration < 10) {
                stops = Math.random() > 0.5 ? 1 : 0; // Medium haul often 1 stop
            } else {
                stops = Math.random() > 0.3 ? 1 : 2; // Long haul often 1-2 stops
            }
        }

        // Format duration
        const hours = Math.floor(duration);
        const minutes = Math.round((duration - hours) * 60);
        const durationStr = `${hours}h ${minutes}m`;

        return {
            duration: durationStr,
            stops: stops
        };
    }

    /**
     * Generate smart recommendations based on trip data
     */
    generateRecommendations(destination, budgetType, month, duration, travelers) {
        const recommendations = [];
        
        // Budget-specific recommendations
        if (budgetType === 'budget') {
            recommendations.push('🏠 Consider hostels or budget hotels for accommodation');
            recommendations.push('🚌 Use public transportation to save on travel costs');
            recommendations.push('🚶 Look for free walking tours and city attractions');
            recommendations.push('🍜 Try local street food for authentic and affordable meals');
        } else if (budgetType === 'luxury') {
            recommendations.push('✈️ Book flights 2-3 months in advance for better deals');
            recommendations.push('🏨 Consider package deals for flights + hotels');
            recommendations.push('🍾 Look for hotel packages that include breakfast and amenities');
        }
        
        // Duration-specific recommendations
        if (duration > 7) {
            recommendations.push('📅 Book longer stays for potential accommodation discounts');
            recommendations.push('🎫 Consider weekly transport passes for better value');
            recommendations.push('🗓️ Plan rest days to avoid burnout and extra costs');
        }
        
        // Seasonal recommendations
        const peakMonths = [5, 6, 7, 8, 11];
        if (peakMonths.includes(month)) {
            recommendations.push('📈 This is peak season - book early for better prices');
            recommendations.push('📉 Consider shoulder season for 20-30% savings');
            recommendations.push('🎪 Expect crowds at popular attractions');
        } else {
            recommendations.push('💰 Great choice! Off-peak season offers better value');
            recommendations.push('🌤️ Weather might be less predictable, pack accordingly');
        }
        
        // Group size recommendations
        if (travelers > 4) {
            recommendations.push('👥 Look for group discounts on activities and tours');
            recommendations.push('🏠 Consider vacation rentals for larger groups');
        }
        
        return recommendations;
    }

    /**
     * Generate money-saving tips
     */
    generateSavingTips(budgetType, duration, seasonalMultiplier, destination) {
        const tips = [];
        
        if (seasonalMultiplier > 1.2) {
            tips.push('💡 Travel in shoulder season to save 20-30%');
            tips.push('💡 Book accommodations with free cancellation for flexibility');
        }
        
        if (budgetType === 'luxury') {
            tips.push('💡 Use travel reward credit cards for points and perks');
            tips.push('💡 Book directly with hotels for potential upgrades');
        }
        
        if (duration > 5) {
            tips.push('💡 Look for weekly accommodation rates');
            tips.push('💡 Cook some meals to reduce food costs');
            tips.push('💡 Use city tourism cards for attraction discounts');
        }
        
        // Universal tips
        tips.push('💡 Compare prices across multiple booking platforms');
        tips.push('💡 Set price alerts for flights and hotels');
        tips.push('💡 Consider travel insurance for peace of mind');
        tips.push('💡 Download offline maps to avoid roaming charges');
        
        return tips;
    }
}

module.exports = new TripPlannerService();
