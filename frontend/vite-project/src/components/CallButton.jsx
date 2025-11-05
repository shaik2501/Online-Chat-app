import { VideoIcon } from "lucide-react";
import React from 'react'; // Import React if not already done by your setup

/**
 * A reusable button component specifically for initiating a video call.
 * It uses the lucide-react VideoIcon and includes accessibility attributes and interactive styling.
 * * @param {object} props
 * @param {() => void} props.handleVideoCall The function to execute when the button is clicked.
 * @returns {JSX.Element}
 */
function CallButton({ handleVideoCall }) {
  return (
    // The main container is typically not necessary for a single button unless for layout purposes.
    // I'll keep it simple and focus the styling on the button itself.
    <button 
      onClick={handleVideoCall}
      // Tailwind CSS for a modern, clickable button:
      className="
        p-2 
        rounded-full 
        bg-green-500 
        text-white 
        shadow-md 
        hover:bg-green-600 
        focus:outline-none 
        focus:ring-2 
        focus:ring-green-500 
        focus:ring-offset-2
        transition-colors
      "
      // Accessibility: Tells screen readers what the button does.
      aria-label="Start video call"
      type="button" // Explicitly set type for better form behavior (if applicable)
    >
      <VideoIcon className="size-6" aria-hidden="true" />
    </button>
  );
}

export default CallButton;