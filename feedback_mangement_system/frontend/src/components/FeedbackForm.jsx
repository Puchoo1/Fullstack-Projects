import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const FeedbackForm = () => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false); // For showing loading state
  const navigate = useNavigate(); // Initialize navigate

  const handleSubmit = (e) => {
    e.preventDefault();

    // Input validation
    if (!title || !category || !details) {
      alert('Please fill out all fields before submitting.');
      return;
    }

    const feedbackData = { title, category, details };
    setLoading(true); // Show loading while request is being processed

    // Send data to the backend
    fetch('http://localhost:4000/api/feedbacks', { // Ensure this matches the backend's URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    })
      .then((response) => {
        setLoading(false);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Feedback submitted:', data);
        alert('Feedback submitted successfully!');
        // Reset form fields after successful submission
        setTitle('');
        setCategory('');
        setDetails('');
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error submitting feedback:', error);
        alert('Failed to submit feedback. Please try again.');
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-lg">
        
        <h2 className="text-2xl font-bold mb-6">Create a New Feedback</h2>

        {/* Back button */}
        <button
          onClick={() => navigate('/dashboard')} // Navigate to dashboard
          className="mb-4 text-blue-500 hover:text-blue-700"
        >
          Back to Dashboard
        </button>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Enter your feedback title"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              required
            >
              <option value="">Select Category</option>
              <option>Cogent</option>
              <option>CSUN</option>
              <option>Mobile</option>
              <option>Testing</option>
              <option>Bug</option>
            </select>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              className="w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Write your feedback details here"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              onClick={() => {
                // Reset form fields if "Cancel" is clicked
                setTitle('');
                setCategory('');
                setDetails('');
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              disabled={loading} // Disable the button while loading
            >
              {loading ? 'Submitting...' : 'Add Feedback'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;
