document.getElementById('process-btn').addEventListener('click', function() {
    var addresses = document.getElementById('address-input').value.split('\n');
    processAddresses(addresses);
});

function processAddresses(addressList) {
    var geocoder = new google.maps.Geocoder();
    var results = [];
    var remaining = addressList.length;

    addressList.forEach(function(address, index) {
        geocoder.geocode({ 'address': address.trim() }, function(res, status) {
            if (status == google.maps.GeocoderStatus.OK) {
                var formattedAddress = parseAddress(res[0].address_components);
                results[index] = formattedAddress; // Keep the original order
            } else {
                results[index] = { error: "Geocode failed for address: " + address };
            }

            remaining--;
            if (remaining <= 0) {
                outputResults(results);
            }
        });
    });
}

function parseAddress(components) {
    var parsedData = {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zip: ''
    };

    // Parsing logic here similar to before
    // ...

    return parsedData;
}

function outputResults(results) {
    var csvContent = "";
    csvContent += "Address Line 1,Address Line 2,Town/City,State,Zip Code\n"; // Add the header

    results.forEach(function(row) {
        csvContent += `${row.street1},${row.street2},${row.city},${row.state},${row.zip}\n`;
    });

    var outputTextarea = document.createElement('textarea');
    outputTextarea.setAttribute('readonly', '');
    outputTextarea.style.width = '100%';
    outputTextarea.style.height = '200px';
    outputTextarea.value = csvContent;

    var downloadButton = document.getElementById('download-btn');
    downloadButton.style.display = 'none';

    var formContainer = document.getElementById('form-container');
    formContainer.appendChild(outputTextarea);
}

document.getElementById('download-btn').addEventListener('click', function(e) {
    e.target.style.display = 'none'; // Hide the button after downloading
});