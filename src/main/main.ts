// import { app, BrowserWindow } from "electron";

// function createWindow(): void {
//   const window = new BrowserWindow({
//     width: 800,
//     height: 600
//   });

//   window.loadFile("src/renderer/index.html");
// }

// app.whenReady().then(() => {
//   createWindow();
// });
import { app, BrowserWindow, globalShortcut, clipboard } from "electron";
import { keyboard, Key } from "@nut-tree-fork/nut-js";
import { rephraseText } from "../gemini";
import { rephraseWithGPT } from "../openai";
let mainWindow: BrowserWindow | null = null;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600
  });

  mainWindow.loadFile("src/renderer/index.html");
}

app.whenReady().then(() => {
  createWindow();

  const registered = globalShortcut.register(
    "CommandOrControl+Shift+Space",
    async () => {
        console.log("🔥 RephraseX shortcut detected!");

        const previousClipboard = clipboard.readText();

        const selectionMarker = "__REPHRASEX_SELECTION_TEST__";
        await clipboard.writeText(selectionMarker);

        await keyboard.pressKey(Key.LeftControl, Key.C);
        await keyboard.releaseKey(Key.LeftControl, Key.C);
        await new Promise(resolve => setTimeout(resolve, 100));

        const selectedText = await clipboard.readText();
        if (selectedText === selectionMarker) {
          console.log("⚠️ No text selected.");
          clipboard.writeText(await previousClipboard);
          return;
        }

        console.log("📋 Captured text:", selectedText);
        const loadingText = [
  "🧠 Picking better words...",
  "✨ Improving clarity...",
  "🔍 Checking grammar...",
  "🎯 Finalizing..."
];

// Show first message
await clipboard.writeText(loadingText[0]);

await keyboard.pressKey(Key.LeftControl, Key.V);
await keyboard.releaseKey(Key.LeftControl, Key.V);

await new Promise(resolve => setTimeout(resolve, 100));

// Select first message
for (let i = 0; i < loadingText[0].length; i++) {
  await keyboard.pressKey(Key.LeftShift, Key.Left);
  await keyboard.releaseKey(Key.LeftShift);
}

// Start GPT
const gptPromise = rephraseWithGPT(selectedText);

// Cycle through loading messages
let stepIndex = 0;

while (true) {

  const result = await Promise.race([
    gptPromise,
    new Promise<null>(resolve =>
      setTimeout(() => resolve(null), 1200)
    )
  ]);

  if (result !== null) {
    // GPT finished
    const transformedText = result;

    console.log("✨ Transformed text:", transformedText);

    await clipboard.writeText(transformedText);

    await keyboard.pressKey(Key.LeftControl, Key.V);
    await keyboard.releaseKey(Key.LeftControl, Key.V);

    await new Promise(resolve => setTimeout(resolve, 100));

    break;
  }

  // Move to next loading message
  stepIndex = (stepIndex + 1) % loadingText.length;

  const nextText = loadingText[stepIndex];

  await clipboard.writeText(nextText);

  await keyboard.pressKey(Key.LeftControl, Key.V);
  await keyboard.releaseKey(Key.LeftControl, Key.V);

  await new Promise(resolve => setTimeout(resolve, 100));

  // Select the new loading message
  for (let i = 0; i < nextText.length; i++) {
    await keyboard.pressKey(Key.LeftShift, Key.Left);
    await keyboard.releaseKey(Key.LeftShift);
  }
  }

    clipboard.writeText(await previousClipboard);
        
    }
  );

  if (!registered) {
    console.log("❌ Failed to register shortcut");
  } else {
    console.log("✅ RephraseX shortcut registered!");
  }
});

app.on("will-quit", () => {
  globalShortcut.unregisterAll();
});