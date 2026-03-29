
import React, { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import Loading from "./Loading";
import UserSearchCards from "./UserSearchCards";
import { toast } from "react-toastify";
import axios from "axios";
import { backendURL } from "../constant";
import { VscClose } from "react-icons/vsc";

/**
 * Custom hook to debounce a value using ES6+ arrow function syntax.
 * @param {any} value - Value to debounce.
 * @param {number} delay - Delay in milliseconds.
 * @returns {any} The debounced value.
 */
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup the timer if the value changes before delay ends
    return () => clearTimeout(timerId);
  }, [value, delay]);

  return debouncedValue;
};

const SearchUser = ({ onClose }) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // Debounce the `search` state value for 500 ms
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    // If input is cleared, reset results and loading state
    if (!debouncedSearch) {
      setSearchUser([]);
      setLoading(false);
      return;
    }

    const handleSearchUsers = async () => {
      setLoading(true);
      try {
        const { data } = await axios.post(`${backendURL}/api/searchuser`, {
          search: debouncedSearch,
        });

        // Print entire response to console
        console.log("API Response:", data);

        // Set users in state
        setSearchUser(data.data);
      } catch (error) {
        toast.error(error?.response?.data?.message || error.message);
      } finally {
        setLoading(false);
      }
    };

    handleSearchUsers();
  }, [debouncedSearch]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-700/40 p-2 z-1">
      <div className="w-full max-w-lg lg:max-w-2xl mx-auto mt-10">
        {/* Input field for searching users */}
        <div className="bg-white rounded h-10 overflow-hidden border-b-2 border-primary flex">
          <div className="h-10 w-10 flex items-center justify-center text-slate-600">
            <LuSearch size={20} />
          </div>
          <input
            type="text"
            placeholder="Search or start a new chat"
            className="w-full py-1 h-full px-1"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
        </div>

        {/* Display search results */}
        <div className="bg-white mt-2 w-full p-4 rounded">
          {loading && (
            <div className="flex items-center">
              <Loading />
              <p className="pl-2">Loading...</p>
            </div>
          )}

          {/* No Results */}
          {!loading && debouncedSearch && searchUser.length === 0 && (
            <p className="text-center text-slate-500">No user found!</p>
          )}

          {/* Show Results */}
          {!loading &&
            searchUser.length > 0 &&
            searchUser.map((user, index) => (
              <UserSearchCards key={user._id} user={user} onClose={onClose} />
            ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 text-2xl p-4 lg:text-4xl hover:text-white" onClick={onClose}>
        <button>
          <VscClose size={25} />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
