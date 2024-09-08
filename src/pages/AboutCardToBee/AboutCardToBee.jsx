import React from "react";
import "./AboutPage.css";

function AboutCard2Business() {
  return (
    <div className="about-container">
      <div className="about-content">
        <h2 className="about-title">About CardToBee</h2>
        <p className="about-text">
          <strong>Card(2)Business</strong> from ATC Alattar Consultancy is a web
          app that allows users to create, edit, and share custom business cards
          online. Users can generate a digital business card, customize it with
          personal information, and retrieve or edit it later through a secure
          email verification process.
        </p>

        <h3 className="about-subtitle">How to Use Card(2)Business</h3>
        <ol className="about-list">
          <li className="about-list-item">
            <strong>Create a Card:</strong> Go to the "Create Card" section.
            Enter your name, title, email, phone, and other details. Customize
            the card's background and font colors. Upload a profile image if
            desired. Click "Generate Business Card" to create and save your
            card.
          </li>
          <li className="about-list-item">
            <strong>Share the Card:</strong> After generating, you will receive
            a unique link. Share this link with others via social media or
            email.
          </li>
          <li className="about-list-item">
            <strong>Edit the Card:</strong> Navigate to the "Edit Card" section.
            Enter your email to receive a verification link. Click the link in
            your email to access and edit your card.
          </li>
          <li className="about-list-item">
            <strong>Retrieve the Card:</strong> If you lose the card link, go to
            the "Retrieve Card" section. Enter your email to receive the link
            again.
          </li>
        </ol>

        <p className="about-text">
          Card(2)Business makes it easy to manage and share your professional
          identity digitally.
        </p>

        <h3 className="about-subtitle">Disclaimer</h3>
        <p className="about-text">
          <strong>Data Usage and Privacy:</strong> Your personal information,
          such as name, email, and contact details, is stored securely in our
          database and is used solely for the purpose of generating, editing,
          and retrieving your business card. We do not share your data with
          third parties.
        </p>
        <p className="about-text">
          <strong>Privacy and Safety:</strong> We implement security measures to
          protect your data from unauthorized access. However, it is important
          to keep your card link secure and not share it with others unless
          necessary. Always ensure you are using a secure device and network
          when accessing and sharing your business card.
        </p>
      </div>
    </div>
  );
}

export default AboutCard2Business;
