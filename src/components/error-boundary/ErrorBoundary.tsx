import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="w-full h-screen flex items-center justify-center">
          <div className="flex flex-col items-center">
            <h2 className="text-3xl font-extrabold mb-2">
              Nimadir xato ketdi
            </h2>
            <p className="text-gray-400 text-lg max-w-110 text-center leading-6 mb-3">
              Sahifada kutilmagan xatolik yuz berdi. Iltimos, sahifani qayta
              yuklab ko'ring
            </p>
            <Button
              className="bg-primary h-10 px-4 dark:text-white cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Sahifani yangilash
            </Button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
