import React, { useState } from "react";
import "./App.css";

function App() {
  const [username, setUsername] = useState("");
  const [repos, setRepos] = useState([]);
  const [message, setMessage] = useState("");

  const fetchRepos = async () => {
    try {
      const response = await fetch(
        `https://api.github.com/users/${username}/repos`
      );
      if (response.ok) {
        const data = await response.json();
        setRepos(data);
        setMessage(""); // Clear any previous messages
      } else {
        setRepos([]);
        setMessage("User not found or no public repositories available");
      }
    } catch (error) {
      setMessage("Error fetching repositories");
    }
  };

  const handleDownload = (repoName) => {
    const url = `https://github.com/${username}/${repoName}/archive/refs/heads/master.zip`;
    const a = document.createElement("a");
    a.href = url;
    a.download = `${repoName}-master.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="App min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <header className="App-header w-full max-w-3xl">
        {/* <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        GitHub Repo Downloader
        </h1> */}
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">
            GitHub Repo Downloader
          </h1>
          <h2
            className="text-xl font-medium mb-6 text-center text-gray-600"
            style={{ marginLeft: "20px" }}
          >
            Download source code archives
          </h2>
        </div>
        <div className="flex flex-col md:flex-row items-center mb-6 ml-2 justify-around">
          <input
            className="mb-2 md:mb-0 md:mr-4 p-2 border border-gray-300 rounded w-full"
            type="text"
            placeholder="GitHub Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-1/3"
            onClick={fetchRepos}
          >
            Get Repos
          </button>
        </div>
        <div className="w-full">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <div
                key={repo.id}
                className="bg-white p-4 mb-2 rounded shadow-md flex justify-between items-center"
              >
                <div className="flex-grow mr-4">
                  <h2 className="text-xl font-bold text-blue-600">
                    {repo.name}
                  </h2>
                  <p className="text-gray-700">{repo.description}</p>
                  <p className="text-gray-500">
                    {repo.stargazers_count} Stars | {repo.forks_count} Forks
                  </p>
                </div>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
                  onClick={() => handleDownload(repo.name)}
                >
                  Download
                </button>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              {message || "No repositories to display"}
            </p>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
