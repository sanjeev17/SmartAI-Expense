import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import ErrorBoundary from "@/components/ErrorBoundary";

// Global error handlers to avoid silent failures that blank the UI
if (typeof window !== "undefined") {
	window.addEventListener("error", (ev) => {
		// eslint-disable-next-line no-console
		console.error("Global error:", ev.error || ev.message, ev);
	});
	window.addEventListener("unhandledrejection", (ev) => {
		// eslint-disable-next-line no-console
		console.error("Unhandled promise rejection:", ev.reason);
	});
}

createRoot(document.getElementById("root")!).render(
	<ErrorBoundary>
		<App />
	</ErrorBoundary>
);
