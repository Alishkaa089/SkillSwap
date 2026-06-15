@echo off
start "SkillSwap Backend" cmd /k "cd /d C:\Users\Musaz_in86\SkillSwap\backend && C:\Users\Musaz_in86\SkillSwap\backend\.venv\Scripts\python.exe manage.py runserver 0.0.0.0:8000"
start "SkillSwap Frontend" cmd /k "cd /d C:\Users\Musaz_in86\SkillSwap\frontend && npm run dev"
echo Both servers starting...
exit 0
