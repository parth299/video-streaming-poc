import { useEffect, useState, useRef } from "react"
import axios from 'axios'
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import VideoPlayer from "./components/VideoPlayer";

function App() {
  const [lessons, setLessons] = useState([]);
  const playerRef = useRef(null)


  const handleVideosRequest = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-video-paths')
      setLessons(response.data.lessons);
      console.log(lessons);
    } catch (error) {
      console.log("Some error occured while fetching the video links :: ", error);
    }
  }

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

  }, [lessons])

  return (
    <>
    <main className="min-h-screen flex justify-center items-center bg-zinc-800 text-white font-mono">
      <div className="">
        <h1 className="font-bold text-5xl text-center">Youtube like video streaming platform</h1>
        <div className="btn flex justify-center">
          <button onClick={handleVideosRequest} className="border px-3 py-1 text-green-500 my-4 hover:-translate-x-1 hover:-translate-y-1 transition-transform duration-150 hover:bg-green-300 hover:text-green-900 hover:border-green-950 hover:border">GET VIDEOS</button>
        </div>
       
       {
        lessons.map((lesson) => (
          <div className="text-white text-4xl" key={lesson.name}><Link to={`${lesson.name}`}><button>{lesson.name}</button></Link></div>
        ))
       }
       <Outlet  onReady={handlePlayerReady} />
      </div>
    </main>
    </>
  )
}

export default App
