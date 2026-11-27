# crush: Litale experiment report

## Speech-to-text

WER (Word Error Rate) = errors ÷ words in the correct transcript. Lower is better. Accuracy = 100% − WER.

| Model | WER | Accuracy | Errors |
| --- | --- | --- | --- |
| whisper-large-v3-turbo | 13.8% | 86.2% | 16 out of 116 words (9 wrong · 1 missing · 6 extra) |
| whisper-large-v3 | 11.2% | 88.8% | 13 out of 116 words (7 wrong · 0 missing · 6 extra) |

### whisper-large-v3-turbo

**WER 13.8% · Accuracy 86.2%** · Errors: 16 out of 116 words (9 wrong · 1 missing · 6 extra)

**Wrong words**

| Model wrote | Correct | Times |
| --- | --- | --- |
| ❌ sampagita | ✅ sampaguita | 4 |
| ❌ sarap | ✅ harap | 1 |
| ❌ arlo | ✅ akin | 1 |
| ❌ tinantahan | ✅ kinantahan | 1 |
| ❌ apple | ✅ apo | 1 |
| ❌ we | ✅ i | 1 |

**Missing words** (model skipped): ➖ sa

**Extra words** (model added): ➕ noon, ➕ and ×2, ➕ na, ➕ that, ➕ apple

<details><summary>Reference / Transcript</summary>

**Reference:** Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng sampaguita sa harap ng simbahan. Isang umaga, may binatang lumapit sa akin. His name was Ben. Bumili siya ng isang kwintas ng sampaguita. Tapos bumalik siya the next Sunday. At the next Sunday ulit. Sabi ko sa sarili ko, “Ang dami naman niyang sampaguita!” Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara. Kinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako, pero I was so happy. After two years, ikinasal kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampaguita. And that, apo, is how I fell in love.

**Transcript:** Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng Sampagita. Sarap ng simbahan. Isang umaga, may binatang lumapit sa arlo. His name was Ben. Bumili siya ng isang kwintas ng Sampagita. Tapos bumalik siya the next Sunday. At the next Sunday ulit, sabi ko sa sarili ko, Ang dami naman niyang sampagita. Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara. Tinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako noon pero I was so happy. And after two years, ikinasal na kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampagita. and that apple and that apple is how we fell in love

</details>

### whisper-large-v3

**WER 11.2% · Accuracy 88.8%** · Errors: 13 out of 116 words (7 wrong · 0 missing · 6 extra)

**Wrong words**

| Model wrote | Correct | Times |
| --- | --- | --- |
| ❌ sampagita | ✅ sampaguita | 4 |
| ❌ arap | ✅ harap | 1 |
| ❌ tinantahan | ✅ kinantahan | 1 |
| ❌ we | ✅ i | 1 |

**Missing words** (model skipped): none

**Extra words** (model added): ➕ noon, ➕ and ×2, ➕ na, ➕ that, ➕ apo

<details><summary>Reference / Transcript</summary>

**Reference:** Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng sampaguita sa harap ng simbahan. Isang umaga, may binatang lumapit sa akin. His name was Ben. Bumili siya ng isang kwintas ng sampaguita. Tapos bumalik siya the next Sunday. At the next Sunday ulit. Sabi ko sa sarili ko, “Ang dami naman niyang sampaguita!” Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara. Kinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako, pero I was so happy. After two years, ikinasal kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampaguita. And that, apo, is how I fell in love.

**Transcript:** Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng sampagita sa arap ng simbahan. Isang umaga, may binatang lumapit sa akin. His name was Ben. Bumili siya ng isang kwintas ng sampagita. Tapos bumalik siya the next Sunday. At the next Sunday ulit, sabi ko sa sarili ko, Ang dami naman niyang sampagita Isang gabi, dumating si Ben sa bahay namin May dala siyang gitara Tinantahan niya ako ng harana sa ilalim ng bintana Nahiya ako noon pero I was so happy And after two years, ikinasal na kami sa parehong simbahan Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampagita And that, apo. And that, apo, is how we fell in love.

</details>

## Scene division

| Model | Checks passed | Notes |
| --- | --- | --- |
| openai/gpt-oss-120b | 4/4 | run 1, prompt v1, from crush.reference |
| openai/gpt-oss-120b | 4/4 | run 1, prompt v2, from crush.reference |
| openai/gpt-oss-20b | 4/4 | run 1, prompt v1, from crush.reference |
| openai/gpt-oss-20b | 4/4 | run 1, prompt v2, from crush.reference |
| openai/gpt-oss-120b | 4/4 | run 1, prompt v1, from crush.whisper-large-v3-turbo |
| openai/gpt-oss-120b | 4/4 | run 1, prompt v2, from crush.whisper-large-v3-turbo |
| openai/gpt-oss-20b | 4/4 | run 1, prompt v1, from crush.whisper-large-v3-turbo |
| openai/gpt-oss-120b | 4/4 | run 1, prompt v1, from crush.whisper-large-v3 |
| openai/gpt-oss-120b | 4/4 | run 1, prompt v2, from crush.whisper-large-v3 |
| openai/gpt-oss-20b | 1/4 | run 1, prompt v1, from crush.whisper-large-v3, FAIL: exactly 4 scenes, FAIL: positions 1-4 in order, FAIL: every sentence used exactly once |
| openai/gpt-oss-20b | 4/4 | run 1, prompt v2, from crush.whisper-large-v3 |
