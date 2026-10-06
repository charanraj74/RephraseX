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
        await keyboard.pressKey(Key.LeftControl, Key.C);
        await keyboard.releaseKey(Key.LeftControl, Key.C);
        await new Promise(resolve => setTimeout(resolve, 100));

        const selectedText = await clipboard.readText();

        console.log("📋 Captured text:", selectedText);
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