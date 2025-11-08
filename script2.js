const scriptURL = 'https://script.google.com/macros/s/AKfycbykVWEME488pzDI83GZEpfX3OKWze0VepAlk6y2sZrMsqtctUmD_R3OAC7WVxAuIfMo/exec';
const form = document.getElementById('submitForm');
const submitBtn = document.querySelector('#submitForm button[type="submit"]');

// Create overlay box
const overlay = document.createElement('div');
overlay.id = 'overlay';
overlay.innerHTML = `<div id="overlayBox">⏳ Please wait 4 seconds...<br>Your data will be submitted automatically.</div>`;
document.body.appendChild(overlay);

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Disable button and show overlay
  submitBtn.disabled = true;
  form.classList.add('blurred');
  overlay.style.display = 'flex';

  // Wait 4 seconds
  await new Promise(resolve => setTimeout(resolve, 4000));

  try {
    const response = await fetch(scriptURL, {
      method: 'POST',
      body: new FormData(form),
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    // Show success message
    document.getElementById('overlayBox').innerHTML = "✅ Thank you! Your form has been submitted successfully.";

    // Wait 1.5 seconds, then reset everything
    await new Promise(resolve => setTimeout(resolve, 1500));
    form.reset();
    overlay.style.display = 'none';
    form.classList.remove('blurred');
    submitBtn.disabled = false;

  } catch (error) {
    console.error('Error!', error.message);
    document.getElementById('overlayBox').innerHTML = "❌ Something went wrong. Please try again.";
    await new Promise(resolve => setTimeout(resolve, 2000));
    overlay.style.display = 'none';
    form.classList.remove('blurred');
    submitBtn.disabled = false;
  }
});
 