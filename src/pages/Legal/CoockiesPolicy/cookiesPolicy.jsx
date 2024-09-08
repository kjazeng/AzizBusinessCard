import React from "react";
import "./cookiesPolicy.css";

const CookiesPolicy = () => {
  return (
    <div className="cookies-policy">
      <h1>Cookies Policy</h1>
      <p>Last updated: [Current Date]</p>

      <section>
        <h2>1. What are cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or
          mobile device when you visit a website. They are widely used to make
          websites work more efficiently and provide a better user experience.
        </p>
      </section>

      <section>
        <h2>2. How we use cookies</h2>
        <p>CardToBee uses cookies for the following purposes:</p>
        <ul>
          <li>To remember your preferences and settings</li>
          <li>To improve the performance and functionality of our website</li>
          <li>To analyze how our website is used and improve our services</li>
          <li>To personalize your experience on our site</li>
          <li>For authentication and security purposes</li>
        </ul>
      </section>

      <section>
        <h2>3. Types of cookies we use</h2>
        <h3>Essential cookies:</h3>
        <p>
          These cookies are necessary for the website to function properly. They
          enable core functionality such as security, network management, and
          accessibility.
        </p>

        <h3>Analytics cookies:</h3>
        <p>
          These cookies help us understand how visitors interact with our
          website by collecting and reporting information anonymously.
        </p>

        <h3>Functionality cookies:</h3>
        <p>
          These cookies allow the website to remember choices you make (such as
          your username, language, or the region you are in) and provide
          enhanced, more personal features.
        </p>
      </section>

      <section>
        <h2>4. Managing cookies</h2>
        <p>
          Most web browsers allow you to control cookies through their settings
          preferences. However, limiting the ability of websites to set cookies
          may worsen your overall user experience. To learn more about cookie
          management, visit{" "}
          <a
            href="https://www.aboutcookies.org/"
            target="_blank"
            rel="noopener noreferrer"
          >
            AboutCookies.org
          </a>
          .
        </p>
      </section>

      <section>
        <h2>5. Changes to our cookies policy</h2>
        <p>
          We may update our Cookies Policy from time to time. We will notify you
          of any changes by posting the new Cookies Policy on this page and
          updating the "Last updated" date at the top of this policy.
        </p>
      </section>

      <section>
        <h2>6. Contact us</h2>
        <p>
          If you have any questions about our Cookies Policy, please contact us
          at:
        </p>
        <p>Email: [Your Contact Email]</p>
        <p>Address: [Your Company Address]</p>
      </section>
    </div>
  );
};

export default CookiesPolicy;
