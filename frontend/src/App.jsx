import { useEffect, useState } from "react"
import axios from 'axios'

function App() {
  const [lessons, setLessons] = useState([]);

  const handleVideosRequest = async () => {
    try {
      const response = await axios.get('http://localhost:3000/get-video-paths')
      setLessons(response.data.lessons);
      console.log(lessons);
    } catch (error) {
      console.log("Some error occured while fetching the video links :: ", error);
    }
  }

  useEffect(() => {

  }, [lessons])

  return (
    <>
    <main className="min-h-screen flex justify-center items-center bg-zinc-800 text-white font-mono">
      <div className="border">
        <h1 className="font-bold text-3xl">Youtube like video streaming platform</h1>
       <button onClick={handleVideosRequest} className="border px-3 py-1">GET VIDEOS</button>
       {
        lessons.map((lesson) => (
          <div className="text-white text-6xl" key={lesson.name}>{lesson.name}</div>
        ))
       }
      </div>
    </main>
    </>
  )
}

export default App
