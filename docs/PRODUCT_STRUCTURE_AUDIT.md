# BTK Tennis produkta struktūras un dublēšanās audits

Datums: 2026-08-13

## Ieteiktā gala informācijas arhitektūra

### Sākums

- Personīgais īsais kopsavilkums un aktīvā turnīra progress.
- Viena aktuālākā darbība: rezultāts, kas jāievada; spēle, kas jāieplāno; vai nākamā ieplānotā spēle.
- Kluba jaunākās aktivitātes kā publiska notikumu plūsma.
- Pēdējo piecu spēļu forma kā īss kopsavilkums.
- Pilnas spēļu vēstures, tabulas un profila statistikas šeit nav.

### Spēles

- Lietotāja spēļu vienīgais pilnais source of truth.
- Filtri: Visas, Neizspēlētās, Ieplānotas, Izspēlētās.
- Pilns dzīves cikls: ieplānošana, pārplānošana, rezultāts un spēles detaļas.
- Turnīra kopējās spēles šeit netiek jauktas ar lietotāja personīgajām spēlēm.

### Turnīri

- Turnīru izvēle: Mans, Citi, Nākamie, Pabeigtie.
- Tabula ir oficiālā pozīciju un punktu source of truth.
- Statistika rāda visu spēlētāju detalizētos rādītājus un ļauj tos kārtot.
- Spēles rāda turnīra kopējo spēļu ainu ar abiem dalībniekiem.
- Tukšas vai vēl neizstrādātas cilnes netiek rādītas.

### Profils

- Spēlētāja identitāte un profila bilde.
- Personīgais aktīvā turnīra statistikas kopsavilkums.
- Papildu rādītāji: bilance, uzvaru procents, atlikušās spēles, setu/geimu starpība un forma.
- Pilna spēļu vēsture netiek dublēta.
- Profila rediģēšana un konta iestatījumi ir atsevišķa nākotnes funkcionalitāte.

### Paziņojumi

- Personīga iesūtne par lietotāja spēlēm, rezultātiem un turnīriem.
- Filtri: Visi un Nelasītie.
- Paziņojuma saite tiek noteikta serverī no saglabātā paziņojuma.
- Home kluba aktivitātes paliek publiska plūsma un netiek dublētas paziņojumos.

### Bottom navigation

- Pieci galvenie punkti paliek: Sākums, Spēles, Turnīri, Paziņojumi, Profils.
- Maršruti un aktīvie stāvokļi atbilst gala informācijas arhitektūrai.
- Nelasīto paziņojumu skaits izmanto NotificationService kā source of truth.

## Source of truth

| Datu veids | Source of truth | Kopsavilkumi citur |
| --- | --- | --- |
| Lietotāja spēles | Spēles | Sākumā tikai aktuālākā darbība; Profilā tikai statistika |
| Turnīra visas spēles | Turnīri → Spēles | Atsevišķa spēle atver kopīgo spēles detaļu skatu |
| Pozīcija un punkti | StandingEngine + Turnīru tabula | Sākums un Profils rāda īsu kopsavilkumu |
| Personīgā statistika | PlayerProfileViewService, balstīta StandingEngine datos | Sākumā tikai forma/progress |
| Kluba aktivitātes | ActivityEngine/ActivityService | Sākuma aktivitāšu plūsma |
| Personīgie paziņojumi | NotificationEngine/NotificationService | Bottom navigation rāda tikai nelasīto skaitu |
| Spēlētāja avatars | `players.avatar_url`, ar pagaidu projekta failu kartējumu | Visas UI sadaļas izmanto vienu avataru avotu |

## Prioritātes

### High

1. Pievienot centralizētu `requireAdmin` pārbaudi katrai admin server action. Proxy sargā lapas, bet nav pietiekams server action autorizācijas slānis. RLS paliek pēdējā aizsardzība.
2. Pabeigts: rezultāta validācija, setu aizvietošana, uzvarētāja noteikšana un spēles statusa maiņa apvienota vienā datubāzes transakcijā/RPC (`save_match_result`).
3. Dalībnieka pievienošanu un tai sekojošo spēļu ģenerēšanu apvienot atomiskā operācijā, lai kļūda neatstāj dalībnieku bez paredzētajām spēlēm.
4. Funkcionālajā revīzijā pārbaudīt visu spēles dzīves ciklu un tiesības ar dalībnieka, cita spēlētāja un administratora kontiem.

### Medium

1. Likvidēt otro, neizmantoto `calculateStandings` implementāciju un saglabāt `StandingEngine` kā vienīgo kopvērtējuma algoritmu.
2. Centralizēt atkārtoto lietotāja/profila/tiesību ielādi, kas šobrīd atkārtojas schedule, result, walkover un vairākās create-service funkcijās.
3. Centralizēt pēc mutācijām veicamo cache revalidāciju; vieni un tie paši maršruti atkārtojas vairākās server actions.
4. `TournamentViewService` nedrīkst klusi pārvērst jebkuru turnīra ielādes kļūdu par “turnīra nav”; jāatšķir sagaidāms tukšs stāvoklis no sistēmas kļūdas.
5. Optimizēt turnīru hub ielādi. Pašlaik katram turnīram atsevišķi tiek ielādēta grupa, dalībnieki un spēles.
6. Paziņojumiem un aktivitātēm ieviest lapošanu vai limitu pirms vēsturisko datu apjoms kļūst liels.
7. Avatara projekta failu kartējumu pēc Supabase autorizācijas pārcelt uz `players.avatar_url` kā vienīgo ilgtermiņa avotu.

### Low / polish

1. Izveidot vienotu avatara komponenti ar attēlu, iniciāļiem un izmēru variantiem; pašlaik avatari dublējas vairākās funkcijās.
2. Apvienot atkārtotos cilņu, filtru, sadaļu virsrakstu, statistikas trijnieku un tukšo stāvokļu UI variantus.
3. Vienādot `Card`, radiusu, ēnu, atstarpju un pogu variantus visā aplikācijā.
4. Dzēst vai arhivēt neizmantotās demo un vecās UI komponentes tikai pēc regresijas pārbaudes.
5. Pievienot pieejamības pārbaudi horizontāli ritināmajai statistikas tabulai un visām interaktīvajām cilnēm.

## Konstatētā dublēšanās

- `StandingEngine` un `src/lib/calculateStandings.ts` satur divus kopvērtējuma algoritmus.
- Spēles tiesību pārbaudes atkārtojas view service, server actions un palīgfunkcijās.
- Result, schedule un walkover actions atkārto autentifikāciju, profila ielādi un revalidācijas maršrutus.
- Avatari tiek renderēti ar vairākām lokālām komponentēm un inline implementācijām.
- Projektā palikušas neizmantotas demo/iepriekšējās Home un Match komponentes.
- Daļa repository klašu manto `BaseRepository`, daļa glabā Supabase klientu tieši; funkcionāli tas strādā, bet konvencija nav vienota.

## Rekomendētā turpmākā secība

1. Funkcionālā revīzija: autentifikācija, spēles plūsma, turnīri, paziņojumi un datu atjaunošanās.
2. High prioritātes atomiskuma un server action autorizācijas labojumi.
3. Tiesību, RLS, URL apiešanas un edge-case audits.
4. Kontekstuālo ieteikumu jeb Product Intelligence slānis.
5. UI komponentu konsolidācija un gala polish.
6. V1 gala tests un release checklist.

## Funkcionālās revīzijas papildinājums — 2026-08-13

### Kopvērtējums

- Publiskais turnīra skats, profils, spēļu pretinieku pozīcijas un administratora tabula izmanto vienu un to pašu `StandingEngine` un turnīra punktu noteikumus.
- Regulāra spēle un tehniskā uzvara abiem spēlētājiem pieskaita aizvadītu spēli; uzvarētājs un zaudētājs saņem turnīrā konfigurētos punktus.
- Tehniskā uzvara neizdomā setu vai geimu statistiku, savukārt mača taibreiks geimu statistikā tiek normalizēts kā `1:0`.
- Vienīgais strukturālais risks ir neizmantotā otrā implementācija `src/lib/calculateStandings.ts`. Tā pašlaik netiek izsaukta, bet jāizņem refaktora posmā, lai nākotnē nerastos divi atšķirīgi rezultāti.

### Paziņojumi un kluba aktivitātes

- Rezultāta ievade/labošana, spēles ieplānošana/pārplānošana un tehniskā uzvara tagad konsekventi rada personīgo paziņojumu un publisko kluba aktivitāti.
- Identiska rezultāta vai spēles laika atkārtota saglabāšana vairs nerada nepatiesu “labots” notikumu.
- Saistīta notikuma izveides kļūda neatceļ jau veiksmīgi saglabātu spēles rezultātu vai laiku; kļūda tiek reģistrēta atsevišķi.

### Atlikušais High drošības darbs

1. Sagatavota migrācija, kas `create_notification` saņēmēju ierobežo līdz konkrētās spēles dalībniekam, pārbauda izsaucēja saistību ar spēli un sasaista notikuma tipu ar spēles statusu.
2. Sagatavota tāda pati konteksta autorizācija `create_activity`; turnīru un sistēmas notikumus var veidot tikai administrators.
3. Sagatavota paziņojumu tiešo tiesību sašaurināšana līdz `is_read/read_at` un spēlētāja privileģēto lauku aizsardzība pret `is_admin` pašpiešķiršanu.
4. Migrācija `20260813223000_harden_notifications_and_activities.sql` vēl jāuzliek attālinātajai Supabase datubāzei un jāpārbauda ar dalībnieka/cita spēlētāja/admin kontiem.
5. Pabeigts: rezultāta setu aizvietošana un spēles statusa maiņa apvienota vienā datubāzes RPC/transakcijā. RPC atkārtoti validē tiesības, setu rezultātus, uzvarētāju un spēles statusu neatkarīgi no pārlūka validācijas.
6. Funkcionālajā pārbaudē atrasta un izlabota `match-tiebreak`/`match_tiebreak` nosaukumu neatbilstība. Datubāzes vērtība tagad tiek korekti atpazīta kopvērtējuma geimu statistikā un spēles detaļu skatā.
