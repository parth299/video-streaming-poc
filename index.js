import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process'; // It is a dangerous command so WATCH OUT!!

const app = express();
const port = 3000;

// Multer Middleware
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads");
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + uuidv4() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.use(
    cors({
        origin: ["http://localhost:3000", "http://localhost:5173"],
        credentials: true
    })
);

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static("uploads"));

app.get('/', (req, res) => {
    res.json({ message: "Response sent on /" });
});

app.post("/upload", upload.single('file'), (req, res) => {
    const lessonId = uuidv4();
    const videoPath = req.file.path;
    const outputPath = `./uploads/courses/${lessonId}`;
    const hlsPath = `${outputPath}/index.m3u8`;

    console.log("hlsPath: ", hlsPath);

    if (!fs.existsSync(outputPath)) {
        fs.mkdir(outputPath, { recursive: true }, (err) => {
            if (err) {
                return res.status(500).json({ success: false, message: "Failed to create directory", error: err });
            }

            const ffmpegCommand = `ffmpeg -i ${videoPath} -codec:v libx264 -codec:a aac -hls_time 10 -hls_playlist_type vod -hls_segment_filename "${outputPath}/segment%03d.ts" -start_number 0 ${hlsPath}`;

            exec(ffmpegCommand, function (error, stdout, stderr) {
                if (error) {
                    console.error("ffmpeg error: ", error);
                    return res.status(500).json({ success: false, message: "Failed to convert video", error: error });
                }
                console.log("stdout: ", stdout);
                console.log("stderr: ", stderr);
                const videoUrl = `http://localhost:3000/uploads/courses/${lessonId}/index.m3u8`;

                res.json({
                    success: true,
                    message: "Video converted to HLS format",
                    videoUrl: videoUrl,
                    lessonId: lessonId
                });
            });
        });
    } else {
        res.status(400).json({ success: false, message: "Output path already exists" });
    }
});

app.get('/get-video-paths' ,(req, res) => {
    const lessons = fs.readdirSync('./uploads/courses/', {recursive: false, withFileTypes: "m3u8"});
    console.log("Responded to request!");
    console.log(lessons);
    res.send({
        message: "Video paths read successfully",
        lessons: lessons
    });
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})
