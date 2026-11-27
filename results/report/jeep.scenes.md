# jeep: scene division comparison

- Correct breaks: after reference words 49, 81, 98 (the 4 paragraphs of references/jeep.txt).
- Key terms: references/jeep.terms.txt (8 terms, 3 misheard words).
- Words changed = how much the scene text differs from the sentences it came from (replaced, dropped or added words). Lower = closer to the recording.
- Break offset 0 = the scene starts at the same word as in the reference. "reference" rows show the scene model on a perfect transcript (the upper bound).

| Source transcript | Scene model | Prompt | Checks passed | Exact breaks | Avg break offset (words) | Same split every run | Words changed | Key terms found | Misheard words leaked | Avg ms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| jeep.reference | openai/gpt-oss-120b | v2 | 5/5 | 3/15 | 21.1 | no | 44.2% | 100% | Friday | 17790 |
| jeep.reference | openai/gpt-oss-120b | v3 | 5/5 | 9/15 | 10.5 | no | 0.8% | 100% | Friday | 19439 |
| jeep.whisper-large-v3-turbo | openai/gpt-oss-120b | v2 | 5/5 | 10/15 | 2.2 | no | 51.1% | 85% | Friday | 20346 |
| jeep.whisper-large-v3-turbo | openai/gpt-oss-120b | v3 | 4/5 | 5/12 | 3.7 | no | 4.0% | 88% | Friday, sis, baulit | 15785 |
| jeep.whisper-large-v3 | openai/gpt-oss-120b | v2 | 5/5 | 7/15 | 3.3 | no | 59.8% | 100% | none | 11230 |
| jeep.whisper-large-v3 | openai/gpt-oss-120b | v3 | 5/5 | 6/15 | 2.9 | no | 2.4% | 100% | Friday | 18526 |

## Details

- **jeep.reference · openai/gpt-oss-120b · v2** new words (not said in those sentences): at, ni, nagsabi, na, ang, pamasahe, nagtama, lolo, isko, siya, pero, kundi, may, 1972, ko, ay, tuwing, iyon, dahil, lang, singkwenta, sentimos, isang, araw, ibinigay, sa, akin, kanyang, noong, nagsulatsulat, kami, si, minsan, nagbabayad, ng, limampung, biyernes, huwebes, bumuhos, ito, para, hindi, ako, kilig, pa, rin, ulan, naramdaman, kaya, sulat, dalang, sumagot, sinabi, dating, naghardtoget, kaming
- jeep.reference · openai/gpt-oss-120b · v2 run 1: breaks off by -30, -32, -17 words
- jeep.reference · openai/gpt-oss-120b · v2 run 2: breaks off by -30, -32, -17 words
- jeep.reference · openai/gpt-oss-120b · v2 run 4: breaks off by -30, -32, -17 words
- jeep.reference · openai/gpt-oss-120b · v2 run 5: breaks off by -30, -32, -17 words
- **jeep.reference · openai/gpt-oss-120b · v3** new words (not said in those sentences): 1972
- jeep.reference · openai/gpt-oss-120b · v3 run 2: breaks off by -30, -32, -17 words
- jeep.reference · openai/gpt-oss-120b · v3 run 3: breaks off by -30, -32, -17 words
- **jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v2** new words (not said in those sentences): ko, ay, dating, tuwing, huwebes, umuuwi, at, sumasakay, sa, halagang, sentimo, isang, araw, bumuhos, ang, niya, sinabi, na, ulan, kinilig, ako, pero, nagact, akong, mahirap, abutin, nagplay, ng, hardtoget, nagtext, kahit, walang, nagsulatsulat, kami, apatnaput, itinago, ito, baul, halip, dalang, dosya, thursday, bahay, pamasahe, kaya, nagingat, may, dahil, halfday, nagbago, noong, pa, nagbabayad, 50, nagtextan, gamit, lolo, kanyang, nagpahard, to, get
- **jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v2** missed: Isko, Thursday | Huwebes
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v2 run 1: breaks off by 0, -8, 0 words
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v2 run 2: breaks off by 0, -8, 0 words
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v2 run 3: breaks off by 0, -8, 0 words
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v2 run 4: breaks off by 0, -1, 0 words
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v2 run 5: breaks off by 0, -8, 0 words
- **jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v3** new words (not said in those sentences): dosya, apatnaput, baul
- **jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v3** missed: Isko
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v3 run 1: breaks off by 0, -4, 0 words
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v3 run 2: breaks off by 0, -1, 15 words
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v3 run 3: breaks off by 0, -1, -4 words
- jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v3 run 4: breaks off by 0, -4, 15 words
- **jeep.whisper-large-v3 · openai/gpt-oss-120b · v2** new words (not said in those sentences): tuwing, thursday, at, sumasakay, ang, pamasahe, sinabi, nahilig, may, na, kahit, kaya, si, lolo, isko, ay, nagbabayad, ng, sentimo, isang, araw, nang, kanyang, naiilang, naghardtoget, noong, 1972, nagtext, gamit, liham, nagpropose, dalang, huwebes, limampung, bumuhos, hinubaran, ibinigay, akin, ulan, ito, sa, naiinit, nagpahardtoget, walang, nagsusulatsulat, kami, mga, sulat, apatnaput, piraso, sumagot, ako, mula, umuuwi, nagulan, sinabing, naiinis, kaming, magtext, cellphone, noon, nagsulatsulat, nagsimula, baul, biyernes, pero, minsan, nagkamali, siya, nabasa, nagtexttext, pamamagitan, pa, rin
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v2 run 1: breaks off by 0, -1, 0 words
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v2 run 2: breaks off by 0, -8, 3 words
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v2 run 3: breaks off by 0, -8, -9 words
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v2 run 4: breaks off by 0, -8, -9 words
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v2 run 5: breaks off by 0, -4, 0 words
- **jeep.whisper-large-v3 · openai/gpt-oss-120b · v3** new words (not said in those sentences): apatnaput, pumasa, ganun, rin, baul
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v3 run 1: breaks off by 0, -1, 3 words
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v3 run 2: breaks off by 0, -1, -9 words
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v3 run 3: breaks off by 0, -8, -9 words
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v3 run 4: breaks off by 0, -1, 3 words
- jeep.whisper-large-v3 · openai/gpt-oss-120b · v3 run 5: breaks off by 0, -8, 0 words

## Scene text (read these: numbers do not catch changed meaning)

<details><summary>jeep.reference · openai/gpt-oss-120b · v2 (run 1)</summary>

1. [1-2] Yung lolo mo, si Isko, jeepney driver siya noon sa Calamba, Laguna. Ako naman, nag-aaral ng nursing sa Maynila.
2. [3-9] Every Friday, umuuwi ako at sumasakay sa jeep ni Lolo Isko. Nagsabi siya na singkwenta sentimos lang ang pamasahe, pero nag‑tama siya, hindi pala Friday kundi Thursday. Basta, ganun.
3. [10-13] One day, umulan nang malakas at nabasa ‘yung mga libro ko. Hinubad ni Isko ‘yung jacket niya at sabi, “Miss, ito muna, baka ka magkasakit.” Kinilig ako pero nagpa‑hard‑to‑get, siyempre!
4. [14-19] Nag‑text‑an kami? Wala pang cellphone noon, sulat‑sulat lang. May apatnapu’t dalawang sulat na nakatago sa baul. Noong 1972, nag‑propose siya sa harap ng jeep na may hawak na isang dosenang rosas, at sabi ko, “Oo naman, ikaw pa!”

</details>

<details><summary>jeep.reference · openai/gpt-oss-120b · v3 (run 1)</summary>

1. [1-9] Yung lolo mo, si Isko, jeepney driver siya noon sa Calamba, Laguna. Ako naman, nag-aaral ng nursing sa Maynila. Every Friday, umuuwi ako, tapos sumasakay ako sa jeep niya. Pamasahe noon? Singkwenta sentimos lang, apo! Teka. Hindi pala Friday. Thursday ‘yon, kasi half-day kami tuwing Biyernes. Basta, ganun.
2. [10-13] One day, umulan nang malakas. Nabasa ‘yung mga libro ko. Hinubad ni Isko ‘yung jacket niya, tapos sabi niya, “Miss, ito muna, baka ka magkasakit.” Kinilig talaga ako, pero nagpa-hard-to-get ako, siyempre!
3. [14-17] Nag-text-an kami? Wala pang cellphone noon! Sulat-sulat lang. Mga apatnapu’t dalawang sulat ‘yon, nakatago pa sa baul.
4. [18-19] Noong 1972, nag-propose siya sa harap ng jeep, may hawak na isang dosenang rosas. Sabi ko, “Oo naman, ikaw pa!”

</details>

<details><summary>jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v2 (run 1)</summary>

1. [1-8] Lolo ko ay dating jeepney driver sa Calamba, Laguna. Ako ay nag-aaral ng nursing sa Maynila. Tuwing Huwebes, umuuwi ako at sumasakay sa jeep niya sa halagang 50 sentimo.
2. [9-13] Isang araw, bumuhos ang malakas na ulan at nabasa ang mga libro ko. Hinubad niya ang jacket ko at sinabi, “Miss, ito muna, baka magkasakit ka.” Kinilig ako pero nag‑act akong mahirap abutin.
3. [14-21] Nag‑play ako ng hard‑to‑get pero nag‑text kami kahit walang cellphone noon. Sa halip, nagsulat‑sulat kami ng apatnapu’t dalawang sulat at itinago ito sa baul.
4. [22-23] Noong 1972, nag‑propose siya sa harap ng jeepney na may dalang isang dosya ng rosas. Sabi ko, “Oo, oo naman, ikaw pa!”

</details>

<details><summary>jeep.whisper-large-v3-turbo · openai/gpt-oss-120b · v3 (run 1)</summary>

1. [1-8] Yung lolo mo, sis ko, jeepney driver siya noon sa Calamba, Laguna. Ako naman, nag-aaral ng nursing sa Maynila. Every Friday, umuwi ako. Tapos, mas masakay ako sa jeep niya. Pamasahin noon, 50 centimos lang, apo. Ay, teka, hindi pala Friday, Thursday yun. Kasi nga, half day kami tuwing biyernes. Basta ganon.
2. [9-14] One day, umulan ng malakas. Nabasa yung mga libro ko. Hinubad ko yung jacket niya. Tapos sabi niya, Miss, ito muna. Baka magkasakit ka. Kinilig talaga ako.
3. [15-21] Pero nagpa-hard to get ako. Siyempre, nag-textan kami. Wala pang cellphone noon. Sulat-sulat lang. Mga apatnapot dalawang sulat yun. Nakatago pa sa baulit.
4. [22-23] Noong 1972, nag-propose siya sa harap ng jeepney may hawak na isang dosya ng rosas. Sabi ko, oo, oo naman, ikaw pa.

</details>

<details><summary>jeep.whisper-large-v3 · openai/gpt-oss-120b · v2 (run 1)</summary>

1. [1-7] Yung lolo mo si Isko, jeepney driver siya noon sa Calamba, Laguna. Ako naman nag-aaral ng nursing sa Maynila. Tuwing Thursday umuuwi ako at sumasakay sa jeep niya, 50 centimos lang ang pamasahe.
2. [8-14] One day, umulan ng malakas at nabasa ang mga libro ko. Hinubad ni Isko ang jacket niya at sinabi, "Miss, ito muna. Baka magkasakit ka." Nahilig talaga ako pero nagpa-hard to get ako.
3. [15-19] Siyempre, nag-textan kami kahit wala pang cellphone noon, kaya sulat-sulat lang. May apatnapot dalawang sulat na nakatago pa sa bauli.
4. [20-22] Noong 1972, nag-propose si Lolo Isko sa harap ng jeepney, hawak ang isang dosenang rosas. Sabi ko, "Oo Oo naman, ikaw pa!"

</details>

<details><summary>jeep.whisper-large-v3 · openai/gpt-oss-120b · v3 (run 1)</summary>

1. [1-7] Yung lolo mo si Isko, jeepney driver siya noon sa Calamba, Laguna. Ako naman nag-aaral ng nursing sa Maynila. Every Friday, umuuwi ako, tapos masumasakay ako sa jeep niya. Pumasahin noon 50 centimos lang, apo. Teka, hindi pala Friday, Thursday yun. Kasi nga half day kami tuwing Biyernes. Basta ganon.
2. [8-14] One day, umulan ng malakas. Nabasa yung mga libro ko. Hinubad ni Isko yung jacket niya. Tapos sabi niya, Miss, ito muna. Baka magkasakit ka. Hinilig talaga ako. Pero nagpa-hard to get ako.
3. [15-20] Siyempre. Nag-textan kami. Wala pang cellphone noon. Sulat-sulat lang. Mga apatnapu't dalawang sulat yun, nakatago pa sa bauli. Noong 1972.
4. [21-22] Nag-propose siya sa harap ng jeepney. May hawak na isang dosenang rosas. Sabi ko, 'Oo, oo naman, ikaw pa?'

</details>
