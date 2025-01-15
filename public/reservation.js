document.addEventListener("DOMContentLoaded", () => {
    const form = document.createElement("form");
    form.className = "space-y-6";
    form.id = "reservationForm";
  
    form.innerHTML = `
      <div class="flex items-center justify-center my-10">
        <div class="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-2xl font-bold text-gray-800 text-center">Reservation Form</h2>
          
          <!-- Name -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your name"
              required
            />
          </div>
  
          <!-- Mobile -->
          <div>
            <label for="mobile" class="block text-sm font-medium text-gray-700">Mobile</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="123-456-7890"
              required
            />
          </div>
  
          <!-- Date -->
          <div>
            <label for="date" class="block text-sm font-medium text-gray-700">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
  
          <!-- Meal Type -->
          <div>
            <label for="mealType" class="block text-sm font-medium text-gray-700">Meal Type</label>
            <select
              id="mealType"
              name="mealType"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select...</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
  
          <!-- Special Occasion -->
          <div>
            <label for="specialOccasion" class="block text-sm font-medium text-gray-700">Special Occasion or Allergies</label>
            <textarea
              id="specialOccasion"
              name="specialOccasion"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Let us know if you are celebrating something or have allergies"
              rows="3"
            ></textarea>
          </div>
  
          <!-- Is Gift -->
          <div>
            <label for="isGift" class="block text-sm font-medium text-gray-700">Is this experience a gift for someone?</label>
            <select
              id="isGift"
              name="isGift"
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            >
              <option value="">Select...</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </div>
  
          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Submit
          </button>
        </div>
      </div>
    `;
  
    document.body.appendChild(form);
  
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const formData = {
        name: form.name.value,
        mobile: form.mobile.value,
        date: form.date.value,
        mealType: form.mealType.value,
        specialOccasion: form.specialOccasion.value,
        isGift: form.isGift.value,
      };
  
      console.log("Form Data Submitted:", formData);
  
      try {
        const response = await fetch("/api/reservation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
  
        const result = await response.json();
  
        if (result.success) {
          alert("Reservation submitted successfully!");
        } else {
          alert("Error submitting reservation: " + result.error);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred while submitting the reservation.");
      }
    });
  });
  