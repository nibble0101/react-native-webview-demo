import { WebView } from "react-native-webview";
import { useRef } from "react";

export default function HomeScreen() {
  const webRef = useRef(null);

  const customHTML = `
    <body style="display:flex; flex-direction: column;justify-content: center; 
      align-items:center; background-color: black; color:white; height: 100%;">
        <h1 style="font-size:100px; padding: 50px; text-align: center;" 
        id="h1_element">
          This is simple html
        </h1>
        <h2 style="display: block; font-size:80px; padding: 50px; 
        text-align: center;" id="h2_element">
          This text will be changed later!
        </h2>
    </body>`;

  const runFirst = `
    setTimeout(function() { 
      window.alert("Click me!"); 
      document.getElementById("h1_element").innerHTML = 
      "What is your favourite language?";
      document.getElementById("h2_element").innerHTML =
      "We will see!";
    }, 1000);
    true; // note: this is required, or you'll sometimes get silent failures
    `;

  const runBeforeFirst = `
    window.isNativeApp = true;
    true; // note: this is required, or you'll sometimes get silent failures
    `;

  const injectedJavaScript = `
    const languages = [
       "Rust",
       "Python",
       "JavaScript",
       "TypeScript",
       "C++",
       "Go",
       "R",
       "Java",
       "PHP",
       "Kotlin",
     ];

      const headerElement = document.getElementById("h2_element");
      let counter = 0;

      const setIntervalId = setInterval(() => {
        if (counter === languages.length) {
          clearInterval(setIntervalId);

          window.ReactNativeWebView.postMessage(
            "You are now getting redirected!"
          );
          
          window.location = "https://blog.logrocket.com";
          return;
        }

        if (document.body.style.backgroundColor === "white") {
          document.body.style.backgroundColor = "black";
          document.body.style.color = "white";
        } else {
          document.body.style.backgroundColor = "white";
          document.body.style.color = "black";
        }

        headerElement.textContent = languages[counter++] + "?";

        window.ReactNativeWebView.postMessage("counter: " + counter.toString());
      }, 1_000);

      true; // note: this is required, or you'll sometimes get silent failures
  `;

  const onLoadHandler = ({ nativeEvent }) => {
    if (!nativeEvent.url.startsWith("http")) {
      webRef.current.injectJavaScript(injectedJavaScript);
    }
  };

  return (
    <WebView
      source={{ html: customHTML }}
      ref={webRef}
      onMessage={(event) => {
        console.log(event.nativeEvent.data);
      }}
      onLoad={onLoadHandler}
      injectedJavaScript={runFirst}
      injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
    />
  );
}
