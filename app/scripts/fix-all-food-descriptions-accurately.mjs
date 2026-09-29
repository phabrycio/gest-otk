import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));

// Accurate, faithful culinary translations for all Dion food items (1 to 150)
const ACCURATE_DION_TRANSLATIONS = {
  // 001 - 020: Saladas & Fitness
  "dish-dion-001": {
    en: "Crisp garden greens, vine-ripened tomatoes, red onions, and fresh seasonal tropical fruit, drizzled with our signature house herb vinaigrette.",
    es: "Mix de hojas frescas de huerto, tomates maduros, cebolla roja y frutas tropicales de temporada con aderezo especial de la casa."
  },
  "dish-dion-002": {
    en: "Individual lunch salad: fresh garden lettuce, vine tomatoes, red onion rings, and seasonal fruit with house dressing.",
    es: "Ensalada individual de almuerzo: lechugas frescas, tomates, cebolla roja y fruta fresca de estación con vinagreta de la casa."
  },
  "dish-dion-003": {
    en: "Traditional Bahia-style chicken vatapá: smooth, rich paste of bread, coconut milk, roasted cashews, peanuts, and dendê palm oil, served with white rice.",
    es: "Vatapá tradicional bahiano de pollo: crema suave y densa de leche de coco, castañas de cajú, cacahuate y aceite de dendê, con arroz blanco."
  },
  "dish-dion-004": {
    en: "Northeastern sun-cured beef seared in clarified bottle butter, served with creamy baião de dois, cassava farofa, and fresh vinaigrette.",
    es: "Carne de sol típica del nordeste salteada en mantequilla de botella, con cremoso baião de dois, farofa de yuca y vinagreta fresca."
  },
  "dish-dion-005": {
    en: "Crisp golden fillet of local Amazonian fish, served with white rice, pirão broth, and farofa.",
    es: "Filete dorado y crujiente de pescado amazónico, acompañado de arroz blanco, caldo pirão y farofa."
  },
  "dish-dion-006": {
    en: "Tender chicken breast strips sautéed with garden vegetables, accompanied by white rice and homestyle black beans.",
    es: "Tiras jugosas de pechuga de pollo salteadas con verduras de la huerta, con arroz blanco y frijoles negros caseros."
  },
  "dish-dion-007": {
    en: "Homestyle minced beef braised in aromatic herbs and fresh tomato gravy, served with fluffy white rice and black beans.",
    es: "Carne picada de res estofada en salsa casera de tomates y hierbas aromáticas, con arroz blanco y frijoles negros."
  },
  "dish-dion-008": {
    en: "Tender beef steak simmered with caramelized sweet onions, served with white rice, black beans, and farofa.",
    es: "Bistec tierno de res encebollado con cebollas dulces caramelizadas, con arroz blanco, frijoles negros y farofa."
  },
  "dish-dion-009": {
    en: "Tender chicken breast fillet pan-seared with golden sweet onions, accompanied by white rice, black beans, and salad.",
    es: "Filete de pechuga de pollo a la plancha con cebolla dorada, acompañado de arroz blanco, frijoles negros y ensalada."
  },
  "dish-dion-010": {
    en: "Seasoned lean ground beef meatballs simmered in slow-cooked pomodoro sauce, served over al dente pasta or white rice.",
    es: "Albóndigas caseras de res en salsa pomodoro rústica de tomates maduros, servidas sobre pasta o arroz blanco."
  },
  "dish-dion-011": {
    en: "Fluffy 3-egg omelet filled with fresh diced tomatoes, melting cheese, and garden herbs, served with a light side salad.",
    es: "Tortilla francesa jugosa de 3 huevos de granja rellena de queso derretido, tomate y finas hierbas, con ensalada fresca."
  },
  "dish-dion-012": {
    en: "Crispy breaded and golden-fried fish fillet, served with lemon wedges, tartar sauce, white rice, and pirão.",
    es: "Filete de pescado empanizado y frito crujiente, servido con rodajas de limón, salsa tártara, arroz blanco y pirão."
  },
  "dish-dion-013": {
    en: "Golden breaded chicken breast cutlet baked under marinara sauce and melted mozzarella, served with fries and white rice.",
    es: "Milanesa de pollo dorada gratinada al horno con salsa marinara y queso mozzarella derretido, con papas fritas y arroz."
  },
  "dish-dion-014": {
    en: "Crispy breaded beef steak cutlet gratineed with rich pomodoro sauce and bubbling melted cheese, served with fries and rice.",
    es: "Milanesa de carne vacuna a la napolitana gratinada con salsa de tomate casera y queso derretido, con papas y arroz."
  },
  "dish-dion-015": {
    en: "Grilled beef striploin steak cooked to order, served with seasoned black beans, white rice, house farofa, and vinaigrette.",
    es: "Bife de res a la parrilla servido al gusto, acompañado de frijoles negros, arroz blanco, farofa tradicional y vinagreta."
  },
  "dish-dion-016": {
    en: "Grilled tender chicken breast with fresh herb butter, accompanied by steamed white rice, seasoned black beans, and salad.",
    es: "Pechuga de pollo a la plancha con mantequilla de hierbas, acompañada de arroz blanco, frijoles negros y ensalada verde."
  },
  "dish-dion-017": {
    en: "Succulent charcoal-grilled pork loin steak seasoned with lime and garlic, served with tutu beans, white rice, and collard greens.",
    es: "Lomo de cerdo jugoso asado a la brasa con ajo y lima, servido con tutu de frijoles, arroz blanco y col verde salteada."
  },
  "dish-dion-018": {
    en: "Tender flame-grilled Amazonian pirarucu fillet, accompanied by grilled seasonal garden vegetables, finished with extra virgin olive oil and herbs (420 kcal | 42g protein | 5g fiber).",
    es: "Filete de pirarucú amazónico a la parrilla con verduras de temporada asadas, aceite de oliva virgen y finas hierbas (420 kcal | 42g proteína | 5g fibra)."
  },
  "dish-dion-019": {
    en: "Select lean prime beef steak grilled over natural coals, served with tender steamed vegetables and a crisp fresh salad (550 kcal | 45g protein | 4g fiber).",
    es: "Corte magro de carne vacuna a la brasa con hortalizas al vapor y ensalada fresca crujiente (550 kcal | 45g proteína | 4g fibra)."
  },
  "dish-dion-020": {
    en: "Wholesome 7-grain brown rice served with tender grilled chicken breast, seasonal vegetables, and a light Brazil nut farofa (520 kcal | 38g protein | 9g fiber).",
    es: "Bowl saludable de arroz integral de 7 granos con pechuga de pollo a la plancha, vegetales de estación y farofa ligera de castañas (520 kcal | 38g proteína | 9g fibra)."
  },
  "dish-dion-021": {
    en: "A lighter, velvety balance of the classic Bahian shrimp bobó, gently simmered in cassava cream and coconut milk with mild regional peppers (480 kcal | 28g protein | 4g fiber).",
    es: "Versión ligera del clásico bobó de camarones, cocinado a fuego lento en suave crema de yuca, leche de coco y aromáticos regionales (480 kcal | 28g proteína | 4g fibra)."
  },

  // 024 - 055: Entradas, Petiscos & Copinhos
  "dish-dion-024": {
    en: "Paper-thin slices of cold-smoked Amazonian pirarucu loin, drizzled with extra virgin olive oil, fresh Sicilian lemon juice, aromatic garden herbs, and pink peppercorns (189 kcal | 26g protein | 1g fiber).",
    es: "Láminas ultrafinas de lomo de pirarucú ahumado en frío con aceite de oliva virgen extra, limón siciliano, hierbas frescas y pimienta rosa (189 kcal | 26g proteína | 1g fibra)."
  },
  "dish-dion-025": {
    en: "Warm artisanal Terra & Mar crusty bread served with a chef's duo of fresh gourmet antipasti spreads.",
    es: "Pan crujiente artesanal Terra & Mar recién horneado servido con un dúo especial de patés y antipastos caseros."
  },
  "dish-dion-027": {
    en: "Tender shredded beef ribs folded into their own rich pan reduction, breaded in crispy panko and fried golden; served with homemade watermelon jam.",
    es: "Costilla de res desmechada cocinada en su propia reducción, rebozada en panko crujiente y frita dorada; servida con jalea artesanal de sandía."
  },
  "dish-dion-028": {
    en: "Chef's tasting trio: flame-grilled sun-cured beef, succulent slow-cooked pork shank flakes, and crispy tambaqui ribs, glazed with sweet and smoky cupuaçu barbecue sauce.",
    es: "Trío degustación del chef: carne seca a la brasa, lascas jugosas de codillo de cerdo y costillitas de tambaquí crujientes, glaseadas con salsa barbacoa de copoazú."
  },
  "dish-dion-029": {
    en: "Beer-marinated wild shrimps lightly battered and fried to golden crispness, served with a zesty, cooling green herb aioli dip.",
    es: "Camarones marinados en cerveza rubia, ligeramente rebozados y fritos crujientes, acompañados de un refrescante alioli verde de hierbas."
  },
  "dish-dion-033": {
    en: "Heaping platter of tender wild shrimps flash-sautéed in extra virgin olive oil with crispy golden garlic chips, fresh lime wedges, and house beer reduction sauce.",
    es: "Fuente generosa de camarones salteados al ajillo en aceite de oliva con láminas de ajo dorado crujiente, limón fresco y salsa especial a la cerveza."
  },
  "dish-dion-034": {
    en: "A 15-year house classic: tender strips of artisanal sun-cured beef seared in bottle butter, accompanied by crispy cassava croquettes and golden fried coalho cheese.",
    es: "Clásico de la casa desde hace 15 años: tiras tiernas de carne de sol salteadas en mantequilla de botella, con croquetas crujientes de yuca y queso coalho frito."
  },
  "dish-dion-042": {
    en: "The Grand Engenho Platter: butter-seared tenderloin strips, smoked artisan sausages, smoked pork ribs, crispy cassava croquettes, Italian salami, green olives, and fresh salad.",
    es: "Tabla Completa do Engenho: tiras de lomo a la mantequilla, longanizas y costillas de cerdo ahumadas, croquetas de yuca, salami, aceitunas y ensalada."
  },
  "dish-dion-043": {
    en: "Crispy fried Amazonian pirarucu fillet strips accompanied by crunchy green plantain chips and house sweet-and-sour cupuaçu fruit reduction.",
    es: "Tiras crujientes de filete de pirarucú amazónico frito con chips de plátano verde y jalea artesanal agridulce de copoazú."
  },
  "dish-dion-045": {
    en: "Tender prime beef tenderloin strips sautéed in butter with sweet onion petals and green olives, served with crispy french fries and crusty Italian bread.",
    es: "Tiras tiernas de lomo de res salteadas a la mantequilla con pétalos de cebolla y aceitunas, servidas con papas fritas y pan crujiente."
  },
  "dish-dion-051": {
    en: "Tasting shot of traditional Minas Gerais 'Vaca Atolada': velvety stew of yellow cassava root and succulent slow-braised beef ribs simmered with herbs.",
    es: "Chupito de degustación de 'Vaca Atolada' tradicional: estofado espeso de yuca y costilla jugosa de res cocida a fuego lento con especias de Minas Gerais."
  },
  "dish-dion-052": {
    en: "Portion of crispy golden Brazilian mini pastries made with handmade flaky dough, stuffed with melted northeastern coalho cheese.",
    es: "Porción de mini empanadas crujientes de masa casera hojaldrada, rellenas de auténtico queso coalho nordestino derretido."
  },
  "dish-dion-053": {
    en: "Portion of crispy golden mini pastries filled with juicy shredded sun-cured beef braised in clarified bottle butter and red onions.",
    es: "Porción de mini empanadas crujientes rellenas de jugosa carne de sol desmechada, rehogada en mantequilla de botella y cebolla morada."
  },
  "dish-dion-055": {
    en: "Portion of crispy golden mini pastries stuffed with authentic shredded Portuguese codfish, black olives, extra virgin olive oil, and fresh parsley.",
    es: "Porción de mini empanadas crujientes rellenas de bacalao portugués desmigado con aceitunas negras, aceite de oliva virgen y perejil."
  },

  // 060 - 065: Pizzas
  "dish-dion-060": {
    en: "Large artisan pizza with slow-cooked house tomato sauce, melted mozzarella, sliced smoky calabresa sausage, sweet onions, and oregano.",
    es: "Pizza grande artesanal con salsa de tomate de la casa, queso mozzarella fundido, chorizo calabresa ahumado, cebolla y orégano."
  },
  "dish-dion-061": {
    en: "Large artisan pizza with slow-cooked house tomato sauce, generous double melted mozzarella cheese, and fragrant dried oregano.",
    es: "Pizza grande artesanal con salsa casera de tomate, doble capa generosa de queso mozzarella derretido y orégano aromático."
  },
  "dish-dion-062": {
    en: "Large artisan pizza with house tomato sauce, melted mozzarella, shredded sun-cured beef sautéed with onions in bottle butter, and oregano.",
    es: "Pizza grande artesanal con salsa de tomate, mozzarella fundida, jugosa carne de sol desmechada encebollada y orégano."
  },

  // 071 - 075: Kids & Escondidinhos
  "dish-dion-072": {
    en: "Kids hand-breaded prime beef tenderloin medallion, fried crispy golden and tender inside; choose up to 3 sides (rice, angel hair pasta, purée, fries, or beans).",
    es: "Milanesa infantil de tierno filete mignon de res rebozado y frito dorado; elige hasta 3 guarniciones (arroz, cabello de ángel, puré, papas o frijoles)."
  },
  "dish-dion-073": {
    en: "Kids tender grilled prime beef tenderloin strips seared with butter; choose up to 3 sides (fluffy rice, angel hair pasta, potato purée, fries, or beans).",
    es: "Tiras tiernas de filete mignon de res a la plancha con mantequilla; elige hasta 3 guarniciones (arroz blanco, cabello de ángel, puré, papas o frijoles)."
  },
  "dish-dion-075": {
    en: "Cast-iron skillet shepherd's pie: shredded sun-cured beef braised with smoky bacon, sweet onions, and a touch of rich roti gravy under a creamy cassava purée gratin.",
    es: "Escondidinho en caldero de hierro: carne de sol desmechada salteada con tocino, cebolla y un toque de salsa roti bajo puré suave de yuca gratinado."
  },
  "dish-dion-077": {
    en: "Cast-iron skillet shepherd's pie: succulent diced prime picanha sautéed with golden onions, baked under creamy cassava purée and melted cheese.",
    es: "Escondidinho en caldero de hierro: dados jugosos de picanha de res salteados con cebolla bajo suave puré de yuca y queso gratinado."
  },

  // 081 - 107: Pratos Principais, Carnes & Pescados
  "dish-dion-081": {
    en: "Special bone-in prime pork ribeye chop (Prime Rib Suíno) flame-grilled on charcoal, accompanied by hearty feijão tropeiro and white rice (serves 2).",
    es: "Corte especial de chuletón de cerdo a la brasa con hueso (Prime Rib), servido con frijol tropeiro y arroz blanco (para 2 personas)."
  },
  "dish-dion-083": {
    en: "Savory slow-cooked ragú of artisanal crispy sausage and fresh spinach, served over velvety creamy polenta with white rice (serves 2).",
    es: "Ragú tradicional de embutido crujiente con espinacas frescas sobre polenta suave y cremosa, acompañado de arroz blanco (para 2 personas)."
  },
  "dish-dion-085": {
    en: "Boneless chicken thigh stuffed with ham and melted mozzarella, roasted golden and served alongside durum wheat tagliatelle pasta in rich béchamel cream sauce.",
    es: "Contramuslo de pollo deshuesado relleno de jamón y queso derretido, acompañado de pasta tagliatelle al dente en salsa blanca cremosa."
  },
  "dish-dion-086": {
    en: "Succulent Amazonian pirarucu loin encrusted with crunchy toasted Brazil nuts, baked golden and accompanied by zesty Sicilian lemon risotto.",
    es: "Lomo jugoso de pirarucú amazónico con costra crujiente de castañas de Pará, horneado y servido con cremoso risotto de limón siciliano."
  },
  "dish-dion-088": {
    en: "Boneless Black Angus beef short rib pressed and slow-roasted for 6 hours at low temperature until meltingly tender; served with broccoli rice, creamy potato salad, farofa, and fried cheese (serves 2).",
    es: "Costillón deshuesado Black Angus prensado y asado durante 6 horas a baja temperatura hasta deshacerse; servido con arroz con brócoli, ensaladilla de papas, farofa y queso frito (para 2 personas)."
  },
  "dish-dion-089": {
    en: "Prime beef tenderloin medallion seared in butter, accompanied by creamy Piemontese rice (with cream, parmesan, and mushrooms), french fries, and egg farofa.",
    es: "Medallón de filete mignon salteado a la mantequilla, acompañado de arroz a la piamontesa con crema y champiñones, papas fritas y farofa de huevos."
  },
  "dish-dion-090": {
    en: "Marinated chicken breast cutlet breaded crispy, topped with slow-simmered homemade tomato sauce and bubbling melted mozzarella; served with garlic and olive oil fettuccine.",
    es: "Pechuga de pollo marinada y empanizada, cubierta con salsa de tomate casera y queso mozzarella gratinado, con fettuccine al ajillo en aceite de oliva."
  },
  "dish-dion-091": {
    en: "Tender chicken breast fillets seared on a sizzling iron griddle with butter, soy glaze, sliced onions, green bell peppers, and fresh tomatoes; served with mashed potatoes, rice, and farofa (serves 2).",
    es: "Filetes de pechuga de pollo a la plancha de hierro con mantequilla, toque de soja, cebolla, pimientos y tomates; servidos con puré de papas, arroz y farofa (para 2 personas)."
  },
  "dish-dion-092": {
    en: "Artisanal sun-cured beef slow-roasted to maximum tenderness, served with your choice of broccoli rice or creamy baião de dois, cassava fritters, creamy potato salad, grilled coalho cheese, crispy farofa, and vinaigrette (single portion).",
    es: "Carne de sol artesanal asada lentamente para máxima ternura, servida con arroz con brócoli o baião de dois cremoso, croquetas de yuca, ensaladilla de papas, queso coalho a la plancha, farofa y vinagreta (1 persona)."
  },
  "dish-dion-093": {
    en: "Artisanal sun-cured beef slow-roasted to maximum tenderness, served with broccoli rice or creamy baião de dois, cassava fritters, creamy potato salad, grilled coalho cheese, crispy farofa, and vinaigrette (serves 2).",
    es: "Carne de sol artesanal asada lentamente para máxima ternura, servida con arroz con brócoli o baião de dois cremoso, croquetas de yuca, ensaladilla de papas, queso coalho a la plancha, farofa y vinagreta (para 2 personas)."
  },
  "dish-dion-094": {
    en: "Artisanal sun-cured beef slow-roasted to maximum tenderness, served with broccoli rice or creamy baião de dois, cassava fritters, creamy potato salad, grilled coalho cheese, crispy farofa, and vinaigrette (serves 3).",
    es: "Carne de sol artesanal asada lentamente para máxima ternura, servida con arroz con brócoli o baião de dois cremoso, croquetas de yuca, ensaladilla de papas, queso coalho a la plancha, farofa y vinagreta (para 3 personas)."
  },
  "dish-dion-095": {
    en: "Prime tambaqui rib and loin cut grilled on charcoal, served with Amazonian tucupi and jambú rice, and sweet plantain farofa.",
    es: "Costilla y lomo de tambaquí asados a la brasa, servidos con arroz aromático de tucupí y jambú, y farofa de plátano dulce."
  },
  "dish-dion-096": {
    en: "Sustainable Amazonian pirarucu fillet grilled on a sizzling flat-top griddle, served with fluffy white rice, beach cowpeas, fresh vinaigrette, and toasted farofa (serves 2).",
    es: "Filete de pirarucú amazónico a la plancha caliente, acompañado de arroz blanco, frijoles de playa, vinagreta fresca y farofa tostada (para 2 personas)."
  },
  "dish-dion-097": {
    en: "Whole smoked half-side of Amazonian tambaqui (Banda de Tambaqui Defumada), served with rich Brazil nut risotto and crispy Uarini farofa tossed with Tutóia dry shrimps (serves 3).",
    es: "Banda entera de tambaquí amazónico ahumada a la perfección, servida con risotto cremoso de castañas de Pará y farofa crujiente de Uarini con camarones de Tutóia (para 3 personas)."
  },
  "dish-dion-098": {
    en: "Whole smoked pork shank slow-roasted until crackling crisp (pururuca), served with white rice, traditional Minas tutu beans, crispy collard greens, and golden fried polenta (serves 3).",
    es: "Codillo entero de cerdo ahumado asado con piel crujiente pururuca, servido con arroz blanco, puré tutu de frijoles a la mineira, col frita crujiente y polenta dorada (para 3 personas)."
  },
  "dish-dion-099": {
    en: "Slow-smoked pork ribs braised in sweet and tangy barbecue glaze until falling off the bone, served with golden rustic potato wedges (serves 2).",
    es: "Costillas de cerdo ahumadas lentamente y bañadas en salsa barbacoa agridulce hasta quedar tiernas al hueso, con papas rústicas doradas (para 2 personas)."
  },
  "dish-dion-100": {
    en: "Shredded salted codfish sautéed in olive oil with onions and garlic, layered with diced potatoes and rich four-cheese béchamel cream, gratineed with parmesan; served with white rice.",
    es: "Bacalao desmigado salteado en aceite de oliva con cebolla y ajo, patatas en cubos y suave salsa bechamel de quesos gratinada al horno con parmesano; con arroz blanco."
  },
  "dish-dion-101": {
    en: "Shredded codfish and tender wild shrimps sautéed with garlic and sweet onions, baked in luxurious creamy cheese béchamel and gratineed golden; with white rice.",
    es: "Bacalao desmigado y camarones salteados al ajillo, bañados en salsa blanca cremosa de quesos y gratinados con parmesano dorado; acompañado de arroz blanco."
  },
  "dish-dion-106": {
    en: "Prime loin of wild Gadus morhua cod confited in olive oil then charcoal-grilled, with punched potatoes, Portuguese olives, baby carrots, cherry tomatoes, bell peppers, garlic chips, and white rice.",
    es: "Lomo noble de bacalao Gadus morhua confitado en aceite de oliva y terminado a la parrilla, con patatas al puñetazo, aceitunas portuguesas, pimientos, ajo laminado y arroz blanco."
  },
  "dish-dion-107": {
    en: "Prime loin of wild Gadus morhua cod confited in olive oil then charcoal-grilled, with punched potatoes, Portuguese olives, baby carrots, cherry tomatoes, bell peppers, garlic chips, and white rice (serves 2).",
    es: "Lomo noble de bacalao Gadus morhua confitado en aceite de oliva y a la parrilla con patatas al puñetazo, aceitunas, pimientos, ajo laminado y arroz blanco (para 2 personas)."
  },
  "dish-dion-109": {
    en: "200g prime imported Black Angus picanha rump cap flame-grilled over natural charcoal with coarse rock salt; tender, juicy, and rich in flavor.",
    es: "Corte de 200g de picanha Black Angus importada a las brasas de carbón con sal gorda; sumamente tierna, jugosa y de sabor intenso."
  },
  "dish-dion-110": {
    en: "400g sharing portion of prime imported Black Angus picanha flame-grilled over natural charcoal; succulent with a crispy fat cap (serves 2).",
    es: "Porción para compartir de 400g de picanha Black Angus importada a la brasa con costra dorada de grasa crujiente y corazón jugoso (para 2 personas)."
  },
  "dish-dion-111": {
    en: "600g sharing feast of prime imported Black Angus picanha flame-grilled over intense charcoal embers (serves 3).",
    es: "Festín de 600g de picanha noble Black Angus importada a las brasas de carbón natural (para 3 personas)."
  },
  "dish-dion-112": {
    en: "800g grand family platter of prime imported Black Angus picanha flame-grilled to perfection on charcoal embers (serves 4).",
    es: "Gran fuente familiar de 800g de picanha Black Angus importada asada a la parrilla de carbón al punto deseado (para 4 personas)."
  },
  "dish-dion-116": {
    en: "300g boneless prime pork loin steak (Bife de Lombo) seasoned with herbs and lime, flame-grilled on charcoal for delicate juiciness.",
    es: "Corte noble de 300g de lomo de cerdo sin hueso sazonado con hierbas y lima, asado a la parrilla para conservar toda su jugosidad."
  },

  // Drinks with wine/drink mismatches
  "dish-dion-160": {
    en: "Refreshing European summer spritz: chilled rosé wine combined with sparkling lemon soda and a fresh orange wheel.",
    es: "Tinto de verano refrescante estilo europeo: vino rosado frío con refresco de limón con gas y una rodaja fresca de naranja."
  },
  "dish-dion-326": {
    en: "Sweet Brazilian frozen cocktail blended with red wine, fresh strawberries, strawberry ice cream, and condensed milk.",
    es: "Cóctel helado cremoso brasileño 'Espanhola': vino tinto suave batido con fresas frescas, helado de fresa y leche condensada."
  }
};

let updatedCount = 0;
const processed = items.map(item => {
  if (ACCURATE_DION_TRANSLATIONS[item.id]) {
    updatedCount++;
    return {
      ...item,
      description: {
        pt: item.description.pt,
        en: ACCURATE_DION_TRANSLATIONS[item.id].en,
        es: ACCURATE_DION_TRANSLATIONS[item.id].es
      }
    };
  }
  return item;
});

fs.writeFileSync('src/data/customerMenuData.json', JSON.stringify(processed, null, 2));
console.log(`Applied ${updatedCount} accurate, handcrafted translations to Dion dishes!`);
