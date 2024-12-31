const themes = {
  Luna: ["10.00 am – 1.00 pm", "1.30pm – 4.30pm"," 4.30pm – 6.00pm(1.5hr slot)", "7.00pm – 10.00 pm","10.30pm – 1.00 am"],
  Rosset: ["9.30 am – 12.30 pm", "1.00pm – 4.00pm", "4.30pm – 6.00pm (1.5Hr Slot)", "6.30pm – 9.30 pm","10.00pm – 1.00 am"],
  Celestial: ["9.00am – 10.30am", "11.00 am – 12.30pm", "1.00pm – 2.30pm", "3.00pm – 4.30pm","5.30pm – 7.00pm","7.30pm – 9.00pm", "9.30pm – 11.00pm", "11.30pm – 1.00am"]
};

const bookedSlots = {}; // Track booked slots (this should be fetched from Google Sheets)

const themeSelect = document.getElementById("theme");
const timeSlotSelect = document.getElementById("timeSlot");
const message = document.getElementById("message");

themeSelect.addEventListener("change", () => {
  const selectedTheme = themeSelect.value;
  timeSlotSelect.innerHTML = "<option value=''>Select a time slot</option>";

  if (selectedTheme && themes[selectedTheme]) {
    themes[selectedTheme].forEach(slot => {
      const option = document.createElement("option");
      option.value = slot;
      option.textContent = slot;
      timeSlotSelect.appendChild(option);
    });
  }
});

document.getElementById("bookingForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const theme = document.getElementById("theme").value;
  const date = document.getElementById("date").value;
  const timeSlot = document.getElementById("timeSlot").value;

  const bookingKey = `${date}-${timeSlot}`;
  if (bookedSlots[bookingKey]) {
    message.textContent = "Slot already booked. Please select another slot.";
    message.style.color = "red";
    return;
  }

  // Update booked slots locally (you'd sync this with Google Sheets in a real app)
  bookedSlots[bookingKey] = true;
  console.log(bookedSlots); 
  // Send data to Google Sheets
  const response = await fetch("https://script.google.com/macros/s/AKfycbwLw0wdwIbw11_tbqyRSqdzuFh5Ou35F3SYezLCnVI-_N1fho9tUM78My4MIvHHyGCQ4g/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, email, phone, theme, date, timeSlot }),
    mode: 'no-cors', 
  });
  if (response.ok) {
    message.textContent = "Booking successful!";
    message.style.color = "green";
    
  } else {
    message.textContent = "Error booking slot. Please try again.";
    message.style.color = "red";
    
  }
});
