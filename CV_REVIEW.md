# CV review — Ashar Rai Mujeeb

Reviewed 6 September 2026. Primary document: `public/cv.pdf`, the file linked from the portfolio. Compared with `public/resume.pdf`, `src/content/work.js`, `src/content/projects.js`, and `scripts/generate-site.mjs`. Extracted text with Ghostscript and inspected a rendered image of the current CV. This is a hiring-oriented editorial review, not independent verification of employment, results, or qualifications. Neither PDF has been changed.

## Overall assessment

The substance is stronger than the presentation. You have credible material for a fintech PM application: investment product launches, onboarding, payments, analytics, and delivery with a small team. The legal background gives the career transition a clear context. I would want to interview you about the KYC work and how you scoped the mutual-funds launch.

The CV currently reads as six unusually tidy growth results followed by a paragraph claiming broad engineering mastery. It tells me what improved, but gives me little evidence of your decisions, constraints, or measurement. That creates avoidable questions about attribution and depth. Lead with the products you owned and the decisions you made, keep the strongest defensible outcomes, and show two actual projects.

For roles requiring repeated team leadership, a large product area, or people management, this document does not yet demonstrate that scope. For hands-on PM roles at a small fintech or an early-stage product team, the experience is much easier to map.

## Changes in priority order

1. **Make the strongest metrics defensible.** Keep numbers you can explain from source data. State the timeframe and define unfamiliar funnel events. A before/after change is not, by itself, evidence that your feature caused it.
2. **Replace the projects paragraph with two named projects.** `resume.pdf` is better here because it names what you built. Its seven-item list is still too broad; choose two relevant examples and give each one concrete sentence and a link.
3. **Show PM judgment.** The portfolio says you worked with two engineers and one designer, chose manual basket allocation over a more complex system, and prioritized core fund search for a two-month launch. These details are more useful than “enabled entry into the product funnel.” Confirm the scope before moving them into the CV.
4. **Remove the funnel slogans.** “Built what users spend on” and “Made revenue predictable, recurring, scalable” sound promotional. The latter asserts business effects not established by a renewal-rate metric. Use ordinary headings or a single list of four to six bullets.
5. **Align the CV and portfolio.** The PDF points to `iarm.me` and `iarm.me/playground`; the current generator uses `ashar.site` and `/playground.html`. Choose the canonical public address and check both the displayed text and embedded PDF links. The portfolio highlights different metrics from the CV; make the evidence consistent across them.

## Metrics and claims to verify

These are questions to resolve, not accusations that the numbers are wrong. Local source text corroborates some work, but cannot validate its results.

| Claim | What needs clarification |
| --- | --- |
| Returning-user rate, 28% → 36% in 30 days | Define “returning”: login success, repeat visit, or cohort retention? Which eligible population had biometric login? This is an 8-percentage-point change. Explain how OTP failures were measured. |
| KYC time, 2 days → 3.5 minutes | Were both measured from the same start/end events, and across all applicants or only successful automated cases? Distinguish time spent completing the form from time to final approval. The case study says “hours to minutes,” so reconcile the baseline. |
| KYC completion, 48% → 72% | Supply measurement period and denominator. Completion alone does not establish an increase in “eligible leads” unless eligibility was measured separately. |
| Mid-funnel drop-offs reduced 27%; investment intent, 34% → 49% | Is 27% a relative reduction or percentage-point change? Define the mid-funnel steps and intent event. Consider keeping one metric, preferably the one closest to completed investment. |
| Activation-to-invest, 14% → 29% | Define activation and conversion window. Mutual funds, IPOs, SGBs, and baskets were not necessarily one launch; identify which release or period the result describes. The portfolio places stocks/ETFs work and the mutual-funds pivot in distinct phases. |
| Renewal repeat rate, 54% → 84% | Clarify the paid service, renewal cohort, and period. Was manual collection removed for everyone or only users who enabled Autopay? This does not alone prove predictable or scalable revenue. |
| Repeat-investment rate, 21% → 33% | Define repeat investment and its time window. Explain which segments/nudges you designed and whether a control group or comparison cohort existed. Tool integration alone is not the intervention. |
| Portfolio: 2× AUM, 60% MAU increase, NPS 4 → 7 | These appear in the site generator, but are not substantiated with measurement details in the reviewed case-study text. Explain dates, populations, source, and your contribution. Check whether 4 → 7 is actually NPS or a mean satisfaction/recommendation rating; use the correct name. |
| “Mastering,” “scalable,” “child-safe” in Projects | Replace mastery with work performed. “Scalable” needs an architecture or usage basis. “Child-safe” is a stronger assertion than building a learning-device prototype for children; use the latter unless you have evaluated safety. |
| LLB (Cyber Law & Intellectual Property Law), 2012–2017 | Use the exact awarded degree title. If these were coursework or focus areas, label them that way. Do not infer a different degree from the five-year dates. |

Do not add all this measurement detail to the CV. Keep a private evidence sheet with metric definition, baseline and comparison dates, sample/cohort, dashboard or query, release date, and caveats. Add only the few words a reader needs to interpret the claim.

## Suggested summary

A summary is optional; use at most two lines if it helps explain the transition:

> Product manager at Fabits working on mutual-fund investing, onboarding, and payment flows. Previously a practicing advocate; I also build AI applications and hardware prototypes.

This stays within the supplied material. Avoid adding “expert,” “visionary,” or “proven track record.” Do not count the legal years as years of product management.

## Suggested Fabits wording

Start with scope, subject to confirming the team description in the portfolio:

> Owned product delivery during Fabits’ move into mutual funds, working with two engineers and one designer across discovery, onboarding, and investment flows.

Then use four to six bullets. These examples use existing source claims; they are not independent validation. The metric-bearing examples should be used only after the checks above. Reporting a change alongside a release is preferable to asserting unproven causation, but still requires a fair comparison.

- Led the HyperVerge KYC integration; average onboarding time fell from 2 days to 3.5 minutes and completion rose from 48% to 72%. **Use only if the timing definitions and cohorts match.**
- Scoped and launched mutual-fund search in two months with a two-engineer team, prioritizing fund discovery and BSE StaR MF integration over advanced analytics. **Confirm that two months describes this release, rather than a broader platform milestone.**
- Led development of goal-based mutual-fund baskets; chose a manual allocation dashboard to let admins manage baskets within the team’s engineering capacity.
- Introduced UPI Autopay for value-added service renewals; renewal rate increased from 54% to 84%. **Add the comparison period and specify eligible renewals if needed.**
- Defined lifecycle segments and behavior-based nudges using Mixpanel and CleverTap; repeat-investment rate rose from 21% to 33%. **Use “defined” only if you personally owned that work; otherwise state your actual contribution.**
- Launched IPO and Sovereign Gold Bond investment flows, coordinating ASBA transaction requirements and NSE integration with engineering.

If the KYC numbers cannot be reconciled, a concrete scope bullet is still useful:

> Led digital KYC delivery across HyperVerge and CVL KRA integrations, coordinating verification flows and error handling with engineering.

Do not use every example. For an onboarding/growth role, retain biometric login and the strongest measured funnel work. For an investing PM role, prioritize fund search, baskets, KYC, and transaction flows. Avoid giving several bullets the same broad conversion result.

## Suggested projects section

For a general product or AI-product application, two examples from the current portfolio:

- **Rabbithole — live:** Built an AI encyclopedia with personalized search and discovery. Link to its project page and a working demo if available.
- **Kit OS — alpha:** Built small AI applications with dedicated interfaces and saved context. Link to its project page and label the alpha status.

For a hardware-oriented role, substitute:

- **GG — prototype:** Built an e-ink learning device for children combining multimodal AI and physical interaction. Link to the demo and accurately describe its current availability; the portfolio currently marks it unmaintained.

Add one specific product decision, real usage result, or technical constraint for each if you can support it. Do not invent adoption figures. Put selected tools in a short skills line if they help the target role; the current list of frameworks and hosting platforms should not occupy the entire section. “Built” should reflect your actual contribution, including how you used AI coding tools when relevant in discussion.

## Layout and readability

The rendered PDF is a clean, single-page, single-column document. It has readable text and no distracting graphics. Text extraction preserved the content in a sensible order; this is encouraging for machine readability, but it is not a test against a particular applicant-tracking system.

The body is dense while large gaps sit below the contact details and above the Projects content. Reclaim those gaps for slightly larger body text or clearer separation between roles. The six Fabits bullets run together; shorter sentences and modest space between bullets will improve scanning more than another visual element.

Suggested order: name and contact links; optional two-line summary; Fabits; legal experience; two selected projects; education; compact relevant skills if space permits. Keep it to one page if the type remains comfortable. Add LinkedIn if maintained. Use a professional download filename such as `Ashar-Rai-Mujeeb-CV.pdf`.

Keep the legal role to one or two direct lines. For example: “Represented clients in criminal litigation, preparing legal arguments and evaluating case evidence.” Only add preparation work if accurate; the current PDF explicitly supports representation and evidence evaluation but does not document every task. There is no need to force generic “high-stakes communication” wording into a PM competency claim.

Standardize `Nov 2023 – Present`, `Jun 2019 – Nov 2023`, `CleverTap`, `UPI AutoPay` or the product’s official styling, punctuation, and spacing. Write increases as “48% to 72%” or “+24 percentage points”; avoid calling that a 24% increase.

## Before sending

Resolve the KYC measurement definition, choose the strongest three or four outcome claims, replace the Projects paragraph, and update the portfolio address. Those changes will improve this CV more than a visual redesign. Keep the PDF export selectable and check its actual hyperlinks after editing.
