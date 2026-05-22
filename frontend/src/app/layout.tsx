import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/contexts/AuthContext";

import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "Nexora - AI-Powered Placement Preparation Platform",
  description: "All-in-one AI placement prep: Resume analysis, mock interviews, coding assessments, and personalized roadmaps to land your dream job.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <AuthProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--bg-secondary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--border)',
              },
            }}
          />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
