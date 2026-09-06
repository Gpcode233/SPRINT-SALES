/**
 * Minimalist Order Script with WhatsApp Integration - Sprint Laundry & Boutique
 */

// Sprint's official WhatsApp phone number
const SPRINT_WHATSAPP_PHONE = "2348126950374"; 

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

  // Construct formatted WhatsApp message
  let message = `*NEW ORDER - SPRINT BOUTIQUE SALE*\n\n`;
  message += `👤 *Customer Name:* ${name}\n`;
  message += `📞 *Phone:* ${phone}\n`;
  message += `✉️ *Email:* ${email}\n\n`;
  message += `🛍️ *Clothing Item:* ${clothingItem}\n`;
  message += `🔢 *Quantity:* ${quantity}\n`;
  
  if (fulfillment === 'Delivery') {
    message += `🚚 *Fulfillment:* Delivery\n`;
    if (address) {
      message += `📍 *Delivery Address:* ${address}\n`;
      message += `_(Note: Delivery fee depends on location)_\n`;
    }
  } else {
    message += `🏪 *Fulfillment:* Store Pickup\n`;
    message += `📍 *Pickup Location:* Plot CR 14 Ugwuji Road, Maryland, Enugu\n`;
  }
  
  message += `\nSent via Sprint Boutique Online Order Form.`;

  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = SPRINT_WHATSAPP_PHONE 
    ? `https://wa.me/${SPRINT_WHATSAPP_PHONE}?text=${encodedMessage}`
    : `https://api.whatsapp.com/send?text=${encodedMessage}`;

  // Update modal content
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

  // Set WhatsApp button link in modal
  const modalLink = document.getElementById('modalWhatsAppLink');
  if (modalLink) {
    modalLink.href = whatsappUrl;
  }

  // Show modal
  document.getElementById('successModal').classList.remove('hidden');

  // Attempt auto-opening WhatsApp in a new tab
  window.open(whatsappUrl, '_blank');
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
