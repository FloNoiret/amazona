import React from 'react';

export default function CheckoutSteps(props) {
  return (
    <ul className="checkout-steps">
      <li className={props.step1 ? 'active' : ''}>Identification</li>
      <li className={props.step2 ? 'active' : ''}>Livraison</li>
      <li className={props.step3 ? 'active' : ''}>Paiement</li>
      <li className={props.step4 ? 'active' : ''}>Commande</li>
    </ul>
  );
}