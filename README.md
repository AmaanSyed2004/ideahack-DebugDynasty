# A service desk for a bank branch

Third prize at the iDEA hackathon by Union Bank of India. Built in two days.

A customer logs in with their face, says what is wrong in their own words, and the
request goes to the right department. Then they choose: wait in a live queue, or book
a time.

## What it does

**Log in with two things.** A password, and a photo of your face. At sign-up the face is
turned into numbers (ArcFace, through DeepFace) and stored. At each login a new photo is
compared with them. The staff log in the same way. A voice print is taken at sign-up too.

**Ask in three ways.** Type the problem, speak it, or record a video. For audio and
video, ffmpeg pulls the sound out and Whisper turns it into text.

**It finds the department.** The text is checked against a word list for each of four
departments, and the one with the most hits gets the ticket:

| Department | Some of its words |
| --- | --- |
| Loan Services | loan, mortgage, interest, repayment |
| Deposit and Account Services | account, deposit, transfer, statement |
| Operations and Service Requests | password, login, error, mobile app |
| Customer Grievance and Fraud | complaint, fraud, unauthorized, dispute |

The lists also hold common misspellings and misheard words, because the text often
comes from speech.

**Wait, or book.** With a ticket, the customer picks one:

- A live turn. They see their place in the queue and a wait time.
- An appointment. Half-hour slots, 9 to 6, with lunch off, for the next seven days.

**The staff side.** A queue of live tickets, highest priority first and then the oldest,
with the customer's recording and its transcript. Staff take a ticket and close it.

## Layout

```
client/          React. The customer pages and the staff dashboard.
server/          Node and Express. Logins, tickets, the queue, appointments.
                 PostgreSQL through Sequelize. OTP by SMS through Twilio.
ML_Components/   Python and FastAPI. Face and voice checks, Whisper, the sorter,
                 and the models below.
```

## Also in the repo

- **A priority scorer.** It gives a customer a score from their credit score, assets,
  income, transactions, missed payments, fraud risk, and the mood of the message. It
  runs as its own endpoint, `/prioritization`.
- **Mood of the message.** A VADER sentiment score for the text.
- **Loan suggestions.** A Random Forest that returns the three loan types that fit a
  customer best, at `/recommendation`.

## Run it

You need Node 18 or newer, Python 3.10 or newer, PostgreSQL, and ffmpeg.

```sh
# the models
cd ML_Components
pip install fastapi uvicorn python-multipart deepface openai-whisper resemblyzer speechbrain soundfile vaderSentiment scikit-learn pandas dill
uvicorn main:app --port 8000

# the server
cd server && npm install && npm run dev

# the pages
cd client && npm install && npm run dev
```

The server needs a `.env` file with the database, the JWT secret, and the Twilio keys.
It is not in the repo.

## Licence

MIT.
