@echo off
cd /d "C:\PROJECT's\Nexora"
git add vercel.json backend/config/gemini.js backend/routes/interview.js backend/routes/resume.js backend/routes/roadmap.js frontend/src/app/dashboard/interview/page.tsx frontend/src/app/dashboard/layout.tsx frontend/src/app/dashboard/resume/page.tsx frontend/src/app/dashboard/roadmap/page.tsx
git commit -m "Fix Vercel function size, Gemini model, layout spacing, input themes"
git push
echo DONE
