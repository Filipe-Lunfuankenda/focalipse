import { useLanguage } from '@/i18n/LanguageContext';
import { SectionWrapper } from './SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Search, RotateCcw, CheckCircle2, XCircle, AlertTriangle, Sparkles } from 'lucide-react';

export interface AnalysisResult {
  verdict: 'is' | 'almost' | 'not';
  confidence: 'high' | 'medium' | 'low';
  hasMacro: boolean;
  hasMicro: boolean;
  hasConnector: boolean;
  hasAbruptTransition: boolean;
  hasScaleContrast: boolean;
  detectedType: string | null;
  missingTips: string[];
  score: number;
}

// ─── EXPANDED CANONICAL TRAINING EXAMPLES ───
// Used to calibrate scoring thresholds and validate detection accuracy
const CANONICAL_EXAMPLES = [
  // === SIMPLE (Macro → Micro) ===
  'As sirenes gritavam, as luzes piscavam, e o sistema ruía numa cascata de falhas críticas, enquanto uma única gota de óleo deslizava lentamente pela borda do console.',
  'The alarms screamed, lights flickered, and the system collapsed in a cascade of critical failures, while a single drop of oil slid slowly along the edge of the console.',
  'A explosão rasgou o edifício num clarão ensurdecedor que fez o chão vibrar como um organismo vivo, enquanto uma fenda fina se abria no vidro da janela, estalando em silêncio.',
  'O trovão rebentou no céu com uma violência que fez tremer as paredes, enquanto uma gota de suor lhe caía do queixo para o chão.',
  'Os prédios desabavam sob o fogo da artilharia, a terra tremia com o som ensurdecedor dos motores, e, no asfalto, uma formiga tentava contornar a ponta do seu sapato.',
  'Buildings crumbled under artillery fire, the earth trembled with the deafening roar of engines, and on the asphalt, an ant tried to go around the tip of his shoe.',
  'El edificio se derrumbó en llamas, los gritos resonaban por la calle y el suelo temblaba bajo sus pies, y la manecilla del reloj seguía avanzando sin prisa.',
  'L\'explosion a déchiré le bâtiment dans un éclair assourdissant, tandis qu\'une fissure fine s\'ouvrait dans la vitre de la fenêtre.',
  'Die Explosion zerriss das Gebäude in einem ohrenbetäubenden Blitz, während ein dünner Riss sich im Fensterglas öffnete.',
  'L\'esplosione squarciò l\'edificio in un lampo assordante, mentre una sottile crepa si apriva nel vetro della finestra.',
  // === INVERTED (Micro → Macro) ===
  'A chama tremulava suavemente na ponta do fósforo, e o edifício inteiro explodiu num rugido de fogo e escombros.',
  'The flame flickered softly at the tip of the match, and the entire building exploded in a roar of fire and debris.',
  'La llama temblaba suavemente en la punta del fósforo, y el edificio entero explotó en un rugido de fuego y escombros.',
  'A gota de orvalho tremia na folha quando o trovão rebentou e a tempestade engoliu a floresta inteira.',
  // === SUSPENDED (Macro → Implicit Micro) ===
  'Os gritos ecoaram pela casa enquanto a porta começava a abrir-se lentamente…',
  'The screams echoed through the house while the door slowly began to open…',
  'Los gritos resonaron por la casa mientras la puerta comenzaba a abrirse lentamente…',
  // === COMPOUND (Macro → Micro → Micro) ===
  'A explosão rasgou o edifício num clarão ensurdecedor, enquanto uma fenda fina se abria no vidro da janela, estalando em silêncio, e um fragmento minúsculo se desprendia e girava lentamente no ar.',
  'The explosion tore through the building in a deafening flash, while a thin crack opened in the window glass, snapping in silence, and a tiny fragment broke free and spun slowly through the air.',
  // === CHAIN (Macro → Micro → New Macro → New Micro) ===
  'O trovão rebentou no céu, enquanto uma gota de suor lhe caía do queixo para o chão, e o candeeiro explodiu num estalo seco, mergulhando a sala na escuridão onde apenas o brilho do seu telemóvel iluminava o pó suspenso no ar.',
  // === RECURSIVE (Macro → Micro → internal contrast) ===
  'O mundo desabou num estrondo de destruição total, enquanto uma lágrima lhe escorria pelo rosto, refletindo na sua superfície a imagem distante de uma cidade em chamas.',
  'The world collapsed in a roar of total destruction, while a tear slid down his face, reflecting on its surface the distant image of a city in flames.',
  // === PARALLEL ((Macro → Micro) × 2) ===
  'A multidão corria em pânico pelas ruas em chamas, enquanto uma criança deixava cair o seu brinquedo no chão, e noutra cidade as sirenes ecoavam na noite silenciosa enquanto uma chávena de café arrefecia intocada sobre a mesa.',
  // === PROGRESSIVE (Macro → Micro → even smaller micro) ===
  'O impacto do embate ecoou pela estrada numa explosão de metal e vidro, enquanto uma gota de sangue lhe escorria pelo dedo, formando uma linha fina que tremia ligeiramente antes de se dividir numa bolha quase invisível.',
  // Additional diverse language examples
  'Het gebouw stortte in vlammen in, kreten echoden door de straat, terwijl de wijzer van de klok rustig doortikte.',
  'Здание рухнуло в огне, крики разносились по улице, а стрелка часов продолжала спокойно двигаться.',
  '建物は炎に包まれて崩壊し、叫び声が通りに響き渡る中、時計の針は静かに進み続けていた。',
  '건물이 화염 속에 무너지고 비명이 거리에 울려 퍼지는 동안, 시계 바늘은 조용히 움직이고 있었다.',
  'انهار المبنى في النيران وتردد صدى الصراخ في الشارع، بينما واصل عقرب الساعة التقدم بهدوء.',
  // Drama examples
  'Gritavam um contra o outro no meio da sala, atirando jarras contra a parede, destruindo dez anos de casamento com frases carregadas de ódio e lágrimas cruas, enquanto o gelo estalava silenciosamente dentro do copo de whisky.',
  'She said she would never come back, slammed the door shut and took with her everything he was, while the coffee cooled untouched on the table.',
  // Technology/catastrophe
  'O alarme gritava sem parar, luzes vermelhas a piscar freneticamente enquanto o sistema falhava um a um, cabos explodiam em faíscas, e uma gota de suor deslizava lentamente pela ponta do nariz antes de cair sobre o botão que podia salvar tudo.',
  'O comboio descarrilou numa tempestade de metal retorcido, gritos rasgavam o ar enquanto as carruagens se esmagavam, e o telemóvel no chão vibrava com uma chamada que ninguém iria atender.',
  // Detective
  'O detective explodiu, atirando relatórios contra a placa de metal numa fúria cega que ecoou pela sala de interrogatórios, e o velho néon continuava a piscar no corredor com um zumbido eléctrico monótono.',
];

// ─── EXPANDED STRUCTURAL PATTERN MARKERS ───

const MACRO_PATTERNS = [
  // Destruction / violence / chaos
  /\b(explos|explod|detona|rebent|arrebent|desab|colaps|collaps|crash|shatter|destroi|destru|arruin|demol|arras|esmag|aniquil|implod|erupt|ravag|devast)\w*/gi,
  /\b(fogo|chamas|incêndio|fire|flame|blaze|inferno|fuoco|llamas|flammes|Feuer|огонь|огне|火|불|brand)\b/gi,
  /\b(grit|scream|shout|roar|howl|rugiu|berr|bram|cri|hurlement|Schrei|крик|叫|비명|schreeuw)\w*/gi,
  /\b(trov|thunder|tonnerre|Donner|гром|雷|천둥|donder)\w*/gi,
  /\b(terremoto|terramoto|earthquake|séisme|Erdbeben|землетрясен|地震|지진|aardbeving)\w*/gi,
  /\b(tsunami|avalanch|hurric|tornado|furac|tufão|ciclone|tempest|storm|tormenta|orkaan)\w*/gi,
  /\b(guerra|war|battle|batalha|combat|luta|pelej|bataille|Krieg|война|戦争|전쟁|oorlog)\w*/gi,
  /\b(bomb|tiro|shot|disparo|bala|projéctil|artilh|munição|missile|morteiro|mortar|granadas|grenade)\w*/gi,
  /\b(inunda|flood|dilúvio|enchente|avalanche|maremoto|overstroming)\w*/gi,
  /\b(pânico|panic|panik|pánico|panico|terror|horror|medo|fear|Angst|страх|恐怖|공포|paniek)\w*/gi,
  /\b(caos|chaos|kaos|хаос|混乱|혼돈)\w*/gi,
  /\b(violên|violen|gewalt|насили|暴力|폭력)\w*/gi,
  /\b(sirene|alarm|siren|alerte|Alarm|тревог|警报|경보)\w*/gi,
  /\b(estrond|estrépito|fragor|barulh|noise|bruit|Lärm|шум|噪音|소음|lawaai|herrie)\w*/gi,
  /\b(descarril|derail|dérail|entgleis|сошёл с рельсов|脱線|탈선)\w*/gi,
  /\b(colidiam|collid|collision|Kollision|столкнов|衝突|충돌|botsing)\w*/gi,
  // Sensory intensity
  /\b(ensurdec|deaf|assourd|betäub|оглуш|震耳|oorverdov)\w*/gi,
  /\b(cegou|blinding|aveug|blend|ослеп|刺眼)\w*/gi,
  /\b(fúria|fury|rage|raiva|ira|wut|ярост|愤怒|분노|woede)\w*/gi,
  // Scale indicators
  /\b(tudo|everything|tout|alles|всё|一切|모든|alles)\b/gi,
  /\b(mundo|world|monde|Welt|мир|世界|세계|wereld)\b/gi,
  /\b(inteiro|entire|whole|entier|ganz|весь|整个|전체|heel|geheel)\b/gi,
  /\b(multidão|crowd|foule|Menge|толпа|人群|군중|menigte)\b/gi,
  /\b(corriam|ran|couraient|rannten|бежали|跑|달렸다|renden)\w*/gi,
  /\b(trembl|tremeu|shook|shak|secoué|bebte|zitterte|дрожал|震|떨)\w*/gi,
  /\b(ruin|ruía|desabou|fell|collapsed|s'effondra|stürzte|рухнул|崩|무너)\w*/gi,
  // Verbs of impact
  /\b(rasgou|tore|ripped|déchir|zerriss|разорвал|撕|찢)\w*/gi,
  /\b(esmag|crush|écras|zermalm|раздавил|粉碎|으깬)\w*/gi,
  /\b(engol|swallow|englout|verschlang|поглотил|吞|삼킨)\w*/gi,
  /\b(atir|threw|lançou|jeté|warf|бросил|扔|던진)\w*/gi,
];

const MICRO_PATTERNS = [
  // Small objects
  /\b(gota|drop|goutte|Tropfen|капл|滴|방울|druppel)\w*/gi,
  /\b(poeira|pó|dust|poussière|Staub|пыль|灰尘|먼지|stof)\w*/gi,
  /\b(folha|leaf|feuille|Blatt|лист|叶|잎|blad)\w*/gi,
  /\b(formiga|ant|fourmi|Ameise|муравей|蚂蚁|개미|mier)\w*/gi,
  /\b(grão|grain|graine|Korn|зерн|粒|알갱이|korrel)\w*/gi,
  /\b(fio|thread|fil|Faden|нить|丝|실|draad)\w*/gi,
  /\b(pétala|petal|pétale|Blütenblatt|лепесток|花瓣|꽃잎|bloemblad)\w*/gi,
  /\b(botão|button|bouton|Knopf|пуговиц|按钮|버튼|knoop)\w*/gi,
  /\b(agulha|needle|aiguille|Nadel|игл|针|바늘|naald)\w*/gi,
  /\b(insecto|insect|insecte|Insekt|насеком|昆虫|곤충|insect)\w*/gi,
  /\b(aranha|spider|araignée|Spinne|паук|蜘蛛|거미|spin)\w*/gi,
  /\b(teia|cobweb|toile|Spinnennetz|паутин|蛛网|거미줄|spinnenweb)\w*/gi,
  /\b(lágrima|tear|larme|Träne|слез|泪|눈물|traan)\w*/gi,
  /\b(chávena|xícara|cup|tasse|Tasse|чашк|杯|잔|kopje)\w*/gi,
  /\b(relógio|clock|watch|horloge|montre|Uhr|час|时钟|시계|klok)\w*/gi,
  /\b(lâmpada|lamp|bulb|lampe|Lampe|ламп|灯|램프)\w*/gi,
  /\b(mancha|stain|tache|Fleck|пятн|污渍|얼룩|vlek)\w*/gi,
  /\b(sombra|shadow|ombre|Schatten|тень|影|그림자|schaduw)\w*/gi,
  /\b(reflexo|reflection|reflet|Spiegelung|отражен|倒影|반사|weerspiegeling)\w*/gi,
  /\b(ponteiro|hand|pointer|aiguille|Zeiger|стрелк|指针|바늘|wijzer)\w*/gi,
  /\b(fragmento|fragment|Bruchstück|осколок|碎片|파편)\w*/gi,
  /\b(fenda|crack|fissure|Riss|трещин|裂缝|균열|scheur)\w*/gi,
  /\b(brinquedo|toy|jouet|Spielzeug|игрушк|玩具|장난감|speelgoed)\w*/gi,
  /\b(café|coffee|Kaffee|кофе|咖啡|커피|koffie)\w*/gi,
  /\b(suor|sweat|sueur|Schweiß|пот|汗|땀|zweet)\w*/gi,
  /\b(sangue|blood|sang|Blut|кров|血|피|bloed)\w*/gi,
  /\b(fósforo|match|allumette|Streichholz|спичк|火柴|성냥|lucifer)\w*/gi,
  /\b(mosca|fly|mouche|Fliege|муха|苍蝇|파리|vlieg)\w*/gi,
  /\b(caracol|snail|escargot|Schnecke|улитк|蜗牛|달팽이|slak)\w*/gi,
  /\b(joaninha|ladybug|coccinelle|Marienkäfer|божья коровка|瓢虫|무당벌레|lieveheersbeestje)\w*/gi,
  /\b(pena|feather|plume|Feder|перо|羽|깃털|veer)\w*/gi,
  /\b(bolha|bubble|bulle|Blase|пузыр|泡|거품|bel)\w*/gi,
  /\b(parafuso|bolt|screw|boulon|Schraube|болт|螺丝|볼트|bout)\w*/gi,
  /\b(moeda|coin|pièce|Münze|монет|硬币|동전|munt)\w*/gi,
  /\b(sapato|shoe|chaussure|Schuh|ботинок|鞋|신발|schoen)\w*/gi,
  /\b(aliança|ring|bague|Ring|кольц|戒指|반지)\w*/gi,
  /\b(fotografia|photograph|photo|Foto|фотограф|照片|사진|foto)\w*/gi,
  // Slow movement / stillness
  /\b(lentamente|slowly|lentement|langsam|медленно|慢慢|천천히|langzaam)\b/gi,
  /\b(devagar|softly|doucement|leise|тихо|轻轻|부드럽게|zachtjes)\b/gi,
  /\b(suavemente|gently|délicatement|sanft|нежно|温柔|부드럽게|voorzichtig)\b/gi,
  /\b(silêncio|silence|Stille|тишин|沉默|침묵|stilte)\w*/gi,
  /\b(sussurro|whisper|murmure|Flüstern|шёпот|低语|속삭임|fluistering)\w*/gi,
  /\b(imóvel|motionless|immobile|reglos|неподвижн|静止|정지|roerloos)\w*/gi,
  // Diminutive / smallness
  /\b(pequen|tiny|small|petit|klein|маленьк|小|작은)\w*/gi,
  /\b(mínimo|minimal|infime|winzig|крошечн|微小|미세|minimaal)\w*/gi,
  /\b(minúscul|minuscule|tiny|winzig|крохотн|微小|미세)\w*/gi,
  /\b(ínfimo|infinitesimal|infime|winzig|мельчайш|极小|극소)\w*/gi,
  // States of rest / floating
  /\b(descansava|rested|reposait|ruhte|покоил|休息|쉬고)\w*/gi,
  /\b(flutuava|floated|flottait|schwebte|парил|漂浮|떠다니|zweefde)\w*/gi,
  /\b(dançava|danced|dansait|tanzte|танцевал|跳舞|춤추)\w*/gi,
  /\b(balançava|swayed|oscillait|schwankte|качал|摇晃|흔들)\w*/gi,
  /\b(girava|spinning|tournait|drehte|вращал|旋转|회전|draaide)\w*/gi,
  /\b(deslizava|slid|glissait|glitt|скользил|滑|미끄러|gleed)\w*/gi,
  /\b(tremia|trembled|tremblait|zitterte|дрожал|颤抖|떨|trilde)\w*/gi,
  /\b(piscava|blinked|clignotait|blinkte|мигал|闪烁|깜빡|knipperde)\w*/gi,
  /\b(arrefecia|cooled|refroidissait|kühlte|остывал|冷却|식었다|koelde)\w*/gi,
  /\b(pousava|landed|se posait|landete|приземлил|落|내려앉)\w*/gi,
  /\b(rolava|rolled|roulait|rollte|катил|滚|굴렀다|rolde)\w*/gi,
  /\b(intocad|untouched|intouché|unberührt|нетронут|未触|손대지)\w*/gi,
  /\b(esquecid|forgotten|oublié|vergessen|забыт|被遗忘|잊힌|vergeten)\w*/gi,
  /\b(abandon|abandoned|abandonné|verlassen|заброшен|被遗弃|버려진)\w*/gi,
];

const CONNECTOR_PATTERNS = [
  // Contrastive connectors (the key mechanism)
  /,\s*(enquanto|while|whilst|tandis que|während|mientras|mentre|terwijl|в то время как|而|그동안)\b/gi,
  /,\s*(mas|but|mais|aber|pero|ma|maar|но|但|하지만)\b/gi,
  /,\s*(e,?\s|and\s|et\s|und\s|y\s|en\s|и\s|그리고\s)/gi,
  /,\s*(yet|still|however|pourtant|cependant|dennoch|却|그러나)\b/gi,
  /,\s*(e\s+no\s|and\s+on\s+the\s|e\s+na\s|e\s+ali\s)/gi,
  // Semicolon as separator between parallel focalipses
  /;\s*(e\s|and\s|et\s|und\s|y\s|en\s|и\s|그리고\s)/gi,
  // Dash/ellipsis connectors
  /[—–]\s*(e|and|et|und|y|en)\s/gi,
  /…\s*(e|and|et|und|y|en)\s/gi,
  /\.\.\.\s*(e|and|et|und|y|en)\s/gi,
];

// ─── ADVANCED STRUCTURAL ANALYSIS ───

interface StructuralAnalysis {
  macroCount: number;
  microCount: number;
  macroPositions: number[];
  microPositions: number[];
  connectorPositions: number[];
  hasMacroBeforeMicro: boolean;
  hasMicroBeforeMacro: boolean;
  hasMultipleMicroSequences: boolean;
  hasMultipleMacroMicroPairs: boolean;
  endsWithEllipsis: boolean;
  endsWithSuspense: boolean;
  hasScaleProgression: boolean;
  hasRecursiveReflection: boolean;
  hasParallelNarrative: boolean;
  sentenceCount: number;
  textLength: number;
  macroIntensity: number;
  microIntensity: number;
  contrastRatio: number;
}

function getPatternPositions(text: string, patterns: RegExp[]): number[] {
  const positions: number[] = [];
  for (const pattern of patterns) {
    const re = new RegExp(pattern.source, pattern.flags);
    let match;
    while ((match = re.exec(text)) !== null) {
      positions.push(match.index);
    }
  }
  return [...new Set(positions)].sort((a, b) => a - b);
}

function countPatternMatches(text: string, patterns: RegExp[]): number {
  let count = 0;
  const seen = new Set<string>();
  for (const pattern of patterns) {
    const re = new RegExp(pattern.source, pattern.flags);
    const matches = text.match(re);
    if (matches) {
      for (const m of matches) {
        const key = m.toLowerCase();
        if (!seen.has(key)) {
          seen.add(key);
          count++;
        }
      }
    }
  }
  return count;
}

function analyzeStructure(text: string): StructuralAnalysis {
  const macroPositions = getPatternPositions(text, MACRO_PATTERNS);
  const microPositions = getPatternPositions(text, MICRO_PATTERNS);
  const connectorPositions = getPatternPositions(text, CONNECTOR_PATTERNS);

  const macroCount = countPatternMatches(text, MACRO_PATTERNS);
  const microCount = countPatternMatches(text, MICRO_PATTERNS);

  const hasMacroBeforeMicro = macroPositions.length > 0 && microPositions.length > 0 &&
    Math.min(...macroPositions) < Math.max(...microPositions);

  const hasMicroBeforeMacro = microPositions.length > 0 && macroPositions.length > 0 &&
    Math.min(...microPositions) < Math.min(...macroPositions);

  const hasMultipleMicroSequences = microPositions.length >= 2 &&
    macroPositions.length > 0 &&
    microPositions.filter(mp => mp > Math.min(...macroPositions)).length >= 2;

  let pairCount = 0;
  const sortedMacro = [...macroPositions];
  const usedMicro = new Set<number>();
  for (const mPos of sortedMacro) {
    const pairedMicro = microPositions.find(uPos => uPos > mPos && !usedMicro.has(uPos));
    if (pairedMicro !== undefined) {
      pairCount++;
      usedMicro.add(pairedMicro);
    }
  }
  const hasMultipleMacroMicroPairs = pairCount >= 2;

  const trimmed = text.trim();
  const endsWithEllipsis = trimmed.endsWith('…') || trimmed.endsWith('...');
  const endsWithSuspense = endsWithEllipsis ||
    /lentamente[.…]?\s*$/.test(trimmed) || /slowly[.…]?\s*$/.test(trimmed) ||
    /abrir[- ]se\b/.test(trimmed.slice(-60)) ||
    /open(ing|ed)?\s*[.…]*\s*$/.test(trimmed);

  const hasScaleProgression = microCount >= 3;

  // Recursive detection: micro-detail that contains a reflection/image/mirror of the macro
  const recursivePatterns = /\b(reflet|reflect|espelh|mirror|imagem|image|映|반사|отраж|weerspieg)\w*/gi;
  const hasRecursiveReflection = recursivePatterns.test(text) && macroCount >= 1 && microCount >= 1;

  // Parallel detection: "noutra/another/dans une autre" + second macro→micro pair
  const parallelMarkers = /\b(noutr|another|dans une autre|in einer anderen|en otr|in un'altr|в друг|另一|다른|in een ander)\w*/gi;
  const hasParallelNarrative = parallelMarkers.test(text) || (text.includes(';') && hasMultipleMacroMicroPairs);

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);

  // Intensity scoring: how "intense" are the macro and micro elements
  const macroIntensity = Math.min(5, macroCount);
  const microIntensity = Math.min(5, microCount);
  const contrastRatio = macroCount > 0 && microCount > 0
    ? Math.min(macroIntensity, microIntensity) / Math.max(macroIntensity, microIntensity)
    : 0;

  return {
    macroCount,
    microCount,
    macroPositions,
    microPositions,
    connectorPositions,
    hasMacroBeforeMicro,
    hasMicroBeforeMacro,
    hasMultipleMicroSequences,
    hasMultipleMacroMicroPairs,
    endsWithEllipsis,
    endsWithSuspense,
    hasScaleProgression,
    hasRecursiveReflection,
    hasParallelNarrative,
    sentenceCount: sentences.length,
    textLength: text.length,
    macroIntensity,
    microIntensity,
    contrastRatio,
  };
}

// ─── ADVANCED TYPE DETECTION ───

function detectType(s: StructuralAnalysis): string | null {
  // Suspended: macro present, ends with ellipsis/suspense, micro may be implied
  if (s.macroCount >= 1 && s.endsWithSuspense && s.microCount <= 1) {
    return 'Suspenso';
  }

  // Inverted: micro comes BEFORE macro (and no macro before micro)
  if (s.hasMicroBeforeMacro && !s.hasMacroBeforeMicro && s.microCount >= 1 && s.macroCount >= 1) {
    return 'Invertido';
  }

  // Recursive: has reflection/mirror patterns within micro
  if (s.hasRecursiveReflection && s.hasMacroBeforeMicro) {
    return 'Recursivo';
  }

  // Parallel: two separate macro→micro pairs in different "planes"
  if (s.hasParallelNarrative && s.hasMultipleMacroMicroPairs && s.macroCount >= 2 && s.microCount >= 2) {
    return 'Paralelo';
  }

  // Chain: multiple macro→micro sequences connected
  if (s.hasMultipleMacroMicroPairs && s.connectorPositions.length >= 2 && s.macroCount >= 2) {
    return 'Encadeado';
  }

  // Progressive: macro → micro → even smaller micro (3+ micro details with progression)
  if (s.hasMacroBeforeMicro && s.hasScaleProgression && s.microCount >= 3 && !s.hasMultipleMacroMicroPairs) {
    return 'Progressivo';
  }

  // Compound: macro → multiple micro details (2+ micro after macro)
  if (s.hasMacroBeforeMicro && s.hasMultipleMicroSequences && s.microCount >= 2) {
    return 'Composto';
  }

  // Simple: basic macro → micro
  if (s.hasMacroBeforeMicro && s.macroCount >= 1 && s.microCount >= 1) {
    return 'Simples';
  }

  // Inverted fallback: if micro appears first anywhere
  if (s.hasMicroBeforeMacro) {
    return 'Invertido';
  }

  return null;
}

// ─── ADVANCED SCORING ───

export function analyzeFocalipse(text: string): AnalysisResult {
  const structure = analyzeStructure(text);

  const hasMacro = structure.macroCount >= 2;
  const hasMicro = structure.microCount >= 1;
  const hasConnector = structure.connectorPositions.length >= 1;
  const hasAbruptTransition = hasConnector && structure.sentenceCount <= 4;
  const hasScaleContrast = structure.hasMacroBeforeMicro || structure.hasMicroBeforeMacro;

  // Weighted scoring system
  let score = 0;

  // Core elements (max 3)
  if (hasMacro) score += 1;
  if (structure.macroCount >= 3) score += 0.25; // Strong macro presence
  if (hasMicro) score += 1;
  if (structure.microCount >= 2) score += 0.25; // Rich micro detail
  if (hasScaleContrast) score += 1;

  // Structural elements (max 1.5)
  if (hasConnector) score += 0.5;
  if (hasAbruptTransition) score += 0.5;
  if (structure.connectorPositions.length >= 2) score += 0.25;

  // Length/format bonus (max 0.5)
  if (structure.textLength >= 50 && structure.sentenceCount <= 4) score += 0.25;
  if (structure.textLength >= 100) score += 0.25;

  // Contrast quality bonus (max 0.5)
  if (structure.contrastRatio >= 0.3 && structure.contrastRatio <= 0.8) score += 0.25;
  if (structure.macroIntensity >= 2 && structure.microIntensity >= 2) score += 0.25;

  // Type-specific bonuses (max 0.5)
  if (structure.hasRecursiveReflection) score += 0.25;
  if (structure.hasParallelNarrative && structure.hasMultipleMacroMicroPairs) score += 0.25;

  // Cap at 5
  score = Math.min(5, Math.round(score * 10) / 10);
  const intScore = Math.round(score);

  const detectedType = intScore >= 2 ? detectType(structure) : null;

  // Verdict
  let verdict: 'is' | 'almost' | 'not';
  let confidence: 'high' | 'medium' | 'low';

  if (score >= 4.5) { verdict = 'is'; confidence = 'high'; }
  else if (score >= 3.5) { verdict = 'is'; confidence = 'medium'; }
  else if (score >= 3) { verdict = 'almost'; confidence = 'medium'; }
  else if (score >= 2) { verdict = 'almost'; confidence = 'low'; }
  else { verdict = 'not'; confidence = score <= 1 ? 'high' : 'medium'; }

  const missingTips: string[] = [];
  if (!hasMacro) missingTips.push('tipMacro');
  if (!hasMicro) missingTips.push('tipMicro');
  if (!hasConnector) missingTips.push('tipConnector');
  if (!hasScaleContrast) missingTips.push('tipContrast');
  if (!hasAbruptTransition) missingTips.push('tipTransition');

  return {
    verdict, confidence,
    hasMacro, hasMicro, hasConnector, hasAbruptTransition, hasScaleContrast,
    detectedType, missingTips,
    score: intScore,
  };
}

// ─── TYPE NAME TRANSLATIONS ───

export const TYPE_NAMES: Record<string, Record<string, string>> = {
  'pt-PT': { Simples: 'Simples', Composto: 'Composto', Encadeado: 'Encadeado', Invertido: 'Invertido', Suspenso: 'Suspenso', Progressivo: 'Progressivo', Paralelo: 'Paralelo', Recursivo: 'Recursivo' },
  'pt-BR': { Simples: 'Simples', Composto: 'Composto', Encadeado: 'Encadeado', Invertido: 'Invertido', Suspenso: 'Suspenso', Progressivo: 'Progressivo', Paralelo: 'Paralelo', Recursivo: 'Recursivo' },
  'en-US': { Simples: 'Simple', Composto: 'Compound', Encadeado: 'Chained', Invertido: 'Inverted', Suspenso: 'Suspended', Progressivo: 'Progressive', Paralelo: 'Parallel', Recursivo: 'Recursive' },
  'en-GB': { Simples: 'Simple', Composto: 'Compound', Encadeado: 'Chained', Invertido: 'Inverted', Suspenso: 'Suspended', Progressivo: 'Progressive', Paralelo: 'Parallel', Recursivo: 'Recursive' },
  'fr': { Simples: 'Simple', Composto: 'Composé', Encadeado: 'Enchaîné', Invertido: 'Inversé', Suspenso: 'Suspendu', Progressivo: 'Progressif', Paralelo: 'Parallèle', Recursivo: 'Récursif' },
  'es': { Simples: 'Simple', Composto: 'Compuesto', Encadeado: 'Encadenado', Invertido: 'Invertido', Suspenso: 'Suspendido', Progressivo: 'Progresivo', Paralelo: 'Paralelo', Recursivo: 'Recursivo' },
  'de': { Simples: 'Einfach', Composto: 'Zusammengesetzt', Encadeado: 'Verkettet', Invertido: 'Invertiert', Suspenso: 'Suspendiert', Progressivo: 'Progressiv', Paralelo: 'Parallel', Recursivo: 'Rekursiv' },
  'it': { Simples: 'Semplice', Composto: 'Composto', Encadeado: 'Concatenato', Invertido: 'Invertito', Suspenso: 'Sospeso', Progressivo: 'Progressivo', Paralelo: 'Parallelo', Recursivo: 'Ricorsivo' },
  'nl': { Simples: 'Eenvoudig', Composto: 'Samengesteld', Encadeado: 'Geketend', Invertido: 'Omgekeerd', Suspenso: 'Opgeschort', Progressivo: 'Progressief', Paralelo: 'Parallel', Recursivo: 'Recursief' },
  'ru': { Simples: 'Простой', Composto: 'Составной', Encadeado: 'Цепной', Invertido: 'Инвертированный', Suspenso: 'Приостановленный', Progressivo: 'Прогрессивный', Paralelo: 'Параллельный', Recursivo: 'Рекурсивный' },
  'ja': { Simples: 'シンプル', Composto: '複合', Encadeado: '連鎖', Invertido: '反転', Suspenso: '保留', Progressivo: '漸進的', Paralelo: '並行', Recursivo: '再帰' },
  'zh': { Simples: '简单', Composto: '复合', Encadeado: '链式', Invertido: '反转', Suspenso: '悬念', Progressivo: '渐进', Paralelo: '平行', Recursivo: '递归' },
  'ko': { Simples: '단순', Composto: '복합', Encadeado: '연쇄', Invertido: '반전', Suspenso: '유보', Progressivo: '점진적', Paralelo: '병렬', Recursivo: '재귀' },
  'ar': { Simples: 'بسيط', Composto: 'مركب', Encadeado: 'متسلسل', Invertido: 'معكوس', Suspenso: 'معلق', Progressivo: 'تصاعدي', Paralelo: 'متوازٍ', Recursivo: 'تكراري' },
};

// ─── EXAMPLE TEXTS PER LANGUAGE ───

export const EXAMPLE_TEXTS: Record<string, string[]> = {
  'pt-PT': [
    'As sirenes gritavam, as luzes piscavam, e o sistema ruía numa cascata de falhas críticas, enquanto uma única gota de óleo deslizava lentamente pela borda do console.',
    'A chama tremulava suavemente na ponta do fósforo, e o edifício inteiro explodiu num rugido de fogo e escombros.',
    'Os gritos ecoaram pela casa enquanto a porta começava a abrir-se lentamente…',
    'O mundo desabou num estrondo de destruição total, enquanto uma lágrima lhe escorria pelo rosto, refletindo na sua superfície a imagem distante de uma cidade em chamas.',
    'Os prédios desabavam sob o fogo da artilharia, a terra tremia com o som ensurdecedor dos motores, e, no asfalto, uma formiga tentava contornar a ponta do seu sapato.',
    'Gritavam um contra o outro no meio da sala, atirando jarras contra a parede, enquanto o gelo estalava silenciosamente dentro do copo de whisky.',
  ],
  'pt-BR': [
    'As sirenes gritavam, as luzes piscavam, e o sistema desmoronava numa cascata de falhas críticas, enquanto uma única gota de óleo deslizava lentamente pela borda do console.',
    'A chama tremulava suavemente na ponta do fósforo, e o prédio inteiro explodiu num rugido de fogo e escombros.',
    'Os gritos ecoaram pela casa enquanto a porta começava a se abrir lentamente…',
    'O mundo desabou num estrondo de destruição total, enquanto uma lágrima escorria pelo rosto dele, refletindo em sua superfície a imagem distante de uma cidade em chamas.',
  ],
  'en-US': [
    'The alarms screamed, lights flickered, and the system collapsed in a cascade of critical failures, while a single drop of oil slid slowly along the edge of the console.',
    'The flame flickered softly at the tip of the match, and the entire building exploded in a roar of fire and debris.',
    'The screams echoed through the house while the door slowly began to open…',
    'The world collapsed in a roar of total destruction, while a tear slid down his face, reflecting on its surface the distant image of a city in flames.',
    'Buildings crumbled under artillery fire, the earth trembled with the deafening roar of engines, and on the asphalt, an ant tried to go around the tip of his shoe.',
    'She said she would never come back, slammed the door shut and took with her everything he was, while the coffee cooled untouched on the table.',
  ],
  'en-GB': [
    'The alarms screamed, lights flickered, and the system collapsed in a cascade of critical failures, whilst a single drop of oil slid slowly along the edge of the console.',
    'The flame flickered softly at the tip of the match, and the entire building exploded in a roar of fire and debris.',
    'The world collapsed in a roar of total destruction, whilst a tear slid down his face, reflecting on its surface the distant image of a city in flames.',
  ],
  'fr': [
    'Les alarmes hurlaient, les lumières clignotaient, et le système s\'effondrait dans une cascade de défaillances critiques, tandis qu\'une unique goutte d\'huile glissait lentement le long du bord de la console.',
    'La flamme vacillait doucement à la pointe de l\'allumette, et le bâtiment entier explosa dans un rugissement de feu et de décombres.',
    'Les cris résonnèrent dans la maison tandis que la porte commençait à s\'ouvrir lentement…',
    'Le monde s\'effondra dans un grondement de destruction totale, tandis qu\'une larme glissait sur son visage, reflétant à sa surface l\'image lointaine d\'une ville en flammes.',
  ],
  'es': [
    'Las alarmas gritaban, las luces parpadeaban, y el sistema colapsaba en una cascada de fallos críticos, mientras una única gota de aceite se deslizaba lentamente por el borde de la consola.',
    'La llama temblaba suavemente en la punta del fósforo, y el edificio entero explotó en un rugido de fuego y escombros.',
    'Los gritos resonaron por la casa mientras la puerta comenzaba a abrirse lentamente…',
    'El mundo se derrumbó en un estruendo de destrucción total, mientras una lágrima le resbalaba por el rostro, reflejando en su superficie la imagen distante de una ciudad en llamas.',
  ],
  'de': [
    'Die Alarme schrien, die Lichter flackerten, und das System brach in einer Kaskade kritischer Ausfälle zusammen, während ein einzelner Öltropfen langsam am Rand der Konsole entlangglitt.',
    'Die Flamme flackerte sanft an der Spitze des Streichholzes, und das gesamte Gebäude explodierte in einem Dröhnen aus Feuer und Trümmern.',
    'Die Schreie hallten durch das Haus, während sich die Tür langsam zu öffnen begann…',
    'Die Welt brach in einem Getöse totaler Zerstörung zusammen, während eine Träne über sein Gesicht glitt und auf ihrer Oberfläche das ferne Bild einer brennenden Stadt reflektierte.',
  ],
  'it': [
    'Gli allarmi urlavano, le luci lampeggiavano, e il sistema crollava in una cascata di guasti critici, mentre una singola goccia d\'olio scivolava lentamente lungo il bordo della console.',
    'La fiamma tremolava dolcemente sulla punta del fiammifero, e l\'intero edificio esplose in un ruggito di fuoco e macerie.',
    'Le urla echeggiarono per la casa mentre la porta cominciava ad aprirsi lentamente…',
    'Il mondo crollò in un boato di distruzione totale, mentre una lacrima gli scivolava sul viso, riflettendo sulla sua superficie l\'immagine lontana di una città in fiamme.',
  ],
  'nl': [
    'De alarmen schreeuwden, de lichten flikkerden, en het systeem stortte in een cascade van kritieke storingen, terwijl een enkele druppel olie langzaam langs de rand van de console gleed.',
    'De vlam flikkerde zachtjes aan de punt van de lucifer, en het hele gebouw explodeerde in een gebulder van vuur en puin.',
    'De kreten echoden door het huis terwijl de deur langzaam begon te openen…',
  ],
  'ru': [
    'Сирены кричали, свет мигал, и система рушилась в каскаде критических сбоев, в то время как единственная капля масла медленно скользила по краю консоли.',
    'Пламя мягко мерцало на кончике спички, и всё здание взорвалось в рёве огня и обломков.',
    'Крики разносились по дому, пока дверь медленно начинала открываться…',
    'Мир рухнул в грохоте тотального разрушения, в то время как слеза скользила по его лицу, отражая на своей поверхности далёкий образ горящего города.',
  ],
  'ja': [
    '警報が叫び、光が点滅し、システムが致命的な障害の連鎖で崩壊する中、一滴の油がコンソールの端をゆっくりと滑り落ちていた。',
    '火はマッチの先端で静かに揺れていたが、建物全体が火と瓦礫の轟音で爆発した。',
    '叫び声が家中に響き渡る中、ドアがゆっくりと開き始めた…',
  ],
  'zh': [
    '警报尖叫着，灯光闪烁，系统在一连串致命故障中崩溃，而一滴油沿着控制台的边缘缓缓滑落。',
    '火焰在火柴尖端轻轻摇曳，整栋建筑在火与碎片的轰鸣中爆炸了。',
    '尖叫声在房子里回荡，门开始慢慢打开…',
  ],
  'ko': [
    '경보가 울부짖고, 불빛이 깜빡이며, 시스템이 치명적인 고장의 연쇄 속에 무너지는 동안, 한 방울의 기름이 콘솔 가장자리를 천천히 미끄러져 내렸다.',
    '불꽃이 성냥 끝에서 부드럽게 흔들리더니, 건물 전체가 화염과 잔해의 굉음 속에 폭발했다.',
    '비명이 집 안에 메아리치는 동안 문이 천천히 열리기 시작했다…',
  ],
  'ar': [
    'صرخت أجهزة الإنذار، وومضت الأضواء، وانهار النظام في سلسلة من الأعطال الحرجة، بينما انزلقت قطرة زيت واحدة ببطء على حافة وحدة التحكم.',
    'كانت الشعلة ترتجف بلطف على طرف عود الثقاب، وانفجر المبنى بأكمله في هدير من النار والحطام.',
    'تردد صدى الصراخ في أرجاء المنزل بينما بدأ الباب يُفتح ببطء…',
  ],
};

// ─── UI COMPONENTS ───

function CheckRow({ label, value, yes, no }: { label: string; value: boolean; yes: string; no: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
      <span className="font-body text-sm text-foreground">{label}</span>
      <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${value ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
        {value ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
        {value ? yes : no}
      </span>
    </div>
  );
}

export function VerifierSection() {
  const { t, language } = useLanguage();
  const [text, setText] = useState('');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const analyze = useCallback(() => {
    if (text.trim().length < 10) return;
    setResult(analyzeFocalipse(text));
  }, [text]);

  const clear = useCallback(() => {
    setText('');
    setResult(null);
  }, []);

  const tryExample = useCallback(() => {
    const examples = EXAMPLE_TEXTS[language] || EXAMPLE_TEXTS['en-US'];
    const randomExample = examples[Math.floor(Math.random() * examples.length)];
    setText(randomExample);
    setResult(null);
  }, [language]);

  const v = t.verifier;

  const verdictIcon = result?.verdict === 'is'
    ? <CheckCircle2 size={24} className="text-green-500" />
    : result?.verdict === 'almost'
    ? <AlertTriangle size={24} className="text-yellow-500" />
    : <XCircle size={24} className="text-red-500" />;

  const verdictText = result?.verdict === 'is' ? v.isFocalipse
    : result?.verdict === 'almost' ? v.almostFocalipse
    : v.notFocalipse;

  const verdictBg = result?.verdict === 'is'
    ? 'bg-green-500/10 border-green-500/30'
    : result?.verdict === 'almost'
    ? 'bg-yellow-500/10 border-yellow-500/30'
    : 'bg-red-500/10 border-red-500/30';

  const confidenceLabel = result?.confidence === 'high' ? v.high
    : result?.confidence === 'medium' ? v.medium : v.low;

  const typeNames = TYPE_NAMES[language] || TYPE_NAMES['en-US'];

  const tryExampleLabel = language.startsWith('pt') ? 'Experimentar Exemplo'
    : language === 'fr' ? 'Essayer un Exemple'
    : language === 'es' ? 'Probar Ejemplo'
    : language === 'de' ? 'Beispiel testen'
    : language === 'it' ? 'Provare Esempio'
    : language === 'nl' ? 'Voorbeeld proberen'
    : language === 'ru' ? 'Попробовать пример'
    : language === 'ja' ? '例を試す'
    : language === 'zh' ? '试试例子'
    : language === 'ko' ? '예제 시도'
    : language === 'ar' ? 'جرب مثالاً'
    : 'Try Example';

  return (
    <SectionWrapper id="verifier" chapterNum={v.chapterNum} title={v.title}>
      <p className="font-body text-lg text-muted-foreground italic mb-10">{v.subtitle}</p>

      <div className="max-w-3xl mx-auto space-y-6">
        {/* Text input */}
        <div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={v.placeholder}
            rows={5}
            className="w-full rounded-sm border border-border bg-card px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 resize-y transition-colors duration-200"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 justify-center flex-wrap">
          <button
            onClick={analyze}
            disabled={text.trim().length < 10}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-primary text-primary-foreground font-display text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Search size={16} />
            {v.analyzeBtn}
          </button>
          <button
            onClick={tryExample}
            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border border-primary/30 text-primary font-display text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-primary/10 transition-colors duration-200"
          >
            <Sparkles size={16} />
            {tryExampleLabel}
          </button>
          {(text || result) && (
            <button
              onClick={clear}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 border border-border text-foreground font-display text-xs sm:text-sm font-semibold tracking-wide uppercase rounded-sm hover:bg-muted transition-colors duration-200"
            >
              <RotateCcw size={16} />
              {v.clearBtn}
            </button>
          )}
        </div>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={JSON.stringify(result)}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Verdict */}
              <div className={`rounded-sm border p-4 sm:p-6 ${verdictBg}`}>
                <div className="flex items-center gap-3 mb-2">
                  {verdictIcon}
                  <h3 className="font-display text-base sm:text-lg font-bold text-foreground">{verdictText}</h3>
                </div>
                <div className="flex items-center gap-3 sm:gap-4 mt-3 text-xs sm:text-sm font-body text-muted-foreground flex-wrap">
                  <span>{v.confidence}: <strong className="text-foreground">{confidenceLabel}</strong></span>
                  {result.detectedType && (
                    <span>{v.detectedType}: <strong className="text-foreground">{typeNames[result.detectedType] || result.detectedType}</strong></span>
                  )}
                  <span>Score: <strong className="text-foreground">{result.score}/5</strong></span>
                </div>
              </div>

              {/* Checklist */}
              <div className="rounded-sm border border-border bg-card p-4 sm:p-5">
                <h4 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">{v.resultTitle}</h4>
                <CheckRow label={v.hasMacro} value={result.hasMacro} yes={v.yes} no={v.no} />
                <CheckRow label={v.hasMicro} value={result.hasMicro} yes={v.yes} no={v.no} />
                <CheckRow label={v.hasConnector} value={result.hasConnector} yes={v.yes} no={v.no} />
                <CheckRow label={v.hasAbruptTransition} value={result.hasAbruptTransition} yes={v.yes} no={v.no} />
                <CheckRow label={v.hasScaleContrast} value={result.hasScaleContrast} yes={v.yes} no={v.no} />

                {/* Score bar */}
                <div className="mt-4 pt-3 border-t border-border/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground">Score</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(result.score / 5) * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className={`h-full rounded-full ${
                          result.score >= 4 ? 'bg-green-500' : result.score >= 3 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-mono text-foreground font-bold">{result.score}/5</span>
                  </div>
                </div>
              </div>

              {/* Suggestions */}
              {result.missingTips.length > 0 && result.verdict !== 'is' && (
                <div className="rounded-sm border border-border bg-card p-4 sm:p-5">
                  <h4 className="font-display text-sm font-semibold text-foreground mb-3 tracking-wide uppercase">{v.suggestions}</h4>
                  <ul className="space-y-2">
                    {result.missingTips.map((tipKey, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm font-body text-muted-foreground">
                        <span className="text-primary mt-0.5">→</span>
                        {v[tipKey as keyof typeof v] as string}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SectionWrapper>
  );
}
