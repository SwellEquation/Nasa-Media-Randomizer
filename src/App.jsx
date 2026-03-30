import { useState } from "react";
import "./App.css";

const BASE_URL = "https://api.nasa.gov/planetary/apod";
const API_KEY = import.meta.env.VITE_NASA_API_KEY;

function App() {
  const [data, setData] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);

  //Attribute detection
  const getAttributes = (item) => {
    const text = (item.title + " " + item.explanation).toLowerCase();
    let attributes = [];

    //PLANETS
    if (
      text.includes("planet") ||
      text.includes("mars") ||
      text.includes("jupiter") ||
      text.includes("saturn") ||
      text.includes("venus") ||
      text.includes("mercury") ||
      text.includes("neptune") ||
      text.includes("uranus")
    ) {
      attributes.push("Planet");
    }

    //GALAXIES
    if (
      text.includes("galaxy") ||
      text.includes("milky way") ||
      text.includes("andromeda")
    ) {
      attributes.push("Galaxy");
    }

    //MOONS
    if (
      text.includes("moon") ||
      text.includes("lunar") ||
      text.includes("europa") ||
      text.includes("titan") ||
      text.includes("ganymede")
    ) {
      attributes.push("Moon");
    }

    //YEAR
    const year = item.date.split("-")[0];
    attributes.push(year);

    return attributes;
  };

  const fetchData = async () => {
    try {
      let valid = false;
      let result = null;

      while (!valid) {
        const res = await fetch(
          `${BASE_URL}?api_key=${API_KEY}&count=1`
        );
        const json = await res.json();
        result = json[0];

        const attributes = getAttributes(result);

        const isBanned = attributes.some((attr) =>
          banList.includes(attr)
        );

        if (!isBanned) valid = true;
      }

      setData(result);
      setHistory((prev) => [result, ...prev]);

    } catch (err) {
      console.error(err);
    }
  };

  const toggleBan = (value) => {
    if (banList.includes(value)) {
      setBanList(banList.filter((item) => item !== value));
    } else {
      setBanList([...banList, value]);
    }
  };

  const attributes = data ? getAttributes(data) : [];

  return (
    <div className="app">

      {/* Seen History */}
      <div className="sidebar left">
        <h3>Seen So Far</h3>
        {history.map((item, index) => (
          <div key={index} className="history-item">
            {item.media_type === "image" ? (
              <img src={item.url} alt={item.title} />
            ) : (
              <iframe src={item.url} title={item.title} />
            )}
            <p>{item.title}</p>
          </div>
        ))}
      </div>

      {/* Main */}
      <div className="main">
        <h1>NASA Randomizer</h1>
        <p>Explore random NASA images from space! 🚀</p>

        <button onClick={fetchData}>Discover</button>

        {data && (
          <div className="card">
            {data.media_type === "image" ? (
              <img src={data.url} alt={data.title} />
            ) : (
              <iframe src={data.url} title="space video" />
            )}

            <div className="attributes">
              {attributes.map((attr, index) => (
                <p key={index} onClick={() => toggleBan(attr)}>
                  {attr}
                </p>
              ))}
            </div>

            <h2>{data.title}</h2>
            <p>{data.explanation}</p>
          </div>
        )}
      </div>

      {/* Ban List */}
      <div className="sidebar right">
        <h3>Ban List</h3>
        {banList.map((item, index) => (
          <p key={index} onClick={() => toggleBan(item)}>
            ❌ {item}
          </p>
        ))}
      </div>
    </div>
  );
}

export default App;