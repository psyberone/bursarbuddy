# Contributing to BursarBuddy

BursarBuddy is a measurement instrument. That makes contributing here different
from contributing to ordinary open-source software, in one important way.

## Report. Do not fix.

If you find a security flaw, **please do not open a pull request that fixes it.**

Many of the flaws in this repository are there on purpose. A corrective PR — even
a well-crafted one — can damage the instrument, and it can do so invisibly, by
neutralizing a deliberate flaw somewhere other than the line you changed.

Instead, **open an issue** describing what you found and how to reproduce it.

## What happens to your report

Every report is acknowledged and labeled `under investigation`, and every report
is closed with the same boilerplate, on a fixed schedule.

That uniformity is deliberate and is not a reflection of your report's quality.
Disposition is never disclosed, because a tracker that distinguished intentional
flaws from accidental ones would gradually publish the answer key it exists to
protect.

Contributors are credited in a periodic thanks list.

## What we especially want

Reports of flaws that look **accidental** — the kind that creep in through a
dependency bump or a careless refactor rather than by design. Those are the ones
that quietly corrupt the corpus, and outside eyes are the best defense against
them.

## Code contributions

Non-security contributions are welcome: build tooling, documentation, developer
experience, accessibility, test infrastructure. Open an issue first so we can
confirm the change won't disturb the corpus.

## Reporting something genuinely dangerous

If you find something that puts *real people* at risk — a live credential
committed by mistake, real personal information in seed data, anything that could
cause harm outside a local sandbox — that is not a corpus flaw, it is an
emergency. Email the maintainers directly rather than opening an issue.
