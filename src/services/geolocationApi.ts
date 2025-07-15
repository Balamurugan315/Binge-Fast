
interface GeolocationResponse {
  country_code: string;
  country: string;
  region?: string;
  region_code?: string;
  city?: string;
}

interface RegionPreference {
  region: string;
  languages: string[];
  displayName: string;
}

class GeolocationService {
  private cachedCountry: string | null = null;
  private cachedRegion: string | null = null;
  private cachedRegionPreference: RegionPreference | null = null;

  // Mapping of Indian states to preferred languages
  private indianRegionMapping: { [key: string]: RegionPreference } = {
    'Tamil Nadu': { region: 'Tamil Nadu', languages: ['Tamil', 'English'], displayName: 'Tamil Nadu, India' },
    'Andhra Pradesh': { region: 'Andhra Pradesh', languages: ['Telugu', 'English'], displayName: 'Andhra Pradesh, India' },
    'Telangana': { region: 'Telangana', languages: ['Telugu', 'English'], displayName: 'Telangana, India' },
    'Karnataka': { region: 'Karnataka', languages: ['Kannada', 'English'], displayName: 'Karnataka, India' },
    'Kerala': { region: 'Kerala', languages: ['Malayalam', 'English'], displayName: 'Kerala, India' },
    'West Bengal': { region: 'West Bengal', languages: ['Bengali', 'Hindi', 'English'], displayName: 'West Bengal, India' },
    'Maharashtra': { region: 'Maharashtra', languages: ['Marathi', 'Hindi', 'English'], displayName: 'Maharashtra, India' },
    'Gujarat': { region: 'Gujarat', languages: ['Gujarati', 'Hindi', 'English'], displayName: 'Gujarat, India' },
    'Rajasthan': { region: 'Rajasthan', languages: ['Hindi', 'English'], displayName: 'Rajasthan, India' },
    'Punjab': { region: 'Punjab', languages: ['Punjabi', 'Hindi', 'English'], displayName: 'Punjab, India' },
    'Haryana': { region: 'Haryana', languages: ['Hindi', 'English'], displayName: 'Haryana, India' },
    'Uttar Pradesh': { region: 'Uttar Pradesh', languages: ['Hindi', 'English'], displayName: 'Uttar Pradesh, India' },
    'Bihar': { region: 'Bihar', languages: ['Hindi', 'English'], displayName: 'Bihar, India' },
    'Madhya Pradesh': { region: 'Madhya Pradesh', languages: ['Hindi', 'English'], displayName: 'Madhya Pradesh, India' },
    'Odisha': { region: 'Odisha', languages: ['Odia', 'Hindi', 'English'], displayName: 'Odisha, India' },
    'Assam': { region: 'Assam', languages: ['Assamese', 'Hindi', 'English'], displayName: 'Assam, India' },
  };

  async getUserLocationData(): Promise<{ country: string; region: string; regionPreference: RegionPreference | null }> {
    // Return cached data if available
    if (this.cachedCountry && this.cachedRegion) {
      return {
        country: this.cachedCountry,
        region: this.cachedRegion,
        regionPreference: this.cachedRegionPreference
      };
    }

    try {
      // Try ipapi.co first
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data: GeolocationResponse = await response.json();
        this.cachedCountry = data.country_code || 'US';
        this.cachedRegion = data.region || '';
        
        // Get region preference for Indian states
        if (this.cachedCountry === 'IN' && data.region) {
          this.cachedRegionPreference = this.indianRegionMapping[data.region] || null;
        }
        
        console.log('User location detected:', {
          country: this.cachedCountry,
          region: this.cachedRegion,
          preference: this.cachedRegionPreference
        });
        
        return {
          country: this.cachedCountry,
          region: this.cachedRegion,
          regionPreference: this.cachedRegionPreference
        };
      }
    } catch (error) {
      console.warn('Failed to get location from ipapi.co:', error);
    }

    try {
      // Fallback to ipinfo.io
      const response = await fetch('https://ipinfo.io/json');
      if (response.ok) {
        const data = await response.json();
        this.cachedCountry = data.country || 'US';
        this.cachedRegion = data.region || '';
        
        // Get region preference for Indian states
        if (this.cachedCountry === 'IN' && data.region) {
          this.cachedRegionPreference = this.indianRegionMapping[data.region] || null;
        }
        
        console.log('User location detected (fallback):', {
          country: this.cachedCountry,
          region: this.cachedRegion,
          preference: this.cachedRegionPreference
        });
        
        return {
          country: this.cachedCountry,
          region: this.cachedRegion,
          regionPreference: this.cachedRegionPreference
        };
      }
    } catch (error) {
      console.warn('Failed to get location from ipinfo.io:', error);
    }

    // Default to US if all services fail
    this.cachedCountry = 'US';
    this.cachedRegion = '';
    this.cachedRegionPreference = null;
    console.log('Using default location: US');
    
    return {
      country: this.cachedCountry,
      region: this.cachedRegion,
      regionPreference: this.cachedRegionPreference
    };
  }

  async getUserCountry(): Promise<string> {
    const locationData = await this.getUserLocationData();
    return locationData.country;
  }

  getPreferredLanguages(countryCode: string, region?: string): string[] {
    if (countryCode === 'IN' && region && this.indianRegionMapping[region]) {
      return this.indianRegionMapping[region].languages;
    }
    
    // Default language preferences by country
    const countryLanguages: { [key: string]: string[] } = {
      'IN': ['Hindi', 'English'],
      'US': ['English'],
      'GB': ['English'],
      'CA': ['English', 'French'],
      'AU': ['English'],
      'DE': ['German'],
      'FR': ['French'],
      'BR': ['Portuguese'],
      'MX': ['Spanish'],
      'JP': ['Japanese'],
      'KR': ['Korean']
    };
    
    return countryLanguages[countryCode] || ['English'];
  }

  // Get country mapping for TMDB (uses different codes)
  getTMDBRegion(countryCode: string): string {
    const mapping: { [key: string]: string } = {
      'IN': 'IN',
      'US': 'US',
      'GB': 'GB',
      'CA': 'CA',
      'AU': 'AU',
      'DE': 'DE',
      'FR': 'FR',
      'BR': 'BR',
      'MX': 'MX',
      'JP': 'JP',
      'KR': 'KR'
    };
    return mapping[countryCode] || 'US';
  }

  // Get country mapping for Streaming Availability API (lowercase)
  getStreamingCountry(countryCode: string): string {
    return countryCode.toLowerCase();
  }
}

export const geolocationService = new GeolocationService();
