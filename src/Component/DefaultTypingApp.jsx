import React, { useState, useEffect } from "react";
import Timer from "./Timer";
import "../App.css";

function generateWords() {
    const keys = ["a", "s", "d", "f", "j", "k", "l", ";"];
    const numWords = Math.floor(Math.random() * 2) + 2;
    let words = "";
    for (let i = 0; i < numWords; i++) {
        const wordLength = Math.floor(Math.random() * 3) + 3;
        for (let j = 0; j < wordLength; j++) {
            const randomIndex = Math.floor(Math.random() * keys.length);
            words += keys[randomIndex];
        }
        words += " ";
    }
    return words.trim();
}

function TypingApp() {
    const [words, setWords] = useState(generateWords());
    const [startTime, setStartTime] = useState(null);
    const [typedText, setTypedText] = useState("");
    const [correctKey, setCorrectKey] = useState(0);
    const [incorrectKey, setIncorrectKey] = useState(0);
    const [isTyping, setIsTyping] = useState(false);
    const [inputColors, setInputColors] = useState([]);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        if (isTyping && startTime === null) {
            setStartTime(Date.now());
        }
    }, [isTyping, startTime]);
    useEffect(() => {
        if (typedText === words) {
            setWords(generateWords());
            setTypedText("");
            setCorrectKey(0);
            setIncorrectKey(0);
            setStartTime(null);
            setIsTyping(false);
            setInputColors([]);
            updateHistory();
        }
    }, [typedText, words]);

    const handleInputChange = (e) => {
        const inputText = e.target.value;
        setTypedText(inputText);
        setIsTyping(inputText.length > 0);
        const newInputColors = [];

        if (inputText === words) {
            setWords(generateWords());
            setTypedText("");
            setStartTime(null);
            setCorrectKey(0);
            setIncorrectKey(0);
            setIsTyping(false);
            setInputColors([]);
            updateHistory();
        } else {
            for (let i = 0; i < inputText.length; i++) {
                const typedChar = inputText[i];
                if (i < words.length) {
                    if (typedChar === words[i]) {
                        newInputColors.push("");
                        setCorrectKey((prevCount) => prevCount + 1);
                    } else {
                        newInputColors.push("red");
                        setIncorrectKey((prevCount) => prevCount + 1);
                    }
                } else {
                    newInputColors.push("red");
                }
            }
        }

        setInputColors(newInputColors);
    };

    const accuracy =
        (correctKey / (correctKey + incorrectKey + 0.01)) *
        100;

    const wpm = Math.floor(
        typedText.length / 5 / ((Date.now() - startTime) / 1000 / 60)
    );

    const updateHistory = () => {
        const elapsedTime = (Date.now() - startTime) / 1000;
        const newHistory = [...history, { wpm, accuracy, elapsedTime }];
        if (newHistory.length > 5) {
            newHistory.shift();
        }
        setHistory(newHistory);
    };

    return (
        <div className="app-container">
            <h1>Typing Master</h1>
            <p className="random">{words}</p>
            <input
                type="text"
                value={typedText}
                onChange={handleInputChange}
                placeholder="Start typing..."
                style={{
                    backgroundColor: inputColors.join(" "),
                }}
            />
            <p className="stats">
                <Timer isTyping={isTyping} />
            </p>
            <p className="stats">Accuracy: {accuracy.toFixed(2)}%</p>
            <p className="stats">WPM: {wpm}</p>
            <h2>History <span>(recent 5 laps)</span></h2>
            <table>
                <thead>
                    <tr>
                        <th>WPM</th>
                        <th>Accuracy</th>
                        <th> Timer</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((ele, index) => (
                        <tr key={index}>
                            <td>{ele.wpm}</td>
                            <td>{ele.accuracy.toFixed(2)}%</td>
                            <td>{ele.elapsedTime.toFixed(1)}s</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default TypingApp;
