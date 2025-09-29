import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select } from "../ui/select";
import { Star } from "lucide-react";

export default function FeedbackDropdown() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const submitFeedback = () => {
    console.log({ rating, comment });
    alert(`Thanks for rating ${rating} ⭐ and leaving: ${comment}`);
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="px-1 sm:px-2 py-1 rounded-sm bg-transparent border-2 border-secondary-900 text-gray-900 hover:bg-teal-500 hover:text-white dark:text-white text-xs sm:text-sm">
        <span className="hidden sm:inline">Feedback</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        sideOffset={8}
        className="bg-white dark:bg-slate-950 p-4 rounded shadow-md w-64 space-y-3"
      >
        <div>
          <label className="block text-sm font-medium mb-1">Rating</label>
          <div className="flex items-center justify-around">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                className={`cursor-pointer transition-colors ${
                  (hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                }`}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              />
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comments</label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            rows={3}
            className="w-full border rounded p-1 resize-none"
            placeholder="Optional"
          />
        </div>

        <button
          onClick={submitFeedback}
          className="w-full bg-blue-600 text-white py-1.5 rounded hover:bg-blue-700"
        >
          Submit
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
