//Css
import "./App.css";

// React
import { useCallback, useEffect, useState } from "react";

// data
import { wordsList } from "./data/words";

// components
import StartScreen from "./components/StartScreen";
import Game from "./components/Game";
import GameOver from "./components/GameOver";

const stages = [
  { id: 1, name: "start" },
  { id: 2, name: "game" },
  { id: 3, name: "end" },
];

const guessesQty = 3;

function App() {
  const [gameStage, setGameStage] = useState(stages[0].name);
  const [words] = useState(wordsList);

  const [pickedWord, setPickedWord] = useState("");
  const [pickedCategory, setPickedCategory] = useState("");
  const [letters, setLetters] = useState([]);

  const [guessedLetters, setGuessedLetters] = useState([]);
  const [wrongLetters, setWrongLetters] = useState([]);
  const [guesses, setGuesses] = useState(guessesQty);
  const [score, setScore] = useState(0);

  const pickWordAndCategory = useCallback(() => {
    // pick a random category
    const categories = Object.keys(words);
    const category =
      categories[Math.floor(Math.random() * Object.keys(categories).length)];

    console.log(category);

    // pick a random word
    const word =
      words[category][Math.floor(Math.random() * words[category].length)];

    console.log(word);

    return { word, category };
  }, [words]);

  // Start the secret word Game
  const startGame = useCallback(() => {
    // clear all letter
    clearLetterStates();

    // picked word and pick category
    const { word, category } = pickWordAndCategory();

    // create an array of letters

    let wordLetters = word.split("");

    // todas as letras minuscula
    wordLetters = wordLetters.map((l) => l.toLowerCase());

    console.log(word, category);
    console.log(wordLetters);

    //fill states
    setPickedWord(word);
    setPickedCategory(category);
    setLetters(wordLetters);

    setGameStage(stages[1].name);
  }, [pickWordAndCategory]);

  // Process the letter input
  const verifyLetter = (letter) => {
    // todas as letras que o usuario digitar, será transformada em minuscula
    const normalizedLetter = letter.toLowerCase();

    // check if letter has already been utlized
    // Não vai deixar o usuario reutilizar uma letra
    // vai verificar se a letra advinhda ou a letra errada, ja esta no normalizedLetter(ja foram usadas)
    if (
      guessedLetters.includes(normalizedLetter) ||
      wrongLetters.includes(normalizedLetter)
    ) {
      return;
    }

    // push guessed letter or remove a chance

    if (letters.includes(normalizedLetter)) {
      // vai adicionar as palavras advinhadas no setGuessedLetters, mudando seu estado atual(actualGuessedLtter)
      setGuessedLetters((actualGuessedLetters) => [
        ...actualGuessedLetters,
        normalizedLetter,
      ]);
    } else {
      // vai adicionar as palavras erradas no setWrongLetters, mudando seu estado atual(actualWrongLtter)
      setWrongLetters((actualWrongLetters) => [
        ...actualWrongLetters,
        normalizedLetter,
      ]);

      setGuesses((actualGuesses) => actualGuesses - 1);
    }
  };

  // Ele vai limpar todos os states

  const clearLetterStates = () => {
    setGuessedLetters([]);
    setWrongLetters([]);
  };

  // useEffect ele monitora um dado, tem uma funcão que será executada, cada vez que o dado for alterado
  // fazer algo quando os guesses(chances) ficar igual ou menor que 0
  // enquanto não chegar a 0, ele não executará o if
  // quando as guesses(chances), chegar a 0, vai chamar o estagio 2(fim de jogo)

  // check if guesses ended = (checar se as chances acabaram)
  useEffect(() => {
    if (guesses <= 0) {
      // reset all states
      clearLetterStates();

      setGameStage(stages[2].name);
    }
  }, [guesses]);

  // check win condition = ( checar a condição de vitoria)
  // vai monitorar se a palavra se repete duas vezes ou mais, para já aparecer todas que tiver repetidas
  useEffect(() => {
    const uniqueLetters = [...new Set(letters)];
    // win condition
    // se o total de letras adivinhadas for igual ao total de letras da palavra, vai finalizar o jogo como vitoria
    if (guessedLetters.length === uniqueLetters.length) {
      // add score
      setScore((actualScore) => (actualScore += 100));

      // restarte gane with new word (reiniciar jogo com nova palavra)
      startGame();
    }
  }, [guessedLetters, letters, startGame]);

  // Restarts the Game
  const retry = () => {
    // ao reiniciar o jogo, vai retornar, com 3 chances e pontuação zerada
    setScore(0);
    setGuesses(3);
    setGameStage(stages[0].name);
  };

  return (
    <div className="App">
      {gameStage === "start" && <StartScreen startGame={startGame} />}
      {gameStage === "game" && (
        <Game
          verifyLetter={verifyLetter}
          pickedWord={pickedWord}
          pickedCategory={pickedCategory}
          letters={letters}
          guessedLetters={guessedLetters}
          wrongLetters={wrongLetters}
          guesses={guesses}
          score={score}
        />
      )}
      {gameStage === "end" && <GameOver retry={retry} score={score} />}
    </div>
  );
}

export default App;
