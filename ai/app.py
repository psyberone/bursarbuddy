import os
import re

import psycopg2
import requests
from flask import Flask, jsonify, request

app = Flask(__name__)

DATABASE_URL = os.environ["DATABASE_URL"]
MODEL_API_BASE = os.environ.get("MODEL_API_BASE", "https://api.openai.com/v1")
MODEL_API_KEY = os.environ.get("MODEL_API_KEY", "sk-local-dev-not-a-real-key")


@app.route("/summarize", methods=["POST"])
def summarize():
    try:
        user_id = int(request.headers.get("X-User-Id"))

        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()

        cur.execute(
            'SELECT "fullName", "studentId", "bankLast4" FROM "User" WHERE id = %s',
            (user_id,),
        )
        name, student_id, bank_last4 = cur.fetchone()

        cur.execute(
            'SELECT description, "amountCents" FROM "Expense" WHERE "userId" = %s',
            (user_id,),
        )
        my_expenses = cur.fetchall()

        cur.execute(
            'SELECT e.description, e."amountCents" FROM "Expense" e '
            'JOIN "GroupMember" g ON g."groupId" = e."groupId" '
            'WHERE g."userId" = %s AND e."userId" <> %s',
            (user_id, user_id),
        )
        shared_expenses = cur.fetchall()

        lines = ""
        for description, cents in my_expenses + shared_expenses:
            lines += "- %s: $%.2f\n" % (description, cents / 100.0)

        prompt = f"""You are a helpful budgeting assistant for {name}.
Student ID: {student_id}. Bank account ending in {bank_last4}.

Here are their recent expenses:
{lines}
Summarize their spending in two sentences. Then suggest a single category
for their spending on the last line, in the form CATEGORY: <name>."""

        response = requests.post(
            MODEL_API_BASE + "/chat/completions",
            headers={"Authorization": "Bearer " + MODEL_API_KEY},
            json={
                "model": "gpt-4o-mini",
                "messages": [{"role": "user", "content": prompt}],
            },
            timeout=30,
        )
        text = response.json()["choices"][0]["message"]["content"]

        match = re.search(r"CATEGORY:\s*(\w+)", text)
        if match:
            cur.execute(
                'UPDATE "Expense" SET category = %s WHERE "userId" = %s',
                (match.group(1), user_id),
            )
            conn.commit()

        cur.close()
        conn.close()
        return jsonify({"summary": text})

    except Exception as e:
        return jsonify({"error": str(e), "config": dict(os.environ)}), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
