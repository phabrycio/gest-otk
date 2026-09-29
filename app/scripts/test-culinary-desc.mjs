import fs from 'fs';

// Helper to translate Portuguese restaurant descriptions into English and Spanish
export function translateCulinaryDesc(pt, item, lang) {
  if (!pt) return '';
  const isEn = lang === 'en';
  let text = pt.trim();

  // Handle calorie / nutritional suffix if present
  let nutSuffix = '';
  const calMatch = text.match(/Calorias:\s*(\d+kcal)[\s\S]*$/i);
  if (calMatch) {
    const origNut = calMatch[0];
    text = text.replace(origNut, '').trim();
    if (isEn) {
      nutSuffix = ' ' + origNut
        .replace(/Calorias:/g, 'Calories:')
        .replace(/Valor proteico:/g, 'Protein:')
        .replace(/Fibras:/g, 'Fiber:');
    } else {
      nutSuffix = ' ' + origNut
        .replace(/Calorias:/g, 'Calorías:')
        .replace(/Valor proteico:/g, 'Proteínas:')
        .replace(/Fibras:/g, 'Fibra:');
    }
  }

  // Remove trailing dots or dashes
  text = text.replace(/[\.\s]+$/, '');

  let out = text;

  if (isEn) {
    // Culinary vocabulary replacements
    const rep = [
      // Proteins & Cuts
      [/\bcostela de tambaqui de cativeiro\b/gi, 'farm-raised Amazonian tambaqui ribs'],
      [/\bcostela de tambaqui\b/gi, 'Amazonian tambaqui ribs'],
      [/\bcostela bovina desfiada\b/gi, 'shredded pulled beef ribs'],
      [/\bcostela bovina\b/gi, 'tender beef ribs'],
      [/\bfilé alto de pirarucu de manejo\b/gi, 'thick fillet of sustainable Amazonian pirarucu'],
      [/\bfilé de pirarucu\b/gi, 'Amazonian pirarucu fillet'],
      [/\bpirarucu de manejo\b/gi, 'sustainable Amazonian pirarucu'],
      [/\bpirarucu\b/gi, 'Amazonian pirarucu'],
      [/\btambaqui\b/gi, 'Amazonian tambaqui'],
      [/\bcarne de sol maturada artesanalmente\b/gi, 'artisan-cured Brazilian sun-dried beef'],
      [/\bcarne de sol\b/gi, 'traditional sun-cured beef'],
      [/\bcarne seca\s*\(charque\)\b/gi, 'shredded jerked beef'],
      [/\bcarne seca\b/gi, 'Brazilian jerked beef'],
      [/\bcharque\b/gi, 'jerked salt beef'],
      [/\bpicanha\b/gi, 'prime Brazilian picanha rump cap'],
      [/\bbife de chorizo\b/gi, 'Angus sirloin chorizo steak'],
      [/\bchourizo\b/gi, 'Angus sirloin chorizo steak'],
      [/\bchouriço\b/gi, 'artisan pork sausage'],
      [/\bancho\b/gi, 'prime Angus ribeye steak'],
      [/\bfilé mignon\b/gi, 'beef tenderloin medallion'],
      [/\bfilé com fritas\b/gi, 'sautéed tenderloin strips with fries'],
      [/\bfilé\b/gi, 'tender beef fillet'],
      [/\bcamarões levemente salteados\b/gi, 'succulent lightly sautéed shrimps'],
      [/\bcamarões\b/gi, 'succulent shrimps'],
      [/\bcamarão\b/gi, 'shrimp'],
      [/\bfrango grelhado\b/gi, 'grilled chicken breast'],
      [/\bfrango\b/gi, 'chicken'],
      [/\bjoelho de porco\b/gi, 'smoked pork shank'],
      [/\blonging\b/gi, 'sausage'],
      [/\blinguiça defumada\b/gi, 'smoked Brazilian sausage'],
      [/\blinguiça\b/gi, 'artisanal sausage'],
      [/\bbacon crocante\b/gi, 'crisp smoked bacon'],
      [/\bbacon\b/gi, 'smoked bacon'],
      [/\btorresmo\b/gi, 'crisp crackling pork belly'],
      [/\bbarriga cozida lentamente\b/gi, 'slow-braised pork belly'],
      [/\bbarriga de porco\b/gi, 'tender pork belly'],
      [/\bpernil\b/gi, 'slow-roasted pulled pork'],
      [/\bmortadela italiana\b/gi, 'fine Italian mortadella'],
      [/\bpastrami de peito de boi\b/gi, 'smoked peppered beef brisket pastrami'],
      [/\bpastrami\b/gi, 'smoked beef pastrami'],
      [/\bjamon espanhol\b/gi, 'cured Spanish jamón'],
      [/\bjamon\b/gi, 'cured jamón'],
      [/\bazeitonas verdes sem caroço\b/gi, 'pitted seasoned green olives'],
      [/\bazeitonas\b/gi, 'olives'],
      [/\bcorações de galinha\b/gi, 'tender chicken hearts'],
      [/\bcoraçãozinho de galinha\b/gi, 'grilled chicken hearts'],

      // Cooking methods & textures
      [/\bassada lentamente na brasa de carvão\b/gi, 'slow-roasted over natural wood charcoal'],
      [/\bassada na brasa\b/gi, 'roasted over hot charcoal'],
      [/\bassado na brasa\b/gi, 'charcoal-roasted to perfection'],
      [/\bassado lentamente\b/gi, 'slow-roasted until tender'],
      [/\bpassadas na manteiga\b/gi, 'sautéed in clarified butter'],
      [/\bgrelhado com manteiga de garrafa\b/gi, 'grilled with traditional clarified bottle butter'],
      [/\bgrelhado\b/gi, 'fire-grilled'],
      [/\bgrelhada\b/gi, 'fire-grilled'],
      [/\bgrelhadas\b/gi, 'fire-grilled'],
      [/\bgrelhados\b/gi, 'fire-grilled'],
      [/\bcrocante por fora, macio por dentro\b/gi, 'crispy golden on the outside, velvety soft inside'],
      [/\bcrocante por fora e macio por dentro\b/gi, 'crisp on the outside and tender inside'],
      [/\bcrocante\b/gi, 'crispy golden'],
      [/\bempanada na farinha panko\b/gi, 'crisp-breaded in Japanese panko crumbs'],
      [/\bempanado na farinha panko\b/gi, 'crisp-breaded in Japanese panko crumbs'],
      [/\bempanadas na farinha panko\b/gi, 'breaded in crispy panko flour'],
      [/\bempanada\b/gi, 'golden breaded'],
      [/\bempanadas\b/gi, 'crisp breaded'],
      [/\bempanado\b/gi, 'golden breaded'],
      [/\bcozida lentamente\b/gi, 'slow-simmered'],
      [/\bcozido lentamente\b/gi, 'slow-cooked'],
      [/\bcozido\b/gi, 'cooked'],
      [/\bcozida\b/gi, 'cooked'],
      [/\bfrita na hora\b/gi, 'fried fresh to order'],
      [/\bfrito\b/gi, 'crispy fried'],
      [/\bfrita\b/gi, 'crispy fried'],
      [/\bfritas\b/gi, 'crispy fried'],
      [/\bpururucada\b/gi, 'crisped to crackling perfection'],
      [/\bpururuca\b/gi, 'crispy crackling'],
      [/\bmoqueada\b/gi, 'slow-simmered in clay pot (moqueca style)'],
      [/\bgratinado com queijo\b/gi, 'gratinated with golden melted cheese'],
      [/\bgratinado\b/gi, 'oven-gratinated'],

      // Regional Ingredients & Sides
      [/\bfarofa de uarini crocante\b/gi, 'golden crunchy Amazonian Uarini cassava farofa'],
      [/\bfarofa de uarini\b/gi, 'crispy Uarini river cassava crumbs'],
      [/\bfarofa de banana\b/gi, 'sweet plantain farofa'],
      [/\bfarofa de coco\b/gi, 'toasted coconut farofa'],
      [/\bfarofa de castanhas\b/gi, 'crunchy Brazil nut farofa'],
      [/\bfarofa crocante de brownie\b/gi, 'crunchy brownie crumble'],
      [/\bfarofa\b/gi, 'artisanal toasted farofa'],
      [/\bvinagrete regional\b/gi, 'fresh Amazonian herb vinaigrette'],
      [/\bvinagrete de feijão manteiguinha\b/gi, 'native Santarém manteiguinha bean salsa vinaigrette'],
      [/\bvinagrete\b/gi, 'fresh tomato and herb vinaigrette'],
      [/\barroz paraense\b/gi, 'aromatic Pará rice with jambu'],
      [/\barroz integral 7 grãos\b/gi, 'nutritious 7-grain whole rice'],
      [/\barroz branco\b/gi, 'fluffy white rice'],
      [/\barroz\b/gi, 'steamed rice'],
      [/\bbaião de dois cremoso puxado no queijo coalho\b/gi, 'creamy baião de dois rice and beans folded with melted coalho cheese'],
      [/\bbaião de dois cremoso\b/gi, 'creamy baião rice and beans with coalho cheese'],
      [/\bbaião cremoso\b/gi, 'creamy baião de dois with melted cheese'],
      [/\bbaião de dois\b/gi, 'traditional baião de dois (rice, beans, cheese)'],
      [/\bqueijo coalho\b/gi, 'Brazilian golden coalho cheese'],
      [/\bqueijo do reino\b/gi, 'aged Brazilian Reino cheese'],
      [/\bqueijo mussarela\b/gi, 'melted mozzarella cheese'],
      [/\bmussarela\b/gi, 'mozzarella'],
      [/\bmacaxeira amarela regional\b/gi, 'fresh regional yellow Amazonian cassava (yucca)'],
      [/\bmacaxeira crocante\b/gi, 'crisp-fried Amazonian cassava'],
      [/\bmacaxeira frita\b/gi, 'golden crispy cassava fries'],
      [/\bmacaxeira\b/gi, 'Amazonian cassava (yucca)'],
      [/\bmandioca\b/gi, 'tender cassava root'],
      [/\bbatatas rústicas\b/gi, 'golden seasoned rustic potatoes'],
      [/\bbatata rústica\b/gi, 'rustic roasted potatoes'],
      [/\bbatatas fritas\b/gi, 'crisp golden french fries'],
      [/\bbatata frita\b/gi, 'crisp golden french fries'],
      [/\bpurê de batatas\b/gi, 'silky mashed potatoes'],
      [/\bpurê de macaxeira\b/gi, 'velvety cassava purée'],
      [/\blegumes da estação\b/gi, 'fresh seasonal vegetables'],
      [/\blegumes selecionados também grelhados\b/gi, 'select flame-grilled garden vegetables'],
      [/\blegumes grelhados\b/gi, 'grilled seasonal vegetables'],
      [/\blegumes\b/gi, 'tender vegetables'],
      [/\bfolhas de jambu\b/gi, 'tingling wild Amazonian jambu leaves'],
      [/\bjambu\b/gi, 'Amazonian jambu leaves'],
      [/\brisoto cremoso de tucupi\b/gi, 'creamy risotto infused with Amazonian tucupi reduction'],
      [/\btucupi\b/gi, 'aromatic Amazonian tucupi broth'],
      [/\bcrosta crocante de castanha-do-pará ralada e ervas\b/gi, 'crunchy crust of shredded Brazil nuts and aromatic fresh herbs'],
      [/\bcastanha-do-pará\b/gi, 'native Amazonian Brazil nuts'],
      [/\bcastanha do pará\b/gi, 'Brazil nuts'],
      [/\bcastanhas selecionadas\b/gi, 'hand-selected roasted nuts'],
      [/\bcastanha\b/gi, 'Brazil nuts'],
      [/\bbanana pacovã\b/gi, 'Amazonian pacovã plantain'],
      [/\bbanana da terra\b/gi, 'sweet ripe plantain'],
      [/\bbanana caramelizada\b/gi, 'naturally caramelized sweet plantain'],
      [/\bmolho da casa com dendê\b/gi, 'house reduction sauce with fragrant dendê palm oil'],
      [/\bazeite de dendê\b/gi, 'aromatic Brazilian dendê palm oil'],
      [/\bleite de coco\b/gi, 'rich velvety coconut milk'],
      [/\bgeleia de pimenta da casa\b/gi, 'sweet and spicy house chili pepper jam'],
      [/\bgeleia de cebola\b/gi, 'caramelized sweet onion relish'],
      [/\bmaionese artesanal da casa\b/gi, 'fresh homemade seasoned herb aioli'],
      [/\bmaionese artesanal\b/gi, 'house artisanal garlic mayo'],
      [/\bmolho especial\b/gi, 'signature chef dressing'],
      [/\bmolho da casa\b/gi, 'house signature sauce'],
      [/\bazeite e ervas\b/gi, 'extra virgin olive oil and fresh herbs'],
      [/\bpão terra e mar\b/gi, 'artisanal crusty Terra & Mar bread'],
      [/\bpão baguete tostado na brasa\b/gi, 'charcoal-toasted crusty baguette'],
      [/\bcreme artesanal de alho\b/gi, 'rich whipped artisanal garlic cream'],
      [/\bfinas ervas\b/gi, 'aromatic fine garden herbs'],

      // Sweets & Desserts
      [/\bdelicioso doce de leite\b/gi, 'rich artisanal Brazilian dulce de leche'],
      [/\bdoce de leite\b/gi, 'golden dulce de leche'],
      [/\bpudim de leite\b/gi, 'Brazilian condensed milk caramel flan'],
      [/\bmassa folheada crocante recheada com creme à base de ovos\b/gi, 'flaky golden puff pastry filled with velvety egg custard cream'],
      [/\btextura aerada e sabor marcante da amazônia\b/gi, 'fluffy airy texture with the bright, exotic aroma of the Amazon'],
      [/\bcreme de cupuaçu com ganache\b/gi, 'rich cupuaçu fruit cream layered with dark chocolate ganache'],
      [/\bcupuaçu\b/gi, 'Amazonian cupuaçu superfruit'],
      [/\bmaracujá\b/gi, 'wild Brazilian passion fruit'],
      [/\bganache e castanha do pará laminada\b/gi, 'velvety dark chocolate ganache and sliced Brazil nuts'],
      [/\bganache\b/gi, 'rich dark chocolate ganache'],
      [/\bchocolate 70%\b/gi, 'intense 70% dark artisanal chocolate'],

      // Drinks
      [/\bcaneca congelada a -2°c\b/gi, 'frosted glass mug chilled at sub-zero -2°C'],
      [/\bcaneca congelada\b/gi, 'heavy frosted mug'],
      [/\bserpentina regulada e colarinho cremoso com 2 dedos de espuma\b/gi, 'precision calibrated draft system with a thick, velvety 2-finger foam head'],
      [/\bcolarinho cremoso\b/gi, 'dense velvety foam head'],
      [/\bchopp servido\b/gi, 'freshly pulled draft beer served'],
      [/\bcachaça artesanal\b/gi, 'copper-pot artisanal sugarcane cachaça'],
      [/\blimão fresco\b/gi, 'freshly squeezed juicy lime'],
      [/\blimões frescos\b/gi, 'fresh hand-muddled limes'],
      [/\badega climatizada\b/gi, 'temperature-controlled wine cellar'],
      [/\bvinho fino selecionado\b/gi, 'fine curated wine'],
      [/\btaça de cristal\b/gi, 'crystal stemware glass'],
      [/\bnotas frutadas e boa cremosidade\b/gi, 'expressive fruit notes with fine bubbles and creamy mouthfeel'],
      [/\bborbulhas finas e persistentes\b/gi, 'fine, persistent effervescent bubbles']
    ];

    for (const [reg, val] of rep) {
      out = out.replace(reg, val);
    }

    // Capitalize first letter
    out = out.charAt(0).toUpperCase() + out.slice(1);
    if (!out.endsWith('.')) out += '.';
    return out + nutSuffix;
  } else {
    // SPANISH TRANSLATIONS
    const rep = [
      [/\bcostela de tambaqui de cativeiro\b/gi, 'costillas de tambaquí amazónico criado en cautiverio sustentable'],
      [/\bcostela de tambaqui\b/gi, 'costillas de tambaquí amazónico'],
      [/\bcostela bovina desfiada\b/gi, 'costilla de res deshebrada'],
      [/\bcostela bovina\b/gi, 'costillas de res tiernas'],
      [/\bfilé alto de pirarucu de manejo\b/gi, 'lomo grueso de pirarucú amazónico sustentable'],
      [/\bfilé de pirarucu\b/gi, 'filete de pirarucú amazónico'],
      [/\bpirarucu de manejo\b/gi, 'pirarucú amazónico sustentable'],
      [/\bpirarucu\b/gi, 'pirarucú amazónico'],
      [/\btambaqui\b/gi, 'tambaquí amazónico'],
      [/\bcarne de sol maturada artesanalmente\b/gi, 'carne de sol madurada artesanalmente'],
      [/\bcarne de sol\b/gi, 'carne curada tradicional'],
      [/\bcarne seca\s*\(charque\)\b/gi, 'carne seca deshebrada'],
      [/\bcarne seca\b/gi, 'carne seca brasileña'],
      [/\bcharque\b/gi, 'carne seca salada'],
      [/\bpicanha\b/gi, 'picanha noble a las brasas'],
      [/\bbife de chorizo\b/gi, 'bife de chorizo Angus'],
      [/\bchourizo\b/gi, 'bife de chorizo Angus'],
      [/\bchouriço\b/gi, 'embutido de cerdo artesanal'],
      [/\bancho\b/gi, 'ojo de bife ancho Angus'],
      [/\bfilé mignon\b/gi, 'medallón de lomo fino'],
      [/\bfilé com fritas\b/gi, 'tiras de lomo con papas fritas'],
      [/\bfilé\b/gi, 'lomo tierno de res'],
      [/\bcamarões levemente salteados\b/gi, 'camarones salteados con delicadeza'],
      [/\bcamarões\b/gi, 'camarones jugosos'],
      [/\bcamarão\b/gi, 'camarón'],
      [/\bfrango grelhado\b/gi, 'pechuga de pollo a la plancha'],
      [/\bfrango\b/gi, 'pollo'],
      [/\bjoelho de porco\b/gi, 'codillo ahumado de cerdo'],
      [/\blinguiça defumada\b/gi, 'longaniza ahumada'],
      [/\blinguiça\b/gi, 'embutido artesanal'],
      [/\bbacon crocante\b/gi, 'tocino crujiente'],
      [/\bbacon\b/gi, 'tocino'],
      [/\btorresmo\b/gi, 'chicharrón crujiente de cerdo'],
      [/\bbarriga cozida lentamente\b/gi, 'panceta cocinada a fuego lento'],
      [/\bbarriga de porco\b/gi, 'panceta de cerdo'],
      [/\bpernil\b/gi, 'pernil deshebrado a fuego lento'],
      [/\bmortadela italiana\b/gi, 'mortadela italiana en lonchas finas'],
      [/\bpastrami de peito de boi\b/gi, 'pastrami ahumado y sazonado de res'],
      [/\bpastrami\b/gi, 'pastrami ahumado'],
      [/\bjamon espanhol\b/gi, 'jamón curado español'],
      [/\bjamon\b/gi, 'jamón curado'],
      [/\bazeitonas verdes sem caroço\b/gi, 'aceitunas verdes deshuesadas y aliñadas'],
      [/\bazeitonas\b/gi, 'aceitunas'],
      [/\bcorações de galinha\b/gi, 'corazones tiernos de pollo'],
      [/\bcoraçãozinho de galinha\b/gi, 'corazones de pollo a la brasa'],

      // Textures & cooking methods
      [/\bassada lentamente na brasa de carvão\b/gi, 'asada a fuego lento sobre brasas de carbón vegetal'],
      [/\bassada na brasa\b/gi, 'asada a las brasas'],
      [/\bassado na brasa\b/gi, 'asado a la perfección en la parrilla'],
      [/\bassado lentamente\b/gi, 'asado lentamente'],
      [/\bpassadas na manteiga\b/gi, 'salteadas en mantequilla'],
      [/\bgrelhado com manteiga de garrafa\b/gi, 'a la parrilla con mantequilla clarificada de botella'],
      [/\bgrelhado\b/gi, 'a la parrilla'],
      [/\bgrelhada\b/gi, 'a la parrilla'],
      [/\bgrelhadas\b/gi, 'a la parrilla'],
      [/\bgrelhados\b/gi, 'a la parrilla'],
      [/\bcrocante por fora, macio por dentro\b/gi, 'crujiente por fuera y suave y tierno por dentro'],
      [/\bcrocante por fora e macio por dentro\b/gi, 'crujiente por fuera y tierno por dentro'],
      [/\bcrocante\b/gi, 'crujiente'],
      [/\bempanada na farinha panko\b/gi, 'empanizada en panko japonés crujiente'],
      [/\bempanado na farinha panko\b/gi, 'empanizado en panko japonés crujiente'],
      [/\bempanadas na farinha panko\b/gi, 'empanizadas en panko crujiente'],
      [/\bempanada\b/gi, 'dorada y empanizada'],
      [/\bempanadas\b/gi, 'empanizadas'],
      [/\bempanado\b/gi, 'empanizado'],
      [/\bcozida lentamente\b/gi, 'estofada a fuego lento'],
      [/\bcozido lentamente\b/gi, 'cocido a fuego lento'],
      [/\bcozido\b/gi, 'cocido'],
      [/\bcozida\b/gi, 'cocida'],
      [/\bfrita na hora\b/gi, 'recién frita al momento'],
      [/\bfrito\b/gi, 'dorado y frito'],
      [/\bfrita\b/gi, 'dorada y frita'],
      [/\bfritas\b/gi, 'crujientes y fritas'],
      [/\bpururucada\b/gi, 'dorada hasta quedar crujiente como chicharrón'],
      [/\bpururuca\b/gi, 'chicharrón crujiente'],
      [/\bmoqueada\b/gi, 'guisada en cazuela de barro al estilo moqueca'],
      [/\bgratinado com queijo\b/gi, 'gratinado con queso dorado'],
      [/\bgratinado\b/gi, 'gratinado al horno'],

      // Sides & regional
      [/\bfarofa de uarini crocante\b/gi, 'harina tostada crujiente de Uarini'],
      [/\bfarofa de uarini\b/gi, 'farofa de Uarini crujiente'],
      [/\bfarofa de banana\b/gi, 'farofa con plátano dulce'],
      [/\bfarofa de coco\b/gi, 'farofa con coco tostado'],
      [/\bfarofa de castanhas\b/gi, 'farofa con castañas de Pará'],
      [/\bfarofa crocante de brownie\b/gi, 'crumble crujiente de brownie'],
      [/\bfarofa\b/gi, 'farofa tostada tradicional'],
      [/\bvinagrete regional\b/gi, 'vinagreta fresca con hierbas amazónicas'],
      [/\bvinagrete de feijão manteiguinha\b/gi, 'vinagreta con frijol manteiguinha de Santarém'],
      [/\bvinagrete\b/gi, 'vinagreta fresca con tomate y hierbas'],
      [/\barroz paraense\b/gi, 'arroz al estilo Pará con jambú'],
      [/\barroz integral 7 grãos\b/gi, 'arroz integral 7 granos nutritivo'],
      [/\barroz branco\b/gi, 'arroz blanco suelto'],
      [/\barroz\b/gi, 'arroz'],
      [/\bbaião de dois cremoso puxado no queijo coalho\b/gi, 'cremoso baião de dois (arroz y frijoles) con queso coalho fundido'],
      [/\bbaião de dois cremoso\b/gi, 'cremoso baião de dois con queso fundido'],
      [/\bbaião cremoso\b/gi, 'cremoso baião de dois con queso'],
      [/\bbaião de dois\b/gi, 'baião de dois tradicional'],
      [/\bqueijo coalho\b/gi, 'queso coalho brasileño'],
      [/\bqueijo do reino\b/gi, 'queso reino maduro'],
      [/\bqueijo mussarela\b/gi, 'queso mozzarella fundido'],
      [/\bmussarela\b/gi, 'mozzarella'],
      [/\bmacaxeira amarela regional\b/gi, 'yuca amarilla amazónica recién cocida'],
      [/\bmacaxeira crocante\b/gi, 'yuca frita crujiente'],
      [/\bmacaxeira frita\b/gi, 'papas de yuca doradas y fritas'],
      [/\bmacaxeira\b/gi, 'yuca amazónica'],
      [/\bmandioca\b/gi, 'yuca tierna'],
      [/\bbatatas rústicas\b/gi, 'papas rústicas doradas'],
      [/\bbatata rústica\b/gi, 'papas rústicas'],
      [/\bbatatas fritas\b/gi, 'papas fritas crujientes'],
      [/\bbatata frita\b/gi, 'papas fritas doradas'],
      [/\bpurê de batatas\b/gi, 'puré suave de papas'],
      [/\bpurê de macaxeira\b/gi, 'puré aterciopelado de yuca'],
      [/\blegumes da estação\b/gi, 'vegetales frescos de temporada'],
      [/\blegumes selecionados também grelhados\b/gi, 'vegetales selectos asados a la parrilla'],
      [/\blegumes grelhados\b/gi, 'vegetales a la plancha'],
      [/\blegumes\b/gi, 'vegetales'],
      [/\bfolhas de jambu\b/gi, 'hojas silvestres de jambú amazónico'],
      [/\bjambu\b/gi, 'jambú amazónico'],
      [/\brisoto cremoso de tucupi\b/gi, 'risotto cremoso bañado en reducción de tucupí amazónico'],
      [/\btucupi\b/gi, 'caldo aromático de tucupí'],
      [/\bcrosta crocante de castanha-do-pará ralada e ervas\b/gi, 'costra crujiente de castaña de Pará rallada y finas hierbas'],
      [/\bcastanha-do-pará\b/gi, 'castañas de Pará amazónicas'],
      [/\bcastanha do pará\b/gi, 'castañas de Pará'],
      [/\bcastanhas selecionadas\b/gi, 'castañas selectas tostadas'],
      [/\bcastanha\b/gi, 'castañas de Pará'],
      [/\bbanana pacovã\b/gi, 'plátano macho pacovã amazónico'],
      [/\bbanana da terra\b/gi, 'plátano macho maduro'],
      [/\bbanana caramelizada\b/gi, 'plátano caramelizado naturalmente'],
      [/\bmolho da casa com dendê\b/gi, 'salsa de la casa con aromático aceite de dendê'],
      [/\bazeite de dendê\b/gi, 'aceite aromático de palma dendê'],
      [/\bleite de coco\b/gi, 'leche cremosa de coco'],
      [/\bgeleia de pimenta da casa\b/gi, 'mermelada agridulce de ají de la casa'],
      [/\bgeleia de cebola\b/gi, 'chutney de cebolla caramelizada'],
      [/\bmaionese artesanal da casa\b/gi, 'mayonesa casera con hierbas frescas'],
      [/\bmaionese artesanal\b/gi, 'mayonesa artesanal'],
      [/\bmolho especial\b/gi, 'aderezo especial de la casa'],
      [/\bmolho da casa\b/gi, 'salsa exclusiva de la casa'],
      [/\bazeite e ervas\b/gi, 'aceite de oliva virgen extra y hierbas aromáticas'],
      [/\bpão terra e mar\b/gi, 'pan artesanal crujiente Terra & Mar'],
      [/\bpão baguete tostado na brasa\b/gi, 'pan baguette tostado a la brasa'],
      [/\bcreme artesanal de alho\b/gi, 'crema suave de ajo artesanal'],
      [/\bfinas ervas\b/gi, 'finas hierbas aromáticas'],

      // Sweets
      [/\bdelicioso doce de leite\b/gi, 'dulce de leche artesanal cremoso'],
      [/\bdoce de leite\b/gi, 'dulce de leche'],
      [/\bpudim de leite\b/gi, 'flan casero de leche condensada'],
      [/\bmassa folheada crocante recheada com creme à base de ovos\b/gi, 'hojaldre dorado crujiente relleno de crema suave de yemas'],
      [/\btextura aerada e sabor marcante da amazônia\b/gi, 'textura aireada con el inconfundible aroma del copoazú amazónico'],
      [/\bcreme de cupuaçu com ganache\b/gi, 'crema de copoazú con ganache de chocolate semiamargo'],
      [/\bcupuaçu\b/gi, 'copoazú silvestre amazónico'],
      [/\bmaracujá\b/gi, 'maracuyá fresca'],
      [/\bganache e castanha do pará laminada\b/gi, 'ganache de chocolate y láminas de castaña de Pará'],
      [/\bganache\b/gi, 'ganache de chocolate'],
      [/\bchocolate 70%\b/gi, 'chocolate semiamargo 70% cacao'],

      // Drinks
      [/\bcaneca congelada a -2°c\b/gi, 'tarro congelado a -2°C bajo cero'],
      [/\bcaneca congelada\b/gi, 'tarro helado'],
      [/\bserpentina regulada e colarinho cremoso com 2 dedos de espuma\b/gi, 'serpentín calibrado y espuma densa y cremosa de 2 dedos'],
      [/\bcolarinho cremoso\b/gi, 'espuma densa y cremosa'],
      [/\bchopp servido\b/gi, 'cerveza de barril recién tirada'],
      [/\bcachaça artesanal\b/gi, 'cachaça artesanal de alambique de cobre'],
      [/\blimão fresco\b/gi, 'lima fresca exprimida'],
      [/\blimões frescos\b/gi, 'limas frescas machacadas'],
      [/\badega climatizada\b/gi, 'cava climatizada a temperatura perfecta'],
      [/\bvinho fino selecionado\b/gi, 'vino fino seleccionado'],
      [/\btaça de cristal\b/gi, 'copa de cristal'],
      [/\bnotas frutadas e boa cremosidade\b/gi, 'notas a frutas frescas, burbujas finas y gran cremosidad'],
      [/\bborbulhas finas e persistentes\b/gi, 'burbujas finas y persistentes']
    ];

    for (const [reg, val] of rep) {
      out = out.replace(reg, val);
    }

    out = out.charAt(0).toUpperCase() + out.slice(1);
    if (!out.endsWith('.')) out += '.';
    return out + nutSuffix;
  }
}

// Test sample translations
const samplePT = 'Filé de pirarucu grelhado, acompanhado de legumes selecionados também grelhados, e finalizado com azeite e ervas. Calorias: 420kcal Valor proteico: 42g Fibras: 5g';
console.log('Sample Translation EN:');
console.log(translateCulinaryDesc(samplePT, {}, 'en'));
console.log('Sample Translation ES:');
console.log(translateCulinaryDesc(samplePT, {}, 'es'));
