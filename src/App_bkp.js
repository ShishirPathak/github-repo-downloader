import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [clonePath, setClonePath] = useState("");
  const [message, setMessage] = useState("");
  const [folderError, setFolderError] = useState("");

  const fetchRepos = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (response.ok) {
        const data = await response.json();
        setRepos(data);
      } else {
        setMessage("User not found or no public repositories available");
      }
    } catch (error) {
      setMessage("Error fetching repositories");
    }
  };

  const handleClone = async (repoName) => {
    if (!clonePath) {
      setMessage("Please provide a clone path");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/clone", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, repo: repoName, clonePath }),
      });

      if (response.ok) {
        setMessage(`Repository ${repoName} cloned successfully`);
        alert(`Repository ${repoName} cloned successfully`);
      } else {
        setMessage(`Failed to clone repository ${repoName}`);
        alert(`Failed to clone repository ${repoName}`);
      }
    } catch (error) {
      setMessage(`Error cloning repository ${repoName}`);
    }
  };

  const handleClonePathChange = (e) => {
    setClonePath(e.target.value);
    if (folderError) setFolderError("");
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center p-6 m-4">
      <header className="App-header">
        <h1 className="text-3xl font-bold m-1 pl-10">GitHub Repo Cloner</h1>
        <div className="flex">
          <div className=" m-2 p-4">
            <input
              className="mb-2 p-2 border border-gray-300 rounded"
              type="text"
              placeholder="GitHub Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="m-2 p-4">
            <button
              className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
              onClick={fetchRepos}
            >
              Get Repos
            </button>
          </div>
        </div>

        {repos.length > 0 && (
          <div className="mb-2">
            <input
              className="ml-3 p-2 border border-gray-300 rounded"
              type="text"
              placeholder="Enter Clone Path"
              value={clonePath}
              onChange={handleClonePathChange}
            />
            {folderError && <p className="text-red-500">{folderError}</p>}
            {/* <p className="text-sm text-gray-500 mb-2">
              Please provide the correct folder path. The folder should be
              empty.
            </p> */}
            <div className="text-sm text-gray-500 ml-3 mb-2">
              <p>
                <strong>
                  Please enter the correct folder path where the repository will
                  be cloned.
                </strong>
              </p>
              <p>
                <strong>Example for Windows:</strong>
              </p>
              <pre>C:\Users\YourUsername\Projects\MyReactApp</pre>
              <p>
                <strong>Example for macOS:</strong>
              </p>
              <pre>/Users/YourUsername/Projects/MyReactApp</pre>
            </div>
          </div>
        )}
        <div className="w-full max-w-md">
          {repos.map((repo) => (
            <div
              key={repo.id}
              className="bg-white p-4 mb-2 rounded shadow-md flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-bold">{repo.name}</h2>
                <p>{repo.description}</p>
                <p>
                  {repo.stargazers_count} Stars | {repo.forks_count} Forks
                </p>
              </div>
              <button
                className="ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                onClick={() => handleClone(repo.name)}
              >
                Clone
              </button>
            </div>
          ))}
        </div>
        {message && <p className="mt-4 text-red-500">{message}</p>}
      </header>
    </div>
  );
}

export default App;
