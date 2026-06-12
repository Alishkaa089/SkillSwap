#!/bin/bash
echo "=== SkillSwap Backend Setup ==="

pip install django djangorestframework djangorestframework-simplejwt drf-spectacular django-cleanup django-cors-headers pillow

echo "--- Running migrations ---"
python manage.py makemigrations users
python manage.py makemigrations skills
python manage.py makemigrations swaps
python manage.py makemigrations reviews
python manage.py makemigrations notifications
python manage.py makemigrations follows
python manage.py migrate

echo "--- Creating superuser (admin/admin123) ---"
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@skillswap.com', 'admin123') if not User.objects.filter(username='admin').exists() else print('exists')" | python manage.py shell

echo "--- Loading sample data ---"
python manage.py shell << 'EOF'
from django.contrib.auth.models import User
from users.models import UserProfile
from skills.models import Category, Skill

categories = [
    ("Proqramlaşdırma", "💻"),
    ("Musiqi", "🎵"),
    ("Dil öyrənmə", "🌍"),
    ("Dizayn", "🎨"),
    ("Aşpazlıq", "🍳"),
    ("İdman", "⚽"),
    ("Fotoqrafiya", "📷"),
    ("Biznes", "💼"),
]
for name, icon in categories:
    Category.objects.get_or_create(name=name, defaults={"icon": icon})

print("Categories created!")

users_data = [
    ("feyruz", "feyruz@test.com", "test1234", "Feyruz", "Əliyeva"),
    ("nicat", "nicat@test.com", "test1234", "Nicat", "Həsənov"),
    ("leyla", "leyla@test.com", "test1234", "Leyla", "Məmmədova"),
]
for username, email, password, first, last in users_data:
    if not User.objects.filter(username=username).exists():
        u = User.objects.create_user(username=username, email=email, password=password, first_name=first, last_name=last)
        UserProfile.objects.get_or_create(user=u)
        print(f"User {username} created!")

prog = Category.objects.get(name="Proqramlaşdırma")
music = Category.objects.get(name="Musiqi")
lang = Category.objects.get(name="Dil öyrənmə")

feyruz = User.objects.get(username="feyruz")
nicat = User.objects.get(username="nicat")

skills_data = [
    (feyruz, prog, "Python Proqramlaşdırma", "Python öyrədirəm — Django, Flask, data structures", "advanced"),
    (feyruz, lang, "İngilis Dili Dərsləri", "İngilis dilini A1-dən B2-yə qədər öyrədirəm", "expert"),
    (nicat, music, "Gitara Dərsləri", "Akustik gitara — başlanğıcdan orta səviyyəyə kimi", "intermediate"),
    (nicat, prog, "React Frontend", "React + Tailwind ilə müasir UI hazırlamaq", "advanced"),
]
for owner, cat, title, desc, level in skills_data:
    if not Skill.objects.filter(title=title).exists():
        Skill.objects.create(owner=owner, category=cat, title=title, description=desc, level=level)
        print(f"Skill '{title}' created!")

print("=== Sample data loaded! ===")
EOF

echo ""
echo "=== Setup complete! ==="
echo "Run: python manage.py runserver"
echo "Admin: http://localhost:8000/admin  (admin/admin123)"
echo "Docs:  http://localhost:8000/api/docs/"
