
document.addEventListener("DOMContentLoaded", () => {
  const searchForm = document.getElementById("flight-search-form");

 const searchButton = document.getElementById("search-button");

 searchButton.addEventListener("click", () => {
      
      const departure = document.getElementById("departure").value;
      const destination = document.getElementById("destination").value;
      const departureDate = document.getElementById("departure-date").value;
      const returnDate = document.getElementById("return-date").value;

      // Validate the inputs
      if (!departure || !destination || !departureDate || !returnDate) {
          alert("Please fill out all fields.");
          return;
      }

      // Checking that I've recived the inputs in the console
      console.log("Departure:", departure);
      console.log("Destination:", destination);
      console.log("Departure Date:", departureDate);
      console.log("Return Date:", returnDate);

      // Sends the data to the server
      sendSearchData({ departure, destination, departureDate, returnDate });
  });
});

// Function to send data to the server
function sendSearchData(searchData) {
  fetch("http://localhost:3000/api/post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchData),
  })
      .then((response) => response.json())
      .then((data) => {
          console.log("Response from server:", data);
      })
      .catch((error) => {
          console.error("Error:", error);
      });
}

