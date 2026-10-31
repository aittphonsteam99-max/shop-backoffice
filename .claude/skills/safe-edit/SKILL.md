---
name: safe-edit
description: แก้โค้ดระบบหลังร้านแบบผิดพลาดน้อยและประหยัด Token — แก้ทีละเรื่อง ทดสอบในเบราว์เซอร์ รัน /code-review ระดับต่ำ แล้ว commit/push ขึ้น GitHub. ใช้เมื่อผู้ใช้สั่งแก้/เพิ่มฟีเจอร์ใน ระบบหลังร้าน.html หรือพูดว่า "แก้แบบปลอดภัย", "safe edit", "แก้แล้วตรวจให้ด้วย", "อัปขึ้น GitHub".
---

# Safe edit

Workflow for changing `ระบบหลังร้าน.html` with the fewest bugs and the least token use. Reply to the user in Thai.

## 1. Scope small
- Handle one change per pass. If the request bundles several unrelated changes, list them and do them one at a time, each going through steps 2–5.
- Locate the code with Grep before reading. Read only the relevant line range, never the whole file.
- Use Edit with exact snippets. Do not rewrite the file.

## 2. Protect data
- Keep the localStorage key `stock_v5` and the existing `db` shape (`products`, `bills`, `transactions`, `customers`, `cash`, `transfer`, `credit`, `payable`). Add fields only; never rename or remove them. Old data and the GitHub sync (`data.json` + `images.json`, three-way merge by `id`) depend on it.
- Every record in those arrays needs a unique `id`; the sync merges by `id` and treats numbers `cash`/`transfer`/`credit`/`payable`/product `qty` as deltas. Never write `db` fields from code that bypasses `save()`.
- Any change that moves money or stock must also have a reverse path: `delBill` / `delTx` must undo it exactly.

## 3. Test in the browser
- Open the file in the Browser pane. Exercise the changed flow with `javascript_tool` (call the page's own functions, check `db` values) instead of screenshots where possible.
- Never clear or overwrite the user's real data. Test only in the Browser pane's own origin.
- For layout changes, check `document.documentElement.scrollWidth` at the mobile preset (375px). It must equal the viewport width.

## 4. Review
- Invoke the `code-review` skill on the current diff:
  - `low` by default.
  - `medium` when the change touches profit, cost, stock quantity, balances, the parser, or the forecast.
  - Never `ultra` unless the user asks (it is billed separately).
- Fix confirmed findings, then re-test the affected flow once.

## 5. Save
- Refresh PATH first in PowerShell: `$env:Path = [Environment]::GetEnvironmentVariable('Path','Machine') + ';' + [Environment]::GetEnvironmentVariable('Path','User')`
- `git add -A; git commit -m "<สรุปสั้นภาษาไทย>"; git push`
- Never commit `*.mp4` or backup `*.json` files (already in `.gitignore`).

## 6. Report
Tell the user in a few lines: what changed, how it was tested, what the review found, and the commit. State plainly anything not tested.
