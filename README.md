# Translation App

A simple, interactive language learning app built with React, Vite, and the Gemini API.

## 🚀 Features

- **Prompt-based story generation**: Enter a creative idea and get a 200+ word story in informal English.
- **Instruction-based generation**: Ask for lists, short answers, or other custom formats.
- **Custom input mode**: Paste or type in your own English text for translation.
- **Sentence-by-sentence translation**: English and Spanish versions are shown side-by-side.
- **Interactive toggling**: Tap on sentences to switch between Spanish and English.
- **Sentence reset**: Swipe left a sentence to revert it to its original Spanish state.
- **Sentence done**: Swipe right a sentence to mark it in gray.
- **Clean layout**: TailwindCSS-powered design with responsive UI.

## 🛠️ Getting Started

1. Clone or download the repo.
2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

Then open your browser to [http://localhost:5173](http://localhost:5173)

## 📦 Building for Production

```bash
npm run build
npm run preview
```

## 📁 Project Structure

- `src/TranslationApp.jsx` - Main app logic and UI
- `index.html` - App entry point
- `.gitignore` - Ignores node_modules and build files

## 🌐 Deployment

You can deploy this app to [Netlify](https://netlify.com), [Vercel](https://vercel.com), or any static hosting platform.

## 💡 Tech Stack

- React
- Vite
- Tailwind CSS
- Gemini API (Google AI)

## 🧠 Notes

- The app uses the Gemini API, so an internet connection is required.
- `node_modules/` is ignored from version control via `.gitignore`.
- To customize the prompt or translation logic, edit `TranslationApp.jsx`.

## 📄 License

MIT – Feel free to use, modify, and share!
