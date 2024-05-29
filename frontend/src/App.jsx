import { useEffect, useState, useRef } from "react";
import axios from 'axios';
import { Outlet, Link } from "react-router-dom";
import VideoPlayer from "./components/VideoPlayer"; // Ensure this is correctly imported and used
import videojs from "video.js"; // Ensure videojs is correctly imported

function App() {
  const [lessons, setLessons] = useState([]);
  const playerRef = useRef(null);
  const [file, setFile] = useState(null);

  const handleVideosRequest = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-video-paths');
      setLessons(response.data.lessons);
    } catch (error) {
      console.error("Some error occurred while fetching the video links:", error);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      console.error("No file selected for upload");
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post('http://localhost:3000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log(response);
    } catch (error) {
      console.error("Error occurred while uploading the video:", error);
    }
  };

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // You can handle player events here, for example:
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  };

  useEffect(() => {
    handleVideosRequest();
  }, []); // Empty dependency array to fetch lessons once when the component mounts

  return (
    <main className="min-h-screen flex justify-center items-center bg-zinc-800 text-white font-mono">
      <button
        onClick={handleUpload}
        className="absolute right-20 top-0 px-3 py-1 m-5 text-blue-500 hover:-translate-x-1 hover:-translate-y-1 border transition-transform duration-200 hover:bg-blue-400 hover:text-blue-800 hover:border-blue-800"
      >
        Upload Video
      </button>
      <input
        type="file"
        className="absolute right-0 top-20"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <div>
        <h1 className="font-bold text-5xl text-center">YouTube-like video streaming platform</h1>
        <div className="btn flex justify-center">
          <button
            onClick={handleVideosRequest}
            className="border px-3 py-1 text-green-500 my-4 hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-150 hover:bg-green-300 hover:text-green-900 hover:border-green-950 hover:border"
          >
            GET VIDEOS
          </button>
        </div>

        {lessons.map((lesson) => (
          <div className="text-white text-4xl" key={lesson.name}>
            <Link to={`${lesson.name}`}>
              <button>{lesson.name}</button>
            </Link>
          </div>
        ))}
        <Outlet onReady={handlePlayerReady} />
      </div>
    </main>
  );
}

export default App;
