import { useEffect, useState } from "react"; import Papa from "papaparse";

const SHEET_URL = "https://docs.google.com/spreadsheets/d/1qL0Q5KVq3V1_fmprm9sAMz97a8P3wXjxVUpCrZbXRTM/export?format=csv&gid=1358384554";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]; const TIMES = [ "08:00-08:50", "08:55-09:45", "09:50-10:40", "10:45-11:35", "11:40-12:30", "12:35-01:25", "01:30-02:20", "02:25-03:15", "03:20-04:05", ];

// Define breaks after specific time slots const BREAKS = ["09:45", "11:35", "01:25", "02:20"];

export default function App() { const [data, setData] = useState([]);

useEffect(() => { Papa.parse(SHEET_URL, { download: true, header: true, complete: (result) => { // Filter only BCS-1D rows const filtered = result.data.filter( (row) => row.Section?.trim().toLowerCase() === "bcs-1d" ); setData(filtered); }, }); }, []);

function getCell(day, time) { const lecture = data.find( (row) => row.Day === day && row.Time?.trim() === time ); if (!lecture) return ""; return `${lecture.Course || ""}\n${lecture.Teacher || ""}\n${lecture.Room || ""}`;
                            }
return (
  <div className="min-h-screen bg-gray-100 p-6">
    <h1 className="text-3xl font-bold text-center mb-6">BCS-1D Timetable</h1>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
            <th className="border p-2 bg-gray-200">Day</th>
            {TIMES.map((time) => (
              <th
                key={time}
                className={`border p-2 bg-gray-200 ${
                  BREAKS.some((b) => time.includes(b)) ? "bg-yellow-100" : ""
                }`}
              >
                {time}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {DAYS.map((day) => (
            <tr key={day}>
              <td className="border p-2 font-semibold bg-gray-50">{day}</td>
              {TIMES.map((time) => (
                <td
                  key={time}
                  className={`border p-2 text-center whitespace-pre-line ${
                    BREAKS.some((b) => time.includes(b)) ? "bg-yellow-50" : ""
                  }`}
                >
                  {getCell(day, time)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

