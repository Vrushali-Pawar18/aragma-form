document.addEventListener("DOMContentLoaded", () => {
  const scriptContainer = document.getElementById("scriptContainer");

    const form = document.createElement("form");
    form.className = "space-y-6";
    form.id = "reservationForm";
  
    form.innerHTML = `
      <div class="form-container">
        <div class="form-content">
          <h2 class="form-title">Reservation Form</h2>
          
          <!-- Name -->
          <div class="input-container">
            <label for="name" class="label">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              class="input-field"
              placeholder="Enter your name"
              required
            />
          </div>
  
          <!-- Mobile -->
          <div class="input-container">
            <label for="mobile" class="label">Mobile</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              class="input-field"
              placeholder="123-456-7890"
              required
            />
          </div>
  
          <!-- Date -->
          <div class="input-container">
            <label for="date" class="label">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              class="input-field"
              required
            />
          </div>
  
          <!-- Meal Type -->
          <div class="input-container">
            <label for="mealType" class="label">Meal Type</label>
            <select
              id="mealType"
              name="mealType"
              class="input-field"
              required
            >
              <option value="">Select...</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>
          </div>
  
          <!-- Special Occasion -->
          <div class="input-container">
            <label for="specialOccasion" class="label">Special Occasion or Allergies</label>
            <textarea
              id="specialOccasion"
              name="specialOccasion"
              class="input-field"
              placeholder="Let us know if you are celebrating something or have allergies"
              rows="3"
            ></textarea>
          </div>
  
          <!-- Is Gift -->
          <div class="input-container">
            <label for="isGift" class="label">Is this experience a gift for someone?</label>
            <select
              id="isGift"
              name="isGift"
              class="input-field"
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
            class="submit-btn"
          >
            Submit
          </button>
        </div>
      </div>
    `;
  scriptContainer.appendChild(form);
  
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
  
    // Plain CSS styles
    const style = document.createElement('style');
    style.innerHTML = `
      .form-container {
        display: flex;
        justify-content: center;
        margin-top: 50px;
      }
      .form-content {
        width: 100%;
        max-width: 500px;
        background-color: white;
        padding: 40px;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      .form-title {
        font-size: 24px;
        font-weight: bold;
        color: #333;
        text-align: center;
        margin-bottom: 20px;
      }
      .input-container {
        margin-bottom: 20px;
      }
      .label {
        font-size: 14px;
        font-weight: 600;
        color: #555;
        margin-bottom: 6px;
        display: block;
      }
      .input-field {
        width: 100%;
        padding: 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 14px;
        outline: none;
        box-sizing: border-box;
      }
      .input-field:focus {
        border-color: #007BFF;
        box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
      }
      .submit-btn {
        width: 100%;
        padding: 14px;
        background-color: #007BFF;
        color: white;
        font-size: 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      .submit-btn:hover {
        background-color: #0056b3;
      }
    `;
    document.head.appendChild(style);
  });
  