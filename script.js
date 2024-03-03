document.getElementById('processAddress').addEventListener('click', processAddress);

async function processAddress() {
    const address = document.getElementById('addressInput').value;
    const apiKey = 'AIzaSyBVKydMEhRhG501mX4vLE2B0GNviCHQu5M';
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
            const formattedAddress = data.results[0].formatted_address;
            const addressComponents = data.results[0].address_components;
            const csvData = formatAddressToCSV(addressComponents);
            document.getElementById('results').textContent = csvData;
            document.getElementById('copyCsv').style.display = 'block';
            document.getElementById('copyCsv').addEventListener('click', () => copyToClipboard(csvData));
        } else {
            document.getElementById('results').textContent = 'Address not found';
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('results').textContent = 'An error occurred';
    }
}

function formatAddressToCSV(addressComponents) {
    let street = '', city = '', state = '', zip = '', street2 = '';
    addressComponents.forEach(component => {
        if (component.types.includes('route')) {
            street += component.long_name;
        }
        if (component.types.includes('street_number')) {
            street = component.long_name + ' ' + street;
        }
        if (component.types.includes('locality')) {
            city = component.long_name;
        }
        if (component.types.includes('administrative_area_level_1')) {
            state = component.short_name;
        }
        if (component.types.includes('postal_code')) {
            zip = component.long_name;
        }
        // Assuming street address 2 can be a subpremise
        if (component.types.includes('subpremise')) {
            street2 = component.long_name;
        }
    });
    return `"${street}","${street2}","${city}","${state}","${zip}"`;
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('CSV copied to clipboard');
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}
