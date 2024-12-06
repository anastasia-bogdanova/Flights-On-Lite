
// Timer to get the access token
let token = null;

const getToken = async () => {
    try {
        const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                client_id: 'CbM3gpSex6Sm0rg7AzN2zUQI2xjaqhnp',
                client_secret: 'LDNQXAsAGHKaGZOx',
            }),
        });

        const data = await response.json();
        if (response.ok) {
            token = data.access_token;
            console.log('Token retrieved:', token);
        } else {
            console.error('Failed to get token:', data);
        }
    } catch (error) {
        console.error('Error fetching token:', error);
    }
};

// Timer to refresh the token every 25 minutes
const startTokenRefresh = () => {
    getToken(); 
    setInterval(getToken, 25 * 60 * 1000); 
};
startTokenRefresh();


// Wait 3 seconds to ensure token is fetched
setTimeout(() => getData(params), 3000);

// Sticky Behavior
const searchButton = document.getElementById('search-button');
const mainHeading = document.getElementById('main-heading');
const mainSection = document.querySelector('.mainSection');
const ticketList = document.getElementById('ticketList');

searchButton.addEventListener('click', () => {
mainHeading.style.display = 'none';
mainSection.classList.add('sticky');
mainSection.style.padding = '20px 15px 20px 20px';
ticketList.style.padding = '70px 15px 20px 25px';
});


// First select the form
const formEl = document.querySelector('.form');
formEl.addEventListener('submit', event => {
event.preventDefault();

//Get Data from the Form. It will take all the data from the form and will put it in the object
const formData = new FormData(formEl);
const params = new URLSearchParams(formData);

// Only append returnDate if it has a value, otherwise skip it
for (const [key, value] of formData.entries()) {
if (value) { // Check if the value is not empty
    params.append(key, value);
}
}


const getData = async () => {
    try {
        let res = await fetch(`https://test.api.amadeus.com/v2/shopping/flight-offers?nonStop=true&currencyCode=USD&${params.toString()}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        let data = await res.json();
        renderTicketCards(data.data); // Render the tickets
        if (!res.ok) {
            console.log(data.description);
            return;
        }

    } catch (error) {
        console.log(error);
    }
};

getData();
});


// Function to render the tickets as cards. I am passing tickets array to it
function renderTicketCards(tickets) {
    const cardContainer = document.getElementById('ticketSectionShell');
    if (!cardContainer) {
        console.log('No container found to append tickets.');
        return;
      }

// Clear the container
cardContainer.innerHTML = ''; 

tickets.forEach(ticket => {
    console.log("Rendering ticket: ", ticket); // Log the ticket data to troubleshoot
    const card = document.createElement('div');
    card.classList.add('card');

        // Extract ticket details 
        const ticketPrice = ticket.price.grandTotal;
        const departureTime = ticket.itineraries[0].segments[0].departure.at;
        const arrivalTime = ticket.itineraries[0].segments[0].arrival.at;

        const departureCity = ticket.itineraries[0].segments[0].departure.iataCode;
        const arrivalCity = ticket.itineraries[0].segments[0].arrival.iataCode;

        const returnDepartureTime = ticket.itineraries[1].segments[0].departure.at;
        const returnArrivalTime = ticket.itineraries[1].segments[0].arrival.at;

       const returnDepartureCity = ticket.itineraries[1].segments[0].departure.iataCode;
       const returnArrivalCity = ticket.itineraries[1].segments[0].arrival.iataCode;



     //Format Dates
    function formatDate(isoDate) {
    const date = new Date(isoDate);
    const options = { 
        weekday: "short", 
        month: "short", 
        day: "2-digit"
    };
    return date.toLocaleDateString("en-US", options);
    }

    const formattedDepartureDate = formatDate(departureTime);
    const formattedArrivalDate = formatDate(arrivalTime);
    const formatedReturnDepartureDate = formatDate(returnDepartureTime);
    const formatedReturnArrivalDate = formatDate(returnArrivalTime);
    
    //Format Duration
    function formatTime(isoDate) {
        const time = new Date(isoDate);
        const options = { 
            hour: "2-digit",
            minute: "2-digit",
            hourCycle: "h23"
        };
        return time.toLocaleTimeString("en-US", options);
        }

    const formattedDepartureTime = formatTime(departureTime);
    const formattedArrivalTime = formatTime(arrivalTime);
    const formatedReturnDepartureTime = formatTime(returnDepartureTime);
    const formatedReturnArrivalTime = formatTime(returnArrivalTime);


        // Card structure
        card.innerHTML = `
    <div class="cardContainer" id="cardContainerId">
        <div class="ticketPrice">
         <div class="priceLabel">$${ticketPrice}</div>
        </div>
        <div class="tripDetails">
         <div class="tripDetailShell">
            <div class="ticketDetailsOneWay">
                <div id="departureDetailsOneWay" class="departureDetails">
                    <div class="ticketTimeDisplay">${formattedDepartureTime}</div>
                    <div class="ticketCityDisplay">${departureCity}</div>
                    <div class="ticketDateDisplay">${formattedDepartureDate}</div>
                </div>
                <div class="durationDetails">
                    <div class="durationTime"></div>
                    <div class="durationTimeLine"></div>
                    <div class="durationAirportDisplay">
                        <div id="departureAirportOneWay"class="airportName">${departureCity}</div>
                        <div id="arrivalAirportOneWay" class="airportName">${arrivalCity}</div>
                    </div>
                </div>
                <div class="arrivalDetails">
                    <div id="arrivalTimeOneWay" class="ticketTimeDisplay">${formattedArrivalTime}</div>
                    <div id="arrivalCityOneWay" class="ticketCityDisplay">${arrivalCity}</div>
                    <div id="arrivalDateOneWay" class="ticketDateDisplay">${formattedArrivalDate}</div>
                </div>
            </div>
            <div class="ticketDetailsRoundTrip">
                <div id="departureDetailsRoundTrip" class="departureDetails">
                    <div id="departureTimeRoundTrip" class="ticketTimeDisplay">${formatedReturnDepartureTime}</div>
                    <div id="departureCityRoundTrip" class="ticketCityDisplay">${returnDepartureCity}</div>
                    <div id="departureDateRoundTrip" class="ticketDateDisplay">${formatedReturnDepartureDate}</div>
                </div>
                <div class="durationDetails">
                    <div id="durationTimeRoundTrip" class="durationTime"></div>
                    <div class="durationTimeLine"></div>
                    <div class="durationAirportDisplay">
                        <div id="departureAirportRoundTrip" class="airportName">${returnDepartureCity}</div>
                        <div id="arrivalAirportRoundTrip" class="airportName">${returnArrivalCity}</div>
                    </div>
                </div>
                <div class="arrivalDetails">
                    <div class="ticketTimeDisplay">${formatedReturnArrivalTime}</div>
                    <div class="ticketCityDisplay">${returnArrivalCity}</div>
                    <div class="ticketDateDisplay">${formatedReturnArrivalDate}</div>
                </div>
            </div>
          </div>
        </div>
    </div> `;

        // Append the card to the container
        cardContainer.appendChild(card);
    });
}


