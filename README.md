# SkillSwap — Bacarıq Mübadiləsi Platforması

Django REST Framework + React + Tailwind CSS ilə yazılmış tam stack proyekt.

---

## 🚀 Sürətli Başlanğıc

### Backend

```bash
cd backend

# 1. Virtual environment yarat və paketləri yüklə
python -m venv .venv
source .venv/bin/activate        # Mac/Linux
# .venv\Scripts\activate         # Windows

pip install django djangorestframework djangorestframework-simplejwt drf-spectacular django-cleanup django-cors-headers pillow

# 2. Migrate et
python manage.py makemigrations users skills swaps reviews notifications follows
python manage.py migrate

# 3. Superuser yarat
python manage.py createsuperuser

# 4. (Könüllü) Nümunə data yüklə
bash setup.sh

# 5. Serveri başlat
python manage.py runserver
```

### Frontend

```bash
cd frontend

npm install
npm run dev
```

---

## 🌐 URL-lər

| Servis | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000/api/ |
| Swagger Docs | http://localhost:8000/api/docs/ |
| Admin Panel | http://localhost:8000/admin/ |

---

## 📦 API Endpointləri (48 ədəd)

### Auth
| Method | URL | Təsvir |
|---|---|---|
| POST | /api/auth/register/ | Qeydiyyat |
| POST | /api/auth/login/ | Giriş (JWT) |
| POST | /api/auth/logout/ | Çıxış |
| POST | /api/auth/refresh/ | Token yenilə |
| GET | /api/auth/me/ | Öz profilim |
| PATCH | /api/auth/me/ | Profili yenilə |

### Users
| Method | URL | Təsvir |
|---|---|---|
| GET | /api/users/{id}/ | İstifadəçi profili |
| GET | /api/users/search/?search= | İstifadəçi axtar |

### Skills
| Method | URL | Təsvir |
|---|---|---|
| GET | /api/skills/ | Bacarıqları listlə |
| POST | /api/skills/ | Yeni bacarıq |
| GET | /api/skills/{slug}/ | Bacarıq detalı |
| PATCH | /api/skills/{slug}/ | Bacarığı yenilə |
| DELETE | /api/skills/{slug}/ | Bacarığı sil |
| GET | /api/skills/my/ | Öz bacarıqlarım |
| GET | /api/skills/trending/ | Trend bacarıqlar |
| GET | /api/skills/stats/ | Statistika |
| GET | /api/categories/ | Kateqoriyalar |

### Swaps
| Method | URL | Təsvir |
|---|---|---|
| GET | /api/swaps/ | Bütün swap-larım |
| POST | /api/swaps/ | Swap sorğusu göndər |
| GET | /api/swaps/{id}/ | Swap detalı |
| PATCH | /api/swaps/{id}/accept/ | Qəbul et |
| PATCH | /api/swaps/{id}/reject/ | Rədd et |
| PATCH | /api/swaps/{id}/complete/ | Tamamla |
| DELETE | /api/swaps/{id}/cancel/ | Ləğv et |
| GET | /api/swaps/incoming/ | Gələn sorğular |
| GET | /api/swaps/outgoing/ | Göndərilən sorğular |
| GET | /api/swaps/stats/ | Swap statistikası |

### Reviews
| Method | URL | Təsvir |
|---|---|---|
| GET | /api/reviews/ | Bütün rəylər |
| POST | /api/reviews/ | Rəy yaz |
| GET | /api/reviews/{id}/ | Rəy detalı |
| PATCH | /api/reviews/{id}/ | Rəyi yenilə |
| DELETE | /api/reviews/{id}/ | Rəyi sil |
| GET | /api/reviews/user/{id}/ | İstifadəçinin rəyləri |
| GET | /api/reviews/leaderboard/ | Reytinq lövhəsi |

### Notifications
| Method | URL | Təsvir |
|---|---|---|
| GET | /api/notifications/ | Bütün bildirişlər |
| GET | /api/notifications/unread/ | Oxunmamışlar |
| GET | /api/notifications/unread_count/ | Sayı |
| PATCH | /api/notifications/{id}/read/ | Oxunmuş işarələ |
| POST | /api/notifications/read_all/ | Hamısını oxu |
| DELETE | /api/notifications/{id}/ | Sil |

### Follows
| Method | URL | Təsvir |
|---|---|---|
| POST | /api/users/{id}/follow/ | İzlə |
| DELETE | /api/users/{id}/unfollow/ | İzləməyi dayandır |
| GET | /api/users/{id}/followers/ | İzləyicilər |
| GET | /api/users/{id}/following/ | İzlənilənlər |
| GET | /api/users/{id}/is-following/ | İzləyirəmmi? |
| GET | /api/users/feed/ | Lent |

---

## 🏗️ Struktur

```
skillswap/
├── backend/
│   ├── core/            # Django konfiqurasiyası
│   ├── users/           # Auth + profil
│   ├── skills/          # Bacarıqlar
│   ├── swaps/           # Swap sorğuları
│   ├── reviews/         # Rəylər + reytinq
│   ├── notifications/   # Bildirişlər
│   ├── follows/         # Follow sistemi
│   └── manage.py
└── frontend/
    └── src/
        ├── pages/       # Səhifələr
        ├── components/  # Komponentlər
        ├── services/    # API çağırışları
        └── context/     # Auth context
```

---

## 🔐 Test hesabı (setup.sh işlətdikdən sonra)

| Hesab | Şifrə |
|---|---|
| admin | admin123 |
| feyruz | test1234 |
| nicat | test1234 |
