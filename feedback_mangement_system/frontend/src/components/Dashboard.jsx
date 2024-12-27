import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFeedback, setSelectedFeedback] = useState(null); // State to hold the selected feedback for the modal
  const [isModalOpen, setIsModalOpen] = useState(false); // State to track modal visibility

  // Fetch feedbacks from backend
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/feedbacks');
        const data = await response.json();
        setFeedbacks(data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    fetchFeedbacks();
  }, []);

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Handle Add Feedback
  const handleAddFeedback = () => {
    navigate('/feedback');
  };

  // Handle Delete Feedback
  const handleDeleteFeedback = async (id) => {
    try {
      const response = await fetch(`http://localhost:4000/api/feedbacks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove deleted feedback from the state
        setFeedbacks(feedbacks.filter((feedback) => feedback._id !== id));
      } else {
        console.error('Failed to delete feedback');
      }
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  // Filter feedbacks based on selected category
  const filteredFeedbacks =
    selectedCategory === 'All'
      ? feedbacks
      : feedbacks.filter((feedback) => feedback.category === selectedCategory);

  // Open the modal with feedback details
  const handleFeedbackClick = (feedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 relative">
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-red-500 text-white text-sm px-4 py-2 rounded-md hover:bg-red-600"
      >
        Logout
      </button>

      {/* Main container */}
      <div className="flex flex-col space-y-4">
        {/* Header spacing */}
        <div className="h-8"></div>

        {/* Main layout */}
        <div className="flex gap-4">
          {/* Left Column */}
          <div className="flex flex-col w-1/3 bg-white shadow-lg p-4 rounded-md">
            <div className="text-lg font-bold mb-6">Feedback Management System</div>

            <div className="space-y-4">
              <div className="text-base font-semibold mb-2">Categories</div>
              {['All', 'Cogent', 'CSUN', 'Mobile', 'Testing', 'Bug'].map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    selectedCategory === category
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <div className="text-base font-semibold mb-2">Plans</div>
              <div className="text-sm text-green-600">- Planned</div>
              <div className="text-sm text-yellow-600">- In-Progress</div>
              <div className="text-sm text-blue-600">- Live</div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex-grow bg-white shadow-lg p-4 rounded-md">
            {/* Top Bar */}
            <div className="flex items-center justify-between bg-gray-200 p-3 rounded-md mb-4">
              <div className="text-sm font-medium text-gray-700">Suggestion</div>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">Sort by:</div>
                <select
                  className="text-sm p-1 border rounded-md"
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Cogent">Cogent</option>
                  <option value="CSUN">CSUN</option>
                  <option value="Mobile">Mobile</option>
                  <option value="Testing">Testing</option>
                  <option value="Bug">Bug</option>
                </select>

                <button
                  onClick={handleAddFeedback}
                  className="bg-blue-500 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Add Feedback
                </button>
              </div>
            </div>

            {/* Feedback List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredFeedbacks.map((feedback) => (
                <div
                  key={feedback._id}
                  className="relative bg-gray-100 border border-gray-300 p-4 rounded-md shadow-md cursor-pointer"
                  onClick={() => handleFeedbackClick(feedback)} // Open the modal on feedback click
                >
                  <button
                    onClick={() => handleDeleteFeedback(feedback._id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    ✖
                  </button>
                  <h3 className="text-lg font-semibold mb-2">{feedback.title}</h3>
                  <p className="text-sm text-gray-600 mb-1">
                    Category: <span className="font-medium">{feedback.category}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    {feedback.details.length > 50
                      ? `${feedback.details.slice(0, 50)}...`
                      : feedback.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Feedback Details */}
      {isModalOpen && selectedFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-lg w-full shadow-lg">
            <h3 className="text-lg font-semibold">{selectedFeedback.title}</h3>
            <p className="text-sm text-gray-600">Category: {selectedFeedback.category}</p>
            <p className="text-sm text-gray-600">Created on: {selectedFeedback.createdAt}</p>
            <p className="mt-4">{selectedFeedback.details}</p>
            <button
              onClick={closeModal}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
