# jeep: Litale experiment report

## Speech-to-text

WER (Word Error Rate) = errors ÷ words in the correct transcript. Lower is better. Accuracy = 100% − WER.

| Model | WER | Accuracy | Errors |
| --- | --- | --- | --- |
| whisper-large-v3-turbo | 25.2% | 74.8% | 30 out of 119 words (19 wrong · 2 missing · 9 extra) |
| whisper-large-v3 | 19.3% | 80.7% | 23 out of 119 words (15 wrong · 2 missing · 6 extra) |

### whisper-large-v3-turbo

**WER 25.2% · Accuracy 74.8%** · Errors: 30 out of 119 words (19 wrong · 2 missing · 9 extra)

**Wrong words**

| Model wrote | Correct | Times |
| --- | --- | --- |
| ❌ sis | ✅ si | 1 |
| ❌ ko | ✅ isko | 2 |
| ❌ umuwi | ✅ umuuwi | 1 |
| ❌ masakay | ✅ sumasakay | 1 |
| ❌ pamasahin | ✅ pamasahe | 1 |
| ❌ 50 | ✅ singkwenta | 1 |
| ❌ centimos | ✅ sentimos | 1 |
| ❌ yun | ✅ yon | 2 |
| ❌ half | ✅ halfday | 1 |
| ❌ ganon | ✅ ganun | 1 |
| ❌ ng | ✅ nang | 1 |
| ❌ nagpahard | ✅ nagpahardtoget | 1 |
| ❌ apatnapot | ✅ apatnaput | 1 |
| ❌ baulit | ✅ baul | 1 |
| ❌ 1972 | ✅ seventytwo | 1 |
| ❌ jeepney | ✅ jeep | 1 |
| ❌ dosaya | ✅ dosenang | 1 |

**Missing words** (model skipped): ➖ magkasakit, ➖ nineteen

**Extra words** (model added): ➕ mas, ➕ nga, ➕ day, ➕ is, ➕ magkasakit, ➕ to, ➕ get, ➕ ng, ➕ oo

<details><summary>Reference / Transcript</summary>

**Reference:** Yung lolo mo, si Isko, jeepney driver siya noon sa Calamba, Laguna. Ako naman, nag-aaral ng nursing sa Maynila. Every Friday, umuuwi ako, tapos sumasakay ako sa jeep niya. Pamasahe noon? Singkwenta sentimos lang, apo! Ay, teka. Hindi pala Friday. Thursday ‘yon, kasi half-day kami tuwing Biyernes. Basta, ganun. One day, umulan nang malakas. Nabasa ‘yung mga libro ko. Hinubad ni Isko ‘yung jacket niya, tapos sabi niya, “Miss, ito muna, baka ka magkasakit.” Kinilig talaga ako, pero nagpa-hard-to-get ako, siyempre! Nag-text-an kami? Wala pang cellphone noon! Sulat-sulat lang. Mga apatnapu’t dalawang sulat ‘yon, nakatago pa sa baul. Noong nineteen seventy-two, nag-propose siya sa harap ng jeep, may hawak na isang dosenang rosas. Sabi ko, “Oo naman, ikaw pa!”

**Transcript:** Yung lolo mo, sis ko, jeepney driver siya noon sa Calamba, Laguna. Ako naman, nag-aaral ng nursing sa Maynila. Every Friday, umuwi ako. Tapos, mas masakay ako sa jeep niya. Pamasahin noon, 50 centimos lang, apo. Ay, teka, hindi pala Friday, Thursday yun. Kasi nga, half day kami tuwing biyernes. Basta ganon. One day, umulan ng malakas. Nabasa yung mga libro ko. Hinubad ni is ko yung jacket niya. Tapos sabi niya, Miss, ito muna. Baka magkasakit ka. Kinilig talaga ako. Pero nagpa-hard to get ako. Siyempre, nag-textan kami. Wala pang cellphone noon. Sulat-sulat lang. Mga apatnapot dalawang sulat yun. Nakatago pa sa baulit. Noong 1972, nag-propose siya sa harap ng jeepney may hawak na isang dosaya ng rosas. Sabi ko, oo, oo naman, ikaw pa.

</details>

### whisper-large-v3

**WER 19.3% · Accuracy 80.7%** · Errors: 23 out of 119 words (15 wrong · 2 missing · 6 extra)

**Wrong words**

| Model wrote | Correct | Times |
| --- | --- | --- |
| ❌ masumasakay | ✅ sumasakay | 1 |
| ❌ pumasahin | ✅ pamasahe | 1 |
| ❌ 50 | ✅ singkwenta | 1 |
| ❌ centimos | ✅ sentimos | 1 |
| ❌ yun | ✅ yon | 2 |
| ❌ half | ✅ halfday | 1 |
| ❌ ganon | ✅ ganun | 1 |
| ❌ ng | ✅ nang | 1 |
| ❌ hinilig | ✅ kinilig | 1 |
| ❌ nagpahard | ✅ nagpahardtoget | 1 |
| ❌ apatnapot | ✅ apatnaput | 1 |
| ❌ bauli | ✅ baul | 1 |
| ❌ 1972 | ✅ seventytwo | 1 |
| ❌ jeepney | ✅ jeep | 1 |

**Missing words** (model skipped): ➖ magkasakit, ➖ nineteen

**Extra words** (model added): ➕ nga, ➕ day, ➕ magkasakit, ➕ to, ➕ get, ➕ oo

<details><summary>Reference / Transcript</summary>

**Reference:** Yung lolo mo, si Isko, jeepney driver siya noon sa Calamba, Laguna. Ako naman, nag-aaral ng nursing sa Maynila. Every Friday, umuuwi ako, tapos sumasakay ako sa jeep niya. Pamasahe noon? Singkwenta sentimos lang, apo! Ay, teka. Hindi pala Friday. Thursday ‘yon, kasi half-day kami tuwing Biyernes. Basta, ganun. One day, umulan nang malakas. Nabasa ‘yung mga libro ko. Hinubad ni Isko ‘yung jacket niya, tapos sabi niya, “Miss, ito muna, baka ka magkasakit.” Kinilig talaga ako, pero nagpa-hard-to-get ako, siyempre! Nag-text-an kami? Wala pang cellphone noon! Sulat-sulat lang. Mga apatnapu’t dalawang sulat ‘yon, nakatago pa sa baul. Noong nineteen seventy-two, nag-propose siya sa harap ng jeep, may hawak na isang dosenang rosas. Sabi ko, “Oo naman, ikaw pa!”

**Transcript:** Yung lolo mo si Isko, jeepney driver siya noon sa Calamba, Laguna. Ako naman nag-aaral ng nursing sa Maynila. Every Friday umuuwi ako tapos masumasakay ako sa jeep niya. Pumasahin noon 50 centimos lang apo. Ay teka, hindi pala Friday, Thursday yun. kasi nga half day kami tuwing biyernes. Basta ganon. One day, umulan ng malakas. Nabasa yung mga libro ko. Hinubad ni Isko yung jacket niya. Tapos sabi niya, Miss, ito muna. Baka magkasakit ka. Hinilig talaga ako. Pero nagpa-hard to get ako. Siyempre, nag-textan kami. Wala pang cellphone noon. Sulat-sulat lang. Mga apatnapot dalawang sulat yun Nakatago pa sa bauli Noong 1972 Nag-propose siya sa harap ng jeepney May hawak na isang dosenang rosas Sabi ko Oo Oo naman, ikaw pa

</details>

## Scene division

_No results yet._
