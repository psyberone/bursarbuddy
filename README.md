# BursarBuddy

> ## ⚠️ DELIBERATELY VULNERABLE — DO NOT DEPLOY
>
> **BursarBuddy is not a real accounting product.** It is a vulnerable-by-design
> application, published as a security-research corpus. It contains intentional
> security flaws, and it is meant to.
>
> - **Never deploy this on a public network.**
> - **Never use it with real financial data, real personal information, or real credentials.**
> - There is deliberately no hosted demo, no one-click deploy button, and no
>   published container image.
>
> It binds to localhost by default. Run it locally, or not at all.
>
> All seed data is synthetic. Names, addresses, phone numbers, student IDs, and
> account numbers are drawn from reserved or fictional ranges. This project
> exercises the *handling* of personal information; it must never contain any.

---

Keep track of where your money actually goes at school — dining dollars, textbooks,
that work-study paycheck, and the endless Venmo splits with your roommates.

## Features

- Log expenses and income, categorize them, see where it's going
- Split shared costs with roommates and settle up
- Snap a photo of a receipt instead of typing it in
- Ask for a plain-English summary of your month

## Running locally

```bash
docker compose up
```

The app comes up on `http://localhost:3000` with a seeded database.

## License

[MIT](LICENSE) — with the warning above restated in the license header, so it
travels with any copy or fork.
