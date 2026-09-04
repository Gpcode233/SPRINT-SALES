/**
 * Minimalist Order Script - Sprint Laundry & Boutique
 */

function toggleDelivery(isDelivery) {
  const addressField = document.getElementById('deliveryAddressField');
  const addressInput = document.getElementById('address');

  if (addressField && addressInput) {
    if (isDelivery) {
      addressField.classList.remove('hidden');
      addressInput.setAttribute('required', 'required');
      addressInput.focus();
    } else {
      addressField.classList.add('hidden');
      addressInput.removeAttribute('required');
      addressInput.value = '';
    }
  }
}

function submitOrder(event) {
  event.preventDefault();

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const clothingItem = document.getElementById('clothingItem').value.trim();
  const quantity = document.getElementById('quantity').value;
  
  const fulfillmentRadio = document.querySelector('input[name="fulfillment"]:checked');
  const fulfillment = fulfillmentRadio ? fulfillmentRadio.value : 'Pickup from store';
  const address = document.getElementById('address')?.value.trim() || '';

  // Fill modal
  document.getElementById('modalName').textContent = name;
  document.getElementById('modalItem').textContent = clothingItem;
  document.getElementById('modalQty').textContent = quantity;
  document.getElementById('modalFulfillment').textContent = fulfillment;

  const addressWrapper = document.getElementById('modalAddressWrapper');
  if (fulfillment === 'Delivery' && address) {
    addressWrapper.classList.remove('hidden');
    document.getElementById('modalAddress').textContent = address;
  } else {
    addressWrapper.classList.add('hidden');
  }

  // Show modal
  document.getElementById('successModal').classList.remove('hidden');

  // Reset form
  document.getElementById('orderForm').reset();
  toggleDelivery(false);
}

function closeModal() {
  document.getElementById('successModal').classList.add('hidden');
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeModal();
  }
});
