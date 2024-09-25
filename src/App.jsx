import React, { useState } from "react"; // Importerar React och useState
import "./App.css"; // Importerar anpassade stilar (CSS istället för StyleSheet)

// Huvudkomponenten App
export default function App() {
  const [error, setError] = useState(null); // Hanterar felmeddelanden
  const [inputValue, setInputValue] = useState(""); // Skapar state för inmatningsfältet
  const [audio, setAudio] = useState(""); // Skapar state för ljudfilen
  const [definition, setDefinition] = useState(null); // Skapar state för definitionen
  const [loading, setLoading] = useState(false); // Hanterar laddning

  // Funktion för att söka definition av ordet
  const searchDefinition = async () => {
    // Kontrollera om inputValue är tomt eller bara innehåller mellanslag
    if (inputValue.trim().length === 0) {
      setError("Du måste ange ett ord"); // Visar felmeddelande om fältet är tomt
      return;
    }

    setError(null); // Återställer felmeddelandet
    setLoading(true); // Visar laddning
    setDefinition(null); // Återställer definitionen

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/sv/${inputValue.trim()}`
      );

      if (!response.ok) {
        throw new Error("Server problem uppstod " + response.statusText);
      }

      const data = await response.json();

      // Kontrollera om data innehåller en definition
      if (
        data.length > 0 &&
        data[0].meanings.length > 0 &&
        data[0].meanings[0].definitions.length > 0
      ) {
        setDefinition(data[0].meanings[0].definitions[0].definition); // Uppdaterar med definition
        if (data[0].phonetics && data[0].phonetics[0].audio) {
          setAudio(data[0].phonetics[0].audio); // Uppdaterar med ljudfilens URL
        }
      } else {
        setDefinition("Ordet eller definitionen hittades inte hos oss."); // Felmeddelande om ingen definition hittas
      }
    } catch (error) {
      setDefinition(
        "Ett problem uppstod när vi skulle bläddra ordboken eller saknas definitionen av ordet du söker"
      );
    }

    setLoading(false); // Avslutar laddning
  };

  return (
    <div className="container">
      <div className="app-holder">
        {/* Inputfält för att söka */}
        <input
          className="input"
          placeholder="Sök efter definitionen av ett ord."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)} // Uppdaterar inputValue
          onKeyPress={(e) => e.key === "Enter" && searchDefinition()} // Startar sökning på Enter-tangent
        />
        {/* Knapp för att trigga sökningen */}
        <button className="search-button" onClick={searchDefinition}>
          Hitta
        </button>
        {error && <p className="error-message">{error}</p>}{" "}
        {/* Visar felmeddelande om fel finns */}
        <div className="result">
          <h3>Definition:</h3>
          {loading && <p>Loading...</p>} {/* Visar laddning */}
          {definition && <p>{definition}</p>} {/* Visar definitionen */}
          {/* Knapp för att spela upp ljud om en ljudfil finns */}
          {audio && (
            <button
              className="play-button"
              onClick={() => {
                const audioElement = new Audio(audio);
                audioElement.play();
              }}
            >
              Lyssna
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
