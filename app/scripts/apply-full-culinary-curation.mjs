import fs from 'fs';

const items = JSON.parse(fs.readFileSync('src/data/customerMenuData.json', 'utf8'));

// 1. Specific food dictionary for all 78 dishes
const FOOD_TRANSLATIONS = {
  "dish-dion-001": {
    en: "Crisp garden greens, vine-ripened tomatoes, red onions, and fresh seasonal tropical fruit, drizzled with our signature house herb vinaigrette.",
    es: "Mix de hojas frescas de huerto, tomates maduros, cebolla roja y frutas tropicales de temporada con aderezo especial de la casa."
  },
  "dish-dion-022": {
    en: "Fresh garden salad tossed with flame-grilled jumbo shrimps, ripe mango slices, crunchy toasted Brazil nuts, and a light herb vinaigrette (320 kcal | 22g protein | 6g fiber).",
    es: "Ensalada fresca con camarones a la plancha, mango maduro en láminas, castañas de Pará tostadas y vinagreta suave de hierbas (320 kcal | 22g proteína | 6g fibra)."
  },
  "dish-dion-023": {
    en: "Crispy outside and velvety soft inside, baked in a combi-oven with artisanal tapioca and coalho cheese; served with sugar-free Amazonian cupuaçu fruit reduction (280 kcal | 8g protein).",
    es: "Dados horneados de tapioca y queso coalho, crujientes por fuera y cremosos por dentro, acompañados de jalea artesanal de copoazú sin azúcar añadida (280 kcal | 8g proteína)."
  },
  "dish-dion-026": {
    en: "Pitted seasoned green olives coated in Japanese panko breadcrumbs and flash-fried to golden perfection, served with silky roasted garlic confit aioli.",
    es: "Aceitunas verdes descarozadas y sazonadas, rebozadas en panko crujiente y fritas doradas, servidas con alioli de ajo confitado."
  },
  "dish-dion-030": {
    en: "Tender pork belly slow-braised for hours, rolled tight and finished with ultra-crisp crackling skin (pururuca), accompanied by pan-seared sweet pineapple slices.",
    es: "Panceta de cerdo cocida a fuego lento, enrollada y terminada con piel crujiente pururuca, servida con rodajas de piña selladas al fuego."
  },
  "dish-dion-031": {
    en: "21 juicy chicken hearts flame-grilled over natural charcoal embers with toasted sliced garlic and crunchy crispy onions, served on skewers for effortless sharing.",
    es: "21 jugosos corazones de pollo asados a la brasa con láminas de ajo dorado y cebolla crujiente, servidos en brochetas para compartir."
  },
  "dish-dion-032": {
    en: "Artisanal crusty baguette toasted over charcoal embers, filled with rich roasted garlic cream, melted mozzarella cheese, and fresh garden herbs.",
    es: "Pan baguette crujiente dorado a la brasa, relleno con abundante crema casera de ajo asado, queso derretido y finas hierbas."
  },
  "dish-dion-035": {
    en: "Golden Amazonian yellow cassava, steam-cooked and flash-fried until crunchy outside and fluffy inside, finished with clarified bottle butter and sea salt flakes.",
    es: "Porción de yuca amarilla regional cocida y frita al momento, crujiente por fuera y suave por dentro, terminada con mantequilla clarificada y flor de sal."
  },
  "dish-dion-036": {
    en: "Select hand-cut potatoes fried until crisp and golden brown, dry on the outside and tender inside, seasoned with fine sea salt.",
    es: "Papas seleccionadas fritas al punto dorado y crujiente, secas por fuera y tiernas por dentro, con un toque suave de sal fina."
  },
  "dish-dion-037": {
    en: "6 authentic Portuguese codfish fritters made with wild Gadus morhua, creamy potato mash, and fresh parsley, fried to golden crispness.",
    es: "6 buñuelos tradicionales portugueses de bacalao Gadus morhua con patata cremosa y perejil fresco, fritos hasta quedar dorados y crujientes."
  },
  "dish-dion-038": {
    en: "12 golden bite-sized cassava fritters, crisp on the outside and creamy inside, served with house-made caramelized onion jam infused with sugarcane molasses.",
    es: "12 bocaditos dorados de yuca crujientes por fuera y cremosos por dentro, acompañados de mermelada de cebolla caramelizada con melaza de caña."
  },
  "dish-dion-039": {
    en: "Crispy fried golden corn polenta batons, crunchy on the exterior and velvety soft inside, dusted with sea salt.",
    es: "Bastones dorados de polenta frita crujiente, secos por fuera y suaves por dentro, sazonados con un toque de sal marina."
  },
  "dish-dion-040": {
    en: "Tender shredded smoked pork shank tossed with skin-on rustic potatoes, sweet caramelized onion jam, and fragrant fresh rosemary sprigs.",
    es: "Lajas jugosas de codillo de cerdo ahumado con papas rústicas con piel, mermelada de cebolla caramelizada y romero fresco."
  },
  "dish-dion-041": {
    en: "Thick slices of artisanal coalho cheese seared on the flat-top griddle with a golden crust, drizzled with pure sugarcane molasses.",
    es: "Rebanadas gruesas de queso coalho a la plancha con costra dorada, bañadas con melaza pura de caña de azúcar."
  },
  "dish-dion-044": {
    en: "A 16-year house specialty: tender smoked pork ribs flash-fried until crackling crisp, served with our signature sweet and tart cupuaçu fruit dip.",
    es: "Especialidad de la casa desde hace 16 años: costillitas de cerdo ahumadas y fritas crujientes, acompañadas de jalea agridulce de copoazú."
  },
  "dish-dion-046": {
    en: "Mini savory tasting shot flight: choose 3 artisan comfort soups/creams from black bean, velvety pumpkin with jerked beef, or Amazonian tacacá.",
    es: "Degustación de chupitos salados calientes: elige 3 deliciosas cremas artesanales entre caldito de frijol, calabaza con carne seca o tacacá amazónico."
  },
  "dish-dion-047": {
    en: "Rich and hearty slow-simmered black bean broth served in a tasting glass, crowned with crunchy smoky bacon farofa crumble.",
    es: "Caldito espeso y aromático de frijoles negros servido en vaso de degustación, coronado con crujiente farofa de tocino ahumado."
  },
  "dish-dion-048": {
    en: "Velvety roasted pumpkin cream layered with tender shredded sun-cured beef and topped with flash-fried crispy collard greens ribbons.",
    es: "Crema aterciopelada de calabaza asada con carne seca desmechada y crujiente de col verde salteada al instante."
  },
  "dish-dion-049": {
    en: "Traditional Amazonian tacacá soup tasting: yellow tucupi broth, wild jambú leaves with their tingling sensation, and salted dried shrimps.",
    es: "Degustación de tacacá amazónico: caldo aromático de tucupí amarillo, hojas de jambú con su cosquilleo característico y camarón seco."
  },
  "dish-dion-050": {
    en: "Creamy homestyle chicken stroganoff in a velvety tomato-cream sauce, crowned with crunchy sweet potato crisps.",
    es: "Strogonoff cremoso y casero de pollo en salsa aterciopelada con champiñones, coronado con chips crujientes de camote."
  },
  "dish-dion-054": {
    en: "Crisp, flaky mini pastry pockets stuffed with tender wild shrimps sautéed in extra virgin olive oil, minced garlic, and fresh herbs.",
    es: "Mini empanadas crujientes rellenas de camarones salteados en aceite de oliva virgen extra, ajo tierno y hierbas frescas aromáticas."
  },
  "dish-dion-056": {
    en: "Spicy artisan smoked pork sausage grilled over charcoal, accompanied by fresh lime vinaigrette and golden cassava croquettes.",
    es: "Embutido picante de cerdo ahumado a la brasa, servido con reducción suave de lima y nuestras croquetas doradas de yuca."
  },
  "dish-dion-057": {
    en: "House-recipe artisan pork loin sausage flame-grilled on charcoal embers, paired with a zesty citrus dip and golden cassava fritters.",
    es: "Embutido artesanal de lomo de cerdo elaborado según receta de la casa, a la brasa, con salsa cítrica y croquetas de yuca."
  },
  "dish-dion-058": {
    en: "Curled spiral of artisan fresh sausage loaded with fiery chili peppers (extra hot!), flame-grilled and served with crispy cassava croquettes.",
    es: "Espiral de embutido fresco artesanal extra picante (¡muy intenso!), asada a la brasa y acompañada de croquetas crujientes de yuca."
  },
  "dish-dion-059": {
    en: "Authentic southern Brazilian Blumenau smoked sausage roasted over charcoal, served with house golden cassava fritters.",
    es: "Embutido artesanal ahumado estilo Blumenau a la brasa, lleno de notas ahumadas y acompañado de croquetas doradas de yuca."
  },
  "dish-dion-063": {
    en: "200g prime VPJ Black Angus patty on a toasted brioche bun with smoked pork shank slices, melted mozzarella, crisp lettuce, tomato, and pickled red onions; served with fries.",
    es: "Hamburguesa gourmet Black Angus VPJ de 200g en pan brioche con lascas de codillo ahumado, queso derretido, lechuga, tomate y encurtido de cebolla morada; servida con papas fritas."
  },
  "dish-dion-064": {
    en: "Two seared Black Angus smashed beef patties layered with melted creamy English cheddar and caramelized sweet onion jam on a buttery brioche bun; with fries.",
    es: "Doble hamburguesa Black Angus a la plancha con abundante queso cheddar cremoso derretido y mermelada de cebolla caramelizada en pan brioche; con papas."
  },
  "dish-dion-066": {
    en: "The purist classic: juicy grilled VPJ Black Angus beef patty and melted American cheese on a toasted golden brioche bun; served with fries.",
    es: "La clásica hamburguesa pura: carne jugosa Black Angus a la parrilla y queso americano fundido en suave pan brioche tostado; con papas fritas."
  },
  "dish-dion-067": {
    en: "Shaved green and purple cabbage, wild arugula, julienne carrots, and sweet cherry tomatoes tossed in creamy garlic-parsley aioli.",
    es: "Col verde y morada finamente cortada con rúcula fresca, zanahoria y tomates cherry, aliñada con mayonesa cremosa de ajo y perejil."
  },
  "dish-dion-068": {
    en: "Quick-seared shredded collard greens, crispy smoky bacon lardons, thin red onion rings, and sweet cherry tomatoes, topped with chilled Greek yogurt dressing.",
    es: "Hojas tiernas de col salteadas al fuego vivo con tocino crujiente, cebolla morada, tomates cherry y aderezo especial cremoso de yogur."
  },
  "dish-dion-069": {
    en: "Crisp greens, peppery arugula, bowtie farfalle pasta, and fresh buffalo mozzarella pearls dressed with Sicilian lemon, olive oil, and sweet caramelized onions.",
    es: "Hojas verdes frescas, rúcula silvestre, pasta farfalle y perlas de mozzarella de búfala con limón siciliano, aceite de oliva virgen y cebolla caramelizada."
  },
  "dish-dion-070": {
    en: "Crisp romaine hearts, herb-toasted golden croutons, and aged Grana Padano parmesan ribbons tossed in creamy authentic anchovy-garlic Caesar dressing.",
    es: "Lechuga romana fresca, picatostes crujientes con hierbas y finas lascas de parmesano curado con el aderezo César tradicional de la casa."
  },
  "dish-dion-071": {
    en: "Handmade tender chicken breast tenders, lightly seasoned and breaded crispy golden; choose 3 sides (fluffy rice, angel hair pasta, mashed potatoes, fries, or beans).",
    es: "Fingers tiernos de pechuga de pollo 100% natural, rebozados y fritos dorados; elige 3 guarniciones (arroz blanco, pasta cabello de ángel, puré, papas fritas o frijoles)."
  },
  "dish-dion-074": {
    en: "Delicate angel hair pasta topped with rich, slow-simmered prime minced beef and vine-ripened tomato sauce, dusted with parmesan cheese.",
    es: "Fina pasta cabello de ángel servida con ragú tradicional de carne vacuna picada y salsa casera de tomates maduros con queso parmesano."
  },
  "dish-dion-076": {
    en: "Traditional cast-iron skillet shepherd's pie: savory shredded sun-cured jerked beef braised with garden vegetables under a velvety cassava purée gratin.",
    es: "Escondidinho tradicional en caldero de hierro: carne seca desmechada estofada con hortalizas frescas bajo una suave capa gratinada de puré de yuca."
  },
  "dish-dion-078": {
    en: "Flaked wild Portuguese codfish sautéed with sweet bell peppers, onions, and extra virgin olive oil, baked under a creamy golden cassava crust.",
    es: "Lajas de bacalao desalado salteadas con pimientos dulces, cebolla y aceite de oliva, cubiertas de puré de yuca y gratinadas al horno."
  },
  "dish-dion-079": {
    en: "Tender wild shrimps braised with sweet onions, fresh cilantro, and coconut milk, topped with rich cassava purée and gratineed with bubbling mozzarella.",
    es: "Camarones tiernos salteados con cebolla fresca, cilantro y un toque de leche de coco, bajo puré cremoso de yuca gratinado al horno."
  },
  "dish-dion-080": {
    en: "Tasting duo of piping-hot cast-iron cassava shepherd’s pies (choose any 2: Jerked Beef, Wild Codfish, or Sautéed Shrimps) with bubbling melted cheese.",
    es: "Dúo de calderitos de hierro a elegir (Carne Seca, Bacalao o Camarones), servidos recién gratinados con queso derretido dorado."
  },
  "dish-dion-082": {
    en: "Rich and creamy braised oxtail risotto-style rice simmered in its own decadent wine reduction with shredded tender meat and fresh peppery wild arugula.",
    es: "Arroz meloso cocinado en la propia reducción aromática del rabo de toro estofado a fuego lento, con carne desmechada tierna y rúcula fresca."
  },
  "dish-dion-084": {
    en: "Al dente spaghetti tossed in a velvety egg yolk and parmesan sauce, crowned with crispy bits of slow-smoked crackling pork shank.",
    es: "Spaghetti al dente con salsa cremosa tradicional de yemas de huevo y queso curado, enriquecida con trozos crujientes de codillo ahumado."
  },
  "dish-dion-087": {
    en: "Melt-in-your-mouth slow-braised beef tongue in a rich brown gravy reduction, served with pan-dripping rice (arroz ferrugem) and crunchy toasted onion farofa.",
    es: "Lengua vacuna estofada lentamente hasta quedar tierna como mantequilla en su propia salsa espesa, con arroz tostado al jugo y farofa crujiente de cebolla."
  },
  "dish-dion-102": {
    en: "Fresh artisanal fettuccine tossed with skillet-flambéed jumbo shrimps in a luxurious four-cheese cream sauce, finished with aged grated parmesan.",
    es: "Fettuccine fresco artesanal con camarones flambeados en coñac, envueltos en cremosa salsa de cuatro quesos y parmesano recién rallado."
  },
  "dish-dion-103": {
    en: "Succulent wild shrimps flash-sautéed in extra virgin olive oil and fragrant garlic, served over aromatic Pará rice with jambú greens and tucupi.",
    es: "Camarones salteados al ajillo en aceite de oliva virgen, servidos con aromático arroz paraense cocinado con hojas de jambú y tucupí."
  },
  "dish-dion-104": {
    en: "Sharing platter of wild shrimps sautéed with garlic and virgin olive oil, accompanied by fragrant Pará rice with jambú greens and tucupi reduction (serves 2).",
    es: "Plato para compartir de camarones al ajillo en aceite de oliva, acompañados de arroz paraense aromático con jambú y tucupí (para 2 personas)."
  },
  "dish-dion-105": {
    en: "Italian durum wheat spaghetti tossed with sautéed sweet shrimps, sun-dried tomatoes, fresh peppery arugula, and a delicate pomodoro touch.",
    es: "Espaguetis de trigo duro salteados con camarones, tomates secos, rúcula fresca silvestre y un toque suave de salsa de tomate casera."
  },
  "dish-dion-108": {
    en: "250g prime cut of center top sirloin (Baby Beef Black Angus), flame-grilled over natural charcoal embers; exceptionally tender, juicy, and delicate.",
    es: "Corte noble de 250g de corazón de cuadril (Baby Beef Black Angus) a las brasas de carbón; de textura sumamente tierna, suave y jugosa."
  },
  "dish-dion-113": {
    en: "300g prime Black Angus flank steak (fraldinha) grilled over intense hardwood embers; prized for its long grain, deep beefy flavor, and rich juices.",
    es: "Corte de vacío (fraldinha) Black Angus de 300g a la parrilla; apreciado por sus fibras largas, gran infiltración de grasa y sabor intenso e inconfundible."
  },
  "dish-dion-114": {
    en: "300g Black Angus tri-tip steak (maminha) seared over hot coals; delicate muscle fibers with fine marbling deliver unmatched tenderness in every slice.",
    es: "Colita de cuadril (maminha) Black Angus de 300g a la brasa; fibras delicadas con marmoleo equilibrado que garantizan ternura y jugosidad extraordinaria."
  },
  "dish-dion-115": {
    en: "300g traditional Brazilian humped beef steak (cupim), slow-roasted and finished over natural charcoal; deeply marbled, buttery-soft, and richly flavored.",
    es: "Corte tradicional brasileño de joroba vacuna (cupim) de 300g, asado lentamente a la brasa; marmoleo intramuscular denso que se deshace en la boca."
  },
  "dish-dion-117": {
    en: "300g American cut prime Black Angus striploin steak flame-broiled on charcoal; dense marbling, short tender fibers, and a rich caramelized crust.",
    es: "Bife de chorizo americano Black Angus de 300g asado a fuego vivo; fibras cortas, veteado perfecto y costra dorada que encierra todos sus jugos."
  },
  "dish-dion-118": {
    en: "Individual side platter: hearty feijão tropeiro with pork sausage, biro-biro steakhouse rice, homestyle creamy potato salad, cassava farofa, and fresh vinaigrette.",
    es: "Guarnición completa individual: frijol tropeiro con embutido, arroz biro-biro con tocino y huevo, ensaladilla cremosa de papas, farofa y vinagreta fresca."
  },
  "dish-dion-119": {
    en: "Sharing side platter (serves 2): feijão tropeiro with artisanal sausage, biro-biro rice, creamy potato salad, house farofa, and fresh tomato vinaigrette.",
    es: "Guarnición para compartir (para 2): frijol tropeiro con embutidos, arroz biro-biro con huevo y tocino, ensaladilla de papas, farofa y vinagreta fresca."
  },
  "dish-dion-120": {
    en: "Individual Northeastern platter: creamy baião de dois (rice, cowpeas & coalho cheese in bottle butter), golden crispy fried cassava, farofa, and vinaigrette.",
    es: "Guarnición nordestina individual: baião de dois cremoso con frijol de corda y queso coalho, yuca frita dorada crujiente, farofa y vinagreta."
  },
  "dish-dion-121": {
    en: "Sharing Northeastern platter (serves 2): creamy baião de dois with coalho cheese, golden fried cassava chunks, house farofa, and tomato vinaigrette.",
    es: "Guarnición nordestina para compartir (para 2): baião de dois cremoso con queso coalho, trozos de yuca dorada frita, farofa tostada y vinagreta fresca."
  },
  "dish-dion-122": {
    en: "Individual Amazonian side platter: creamy baião de dois, sweet and crunchy caramelized plantain farofa made with crisp Uarini flour, and fresh vinaigrette.",
    es: "Guarnición amazónica individual: baião de dois cremoso, farofa dulce de plátano caramelizado con harina crujiente de Uarini y vinagreta fresca."
  },
  "dish-dion-123": {
    en: "Sharing Amazonian side platter (serves 2): creamy baião de dois, sweet plantain farofa made with crisp Uarini cassava flour, and tangy tomato vinaigrette.",
    es: "Guarnición amazónica para compartir (para 2): baião de dois con queso, farofa de plátano caramelizado con harina de Uarini y vinagreta fresca."
  },
  "dish-dion-124": {
    en: "Individual Minas Gerais feast: creamy black bean tutu paste with bacon, crispy fried polenta batons, garlic-sautéed white rice, farofa, and vinaigrette.",
    es: "Guarnición tradicional de Minas individual: puré tutu de frijoles negros con tocino, polenta dorada frita, arroz al ajillo, farofa y vinagreta."
  },
  "dish-dion-125": {
    en: "Sharing Minas Gerais platter (serves 2): creamy bean tutu with bacon, golden fried polenta sticks, fragrant garlic rice, house farofa, and vinaigrette.",
    es: "Guarnición tradicional de Minas para compartir (para 2): tutu de frijoles negros, bastones crujientes de polenta, arroz con ajo, farofa y vinagreta."
  },
  "dish-dion-126": {
    en: "Fluffy Brazilian long-grain white rice steamed to perfection with a hint of garlic and virgin olive oil.",
    es: "Porción de arroz blanco suave de grano largo, cocinado al punto perfecto con un toque aromático de ajo y aceite de oliva."
  },
  "dish-dion-127": {
    en: "Fluffy steakhouse rice tossed with golden crispy bacon lardons, buttery scrambled eggs, shoestring potatoes, and fresh scallions.",
    es: "Arroz salteado estilo asador brasileño con tocino crujiente, huevos revueltos con mantequilla, papas hilo finas y cebollino fresco."
  },
  "dish-dion-128": {
    en: "Authentic creamy baião de dois: cowpea beans and white rice braised with melted coalho cheese cubes, clotted cream, and clarified bottle butter.",
    es: "Plato tradicional de baião cremoso: arroz y frijoles de corda cocinados con dados de queso coalho fundido, nata fresca y mantequilla clarificada."
  },
  "dish-dion-129": {
    en: "Sweet ripe plantain slices pan-fried until golden brown with caramelized edges, tender and naturally sweet.",
    es: "Rodajas de plátano maduro fritas al momento hasta dorar y caramelizar, tiernas, jugosas y naturalmente dulces."
  },
  "dish-dion-130": {
    en: "Moist and savory toasted cassava farofa tossed with fluffy scrambled farm eggs, clarified bottle butter, and fresh scallions.",
    es: "Farofa suave y húmeda de harina de yuca tostada con huevos revueltos en mantequilla clarificada y cebollino picado."
  },
  "dish-dion-131": {
    en: "Toasted pearl-grain Amazonian Uarini cassava flour crisp-fried in butter with caramelized ripe sweet plantain pieces.",
    es: "Harina crujiente de yuca de Uarini salteada en mantequilla con trocitos de plátano maduro dulce caramelizado."
  },
  "dish-dion-132": {
    en: "Golden toasted Brazilian cassava flour sautéed with butter, sweet golden onions, and a touch of house seasonings.",
    es: "Farofa dorada tradicional de harina de yuca tostada a la mantequilla con cebolla caramelizada y especias de la casa."
  },
  "dish-dion-133": {
    en: "Bright and zesty salsa vinaigrette with hand-diced ripe vine tomatoes, crisp sweet onions, fresh parsley, extra virgin olive oil, and wine vinegar.",
    es: "Vinagreta fresca casera con dados de tomate maduro, cebolla dulce finamente picada, aceite de oliva virgen extra y perejil fresco."
  },
  "dish-dion-134": {
    en: "Homestyle Brazilian potato salad: tender potato cubes folded into creamy house herb aioli with crisp scallions and subtle mustard notes.",
    es: "Ensaladilla casera de papas: dados tiernos de patatas cocidas con mayonesa suave de hierbas, cebollino fresco y un ligero toque de mostaza."
  },
  "dish-dion-137": {
    en: "Silky and refreshing Brazilian passion fruit mousse with a vibrant sweet-tart balance, crowned with freshly reduced seed fruit glaze.",
    es: "Mousse ligera y aterciopelada de maracuyá brasileño con un equilibrio ácido-dulce perfecto, coronada con reducción de la propia fruta."
  },
  "dish-dion-138": {
    en: "Creamy wild Amazonian cupuaçu mousse offering a delicate floral tang, layered over a crunchy toasted Brazil nut crumble.",
    es: "Mousse sedosa de copoazú silvestre amazónico de acidez aromática y refrescante, decorada con crumble crujiente de castañas de Pará."
  },
  "dish-dion-139": {
    en: "Warm dark chocolate lava cake with an oozing molten center, paired with a scoop of premium Bourbon vanilla gelato and chocolate drizzle.",
    es: "Volcán tibio de chocolate negro con corazón líquido fundente, acompañado de una bola de helado artesanal de vainilla y coulis de cacao."
  },
  "dish-dion-140": {
    en: "The iconic Brazilian milk flan: ultra-smooth, velvety custard without air holes that melts on the tongue under glistening golden caramel sauce.",
    es: "El icónico flan brasileño de leche condensada: textura perfectamente lisa y sedosa que se funde en la boca con caramelo dorado brillante."
  },
  "dish-dion-141": {
    en: "Rich and decadent custard flan crafted from slow-cooked farmstead dulce de leche, drenched in deep amber caramel syrup.",
    es: "Flan artesanal suntuoso y denso preparado con dulce de leche de hacienda cocido a fuego lento y bañado en caramelo ámbar."
  },
  "dish-dion-142": {
    en: "Silky traditional Brazilian coconut blancmange infused with coconut milk, served chilled under rich black plum and red wine reduction compote.",
    es: "Manjar blanco tradicional de leche de coco fresca, servido frío con compota casera espesa de ciruelas negras en almíbar."
  },
  "dish-dion-143": {
    en: "Deconstructed Romeo & Juliet: warm artisanal red guava paste reduction paired with artisanal farmhouse cheese ice cream and crispy wafers.",
    es: "Romeo y Julieta deconstruido: dulce artesanal de guayaba roja caliente servido con helado cremoso de queso artesanal y crocante."
  },
  "dish-dion-144": {
    en: "Chilled layer cake with roasted pineapple mousse over a buttery biscuit crust, topped with glazed pineapple cubes and toasted coconut.",
    es: "Tarta helada de crema de piña asada sobre base de galleta con mantequilla, coronada con dados de piña glaseada y coco rallado."
  },
  "dish-dion-147": {
    en: "Charcoal-grilled artisanal pork sausage split on crusty bakery bread, topped with zesty fresh herb and garlic chimichurri vinaigrette.",
    es: "Choripán tradicional: embutido artesanal de cerdo dorado a las brasas en pan crujiente recién horneado, aderezado con chimichurri casero."
  },
  "dish-dion-149": {
    en: "70g of thin-sliced tender roast beef, peppery wild arugula, pickled cucumbers, vine tomatoes, and seared coalho cheese on crusty artisanal bread.",
    es: "70g de rosbif tierno cortado fino, rúcula fresca, pepinillos encurtidos, tomate y finas láminas de queso coalho a la plancha en pan artesanal crujiente."
  },
  "dish-dion-150": {
    en: "Generous cuts of peppered and slow-smoked beef brisket pastrami layered with house mustard on wholesome whole-grain artisanal bread.",
    es: "Pastrami curado y ahumado lentamente de pecho de res especiado con pimienta, servido con mostaza suave en pan rústico integral."
  }
};

// 2. Specific drink description resolver
function resolveDrinkDescription(item) {
  const name = item.name.pt.toLowerCase();
  const sub = item.subcategory;

  // Chopp & Cervejas
  if (name.includes('sujo') || name.includes('escarchado')) {
    return {
      en: "Ice-cold draft beer poured into a chilled mug heavily rimmed with sea salt and fresh lime juice for the ultimate thirst quencher.",
      es: "Chopp helado tirado en tarro escarchado con sal marina y zumo de lima recién exprimido para el máximo frescor."
    };
  }
  if (name.includes('heineken') && sub.includes('CHOPP')) {
    return {
      en: "Crisp and refreshing Heineken 100% pure malt draft, poured with a dense, creamy foam head into a frozen glass.",
      es: "Chopp Heineken 100% puro malta bien frío, servido con una corona de espuma blanca densa y cremosa en vaso helado."
    };
  }
  if (name.includes('amstel') && sub.includes('CHOPP')) {
    return {
      en: "Golden European lager draft poured crisp and cold with a delicate malt aroma, refreshing bitterness, and smooth finish.",
      es: "Chopp rubio Amstel lager europeo tirado al momento, ligero, equilibrado y con un final suave y refrescante."
    };
  }
  if (sub.includes('CERVEJA')) {
    return {
      en: "Premium bottled beer brewed with select barley malt and aroma hops, chilled to ice-cold temperatures.",
      es: "Cerveza embotellada premium elaborada con malta de cebada seleccionada y lúpulos aromáticos, servida bien fría."
    };
  }

  // Caipirinhas
  if (sub.includes('CAIPIRINHA')) {
    return {
      en: "Iconic Brazilian cocktail muddled with fresh juicy limes, pure cane sugar, and artisanal pot-still cachaça, shaken over crushed ice.",
      es: "Cóctel insignia brasileño preparado con lima fresca machacada, azúcar de caña y cachaça artesanal de alambique, agitado con hielo picado."
    };
  }

  // Caipiroscas
  if (sub.includes('CAIPIROSCAS')) {
    return {
      en: "Modern Brazilian cocktail featuring fresh muddled seasonal fruit, crystal cane sugar, and premium triple-distilled vodka over crushed ice.",
      es: "Cóctel brasileño moderno con fruta fresca tropical machacada, azúcar y vodka destilado de alta pureza servido con hielo frappé."
    };
  }

  // Gin Tonics & Drinks Monster
  if (sub.includes('GIN') || sub.includes('MONSTER') || sub.includes('TRADICIONAIS') || name.includes('gin')) {
    return {
      en: "Artisanal cocktail blended with fragrant botanical London Dry gin, premium tonic water, citrus slices, and fresh garden herbs.",
      es: "Cóctel artesanal elaborado con ginebra botánica de alta gama, tónica premium, rodajas cítricas y hierbas frescas aromáticas."
    };
  }

  // Drinks sem álcool
  if (sub.includes('SEM ÁLCOOL')) {
    return {
      en: "Refreshing mocktail shaken with tropical fruit purees, sparkling citrus soda, and fresh herbs over crushed ice.",
      es: "Mocktail refrescante sin alcohol elaborado con puré de frutas tropicales, refresco cítrico burbujeante y hierbas frescas."
    };
  }

  // Doses & Cachaças
  if (name.includes('jambucana') || name.includes('jambu')) {
    return {
      en: "Artisanal Amazonian rainforest cachaça infused with native jambú leaves, known for its pleasant electric tingling sensation on the palate.",
      es: "Cachaça artesanal amazónica infusionada con flor de jambú, famosa por su agradable y electrizante cosquilleo en los labios."
    };
  }
  if (name.includes('cachaça') || name.includes('manaos') || name.includes('weber') || name.includes('salinas') || name.includes('seleta') || name.includes('santo grau')) {
    return {
      en: "Artisanal copper-distilled Brazilian cachaça aged in noble wooden casks (Oak, Umburana, Balsam), offering warm notes of sugarcane, toasted wood, and vanilla.",
      es: "Cachaça brasileña de alambique de cobre añejada en barricas de maderas nobles, con notas aromáticas de caña dulce, roble tostado y vainilla."
    };
  }
  if (sub.includes('DOSES DIVERSAS')) {
    return {
      en: "Single premium pour (50ml) of select spirit, served neat, on the rocks, or with a twist of citrus.",
      es: "Medida individual (50ml) de destilado premium seleccionado, servido solo, con hielo o con un toque cítrico."
    };
  }

  // Cafés & Quentes
  if (sub.includes('CAFÉ') || name.includes('cappuccino') || name.includes('expresso') || name.includes('chá')) {
    if (name.includes('chá')) {
      return {
        en: "Soothing hot herbal infusion brewed from selected natural leaves and flowers, fragrant and relaxing.",
        es: "Infusión caliente relajante elaborada con hojas y flores secas naturales seleccionadas, aromática y digestiva."
      };
    }
    if (name.includes('cappuccino')) {
      return {
        en: "Rich espresso blended with silky steamed whole milk and topped with dense milk froth and a dusting of fine chocolate.",
        es: "Café espresso aromático combinado con leche vaporizada y coronado con densa espuma y un toque de cacao fino."
      };
    }
    return {
      en: "Freshly extracted 100% Arabica espresso with a velvety golden crema, rich body, and lingering notes of dark cocoa.",
      es: "Café espresso 100% arábica recién extraído a alta presión, con crema espesa y notas aromáticas de cacao."
    };
  }

  // Sucos & Bebidas Diversas
  if (sub.includes('SUCOS') || name.includes('suco')) {
    return {
      en: "Freshly squeezed pure fruit juice made from ripe tropical fruit, served chilled and revitalizing.",
      es: "Zumo natural recién exprimido de fruta tropical madura seleccionada, servido frío y revitalizante."
    };
  }
  if (sub.includes('BEBIDAS DIVERSAS')) {
    return {
      en: "Chilled bottled or canned refreshment served with ice and fresh lemon slices.",
      es: "Bebida refrescante bien fría servida con hielo y rodaja de limón fresco."
    };
  }

  // Vinhos & Espumantes
  if (sub.includes('ESPUMANTES') || name.includes('espumante') || name.includes('chandon') || name.includes('prosecco')) {
    return {
      en: "Celebratory sparkling wine crafted with fine, persistent bubbles, vibrant citrus aromas, and refreshing crisp acidity.",
      es: "Espumante festivo de burbuja fina y persistente, con elegantes aromas cítricos y acidez viva y refrescante."
    };
  }
  if (sub.includes('PORTO') || name.includes('porto')) {
    return {
      en: "Traditional Portuguese fortified Port wine aged in oak barrels, delivering rich notes of dried figs, raisins, and sweet spice.",
      es: "Vino de Oporto fortificado tradicional envejecido en barricas de roble, con ricas notas de higos secos, pasas y especias."
    };
  }
  if (sub.includes('BRANCO') || sub.includes('VERDES') || name.includes('sauvignon') || name.includes('chardonnay') || name.includes('torrontés')) {
    return {
      en: "Crisp and elegant white wine with expressive floral and citrus aromas, lively acidity, and a clean, refreshing mineral finish.",
      es: "Vino blanco fresco y elegante con aromas florales y cítricos, viva acidez y un final mineral limpio y refrescante."
    };
  }
  if (sub.includes('ROSÉ') || name.includes('rosé') || name.includes('rose')) {
    return {
      en: "Dry and refreshing rosé wine featuring bright notes of wild red berries, fresh cherries, and balanced crisp acidity.",
      es: "Vino rosado seco y refrescante con notas brillantes de frutos rojos silvestres y un equilibrio cítrico vibrante."
    };
  }
  if (sub.includes('TINTOS') || item.category === 'VINHOS_ESPUMANTES' || name.includes('malbec') || name.includes('cabernet') || name.includes('syrah')) {
    return {
      en: "Selected estate red wine exhibiting deep ruby color, ripe red berry aromas, subtle oak spice, and supple, velvety tannins.",
      es: "Vino tinto seleccionado de color rubí profundo, con aromas de frutos rojos maduros, especias de roble y taninos suaves y aterciopelados."
    };
  }

  return {
    en: "Carefully selected house beverage, served chilled to the ideal temperature for maximum enjoyment.",
    es: "Bebida seleccionada de la casa, servida a la temperatura ideal para disfrutar de su frescura."
  };
}

let foodCount = 0;
let drinkCount = 0;

const updatedItems = items.map(item => {
  let descEN = item.description.en;
  let descES = item.description.es;

  // Check if item is in our specific FOOD_TRANSLATIONS dictionary
  if (FOOD_TRANSLATIONS[item.id]) {
    descEN = FOOD_TRANSLATIONS[item.id].en;
    descES = FOOD_TRANSLATIONS[item.id].es;
    foodCount++;
  } else if (
    descEN.includes('Delicately prepared using prime ingredients') ||
    descEN.includes('following the highest culinary standards') ||
    descEN.includes('Prepared with fresh artisanal ingredients')
  ) {
    // It's a drink, wine, or remaining item that was templated
    const resolved = resolveDrinkDescription(item);
    descEN = resolved.en;
    descES = resolved.es;
    drinkCount++;
  }

  return {
    ...item,
    description: {
      pt: item.description.pt,
      en: descEN,
      es: descES
    }
  };
});

fs.writeFileSync('src/data/customerMenuData.json', JSON.stringify(updatedItems, null, 2));

console.log(`Updated ${foodCount} food items with handcrafted culinary translations!`);
console.log(`Updated ${drinkCount} beverage/wine items with category-tailored descriptions!`);

// Final verification: ensure 0 items have generic boilerplate
const remainingGeneric = updatedItems.filter(i => 
  i.description.en.includes('Delicately prepared using prime ingredients') ||
  i.description.en.includes('following the highest culinary standards') ||
  i.description.en.includes('Prepared with fresh artisanal ingredients')
);

console.log('REMAINING GENERIC ITEMS:', remainingGeneric.length);

