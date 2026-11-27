# crush: scene division comparison

- Correct breaks: after reference words 19, 58, 86 (the 4 paragraphs of references/crush.txt).
- Key terms: references/crush.terms.txt (7 terms, 2 misheard words).
- Words changed = how much the scene text differs from the sentences it came from (replaced, dropped or added words). Lower = closer to the recording.
- Break offset 0 = the scene starts at the same word as in the reference. "reference" rows show the scene model on a perfect transcript (the upper bound).

| Source transcript | Scene model | Prompt | Checks passed | Exact breaks | Avg break offset (words) | Same split every run | Words changed | Key terms found | Misheard words leaked | Avg ms |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| crush.reference | openai/gpt-oss-120b | v1 | 1/1 | 1/3 | 6.3 | - | 29.3% | 100% | none | 3369 |
| crush.reference | openai/gpt-oss-120b | v2 | 5/5 | 15/15 | 0.0 | yes | 35.0% | 97% | none | 10216 |
| crush.reference | openai/gpt-oss-120b | v3 | 5/5 | 13/15 | 2.8 | no | 0.3% | 100% | none | 17762 |
| crush.reference | openai/gpt-oss-20b | v1 | 1/1 | 2/3 | 2.3 | - | 27.6% | 100% | none | 2309 |
| crush.reference | openai/gpt-oss-20b | v2 | 1/1 | 2/3 | 7.0 | - | 24.1% | 100% | none | 2177 |
| crush.whisper-large-v3-turbo | openai/gpt-oss-120b | v1 | 1/1 | 2/3 | 2.7 | - | 41.3% | 86% | arlo, apple | 4019 |
| crush.whisper-large-v3-turbo | openai/gpt-oss-120b | v2 | 5/5 | 15/15 | 0.0 | yes | 21.0% | 86% | apple | 16574 |
| crush.whisper-large-v3-turbo | openai/gpt-oss-120b | v3 | 5/5 | 15/15 | 0.0 | yes | 3.8% | 86% | arlo, apple | 17544 |
| crush.whisper-large-v3-turbo | openai/gpt-oss-20b | v1 | 1/1 | 2/3 | 2.7 | - | 2.5% | 86% | arlo, apple | 2227 |
| crush.whisper-large-v3 | openai/gpt-oss-120b | v1 | 1/1 | 2/3 | 3.7 | - | 57.4% | 71% | none | 3626 |
| crush.whisper-large-v3 | openai/gpt-oss-120b | v2 | 5/5 | 15/15 | 0.0 | yes | 28.7% | 83% | none | 15522 |
| crush.whisper-large-v3 | openai/gpt-oss-120b | v3 | 5/5 | 10/15 | 7.9 | no | 1.8% | 86% | none | 20672 |
| crush.whisper-large-v3 | openai/gpt-oss-120b | v4 | 3/3 | 7/9 | 2.6 | no | 0.8% | 86% | none | 6400 |
| crush.whisper-large-v3 | openai/gpt-oss-20b | v1 | 0/1 | - | - | - | - | - | - | 2652 |
| crush.whisper-large-v3 | openai/gpt-oss-20b | v2 | 1/1 | 2/3 | 2.3 | - | 21.3% | 86% | none | 4337 |

## Details

- **crush.reference · openai/gpt-oss-120b · v1** new words (not said in those sentences): tuwing, linggo, at, sinabi, pa, noong, susunod, sabi, dalang, nahiyah, sobrang, saya, pagkatapos, ng, dalawang, taon, na, anibersaryo, iyan, kung, paano, ako, nagmahal
- crush.reference · openai/gpt-oss-120b · v1 run 1: breaks off by 11, 0, 8 words
- **crush.reference · openai/gpt-oss-120b · v2** new words (not said in those sentences): tuwing, linggo, si, at, napansin, na, marami, siyang, dalang, dinala, ni, ang, kanyang, kinanta, sobrang, saya, ko, pagkatapos, dalawang, taon, anibersaryo, iyon, simula, ng, aming, pagibig, nagdala, pa, kaya, nasabi, susunod, muli, napaisip, ako, sa, sinabi, lagi, niyang, dala, maraming, iyan, kwento, kung, paano, nagmahal, masaya
- **crush.reference · openai/gpt-oss-120b · v2** missed: harana | serenade
- crush.reference · openai/gpt-oss-120b · v3 run 1: breaks off by 0, -21, 0 words
- crush.reference · openai/gpt-oss-120b · v3 run 2: breaks off by 0, -21, 0 words
- **crush.reference · openai/gpt-oss-20b · v1** new words (not said in those sentences): and, he, bought, a, necklace, kept, coming, back, every, i, thought, with, sang, under, the, window
- crush.reference · openai/gpt-oss-20b · v1 run 1: breaks off by 7, 0, 0 words
- **crush.reference · openai/gpt-oss-20b · v2** new words (not said in those sentences): tuwing, linggo, pangalan, niya, ay, ang, susunod, na, ulit, sa, nagpasaya, akin, at
- crush.reference · openai/gpt-oss-20b · v2 run 1: breaks off by 0, -21, 0 words
- **crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v1** new words (not said in those sentences): tuwing, linggo, ako, sa, mahilig, tinawag, ko, siyang, kinabukasan, ng, napansin, na, marami, dalang, at, ang, nahiyahi, masaya, pagkaraan, dalawang, taon, anibersaryo, paalala, kung, paano, kami, nagmahal
- **crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v1** missed: sampaguita
- crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v1 run 1: breaks off by 0, 0, 8 words
- **crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v2** new words (not said in those sentences): at, na, nagpakilala, bilang, nagdala, pa, ng, marami, dalang, ang, pangalan, niya, ay, may, pang, masaya, ako, tuwing, iyon, naging, simula, aming, pagibig, linggo, noong, susunod, sa, anibersaryo, dahilan, kung, bakit, kami, nagmahal
- **crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v2** missed: sampaguita
- **crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v3** new words (not said in those sentences): ang
- **crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v3** missed: sampaguita
- **crush.whisper-large-v3-turbo · openai/gpt-oss-20b · v1** new words (not said in those sentences): at
- **crush.whisper-large-v3-turbo · openai/gpt-oss-20b · v1** missed: sampaguita
- crush.whisper-large-v3-turbo · openai/gpt-oss-20b · v1 run 1: breaks off by 0, 0, 8 words
- **crush.whisper-large-v3 · openai/gpt-oss-120b · v1** new words (not said in those sentences): tuwing, linggo, si, na, sa, susunod, naisip, ng, kanyang, ben, gawa, dinala, ni, gitara, at, humarap, aming, bahay, hinarap, nahihiya, masaya, ako, ang, man, pagkatapos, dalawang, taon, anibersaryo, iyan, kwento, kung, paano, kami, nagmahal
- **crush.whisper-large-v3 · openai/gpt-oss-120b · v1** missed: sampaguita, harana | serenade
- crush.whisper-large-v3 · openai/gpt-oss-120b · v1 run 1: breaks off by 11, 0, 0 words
- **crush.whisper-large-v3 · openai/gpt-oss-120b · v2** new words (not said in those sentences): harap, si, at, noong, susunod, na, linggo, napansin, kung, gaano, karami, kanyang, dalang, ang, masaya, ako, pagkatapos, ng, dalawang, taon, tuwing, anibersaryo, iyan, kwento, paano, kami, nagmahal, nagdala, pa, marami, pang, sampagita, sinabi, sa, hinarana, nahihiya, sobrang, saya, ko, aming, pagibig, apo, and, he, bought, a, necklace, came, back, with, many, more, daladulang
- **crush.whisper-large-v3 · openai/gpt-oss-120b · v2** missed: sampaguita, harana | serenade
- **crush.whisper-large-v3 · openai/gpt-oss-120b · v3** new words (not said in those sentences): harap, susunod, na, linggo, sa
- **crush.whisper-large-v3 · openai/gpt-oss-120b · v3** missed: sampaguita
- crush.whisper-large-v3 · openai/gpt-oss-120b · v3 run 1: breaks off by 0, -21, -28 words
- crush.whisper-large-v3 · openai/gpt-oss-120b · v3 run 2: breaks off by 0, -21, -28 words
- crush.whisper-large-v3 · openai/gpt-oss-120b · v3 run 3: breaks off by 0, -21, 0 words
- **crush.whisper-large-v3 · openai/gpt-oss-120b · v4** new words (not said in those sentences): harap
- **crush.whisper-large-v3 · openai/gpt-oss-120b · v4** missed: sampaguita
- crush.whisper-large-v3 · openai/gpt-oss-120b · v4 run 1: breaks off by 0, 0, 8 words
- crush.whisper-large-v3 · openai/gpt-oss-120b · v4 run 3: breaks off by 0, -15, 0 words
- **crush.whisper-large-v3 · openai/gpt-oss-20b · v2** missed: sampaguita
- crush.whisper-large-v3 · openai/gpt-oss-20b · v2 run 1: breaks off by 7, 0, 0 words

## Scene text (read these: numbers do not catch changed meaning)

<details><summary>crush.reference · openai/gpt-oss-120b · v1 (run 1)</summary>

1. [1-4] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Tuwing Linggo, nagtitinda ako ng sampaguita sa harap ng simbahan. Isang umaga, may binatang lumapit at sinabi, “His name was Ben.”
2. [5-8] Bumili siya ng kwintas ng sampaguita. Bumalik siya the next Sunday, at ulit pa noong susunod. Sabi ko, “Ang dami naman niyang sampaguita!”
3. [9-13] Isang gabi, dumating si Ben sa bahay namin na may dalang gitara. Kinantahan niya ako ng harana sa ilalim ng bintana; nahiyah ako pero sobrang saya. Pagkatapos ng dalawang taon, ikinasal kami sa parehong simbahan.
4. [14-15] Hanggang ngayon, tuwing anibersaryo, binibigyan pa rin ako ni Lolo Ben ng sampaguita. At iyan, apo, kung paano ako nagmahal.

</details>

<details><summary>crush.reference · openai/gpt-oss-120b · v2 (run 1)</summary>

1. [1-2] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Tuwing Linggo, nagtitinda ako ng sampaguita sa harap ng simbahan.
2. [3-8] Isang umaga, lumapit sa akin si Ben. Bumili siya ng kwintas ng sampaguita at bumalik tuwing Linggo. Napansin ko na marami siyang dalang sampaguita.
3. [9-12] Isang gabi, dinala ni Ben ang kanyang gitara at kinanta ako sa ilalim ng bintana. Nahiya ako pero sobrang saya ko.
4. [13-15] Pagkatapos ng dalawang taon, ikinasal kami sa parehong simbahan. Tuwing anibersaryo, binibigyan pa rin ako ni Lolo Ben ng sampaguita. At iyon ang simula ng aming pag-ibig.

</details>

<details><summary>crush.reference · openai/gpt-oss-120b · v3 (run 1)</summary>

1. [1-2] Noong bata pa ako, nakatira kami sa Lipa, Batangas.
Every Sunday, nagtitinda ako ng sampaguita sa harap ng simbahan.
2. [3-5] Isang umaga, may binatang lumapit sa akin.
His name was Ben.
Bumili siya ng isang kwintas ng sampaguita.
3. [6-12] Tapos bumalik siya the next Sunday.
At the next Sunday ulit.
Sabi ko sa sarili ko, “Ang dami naman niyang sampaguita!”
Isang gabi, dumating si Ben sa bahay namin.
May dala siyang gitara.
Kinantahan niya ako ng harana sa ilalim ng bintana.
Nahiya ako, pero I was so happy.
4. [13-15] After two years, ikinasal kami sa parehong simbahan.
Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampaguita.
And that, apo, is how I fell in love.

</details>

<details><summary>crush.reference · openai/gpt-oss-20b · v1 (run 1)</summary>

1. [1-3] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng sampaguita sa harap ng simbahan. Isang umaga, may binatang lumapit sa akin.
2. [4-8] His name was Ben, and he bought a sampaguita necklace. He kept coming back every Sunday, and I thought, “Ang dami naman niyang sampaguita!”
3. [9-12] Isang gabi, dumating si Ben sa bahay namin with a gitara, and he sang a harana under the window. Nahiya ako, pero I was so happy.
4. [13-15] After two years, ikinasal kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampaguita. And that, apo, is how I fell in love.

</details>

<details><summary>crush.reference · openai/gpt-oss-20b · v2 (run 1)</summary>

1. [1-2] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Tuwing Linggo, nagtitinda ako ng sampaguita sa harap ng simbahan.
2. [3-5] Isang umaga, may binatang lumapit sa akin. Ang pangalan niya ay Ben. Bumili siya ng kwintas ng sampaguita.
3. [6-12] Bumalik siya sa susunod na Linggo at ulit sa susunod. Sabi ko sa sarili ko, “Ang dami naman niyang sampaguita!” Isang gabi, dumating si Ben sa bahay namin na may gitara at kinantahan ako ng harana sa ilalim ng bintana, na nagpasaya sa akin.
4. [13-15] After two years, ikinasal kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampaguita. And that, apo, is how I fell in love.

</details>

<details><summary>crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v1 (run 1)</summary>

1. [1-3] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Tuwing Linggo, nagtitinda ako ng Sampagita. Mahilig ako sa simbahan.
2. [4-8] Isang umaga, may binatang lumapit sa arlo. Tinawag ko siyang Ben at bumili siya ng kwintas ng Sampagita. Bumalik siya kinabukasan ng Linggo at napansin ko na marami siyang dalang sampagita.
3. [9-13] Isang gabi, dumating si Ben sa bahay namin dala ang gitara. Tinantahan niya ako ng harana sa ilalim ng bintana; nahiyahi ako pero masaya. Pagkaraan ng dalawang taon, ikinasal na kami sa parehong simbahan.
4. [14-15] Hanggang ngayon, tuwing anibersaryo, binibigyan pa rin ako ni Lolo Ben ng sampagita. At "that apple" ang paalala kung paano kami nagmahal.

</details>

<details><summary>crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v2 (run 1)</summary>

1. [1-3] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng Sampagita. Sarap ng simbahan.
2. [4-8] Isang umaga, may binatang lumapit. His name was Ben. Bumili siya ng isang kwintas ng Sampagita. Tapos bumalik siya the next Sunday. At the next Sunday ulit, sabi ko sa sarili ko, Ang dami naman niyang sampagita.
3. [9-12] Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara. Tinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako noon pero I was so happy.
4. [13-15] And after two years, ikinasal na kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampagita. And that is how we fell in love.

</details>

<details><summary>crush.whisper-large-v3-turbo · openai/gpt-oss-120b · v3 (run 1)</summary>

1. [1-3] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng Sampagita. Sarap ng simbahan.
2. [4-8] Isang umaga, may binatang lumapit sa arlo. His name was Ben. Bumili siya ng isang kwintas ng Sampagita. Tapos bumalik siya next Sunday. At ang next Sunday ulit, sabi ko sa sarili ko, 'Ang dami naman niyang sampagita.'
3. [9-12] Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara. Tinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako pero I was so happy.
4. [13-15] And after two years, ikinasal na kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampagita. And that apple is how we fell in love.

</details>

<details><summary>crush.whisper-large-v3-turbo · openai/gpt-oss-20b · v1 (run 1)</summary>

1. [1-3] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng Sampagita. Sarap ng simbahan.
2. [4-8] Isang umaga, may binatang lumapit sa arlo. His name was Ben, bumili siya ng isang kwintas ng Sampagita at bumalik siya the next Sunday. At the next Sunday ulit, sabi ko sa sarili ko, Ang dami naman niyang sampagita.
3. [9-13] Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara at tinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako noon pero I was so happy, at after two years, ikinasal na kami sa parehong simbahan.
4. [14-15] Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampagita. And that apple and that apple is how we fell in love.

</details>

<details><summary>crush.whisper-large-v3 · openai/gpt-oss-120b · v1 (run 1)</summary>

1. [1-4] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Tuwing Linggo, nagtitinda ako ng sampagita sa arap ng simbahan. Isang umaga, lumapit sa akin si Ben.
2. [5-8] Bumili si Ben ng kwintas na gawa sa sampagita. Bumalik siya sa susunod na Linggo. Naisip ko, ang dami ng kanyang sampagita.
3. [9-12] Isang gabi, dinala ni Ben ang kanyang gitara at humarap sa aming bahay. Hinarap niya ako sa ilalim ng bintana. Nahihiya man ako, masaya ako.
4. [13-16] Pagkatapos ng dalawang taon, ikinasal kami sa parehong simbahan. Tuwing anibersaryo, binibigyan pa rin ako ni Lolo Ben ng sampagita. Iyan ang kwento kung paano kami nagmahal.

</details>

<details><summary>crush.whisper-large-v3 · openai/gpt-oss-120b · v2 (run 1)</summary>

1. [1-2] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng sampagita sa harap ng simbahan.
2. [3-8] Isang umaga, lumapit sa akin si Ben. Bumili siya ng kwintas ng sampagita at bumalik siya noong susunod na Linggo. Napansin ko kung gaano karami ang kanyang dalang sampagita.
3. [9-12] Isang gabi, dumating si Ben sa bahay namin dala ang gitara. Tinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako pero masaya ako.
4. [13-16] Pagkatapos ng dalawang taon, ikinasal kami sa parehong simbahan. Tuwing anibersaryo, binibigyan pa rin ako ni Lolo Ben ng sampagita. At iyan ang kwento kung paano kami nagmahal.

</details>

<details><summary>crush.whisper-large-v3 · openai/gpt-oss-120b · v3 (run 1)</summary>

1. [1-2] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng sampagita sa harap ng simbahan.
2. [3-5] Isang umaga, may binatang lumapit sa akin. His name was Ben. Bumili siya ng isang kwintas ng sampagita.
3. [6-8] Tapos bumalik siya the next Sunday. At the next Sunday ulit, sabi ko sa sarili ko, Ang dami naman niyang sampagita.
4. [9-16] Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara. Tinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako noon pero I was so happy. And after two years, ikinasal na kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampagita. And that, apo. And that, apo, is how we fell in love.

</details>

<details><summary>crush.whisper-large-v3 · openai/gpt-oss-120b · v4 (run 1)</summary>

1. [1-2] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng sampagita sa harap ng simbahan.
2. [3-8] Isang umaga, may binatang lumapit sa akin. His name was Ben. Bumili siya ng isang kwintas ng sampagita. Tapos bumalik siya the next Sunday. At the next Sunday ulit, sabi ko sa sarili ko, Ang dami naman niyang sampagita.
3. [9-13] Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara. Tinantahan niya ako ng harana sa ilalim ng bintana. Nahiya ako noon pero I was so happy. And after two years, ikinasal na kami sa parehong simbahan.
4. [14-16] Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampagita. And that, apo. And that, apo, is how we fell in love.

</details>

<details><summary>crush.whisper-large-v3 · openai/gpt-oss-20b · v2 (run 1)</summary>

1. [1-3] Noong bata pa ako, nakatira kami sa Lipa, Batangas. Every Sunday, nagtitinda ako ng sampagita sa arap ng simbahan. Isang umaga, may binatang lumapit sa akin.
2. [4-8] His name was Ben. Bumili siya ng isang kwintas ng sampagita. Tapos bumalik siya the next Sunday.
3. [9-12] Isang gabi, dumating si Ben sa bahay namin. May dala siyang gitara. Tinantahan niya ako ng harana sa ilalim ng bintana.
4. [13-16] And after two years, ikinasal na kami sa parehong simbahan. Hanggang ngayon, every anniversary, binibigyan pa rin ako ni Lolo Ben ng sampagita. And that, apo, is how we fell in love.

</details>
