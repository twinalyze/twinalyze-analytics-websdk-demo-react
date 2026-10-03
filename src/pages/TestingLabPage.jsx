import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import TwinalyzeAnalytics from '@twinalyze/web-analytics';

export default function TestingLabPage() {
  const [message, setMessage] = useState('');
  const [notificationStatus, setNotificationStatus] = useState(
    typeof Notification === 'undefined' ? 'not supported' : Notification.permission,
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const testQuery = searchParams.get('query') || '';

  const handleForm = (event) => {
    event.preventDefault();
    setMessage('The test form was submitted successfully.');
    event.currentTarget.reset();
  };

  const updateQuery = (event) => {
    const next = new URLSearchParams(searchParams);
    event.target.value ? next.set('query', event.target.value) : next.delete('query');
    setSearchParams(next);
  };

  const sendDemoCustomEvent = () => {
    TwinalyzeAnalytics.track('testingLabAction', {
      action: 'manual_test_button',
      label: 'Testing Lab custom event',
      timestamp: new Date().toISOString(),
    });

    setMessage(
      'The direct npm track() call ran. Add Twinalyze initialization in main.jsx to send it.',
    );
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      setNotificationStatus('not supported');
      setMessage('This browser does not support web notifications.');
      return;
    }

    if (Notification.permission === 'denied') {
      setNotificationStatus('denied');
      setMessage('Notifications are blocked. Enable them from browser site settings.');
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationStatus(permission);
      setMessage(
        permission === 'granted'
          ? 'Notification permission granted. After FCM is configured, the SDK can sync the token.'
          : 'Notification permission was not granted.',
      );
    } catch (error) {
      console.error('Notification permission request failed:', error);
      setMessage('Unable to request notification permission.');
    }
  };

  return (
    <section className="section-wrap page-section testing-page">
      <div className="page-heading">
        <span className="eyebrow">INTERACTION PLAYGROUND</span>
        <h1>SDK Testing Lab</h1>
        <p>Direct npm event calls are ready, but SDK initialization, credentials, and the active FCM worker are not included.</p>
      </div>

      <div className="lab-grid">
        <article className="lab-card">
          <span className="lab-number">01</span><h2>Element clicks</h2>
          <p>Test buttons, internal links, external links, and interactive controls.</p>
          <div className="button-row wrap-row">
            <button className="button button-primary" onClick={() => setMessage('Primary button clicked.')}>Primary button</button>
            <button className="button button-secondary" onClick={() => setMessage('Secondary button clicked.')}>Secondary button</button>
            <Link className="button button-dark" to="/products">Internal route</Link>
            <a className="button button-ghost" href="https://example.com" target="_blank" rel="noreferrer">External link</a>
          </div>
        </article>

        <article className="lab-card">
          <span className="lab-number">02</span><h2>Search URL</h2>
          <p>This field updates the <code>?query=</code> parameter.</p>
          <label className="search-field"><span>Search test</span><input value={testQuery} onChange={updateQuery} placeholder="Type a search term" /></label>
          {testQuery && <div className="query-result">Showing test result for “{testQuery}”</div>}
        </article>

        <article className="lab-card">
          <span className="lab-number">03</span><h2>Form interactions</h2>
          <form name="contactTestForm" className="compact-form" onSubmit={handleForm}>
            <label>Name<input name="name" required /></label>
            <label>Email<input name="email" type="email" required /></label>
            <label>Message<textarea name="message" rows="3" required /></label>
            <button className="button button-primary" type="submit">Submit test form</button>
          </form>
        </article>

        <article className="lab-card">
          <span className="lab-number">04</span><h2>File download</h2>
          <p>Download a sample ZIP file from the public directory.</p>
          <a className="button button-dark" href="/downloads/sample-download.zip" download>Download sample ZIP</a>
        </article>

        <article className="lab-card">
          <span className="lab-number">05</span><h2>Custom event</h2>
          <p>Calls <code>TwinalyzeAnalytics.track('testingLabAction')</code> directly through the npm package.</p>
          <button className="button button-primary" type="button" onClick={sendDemoCustomEvent}>
            Send demo custom event
          </button>
        </article>

        <article className="lab-card">
          <span className="lab-number">06</span><h2>FCM permission</h2>
          <p>Requests notification permission from a user gesture. FCM configuration is still added manually.</p>
          <button className="button button-dark" type="button" onClick={requestNotificationPermission}>
            Enable notifications
          </button>
          <p>Current status: <strong>{notificationStatus}</strong></p>
        </article>
      </div>

      {message && <div className="toast-message" role="status">{message}<button onClick={() => setMessage('')}>×</button></div>}

      <div className="long-content">
        <span className="eyebrow">SCROLL DEPTH SECTION</span>
        <h2>Continue scrolling to test the 90% scroll event.</h2>
        {Array.from({ length: 9 }, (_, index) => (
          <article key={index}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div><h3>Long-content testing block</h3><p>This intentionally extends the page. Scroll events can be tested without changing any application configuration. The content is repeated only to create a realistic page height and allow testing across desktop and mobile viewports.</p></div>
          </article>
        ))}
      </div>
    </section>
  );
}
