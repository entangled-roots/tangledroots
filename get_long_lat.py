import pandas as pd
import geopy


from geopy.geocoders import Nominatim
from time import sleep

# Load your CSV file
input_file = 'database_postcodes.csv'  # Input CSV containing postcodes and addresses
output_file = 'locations_with_coords.csv'  # Output CSV with lat/lng
data = pd.read_csv(input_file)

# Initialize geolocator
geolocator = Nominatim(user_agent="myGeocoder")

# Function to get latitude and longitude
def get_coordinates(address):
    try:
        location = geolocator.geocode(address)
        if location:
            return location.latitude, location.longitude
        else:
            return None, None
    except:
        return None, None

# Apply geocoding
data['Latitude'], data['Longitude'] = zip(*data['Postcode'].apply(get_coordinates))

# Save the new CSV file
data.to_csv(output_file, index=False)

print(f"Geocoded data saved to {output_file}")
