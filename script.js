document.getElementById('processAddresses').addEventListener('click', processAddresses);

let globalCsvData = '';

async function processAddresses() {
    const addresses = document.getElementById('addressInput').value.split('\n');
    const apiKey = 'AIzaSyBVKydMEhRhG501mX4vLE2B0GNviCHQu5M'; // Replace YOUR_API_KEY with your actual Google Maps API key
    let allCsvData = '"Street","Street2","City","State","Zip"\n'; // CSV Header

    try {
        const response = await fetch(url);
        const data = await response.json();
        if (data.status === 'OK') {
            const formattedAddress = data.results[0].formatted_address;
            const addressComponents = data.results[0].address_components;
            const csvData = formatAddressToCSV(addressComponents);
            document.getElementById('results').textContent = csvData;
            globalCsvData = csvData; // Update the global variable with the new CSV data
            document.getElementById('copyCsv').style.display = 'block';
            document.getElementById('downloadCsv').style.display = 'block'; // Show the download button
            document.getElementById('copyCsv').addEventListener('click', () => copyToClipboard(csvData));
            document.getElementById('downloadCsv').addEventListener('click', downloadCSV);
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

function downloadCSV() {
    const blob = new Blob([globalCsvData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'formatted_address.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}