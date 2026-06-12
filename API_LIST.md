# SkillSwap API Endpoints

## Auth (5)
| Method | Endpoint | |
|--------|----------|-|
| POST | `/api/auth/register/` | Qeydiyyat |
| POST | `/api/auth/login/` | Giriş (JWT token) |
| POST | `/api/auth/refresh/` | Token yenilə |
| POST | `/api/auth/logout/` | Çıxış |
| GET/PATCH | `/api/auth/me/` | Profilimi göstər/düzəlt |

## Users (2)
| Method | Endpoint | |
|--------|----------|-|
| GET | `/api/users/{id}/` | İstifadəçi profili |
| GET | `/api/users/search/?search=` | Axtarış |

## Categories (2)
| Method | Endpoint | |
|--------|----------|-|
| GET | `/api/categories/` | Bütün kateqoriyalar |
| GET | `/api/categories/{id}/` | Tək kateqoriya |

## Skills (9)
| Method | Endpoint | |
|--------|----------|-|
| GET | `/api/skills/` | Siyahı (`?category=&level=&owner=&search=`) |
| POST | `/api/skills/` | Yarat |
| GET | `/api/skills/{slug}/` | Detal (baxış sayı artır) |
| PATCH | `/api/skills/{slug}/` | Yenilə |
| DELETE | `/api/skills/{slug}/` | Sil |
| GET | `/api/skills/my/` | Öz bacarıqlarım |
| GET | `/api/skills/trending/` | Trend (top 10) |
| GET | `/api/skills/stats/` | Statistikalar |

## Swaps (10)
| Method | Endpoint | |
|--------|----------|-|
| POST | `/api/swaps/` | Swap sorğusu göndər |
| GET | `/api/swaps/incoming/` | Gələn sorğular |
| GET | `/api/swaps/outgoing/` | Göndərilən sorğular |
| GET | `/api/swaps/{id}/` | Detal |
| PATCH | `/api/swaps/{id}/accept/` | Qəbul et |
| PATCH | `/api/swaps/{id}/reject/` | Rədd et |
| PATCH | `/api/swaps/{id}/complete/` | Tamamla |
| DELETE | `/api/swaps/{id}/cancel/` | Ləğv et |
| GET | `/api/swaps/stats/` | Statistikalar |

## Reviews (7)
| Method | Endpoint | |
|--------|----------|-|
| GET | `/api/reviews/` | Bütün rəylər |
| POST | `/api/reviews/` | Rəy yaz |
| GET | `/api/reviews/{id}/` | Detal |
| PATCH | `/api/reviews/{id}/` | Yenilə |
| DELETE | `/api/reviews/{id}/` | Sil |
| GET | `/api/reviews/user/{user_id}/` | İstifadəçinin rəyləri |
| GET | `/api/reviews/leaderboard/` | Reytinq (top 20) |

## Notifications (6)
| Method | Endpoint | |
|--------|----------|-|
| GET | `/api/notifications/` | Bütün bildirişlər |
| GET | `/api/notifications/{id}/` | Detal |
| DELETE | `/api/notifications/{id}/` | Sil |
| GET | `/api/notifications/unread/` | Oxunmamışlar |
| GET | `/api/notifications/unread_count/` | Sayı |
| PATCH | `/api/notifications/{id}/read/` | Oxundu işarələ |
| POST | `/api/notifications/read_all/` | Hamısını oxundu et |

## Follows (6)
| Method | Endpoint | |
|--------|----------|-|
| POST | `/api/users/{id}/follow/` | İzlə |
| DELETE | `/api/users/{id}/unfollow/` | İzləməyi dayandır |
| GET | `/api/users/{id}/followers/` | İzləyicilər |
| GET | `/api/users/{id}/following/` | İzlənilənlər |
| GET | `/api/users/{id}/is-following/` | İzləyirəm? |
| GET | `/api/users/feed/` | Lent (izlənilənlərin bacarıqları) |

---

**Cəmi: 46 endpoint** (+ admin, schema, docs = 49)
